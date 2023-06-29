import css from "../css/main.css";
import track from "../text-to-speech/index.mp3";

import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';

import * as CONTROLLERS from '../libs/controllers.js';
import * as SPHERES from "../libs/SphereHandler.js"
import * as WALLS from "../libs/WallHandler.js"
import * as BUTTONS from "../libs/buttons";
import * as GRAPHS from "../libs/graphs";
import * as AUDIO from "../libs/audio";
import * as LIGHTS from "../libs/lights";
import * as RAYCAST from "../libs/RaycastHandler";

import { camera, scene, renderer, controls, extra_params, apps, visibility, NDDEMCGLib, human_height } from "./index";

let S;
let started = false;

export let params = {
    dimension: 3,
    L : 2,
    boxratio: 1,
    // initial_packing_fraction: 0.01,
    N: 1,
    gravity: false,
    paused: false,
    r_max: 0.1,
    r_min: 0.1,
    lut: 'None',
    quality: 6,
    vmax: 1, // max velocity to colour by
    omegamax: 20, // max rotation rate to colour by
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

    // params.particle_volume = Math.PI * Math.PI * Math.pow(params.average_radius, 4) / 2.;
    // console.log('estimate of particle volume: ' + params.particle_volume * params.N)
    // params.particle_mass = params.particle_volume * params.particle_density;
    // params.L = Math.pow(params.particle_volume * params.N / params.initial_packing_fraction / params.boxratio, 1. / 3.) / 2.;
    // params.L = 2.5;
    params.H = params.L * params.boxratio;

    params.L_cur = params.L;
    params.H_cur = params.H;
    params.epsilonv = 0;
}


export function init() {
    SPHERES.createNDParticleShader(params).then(main);
}

async function main() {
    set_derived_properties();
    await NDDEMPhysics().then(() => {
        build_world();
        started = true;
        renderer.setAnimationLoop(update);
    });
}

async function build_world() {    
    // const base_geometry = new THREE.PlaneGeometry(params.L, params.L);
    // const base_material = new THREE.MeshBasicMaterial({ color: 0x333333, side: THREE.DoubleSide });
    // const plane = new THREE.Mesh(base_geometry, base_material);
    // plane.rotateX(Math.PI / 2.);
    // plane.position.y = -0.5 * params.r_min;
    // scene.add(plane);

    LIGHTS.add_smaller_lights(scene);

    SPHERES.add_spheres(S, params, scene);
    SPHERES.add_shadows();

    // BUTTONS.add_scene_change_button(apps.list[apps.current - 1].url, apps.list[apps.current - 1].name, controls, scene, [-1, 1, 1], 0.25, [0, Math.PI / 4, 0]);
    setTimeout(() => { BUTTONS.add_scene_change_button(apps.list[apps.current + 1].url, 'Next: ' + apps.list[apps.current + 1].name, controls, scene, [0.5, 1, 1], 0.25, [0, -Math.PI / 4, 0]) }, apps.list[apps.current].button_delay);

    // let offset = 0.5;
    
}

async function update() {
    if ( visibility === 'visible' && started ) {
        // if (S !== undefined) {
        SPHERES.move_spheres(S, params);
        S.simu_step_forward(50);
        // }
        let offset = 1.0;
        if (controls.player.position.x < -params.L + offset) { controls.player.position.x = -params.L + offset; }
        else if (controls.player.position.x > params.L - offset) { controls.player.position.x = params.L - offset; }

        if (controls.player.position.z < -params.L + offset) { controls.player.position.z = -params.L + offset; }
        else if (controls.player.position.z > params.L - offset) { controls.player.position.z = params.L - offset; }

        controls.update();
        renderer.render(scene, camera);
        // params = CONTROLLERS.moveInD4(params, controls);
        // WALLS.update_d4(params);

        RAYCAST.update_ghosts(params);
    }

    // });

}

async function NDDEMPhysics() {
    await NDDEMCGLib.init(params.dimension, params.N);
    S = NDDEMCGLib.S;
    setup_NDDEM();
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
    
    S.simu_interpret_command("boundary 0 WALL -" + String(params.L) + " " + String(params.L));
    S.simu_interpret_command("boundary 1 WALL -" + String(params.L) + " " + String(params.L));
    S.simu_interpret_command("boundary 2 WALL 0 " + String(2 * params.L));
    S.simu_interpret_command("gravity 0 0 0");


    // S.simu_interpret_command("location 0 " + String(params.L) + " 0 0");
    // S.simu_interpret_command("location 0 0 0 " + String(params.L));
    
    if ( extra_params.has('boundary') ) {
        if ( extra_params.get('boundary') === 'cube' ) {
            S.simu_interpret_command("auto location randomdrop");

            WALLS.add_cuboid_walls(params);

            WALLS.walls.rotateX(-Math.PI / 2.); // fix y/z up compared to NDDEM
            WALLS.walls.rotateZ(Math.PI); // fix y/z up compared to NDDEM
            WALLS.walls.position.y = params.L;

            WALLS.update_isotropic_wall(params, S);
            // WALLS.add_scale(params);
            WALLS.walls.children.forEach((w) => {
                if (w.type === 'Mesh') {
                    w.material.wireframe = false;
                    w.material.side = THREE.DoubleSide;
                }
            });
            WALLS.add_shadows();

        } else if ( extra_params.get('boundary') === 'sphere' ) {
            console.log('SPHERE')

            S.simu_interpret_command("boundary "+String(params.dimension)+" SPHERE "+String(params.L)+ " 0 0 " + String(params.L)); // add a sphere!
            S.simu_interpret_command("auto location insphere");
            WALLS.add_sphere(params);
            // WALLS.wall_material.wireframe = true;
        }
        RAYCAST.add_ghosts(scene, 2000, params.average_radius/4., 0xFFFFFF);


        S.simu_interpret_command("location 0 1 0.5 " + String(params.L+0.5));
        S.simu_interpret_command("velocity 0 50 40 30");

    }
    scene.add(WALLS.walls);

    let tc = 1e-3;
    let rest = 1.0; // super low restitution coeff to dampen out quickly
    let min_particle_mass = params.particle_density * 4. / 3. * Math.PI * Math.pow(params.r_min, 3);
    let vals = SPHERES.setCollisionTimeAndRestitutionCoefficient(tc, rest, min_particle_mass);
    S.simu_interpret_command("set Kn " + String(vals.stiffness));
    S.simu_interpret_command("set Kt " + String(0.8 * vals.stiffness));
    S.simu_interpret_command("set GammaN " + String(vals.dissipation));
    S.simu_interpret_command("set GammaT " + String(vals.dissipation));

    S.simu_interpret_command("set Mu 0");
    S.simu_interpret_command("set Mu_wall 0");
    S.simu_interpret_command("set T 150");
    S.simu_interpret_command("set dt " + String(tc / 20));
    S.simu_interpret_command("set tdump 1000000"); // how often to calculate wall forces

    S.simu_finalise_init();
}