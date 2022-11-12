import css from "../css/main.css";
import track1 from "../text-to-speech/rotation-3d.mp3";
// import track2 from "../text-to-speech/rotation-4d.mp3";

// import ImmersiveControls from '@depasquale/three-immersive-controls';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';

// import * as CONTROLLERS from '../libs/controllers.js';
import * as SPHERES from "../libs/SphereHandler.js"
import * as BUTTONS from "../libs/buttons";
import * as AUDIO from "../libs/audio";
import * as LIGHTS from "../libs/lights";

// var urlParams = new URLSearchParams(window.location.search);
// var clock = new THREE.Clock();

// let camera, scene, renderer, controls, S;
import { camera, scene, renderer, controls, clock } from "./index";
let S;

var params = {
    dimension: 3,
    radius: 0.5,
    L: 500, //system size
    // d4: {cur:0, min:-1, max:1},
    lut: 'None',
    quality: 7,
}

params.N = params.dimension * (params.dimension - 1) / 2;

// if ( urlParams.has('dimension') ) {
//     params.dimension = parseInt(urlParams.get('dimension'));
// }

// if ( params.dimension === 3 ) {
//     params.N = 3;
// }

export function init() {
    SPHERES.createNDParticleShader(params).then(() => {
        // if ( BUTTONS.font === undefined ) {
        // setTimeout(main, 200);
        // } else {
        main();
        // }
    });
}

