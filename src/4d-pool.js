import css from "../css/main.css";
import pool_css from "../css/pool.css";
import track from "../text-to-speech/4d-pool.mp3";
import table from "../resources/4d-pool.stl";

import * as THREE from "three";
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
// import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';

import * as SPHERES from "../libs/SphereHandler.js"
// import * as WALLS from "../libs/WallHandler.js"
// import * as LAYOUT from '../libs/Layout.js'
import { NDSTLLoader, renderSTL } from '../libs/NDSTLLoader.js';

import * as CONTROLLERS from '../libs/controllers.js';
import * as BUTTONS from "../libs/buttons";
import * as POOLCUE from '../libs/PoolCue.js';
import * as AUDIO from '../libs/audio.js';
import * as LIGHTS from "../libs/lights";

// import { PoolTableShader } from '../libs/PoolTableShader.js';

const N_tag = document.createElement("div");
N_tag.id = "N_tag";
N_tag.innerHTML = "0";
document.body.appendChild(N_tag)

// const hit_me = document.createElement("div");
// hit_me.id = "hit_me";
// hit_me.innerHTML = "Shoot";
// document.body.appendChild(hit_me)

// const web_instructions = document.createElement("div");
// web_instructions.id = "web_instructions";
// web_instructions.innerHTML = "Press Enter to shoot.";
// document.body.appendChild(web_instructions)

var urlParams = new URLSearchParams(window.location.search);

import { camera, scene, renderer, controls, clock } from "./index";

let gui;
let S;
let x;
let NDsolids, material, STLFilename;
let meshes;
var direction = new THREE.Vector3();
// const mouse = new THREE.Vector2();

var params = {
    radius: 0.05,
    dimension: 4,
    L1: 2,
    L2: 0.1,  // this is the direction of gravity
    L3: 1,
    L4: 0.5,
    pocket_size: 0.15,
    pyramid_size: 5,
    d4: { cur: 0, min: -0.5, max: 0.5 },
    particle_density: 2700,
    track_white_ball: true,
    strength: 0.5,
    quality: 7,
    dt: 1e-3,
    table_height: 1.,
    lut: 'None',
    audio: false,
}

params.N = get_num_particles(params.pyramid_size);
if (urlParams.has('vr') || urlParams.has('VR')) {
    params.vr = true;
    params.N_real = params.N + 1;
}
else {
    params.vr = false;
    params.N_real = params.N;
}

params.d4.min = -params.L4;
params.d4.max = params.L4;

params.particle_volume = Math.PI * Math.PI * Math.pow(params.radius, 4) / 2.;
params.particle_mass = params.particle_volume * params.particle_density;

let sunk_balls = [];

export async function init() {
    SPHERES.createNDParticleShader(params).then(main());
}

// SPHERES.createNDParticleShader(params);

// const startButton = document.getElementById( 'startButton' );
// startButton.addEventListener( 'click', init );

