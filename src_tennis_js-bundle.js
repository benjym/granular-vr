"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkgranular_vr"] = self["webpackChunkgranular_vr"] || []).push([["src_tennis_js"],{

/***/ "./src/tennis.js":
/*!***********************!*\
  !*** ./src/tennis.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"dispose\": () => (/* binding */ dispose),\n/* harmony export */   \"init\": () => (/* binding */ init),\n/* harmony export */   \"params\": () => (/* binding */ params)\n/* harmony export */ });\n/* harmony import */ var _css_main_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../css/main.css */ \"./css/main.css\");\n/* harmony import */ var _text_to_speech_tennis_mp3__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../text-to-speech/tennis.mp3 */ \"./text-to-speech/tennis.mp3\");\n/* harmony import */ var _text_to_speech_tennis_win_mp3__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../text-to-speech/tennis-win.mp3 */ \"./text-to-speech/tennis-win.mp3\");\n/* harmony import */ var three_examples_jsm_libs_lil_gui_module_min_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! three/examples/jsm/libs/lil-gui.module.min.js */ \"./node_modules/three/examples/jsm/libs/lil-gui.module.min.js\");\n/* harmony import */ var _libs_controllers_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../libs/controllers.js */ \"./libs/controllers.js\");\n/* harmony import */ var _libs_SphereHandler_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../libs/SphereHandler.js */ \"./libs/SphereHandler.js\");\n/* harmony import */ var _libs_WallHandler_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../libs/WallHandler.js */ \"./libs/WallHandler.js\");\n/* harmony import */ var _libs_buttons__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../libs/buttons */ \"./libs/buttons.js\");\n/* harmony import */ var _libs_graphs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../libs/graphs */ \"./libs/graphs.js\");\n/* harmony import */ var _libs_lights__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../libs/lights */ \"./libs/lights.js\");\n/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./index */ \"./src/index.js\");\n/* provided dependency */ var THREE = __webpack_require__(/*! three */ \"./node_modules/three/build/three.module.js\");\n\n\n\n// import * as DEMCGND from \"../resources/DEMCGND.js\";\n\n\n// import ImmersiveControls from '@depasquale/three-immersive-controls';\n\n\n\n\n\n\n// import * as AUDIO from \"../libs/audio\";\n\n\n\n\nlet left_locked = true;\nlet right_locked = true;\nlet S;\nlet sunk_balls = [];\nlet button_added = false;\n\nlet params = {\n    dimension: 4,\n    boxratio: 1,\n    // initial_packing_fraction: 0.01,\n    N: 100,\n    epsilonv: 0,\n    gravity: false,\n    paused: false,\n    H_cur: 0,\n    pressure_set_pt: 1e4,\n    deviatoric_set_pt: 0,\n    d4: { cur: 0, min: -1, max: 1 },\n    // r_max: 0.0033,\n    // r_min: 0.0027,\n    r_max: 0.2,\n    r_min: 0.2,\n    // freq: 0.05,\n    new_line: false,\n    loading_rate: 0.01,\n    // max_vertical_strain: 0.3,\n    target_stress: 1e7,\n    unloading_stress: 100,\n    lut: 'None',\n    quality: 6,\n    vmax: 1, // max velocity to colour by\n    omegamax: 20, // max rotation rate to colour by\n    loading_active: false,\n    particle_density: 2700, // kg/m^3\n    particle_opacity: 1,\n    audio: false,\n    F_mag_max: 1e6,\n    friction_coefficient: 0.5,\n    initial_speed: 0,\n}\n\nfunction set_derived_properties() {\n    params.average_radius = (params.r_min + params.r_max) / 2.;\n    params.thickness = 0.0001;//params.average_radius;\n\n    params.particle_volume = Math.PI * Math.PI * Math.pow(params.average_radius, 4) / 2.;\n    console.log('estimate of particle volume: ' + params.particle_volume * params.N)\n    params.particle_mass = params.particle_volume * params.particle_density;\n    // params.L = Math.pow(params.particle_volume * params.N / params.initial_packing_fraction / params.boxratio, 1. / 3.) / 2.;\n    params.L = 2.5;\n    params.H = params.L * params.boxratio;\n\n    params.L_cur = params.L;\n    params.H_cur = params.H;\n}\n\n\nfunction init() {\n    _libs_SphereHandler_js__WEBPACK_IMPORTED_MODULE_5__.createNDParticleShader(params).then(main);\n}\n\nasync function main() {\n    set_derived_properties();\n    await NDDEMPhysics();\n\n    // const base_geometry = new THREE.PlaneGeometry(params.L, params.L);\n    // const base_material = new THREE.MeshBasicMaterial({ color: 0x333333, side: THREE.DoubleSide });\n    // const plane = new THREE.Mesh(base_geometry, base_material);\n    // plane.rotateX(Math.PI / 2.);\n    // plane.position.y = -0.5 * params.r_min;\n    // scene.add(plane);\n    // WALLS.add_base_plane(scene);\n\n    _libs_lights__WEBPACK_IMPORTED_MODULE_9__.add_default_lights(_index__WEBPACK_IMPORTED_MODULE_10__.scene);\n\n    _libs_WallHandler_js__WEBPACK_IMPORTED_MODULE_6__.add_cuboid_walls(params);\n    _libs_WallHandler_js__WEBPACK_IMPORTED_MODULE_6__.walls.remove(_libs_WallHandler_js__WEBPACK_IMPORTED_MODULE_6__.walls.children[0]); // remove back wall\n    _libs_WallHandler_js__WEBPACK_IMPORTED_MODULE_6__.walls.rotateX(-Math.PI / 2.); // fix y/z up compared to NDDEM\n    _libs_WallHandler_js__WEBPACK_IMPORTED_MODULE_6__.walls.rotateZ(Math.PI); // fix y/z up compared to NDDEM\n    _libs_WallHandler_js__WEBPACK_IMPORTED_MODULE_6__.walls.position.y = params.H;\n    _index__WEBPACK_IMPORTED_MODULE_10__.scene.add(_libs_WallHandler_js__WEBPACK_IMPORTED_MODULE_6__.walls);\n    _libs_WallHandler_js__WEBPACK_IMPORTED_MODULE_6__.update_isotropic_wall(params, S);\n    // WALLS.add_scale(params);\n    _libs_WallHandler_js__WEBPACK_IMPORTED_MODULE_6__.walls.children.forEach((w) => {\n        if (w.type === 'Mesh') {\n            w.material.wireframe = false;\n            w.material.side = THREE.DoubleSide;\n            // w.material.color\n        }\n    });\n    _libs_WallHandler_js__WEBPACK_IMPORTED_MODULE_6__.add_shadows();\n\n    await _libs_SphereHandler_js__WEBPACK_IMPORTED_MODULE_5__.add_spheres(S, params, _index__WEBPACK_IMPORTED_MODULE_10__.scene);\n    _libs_SphereHandler_js__WEBPACK_IMPORTED_MODULE_5__.add_shadows();\n\n    _libs_WallHandler_js__WEBPACK_IMPORTED_MODULE_6__.update_isotropic_wall(params, S);\n\n    _libs_buttons__WEBPACK_IMPORTED_MODULE_7__.add_scene_change_button(_index__WEBPACK_IMPORTED_MODULE_10__.apps.list[_index__WEBPACK_IMPORTED_MODULE_10__.apps.current - 1].url, 'Back: ' + _index__WEBPACK_IMPORTED_MODULE_10__.apps.list[_index__WEBPACK_IMPORTED_MODULE_10__.apps.current - 1].name, _index__WEBPACK_IMPORTED_MODULE_10__.controls, _index__WEBPACK_IMPORTED_MODULE_10__.scene, [-1, 1, 1], 0.25, [0, Math.PI / 4, 0]);\n    setTimeout(() => {\n        if (!button_added) {\n            _libs_buttons__WEBPACK_IMPORTED_MODULE_7__.add_scene_change_button(_index__WEBPACK_IMPORTED_MODULE_10__.apps.list[_index__WEBPACK_IMPORTED_MODULE_10__.apps.current + 1].url, 'Next: ' + _index__WEBPACK_IMPORTED_MODULE_10__.apps.list[_index__WEBPACK_IMPORTED_MODULE_10__.apps.current + 1].name, _index__WEBPACK_IMPORTED_MODULE_10__.controls, _index__WEBPACK_IMPORTED_MODULE_10__.scene, [1, 1, 1], 0.25, [0, -Math.PI / 4, 0]);\n            button_added = true;\n        }\n    }, _index__WEBPACK_IMPORTED_MODULE_10__.apps.list[_index__WEBPACK_IMPORTED_MODULE_10__.apps.current].button_delay);\n    \n    let gui = new three_examples_jsm_libs_lil_gui_module_min_js__WEBPACK_IMPORTED_MODULE_3__.GUI();\n    gui.width = 400;\n\n    gui.add(params.d4, 'cur', params.d4.min, params.d4.max, 0.001).name('D4 location (e/q)').listen();\n    gui.remove_me = true;\n\n    let offset = 0.2;\n\n    _index__WEBPACK_IMPORTED_MODULE_10__.renderer.setAnimationLoop(update)\n}\n        \nasync function update() {\n    if ( _index__WEBPACK_IMPORTED_MODULE_10__.visibility === 'visible' && started ) {\n        _libs_SphereHandler_js__WEBPACK_IMPORTED_MODULE_5__.move_spheres(S, params);\n        S.simu_step_forward(5);\n        console.log(_index__WEBPACK_IMPORTED_MODULE_10__.controls)\n\n        if (_index__WEBPACK_IMPORTED_MODULE_10__.controls.player.position.x < -params.L + offset) { _index__WEBPACK_IMPORTED_MODULE_10__.controls.player.position.x = -params.L + offset; }\n        else if (_index__WEBPACK_IMPORTED_MODULE_10__.controls.player.position.x > params.L - offset) { _index__WEBPACK_IMPORTED_MODULE_10__.controls.player.position.x = params.L - offset; }\n\n        if (_index__WEBPACK_IMPORTED_MODULE_10__.controls.player.position.z < -params.L + offset) { _index__WEBPACK_IMPORTED_MODULE_10__.controls.player.position.z = -params.L + offset; }\n        else if (_index__WEBPACK_IMPORTED_MODULE_10__.controls.player.position.z > params.L - offset) { _index__WEBPACK_IMPORTED_MODULE_10__.controls.player.position.z = params.L - offset; }\n\n        if (_index__WEBPACK_IMPORTED_MODULE_10__.controls.vrControls.controllerGrips.left !== undefined) {\n            let loc = new THREE.Vector3();\n            _index__WEBPACK_IMPORTED_MODULE_10__.controls.vrControls.controllerGrips.left.getWorldPosition(loc);\n            // console.log( controls.vrControls.controllerGrips.left.position )\n            if ( left_locked ) {\n                S.simu_fixParticle(params.N - 1,\n                    [loc.x,\n                    loc.z,\n                    loc.y,\n                    params.d4.cur\n                    ]\n                );\n                await _libs_SphereHandler_js__WEBPACK_IMPORTED_MODULE_5__.haptic_pulse(S, params, _index__WEBPACK_IMPORTED_MODULE_10__.controls.vrControls.controls.left, params.N - 1);\n            }\n        }\n        if (_index__WEBPACK_IMPORTED_MODULE_10__.controls.vrControls.controllerGrips.right !== undefined) {\n            let loc = new THREE.Vector3();\n            _index__WEBPACK_IMPORTED_MODULE_10__.controls.vrControls.controllerGrips.right.getWorldPosition(loc);\n            if ( right_locked ) {\n                S.simu_fixParticle(params.N - 2,\n                    [loc.x,\n                    loc.z,\n                    loc.y,\n                    params.d4.cur\n                    ]\n                );\n                await _libs_SphereHandler_js__WEBPACK_IMPORTED_MODULE_5__.haptic_pulse(S, params, _index__WEBPACK_IMPORTED_MODULE_10__.controls.vrControls.controls.right, params.N - 2);\n            }\n        }\n\n\n\n        await check_side();\n\n        onFireLeftSphere();\n\n        _index__WEBPACK_IMPORTED_MODULE_10__.controls.update();\n        _index__WEBPACK_IMPORTED_MODULE_10__.renderer.render(_index__WEBPACK_IMPORTED_MODULE_10__.scene, _index__WEBPACK_IMPORTED_MODULE_10__.camera);\n        params = _libs_controllers_js__WEBPACK_IMPORTED_MODULE_4__.moveInD4(params, _index__WEBPACK_IMPORTED_MODULE_10__.controls);\n        _libs_WallHandler_js__WEBPACK_IMPORTED_MODULE_6__.update_d4(params);\n    }\n}\n\nfunction onFireLeftSphere() {\n    // console.log('AASFAKJSGHFKDALJH')\n    if ( left_locked ) {\n        console.log(_index__WEBPACK_IMPORTED_MODULE_10__.controls.vrControls.controllerGrips.left)\n        // S.simu_setVelocity(params.N - 2, \n        // left_locked = false;\n    }\n}\n\nasync function NDDEMPhysics() {\n    await _index__WEBPACK_IMPORTED_MODULE_10__.NDDEMCGLib.init(params.dimension, params.N);\n    S = _index__WEBPACK_IMPORTED_MODULE_10__.NDDEMCGLib.S;\n    setup_NDDEM();\n}\n\nfunction setup_NDDEM() {\n    S.simu_interpret_command(\"dimensions \" + String(params.dimension) + \" \" + String(params.N));\n    S.simu_interpret_command(\"radius -1 0.5\");\n    // now need to find the mass of a particle with diameter 1\n    let m = 4. / 3. * Math.PI * 0.5 * 0.5 * 0.5 * params.particle_density;\n\n    S.simu_interpret_command(\"mass -1 \" + String(m));\n    S.simu_interpret_command(\"auto rho\");\n    S.simu_interpret_command(\"auto radius uniform \" + params.r_min + \" \" + params.r_max);\n    S.simu_interpret_command(\"auto mass\");\n    S.simu_interpret_command(\"auto inertia\");\n    S.simu_interpret_command(\"auto skin\");\n    // console.log(params.L, params.H)\n    S.simu_interpret_command(\"boundary 0 WALL -\" + String(params.L) + \" \" + String(params.L));\n    S.simu_interpret_command(\"boundary 1 WALL -\" + String(0) + \" \" + String(params.L));\n    S.simu_interpret_command(\"boundary 2 WALL -\" + String(0) + \" \" + String(params.L));\n    S.simu_interpret_command(\"boundary 3 WALL \" + String(params.d4.min) + \" \" + String(params.d4.max));\n    if (params.gravity === true) {\n        S.simu_interpret_command(\"gravity 0 0 \" + String(-100) + \"0 \".repeat(params.dimension - 3))\n    }\n    else {\n        S.simu_interpret_command(\"gravity 0 0 0 \" + \"0 \".repeat(params.dimension - 3))\n    }\n    // S.simu_interpret_command(\"auto location randomsquare\");\n    S.simu_interpret_command(\"auto location randomdrop\");\n\n    S.simu_interpret_command(\"boundary 1 WALL -\" + String(params.L) + \" \" + String(params.L));\n    S.simu_interpret_command(\"boundary 2 WALL -\" + String(0) + \" \" + String(2 * params.L));\n\n    for (let i = 0; i < params.N; i++) {\n        S.simu_setVelocity(i, [params.initial_speed * (Math.random() - 0.5),\n        params.initial_speed * (Math.random() - 0.5),\n        params.initial_speed * (Math.random() - 0.5),\n        params.initial_speed * (Math.random() - 0.5)]);\n\n    }\n\n    let tc = 1e-2;\n    let rest = 0.999; // super low restitution coeff to dampen out quickly\n    let min_particle_mass = params.particle_density * 4. / 3. * Math.PI * Math.pow(params.r_min, 3);\n    let vals = _libs_SphereHandler_js__WEBPACK_IMPORTED_MODULE_5__.setCollisionTimeAndRestitutionCoefficient(tc, rest, min_particle_mass);\n    S.simu_interpret_command(\"set Kn \" + String(vals.stiffness));\n    S.simu_interpret_command(\"set Kt \" + String(0.8 * vals.stiffness));\n    S.simu_interpret_command(\"set GammaN \" + String(vals.dissipation));\n    S.simu_interpret_command(\"set GammaT \" + String(vals.dissipation));\n\n    // let bulk_modulus = 1e6;\n    // let poisson_coefficient = 0.5;\n    // let tc = SPHERES.getHertzCriticalTimestep(bulk_modulus, poisson_coefficient, params.r_min, params.particle_density);\n    // S.simu_interpret_command(\"set Kn \" + String(bulk_modulus));\n    // S.simu_interpret_command(\"set Kt \" + String(0.8*bulk_modulus));\n    // S.simu_interpret_command(\"set GammaN 0.2\"); //+ String(vals.dissipation));\n    // S.simu_interpret_command(\"set GammaT 0.2\"); //+ String(vals.dissipation));\n    // S.simu_interpret_command(\"ContactModel Hertz\");\n\n    S.simu_interpret_command(\"set Mu \" + String(params.friction_coefficient));\n    S.simu_interpret_command(\"set Mu_wall 0\");\n    S.simu_interpret_command(\"set damping 0.0001\");\n    S.simu_interpret_command(\"set T 150\");\n    S.simu_interpret_command(\"set dt \" + String(tc / 20));\n    S.simu_interpret_command(\"set tdump 1000000\"); // how often to calculate wall forces\n\n    S.simu_finalise_init();\n}\n\nasync function check_side() {\n    for (let i = 0; i < params.N - 2; i++) {\n        // var object = SPHERES.spheres.children[i];\n\n        if (!sunk_balls.includes(i) && _libs_SphereHandler_js__WEBPACK_IMPORTED_MODULE_5__.spheres.length > 0) {\n            if (_libs_SphereHandler_js__WEBPACK_IMPORTED_MODULE_5__.spheres.children[i].position.z < 0) {\n                let balls_left = params.N - 3 - sunk_balls.length;\n\n                console.debug('SUNK BALL ' + String(i) + '. ' + String(balls_left) + ' BALLS LEFT.');\n                // object.visible = false;\n                sunk_balls.push(i);\n                S.simu_fixParticle(i, [5 * params.L, 5 * params.L, sunk_balls.length * 2 * params.r_max, 0])\n                S.simu_setFrozen(i);\n\n                if (balls_left == 0) {\n                    AUDIO.play_track('tennis-win.mp3', _index__WEBPACK_IMPORTED_MODULE_10__.camera, 0)\n                    if (!added_button) { _libs_buttons__WEBPACK_IMPORTED_MODULE_7__.add_scene_change_button(_index__WEBPACK_IMPORTED_MODULE_10__.apps.list[_index__WEBPACK_IMPORTED_MODULE_10__.apps.current + 1].url, _index__WEBPACK_IMPORTED_MODULE_10__.apps.list[_index__WEBPACK_IMPORTED_MODULE_10__.apps.current + 1].name, _index__WEBPACK_IMPORTED_MODULE_10__.controls, _index__WEBPACK_IMPORTED_MODULE_10__.scene, [1, 1, 1], 0.25, [0, -Math.PI / 4, 0]); }\n                };\n            }\n            // else { console.log(SPHERES.x[i]) }\n        }\n    }\n}\n\n// init();\n\nfunction dispose() {\n\n}\n\n\n//# sourceURL=webpack://granular-vr/./src/tennis.js?");

/***/ }),

/***/ "./text-to-speech/tennis-win.mp3":
/*!***************************************!*\
  !*** ./text-to-speech/tennis-win.mp3 ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = __webpack_require__.p + \"8bfda81b03cfe84db233.mp3\";\n\n//# sourceURL=webpack://granular-vr/./text-to-speech/tennis-win.mp3?");

/***/ }),

/***/ "./text-to-speech/tennis.mp3":
/*!***********************************!*\
  !*** ./text-to-speech/tennis.mp3 ***!
  \***********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = __webpack_require__.p + \"a0e01279c8bd298b5197.mp3\";\n\n//# sourceURL=webpack://granular-vr/./text-to-speech/tennis.mp3?");

/***/ })

}]);