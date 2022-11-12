import css from "../css/main.css";
import track from "../text-to-speech/pyramid.mp3";

import ImmersiveControls from '@depasquale/three-immersive-controls';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';

import * as CONTROLLERS from '../libs/controllers.js';
import * as SPHERES from "../libs/SphereHandler.js"
import * as BUTTONS from "../libs/buttons";
import * as AUDIO from "../libs/audio";
import * as LIGHTS from "../libs/lights";

import { camera, scene, renderer, controls, clock } from "./index";
let S;

var params = {
    dimension: 4,
    radius: 0.15,
    L: 500, //system size
    d4: { cur: 0, min: -1, max: 1 },
    lut: 'None',
    quality: 7,
    pyramid_size: 5,
    particle_density: 2700,

}

params.N = get_num_particles(params.pyramid_size);

export function init() {
    SPHERES.createNDParticleShader(params).then(() => {
        main();
    });
}

async function main() {

    await NDDEMCGPhysics();

    LIGHTS.add_default_lights(scene);

    const base_geometry = new THREE.PlaneGeometry(10, 10);
    const base_material = new THREE.MeshBasicMaterial({ color: 0x333333, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(base_geometry, base_material);
    plane.rotateX(Math.PI / 2.);
    scene.add(plane);

    SPHERES.add_spheres(S, params, scene);

    if (params.dimension == 4) {
        let gui = new GUI();
        gui.width = 320;
        gui.add(params.d4, 'cur', -1, 1, 0.001).name('D4 location').listen()
    }

    BUTTONS.add_scene_change_button('menu', 'Main menu', controls, scene, [-1, 1, 1], 0.25, [0, Math.PI / 4, 0]);
    BUTTONS.add_scene_change_button('4d-pool', '4D Pool', controls, scene, [1, 1, 1], 0.25, [0, -Math.PI / 4, 0]);
    // AUDIO.play_track('pyramid.mp3', camera, 5000);

    renderer.setAnimationLoop(function () {
        if (controls !== undefined) { controls.update(); }
        S.simu_step_forward(5);
        SPHERES.move_spheres(S, params);
        renderer.render(scene, camera);
        // console.log(controls.player.position)
        CONTROLLERS.moveInD4(params, controls);
    });

    AUDIO.play_track('pyramid.mp3', camera, 3000);
}

function get_num_particles(L) {
    let N = 0;
    let i = 1;
    for (var n = L; n > 0; n--) {
        N += i * n;
        i += 1;
    }
    return N + 1; // adding the white ball
    // return L * L * L + 1; // cube
}

function set_ball_positions() {
    let n = 0;

    // add the pyramid
    for (var k = 0; k < params.pyramid_size; k++) {
        let cur_pyramid_length = params.pyramid_size - k;
        let z = k * 1.825 * params.radius + params.radius;
        for (var i = 0; i < cur_pyramid_length; i++) {
            for (var j = 0; j < cur_pyramid_length - i; j++) {
                let x = i * 1.82 * params.radius - cur_pyramid_length * params.radius * 0.825;// + 2 * params.radius;
                let y = j * 2.01 * params.radius - (cur_pyramid_length - i) * params.radius + params.radius;// - i%2*radius;
                console.log(n, x, y, z);
                S.simu_interpret_command("location " + String(n) + " " + String(x) + " " + String(y) + " " + String(z) + " " + String(0));
                if (k === 0) {
                    S.simu_setFrozen(n);
                }
                n++;
                // if (k > 0) { S.simu_interpret_command("location " + String(n) + " " + String(x) + " " + String(params.table_height - params.L2 + params.radius) + " " + String(y) + " " + String(-w)); n++; }

            }
        }
    }

    // add a cube
    // for (let i = 0; i < params.pyramid_size; i++) {
    //     for (let j = 0; j < params.pyramid_size; j++) {
    //         for (let k = 0; k < params.pyramid_size; k++) {
    //             let x = params.radius * (i * 2 - params.pyramid_size / 2.);
    //             let y = params.radius * (j * 2 - params.pyramid_size / 2.);
    //             let z = params.radius * (k * 2 + 1);
    //             console.log(n, x, y, z);
    //             if (k === 0) {
    //                 S.simu_setFrozen(n);
    //             }
    //             S.simu_interpret_command("location " +
    //                 String(n) + " " +
    //                 String(x) + " " +
    //                 String(y) + " " +
    //                 String(z) + " " +
    //                 // String(0));
    //                 String(0.1 * params.radius * Math.random()));
    //             n++
    //         }
    //     }
    // }

    // add the cue stick
    // if (params.vr) {
    S.simu_interpret_command("location " + String(params.N - 1) + " 10 10 10 0");
    console.log(params.N)

    // let pool_cue_particle_volume = Math.PI*Math.PI*Math.pow(POOLCUE.small_end_radius,4)/2.;
    // let pool_cue_particle_mass = params.particle_volume * params.particle_density/1e3;
    // S.setRadius(params.N, POOLCUE.small_end_radius);
    // S.setMass(params.N, params.particle_mass/10.);
    // }
}

async function NDDEMCGPhysics() {

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
        finish_setup();
    });

    function finish_setup() {
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
            S.simu_interpret_command("boundary 3 WALL -1 1");
        }

        set_ball_positions();
        // console.log(params.N)

        let tc = 0.02;
        let rest = 0.5; // super low restitution coeff to dampen out quickly
        params.particle_volume = Math.PI * Math.PI * Math.pow(params.radius, 4) / 2.;
        params.particle_mass = params.particle_volume * params.particle_density;

        let vals = SPHERES.setCollisionTimeAndRestitutionCoefficient(tc, rest, params.particle_mass)

        // console.log(params.particle_mass);

        S.simu_interpret_command("set Kn " + String(vals.stiffness));
        S.simu_interpret_command("set Kt " + String(0.8 * vals.stiffness));
        S.simu_interpret_command("set GammaN " + String(vals.dissipation));
        S.simu_interpret_command("set GammaT " + String(vals.dissipation));
        S.simu_interpret_command("set Mu 0.5");
        S.simu_interpret_command("set Mu_wall 1");
        S.simu_interpret_command("set damping 6e-4");
        S.simu_interpret_command("set T 150");
        S.simu_interpret_command("set dt " + String(tc / 20));
        S.simu_interpret_command("set tdump 1000000"); // how often to calculate wall forces
        S.simu_interpret_command("auto skin");
        S.simu_finalise_init();

    }
}
