import css from "../css/main.css";
// import * as DEMCGND from "../resources/DEMCGND.js";

import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import ImmersiveControls from '@depasquale/three-immersive-controls';

import * as CONTROLLERS from '../libs/controllers.js';
import * as SPHERES from "../libs/SphereHandler.js"
import * as WALLS from "../libs/WallHandler.js"
import * as BUTTONS from "../libs/buttons";
import * as GRAPHS from "../libs/graphs";
import * as AUDIO from "../libs/audio";

const urlParams = new URLSearchParams(window.location.search);

let container = document.createElement("div");
document.body.appendChild(container);

function update_spheres(x) {
    var R_draw = Math.sqrt(0.5 - Math.abs(x));
    if ( R_draw == 0 ) { circle.visible = false; }
    else {
        circle.visible = true;
        circle.scale.set(R_draw,R_draw,R_draw);
    };

    wall.position.x = x;
};

var slice = {'loc':-1};
var scene = new THREE.Scene();
scene.background = new THREE.Color( 0x111111 );
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
// camera.position.z = 4;
// camera.position.x = 1.5;

var renderer = new THREE.WebGLRenderer();
// var controls = new THREE.TrackballControls( camera, renderer.domElement );
const controls = new ImmersiveControls(camera, renderer, scene, {
    initialPosition: new THREE.Vector3(0, 1.6, 2),
    // moveSpeed: { keyboard: 0.025, vr: 0.025 }
});
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = true;
container.appendChild( renderer.domElement );

var background_light = new THREE.AmbientLight( 0x777777 );
scene.add( background_light );
var light = new THREE.PointLight(0x999999);
light.position.z = 8
light.position.x = 5
scene.add( light );


var sphere_geometry = new THREE.SphereGeometry( 0.5, 256, 256 );
var circle_geometry = new THREE.CircleGeometry( 0.5, 256 );
var wall_geometry = new THREE.PlaneBufferGeometry( 0.5, 0.5 );
var material = new THREE.MeshStandardMaterial( { color: 0xeeeeee, side: THREE.DoubleSide } );//, opacity: 0.9 } );
// material.transparent = true;
var wall_material = new THREE.MeshStandardMaterial( { color: 0xe72564, side: THREE.DoubleSide } );

const base_geometry = new THREE.PlaneGeometry( 10, 10 );
const base_material = new THREE.MeshBasicMaterial( {color: 0x333333, side: THREE.DoubleSide} );
const plane = new THREE.Mesh( base_geometry, base_material );
plane.rotateX(Math.PI/2.);
scene.add( plane );

var sphere  = new THREE.Mesh( sphere_geometry, material );
var circle  = new THREE.Mesh( circle_geometry, material );
var wall  = new THREE.Mesh( wall_geometry, wall_material );
sphere.position.x = 0
circle.position.x = 3
circle.visible = false;
wall.rotation.y = Math.PI/2.;
wall.position.x = slice.loc;
wall.scale.set(4,4,4);

let objects = new THREE.Group();

objects.add( sphere );
objects.add( circle );
objects.add( wall );

objects.position.x = -1.5;
objects.position.y = 1.6;

scene.add(objects);

var gui = new GUI();
gui.add( slice, 'loc').min(-1).max(1).step(0.01).listen().name('Slice').onChange( function( val ) { update_spheres(val); }) ;
gui.open();

function animate() {
    renderer.setAnimationLoop(function () {
        if ( controls !== undefined) { controls.update(); }
        // requestAnimationFrame( animate );
        renderer.render( scene, camera );
    });
};
window.addEventListener( 'resize', onWindowResize, false );
animate();

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    // if ( controls !== undefined) { controls.handleResize(); }
};