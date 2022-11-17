import css from "../css/loading_screen.css";
import json_file from "../apps.json";

import ImmersiveControls from '@depasquale/three-immersive-controls';
import * as CONTROLLERS from '../libs/controllers.js';
import * as SPHERES from "../libs/SphereHandler.js"
import * as WALLS from "../libs/WallHandler.js"
import * as BUTTONS from "../libs/buttons";
import * as GRAPHS from "../libs/graphs";
import * as AUDIO from "../libs/audio";
import * as LIGHTS from "../libs/lights";
import * as POOLCUE from "../libs/PoolCue";

// let file = 'box';
let VR_only = false;

let urlParams = new URLSearchParams(window.location.search);
// if ( urlParams.has('VR') || urlParams.has('vr') ) { VR_only = true; }

// if ( VR_only ) {
let splash = document.createElement("div");
splash.classList.add("overlay");
splash.innerHTML = "Enter VR"
// splash.onclick = (e) => {
//     console.log(e)
//     // splash.style.visibility = false;
//     move_to('box');
//     e.srcElement.remove()
// };
splash.id = 'splash';
splash.style.visibility = 'hidden';
document.body.appendChild(splash);
// }

let container = document.createElement("div");
document.body.appendChild(container);

export let camera, scene, renderer, controls, clock, apps;

async function add_common_properties() {
    clock = new THREE.Clock();

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1e-2, 100);
    camera.keep_me = true;

    renderer = new THREE.WebGLRenderer({ antialias: true });//, logarithmicDepthBuffer: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    renderer.keep_me = true;
    // renderer.shadowMap.enabled = true;
    // renderer.shadowMap.mapSize = new THREE.Vector2(512,512);
    // renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);
    
    scene = new THREE.Scene();
    scene.keep_me = true;
    scene.background = new THREE.Color(0x111);

    controls = new ImmersiveControls(camera, renderer, scene, {
        initialPosition: new THREE.Vector3(0, 1.6, 2),
        showEnterVRButton: true,
        showExitVRButton: false,
        // moveSpeed: { keyboard: 0.025, vr: 0.025 }
    });
    controls.keep_me = true;

    window.addEventListener('resize', onWindowResize, false);
}



async function wipe_scene() {
    if (scene !== undefined) {
        // scene.traverse( (o) => {
        //     console.log(o)
        //     if (o.keep_me !== undefined ) {
        //         scene.remove(o);
        //     }
        //     if (o.geometry) {
        //         o.geometry.dispose()
        //         // console.log("dispose geometry ", o.geometry)                        
        //     }

        //     if (o.material) {
        //         if (o.material.length) {
        //             for (let i = 0; i < o.material.length; ++i) {
        //                 o.material[i].dispose()
        //                 // console.log("dispose material ", o.material[i])                                
        //             }
        //         }
        //         else {
        //             o.material.dispose()
        //             // console.log("dispose material ", o.material)                            
        //         }
        //     }
        // });   
        for (let i = scene.children.length - 1; i >= 0; i--) {
            let object = scene.children[i];
            // scene.traverse( (object) => {
            if (object.remove_me !== undefined) {
                scene.remove(object);
            } else {
                if (object.keep_me === undefined && object.children.length === 0 && object !== scene) {
                    // console.log('REMOVING')
                    // console.log(object)
                    scene.remove(object);
                } else {
                    // console.log('KEEPING')
                    // console.log(object)
                }
            }
        };
        if ( POOLCUE.pool_cue !== undefined && controls.vrControls.controllers.right !== undefined ) { controls.vrControls.controllers.right.remove( POOLCUE.pool_cue) }
        controls.interaction.selectStartHandlers = {};
        controls.interaction.selectEndHandlers = {};
        controls.interaction.selectableObjects = [];

        SPHERES.reset_spheres();
    }

    AUDIO.end_current_track();
}

add_common_properties();

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

export function move_to( v ) {
    if ( typeof v === 'number' ) {
        apps.current = v;
        console.log('CHANGING TO ' + apps.list[v].url)
        import("./" + apps.list[v].url).then((module) => {
            wipe_scene().then(module.init());
        });

    } else if ( typeof v === 'string' ) {
        apps.list.forEach((e, index) => {
            if ( e.url === v ) {
                apps.current = index;
            }
        });
        console.log('CHANGING TO ' + v)
        import("./" + v).then((module) => {
            wipe_scene().then( module.init() );
        });
    }
    else {
        console.error('Unsupported type for moving between scenes')
    }
    
}

// renderer.xr.addEventListener('sessionstart', function (event) {

//     splash.style.visibility = 'hidden';

// });

// renderer.xr.addEventListener('sessionend', function (event) {

//     splash.style.visibility = 'visible';

// });

// if (!VR_only) {
fetch("apps.json")
.then(response => response.json())
.then(json => {
    apps = json;

    if (urlParams.has('fname')) {
        move_to(urlParams.get('fname'));
    } else {
        // console.log(apps.current)
        // if (window.location.pathname === '/') {
        move_to( apps.current );
    }
});