async function main() {

    // const overlay = document.getElementById( 'overlay' );
    // overlay.remove();

    await NDDEMPhysics();

    // camera = new THREE.PerspectiveCamera( 15, window.innerWidth / window.innerHeight, 0.1, 1000 );
    // camera.position.set( 3*params.L1, 2*params.L1 + params.table_height, 0 );

    // camera.up.set(0, 0, 1);

    // scene = new THREE.Scene();

    const base_geometry = new THREE.PlaneGeometry(4 * params.L1, 2 * params.L3 + 2 * params.L1);
    const base_material = new THREE.MeshBasicMaterial({ color: 0x333333, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(base_geometry, base_material);
    plane.rotateX(Math.PI / 2.);
    scene.add(plane);

    // scene.background = new THREE.Color( 0x111111 );
    // const gridHelper = new THREE.GridHelper(10, 10);
    // scene.add(gridHelper);

    // const ambientLight = new THREE.AmbientLight(0x404040);
    // scene.add(ambientLight);

    // const dirLight = new THREE.DirectionalLight(0xFFFFFF, 1);
    // dirLight.position.set(0, 3, 0);
    // dirLight.castShadow = true;
    // scene.add(dirLight);

    // dirLight.shadow.mapSize.width = 2 * 1024;
    // dirLight.shadow.mapSize.height = 2 * 1024;

    LIGHTS.add_default_lights(scene);

    SPHERES.add_pool_spheres(S, params, scene);

    STLFilename = './4d-pool.stl'; // this one has crap pockets
    // STLFilename = './stls/4d-pool-no-holes.stl';
    // const texture = new THREE.TextureLoader().load( 'textures/golfball.jpg', function(t) {
    // t.encoding = THREE.sRGBEncoding;
    // t.mapping = THREE.EquirectangularReflectionMapping;
    // } );
    material = new THREE.MeshStandardMaterial({
        color: 0x00aa00,
        roughness: 1,
        // map: texture,
    });
    // material.wireframe = true;

    loadSTL();

    add_table_legs();

    // renderer = new THREE.WebGLRenderer( { antialias: true } );
    // renderer.setPixelRatio( window.devicePixelRatio );
    // renderer.setSize( window.innerWidth, window.innerHeight );
    // renderer.shadowMap.enabled = true;
    // renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // // renderer.outputEncoding = THREE.sRGBEncoding;
    // document.body.appendChild( renderer.domElement );

    // if ( params.vr ) {
    // document.body.appendChild( VRButton.createButton( renderer ) );
    // renderer.xr.enabled = true;
    // CONTROLLERS.add_controllers(renderer, scene, params);

    // }

    // gui
    gui = new GUI();
    gui.width = 400;

    gui.add(params.d4, 'cur', -params.L4, params.L4, 0.001).name('D4 location (e/q)').listen();
    gui.add(params, 'strength', 0, 1, 0.01).name('Strength (r/f)').listen().onChange(() => {
        // SPHERES.ray.scale.y = 2 * params.strength;
    });
    gui.add(params, 'track_white_ball').name('Track white ball (Space)').listen();
    gui.add(params, 'audio').name('Audio').listen().onChange(() => {
        if (params.audio) {
            AUDIO.make_listener(camera);
            // SPHERES.add_normal_sound_to_all_spheres();
        }
        // NOTE: NEED TO MAKE A DESTRUCTOR!
    });
    // const controls = new OrbitControls( camera, renderer.domElement );
    // controls.target.y = params.table_height-params.L2;
    // controls.update();

    // document.getElementById('hit_me').hidden = true;
    // document.getElementById("web_instructions").hidden = false;

    // }

    // window.addEventListener('keypress', onSelectParticle, false);

    // if ( params.vr ) {
    //     POOLCUE.add_pool_cue( CONTROLLERS.controller1 );
    //     CONTROLLERS.add_torus( CONTROLLERS.controller2, params ).then(() => {
    //         SPHERES.add_spheres_to_torus(params, CONTROLLERS.torus1);
    //     });

    // }

    BUTTONS.add_scene_change_button('menu', 'Main menu', controls, scene, [-1.5, 1, 1.5], 0.25, [0, Math.PI / 4, 0]);
    // BUTTONS.add_scene_change_button('hyperspheres', 'What is a hypersphere?', controls, scene, [1, 1, 1], 0.25, [0,-Math.PI/4,0]);


    update_scoreboard();

    renderer.setAnimationLoop(function () {
        update();
        renderer.render(scene, camera);
        CONTROLLERS.moveInD4(params, controls);
    });

    AUDIO.play_track('4d-pool.mp3', camera, 3000);
}

function hit_white_ball() {
    var work = params.strength;
    var force = work / params.dt;
    S.simu_setExternalForce(0, 1, [force * direction.x, force * direction.z, 0, force * direction.d4]);
}

function onSelectParticle(event) {
    if (event.key === 'Enter') {
        hit_white_ball();
    }
    if (event.code === 'Space') {
        event.preventDefault(); // stop page from skipping downwards
        params.track_white_ball = !params.track_white_ball;
    }
    else if (event.key === "e") {
        params.track_white_ball = false;
        if (params.d4.cur < params.d4.max) {
            params.d4.cur += 0.1 * params.radius;
            replace_meshes();
        }
    }
    else if (event.key === "q") {
        params.track_white_ball = false;
        if (params.d4.cur > params.d4.min) {
            params.d4.cur -= 0.1 * params.radius;
            replace_meshes();
        }
    }
    else if (event.key === "f") {
        if (params.strength > 0) {
            params.strength -= 0.01;
        }
    }
    else if (event.key === "r") {
        params.strength += 0.01;
    }
}


// function onWindowResize(){

//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();

//     renderer.setSize( window.innerWidth, window.innerHeight );

//     if ( isMobile ) {
//         gui.width = window.innerWidth - 30;
//     }

// }

function add_table_legs() {
    let thickness = 2 * params.radius;
    let cylinder = new THREE.CylinderGeometry(thickness, thickness, 0.98 * (params.table_height - params.L2), Math.pow(2, params.quality), Math.pow(2, params.quality));
    let material = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });

    let leg = new THREE.Mesh(cylinder, material);
    leg.position.set(0.75 * (-params.L1 + thickness), (params.table_height - params.L2) / 2., -params.L3 + thickness);
    scene.add(leg.clone());
    leg.position.set(0.75 * (params.L1 - thickness), (params.table_height - params.L2) / 2., -params.L3 + thickness);
    scene.add(leg.clone());
    leg.position.set(0.75 * (-params.L1 + thickness), (params.table_height - params.L2) / 2., params.L3 - thickness);
    scene.add(leg.clone());
    leg.position.set(0.75 * (params.L1 - thickness), (params.table_height - params.L2) / 2., params.L3 - thickness);
    scene.add(leg);

}

