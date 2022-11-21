import css from "../css/main.css";
import track from "../text-to-speech/index.mp3";
// import * as DEMCGND from "../resources/DEMCGND.js";

import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
// import ImmersiveControls from '@depasquale/three-immersive-controls';

import * as CONTROLLERS from '../libs/controllers.js';
import * as SPHERES from "../libs/SphereHandler.js"
import * as WALLS from "../libs/WallHandler.js"
import * as BUTTONS from "../libs/buttons";
import * as GRAPHS from "../libs/graphs";
import * as AUDIO from "../libs/audio";
import * as LIGHTS from "../libs/lights";

import { camera, scene, renderer, controls, clock, apps } from "./index";

let S;

export let params = {
    dimension: 4,
    boxratio: 1,
    // initial_packing_fraction: 0.01,
    N: 500,
    epsilonv: 0,
    gravity: false,
    paused: false,
    H_cur: 0,
    pressure_set_pt: 1e4,
    deviatoric_set_pt: 0,
    d4: { cur: 0, min: -2.5, max: 2.5 },
    // r_max: 0.0033,
    // r_min: 0.0027,
    r_max: 0.12,
    r_min: 0.11,
    // freq: 0.05,
    new_line: false,
    loading_rate: 0.01,
    // max_vertical_strain: 0.3,
    target_stress: 1e7,
    unloading_stress: 100,
    lut: 'None',
    quality: 6,
    vmax: 1, // max velocity to colour by
    omegamax: 20, // max rotation rate to colour by
    loading_active: false,
    particle_density: 2700, // kg/m^3
    particle_opacity: 1,
    audio: false,
    F_mag_max: 1e6,
    friction_coefficient: 0.5,
    initial_speed: 5,
}

function set_derived_properties() {
    params.average_radius = (params.r_min + params.r_max) / 2.;
    params.thickness = 0.0001;//params.average_radius;

    params.particle_volume = Math.PI * Math.PI * Math.pow(params.average_radius, 4) / 2.;
    console.log('estimate of particle volume: ' + params.particle_volume * params.N)
    params.particle_mass = params.particle_volume * params.particle_density;
    // params.L = Math.pow(params.particle_volume * params.N / params.initial_packing_fraction / params.boxratio, 1. / 3.) / 2.;
    params.L = 2.5;
    params.H = params.L * params.boxratio;

    params.L_cur = params.L;
    params.H_cur = params.H;
}


export function init() {
    SPHERES.createNDParticleShader(params).then(main());
}

