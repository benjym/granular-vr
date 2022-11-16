import css from "../css/main.css";
import track from "../text-to-speech/isotropic.mp3";

// import * as DEMCGND from "../resources/DEMCGND.js";

import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import ImmersiveControls from '@depasquale/three-immersive-controls';

import * as CONTROLLERS from '../libs/controllers.js';
import * as SPHERES from "../libs/SphereHandler.js"
import * as WALLS from "../libs/WallHandler.js"
import * as BUTTONS from "../libs/buttons";
import * as GRAPHS from "../libs/graphs";
import * as AUDIO from "../libs/audio";

// var clock = new THREE.Clock();

import { camera, scene, renderer, controls, clock, apps } from "./index";
let S;

// move_to('isotropic');


export let params = {
    dimension: 3,
    // L: 4, //system size
    // L: 0.025,
    // H: 0.05,
    boxratio: 1.5,
    initial_packing_fraction: 0.4,
    N: 500,
    epsilonv: 0,
    gravity: false,
    paused: false,
    H_cur: 0,
    pressure_set_pt: 1e4,
    deviatoric_set_pt: 0,
    d4: { cur: 0 },
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
    quality: 5,
    vmax: 1, // max velocity to colour by
    omegamax: 20, // max rotation rate to colour by
    loading_active: false,
    particle_density: 2700, // kg/m^3
    particle_opacity: 0.8,
    audio: false,
    audio_sensitivity: 1,
    F_mag_max: 1e6,
    friction_coefficient: 0.5,
    pressure: 0,
    started: false,
    old_time: 0,
    new_time: 0,
    loading_direction: 1,
    startTime: clock.getElapsedTime(),
}

function set_derived_properties() {
    params.average_radius = (params.r_min + params.r_max) / 2.;
    params.thickness = 0.0001;//params.average_radius;

    params.particle_volume = 4. / 3. * Math.PI * Math.pow(params.average_radius, 3);
    console.log('estimate of particle volume: ' + params.particle_volume * params.N)
    params.particle_mass = params.particle_volume * params.particle_density;
    params.L = Math.pow(params.particle_volume * params.N / params.initial_packing_fraction / params.boxratio, 1. / 3.) / 2.;
    params.H = params.L * params.boxratio;

    params.L_cur = params.L;
    params.H_cur = params.H;
    // params.packing_fraction = params.N*params.particle_volume/Math.pow(2*params.L,3);
    // params.back = -params.L;
    // params.front = params.L;
    // params.left = -params.L;
    // params.right = params.L;
    // params.floor = -params.L;
    // params.roof = params.L;
}

function reset_particles() {
    params.loading_active = false;
    params.vertical_displacement = 0;
    params.loading_direction = 1;
    set_derived_properties();
    SPHERES.randomise_particles_isotropic(params, S);
    WALLS.add_cuboid_walls(params);
    WALLS.update_isotropic_wall(params, S);
    setup_CG();
    params.started = false;
    params.startTime = clock.getElapsedTime()
}
export function init() {
    SPHERES.createNDParticleShader(params).then(main());
}


