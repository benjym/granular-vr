"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkgranular_vr"] = self["webpackChunkgranular_vr"] || []).push([["src_3d-pool_js"],{

/***/ "./src/3d-pool.js":
/*!************************!*\
  !*** ./src/3d-pool.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"init\": () => (/* binding */ init)\n/* harmony export */ });\n/* harmony import */ var _css_main_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../css/main.css */ \"./css/main.css\");\n/* harmony import */ var _css_pool_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../css/pool.css */ \"./css/pool.css\");\n/* harmony import */ var _text_to_speech_3d_pool_mp3__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../text-to-speech/3d-pool.mp3 */ \"./text-to-speech/3d-pool.mp3\");\n/* harmony import */ var _resources_4d_pool_stl__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../resources/4d-pool.stl */ \"./resources/4d-pool.stl\");\n/* harmony import */ var _resources_pool_glb__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../resources/pool.glb */ \"./resources/pool.glb\");\n/* harmony import */ var three_examples_jsm_libs_lil_gui_module_min_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! three/examples/jsm/libs/lil-gui.module.min.js */ \"./node_modules/three/examples/jsm/libs/lil-gui.module.min.js\");\n/* harmony import */ var three_examples_jsm_loaders_GLTFLoader_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! three/examples/jsm/loaders/GLTFLoader.js */ \"./node_modules/three/examples/jsm/loaders/GLTFLoader.js\");\n/* harmony import */ var _libs_SphereHandler_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../libs/SphereHandler.js */ \"./libs/SphereHandler.js\");\n/* harmony import */ var _libs_NDSTLLoader_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../libs/NDSTLLoader.js */ \"./libs/NDSTLLoader.js\");\n/* harmony import */ var _libs_controllers_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../libs/controllers.js */ \"./libs/controllers.js\");\n/* harmony import */ var _libs_buttons__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../libs/buttons */ \"./libs/buttons.js\");\n/* harmony import */ var _libs_PoolCue_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../libs/PoolCue.js */ \"./libs/PoolCue.js\");\n/* harmony import */ var _libs_audio_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../libs/audio.js */ \"./libs/audio.js\");\n/* harmony import */ var _libs_lights__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../libs/lights */ \"./libs/lights.js\");\n/* harmony import */ var _libs_WallHandler__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../libs/WallHandler */ \"./libs/WallHandler.js\");\n/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./index */ \"./src/index.js\");\n/* provided dependency */ var THREE = __webpack_require__(/*! three */ \"./node_modules/three/build/three.module.js\");\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nlet gui;\nlet S;\nlet NDsolids, material, STLFilename;\nlet meshes;\nlet started = false;\n// var direction = new THREE.Vector3();\n// const mouse = new THREE.Vector2();\n\nvar params = {\n    radius: 0.05,\n    dimension: 3,\n    L1: 2,\n    L2: 0.1,  // this is the direction of gravity\n    L3: 1,\n    pocket_size: 0.15,\n    pyramid_size: 5,\n    particle_density: 2700,\n    quality: 7,\n    dt: 1e-3,\n    table_height: 1.1,\n    lut: 'None',\n    audio: true,\n}\n\nparams.N = 17; // 15 regular balls, white ball, cue stick\n\n// params.particle_volume = Math.PI * Math.PI * Math.pow(params.radius, 4) / 2.;\nparams.particle_volume = 4 * Math.PI * Math.pow(params.radius, 3) / 3.;\nparams.particle_mass = params.particle_volume * params.particle_density;\n\nlet sunk_balls = [];\n\nasync function init() {\n    _libs_SphereHandler_js__WEBPACK_IMPORTED_MODULE_7__.createNDParticleShader(params).then(main);\n}\n\nasync function main() {\n    _libs_audio_js__WEBPACK_IMPORTED_MODULE_12__.make_listener(_index__WEBPACK_IMPORTED_MODULE_15__.camera);\n    _libs_audio_js__WEBPACK_IMPORTED_MODULE_12__.add_fixed_sound_source([0, 0, 0]);\n\n    await NDDEMPhysics();\n\n    // const base_geometry = new THREE.PlaneGeometry(4 * params.L1, 2 * params.L3 + 2 * params.L1);\n    // const base_material = new THREE.MeshBasicMaterial({ color: 0x333333, side: THREE.DoubleSide });\n    // const plane = new THREE.Mesh(base_geometry, base_material);\n    // plane.rotateX(Math.PI / 2.);\n    // scene.add(plane);\n    _libs_WallHandler__WEBPACK_IMPORTED_MODULE_14__.add_base_plane(_index__WEBPACK_IMPORTED_MODULE_15__.scene);\n\n    _libs_lights__WEBPACK_IMPORTED_MODULE_13__.add_default_lights(_index__WEBPACK_IMPORTED_MODULE_15__.scene);\n\n    await _libs_SphereHandler_js__WEBPACK_IMPORTED_MODULE_7__.add_pool_spheres(S, params, _index__WEBPACK_IMPORTED_MODULE_15__.scene);\n\n    STLFilename = './4d-pool.stl'; // this one has crap pockets\n    material = new THREE.MeshStandardMaterial({\n        color: 0x00aa00,\n        roughness: 1,\n        // map: texture,\n    });\n\n    loadSTL();\n\n    add_table_legs();\n    // load_nice_pool_table()\n\n    // gui\n    // gui = new GUI();\n    // gui.width = 400;\n\n    // gui.add(params.d4, 'cur', -params.L4, params.L4, 0.001).name('D4 location (e/q)').listen();\n    // gui.remove_me = true;\n\n    _libs_buttons__WEBPACK_IMPORTED_MODULE_10__.add_scene_change_button(_index__WEBPACK_IMPORTED_MODULE_15__.apps.list[_index__WEBPACK_IMPORTED_MODULE_15__.apps.current - 1].url, 'Back: ' + _index__WEBPACK_IMPORTED_MODULE_15__.apps.list[_index__WEBPACK_IMPORTED_MODULE_15__.apps.current - 1].name, _index__WEBPACK_IMPORTED_MODULE_15__.controls, _index__WEBPACK_IMPORTED_MODULE_15__.scene, [-1.5, 1, 1.5], 0.25, [0, Math.PI / 4, 0]);\n    setTimeout(() => { _libs_buttons__WEBPACK_IMPORTED_MODULE_10__.add_scene_change_button(_index__WEBPACK_IMPORTED_MODULE_15__.apps.list[_index__WEBPACK_IMPORTED_MODULE_15__.apps.current + 1].url, 'Next: ' + _index__WEBPACK_IMPORTED_MODULE_15__.apps.list[_index__WEBPACK_IMPORTED_MODULE_15__.apps.current + 1].name, _index__WEBPACK_IMPORTED_MODULE_15__.controls, _index__WEBPACK_IMPORTED_MODULE_15__.scene, [1.5, 1, 1.5], 0.25, [0, -Math.PI / 4, 0]) }, _index__WEBPACK_IMPORTED_MODULE_15__.apps.list[_index__WEBPACK_IMPORTED_MODULE_15__.apps.current].button_delay);\n\n    _index__WEBPACK_IMPORTED_MODULE_15__.renderer.setAnimationLoop(function () {\n        update();\n        _index__WEBPACK_IMPORTED_MODULE_15__.renderer.render(_index__WEBPACK_IMPORTED_MODULE_15__.scene, _index__WEBPACK_IMPORTED_MODULE_15__.camera);\n    });\n\n    _libs_PoolCue_js__WEBPACK_IMPORTED_MODULE_11__.add_pool_cue(_index__WEBPACK_IMPORTED_MODULE_15__.controls.vrControls.controllers.right).then(() => {\n        // console.log('UPDATED RADIUS')\n        S.simu_setRadius(params.N - 1, _libs_PoolCue_js__WEBPACK_IMPORTED_MODULE_11__.small_end_radius);\n        S.simu_setMass(params.N - 1, params.particle_mass / 2.);\n        _libs_SphereHandler_js__WEBPACK_IMPORTED_MODULE_7__.update_radii(S);\n        _libs_SphereHandler_js__WEBPACK_IMPORTED_MODULE_7__.spheres.children[params.N - 1].material.transparent = true;\n        _libs_SphereHandler_js__WEBPACK_IMPORTED_MODULE_7__.spheres.children[params.N - 1].material.opacity = 0.;\n    });\n}\n\nfunction add_table_legs() {\n    let thickness = 2 * params.radius;\n    let cylinder = new THREE.CylinderGeometry(thickness, thickness, 0.98 * (params.table_height - params.L2), Math.pow(2, params.quality), Math.pow(2, params.quality));\n    let material = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });\n\n    let leg = new THREE.Mesh(cylinder, material);\n    leg.position.set(0.75 * (-params.L1 + thickness), (params.table_height - params.L2) / 2., -params.L3 + thickness);\n    _index__WEBPACK_IMPORTED_MODULE_15__.scene.add(leg.clone());\n    leg.position.set(0.75 * (params.L1 - thickness), (params.table_height - params.L2) / 2., -params.L3 + thickness);\n    _index__WEBPACK_IMPORTED_MODULE_15__.scene.add(leg.clone());\n    leg.position.set(0.75 * (-params.L1 + thickness), (params.table_height - params.L2) / 2., params.L3 - thickness);\n    _index__WEBPACK_IMPORTED_MODULE_15__.scene.add(leg.clone());\n    leg.position.set(0.75 * (params.L1 - thickness), (params.table_height - params.L2) / 2., params.L3 - thickness);\n    _index__WEBPACK_IMPORTED_MODULE_15__.scene.add(leg);\n\n}\n\nasync function update() {\n    if ( _index__WEBPACK_IMPORTED_MODULE_15__.visibility === 'visible' && started ) {\n        // params = CONTROLLERS.moveInD4(params, controls);\n        _libs_PoolCue_js__WEBPACK_IMPORTED_MODULE_11__.snap(_index__WEBPACK_IMPORTED_MODULE_15__.controls);\n        _libs_SphereHandler_js__WEBPACK_IMPORTED_MODULE_7__.move_spheres(S, params);\n        if (params.audio) {\n            _libs_SphereHandler_js__WEBPACK_IMPORTED_MODULE_7__.update_fixed_sounds(S, params);\n        }\n\n        if (_libs_PoolCue_js__WEBPACK_IMPORTED_MODULE_11__.pool_cue !== undefined) {\n\n            let end_of_pool_cue = new THREE.Vector3();\n\n            _libs_PoolCue_js__WEBPACK_IMPORTED_MODULE_11__.small_sphere.getWorldPosition(end_of_pool_cue);\n\n            S.simu_fixParticle(params.N - 1,\n                [end_of_pool_cue.x,\n                end_of_pool_cue.z,\n                end_of_pool_cue.y,\n                // params.d4.cur\n                ]);\n        }\n\n        S.simu_step_forward(20);\n        // WALLS.update_d4(params);\n\n        check_pockets();\n\n        _index__WEBPACK_IMPORTED_MODULE_15__.controls.update();\n    }\n\n}\n\nlet pocket_locs = [\n    [-params.L1, -params.L3],\n    [-params.L1, params.L3],\n    [params.L1, -params.L3],\n    [params.L1, params.L3],\n    [0, -params.L3],\n    [0, params.L3],\n];\n\nfunction in_pocket(loc) {\n    let retval = false;\n\n    pocket_locs.forEach(pocket => {\n        if (Math.pow(loc.x - pocket[0], 2) + Math.pow(loc.z - pocket[1], 2) < params.pocket_size * params.pocket_size) {\n            console.log('fallen off table (hopefully out of a hole)')\n            retval = true;\n        }\n    });\n    return retval;\n}\n\nasync function check_pockets() {\n    for (let i = 0; i < params.N - 1; i++) {\n        // var object = SPHERES.spheres.children[i];\n        if (!sunk_balls.includes(i)) {\n            if (in_pocket(_libs_SphereHandler_js__WEBPACK_IMPORTED_MODULE_7__.spheres.children[i].position)) {\n                if (i == 0) {\n                    console.log('sunk white ball')\n                    S.simu_fixParticle(0, params.white_ball_initial_loc)\n                }\n                // else if (i == 11) {\n                //     console.log('sunk black ball')\n                //     if (sunk_balls.length < params.N - 1) {\n                //         alert('You need to sink all of the coloured balls before the black ball. You lose.')\n                //     } else {\n                //         alert('You win!')\n                //     }\n                //     set_ball_positions();\n                // }\n                else {\n                    console.log('SUNK BALL ' + String(i))\n                    // object.visible = false;\n                    sunk_balls.push(i)\n                    S.simu_fixParticle(i, [1.1 * params.L1, params.table_height, sunk_balls.length * 2 * params.radius, 0])\n                    S.simu_setFrozen(i);\n\n                }\n            }\n        }\n    }\n}\n\nasync function NDDEMPhysics() {\n    await _index__WEBPACK_IMPORTED_MODULE_15__.NDDEMCGLib.init(params.dimension, params.N);\n    S = _index__WEBPACK_IMPORTED_MODULE_15__.NDDEMCGLib.S;\n    setup_NDDEM();\n    started = true;\n}\n\n\nfunction setup_NDDEM() {\n    S.simu_interpret_command(\"dimensions \" + String(params.dimension) + \" \" + String(params.N));\n\n    S.simu_interpret_command(\"radius -1 \" + String(params.radius));\n    // now need to find the mass of a particle with diameter 1\n\n    S.simu_interpret_command(\"mass -1 \" + String(params.particle_mass));\n    S.simu_interpret_command(\"auto rho\");\n    S.simu_interpret_command(\"auto mass\");\n    S.simu_interpret_command(\"auto inertia\");\n    S.simu_interpret_command(\"auto skin\");\n\n    S.simu_interpret_command(\"boundary 0 WALL -\" + String(params.L1) + \" \" + String(params.L1));\n    S.simu_interpret_command(\"boundary 1 WALL -\" + String(params.L3) + \" \" + String(params.L3));\n    S.simu_interpret_command(\"boundary 2 WALL \" + String(-params.L2 + params.table_height) + \" \" + String(params.L2 + params.table_height));\n    // S.simu_interpret_command(\"boundary 3 WALL -\" + String(params.L4) + \" \" + String(params.L4));\n    // S.interpret_command(\"body \" + STLFilename);\n    S.simu_interpret_command(\"gravity 0 0 -9.81\");\n    // S.interpret_command(\"auto location randomdrop\");\n\n    set_ball_positions();\n\n    let tc = 20 * params.dt;\n    let rest = 0.5; // super low restitution coeff to dampen out quickly\n    let vals = _libs_SphereHandler_js__WEBPACK_IMPORTED_MODULE_7__.setCollisionTimeAndRestitutionCoefficient(tc, rest, params.particle_mass)\n\n    S.simu_interpret_command(\"set Kn \" + String(vals.stiffness));\n    S.simu_interpret_command(\"set Kt \" + String(0.8 * vals.stiffness));\n    S.simu_interpret_command(\"set GammaN \" + String(vals.dissipation));\n    S.simu_interpret_command(\"set GammaT \" + String(vals.dissipation));\n    S.simu_interpret_command(\"set Mu 0.1\");\n    S.simu_interpret_command(\"set Mu_wall 0.5\");\n    S.simu_interpret_command(\"set damping 6e-4\");\n    S.simu_interpret_command(\"set T 150\");\n    S.simu_interpret_command(\"set dt \" + String(params.dt));\n    S.simu_interpret_command(\"set tdump 1000000\"); // how often to calculate wall forces\n    S.simu_finalise_init();\n}\n\nfunction set_ball_positions() {\n    let n = 1;\n    let offset = params.L1 / 2;\n\n    params.white_ball_initial_loc = [offset, 0, params.table_height - params.L2 + params.radius, 0.001 * (Math.random() - 0.5)];\n    S.simu_interpret_command(\"location \" + String(0) + \" \"\n        + String(params.white_ball_initial_loc[0]) + \" \"\n        + String(params.white_ball_initial_loc[1]) + \" \"\n        + String(params.white_ball_initial_loc[2])); // first ball is the white ball\n\n    // for (var k = 0; k < params.pyramid_size; k++) {\n        var k = 0;\n        let cur_pyramid_length = params.pyramid_size - k;\n        // let w = k * 1.825 * params.radius;\n        for (var i = 0; i < cur_pyramid_length; i++) {\n            for (var j = 0; j < cur_pyramid_length - i; j++) {\n                let x = i * 1.82 * params.radius - cur_pyramid_length * params.radius + params.radius - offset;\n                let y = j * 2.01 * params.radius - (cur_pyramid_length - i) * params.radius + params.radius;// - i%2*radius;\n                S.simu_interpret_command(\"location \" + String(n) + \" \" + String(x) + \" \" + String(y) + \" \" + String(params.table_height - params.L2 + params.radius));\n                n++;\n                // if (k > 0) { S.simu_interpret_command(\"location \" + String(n) + \" \" + String(x) + \" \" + String(y) + \" \" + String(params.table_height - params.L2 + params.radius)); n++; }\n            }\n        }\n\n    // add the cue stick\n    // S.simu_interpret_command(\"location \" + String(params.N) + \" 0 0 0 0\");\n\n}\n\nfunction loadSTL() {\n    meshes = new THREE.Group;\n    const loader = new _libs_NDSTLLoader_js__WEBPACK_IMPORTED_MODULE_8__.NDSTLLoader();\n    loader.load([STLFilename], function (solids) {\n        NDsolids = solids;\n        replace_meshes();\n    })\n}\n\nfunction load_nice_pool_table() {\n    var gltfloader = new three_examples_jsm_loaders_GLTFLoader_js__WEBPACK_IMPORTED_MODULE_6__.GLTFLoader();\n    gltfloader.load(\"./pool.glb\", function( object ) { \n        _resources_4d_pool_stl__WEBPACK_IMPORTED_MODULE_3__ = object.scene.children[0];\n        _resources_4d_pool_stl__WEBPACK_IMPORTED_MODULE_3__.scale.set(0.012,0.012,0.012);\n        _index__WEBPACK_IMPORTED_MODULE_15__.scene.add( _resources_4d_pool_stl__WEBPACK_IMPORTED_MODULE_3__ );\n        \n    });\n}\n\nfunction replace_meshes() {\n    if (NDsolids.length > 0) {\n        if (meshes !== undefined) {\n            _index__WEBPACK_IMPORTED_MODULE_15__.scene.remove(meshes);\n            dispose_children(meshes);\n            meshes = new THREE.Group();\n        }\n        meshes = (0,_libs_NDSTLLoader_js__WEBPACK_IMPORTED_MODULE_8__.renderSTL)(meshes, NDsolids, _index__WEBPACK_IMPORTED_MODULE_15__.scene, material, 0);\n        meshes.position.y = params.table_height;\n        _index__WEBPACK_IMPORTED_MODULE_15__.scene.add(meshes);\n    }\n}\n\nfunction get_num_particles(L) {\n    let N = 0;\n    let i = 1;\n    for (var n = L; n > 0; n--) {\n        N += i * n;\n        i += 2;\n    }\n    return N + 2; // adding the white ball and cue stick\n}\n\nfunction dispose_children(target) {\n    for (var i = 0; i < target.children.length; i++) {\n        target.children[i].geometry.dispose();\n        target.children[i].material.dispose();\n    }\n}\n\n\n//# sourceURL=webpack://granular-vr/./src/3d-pool.js?");

/***/ }),

/***/ "./text-to-speech/3d-pool.mp3":
/*!************************************!*\
  !*** ./text-to-speech/3d-pool.mp3 ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = __webpack_require__.p + \"39114480f18f5312e8e4.mp3\";\n\n//# sourceURL=webpack://granular-vr/./text-to-speech/3d-pool.mp3?");

/***/ })

}]);