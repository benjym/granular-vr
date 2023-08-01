import css from "../css/main.css";
// import loading_css from "../css/loading_screen.css";

import ImmersiveControls from '@depasquale/three-immersive-controls';
// import * as CONTROLLERS from "../libs/controllers";
import * as BUTTONS from "../libs/buttons";
// import * as AUDIO from "../libs/audio";
import * as LIGHTS from "../libs/lights";

import { camera, scene, renderer, controls, clock, apps } from "./index";

export function init() {

    LIGHTS.add_default_lights(scene);

    const base_geometry = new THREE.PlaneGeometry(10, 10);
    const base_material = new THREE.MeshBasicMaterial({ color: 0x333333, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(base_geometry, base_material);
    plane.rotateX(Math.PI / 2.);
    plane.remove_me = true;
    scene.add(plane);

    let height = (apps.list.length)*0.2;
    apps.list.forEach( (val, index) => {
        if ( val.url !== 'menu' ) {
            BUTTONS.add_scene_change_button(val.url, String(index) + '. ' + val.name, controls, scene, [0, height - 0.2*index, 0], 0.3, [0, 0, 0]);
        }
    });

    renderer.setAnimationLoop(render);
}

function render() {
    if ( controls !== undefined ) { controls.update() }
    renderer.render(scene, camera);
};