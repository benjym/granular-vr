import css from "../css/main.css";

import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import ImmersiveControls from '@depasquale/three-immersive-controls';

import * as CONTROLLERS from '../libs/controllers.js';
import * as SPHERES from "../libs/SphereHandler.js"
import * as WALLS from "../libs/WallHandler.js"
import * as BUTTONS from "../libs/buttons";
import * as GRAPHS from "../libs/graphs";
import * as AUDIO from "../libs/audio";
import * as LIGHTS from "../libs/lights";

import { camera, scene, renderer, controls, clock, apps, visibility, NDDEMCGLib, extra_params } from "./index";

let S;

export let params = {
    dimension: 4,
    // L: 4, //system size
    // L: 0.025,
    // H: 0.05,
    boxratio: 2,
    initial_packing_fraction: 0.5,
    N: 300,
    epsilonv: 0,
    gravity: false,
    g_mag: 1e1,
    paused: false,
    H_cur: 0,
    pressure_set_pt: 1e4,
    deviatoric_set_pt: 0,
    d4: { cur: 0 },
    theta: 0,
    // r_max: 0.0033,
    // r_min: 0.0027,
    r_max: 0.2,
    r_min: 0.2,
    // freq: 0.05,
    new_line: false,
    loading_rate: 0.01,
    // max_vertical_strain: 0.3,
    target_stress: 1e6,
    unloading_stress: 100,
    lut: 'None',
    quality: 5,
    vmax: 1, // max velocity to colour by
    omegamax: 20, // max rotation rate to colour by
    loading_active: false,
    particle_density: 2700, // kg/m^3
    particle_opacity: 0.8,
    audio: false,
    audio_sensitivity: 1,
    F_mag_max: 2e4,
    friction_coefficient: 0.5,
    pressure: 0,
    started: false,
    wall_remove_time : 5,
    reset_time: 20,
    current_time: 0,
    loading_direction: 1,
    remove_wall : false,
}

function set_derived_properties() {

    
    params.average_radius = (params.r_min + params.r_max) / 2.;
    params.thickness = 0.0001;//params.average_radius;

    // params.particle_volume = 4. / 3. * Math.PI * Math.pow(params.average_radius, 3);
    params.particle_volume = Math.PI * Math.PI * Math.pow(params.average_radius, 4) / 2.;
    console.log('estimate of particle volume: ' + params.particle_volume * params.N)
    params.particle_mass = params.particle_volume * params.particle_density;
    params.L = Math.pow(params.particle_volume * params.N / params.initial_packing_fraction, 1. / 4.) / 2.;
    params.H = params.L * params.boxratio;
}

function reset_particles() {
    S.simu_interpret_command("boundary 0 WALL -" + String(params.L) + " " + String(params.L));

    set_derived_properties();
    // SPHERES.randomise_particles_isotropic(params, S);
    S.simu_randomDrop();
    // WALLS.add_cuboid_walls(params);
    // WALLS.update_isotropic_wall(params, S);
    // setup_CG();
    WALLS.show_right();
}
export function init() {
    SPHERES.createNDParticleShader(params).then(main);
}