function update() {

    SPHERES.move_spheres(S, params);
    if (params.audio) {
        SPHERES.update_fixed_sounds(S, params);
    }

    if (params.vr) {
        params.track_white_ball = false;
        // SPHERES.move_spheres_on_torus(params,CONTROLLERS.torus1);
        // if ( CONTROLLERS.controller2.userData.isSqueezing ) { params = CONTROLLERS.update_higher_dims(CONTROLLERS.controller2, params) }

        let end_of_pool_cue = new THREE.Vector3();

        POOLCUE.small_sphere.getWorldPosition(end_of_pool_cue);
        let nice_d4 = clamp(params.d4.cur, params.d4.min, params.d4.max);

        S.simu_fixParticle(params.N, [end_of_pool_cue.x,
        end_of_pool_cue.y,
        end_of_pool_cue.z,
            nice_d4]);
    }
    // console.log(controls.player.position)
    direction.copy(SPHERES.spheres.children[0].position);
    direction.sub(controls.player.position);
    let d4offset = params.d4.cur - SPHERES.x[0][3];
    var l = Math.sqrt(direction.x * direction.x + direction.z * direction.z + d4offset * d4offset);
    direction.x /= l;
    // direction.y /= l;
    direction.z /= l;
    direction.d4 = d4offset / l;

    // SPHERES.ray.rotation.x = -Math.atan2(direction.z, direction.x);
    // console.log(SPHERES.spheres.children[0].position)
    // console.log(direction)

    S.simu_step_forward(20);

    check_pockets();

    if (params.track_white_ball) {
        if (NDsolids !== undefined) {
            x = S.simu_getX();
            if (params.d4.cur !== x[0][3]) {
                params.d4.cur = x[0][3];
                replace_meshes();
            }
        }
    }

    controls.update();

}

