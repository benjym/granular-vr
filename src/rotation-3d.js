import css from "../css/main.css";
import logo from "../resources/usyd.png";
// import logo from "../resources/spiral.jpg"

import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';

// import * as CONTROLLERS from '../libs/controllers.js';
import * as SPHERES from "../libs/SphereHandler.js"
import * as BUTTONS from "../libs/buttons";
import * as AUDIO from "../libs/audio";
import * as LIGHTS from "../libs/lights";

import { camera, scene, renderer, controls, clock, apps, visibility, NDDEMCGLib } from "./index";

let S;

var params = {
    dimension: 3,
    radius: 0.5,
    L: 500, //system size
    // d4: {cur:0, min:-1, max:1},
    lut: 'None',
    quality: 7,
    N: 3
}

export function init() {
    params.dimension = 3;
    SPHERES.createNDParticleShader(params).then(() => {
        main();
    });
}

async function main() {

    await NDDEMCGPhysics();

    LIGHTS.add_default_lights(scene);

    const base_geometry = new THREE.PlaneGeometry(10, 10);
    const base_material = new THREE.MeshBasicMaterial({ color: 0x333333, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(base_geometry, base_material);
    plane.rotateX(Math.PI / 2.);
    scene.add(plane);

    SPHERES.add_spheres(S, params, scene);

    let circle;

    var circle_geometry = new THREE.CircleGeometry(0.5, 256);
    const loader = new THREE.TextureLoader();

    const circle_material = new THREE.MeshBasicMaterial({
        color: 0xFFFFFF,
        map: loader.load('./usyd.png'),
        // map : loader.load('./spiral.jpg'),
        side: THREE.DoubleSide
    });
    circle = new THREE.Mesh(circle_geometry, circle_material);
    circle.position.y = 2.2;
    scene.add(circle);

    BUTTONS.add_scene_change_button(apps.list[apps.current - 1].url, 'Back: ' + apps.list[apps.current - 1].name, controls, scene, [-1, 1, 1], 0.25, [0, Math.PI / 4, 0]);
    setTimeout(() => { BUTTONS.add_scene_change_button(apps.list[apps.current + 1].url, 'Next: ' + apps.list[apps.current + 1].name, controls, scene, [1, 1, 1], 0.25, [0, -Math.PI / 4, 0]) }, apps.list[apps.current].button_delay);

    renderer.setAnimationLoop(function () {
        if ( visibility === 'visible' ) {
            if (controls !== undefined) { controls.update() }
            S.simu_step_forward(5);
            SPHERES.move_spheres(S, params);
            renderer.render(scene, camera);
            if (circle !== undefined) { circle.rotateZ(clock.getDelta() * Math.PI / 2.) }
        }
    });

    // AUDIO.play_track('rotation-3d.mp3', scene, 3000);
}


async function NDDEMCGPhysics() {
    await NDDEMCGLib.init(params.dimension, params.N);
    S = NDDEMCGLib.S;
    setup_NDDEM();
}

function setup_NDDEM() {
    S.simu_interpret_command("dimensions 3 3");
    S.simu_interpret_command("radius -1 0.45");
    S.simu_interpret_command("mass -1 1");
    S.simu_interpret_command("auto rho");
    S.simu_interpret_command("auto inertia");

    S.simu_interpret_command("boundary 0 PBC -" + String(params.L) + " " + String(params.L));
    S.simu_interpret_command("boundary 1 PBC -" + String(params.L) + " " + String(params.L));
    S.simu_interpret_command("boundary 2 PBC -" + String(params.L) + " " + String(params.L));
    // S.simu_interpret_command("gravity 0 0 " + "0 ".repeat(params.dimension - 3))

    S.simu_interpret_command("location 0 -1 0 1 0");
    S.simu_interpret_command("location 1 0 0 1 0");
    S.simu_interpret_command("location 2 1 0 1 0");
    S.simu_interpret_command("omega 0 0 0.1 0");
    S.simu_interpret_command("omega 1 0.1 0 0");
    S.simu_interpret_command("omega 2 0 0 0.1");

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
