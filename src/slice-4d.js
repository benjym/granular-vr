import css from "../css/main.css";
// import * as DEMCGND from "../resources/DEMCGND.js";

import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import ImmersiveControls from '@depasquale/three-immersive-controls';

import * as CONTROLLERS from '../libs/controllers.js';
import * as SPHERES from "../libs/SphereHandler.js"
import * as BUTTONS from "../libs/buttons";

const urlParams = new URLSearchParams(window.location.search);

let scene, slice, camera, renderer, controls, S;

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

let params = {
    N : 1,
    quality: 7,
    dimension: 4,
    d4 : { cur: 0, min: -1, max: 1 },
    lut: 'None',
}

async function main() {
    await NDDEMPhysics();

    slice = {'loc':-1};
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x111111 );
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
    // camera.position.z = 4;
    // camera.position.x = 1.5;

    renderer = new THREE.WebGLRenderer();
    // var controls = new THREE.TrackballControls( camera, renderer.domElement );
    controls = new ImmersiveControls(camera, renderer, scene, {
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

    
    SPHERES.add_spheres(S, params, scene)

    var sphere_geometry = new THREE.SphereGeometry( 0.5, 256, 256 );
    var material = new THREE.MeshStandardMaterial( { color: 0xeeeeee, side: THREE.DoubleSide } );//, opacity: 0.9 } );
    // material.transparent = true;
    var wall_material = new THREE.MeshStandardMaterial( { color: 0xe72564, side: THREE.DoubleSide } );

    const base_geometry = new THREE.PlaneGeometry( 10, 10 );
    const base_material = new THREE.MeshBasicMaterial( {color: 0x333333, side: THREE.DoubleSide} );
    const plane = new THREE.Mesh( base_geometry, base_material );
    plane.rotateX(Math.PI/2.);
    scene.add( plane );

    // var sphere  = new THREE.Mesh( sphere_geometry, material );
    // var circle  = new THREE.Mesh( circle_geometry, material );
    // var wall  = new THREE.Mesh( wall_geometry, wall_material );
    // sphere.position.x = 0
    // circle.position.x = 3
    // circle.visible = false;
    // wall.rotation.y = Math.PI/2.;
    // wall.position.x = slice.loc;
    // wall.scale.set(4,4,4);

    // let objects = new THREE.Group();

    // objects.add( sphere );
    // objects.add( circle );
    // objects.add( wall );

    // objects.position.x = -1.5;
    // objects.position.y = 1.6;

    // scene.add(objects);

    var gui = new GUI();
    gui.add( params.d4, 'cur').min(params.d4.min).max(params.d4.max).step(0.01).listen().name('Slice');//.onChange( function( val ) { update_spheres(val); }) ;
    gui.open();

    renderer.setAnimationLoop(function () {
        if ( controls !== undefined) { controls.update(); }
        SPHERES.move_spheres(S, params);
        renderer.render( scene, camera );
    });

    BUTTONS.add_url_button('menu', 'Main menu', controls, scene, [-1, 1, 1], 0.25, [0,Math.PI/4,0]);
    BUTTONS.add_url_button('rotation-matrix.html?dimension=3', 'Seeing 3D surfaces', controls, scene, [1, 1, 1], 0.25, [0,-Math.PI/4,0]);
}

function init() {
    if ( BUTTONS.font === undefined ) {
        setTimeout(init, 200);
    } else {
        main();
    }
}

SPHERES.createNDParticleShader(params).then( init() );

// function animate() {
    
// };
window.addEventListener( 'resize', onWindowResize, false );
// animate();

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    // if ( controls !== undefined) { controls.handleResize(); }
};

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
    });

}

function setup_NDDEM() {
    S.simu_interpret_command("dimensions " + String(params.dimension) + " " + String(params.N));
    S.simu_interpret_command("radius -1 0.5");
    S.simu_interpret_command("mass -1 1");
    S.simu_interpret_command("auto rho");
    S.simu_interpret_command("auto radius uniform 0.5 0.5");
    S.simu_interpret_command("auto mass");
    S.simu_interpret_command("auto inertia");
    S.simu_interpret_command("auto skin");

    S.simu_interpret_command("location 0 0 0 1.6 0");
    
    // S.simu_interpret_command("boundary 0 WALL -" + String(params.L) + " " + String(params.L));
    // S.simu_interpret_command("boundary 1 WALL -" + String(params.L) + " " + String(params.L));
    // S.simu_interpret_command("boundary 2 WALL -" + String(0) + " " + String(2*params.H));
    // if (params.gravity === true) {
        // S.simu_interpret_command("gravity 0 0 " + String(-9.81) + "0 ".repeat(params.dimension - 3))
    // }
    // else {
        // S.simu_interpret_command("gravity 0 0 0 " + "0 ".repeat(params.dimension - 3))
    // }
    // S.simu_interpret_command("auto location randomsquare");
    // S.simu_interpret_command("auto location randomdrop");

    // let tc = 1e-3;
    // let rest = 0.2; // super low restitution coeff to dampen out quickly
    // let min_particle_mass = params.particle_density * 4. / 3. * Math.PI * Math.pow(params.r_min, 3);
    // let vals = SPHERES.setCollisionTimeAndRestitutionCoefficient(tc, rest, min_particle_mass);
    // S.simu_interpret_command("set Kn " + String(vals.stiffness));
    // S.simu_interpret_command("set Kt " + String(0.8*vals.stiffness));
    // S.simu_interpret_command("set GammaN " + String(vals.dissipation));
    // S.simu_interpret_command("set GammaT " + String(vals.dissipation));

    // let bulk_modulus = 1e6;
    // let poisson_coefficient = 0.5;
    // let tc = SPHERES.getHertzCriticalTimestep(bulk_modulus, poisson_coefficient, params.r_min, params.particle_density);
    // S.simu_interpret_command("set Kn " + String(bulk_modulus));
    // S.simu_interpret_command("set Kt " + String(0.8*bulk_modulus));
    // S.simu_interpret_command("set GammaN 0.2"); //+ String(vals.dissipation));
    // S.simu_interpret_command("set GammaT 0.2"); //+ String(vals.dissipation));
    // S.simu_interpret_command("ContactModel Hertz");

    // S.simu_interpret_command("set Mu " + String(params.friction_coefficient));
    // S.simu_interpret_command("set Mu_wall 0");
    // S.simu_interpret_command("set T 150");
    // S.simu_interpret_command("set dt " + String(tc / 20));
    // S.simu_interpret_command("set tdump 1000000"); // how often to calculate wall forces
    
    S.simu_finalise_init();
}