async function main() {
    set_derived_properties();

    await NDDEMPhysics();

    const base_geometry = new THREE.PlaneGeometry(20, 2*params.L);
    const base_material = new THREE.MeshBasicMaterial({ color: 0x333333, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(base_geometry, base_material);
    plane.rotateX(Math.PI / 2.);
    plane.position.y = 0;//-0.5 * params.r_min;
    plane.position.x = 10 - params.L;
    scene.add(plane);

    LIGHTS.add_default_lights(scene);

    WALLS.add_dam_break_walls(params);


    // WALLS.add_cuboid_walls(params);
    WALLS.walls.rotateX(-Math.PI / 2.); // fix y/z up compared to NDDEM
    WALLS.walls.rotateZ(Math.PI); // fix y/z up compared to NDDEM
    // WALLS.walls.position.y = params.H;
    // console.debug('rotated and placed walls')
    scene.add(WALLS.walls);
    // WALLS.update_isotropic_wall(params, S);
    // WALLS.add_scale(params);


    SPHERES.add_spheres(S, params, scene);

    let gui = new GUI();
    gui.width = 450;

    gui.add(params, 'initial_packing_fraction', 0.35, 0.55, 0.01)
        .name('Initial solids fraction').listen().onChange(reset_particles);
    gui.add(params, 'loading_rate', 0.001, 0.1, 0.001).name('Volumetric strainrate (1/s)');
    gui.add(params, 'target_stress', 0, 1e4).name('Target stress - loading');
    gui.add(params, 'unloading_stress', 0, 1e4).name('Target stress - unloading');
    gui.add(params, 'particle_opacity', 0, 1).name('Particle opacity').listen().onChange(() => SPHERES.update_particle_material(params,
        // lut_folder
    ));
    gui.add(params, 'friction_coefficient', 0, 2).name('Friction coefficient').listen().onChange(() => S.simu_interpret_command("set Mu " + String(params.friction_coefficient)));
    gui.add(params, 'lut', ['None', 'Velocity', 'Rotation Rate']).name('Colour by')
        .onChange(() => SPHERES.update_particle_material(params,
            // lut_folder
        ));
    /*gui.add ( params, 'gravity').name('Gravity').listen()
        .onChange( function() {
            if ( params.gravity === true ) {
                S.simu_interpret_command("gravity 0 0 -10 " + "0 ".repeat(params.dimension - 3)) }
            else {
                S.simu_interpret_command("gravity 0 0 0 " + "0 ".repeat(params.dimension - 3)) }
            });*/
    // gui.add ( params, 'new_line').name('New loading path').listen().onChange( new_load_path );
    //gui.add ( params, 'paused').name('Paused').listen();
    // gui.add(params, 'hideaxes').name("Static axes (allow many cycles)").listen() ;
    gui.add(params, 'audio_sensitivity', 1, 1e3, 1).name('Audio sensitivity');
    gui.add(params, 'audio').name('Audio').listen().onChange(() => {
        if (AUDIO.listener === undefined) {
            AUDIO.make_listener(camera);
            AUDIO.add_fixed_sound_source([0, 0, 0]);
            // SPHERES.add_normal_sound_to_all_spheres();
        } else {
            // AUDIO.remove_listener( camera ); // doesn't do anything at the moment...
            // SPHERES.mute_sounds();
        }
    });
    // gui.add(params, 'remove_wall').name('Remove wall').listen().onChange(() => {
    //     console.log('WALL CHANGE')
    //     if ( params.remove_wall ) {
    //         S.simu_interpret_command("boundary 0 WALL -" + String(20*params.L) + " " + String(params.L));
    //     } else {
    //         reset_particles();
    //     }
    // });

    gui.remove_me = true;

    animate();

    BUTTONS.add_scene_change_button(apps.list[apps.current - 1].url, 'Back: ' + apps.list[apps.current - 1].name, controls, scene, [-1, 1, 1.5], 0.25, [0, Math.PI / 4, 0]);
    setTimeout(() => { BUTTONS.add_scene_change_button(apps.list[apps.current + 1].url, 'Next: ' + apps.list[apps.current + 1].name, controls, scene, [1, 1, 1.5], 0.25, [0, -Math.PI / 4, 0]) }, apps.list[apps.current].button_delay);

}


function animate() {
    renderer.setAnimationLoop(async function () {
        if ( visibility === 'visible' ) {
            params.current_time += clock.getDelta();
            // console.log(params.current_time)
            if ( params.current_time > params.reset_time && params.remove_wall ) {
                params.current_time = 0;
                params.remove_wall = false;
                reset_particles();
            }
            if ( params.current_time > params.wall_remove_time && !params.remove_wall ) {
                params.remove_wall = true;
                WALLS.hide_right();
                S.simu_interpret_command("boundary 0 WALL -" + String(params.L) + " " + String(20*params.L));
            }
            S.simu_step_forward(5);
            SPHERES.move_spheres(S, params);
            if (extra_params.has('forces')) { SPHERES.draw_force_network(S, params, scene); }
            if ( controls !== undefined ) {
                controls.update();
                // CONTROLLERS.toggleParticleOpacity(params,controls);
            }
        }
        renderer.render(scene, camera);
    });



}

async function NDDEMPhysics() {
    await NDDEMCGLib.init(params.dimension, params.N);
    S = NDDEMCGLib.S;
    await setup_NDDEM();
    // await setup_CG();
}

async function setup_NDDEM() {
    S.simu_interpret_command("dimensions " + String(params.dimension) + " " + String(params.N));
    S.simu_interpret_command("radius -1 0.5");
    // now need to find the mass of a particle with diameter 1
    // let m = 4. / 3. * Math.PI * 0.5 * 0.5 * 0.5 * params.particle_density;
    let m = Math.PI * Math.PI * Math.pow(1, 4) / 2. * params.particle_density;

    S.simu_interpret_command("mass -1 " + String(m));
    S.simu_interpret_command("auto rho");
    S.simu_interpret_command("auto radius uniform " + params.r_min + " " + params.r_max);
    S.simu_interpret_command("auto mass");
    S.simu_interpret_command("auto inertia");
    S.simu_interpret_command("auto skin");
    // console.log(params.L, params.H)
    S.simu_interpret_command("boundary 0 WALL -" + String(params.L) + " " + String(params.L));
    S.simu_interpret_command("boundary 1 WALL -" + String(params.L) + " " + String(params.L));
    S.simu_interpret_command("boundary 2 WALL 0 " + String(2 * params.H));
    
    S.simu_interpret_command("gravity " + String(-params.g_mag*Math.sin(params.theta*Math.PI/180.)) + " 0 " + String(-params.g_mag*Math.cos(params.theta*Math.PI/180.)))
    // S.simu_interpret_command("gravity 0 0 -10")

    S.simu_interpret_command("auto location randomdrop");
    // S.simu_interpret_command("auto location roughinclineplaneZ");

    // let n = 0;
    // // for (let i = -params.L+params.r_max; i < params.L-params.r_max; i+=2*params.r_max) {
    // //     for (let j = -params.L+params.r_max; j < params.L-params.r_max; j+=2*params.r_max) {
    // //         S.simu_interpret_command("location " + String(n) + " " + String(i) + " " + String(j) + " 0");
    // //         S.simu_setRadius(n, params.r_max);
    // //         S.simu_setFrozen(n);
    // //         n++;
    // //         // console.log(n)
    // //     }
    // // }
    // for (let i=n; i<params.N; i++) {
    //     S.simu_fixParticle(i,[params.L*(2*Math.random()-1),params.L*(2*Math.random()-1),3*params.r_max + (2*params.H-4*params.r_max)*Math.random()])
    // }

    let tc = 1e-2;
    let rest = 0.2; // super low restitution coeff to dampen out quickly
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
    S.simu_interpret_command("set Mu_wall 1");
    // S.simu_interpret_command("set damping 0.01");
    S.simu_interpret_command("set T 150");
    S.simu_interpret_command("set dt " + String(tc / 10));
    S.simu_interpret_command("set tdump 1000000"); // how often to calculate wall forces

    await S.simu_finalise_init();
}

// async function setup_CG() {
//     var cgparam = {};
//     cgparam["file"] = [{ "filename": "none", "content": "particles", "format": "interactive", "number": 1 }];
//     cgparam["boxes"] = [1, 1, 1];
//     // cgparam["boundaries"]=[[-params.L,-params.L,-params.L],[params.L,params.L,params.L]] ;
//     cgparam["boundaries"] = [
//         [-params.L / 2., -params.L / 2., params.boxratio * params.L / 2.],
//         [params.L / 2., params.L / 2., 3 * params.boxratio * params.L / 2.]];
//     // [-params.L+params.r_max,-params.L+params.r_max,-params.L+params.r_max],
//     // [ params.L-params.r_max, params.L-params.r_max, params.L-params.r_max]] ;

//     cgparam["window size"] = params.L / 2.;
//     cgparam["skip"] = 0;
//     cgparam["max time"] = 1;
//     cgparam["time average"] = "None";
//     cgparam["fields"] = ["RHO", "TC"];
//     cgparam["periodicity"] = [false, false, false];
//     cgparam["window"] = "Lucy3D";
//     cgparam["dimension"] = 3;


//     // console.log(JSON.stringify(cgparam)) ;
//     await S.cg_param_from_json_string(JSON.stringify(cgparam));
//     await S.cg_setup_CG();
// }

// main();