async function main() {
    set_derived_properties();

    await NDDEMPhysics();
    // camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1e-1, 100);
    // camera.position.set( 3*params.L, 3*params.L, 1.5*params.L );
    // camera.up.set(0, 0, 1);
    // camera.lookAt( 0, 0, 0 );

    // scene = new THREE.Scene();
    // scene.background = new THREE.Color(0x111);

    // let g = new THREE.GridHelper(100, 100);
    // g.position.y = -params.H;
    // scene.add(g);

    const base_geometry = new THREE.PlaneGeometry(10, 10);
    const base_material = new THREE.MeshBasicMaterial({ color: 0x333333, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(base_geometry, base_material);
    plane.rotateX(Math.PI / 2.);
    plane.position.y = -0.5 * params.r_min;
    scene.add(plane);

    const hemiLight = new THREE.HemisphereLight();
    hemiLight.intensity = 0.35;
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight();
    dirLight.position.set(5, 5, 5);
    dirLight.castShadow = true;
    dirLight.shadow.camera.zoom = 2;
    scene.add(dirLight);

    WALLS.add_cuboid_walls(params);
    WALLS.walls.rotateX(-Math.PI / 2.); // fix y/z up compared to NDDEM
    WALLS.walls.rotateZ(Math.PI); // fix y/z up compared to NDDEM
    WALLS.walls.position.y = params.H;
    scene.add(WALLS.walls);
    WALLS.update_isotropic_wall(params, S);
    WALLS.add_scale(params);

    SPHERES.add_spheres(S, params, scene);

    // renderer = new THREE.WebGLRenderer({ antialias: true });//, logarithmicDepthBuffer: true });
    // renderer.setPixelRatio(window.devicePixelRatio);
    // renderer.setSize(window.innerWidth, window.innerHeight);
    // renderer.shadowMap.enabled = true;
    // renderer.outputEncoding = THREE.sRGBEncoding;

    // let container = document.getElementById('canvas');
    // container.appendChild(renderer.domElement);

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
    gui.add(params, 'loading_active').name('Loading active').listen();

    // const controls = new OrbitControls( camera, container );
    // controls.update();
    // controls = new ImmersiveControls(camera, renderer, scene, {
    //     initialPosition: new THREE.Vector3(0, 1.6, 2),
    //     // moveSpeed: { keyboard: 0.025, vr: 0.025 }
    // });

    // window.addEventListener('resize', onWindowResize, false);

    // BUTTONS.add_url_button('index', 'Main menu', [-0.06, 0, 0], 0.02, controls, scene);
    gui.remove_me = true;

    let button = BUTTONS.add_action_button('loading_active', 'Loading active', CONTROLLERS.selectStartLoading.bind(null, params), CONTROLLERS.selectEndLoading.bind(null, params), CONTROLLERS.intersectLoading.bind(null, params), [-2, 1.6, 2.5 * params.L], 1, controls, scene);
    button.rotateY(Math.PI / 2.);
    // make_graph();
    WALLS.update_isotropic_wall(params, S);
    animate();

    let graph = GRAPHS.add_axes("Solid Fraction", "Pressure", 0.35, 0.7, 0, params.target_stress, scene);
    graph.position.y = 1.6;
    graph.position.z = 1.5 * params.L;
    graph.rotateY(-Math.PI / 2.);

    AUDIO.play_track('isotropic.mp3', camera, 3000);

    BUTTONS.add_scene_change_button(apps.list[0].url, apps.list[0].name, controls, scene, [-1, 1, 1.5], 0.25, [0, Math.PI / 4, 0]);
    BUTTONS.add_scene_change_button(apps.list[apps.current + 1].url, apps.list[apps.current + 1].name, controls, scene, [1, 1, 1.5], 0.25, [0, -Math.PI / 4, 0]);

}

function new_load_path() {
    WALLS.update_isotropic_wall(params, S);
    // data_point_colour = Math.floor(Math.random()*16777215).toString(16);
    // var data = [{
    //               type: 'scatter',
    //               mode: 'lines',
    //               x: [], y: [],
    //               line: { width: 5 },
    //               name: 'Load path ' + String(document.getElementById('stats').data.length+1)
    //             }]
    // Plotly.addTraces('stats', data);
    // params.new_line = false;
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    // var update = {
    //     width: window.innerWidth,
    //     height: window.innerHeight
    //     };
    // Plotly.relayout('stats', update);

}

function animate() {
    renderer.setAnimationLoop(function () {
        if (clock.getElapsedTime() - params.startTime > 3) { params.started = true; }
        // requestAnimationFrame( animate );
        S.simu_step_forward(5);
        SPHERES.move_spheres(S, params);
        params.new_time = clock.getElapsedTime() - params.startTime;
        if (!params.paused) {
            if (params.started) {
                if (params.loading_active) {
                    var dt = params.new_time - params.old_time;
                    params.epsilonv += params.loading_direction * params.loading_rate * dt;
                    if ((params.pressure >= params.target_stress) && (params.loading_direction === 1)) { // just run this once
                        window.setTimeout(() => { params.loading_direction = -1 }, 3000) // wait then reverse
                    }
                    if ((params.pressure >= params.target_stress) && (params.loading_direction > 0)) {
                        params.loading_direction *= 0.5; // slow down gradually
                    }
                    if ((params.epsilonv <= 1e-4 || params.pressure < params.unloading_stress) && (params.loading_direction === -1)) { // just run this once
                        window.setTimeout(() => { params.loading_direction = 1; new_load_path(); }, 3000) // wait then reverse
                    }
                    if ((params.epsilonv <= 1e-4 || params.pressure < params.unloading_stress) && (params.loading_direction < 0)) {
                        params.loading_direction *= 0.5; // slow down gradually
                    }
                    WALLS.update_isotropic_wall(params, S);
                    // update_graph();
                }

                if (AUDIO.listener !== undefined) {
                    SPHERES.update_fixed_sounds(S, params);
                }

                SPHERES.draw_force_network(S, params, scene);

                S.cg_param_read_timestep(0);
                S.cg_process_timestep(0, false);
                // var grid = S.cg_get_gridinfo();
                let sigma_xx = S.cg_get_result(0, "TC", 0)[0];
                let sigma_yy = S.cg_get_result(0, "TC", 4)[0];
                let sigma_zz = S.cg_get_result(0, "TC", 8)[0];
                params.pressure = (sigma_xx + sigma_yy + sigma_zz) / 3
                let density = S.cg_get_result(0, "RHO", 0)[0];

                let packing_fraction = density / params.particle_density; // NOTE: THIS IS JUST A HACK --- REPLACE WITH REAL LOGIC
                let x = ((packing_fraction - 0.35) / (0.7 - 0.35));
                // let y = (pressure - params.unloading_stress) / (params.target_stress - params.unloading_stress); // value between 0 and 1
                let y = params.pressure / params.target_stress; // value between 0 and 1
                GRAPHS.update_data(x, y);//, data_point_colour);

                // console.log(packing_fraction)
                // console.log(density)
            }
        }


        controls.update();
        renderer.render(scene, camera);

        params.old_time = params.new_time;
    });
    // renderer.render( scene, camera );



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
        setup_CG();
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
    S.simu_interpret_command("boundary 2 WALL -" + String(0) + " " + String(2 * params.H));
    if (params.gravity === true) {
        S.simu_interpret_command("gravity 0 0 " + String(-9.81) + "0 ".repeat(params.dimension - 3))
    }
    else {
        S.simu_interpret_command("gravity 0 0 0 " + "0 ".repeat(params.dimension - 3))
    }
    // S.simu_interpret_command("auto location randomsquare");
    S.simu_interpret_command("auto location randomdrop");

    let tc = 1e-3;
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
    S.simu_interpret_command("set Mu_wall 0");
    S.simu_interpret_command("set damping 0.01");
    S.simu_interpret_command("set T 150");
    S.simu_interpret_command("set dt " + String(tc / 20));
    S.simu_interpret_command("set tdump 1000000"); // how often to calculate wall forces

    S.simu_finalise_init();
}

function setup_CG() {
    var cgparam = {};
    cgparam["file"] = [{ "filename": "none", "content": "particles", "format": "interactive", "number": 1 }];
    cgparam["boxes"] = [1, 1, 1];
    // cgparam["boundaries"]=[[-params.L,-params.L,-params.L],[params.L,params.L,params.L]] ;
    cgparam["boundaries"] = [
        [-params.L / 2., -params.L / 2., params.boxratio * params.L / 2.],
        [params.L / 2., params.L / 2., 3 * params.boxratio * params.L / 2.]];
    // [-params.L+params.r_max,-params.L+params.r_max,-params.L+params.r_max],
    // [ params.L-params.r_max, params.L-params.r_max, params.L-params.r_max]] ;

    cgparam["window size"] = params.L / 2.;
    cgparam["skip"] = 0;
    cgparam["max time"] = 1;
    cgparam["time average"] = "None";
    cgparam["fields"] = ["RHO", "TC"];
    cgparam["periodicity"] = [false, false, false];
    cgparam["window"] = "Lucy3D";
    cgparam["dimension"] = 3;


    // console.log(JSON.stringify(cgparam)) ;
    S.cg_param_from_json_string(JSON.stringify(cgparam));
    S.cg_setup_CG();
}

// main();
