import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import * as CONTROLLERS from "./controllers";
import helvetiker_bold from "../resources/helvetiker_bold.typeface.json";

let fontsize = 0.25;
let loader = new FontLoader();
export let font;
// console.log(helvetiker_bold)
// loader.load(helvetiker_bold, function (f) {
loader.load('./helvetiker_bold.typeface.json', function (f) {
    // loader.load('../resources/helvetiker_bold.typeface.json', function (f) {
    // console.log('FONT DEFINED!!');
    font = f;
});

export function add_url_button(url, name, location, scale, controls, scene) {
    if (font !== undefined) {

        let background;

        var mat = new THREE.MeshStandardMaterial({ color: 0xe72564 });
        var geom = new TextGeometry(name, { font: font, size: fontsize, height: fontsize / 5., });
        var text = new THREE.Mesh(geom, mat);
        text.geometry.computeBoundingBox();

        text.position.y = -text.geometry.boundingBox.max.y / 2.;
        text.position.x = -text.geometry.boundingBox.max.x / 2.;
        text.position.z = 0.05;
        text.userData.url = url;

        var mat = new THREE.MeshStandardMaterial({ color: 0x333333 });
        var geom = new THREE.BoxGeometry(fontsize + text.geometry.boundingBox.max.x, fontsize + text.geometry.boundingBox.max.y, 0.1);
        background = new THREE.Mesh(geom, mat);
        background.userData.url = url;

        background.position.set(...location);
        background.add(text);

        const type = 'button';
        background.userData.type = type; // this sets up interaction group for controllers
        text.userData.type = type; // this sets up interaction group for controllers

        controls.interaction.selectStartHandlers[type] = CONTROLLERS.onRedirectButtonSelectStart;
        controls.interaction.selectEndHandlers[type] = CONTROLLERS.onRedirectButtonSelectEnd;
        // controls.interaction.selectableObjects.push(button);
        controls.interaction.selectableObjects.push(background);

        background.scale.set(scale, scale, scale);

        scene.add(background);

        return background
    }
    else {
        // console.log('font not loaded, waiting...')
        setTimeout(add_url_button.bind(null, url, name, location, scale, controls, scene), 200);
    }
}

export function add_action_button(type, name, selectStartFunction, selectEndFunction, intersectionFunction, location, scale, controls, scene) {
    if (font !== undefined) {
        let background;

        var mat = new THREE.MeshStandardMaterial({ color: 0xe72564 });
        var geom = new TextGeometry(name, { font: font, size: fontsize, height: fontsize / 5., });
        var text = new THREE.Mesh(geom, mat);
        text.geometry.computeBoundingBox();

        text.position.y = -text.geometry.boundingBox.max.y / 2.;
        text.position.x = -text.geometry.boundingBox.max.x / 2.;
        text.position.z = 0.05;

        var mat = new THREE.MeshStandardMaterial({ color: 0x333333 });
        var geom = new THREE.BoxGeometry(fontsize + text.geometry.boundingBox.max.x, fontsize + text.geometry.boundingBox.max.y, 0.1);
        background = new THREE.Mesh(geom, mat);

        background.position.set(...location);
        background.add(text);

        background.userData.type = type; // this sets up interaction group for controllers
        text.userData.type = type; // this sets up interaction group for controllers

        controls.interaction.selectStartHandlers[type] = selectStartFunction;
        controls.interaction.selectEndHandlers[type] = selectEndFunction;
        controls.interaction.intersectionHandlers[type] = intersectionFunction;
        // controls.interaction.selectableObjects.push(button);
        controls.interaction.selectableObjects.push(background);

        background.scale.set(scale, scale, scale);

        scene.add(background);

        return background;
    }
    else {
        setTimeout(add_action_button.bind(null, type, name, selectStartFunction, selectEndFunction, intersectionFunction, location, scale, controls, scene), 200);
    }
}