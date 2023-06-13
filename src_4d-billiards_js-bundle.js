"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkgranular_vr"] = self["webpackChunkgranular_vr"] || []).push([["src_4d-billiards_js"],{

/***/ "./src/4d-billiards.js":
/*!*****************************!*\
  !*** ./src/4d-billiards.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"init\": () => (/* binding */ init),\n/* harmony export */   \"params\": () => (/* binding */ params)\n/* harmony export */ });\n/* harmony import */ var _css_main_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../css/main.css */ \"./css/main.css\");\n/* harmony import */ var _text_to_speech_index_mp3__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../text-to-speech/index.mp3 */ \"./text-to-speech/index.mp3\");\n/* harmony import */ var three_examples_jsm_libs_lil_gui_module_min_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! three/examples/jsm/libs/lil-gui.module.min.js */ \"./node_modules/three/examples/jsm/libs/lil-gui.module.min.js\");\n/* harmony import */ var _libs_controllers_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../libs/controllers.js */ \"./libs/controllers.js\");\n/* harmony import */ var _libs_SphereHandler_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../libs/SphereHandler.js */ \"./libs/SphereHandler.js\");\n/* harmony import */ var _libs_WallHandler_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../libs/WallHandler.js */ \"./libs/WallHandler.js\");\n/* harmony import */ var _libs_buttons__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../libs/buttons */ \"./libs/buttons.js\");\n/* harmony import */ var _libs_graphs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../libs/graphs */ \"./libs/graphs.js\");\n/* harmony import */ var _libs_audio__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../libs/audio */ \"./libs/audio.js\");\n/* harmony import */ var _libs_lights__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../libs/lights */ \"./libs/lights.js\");\n/* harmony import */ var _libs_RaycastHandler__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../libs/RaycastHandler */ \"./libs/RaycastHandler.js\");\n/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./index */ \"./src/index.js\");\n/* provided dependency */ var THREE = __webpack_require__(/*! three */ \"./node_modules/three/build/three.module.js\");\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nlet S;\n\nlet params = {\n    dimension: 4,\n    L : 2,\n    boxratio: 1,\n    // initial_packing_fraction: 0.01,\n    N: 1,\n    gravity: false,\n    paused: false,\n    r_max: 0.1,\n    r_min: 0.1,\n    lut: 'None',\n    quality: 6,\n    vmax: 1, // max velocity to colour by\n    omegamax: 20, // max rotation rate to colour by\n    particle_density: 2700, // kg/m^3\n    particle_opacity: 1,\n    audio: false,\n    F_mag_max: 1e6,\n    friction_coefficient: 0.5,\n    initial_speed: 5,\n}\n\nfunction set_derived_properties() {\n    params.average_radius = (params.r_min + params.r_max) / 2.;\n    params.thickness = 0.0001;//params.average_radius;\n\n    // params.particle_volume = Math.PI * Math.PI * Math.pow(params.average_radius, 4) / 2.;\n    // console.log('estimate of particle volume: ' + params.particle_volume * params.N)\n    // params.particle_mass = params.particle_volume * params.particle_density;\n    // params.L = Math.pow(params.particle_volume * params.N / params.initial_packing_fraction / params.boxratio, 1. / 3.) / 2.;\n    // params.L = 2.5;\n    params.H = params.L * params.boxratio;\n\n    params.L_cur = params.L;\n    params.H_cur = params.H;\n    params.epsilonv = 0;\n\n    params.d4 = { cur: 0, min: -params.L, max: params.L };\n}\n\n\nfunction init() {\n    _libs_SphereHandler_js__WEBPACK_IMPORTED_MODULE_4__.createNDParticleShader(params).then(main());\n}\n\nasync function main() {\n    set_derived_properties();\n    await NDDEMPhysics().then(() => {\n        build_world();\n        _index__WEBPACK_IMPORTED_MODULE_11__.renderer.setAnimationLoop(update);\n    });\n}\n\nasync function build_world() {    \n    // const base_geometry = new THREE.PlaneGeometry(params.L, params.L);\n    // const base_material = new THREE.MeshBasicMaterial({ color: 0x333333, side: THREE.DoubleSide });\n    // const plane = new THREE.Mesh(base_geometry, base_material);\n    // plane.rotateX(Math.PI / 2.);\n    // plane.position.y = -0.5 * params.r_min;\n    // scene.add(plane);\n\n    _libs_lights__WEBPACK_IMPORTED_MODULE_9__.add_smaller_lights(_index__WEBPACK_IMPORTED_MODULE_11__.scene);\n\n    _libs_SphereHandler_js__WEBPACK_IMPORTED_MODULE_4__.add_spheres(S, params, _index__WEBPACK_IMPORTED_MODULE_11__.scene);\n    _libs_SphereHandler_js__WEBPACK_IMPORTED_MODULE_4__.add_shadows();\n\n    // BUTTONS.add_scene_change_button(apps.list[apps.current - 1].url, apps.list[apps.current - 1].name, controls, scene, [-1, 1, 1], 0.25, [0, Math.PI / 4, 0]);\n    setTimeout(() => { _libs_buttons__WEBPACK_IMPORTED_MODULE_6__.add_scene_change_button(_index__WEBPACK_IMPORTED_MODULE_11__.apps.list[_index__WEBPACK_IMPORTED_MODULE_11__.apps.current + 1].url, 'Next: ' + _index__WEBPACK_IMPORTED_MODULE_11__.apps.list[_index__WEBPACK_IMPORTED_MODULE_11__.apps.current + 1].name, _index__WEBPACK_IMPORTED_MODULE_11__.controls, _index__WEBPACK_IMPORTED_MODULE_11__.scene, [0.5, 1, 1], 0.25, [0, -Math.PI / 4, 0]) }, _index__WEBPACK_IMPORTED_MODULE_11__.apps.list[_index__WEBPACK_IMPORTED_MODULE_11__.apps.current].button_delay);\n\n    // let offset = 0.5;\n    \n}\n\nasync function update() {\n    if ( _index__WEBPACK_IMPORTED_MODULE_11__.visibility === 'visible' ) {\n        // if (S !== undefined) {\n        _libs_SphereHandler_js__WEBPACK_IMPORTED_MODULE_4__.move_spheres(S, params);\n        S.simu_step_forward(20);\n        // }\n        let offset = 1.0;\n        if (_index__WEBPACK_IMPORTED_MODULE_11__.controls.player.position.x < -params.L + offset) { _index__WEBPACK_IMPORTED_MODULE_11__.controls.player.position.x = -params.L + offset; }\n        else if (_index__WEBPACK_IMPORTED_MODULE_11__.controls.player.position.x > params.L - offset) { _index__WEBPACK_IMPORTED_MODULE_11__.controls.player.position.x = params.L - offset; }\n\n        if (_index__WEBPACK_IMPORTED_MODULE_11__.controls.player.position.z < -params.L + offset) { _index__WEBPACK_IMPORTED_MODULE_11__.controls.player.position.z = -params.L + offset; }\n        else if (_index__WEBPACK_IMPORTED_MODULE_11__.controls.player.position.z > params.L - offset) { _index__WEBPACK_IMPORTED_MODULE_11__.controls.player.position.z = params.L - offset; }\n\n        _index__WEBPACK_IMPORTED_MODULE_11__.controls.update();\n        _index__WEBPACK_IMPORTED_MODULE_11__.renderer.render(_index__WEBPACK_IMPORTED_MODULE_11__.scene, _index__WEBPACK_IMPORTED_MODULE_11__.camera);\n        params = _libs_controllers_js__WEBPACK_IMPORTED_MODULE_3__.moveInD4(params, _index__WEBPACK_IMPORTED_MODULE_11__.controls);\n        _libs_WallHandler_js__WEBPACK_IMPORTED_MODULE_5__.update_d4(params);\n\n        _libs_RaycastHandler__WEBPACK_IMPORTED_MODULE_10__.update_ghosts();\n    }\n\n    // });\n\n}\n\nasync function NDDEMPhysics() {\n    await _index__WEBPACK_IMPORTED_MODULE_11__.NDDEMCGLib.init(params.dimension, params.N);\n    S = _index__WEBPACK_IMPORTED_MODULE_11__.NDDEMCGLib.S;\n    setup_NDDEM();\n}\n\nfunction setup_NDDEM() {\n    S.simu_interpret_command(\"dimensions \" + String(params.dimension) + \" \" + String(params.N));\n    S.simu_interpret_command(\"radius -1 0.5\");\n    // now need to find the mass of a particle with diameter 1\n    let m = 4. / 3. * Math.PI * 0.5 * 0.5 * 0.5 * params.particle_density;\n\n    S.simu_interpret_command(\"mass -1 \" + String(m));\n    S.simu_interpret_command(\"auto rho\");\n    S.simu_interpret_command(\"auto radius uniform \" + params.r_min + \" \" + params.r_max);\n    S.simu_interpret_command(\"auto mass\");\n    S.simu_interpret_command(\"auto inertia\");\n    S.simu_interpret_command(\"auto skin\");\n    \n    S.simu_interpret_command(\"boundary 0 WALL -\" + String(params.L) + \" \" + String(params.L));\n    S.simu_interpret_command(\"boundary 1 WALL -\" + String(params.L) + \" \" + String(params.L));\n    S.simu_interpret_command(\"boundary 2 WALL 0 \" + String(2 * params.L));\n    S.simu_interpret_command(\"boundary 3 WALL -\" + String(params.L) + \" \" + String(params.L));\n    S.simu_interpret_command(\"gravity 0 0 0 0\");\n\n\n    // S.simu_interpret_command(\"location 0 \" + String(params.L) + \" 0 0\");\n    // S.simu_interpret_command(\"location 0 0 0 \" + String(params.L));\n    \n    if ( _index__WEBPACK_IMPORTED_MODULE_11__.extra_params.has('boundary') ) {\n        if ( _index__WEBPACK_IMPORTED_MODULE_11__.extra_params.get('boundary') === 'hypercube' ) {\n            S.simu_interpret_command(\"auto location randomdrop\");\n            _libs_RaycastHandler__WEBPACK_IMPORTED_MODULE_10__.add_ghosts(_index__WEBPACK_IMPORTED_MODULE_11__.scene, 2000, params.average_radius/4., 0x333333);\n\n            _libs_WallHandler_js__WEBPACK_IMPORTED_MODULE_5__.add_cuboid_walls(params);\n\n            _libs_WallHandler_js__WEBPACK_IMPORTED_MODULE_5__.walls.rotateX(-Math.PI / 2.); // fix y/z up compared to NDDEM\n            _libs_WallHandler_js__WEBPACK_IMPORTED_MODULE_5__.walls.rotateZ(Math.PI); // fix y/z up compared to NDDEM\n            _libs_WallHandler_js__WEBPACK_IMPORTED_MODULE_5__.walls.position.y = params.L;\n\n            _libs_WallHandler_js__WEBPACK_IMPORTED_MODULE_5__.update_isotropic_wall(params, S);\n            // WALLS.add_scale(params);\n            _libs_WallHandler_js__WEBPACK_IMPORTED_MODULE_5__.walls.children.forEach((w) => {\n                if (w.type === 'Mesh') {\n                    w.material.wireframe = false;\n                    w.material.side = THREE.DoubleSide;\n                }\n            });\n            _libs_WallHandler_js__WEBPACK_IMPORTED_MODULE_5__.add_shadows();\n\n        } else if ( _index__WEBPACK_IMPORTED_MODULE_11__.extra_params.get('boundary') === 'hypersphere' ) {\n            console.log('SPHERE')\n            _libs_RaycastHandler__WEBPACK_IMPORTED_MODULE_10__.add_ghosts(_index__WEBPACK_IMPORTED_MODULE_11__.scene, 2000, params.average_radius/4., 0xFFFFFF);\n\n            S.simu_interpret_command(\"boundary \"+String(params.dimension)+\" SPHERE \"+String(params.L)+ \" 0 0 \" + String(params.L) + \" 0\"); // add a sphere!\n            S.simu_interpret_command(\"auto location insphere\");\n            _libs_WallHandler_js__WEBPACK_IMPORTED_MODULE_5__.add_sphere(params);\n        }\n\n        \n        S.simu_interpret_command(\"velocity 0 5 4 3 5\");\n\n    }\n    _index__WEBPACK_IMPORTED_MODULE_11__.scene.add(_libs_WallHandler_js__WEBPACK_IMPORTED_MODULE_5__.walls);\n\n    let tc = 1e-2;\n    let rest = 1.0; // super low restitution coeff to dampen out quickly\n    let min_particle_mass = params.particle_density * 4. / 3. * Math.PI * Math.pow(params.r_min, 3);\n    let vals = _libs_SphereHandler_js__WEBPACK_IMPORTED_MODULE_4__.setCollisionTimeAndRestitutionCoefficient(tc, rest, min_particle_mass);\n    S.simu_interpret_command(\"set Kn \" + String(vals.stiffness));\n    S.simu_interpret_command(\"set Kt \" + String(0.8 * vals.stiffness));\n    S.simu_interpret_command(\"set GammaN \" + String(vals.dissipation));\n    S.simu_interpret_command(\"set GammaT \" + String(vals.dissipation));\n\n    S.simu_interpret_command(\"set Mu 0\");\n    S.simu_interpret_command(\"set Mu_wall 0\");\n    S.simu_interpret_command(\"set T 150\");\n    S.simu_interpret_command(\"set dt \" + String(tc / 20));\n    S.simu_interpret_command(\"set tdump 1000000\"); // how often to calculate wall forces\n\n    S.simu_finalise_init();\n}\n\n//# sourceURL=webpack://granular-vr/./src/4d-billiards.js?");

/***/ }),

/***/ "./text-to-speech/index.mp3":
/*!**********************************!*\
  !*** ./text-to-speech/index.mp3 ***!
  \**********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = __webpack_require__.p + \"e26e1d2c8c608b4b5832.mp3\";\n\n//# sourceURL=webpack://granular-vr/./text-to-speech/index.mp3?");

/***/ })

}]);