let pocket_locs = [
    [-params.L1, -params.L3],
    [-params.L1, params.L3],
    [params.L1, -params.L3],
    [params.L1, params.L3],
    [0, -params.L3],
    [0, params.L3],
];

function in_pocket(loc) {
    let retval = false;

    // should work for actual pockets:
    // if ( x[1] < params.table_height ) {
    //     console.log('fallen off table (hopefully out of a hole)')
    //     retval = true;
    // }

    pocket_locs.forEach(pocket => {
        if (Math.pow(loc[0] - pocket[0], 2) + Math.pow(loc[1] - pocket[1], 2) < params.pocket_size * params.pocket_size) {
            console.log('fallen off table (hopefully out of a hole)')
            retval = true;
        }
    });
    return retval;
}

function check_pockets() {
    for (let i = 0; i < params.N; i++) {
        var object = SPHERES.spheres.children[i];
        if (!(i in sunk_balls)) {
            if (in_pocket(SPHERES.x[i])) {
                if (i == 0) {
                    console.log('sunk white ball')
                    S.simu_fixParticle(0, params.white_ball_initial_loc)
                }
                else if (i == 11) {
                    console.log('sunk black ball')
                    if (sunk_balls.length < params.N - 1) {
                        alert('You need to sink all of the coloured balls before the black ball. You lose.')
                    } else {
                        alert('You win!')
                    }
                    set_ball_positions();
                }
                else {
                    console.log('SUNK BALL ' + String(i))
                    // object.visible = false;
                    sunk_balls.push(i)
                    S.simu_fixParticle(i, [1.1 * params.L1, params.table_height, sunk_balls.length * 2 * params.radius, 0])
                    S.simu_setFrozen(i);

                    update_scoreboard();
                }
            }
        }
    }
}

async function NDDEMPhysics() {

    await DEMCGND().then((NDDEMCGLib) => {
        if (params.dimension == 3) {
            S = new NDDEMCGLib.DEMCG3D(params.N_real);
        } else if (params.dimension == 4) {
            S = new NDDEMCGLib.DEMCG4D(params.N_real);
        } else if (params.dimension == 5) {
            S = new NDDEMCGLib.DEMCG5D(params.N_real);

        }
        finish_setup();

        // // overload for old DEMND instead of DEMCGND
        // S.simu_getRadii = S.getRadii;
        // S.simu_getX = S.getX;
        // S.simu_getOrientation = S.getOrientation;
        // S.simu_getVelocity = S.getVelocity;
        // S.simu_getContactInfos = S.getContactInfos;

    });


    function finish_setup() {
        S.simu_interpret_command("dimensions " + String(params.dimension) + " " + String(params.N_real));

        S.simu_interpret_command("radius -1 " + String(params.radius));
        // now need to find the mass of a particle with diameter 1

        S.simu_interpret_command("mass -1 " + String(params.particle_mass));
        S.simu_interpret_command("auto rho");
        S.simu_interpret_command("auto mass");
        S.simu_interpret_command("auto inertia");
        S.simu_interpret_command("auto skin");

        S.simu_interpret_command("boundary 0 WALL -" + String(params.L1) + " " + String(params.L1));
        S.simu_interpret_command("boundary 1 WALL -" + String(params.L3) + " " + String(params.L3));
        S.simu_interpret_command("boundary 2 WALL " + String(-params.L2 + params.table_height) + " " + String(params.L2 + params.table_height));
        S.simu_interpret_command("boundary 3 WALL -" + String(params.L4) + " " + String(params.L4));
        // S.interpret_command("body " + STLFilename);
        S.simu_interpret_command("gravity 0 0 -9.81 0");
        // S.interpret_command("auto location randomdrop");

        set_ball_positions();

        let tc = 20 * params.dt;
        let rest = 0.5; // super low restitution coeff to dampen out quickly
        let vals = SPHERES.setCollisionTimeAndRestitutionCoefficient(tc, rest, params.particle_mass)

        S.simu_interpret_command("set Kn " + String(vals.stiffness));
        S.simu_interpret_command("set Kt " + String(0.8 * vals.stiffness));
        S.simu_interpret_command("set GammaN " + String(vals.dissipation));
        S.simu_interpret_command("set GammaT " + String(vals.dissipation));
        S.simu_interpret_command("set Mu 0.1");
        S.simu_interpret_command("set Mu_wall 0.5");
        S.simu_interpret_command("set damping 6e-4");
        S.simu_interpret_command("set T 150");
        S.simu_interpret_command("set dt " + String(params.dt));
        S.simu_interpret_command("set tdump 1000000"); // how often to calculate wall forces
        S.simu_finalise_init();
    }
}

