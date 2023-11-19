import css from "../css/main.css";
import JSON5 from "json5";
import { io } from "socket.io-client";

// import ImmersiveControls from '@depasquale/three-immersive-controls';
import ImmersiveControls from '../libs/three-immersive-controls';
import * as CONTROLLERS from '../libs/controllers.js';
import * as SPHERES from "../libs/SphereHandler.js"
import * as WALLS from "../libs/WallHandler.js"
import * as BUTTONS from "../libs/buttons";
import * as GRAPHS from "../libs/graphs";
import * as AUDIO from "../libs/audio";
import * as LIGHTS from "../libs/lights";
import * as POOLCUE from "../libs/PoolCue";
import * as RAYCAST from "../libs/RaycastHandler";

// // Save the current URL and state when the app starts
// var initialUrl = window.location.href;
// var initialState = window.history.state;

// // Listen for the 'beforeunload' event when the user leaves the app
// window.addEventListener('beforeunload', function(event) {
//   // Restore the initial URL and state when the user leaves the app
//   console.log('UNLOADING PAGE')
//   window.history.replaceState(initialState, '', initialUrl);
// });

let server = 'https://granular-vr.glitch.me/'
let socket = io(server);
// let socket_id;

function replaceQueryParam(param, newval, search) {
    var regex = new RegExp("([?;&])" + param + "[^&;]*[;&]?");
    var query = search.replace(regex, "$1").replace(/&$/, '');

    return (query.length > 2 ? query + "&" : "?") + (newval ? param + "=" + newval : '');
}

let urlParams = new URLSearchParams(window.location.search);
export let extra_params;
export let human_height = 1.6;

let container = document.createElement("div");
document.body.appendChild(container);

export let camera, scene, renderer, controls, clock, apps, NDDEMCGLib;

let master;
let worker = new Worker(new URL('../libs/worker.js', import.meta.url));
let wrapped_worker = Comlink.wrap(worker);

export let visibility = 'visible'; // by default visible so desktop mode works

async function add_common_properties() {
    NDDEMCGLib = await new wrapped_worker()
    // console.log(NDDEMCGLib)

    clock = new THREE.Clock();

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1e-2, 20);
    // camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1.00, 1.1);
    camera.keep_me = true;

    renderer = new THREE.WebGLRenderer({ antialias: true });//, logarithmicDepthBuffer: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    renderer.keep_me = true;

    renderer.show_on_2d_canvas = function(scene,camera) {
        // Re-Render the scene, but this time to the canvas (don't do this on Mobile!)
        if (this.xr.isPresenting) {
            this.xr.enabled = false;
            // let oldFramebuffer = this._framebuffer;
            // this.state.bindXRFramebuffer( null );
            //renderer.setRenderTarget( renderer.getRenderTarget() ); // Hack #15830 - Unneeded?
            this.render(scene, camera);
            this.xr.enabled = true;
            // this.state.bindXRFramebuffer(oldFramebuffer);
        }
    }

    // renderer.shadowMap.enabled = true;
    // renderer.shadowMap.mapSize = new THREE.Vector2(512,512);
    // renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);

    scene = new THREE.Scene();
    scene.keep_me = true;
    scene.background = new THREE.Color(0x111);

    if ( urlParams.has('master') ) { master = urlParams.get('master') }
    // else { master = "ISS"; }
    else { master = "grain-days-2023"; }

    controls = new ImmersiveControls(camera, renderer, scene, {
        initialPosition: new THREE.Vector3(0, human_height, 2),
        showEnterVRButton: true,
        showExitVRButton: false,
        // moveSpeed: { keyboard: 0.025, vr: 0.025 }
    });
    controls.keep_me = true;
    // controls.vrControls.controllers.right.addEventListener('disconnected', () => {
    //     controls.currentVrSession?.end()
    // });

    window.addEventListener('resize', onWindowResize, false);

    socket.on("connect", () => {
        // socket_id = socket.id;
        // console.log(socket_id)
        console.log('Connected to socket.io server with id ' + socket.id)
        socket.on('receive_move', (dest) => {
            console.log('received move to ' + dest);
            move_to(dest)
        });
    });


    // BELOW CODE IS MEANT TO FIRE WHEN HEADSET IS TAKEN ON/OFF. SHOULD ADD params.paused VALUES AND MAKE SURE params.paused STOPS UPDATE LOOPS WHERE IT CAN?
    renderer.xr.addEventListener('sessionstart', function () {
        console.debug('adding visibilitychange listener')
        renderer.xr.addEventListener("visibilitychange", (eventData) => {
            switch (eventData.session.visibilityState) {
                case "visible":
                    console.debug('XR SESSION VISIBLE')
                    visibility = 'visible'
                    AUDIO.resume_current_track();
                    break;
                case "visible-blurred":
                    console.debug('XR SESSION BLURRY')
                    visibility = 'visible-blurred'
                    AUDIO.pause_current_track();
                    break;
                case "hidden":
                    console.debug('XR SESSION HIDDEN')
                    visibility = 'hidden'
                    AUDIO.pause_current_track();
                    break;
            }
        });

    });

}

