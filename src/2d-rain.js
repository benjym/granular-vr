import css from "../css/main.css";
import track from "../text-to-speech/2d-rain.mp3";

import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { Lut } from 'three/examples/jsm/math/Lut.js';

import * as SPHERES from "../libs/SphereHandler.js"
import * as WALLS from "../libs/WallHandler.js"
// import * as LAYOUT from '../libs/Layout.js'
// import { NDSTLLoader, renderSTL } from '../libs/NDSTLLoader.js';
// import * as RAYCAST from '../libs/RaycastHandler.js';
import * as LIGHTS from "../libs/lights";
import * as BUTTONS from "../libs/buttons";
// import * as AUDIO from "../libs/audio";


import { camera, scene, renderer, controls, clock, apps, NDDEMCGLib } from "./index";


let gui;
let S;
let cg_mesh;

var params = {
    dimension: 2,
    L: 2, //system size
    N: 250,
    // packing_fraction: 0.5,
    constant_volume: true,
    axial_strain: 0,
    volumetric_strain: 0,
    paused: false,
    g_mag: 1e3,
    theta: 0, // slope angle in DEGREES
    r_max: 0.1,
    r_min: 0.15,
    particle_density: 1,
    shear_rate: 10,
    lut: 'White',
    cg_field: 'Density',
    quality: 5,
    cg_width: 50,
    cg_height: 50,
    cg_opacity: 0.8,
    cg_window_size: 3,
    particle_opacity: 1,
    F_mag_max: 0.005,
    aspect_ratio: 1,
}

// let rainbow = new Lut("rainbow", 512); // options are rainbow, cooltowarm and blackbody
// let cooltowarm = new Lut("cooltowarm", 512); // options are rainbow, cooltowarm and blackbody
// let blackbody = new Lut("blackbody", 512); // options are rainbow, cooltowarm and blackbody

params.average_radius = (params.r_min + params.r_max) / 2.;
params.thickness = params.average_radius;


params.particle_volume = Math.PI * Math.pow(params.average_radius, 2);

params.particle_mass = params.particle_volume * params.particle_density;

export function init() {
    SPHERES.createNDParticleShader(params).then(main());
}

async function main() {

    await NDDEMCGPhysics();

    LIGHTS.add_default_lights(scene);

    SPHERES.add_spheres(S, params, scene);

    const base_geometry = new THREE.PlaneGeometry(2 * params.L, 2 * params.L);
    const base_material = new THREE.MeshBasicMaterial({ color: 0x333333, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(base_geometry, base_material);
    plane.rotateX(Math.PI / 2.);
    // plane.position.y = -0.5 * params.r_min;
    scene.add(plane);

    WALLS.add_back(params, scene);
    WALLS.add_left(params, scene);
    WALLS.add_right(params, scene);
    WALLS.add_front(params, scene);
    WALLS.back.scale.y = params.thickness;//Math.PI/2.;
    var vert_walls = [WALLS.left, WALLS.right, WALLS.back, WALLS.front];

    vert_walls.forEach(function (mesh) {
        mesh.scale.x = 2 * params.L + 2 * params.thickness;
        mesh.scale.z = 2 * params.L + 2 * params.thickness;
    });

    let geometry = new THREE.PlaneGeometry(2 * params.L, 2 * params.L);
    let material = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
    material.transparent = true;
    cg_mesh = new THREE.Mesh(geometry, material);
    cg_mesh.position.z = -1;
    // scene.add( cg_mesh );

    BUTTONS.add_scene_change_button(apps.list[apps.current - 1].url, 'Back: ' + apps.list[apps.current - 1].name, controls, scene, [-1, 1, 1], 0.25, [0, Math.PI / 4, 0]);
    setTimeout(() => { BUTTONS.add_scene_change_button(apps.list[apps.current + 1].url, 'Next: ' + apps.list[apps.current + 1].name, controls, scene, [1, 1, 1], 0.25, [0, -Math.PI / 4, 0]) }, apps.list[apps.current].button_delay);

    renderer.setAnimationLoop( update );
}


async function update() {
    // requestAnimationFrame( animate );
    await SPHERES.move_spheres(S, params);
    // RAYCAST.animate_locked_particle(S, camera, SPHERES.spheres, params);
    // if (!params.paused) {
    await S.simu_step_forward(5);
    // update_cg_field();
    // }
    // SPHERES.draw_force_network(S, params, scene);
    controls.update();
    renderer.render(scene, camera);
}

async function NDDEMCGPhysics() {
    await NDDEMCGLib.init(params.dimension, params.N);
    S = NDDEMCGLib.S;
    setup_NDDEM();
}

function setup_NDDEM() {
    S.simu_interpret_command("dimensions " + String(params.dimension) + " " + String(params.N));
    S.simu_interpret_command("radius -1 0.5");
    let m;
    if (params.dimension === 2) {
        m = Math.PI * 0.5 * 0.5 * params.particle_density;
    } else {
        m = 4. / 3. * Math.PI * 0.5 * 0.5 * 0.5 * params.particle_density;
    }

    S.simu_interpret_command("mass -1 " + String(m));
    S.simu_interpret_command("auto rho");
    S.simu_interpret_command("auto radius uniform " + params.r_min + " " + params.r_max);
    S.simu_interpret_command("auto mass");
    S.simu_interpret_command("auto inertia");
    S.simu_interpret_command("auto skin");

        S.simu_interpret_command("boundary 0 WALL 0 " + String(10 * params.L));
        S.simu_interpret_command("boundary 1 WALL -" + String(params.L) + " " + String(params.L));
        if (params.dimension > 2) {
            S.simu_interpret_command("boundary 2 WALL -" + String(params.r_max) + " " + String(params.r_max));
        }
        if (params.dimension > 3) {
            S.simu_interpret_command("boundary 3 WALL -" + String(params.L) + " " + String(params.L));
        }
        S.simu_interpret_command("gravity -10 " + "0 ".repeat(params.dimension - 2))

    S.simu_interpret_command("auto location randomdrop");

    // S.simu_interpret_command("set Kn 2e5");
    // S.simu_interpret_command("set Kt 8e4");
    // S.simu_interpret_command("set GammaN 75");
    // S.simu_interpret_command("set GammaT 75");
    // S.simu_interpret_command("set Mu 1");
    // S.simu_interpret_command("set Mu_wall 0");
    // S.simu_interpret_command("set T 150");
    // S.simu_interpret_command("set dt 0.0002");
    // S.simu_interpret_command("set tdump 10"); // how often to calculate wall forces
    // S.simu_interpret_command("auto skin");
    // S.simu_finalise_init () ;

    let tc = 1e-2;
    let rest = 0.5; // super low restitution coeff to dampen out quickly
    let vals = SPHERES.setCollisionTimeAndRestitutionCoefficient(tc, rest, params.particle_mass)

    S.simu_interpret_command("set Kn " + String(vals.stiffness));
    S.simu_interpret_command("set Kt " + String(0.8 * vals.stiffness));
    S.simu_interpret_command("set GammaN " + String(vals.dissipation));
    S.simu_interpret_command("set GammaT " + String(vals.dissipation));
    S.simu_interpret_command("set Mu 0.5");
    S.simu_interpret_command("set damping 0.0001");
    S.simu_interpret_command("set T 150");
    S.simu_interpret_command("set dt " + String(tc / 20));
    S.simu_interpret_command("set tdump 1000000"); // how often to calculate wall forces
    S.simu_interpret_command("auto skin");
    S.simu_finalise_init();

        // update_cg_params(S, params);

    //}
}
