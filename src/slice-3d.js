import css from "../css/main.css";
import track from "../text-to-speech/slice-3d.mp3";
// import * as DEMCGND from "../resources/DEMCGND.js";

import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
// import ImmersiveControls from '@depasquale/three-immersive-controls';

import * as CONTROLLERS from '../libs/controllers.js';
// import * as SPHERES from "../libs/SphereHandler.js"
// import * as WALLS from "../libs/WallHandler.js"
import * as BUTTONS from "../libs/buttons";
// import * as GRAPHS from "../libs/graphs";
// import * as AUDIO from "../libs/audio";
import * as LIGHTS from "../libs/lights";

import { camera, scene, renderer, controls, clock, apps, NDDEMCGLib } from "./index";


// let scene, renderer, controls, camera

let params = {
    'd4': {
        'cur': 0,
        'min': -1,
        'max': 1
    }
};

function update_spheres(x, circle, wall) {
    let R_draw = 2 * Math.sqrt(0.5 * 0.5 - x * x);
    circle.scale.set(R_draw, R_draw, R_draw);
    wall.position.x = x;
};

export function init() {

    // scene = new THREE.Scene();
    // scene.background = new THREE.Color( 0x111111 );
    // camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

    // renderer = new THREE.WebGLRenderer();
    // controls = new ImmersiveControls(camera, renderer, scene, {
    //     initialPosition: new THREE.Vector3(0, 1.6, 2),
    //     // moveSpeed: { keyboard: 0.025, vr: 0.025 }
    // });
    // renderer.setPixelRatio( window.devicePixelRatio );
    // renderer.setSize( window.innerWidth, window.innerHeight );
    // renderer.shadowMap.enabled = true;
    // let container = document.createElement("container");
    // document.body.appendChild(container);
    // container.appendChild( renderer.domElement );

    LIGHTS.add_default_lights(scene);


    let sphere_geometry = new THREE.SphereGeometry(0.5, 256, 256);
    let circle_geometry = new THREE.CircleGeometry(0.5, 256);
    let wall_geometry = new THREE.PlaneBufferGeometry(0.5, 0.5);
    let material = new THREE.MeshStandardMaterial({ color: 0xeeeeee, side: THREE.DoubleSide });//, opacity: 0.9 } );
    // material.transparent = true;
    let wall_material = new THREE.MeshStandardMaterial({ color: 0xe72564, side: THREE.DoubleSide });

    const base_geometry = new THREE.PlaneGeometry(10, 10);
    const base_material = new THREE.MeshBasicMaterial({ color: 0x333333, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(base_geometry, base_material);
    plane.rotateX(Math.PI / 2.);
    plane.remove_me = true;
    scene.add(plane);

    let sphere = new THREE.Mesh(sphere_geometry, material);
    let circle = new THREE.Mesh(circle_geometry, material);
    let wall = new THREE.Mesh(wall_geometry, wall_material);
    sphere.position.x = 0
    circle.position.x = 3
    circle.visible = true;
    wall.rotation.y = Math.PI / 2.;
    wall.position.x = params.d4.cur;
    wall.scale.set(4, 4, 4);

    let objects = new THREE.Group();

    objects.add(sphere);
    objects.add(circle);
    objects.add(wall);

    objects.position.x = -1.5;
    objects.position.y = 1.6;
    objects.remove_me = true;

    scene.add(objects);

    let gui = new GUI();
    gui.add(params.d4, 'cur').min(params.d4.min).max(params.d4.max).step(0.01).listen().name('Slice').onChange(function (val) { update_spheres(val, circle, wall); });
    gui.remove_me = true;

    // AUDIO.play_track('slice-3d.mp3', scene, 3000);

    BUTTONS.add_scene_change_button(apps.list[apps.current - 1].url, 'Back: ' + apps.list[apps.current - 1].name, controls, scene, [-1, 1, 1], 0.25, [0, Math.PI / 4, 0]);
    setTimeout(() => { BUTTONS.add_scene_change_button(apps.list[apps.current + 1].url, 'Next: ' + apps.list[apps.current + 1].name, controls, scene, [1, 1, 1], 0.25, [0, -Math.PI / 4, 0]) }, apps.list[apps.current].button_delay);


    renderer.setAnimationLoop(function () {
        if (controls !== undefined) {
            controls.update();
            params = CONTROLLERS.moveInD4(params, controls); // acctually moving in D3...
            update_spheres(params.d4.cur, circle, wall);
        }
        renderer.render(scene, camera);
    });
};

// if ( BUTTONS.font === undefined ) {
//     setTimeout(init, 200);
// } else {
//     init();
// }

// window.addEventListener( 'resize', onWindowResize, false );

// function onWindowResize() {
//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
//     renderer.setSize( window.innerWidth, window.innerHeight );
//     // if ( controls !== undefined) { controls.handleResize(); }
// };