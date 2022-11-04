import css from "../css/main.css";
// import loading_css from "../css/loading_screen.css";

// import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
// import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import ImmersiveControls from '@depasquale/three-immersive-controls';
// import * as CONTROLLERS from "../libs/controllers";
import * as BUTTONS from "../libs/buttons";
// import * as AUDIO from "../libs/audio";

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
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.xr.enabled = true;
    container.appendChild( renderer.domElement );
    controls = new ImmersiveControls(camera, renderer, scene, {
        initialPosition: new THREE.Vector3(0, 1.6, 1),
        // mouseControls: true,
        // moveSpeed: { keyboard: 0.05, vr: 0.025 }
    });
    // BUTTONS.add_url_button('isotropic', 'Isotropic', [0,1.3,0], 1, controls, scene);
    // BUTTONS.add_url_button('triaxial',  'Triaxial',  [0,1.9,0], 1, controls, scene);
    BUTTONS.add_url_button('hyperspheres.html', '1. What is a hypersphere?', controls, scene, [0,2.2,0], 0.3, [0,0,0]);
    BUTTONS.add_url_button('slice-3d.html', '2. Slicing space', controls, scene, [0,2.0,0], 0.3, [0,0,0]);
    BUTTONS.add_url_button('slice-4d.html', '3. Intro to 4D', controls, scene, [0,1.8,0], 0.3, [0,0,0]);
    BUTTONS.add_url_button('rotation.html?dimension=3', '4. Rotation in 3D', controls, scene, [0,1.6,0], 0.3, [0,0,0]);
    BUTTONS.add_url_button('rotation.html?dimension=4', '5. Rotation in 4D', controls, scene, [0,1.4,0], 0.3, [0,0,0]);
    BUTTONS.add_url_button('pyramid.html', '6. Pyramid', controls, scene, [0,1.2,0], 0.3, [0,0,0] );
    BUTTONS.add_url_button('4d-pool.html', '7. 4D pool', controls, scene, [0,1.0,0], 0.3, [0,0,0] );

    window.addEventListener( 'resize', onWindowResize, false );
    
    renderer.setAnimationLoop( render );
}

function init() {
    if ( BUTTONS.font === undefined ) {
        setTimeout(init, 200);
    } else {
        main();
    }
}


function add_renderer() {
    
    
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

function render() {
    controls.update();
    renderer.render( scene, camera );
};

init();