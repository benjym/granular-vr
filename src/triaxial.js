import css from "../css/main.css";

console.debug('Using threejs version ' + THREE.REVISION)

import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import ImmersiveControls from '@depasquale/three-immersive-controls';

import * as SPHERES from "../libs/SphereHandler.js"
import * as WALLS from "../libs/WallHandler.js"
import { mapLinear } from "three/src/math/MathUtils";

export let params = {

}

function main() {
    
}