async function main() {
    set_derived_properties();
    await NDDEMPhysics();

    const base_geometry = new THREE.PlaneGeometry(params.L, params.L);
    const base_material = new THREE.MeshBasicMaterial({ color: 0x333333, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(base_geometry, base_material);
    plane.rotateX(Math.PI / 2.);
    plane.position.y = -0.5 * params.r_min;
    scene.add(plane);

    // const hemiLight = new THREE.AmbientLight();
    // hemiLight.intensity = 0.35;
    // // hemiLight.castShadow = true;
    // // scene.add(hemiLight);

    // const dirLight = new THREE.PointLight();
    // dirLight.position.set(0, 1, 2);
    // dirLight.castShadow = true;
    // // dirLight.shadow.camera.zoom = 2;
    // scene.add(dirLight);
    LIGHTS.add_default_lights(scene);

    WALLS.add_cuboid_walls(params);
    WALLS.walls.rotateX(-Math.PI / 2.); // fix y/z up compared to NDDEM
    WALLS.walls.rotateZ(Math.PI); // fix y/z up compared to NDDEM
    WALLS.walls.position.y = params.H;
    scene.add(WALLS.walls);
    WALLS.update_isotropic_wall(params, S);
    // WALLS.add_scale(params);
    WALLS.walls.children.forEach((w) => {
        if (w.type === 'Mesh') {
            w.material.wireframe = false;
            w.material.side = THREE.DoubleSide;
            // w.material.color
        }
    });
    WALLS.add_shadows();

    SPHERES.add_spheres(S, params, scene);
    SPHERES.add_shadows();

    WALLS.update_isotropic_wall(params, S);

    // BUTTONS.add_scene_change_button(apps.list[apps.current - 1].url, apps.list[apps.current - 1].name, controls, scene, [-1, 1, 1], 0.25, [0, Math.PI / 4, 0]);
    setTimeout(() => {BUTTONS.add_scene_change_button(apps.list[apps.current + 1].url, apps.list[apps.current + 1].name, controls, scene, [1, 1, 1], 0.25, [0, -Math.PI / 4, 0])}, 40000);

    let offset = 0.2;

    renderer.setAnimationLoop(function () {
        SPHERES.move_spheres(S, params);
        S.simu_step_forward(5);

        if (controls.player.position.x < -params.L + offset) { controls.player.position.x = -params.L + offset; }
        else if (controls.player.position.x > params.L - offset) { controls.player.position.x = params.L - offset; }

        if (controls.player.position.z < -params.L + offset) { controls.player.position.z = -params.L + offset; }
        else if (controls.player.position.z > params.L - offset) { controls.player.position.z = params.L - offset; }

        controls.update();
        renderer.render(scene, camera);
        params = CONTROLLERS.moveInD4(params, controls);


    });

    AUDIO.play_track('index.mp3', camera, 3000);

}

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
    // now need to find the mass of a particle with diameter 1
    let m = 4. / 3. * Math.PI * 0.5 * 0.5 * 0.5 * params.particle_density;

    S.simu_interpret_command("mass -1 " + String(m));
    S.simu_interpret_command("auto rho");
    S.simu_interpret_command("auto radius uniform " + params.r_min + " " + params.r_max);
    S.simu_interpret_command("auto mass");
    S.simu_interpret_command("auto inertia");
    S.simu_interpret_command("auto skin");
    // console.log(params.L, params.H)
    S.simu_interpret_command("boundary 0 WALL -" + String(params.L) + " " + String(params.L));
    S.simu_interpret_command("boundary 1 WALL -" + String(params.L) + " " + String(params.L));
    S.simu_interpret_command("boundary 2 WALL -" + String(0) + " " + String(2 * params.L));
    S.simu_interpret_command("boundary 3 WALL -" + String(params.L) + " " + String(params.L));
    if (params.gravity === true) {
        S.simu_interpret_command("gravity 0 0 " + String(-100) + "0 ".repeat(params.dimension - 3))
    }
    else {
        S.simu_interpret_command("gravity 0 0 0 " + "0 ".repeat(params.dimension - 3))
    }
    // S.simu_interpret_command("auto location randomsquare");
    S.simu_interpret_command("auto location randomdrop");

    for (let i = 0; i < params.N; i++) {
        S.simu_setVelocity(i, [params.initial_speed * (Math.random() - 0.5),
        params.initial_speed * (Math.random() - 0.5),
        params.initial_speed * (Math.random() - 0.5),
        params.initial_speed * (Math.random() - 0.5)]);

    }

    let tc = 1e-2;
    let rest = 0.999; // super low restitution coeff to dampen out quickly
    let min_particle_mass = params.particle_density * 4. / 3. * Math.PI * Math.pow(params.r_min, 3);
    let vals = SPHERES.setCollisionTimeAndRestitutionCoefficient(tc, rest, min_particle_mass);
    S.simu_interpret_command("set Kn " + String(vals.stiffness));
    S.simu_interpret_command("set Kt " + String(0.8 * vals.stiffness));
    S.simu_interpret_command("set GammaN " + String(vals.dissipation));
    S.simu_interpret_command("set GammaT " + String(vals.dissipation));

    // let bulk_modulus = 1e6;
    // let poisson_coefficient = 0.5;
    // let tc = SPHERES.getHertzCriticalTimestep(bulk_modulus, poisson_coefficient, params.r_min, params.particle_density);
    // S.simu_interpret_command("set Kn " + String(bulk_modulus));
    // S.simu_interpret_command("set Kt " + String(0.8*bulk_modulus));
    // S.simu_interpret_command("set GammaN 0.2"); //+ String(vals.dissipation));
    // S.simu_interpret_command("set GammaT 0.2"); //+ String(vals.dissipation));
    // S.simu_interpret_command("ContactModel Hertz");

    S.simu_interpret_command("set Mu " + String(params.friction_coefficient));
    S.simu_interpret_command("set Mu_wall 0");
    S.simu_interpret_command("set T 150");
    S.simu_interpret_command("set dt " + String(tc / 20));
    S.simu_interpret_command("set tdump 1000000"); // how often to calculate wall forces

    S.simu_finalise_init();
}

// init();

export function dispose() {

}
