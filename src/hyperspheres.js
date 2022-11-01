import css from "../css/main.css";

// import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import ImmersiveControls from '@depasquale/three-immersive-controls';

import * as CONTROLLERS from '../libs/controllers.js';
import * as BUTTONS from "../libs/buttons";

var clock = new THREE.Clock();

const urlParams = new URLSearchParams(window.location.search);

let renderer, scene, camera, controls
let label1, label2, label3;
let container = document.createElement("div");
document.body.appendChild(container);

async function init() {
    await BUTTONS.load_fonts();

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x111111 );
    camera = new THREE.PerspectiveCamera( 50, window.innerWidth/window.innerHeight, 0.1, 1000 );

    renderer = new THREE.WebGLRenderer();
    controls = new ImmersiveControls(camera, renderer, scene, {
        initialPosition: new THREE.Vector3(0, 1.6, 2),
        // moveSpeed: { keyboard: 0.025, vr: 0.025 }
    });
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    var background_light = new THREE.AmbientLight( 0x777777 );
    scene.add( background_light );
    var light = new THREE.PointLight(0x999999);
    light.position.z = 8
    light.position.x = 5
    scene.add( light );


    const sphere_geometry = new THREE.SphereGeometry( 0.5, 256, 256 );
    const circle_geometry = new THREE.CircleGeometry( 0.5, 256 );
    const material = new THREE.MeshStandardMaterial( { color: 0xeeeeee, side: THREE.DoubleSide } );
    const arrow_material = new THREE.MeshStandardMaterial( { color: 0xfc2eff, side: THREE.DoubleSide } );

    const base_geometry = new THREE.PlaneGeometry( 10, 10 );
    const base_material = new THREE.MeshBasicMaterial( {color: 0x333333, side: THREE.DoubleSide} );
    const plane = new THREE.Mesh( base_geometry, base_material );
    plane.rotateX(Math.PI/2.);
    scene.add( plane );

    var sphere  = new THREE.Mesh( sphere_geometry, material );
    var circle  = new THREE.Mesh( circle_geometry, material.clone() );
    sphere.material.transparent = true;
    sphere.material.opacity = 0.5;
    const line_geometry = new THREE.CylinderGeometry(0.01, 0.01, 1, 32);

    var line  = new THREE.Mesh( line_geometry, material );
    line.rotateZ(Math.PI/2);
    sphere.position.x = 1.5;
    circle.position.x = 0;
    line.position.x = -1.5;


    label1 = new THREE.Group();
    const head_geometry = new THREE.CylinderGeometry(0.03, 0.0, 0.05, 32);
    let arrow_head = new THREE.Mesh(head_geometry, arrow_material);
    arrow_head.rotateZ(Math.PI/2);
    arrow_head.position.x = 0.5-0.05/2.;
    const body_geometry = new THREE.CylinderGeometry(0.01, 0.01, 0.5-0.03/2., 32);
    let arrow_body = new THREE.Mesh(body_geometry, arrow_material);
    arrow_body.rotateZ(Math.PI/2);
    arrow_body.position.x = (0.5-0.05/2.)/2.;
    let radius_text = await BUTTONS.make_text('r', 0xfc2eff, [0,0,0], 0.5);
    radius_text.position.x = 0.25;
    radius_text.position.y = -0.12;

    label1.add( arrow_head );
    label1.add( arrow_body );
    label1.add( radius_text );
    
    label2 = label1.clone()
    label3 = label1.clone()
    label1.position.x = -1.5;
    label1.position.y -= 0.03 + 0.01;
    label3.position.x = 1.5;


    let objects = new THREE.Group();

    objects.add( sphere );
    objects.add( circle );
    objects.add( line );
    objects.add( label1 );
    objects.add( label2 );
    objects.add( label3 );

    objects.position.y = 1.6;

    scene.add(objects);

    renderer.setAnimationLoop(function () {
        var t = clock.getDelta();
        label2.rotateZ(0.2*t);
        label3.rotateZ(0.2*t);
        label3.rotateY(0.2*t);
        if ( controls !== undefined) { controls.update(); }
        renderer.render( scene, camera );
    });
}

init();

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    // if ( controls !== undefined) { controls.handleResize(); }
};