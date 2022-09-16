import css from "../css/main.css";

import * as THREE from 'three';

console.debug('Using threejs version ' + THREE.REVISION)

import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import ImmersiveControls from '@depasquale/three-immersive-controls';

import * as SPHERES from "./SphereHandler.js"
import * as WALLS from "./WallHandler.js"
import { mapLinear } from "three/src/math/MathUtils";

export let params = {

}

function main() {
    
}