import css from "../css/main.css";

import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import ImmersiveControls from '@depasquale/three-immersive-controls';
import * as CONTROLLERS from "./controllers";
import * as BUTTONS from "./buttons";

let scene, container, renderer, camera;

function main() {
    console.debug('Using threejs version ' + THREE.REVISION)

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    scene = new THREE.Scene();
    // scene.background = new THREE.Color( 0xdddddd ); // revealjs background colour

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000 ); // fov, aspect, near, far

    make_lights();
    add_renderer();
    BUTTONS.add_url_button('isotropic', 'Isotropic', [0,1.3,0], 1, controls, scene);
    BUTTONS.add_url_button('triaxial',  'Triaxial',  [0,1.9,0], 1, controls, scene);

    window.addEventListener( 'resize', onWindowResize, false );
    animate();
}


function add_renderer() {
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.xr.enabled = true;
    container.appendChild( renderer.domElement );
    const controls = new ImmersiveControls(camera, renderer, scene, {
        initialPosition: new THREE.Vector3(0, 1.6, 2),
        // moveSpeed: { keyboard: 0.05, vr: 0.025 }
    });
    
};

function make_lights() {
    var background_light = new THREE.AmbientLight( 0xFFFFFF );
    scene.add( background_light );
}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    render();
};

function animate() {
    renderer.setAnimationLoop( render );
};

function render() {
    controls.update();
    renderer.render( scene, camera );
};

main();