async function wipe_scene() {
    // visibility = 'hidden';
    if ( renderer !== undefined ) {
        // renderer.setAnimationLoop(null);
        renderer.setAnimationLoop( () => {
            if ( controls !== undefined ) { controls.update() }
            renderer.render(scene, camera);
        });
    }
    if ( scene !== undefined ) {
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
        if (POOLCUE.pool_cue !== undefined && controls.vrControls.controllers.right !== undefined) { controls.vrControls.controllers.right.remove(POOLCUE.pool_cue) }
        controls.interaction.selectStartHandlers = {};
        controls.interaction.selectEndHandlers = {};
        controls.interaction.selectableObjects = [];

        controls.player.position.x = 0
        controls.player.position.z = 2
        controls.player.rotation.x = 0
        controls.player.rotation.y = 0
        controls.player.rotation.z = 0

        SPHERES.reset_spheres();
        RAYCAST.reset_ghosts();
        WALLS.update_d4();


    }

    AUDIO.end_current_track();
}

add_common_properties().then(load_json_apps);

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

// window.addEventListener('keydown', (event) => {
//     switch (event.key) {
//         case 'n':
//             next_scene();
//         case 'p':
//             previous_scene();
//     }
// });


// function next_scene(){
//     if (apps.current < apps.list.length - 1) {
//         move_to(apps.current + 1);
//     }
//     else {
//         move_to(0);
//     }
// }

// function previous_scene(){
//     if (apps.current > 0) {
//         move_to(apps.current - 1);
//     }
//     else {
//         move_to(apps.list.length - 1);
//     }
// }

export function move_to(v) {
    if (typeof v === 'number') {
        if ( v > apps.list.length - 1 ) { v = 0; }
        if ( v < 0 ) { v = apps.list.length - 1 }
        // console.log(apps.current)
        // console.log(apps.list[v].url)
        apps.current = v;
        const arr = apps.list[v].url.split("?");
        let url = arr[0]
        if (arr.length === 2) {
            extra_params = new URLSearchParams(arr[1]);
        } else {
            extra_params = new URLSearchParams('null');
        }
        console.log('CHANGING TO ' + apps.list[v].url)
        // if ( socket_id !== undefined ) {
            socket.emit('roomChange', apps.list[v].url);
        // }
        // extra_params = apps.list[v].params;

        import("./" + url).then((module) => {
            wipe_scene().then(() => {
                // visibility = 'visible';
                module.init();
            });
        });

    } else if (typeof v === 'string') {
        let url;
        apps.list.forEach((e, index) => {
            if (e.url === v) {
                const arr = v.split("?");
                url = arr[0]
                apps.current = index;
                if (arr.length === 2) {
                    extra_params = new URLSearchParams(arr[1]);
                } else {
                    extra_params = new URLSearchParams('null');
                }
            }
        });
        console.log('CHANGING TO ' + v)
        // if ( socket_id !== undefined ) {
            socket.emit('roomChange', apps.list[v].url);
        // }

        // This updates the URL without reloading the page... hasn't been tested on headset yet to see if at allows you to reload and still work. especially needs to work with extra_params
        // var str = window.location.search
        // str = replaceQueryParam('fname', url, str)
        // window.history.pushState({}, '', window.location.pathname + str);

        import("./" + url).then((module) => {
            wipe_scene().then(() => {
                // visibility = 'visible';
                module.init()
            });
        });
    }
    else {
        console.error('Unsupported type for moving between scenes')
    }

    // now find the app you just moved to and add the relevant audio track if available
    if ( apps.list[apps.current].audio_track !== undefined)  {
        if ( apps.list[apps.current].audio_delay === undefined ) { apps.list[apps.current].audio_delay = 3000;}
        AUDIO.play_track(apps.list[apps.current].audio_track, scene, apps.list[apps.current].audio_delay);
    }

}

document.addEventListener('keydown', function(event) {
    if (event.key === 'o') {
        move_to(apps.current - 1);
    } else if (event.key === 'p') {
        move_to(apps.current + 1);
    } else if (event.key === 'm') {
        move_to(0);
    }
});


function load_json_apps() {
    fetch('master/' + master + '.json')
        .then( response => response.text() )
        .then(text => {            
            apps = JSON5.parse(text);
            if (urlParams.has('quick')) {
                apps.list.forEach((v, i) => {
                    apps.list[i].button_delay = 0;
                });
            }
            if (urlParams.has('desktop')) {
                let buttonsContainer = document.getElementById("buttonsContainer");
                buttonsContainer.style.visibility = 'hidden';
                if (urlParams.has('fname')) {
                    move_to(urlParams.get('fname'));
                }
                else { move_to(apps.current); }
            }
            else {
                let next;
                if (urlParams.has('fname')) { next = urlParams.get('fname') }
                else { next = apps.current }
                
                let enterVRButton = document.getElementById('enterVRButton');
                if (!enterVRButton) {
                    enterVRButton = document.createElement("button");
                    enterVRButton.id = "enterVRButton";
                    enterVRButton.classList.add("button");
                }
                enterVRButton.addEventListener('click', () => {move_to(next);});            

            }
        });
    }
