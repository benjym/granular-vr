import ImmersiveControls from '@depasquale/three-immersive-controls';
import * as CONTROLLERS from '../libs/controllers.js';
import * as SPHERES from "../libs/SphereHandler.js"
import * as WALLS from "../libs/WallHandler.js"
import * as BUTTONS from "../libs/buttons";
import * as GRAPHS from "../libs/graphs";
import * as AUDIO from "../libs/audio";
import * as LIGHTS from "../libs/lights";

let container = document.createElement("div");
document.body.appendChild(container);

export let camera, scene, renderer, controls, clock;

async function add_common_properties() {
    clock = new THREE.Clock();

    // let urlParams = new URLSearchParams(window.location.search);
    // if (urlParams.has('quality')) { params.quality = parseInt(urlParams.get('quality')); }

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1e-2, 100);

    renderer = new THREE.WebGLRenderer({ antialias: true });//, logarithmicDepthBuffer: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    // renderer.shadowMap.enabled = true;
    // renderer.shadowMap.mapSize = new THREE.Vector2(512,512);
    // renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // renderer.outputEncoding = THREE.sRGBEncoding;


    container.appendChild( renderer.domElement );

    wipe_scene();

    window.addEventListener('resize', onWindowResize, false);
}

function wipe_scene() {
    // if ( scene !== undefined ) { scene.dispose() // not implemented }
    // if ( controls !== undefined ) { controls.dispose() // not implemented }
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111);

    controls = new ImmersiveControls(camera, renderer, scene, {
        initialPosition: new THREE.Vector3(0, 1.6, 2),
        showEnterVRButton: false,
        showExitVRButton: false,
        // moveSpeed: { keyboard: 0.025, vr: 0.025 }
    });

    AUDIO.end_current_track();
}

add_common_properties();

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

export function move_to( filename ) {
    console.log('CHANGING TO ' + filename)
        import("./" + filename).then((module) => {
            wipe_scene();
            module.init();
        });
}

// import("./" + file).then((module) => {
//     module.init();
// });