import css from "../css/main.css";
import track from "../text-to-speech/slice-4d.mp3";

import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';

import * as CONTROLLERS from '../libs/controllers.js';
import * as SPHERES from "../libs/SphereHandler.js"
import * as BUTTONS from "../libs/buttons";
import * as LIGHTS from "../libs/lights";
import * as AUDIO from "../libs/audio";

import { camera, scene, renderer, controls, clock } from "./index";

let S;

let params = {
    N: 1,
    quality: 7,
    dimension: 4,
    d4: { cur: 0, min: -1, max: 1 },
    lut: 'None',
}

async function main() {
    await NDDEMPhysics();

    LIGHTS.add_default_lights(scene);

    SPHERES.add_spheres(S, params, scene)

    const base_geometry = new THREE.PlaneGeometry(10, 10);
    const base_material = new THREE.MeshBasicMaterial({ color: 0x333333, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(base_geometry, base_material);
    plane.rotateX(Math.PI / 2.);
    plane.remove_me = true;
    scene.add(plane);

    var gui = new GUI();
    gui.add(params.d4, 'cur').min(params.d4.min).max(params.d4.max).step(0.01).listen().name('Slice');
    gui.open();

    AUDIO.play_track('slice-4d.mp3', camera, 5000);

    BUTTONS.add_scene_change_button('menu', 'Main menu', controls, scene, [-1, 1, 1], 0.25, [0, Math.PI / 4, 0]);
    BUTTONS.add_scene_change_button('rotation-3d', 'Rotation in 3D', controls, scene, [1, 1, 1], 0.25, [0, -Math.PI / 4, 0]);

    renderer.setAnimationLoop(update);
}

function update() {
    if (controls !== undefined) { controls.update(); }
    params = CONTROLLERS.moveInD4(params, controls);
    SPHERES.move_spheres(S, params);
    renderer.render(scene, camera);
    console.log('hi')

}

export function init() {
    SPHERES.createNDParticleShader(params).then(main());
}

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
};

async function NDDEMPhysics() {

    if ('DEMCGND' in window === false) {

        console.error('NDDEMPhysics: Couldn\'t find DEMCGND.js');
        return;

    }

    await DEMCGND().then((NDDEMCGLib) => {
        if (params.dimension == 3) {
            S = new NDDEMCGLib.DEMCG3D(params.N);
        }
        else if (params.dimension == 4) {
            S = new NDDEMCGLib.DEMCG4D(params.N);
        }
        else if (params.dimension == 5) {
            S = new NDDEMCGLib.DEMCG5D(params.N);
        }
        setup_NDDEM();
    });

}

function setup_NDDEM() {
    S.simu_interpret_command("dimensions " + String(params.dimension) + " " + String(params.N));
    S.simu_interpret_command("radius -1 0.5");
    S.simu_interpret_command("mass -1 1");
    S.simu_interpret_command("auto rho");
    S.simu_interpret_command("auto radius uniform 0.5 0.5");
    S.simu_interpret_command("auto mass");
    S.simu_interpret_command("auto inertia");
    S.simu_interpret_command("auto skin");

    S.simu_interpret_command("location 0 0 0 1.6 0");

    // S.simu_interpret_command("boundary 0 WALL -" + String(params.L) + " " + String(params.L));
    // S.simu_interpret_command("boundary 1 WALL -" + String(params.L) + " " + String(params.L));
    // S.simu_interpret_command("boundary 2 WALL -" + String(0) + " " + String(2*params.H));
    // if (params.gravity === true) {
    // S.simu_interpret_command("gravity 0 0 " + String(-9.81) + "0 ".repeat(params.dimension - 3))
    // }
    // else {
    // S.simu_interpret_command("gravity 0 0 0 " + "0 ".repeat(params.dimension - 3))
    // }
    // S.simu_interpret_command("auto location randomsquare");
    // S.simu_interpret_command("auto location randomdrop");

    // let tc = 1e-3;
    // let rest = 0.2; // super low restitution coeff to dampen out quickly
    // let min_particle_mass = params.particle_density * 4. / 3. * Math.PI * Math.pow(params.r_min, 3);
    // let vals = SPHERES.setCollisionTimeAndRestitutionCoefficient(tc, rest, min_particle_mass);
    // S.simu_interpret_command("set Kn " + String(vals.stiffness));
    // S.simu_interpret_command("set Kt " + String(0.8*vals.stiffness));
    // S.simu_interpret_command("set GammaN " + String(vals.dissipation));
    // S.simu_interpret_command("set GammaT " + String(vals.dissipation));

    // let bulk_modulus = 1e6;
    // let poisson_coefficient = 0.5;
    // let tc = SPHERES.getHertzCriticalTimestep(bulk_modulus, poisson_coefficient, params.r_min, params.particle_density);
    // S.simu_interpret_command("set Kn " + String(bulk_modulus));
    // S.simu_interpret_command("set Kt " + String(0.8*bulk_modulus));
    // S.simu_interpret_command("set GammaN 0.2"); //+ String(vals.dissipation));
    // S.simu_interpret_command("set GammaT 0.2"); //+ String(vals.dissipation));
    // S.simu_interpret_command("ContactModel Hertz");

    // S.simu_interpret_command("set Mu " + String(params.friction_coefficient));
    // S.simu_interpret_command("set Mu_wall 0");
    // S.simu_interpret_command("set T 150");
    // S.simu_interpret_command("set dt " + String(tc / 20));
    // S.simu_interpret_command("set tdump 1000000"); // how often to calculate wall forces

    S.simu_finalise_init();
}