function set_ball_positions() {
    let n = 1;
    let offset = params.L1 / 2;

    params.white_ball_initial_loc = [offset, 0, params.table_height - params.L2 + params.radius, 0.001 * (Math.random() - 0.5)];
    S.simu_interpret_command("location " + String(0) + " "
        + String(params.white_ball_initial_loc[0]) + " "
        + String(params.white_ball_initial_loc[1]) + " "
        + String(params.white_ball_initial_loc[2]) + " "
        + String(params.white_ball_initial_loc[3])); // first ball is the white ball

    for (var k = 0; k < params.pyramid_size; k++) {
        let cur_pyramid_length = params.pyramid_size - k;
        let w = k * 1.825 * params.radius;
        for (var i = 0; i < cur_pyramid_length; i++) {
            for (var j = 0; j < cur_pyramid_length - i; j++) {
                let x = i * 1.82 * params.radius - cur_pyramid_length * params.radius + params.radius - offset;
                let y = j * 2.01 * params.radius - (cur_pyramid_length - i) * params.radius + params.radius;// - i%2*radius;
                S.simu_interpret_command("location " + String(n) + " " + String(x) + " " + String(y) + " " + String(params.table_height - params.L2 + params.radius) + " " + String(w));
                n++;
                if (k > 0) { S.simu_interpret_command("location " + String(n) + " " + String(x) + " " + String(params.table_height - params.L2 + params.radius) + " " + String(y) + " " + String(-w)); n++; }

            }
        }
    }

    // add the cue stick
    if (params.vr) {
        S.simu_interpret_command("location " + String(params.N) + " 0 0 0 0");

        // let pool_cue_particle_volume = Math.PI*Math.PI*Math.pow(POOLCUE.small_end_radius,4)/2.;
        // let pool_cue_particle_mass = params.particle_volume * params.particle_density/1e3;
        // S.setRadius(params.N, POOLCUE.small_end_radius);
        // S.setMass(params.N, params.particle_mass/10.);
    }
}

function loadSTL() {
    meshes = new THREE.Group;
    const loader = new NDSTLLoader();
    loader.load([STLFilename], function (solids) {
        NDsolids = solids;
        replace_meshes();
    })
}

function replace_meshes() {
    if (NDsolids.length > 0) {
        if (meshes !== undefined) {
            scene.remove(meshes);
            dispose_children(meshes);
            meshes = new THREE.Group();
        }
        meshes = renderSTL(meshes, NDsolids, scene, material, params.d4.cur);
        meshes.position.y = params.table_height;
        scene.add(meshes);
    }
}

function update_scoreboard() {
    let board = document.getElementById('N_tag');
    board.innerHTML = String(params.N - sunk_balls.length); //+ ' to go';
}

function get_num_particles(L) {
    let N = 0;
    let i = 1;
    for (var n = L; n > 0; n--) {
        N += i * n;
        i += 2;
    }
    return N + 1; // adding the white ball
}

function clamp(a, min, max) {
    if (a < min) { return min }
    else if (a > max) { return max }
    else { return a }
}

function dispose_children(target) {
    for (var i = 0; i < target.children.length; i++) {
        target.children[i].geometry.dispose();
        target.children[i].material.dispose();
    }
}
