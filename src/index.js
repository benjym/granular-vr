import css from "../css/main.css";

// import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
// import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import ImmersiveControls from '@depasquale/three-immersive-controls';
// import * as CONTROLLERS from "../libs/controllers";
import * as BUTTONS from "../libs/buttons";

let scene, container, renderer, camera, controls;

function main() {
    console.debug('Using threejs version ' + THREE.REVISION)

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    scene = new THREE.Scene();
    // scene.background = new THREE.Color( 0xdddddd ); // revealjs background colour

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000 ); // fov, aspect, near, far

    make_lights();
    add_renderer();
    // BUTTONS.add_url_button('isotropic', 'Isotropic', [0,1.3,0], 1, controls, scene);
    // BUTTONS.add_url_button('triaxial',  'Triaxial',  [0,1.9,0], 1, controls, scene);
    BUTTONS.add_url_button('hyperspheres', '1. What is a hypersphere?', [0,2.1,0], 0.3, controls, scene);
    BUTTONS.add_url_button('slice-3d', '2. Slicing space', [0,1.9,0], 0.3, controls, scene);
    BUTTONS.add_url_button('slice-4d', '3. Intro to 4D', [0,1.7,0], 0.3, controls, scene);
    BUTTONS.add_url_button('rotation-matrix?dimension=3', '4. Seeing 3D surfaces', [0,1.5,0], 0.3, controls, scene);
    BUTTONS.add_url_button('rotation-matrix?dimension=4', '5. Seeing 4D surfaces', [0,1.5,0], 0.3, controls, scene);
    BUTTONS.add_url_button('pyramid', '6. Pyramid', [0,1.3,0], 0.3, controls, scene);
    BUTTONS.add_url_button('4d-pool', '7. 4D pool', [0,1.1,0], 0.3, controls, scene);

    window.addEventListener( 'resize', onWindowResize, false );
    animate();
}


function add_renderer() {
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.xr.enabled = true;
    container.appendChild( renderer.domElement );
    controls = new ImmersiveControls(camera, renderer, scene, {
        initialPosition: new THREE.Vector3(0, 1.6, 1),
        mouseControls: true,
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