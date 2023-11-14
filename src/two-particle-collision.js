import css from "../css/main.css";
import track from "../text-to-speech/two-particle-collision.mp3";

import * as CONTROLLERS from '../libs/controllers.js';
import * as SPHERES from "../libs/SphereHandler.js"
import * as BUTTONS from "../libs/buttons";
import * as AUDIO from "../libs/audio";
import * as LIGHTS from "../libs/lights";

import { camera, scene, renderer, controls, clock, apps, visibility, NDDEMCGLib, extra_params } from "./index";

let S;
let started = false;

var params = {
    dimension: 3,
    radius: 0.5,
    r_min: 0.5,
    L: 500, //system size
    lut: 'None',
    quality: 7,
    particle_density: 2700,
    particle_opacity: 0.7,
    F_mag_max: 1e6,
    N: 2,
    audio: true
}

export function init() {
    SPHERES.createNDParticleShader(params).then(main);
}

async function main() {
    await NDDEMCGPhysics().then(() => {
        build_world();
        started = true;
        renderer.setAnimationLoop(update);
    });
}

async function build_world() {

    LIGHTS.add_default_lights(scene);

    const base_geometry = new THREE.PlaneGeometry(10, 10);
    const base_material = new THREE.MeshBasicMaterial({ color: 0x333333, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(base_geometry, base_material);
    plane.rotateX(Math.PI / 2.);
    scene.add(plane);

    SPHERES.add_spheres(S, params, scene);

    BUTTONS.add_scene_change_button(apps.list[apps.current - 1].url, 'Back: ' + apps.list[apps.current - 1].name, controls, scene, [-1, 1, 1], 0.25, [0, Math.PI / 4, 0]);
    setTimeout(() => { BUTTONS.add_scene_change_button(apps.list[apps.current + 1].url, 'Next: ' + apps.list[apps.current + 1].name, controls, scene, [1, 1, 1], 0.25, [0, -Math.PI / 4, 0]) }, apps.list[apps.current].button_delay);
}

async function update() {

    if ( visibility === 'visible' && started ) {
        if ( controls !== undefined ) { controls.update() }
        S.simu_step_forward(5);
        SPHERES.move_spheres(S, params);
        if (extra_params.has('forces')) { SPHERES.draw_force_network(S, params, scene) }

        // if (AUDIO.listener !== undefined) {
        //     SPHERES.update_fixed_sounds(S, params);
        // }

        // CONTROLLERS.moveInD4(params, controls);

        // AUDIO.play_track('two-particle-collision.mp3', scene, 3000);
    }
    renderer.render(scene, camera);
}

async function NDDEMCGPhysics() {
    await NDDEMCGLib.init(params.dimension, params.N);
    S = NDDEMCGLib.S;
    await setup_NDDEM();
}

async function setup_NDDEM() {
    S.simu_interpret_command("dimensions " + String(params.dimension) + " " + String(params.N));
    S.simu_interpret_command("radius -1 " + params.radius);
    S.simu_interpret_command("mass -1 1");
    S.simu_interpret_command("auto rho");
    S.simu_interpret_command("auto inertia");

    S.simu_interpret_command("boundary 0 WALL -5 5");
    S.simu_interpret_command("boundary 1 WALL -5 5");
    S.simu_interpret_command("boundary 2 WALL 0 5");
    S.simu_interpret_command("gravity 0 0 -10 0");

    if (params.dimension == 4) {
        S.simu_interpret_command("boundary 3 WALL " + String(params.d4.min) + " " + String(params.d4.max));
    }

    S.simu_interpret_command("location 0 0 0 2 0");
    S.simu_interpret_command("location 1 0 0 0 0");
    S.simu_setFrozen(1);

    let tc = 0.02;
    let rest = 0.75; // super low restitution coeff to dampen out quickly
    params.particle_volume = Math.PI * Math.PI * Math.pow(params.radius, 4) / 2.;
    params.particle_mass = params.particle_volume * params.particle_density;

    let vals = SPHERES.setCollisionTimeAndRestitutionCoefficient(tc, rest, params.particle_mass)
    S.simu_setMass(0, params.particle_mass);
    S.simu_setMass(1, params.particle_mass);

    S.simu_interpret_command("set Kn " + String(vals.stiffness));
    S.simu_interpret_command("set Kt " + String(0.8 * vals.stiffness));
    S.simu_interpret_command("set GammaN " + String(vals.dissipation));
    S.simu_interpret_command("set GammaT " + String(vals.dissipation));
    S.simu_interpret_command("set Mu 0.5");
    S.simu_interpret_command("set Mu_wall 1");
    S.simu_interpret_command("set damping 0");
    S.simu_interpret_command("set T 150");
    S.simu_interpret_command("set dt " + String(tc / 20));
    S.simu_interpret_command("set tdump 1000000"); // how often to calculate wall forces
    S.simu_interpret_command("auto skin");
    await S.simu_finalise_init();

}