async function main() {

    await NDDEMCGPhysics();

    // // camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000 );
    // var aspect = window.innerWidth / window.innerHeight;
    // camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

    // scene = new THREE.Scene();
    // scene.background = new THREE.Color( 0x111 );

    LIGHTS.add_default_lights(scene);
    // const hemiLight = new THREE.AmbientLight();
    // hemiLight.intensity = 0.35;
    // scene.add( hemiLight );
    // //
    // const dirLight = new THREE.DirectionalLight();
    // dirLight.position.set( 5, -5, -5 );
    // dirLight.castShadow = true;
    // scene.add( dirLight );

    const base_geometry = new THREE.PlaneGeometry(10, 10);
    const base_material = new THREE.MeshBasicMaterial({ color: 0x333333, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(base_geometry, base_material);
    plane.rotateX(Math.PI / 2.);
    scene.add(plane);

    SPHERES.add_spheres(S, params, scene);

    // renderer = new THREE.WebGLRenderer( { antialias: true } );
    // renderer.setPixelRatio( window.devicePixelRatio );
    // renderer.setSize( window.innerWidth, window.innerHeight );

    // var container = document.getElementById( 'canvas' );
    // container.appendChild( renderer.domElement );

    if (params.dimension == 4) {
        let gui = new GUI();
        gui.width = 320;
        gui.add(params.d4, 'cur', -params.radius, params.radius, 0.001).name('D4 location').listen()
    }

    let circle;
    if (params.dimension === 3) {
        var circle_geometry = new THREE.CircleGeometry(0.5, 256);
        const loader = new THREE.TextureLoader();

        const circle_material = new THREE.MeshBasicMaterial({
            color: 0xFFFFFF,
            map: loader.load('resources/usyd.png'),
        });
        circle = new THREE.Mesh(circle_geometry, circle_material);
        circle.position.y = 2.2;
        scene.add(circle);
    }

    // window.addEventListener( 'resize', onWindowResize, false );

    // controls = new ImmersiveControls(camera, renderer, scene, {
    //     initialPosition: new THREE.Vector3(0, 1.6, 2),
    //     // moveSpeed: { keyboard: 0.025, vr: 0.025 }
    // });

    BUTTONS.add_scene_change_button('menu', 'Main menu', controls, scene, [-1, 1, 1], 0.25, [0, Math.PI / 4, 0]);
    if (params.dimension === 3) {
        BUTTONS.add_scene_change_button('rotation-4d', 'Seeing 4D surfaces', controls, scene, [1, 1, 1], 0.25, [0, -Math.PI / 4, 0]);
        AUDIO.play_track('rotation-3d.mp3', camera, 5000);
    } else if (params.dimension === 4) {
        BUTTONS.add_scene_change_button('pyramid', 'Pyramid', controls, scene, [1, 1, 1], 0.25, [0, -Math.PI / 4, 0]);
        AUDIO.play_track('rotation-4d.mp3', camera, 5000);
    }

    renderer.setAnimationLoop(function () {
        if (controls !== undefined) { controls.update(); }
        S.simu_step_forward(5);
        SPHERES.move_spheres(S, params);
        renderer.render(scene, camera);
        if (circle !== undefined) { circle.rotateZ(clock.getDelta() * Math.PI / 2.) }
    });
}



// function onWindowResize(){

//     var aspect = window.innerWidth / window.innerHeight;
//     renderer.setSize( window.innerWidth, window.innerHeight );
// }

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
        S.simu_interpret_command("radius -1 0.45");
        S.simu_interpret_command("mass -1 1");
        S.simu_interpret_command("auto rho");
        S.simu_interpret_command("auto inertia");

        S.simu_interpret_command("boundary 0 PBC -" + String(params.L) + " " + String(params.L));
        S.simu_interpret_command("boundary 1 PBC -" + String(params.L) + " " + String(params.L));
        S.simu_interpret_command("boundary 2 PBC -" + String(params.L) + " " + String(params.L));
        S.simu_interpret_command("gravity 0 0 " + "0 ".repeat(params.dimension - 3))

        if (params.dimension == 4) {
            S.simu_interpret_command("boundary 3 PBC -" + String(params.L) + " " + String(params.L));

            S.simu_interpret_command("location 0 -1 0 1 0");
            S.simu_interpret_command("location 1 0 0 1 0");
            S.simu_interpret_command("location 2 1 0 1 0");
            S.simu_interpret_command("location 3 -1 0 2 0");
            S.simu_interpret_command("location 4 0 0 2 0");
            S.simu_interpret_command("location 5 1 0 2 0");
            S.simu_interpret_command("omega 4 0.1 0 0 0 0 0");
            S.simu_interpret_command("omega 5 0 0.1 0 0 0 0");
            S.simu_interpret_command("omega 0 0 0 0.1 0 0 0");
            S.simu_interpret_command("omega 3 0 0 0 0.1 0 0");
            S.simu_interpret_command("omega 1 0 0 0 0 0.1 0");
            S.simu_interpret_command("omega 2 0 0 0 0 0 0.1");
        }
        else if (params.dimension === 3) {
            S.simu_interpret_command("location 0 -1 0 1 0");
            S.simu_interpret_command("location 1 0 0 1 0");
            S.simu_interpret_command("location 2 1 0 1 0");
            S.simu_interpret_command("omega 0 0 0.1 0");
            S.simu_interpret_command("omega 1 0.1 0 0");
            S.simu_interpret_command("omega 2 0 0 0.1");
        }

        let tc = 0.5;
        let rest = 0.5; // super low restitution coeff to dampen out quickly
        let vals = SPHERES.setCollisionTimeAndRestitutionCoefficient(tc, rest, params.particle_mass)

        S.simu_interpret_command("set Kn 0");// + String(vals.stiffness));
        S.simu_interpret_command("set Kt 0");// + String(0.8*vals.stiffness));
        S.simu_interpret_command("set GammaN " + String(vals.dissipation));
        S.simu_interpret_command("set GammaT " + String(vals.dissipation));
        S.simu_interpret_command("set Mu 0");
        // S.simu_interpret_command("set damping 10");
        S.simu_interpret_command("set T 150");
        S.simu_interpret_command("set dt " + String(tc / 10));
        S.simu_interpret_command("set tdump 1000000"); // how often to calculate wall forces
        S.simu_interpret_command("auto skin");
        S.simu_finalise_init();

    }
}
