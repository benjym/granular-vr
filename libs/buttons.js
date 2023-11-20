import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import * as CONTROLLERS from "./controllers";
import helvetiker_bold from "../resources/helvetiker_bold.typeface.json";

let fontsize = 0.25;
let loader = new FontLoader();
export let font;
// console.log(helvetiker_bold)
// loader.load(helvetiker_bold, function (f) {
// loader.load('../resources/helvetiker_bold.typeface.json', function (f) {
loader.load('./helvetiker_bold.typeface.json', function (f) {
    // console.log('FONT DEFINED!!');
    font = f;
});

export async function load_fonts() {
    return new Promise(resolve => {
        loader.loadAsync('./helvetiker_bold.typeface.json', function (f) {
            // loader.load('../resources/helvetiker_bold.typeface.json', function (f) {
            // console.log('FONT DEFINED!!');
            font = f;
        });
    })

}

export function make_text(name, color, position, scale) {
    // if (font !== undefined) {
    // console.log(font)
    var mat = new THREE.MeshStandardMaterial({ color: color });
    var geom = new TextGeometry(String(name), { font: font, size: fontsize, height: fontsize / 5., });
    var text = new THREE.Mesh(geom, mat);
    text.geometry.computeBoundingBox();

    text.position.y = -text.geometry.boundingBox.max.y / 2.;
    text.position.x = -text.geometry.boundingBox.max.x / 2.;
    // text.position.z = 0.05;

    text.position.set(...position);
    text.scale.set(scale, scale, scale);

    return text
    // }
    // else {
    // setTimeout(make_text.bind(null, name, color, position, scale), 200);
    // }
}

export function make_button_object(name, location, scale) {
    let button = new THREE.Group();

    var mat = new THREE.MeshStandardMaterial({ color: 0xe72564 });
    var geom = new TextGeometry(String(name), { font: font, size: fontsize, height: fontsize / 10., });
    var text = new THREE.Mesh(geom, mat);
    text.geometry.computeBoundingBox();

    text.position.y = -text.geometry.boundingBox.max.y / 2.;
    text.position.x = -text.geometry.boundingBox.max.x / 2.;
    text.position.z = fontsize / 5;

    var mat = new THREE.MeshStandardMaterial({ color: 0x333333 });
    var geom = new THREE.BoxGeometry(fontsize + text.geometry.boundingBox.max.x, fontsize + text.geometry.boundingBox.max.y, 0.1);

    let bg = new THREE.Mesh(geom, mat);
    button.add(bg)

    button.position.set(...location);
    button.scale.set(scale, scale, scale);
    button.add(text);

    button.remove_me = true;

    return button
}

export function add_url_button(url, name, controls, scene, location, scale, rotation) {
    // if (font !== undefined) {

    let button = make_button_object(name, location, scale);
    // if ( url.includes('?') ) {
    //     [filename,args] = url.split('?');
    //     url = file
    // }
    // button.userData.url = url;
    button.children[0].userData.url = url;
    button.children[1].userData.url = url;

    const type = 'button';
    // button.userData.type = type; // this sets up interaction group for controllers
    button.children[0].userData.type = type; // this sets up interaction group for controllers
    button.children[1].userData.type = type; // this sets up interaction group for controllers

    controls.interaction.selectStartHandlers[type] = CONTROLLERS.onRedirectButtonSelectStart;
    controls.interaction.selectEndHandlers[type] = CONTROLLERS.onRedirectButtonSelectEnd;
    // controls.interaction.intersectionHandlers[type] = () => {console.log('INTERSECTION')};

    controls.interaction.selectableObjects.push(button.children[0]);
    controls.interaction.selectableObjects.push(button.children[1]);

    button.rotateX(rotation[0]);
    button.rotateY(rotation[1]);
    button.rotateZ(rotation[2]);
    scene.add(button);

    return button
    // }
    // else {
    //     // console.log('font not loaded, waiting...')
    //     setTimeout(add_url_button.bind(null, url, name, controls, scene, location, scale, rotation), 200);
    // }
}

