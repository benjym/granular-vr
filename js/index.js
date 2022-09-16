import css from "../css/main.css";

// import * as THREE from 'three';
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import ImmersiveControls from '@depasquale/three-immersive-controls';
import * as CONTROLLERS from "./controllers";
import * as BUTTONS from "./buttons";

console.debug('Using threejs version ' + THREE.REVISION)

let container = document.createElement( 'div' );
document.body.appendChild( container );

let scene = new THREE.Scene();
// scene.background = new THREE.Color( 0xdddddd ); // revealjs background colour

// var intersected = [];
// var tempMatrix = new THREE.Matrix4(); // catching grains
let buttons = new THREE.Group();
let button_bgs = new THREE.Group();
// vive = false;

let camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000 ); // fov, aspect, near, far
// camera.position.set(5,5,2);
// camera.rotation.z = Math.PI/2.;

let renderer;
make_lights();
add_renderer();
BUTTONS.add_url_button('isotropic', 'Isotropic', [0,1.3,0], 1, controls, scene);
BUTTONS.add_url_button('triaxial',  'Triaxial',  [0,1.9,0], 1, controls, scene);

window.addEventListener( 'resize', onWindowResize, false );
animate();

function add_renderer() {
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    // renderer.setSize( container.offsetWidth, container.offsetHeight );
    renderer.xr.enabled = true;
    container.appendChild( renderer.domElement );
    // container.appendChild( WEBVR.createButton( renderer ) );
    const controls = new ImmersiveControls(camera, renderer, scene, {
        initialPosition: new THREE.Vector3(0, 1.6, 2),
        // moveSpeed: { keyboard: 0.05, vr: 0.025 }
    });
    
};

// function add_buttons() {
//     let fontsize = 0.25;
//     let vert_offset = 2.*fontsize;
//     let horiz_offset = 2;
//     let vert_initial_value = 1.6;
//     let horiz_initial_value = -0.75;
//     let loader = new FontLoader();
//     loader.load( 'resources/helvetiker_bold.typeface.json', function ( font ) {

//     let urls = ['isotropic', 'triaxial'];
//     let names = ['Isotropic', 'Triaxial'];

//         for ( var i=0;i<names.length;i++ ) {
//             var mat = new THREE.MeshStandardMaterial( { color: 0xe72564 } );
//             var geom = new TextGeometry( names[i], { font: font, size: fontsize, height: fontsize/5., } );
//             var button = new THREE.Mesh( geom, mat );

//             // button.rotation.y = Math.PI;
//             button.position.y = - 0.22*vert_offset;
//             button.position.x = horiz_initial_value;
//             button.position.z = 0.01;//horiz_initial_value + horiz_offset*i;
//             button.userData.url = urls[i];

//             var mat = new THREE.MeshStandardMaterial( { color: 0x333333 } );
//             var geom = new THREE.BoxGeometry( 0.9*horiz_offset,0.8*vert_offset, 0.1 );
//             var bg_current = new THREE.Mesh( geom, mat );
//             bg_current.userData.url = urls[i];
//             // bg_current.rotation.y = -Math.PI/2.;
//             bg_current.position.y = vert_initial_value + vert_offset*i;// - vert_offset*j;
//             // bg_current.position.x = 1.1*i;
//             // bg_current.position.z = horiz_initial_value + horiz_offset*i +  0.4*horiz_offset;
//             // bg_current.position.z = -0.01; //horiz_initial_value + horiz_offset*i +  0.4*horiz_offset;

//             bg_current.add(button);
//             button_bgs.add(bg_current);
//             // buttons.add(button);

//             const type = 'button';
//             bg_current.userData.type = type; // this sets up interaction group for controllers
//             button.userData.type = type; // this sets up interaction group for controllers

//             controls.interaction.selectStartHandlers[type] = CONTROLLERS.onRedirectButtonSelectStart;
//             controls.interaction.selectEndHandlers[type] = CONTROLLERS.onRedirectButtonSelectEnd;
//             // controls.interaction.selectableObjects.push(button);
//             controls.interaction.selectableObjects.push(bg_current);
//         }

//     });

//     // scene.add(buttons);
//     scene.add(button_bgs);
// }


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
    // THREE.VRController.update();
    // requestAnimationFrame( animate );
    renderer.setAnimationLoop( render );
};

function render() {
    controls.update();
    // cleanIntersected();
    // intersectObjects( controller1 );
    // intersectObjects( controller2 );
    renderer.render( scene, camera );
};