export function add_scene_change_button(new_scene, label, controls, scene, location, scale, rotation) {
    let button = make_button_object(label, location, scale);

    button.children[0].userData.new_scene = new_scene;
    button.children[1].userData.new_scene = new_scene;

    const type = 'scene_change';
    // button.userData.type = type; // this sets up interaction group for controllers
    button.children[0].userData.type = type; // this sets up interaction group for controllers
    button.children[1].userData.type = type; // this sets up interaction group for controllers

    controls.interaction.selectStartHandlers[type] = CONTROLLERS.onSceneChangeButtonSelectStart;
    controls.interaction.selectEndHandlers[type] = CONTROLLERS.onSceneChangeButtonSelectEnd;
    // controls.interaction.intersectionHandlers[type] = () => {console.log('INTERSECTION')};

    controls.interaction.selectableObjects.push(button.children[0]);
    controls.interaction.selectableObjects.push(button.children[1]);

    button.rotateX(rotation[0]);
    button.rotateY(rotation[1]);
    button.rotateZ(rotation[2]);
    scene.add(button);
    // controls.player.add(button);

    return button
}

export function add_scene_rainfall_change_button(S,new_scene, label, controls, scene, location, scale, rotation, dimension) {
    let button = make_button_object(label, location, scale);
    button.S = S;

    button.children[0].userData.new_scene = new_scene;
    button.children[1].userData.new_scene = new_scene;

    button.children[0].S = S;
    button.children[1].S = S;
    button.children[0].dimension = dimension;
    button.children[1].dimension = dimension;
    

    const type = 'scene_change_rainfall';
    // button.userData.type = type; // this sets up interaction group for controllers
    button.children[0].userData.type = type; // this sets up interaction group for controllers
    button.children[1].userData.type = type; // this sets up interaction group for controllers

    controls.interaction.selectStartHandlers[type] = CONTROLLERS.onSceneChangeRainfallButtonSelectStart;
    controls.interaction.selectEndHandlers[type] = CONTROLLERS.onSceneChangeButtonSelectEnd;
    // controls.interaction.intersectionHandlers[type] = () => {console.log('INTERSECTION')};

    controls.interaction.selectableObjects.push(button.children[0]);
    controls.interaction.selectableObjects.push(button.children[1]);

    button.rotateX(rotation[0]);
    button.rotateY(rotation[1]);
    button.rotateZ(rotation[2]);
    scene.add(button);
    // controls.player.add(button);

    return button
}

export function add_action_button(type, name, selectStartFunction, selectEndFunction, intersectionFunction, location, scale, controls, scene) {
    // if (font !== undefined) {
    let button = make_button_object(name, location, scale);

    button.userData.type = type; // this sets up interaction group for controllers
    button.children[0].userData.type = type; // this sets up interaction group for controllers
    button.children[1].userData.type = type; // this sets up interaction group for controllers

    controls.interaction.selectStartHandlers[type] = selectStartFunction;
    controls.interaction.selectEndHandlers[type] = selectEndFunction;
    controls.interaction.intersectionHandlers[type] = intersectionFunction;
    // controls.interaction.selectableObjects.push(button);
    controls.interaction.selectableObjects.push(button);
    controls.interaction.selectableObjects.push(button.children[0]);
    controls.interaction.selectableObjects.push(button.children[1]);

    scene.add(button);

    return button;
    // }
    // else {
    //     setTimeout(add_action_button.bind(null, type, name, selectStartFunction, selectEndFunction, intersectionFunction, location, scale, controls, scene), 200);
    // }
}

export function add_prev_next_with_timeout(apps, controls, scene) {
    add_scene_change_button(apps.list[apps.current - 1].url, apps.list[apps.current - 1].name, controls, scene, [-1, 1, 1], 0.25, [0, Math.PI / 4, 0]);
    setTimeout(() => { add_scene_change_button(apps.list[apps.current + 1].url, apps.list[apps.current + 1].name, controls, scene, [1, 1, 1], 0.25, [0, -Math.PI / 4, 0]) }, apps.list[apps.current].button_delay);
}