"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkgranular_vr"] = self["webpackChunkgranular_vr"] || []).push([["src_dam-break_js"],{

/***/ "./src/dam-break.js":
/*!**************************!*\
  !*** ./src/dam-break.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"init\": () => (/* binding */ init),\n/* harmony export */   \"params\": () => (/* binding */ params)\n/* harmony export */ });\n/* harmony import */ var _css_main_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../css/main.css */ \"./css/main.css\");\n/* harmony import */ var three_examples_jsm_libs_lil_gui_module_min_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three/examples/jsm/libs/lil-gui.module.min.js */ \"./node_modules/three/examples/jsm/libs/lil-gui.module.min.js\");\n/* harmony import */ var _depasquale_three_immersive_controls__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @depasquale/three-immersive-controls */ \"./node_modules/@depasquale/three-immersive-controls/build/three-immersive-controls.js\");\n/* harmony import */ var _libs_controllers_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../libs/controllers.js */ \"./libs/controllers.js\");\n/* harmony import */ var _libs_SphereHandler_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../libs/SphereHandler.js */ \"./libs/SphereHandler.js\");\n/* harmony import */ var _libs_WallHandler_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../libs/WallHandler.js */ \"./libs/WallHandler.js\");\n/* harmony import */ var _libs_buttons__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../libs/buttons */ \"./libs/buttons.js\");\n/* harmony import */ var _libs_graphs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../libs/graphs */ \"./libs/graphs.js\");\n/* harmony import */ var _libs_audio__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../libs/audio */ \"./libs/audio.js\");\n/* harmony import */ var _libs_lights__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../libs/lights */ \"./libs/lights.js\");\n/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./index */ \"./src/index.js\");\n/* provided dependency */ var THREE = __webpack_require__(/*! three */ \"./node_modules/three/build/three.module.js\");\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nlet S;\n\nlet params = {\n    dimension: 3,\n    // L: 4, //system size\n    // L: 0.025,\n    // H: 0.05,\n    boxratio: 2,\n    initial_packing_fraction: 0.5,\n    N: 300,\n    epsilonv: 0,\n    gravity: false,\n    g_mag: 1e1,\n    paused: false,\n    H_cur: 0,\n    pressure_set_pt: 1e4,\n    deviatoric_set_pt: 0,\n    d4: { cur: 0 },\n    theta: 0,\n    // r_max: 0.0033,\n    // r_min: 0.0027,\n    r_max: 0.2,\n    r_min: 0.2,\n    // freq: 0.05,\n    new_line: false,\n    loading_rate: 0.01,\n    // max_vertical_strain: 0.3,\n    target_stress: 1e6,\n    unloading_stress: 100,\n    lut: 'None',\n    quality: 5,\n    vmax: 1, // max velocity to colour by\n    omegamax: 20, // max rotation rate to colour by\n    loading_active: false,\n    particle_density: 2700, // kg/m^3\n    particle_opacity: 0.8,\n    audio: false,\n    audio_sensitivity: 1,\n    F_mag_max: 2e4,\n    friction_coefficient: 0.5,\n    pressure: 0,\n    started: false,\n    wall_remove_time : 5,\n    reset_time: 20,\n    current_time: 0,\n    loading_direction: 1,\n    remove_wall : false,\n}\n\nfunction set_derived_properties() {\n    \n    params.average_radius = (params.r_min + params.r_max) / 2.;\n    params.thickness = 0.0001;//params.average_radius;\n\n    params.particle_volume = 4. / 3. * Math.PI * Math.pow(params.average_radius, 3);\n    console.log('estimate of particle volume: ' + params.particle_volume * params.N)\n    params.particle_mass = params.particle_volume * params.particle_density;\n    params.L = Math.pow(params.particle_volume * params.N / params.initial_packing_fraction / params.boxratio, 1. / 3.) / 2.;\n    params.H = params.L * params.boxratio;\n}\n\nfunction reset_particles() {\n    S.simu_interpret_command(\"boundary 0 WALL -\" + String(params.L) + \" \" + String(params.L));\n\n    set_derived_properties();\n    // SPHERES.randomise_particles_isotropic(params, S);\n    S.simu_randomDrop();\n    // WALLS.add_cuboid_walls(params);\n    // WALLS.update_isotropic_wall(params, S);\n    // setup_CG();\n    _libs_WallHandler_js__WEBPACK_IMPORTED_MODULE_5__.show_left();\n}\nfunction init() {\n    _libs_SphereHandler_js__WEBPACK_IMPORTED_MODULE_4__.createNDParticleShader(params).then(main);\n}\n\n\nasync function main() {\n    set_derived_properties();\n\n    await NDDEMPhysics();\n\n    const base_geometry = new THREE.PlaneGeometry(20, 2*params.L);\n    const base_material = new THREE.MeshBasicMaterial({ color: 0x333333, side: THREE.DoubleSide });\n    const plane = new THREE.Mesh(base_geometry, base_material);\n    plane.rotateX(Math.PI / 2.);\n    plane.position.y = 0;//-0.5 * params.r_min;\n    plane.position.x = -10 + params.L;\n    _index__WEBPACK_IMPORTED_MODULE_10__.scene.add(plane);\n\n    _libs_lights__WEBPACK_IMPORTED_MODULE_9__.add_default_lights(_index__WEBPACK_IMPORTED_MODULE_10__.scene);\n\n    _libs_WallHandler_js__WEBPACK_IMPORTED_MODULE_5__.add_dam_break_walls(params);\n\n\n    // WALLS.add_cuboid_walls(params);\n    _libs_WallHandler_js__WEBPACK_IMPORTED_MODULE_5__.walls.rotateX(-Math.PI / 2.); // fix y/z up compared to NDDEM\n    _libs_WallHandler_js__WEBPACK_IMPORTED_MODULE_5__.walls.rotateZ(Math.PI); // fix y/z up compared to NDDEM\n    // WALLS.walls.position.y = params.H;\n    // console.debug('rotated and placed walls')\n    _index__WEBPACK_IMPORTED_MODULE_10__.scene.add(_libs_WallHandler_js__WEBPACK_IMPORTED_MODULE_5__.walls);\n    // WALLS.update_isotropic_wall(params, S);\n    // WALLS.add_scale(params);\n\n\n    _libs_SphereHandler_js__WEBPACK_IMPORTED_MODULE_4__.add_spheres(S, params, _index__WEBPACK_IMPORTED_MODULE_10__.scene);\n\n    let gui = new three_examples_jsm_libs_lil_gui_module_min_js__WEBPACK_IMPORTED_MODULE_1__.GUI();\n    gui.width = 450;\n\n    gui.add(params, 'initial_packing_fraction', 0.35, 0.55, 0.01)\n        .name('Initial solids fraction').listen().onChange(reset_particles);\n    gui.add(params, 'loading_rate', 0.001, 0.1, 0.001).name('Volumetric strainrate (1/s)');\n    gui.add(params, 'target_stress', 0, 1e4).name('Target stress - loading');\n    gui.add(params, 'unloading_stress', 0, 1e4).name('Target stress - unloading');\n    gui.add(params, 'particle_opacity', 0, 1).name('Particle opacity').listen().onChange(() => _libs_SphereHandler_js__WEBPACK_IMPORTED_MODULE_4__.update_particle_material(params,\n        // lut_folder\n    ));\n    gui.add(params, 'friction_coefficient', 0, 2).name('Friction coefficient').listen().onChange(() => S.simu_interpret_command(\"set Mu \" + String(params.friction_coefficient)));\n    gui.add(params, 'lut', ['None', 'Velocity', 'Rotation Rate']).name('Colour by')\n        .onChange(() => _libs_SphereHandler_js__WEBPACK_IMPORTED_MODULE_4__.update_particle_material(params,\n            // lut_folder\n        ));\n    /*gui.add ( params, 'gravity').name('Gravity').listen()\n        .onChange( function() {\n            if ( params.gravity === true ) {\n                S.simu_interpret_command(\"gravity 0 0 -10 \" + \"0 \".repeat(params.dimension - 3)) }\n            else {\n                S.simu_interpret_command(\"gravity 0 0 0 \" + \"0 \".repeat(params.dimension - 3)) }\n            });*/\n    // gui.add ( params, 'new_line').name('New loading path').listen().onChange( new_load_path );\n    //gui.add ( params, 'paused').name('Paused').listen();\n    // gui.add(params, 'hideaxes').name(\"Static axes (allow many cycles)\").listen() ;\n    gui.add(params, 'audio_sensitivity', 1, 1e3, 1).name('Audio sensitivity');\n    gui.add(params, 'audio').name('Audio').listen().onChange(() => {\n        if (_libs_audio__WEBPACK_IMPORTED_MODULE_8__.listener === undefined) {\n            _libs_audio__WEBPACK_IMPORTED_MODULE_8__.make_listener(_index__WEBPACK_IMPORTED_MODULE_10__.camera);\n            _libs_audio__WEBPACK_IMPORTED_MODULE_8__.add_fixed_sound_source([0, 0, 0]);\n            // SPHERES.add_normal_sound_to_all_spheres();\n        } else {\n            // AUDIO.remove_listener( camera ); // doesn't do anything at the moment...\n            // SPHERES.mute_sounds();\n        }\n    });\n    // gui.add(params, 'remove_wall').name('Remove wall').listen().onChange(() => {\n    //     console.log('WALL CHANGE')\n    //     if ( params.remove_wall ) {\n    //         S.simu_interpret_command(\"boundary 0 WALL -\" + String(20*params.L) + \" \" + String(params.L));\n    //     } else {\n    //         reset_particles();\n    //     }\n    // });\n\n    gui.remove_me = true;\n\n    animate();\n\n    _libs_buttons__WEBPACK_IMPORTED_MODULE_6__.add_scene_change_button(_index__WEBPACK_IMPORTED_MODULE_10__.apps.list[_index__WEBPACK_IMPORTED_MODULE_10__.apps.current - 1].url, 'Back: ' + _index__WEBPACK_IMPORTED_MODULE_10__.apps.list[_index__WEBPACK_IMPORTED_MODULE_10__.apps.current - 1].name, _index__WEBPACK_IMPORTED_MODULE_10__.controls, _index__WEBPACK_IMPORTED_MODULE_10__.scene, [-1, 1, 1.5], 0.25, [0, Math.PI / 4, 0]);\n    setTimeout(() => { _libs_buttons__WEBPACK_IMPORTED_MODULE_6__.add_scene_change_button(_index__WEBPACK_IMPORTED_MODULE_10__.apps.list[_index__WEBPACK_IMPORTED_MODULE_10__.apps.current + 1].url, 'Next: ' + _index__WEBPACK_IMPORTED_MODULE_10__.apps.list[_index__WEBPACK_IMPORTED_MODULE_10__.apps.current + 1].name, _index__WEBPACK_IMPORTED_MODULE_10__.controls, _index__WEBPACK_IMPORTED_MODULE_10__.scene, [1, 1, 1.5], 0.25, [0, -Math.PI / 4, 0]) }, _index__WEBPACK_IMPORTED_MODULE_10__.apps.list[_index__WEBPACK_IMPORTED_MODULE_10__.apps.current].button_delay);\n\n}\n\n\nfunction animate() {\n    _index__WEBPACK_IMPORTED_MODULE_10__.renderer.setAnimationLoop(async function () {\n        if ( _index__WEBPACK_IMPORTED_MODULE_10__.visibility === 'visible' ) {\n            params.current_time += _index__WEBPACK_IMPORTED_MODULE_10__.clock.getDelta();\n            // console.log(params.current_time)\n            if ( params.current_time > params.reset_time && params.remove_wall ) {\n                params.current_time = 0;\n                params.remove_wall = false;\n                reset_particles();\n            }\n            if ( params.current_time > params.wall_remove_time && !params.remove_wall ) {\n                params.remove_wall = true;\n                _libs_WallHandler_js__WEBPACK_IMPORTED_MODULE_5__.hide_left();\n                S.simu_interpret_command(\"boundary 0 WALL -\" + String(20*params.L) + \" \" + String(params.L));\n            }\n            S.simu_step_forward(5);\n            _libs_SphereHandler_js__WEBPACK_IMPORTED_MODULE_4__.move_spheres(S, params);\n            if (_index__WEBPACK_IMPORTED_MODULE_10__.extra_params.has('forces')) { _libs_SphereHandler_js__WEBPACK_IMPORTED_MODULE_4__.draw_force_network(S, params, _index__WEBPACK_IMPORTED_MODULE_10__.scene); }\n            if ( _index__WEBPACK_IMPORTED_MODULE_10__.controls !== undefined ) {\n                _index__WEBPACK_IMPORTED_MODULE_10__.controls.update();\n                // CONTROLLERS.toggleParticleOpacity(params,controls);\n            }\n        }\n        _index__WEBPACK_IMPORTED_MODULE_10__.renderer.render(_index__WEBPACK_IMPORTED_MODULE_10__.scene, _index__WEBPACK_IMPORTED_MODULE_10__.camera);\n    });\n\n\n\n}\n\nasync function NDDEMPhysics() {\n    await _index__WEBPACK_IMPORTED_MODULE_10__.NDDEMCGLib.init(params.dimension, params.N);\n    S = _index__WEBPACK_IMPORTED_MODULE_10__.NDDEMCGLib.S;\n    await setup_NDDEM();\n    // await setup_CG();\n}\n\nasync function setup_NDDEM() {\n    S.simu_interpret_command(\"dimensions \" + String(params.dimension) + \" \" + String(params.N));\n    S.simu_interpret_command(\"radius -1 0.5\");\n    // now need to find the mass of a particle with diameter 1\n    let m = 4. / 3. * Math.PI * 0.5 * 0.5 * 0.5 * params.particle_density;\n\n    S.simu_interpret_command(\"mass -1 \" + String(m));\n    S.simu_interpret_command(\"auto rho\");\n    S.simu_interpret_command(\"auto radius uniform \" + params.r_min + \" \" + params.r_max);\n    S.simu_interpret_command(\"auto mass\");\n    S.simu_interpret_command(\"auto inertia\");\n    S.simu_interpret_command(\"auto skin\");\n    // console.log(params.L, params.H)\n    S.simu_interpret_command(\"boundary 0 WALL -\" + String(params.L) + \" \" + String(params.L));\n    S.simu_interpret_command(\"boundary 1 WALL -\" + String(params.L) + \" \" + String(params.L));\n    S.simu_interpret_command(\"boundary 2 WALL 0 \" + String(2 * params.H));\n    \n    S.simu_interpret_command(\"gravity \" + String(-params.g_mag*Math.sin(params.theta*Math.PI/180.)) + \" 0 \" + String(-params.g_mag*Math.cos(params.theta*Math.PI/180.)))\n    // S.simu_interpret_command(\"gravity 0 0 -10\")\n\n    S.simu_interpret_command(\"auto location randomdrop\");\n    // S.simu_interpret_command(\"auto location roughinclineplaneZ\");\n\n    // let n = 0;\n    // // for (let i = -params.L+params.r_max; i < params.L-params.r_max; i+=2*params.r_max) {\n    // //     for (let j = -params.L+params.r_max; j < params.L-params.r_max; j+=2*params.r_max) {\n    // //         S.simu_interpret_command(\"location \" + String(n) + \" \" + String(i) + \" \" + String(j) + \" 0\");\n    // //         S.simu_setRadius(n, params.r_max);\n    // //         S.simu_setFrozen(n);\n    // //         n++;\n    // //         // console.log(n)\n    // //     }\n    // // }\n    // for (let i=n; i<params.N; i++) {\n    //     S.simu_fixParticle(i,[params.L*(2*Math.random()-1),params.L*(2*Math.random()-1),3*params.r_max + (2*params.H-4*params.r_max)*Math.random()])\n    // }\n\n    let tc = 1e-2;\n    let rest = 0.2; // super low restitution coeff to dampen out quickly\n    let min_particle_mass = params.particle_density * 4. / 3. * Math.PI * Math.pow(params.r_min, 3);\n    let vals = _libs_SphereHandler_js__WEBPACK_IMPORTED_MODULE_4__.setCollisionTimeAndRestitutionCoefficient(tc, rest, min_particle_mass);\n    S.simu_interpret_command(\"set Kn \" + String(vals.stiffness));\n    S.simu_interpret_command(\"set Kt \" + String(0.8 * vals.stiffness));\n    S.simu_interpret_command(\"set GammaN \" + String(vals.dissipation));\n    S.simu_interpret_command(\"set GammaT \" + String(vals.dissipation));\n\n    // let bulk_modulus = 1e6;\n    // let poisson_coefficient = 0.5;\n    // let tc = SPHERES.getHertzCriticalTimestep(bulk_modulus, poisson_coefficient, params.r_min, params.particle_density);\n    // S.simu_interpret_command(\"set Kn \" + String(bulk_modulus));\n    // S.simu_interpret_command(\"set Kt \" + String(0.8*bulk_modulus));\n    // S.simu_interpret_command(\"set GammaN 0.2\"); //+ String(vals.dissipation));\n    // S.simu_interpret_command(\"set GammaT 0.2\"); //+ String(vals.dissipation));\n    // S.simu_interpret_command(\"ContactModel Hertz\");\n\n    S.simu_interpret_command(\"set Mu \" + String(params.friction_coefficient));\n    S.simu_interpret_command(\"set Mu_wall 1\");\n    // S.simu_interpret_command(\"set damping 0.01\");\n    S.simu_interpret_command(\"set T 150\");\n    S.simu_interpret_command(\"set dt \" + String(tc / 10));\n    S.simu_interpret_command(\"set tdump 1000000\"); // how often to calculate wall forces\n\n    await S.simu_finalise_init();\n}\n\n// async function setup_CG() {\n//     var cgparam = {};\n//     cgparam[\"file\"] = [{ \"filename\": \"none\", \"content\": \"particles\", \"format\": \"interactive\", \"number\": 1 }];\n//     cgparam[\"boxes\"] = [1, 1, 1];\n//     // cgparam[\"boundaries\"]=[[-params.L,-params.L,-params.L],[params.L,params.L,params.L]] ;\n//     cgparam[\"boundaries\"] = [\n//         [-params.L / 2., -params.L / 2., params.boxratio * params.L / 2.],\n//         [params.L / 2., params.L / 2., 3 * params.boxratio * params.L / 2.]];\n//     // [-params.L+params.r_max,-params.L+params.r_max,-params.L+params.r_max],\n//     // [ params.L-params.r_max, params.L-params.r_max, params.L-params.r_max]] ;\n\n//     cgparam[\"window size\"] = params.L / 2.;\n//     cgparam[\"skip\"] = 0;\n//     cgparam[\"max time\"] = 1;\n//     cgparam[\"time average\"] = \"None\";\n//     cgparam[\"fields\"] = [\"RHO\", \"TC\"];\n//     cgparam[\"periodicity\"] = [false, false, false];\n//     cgparam[\"window\"] = \"Lucy3D\";\n//     cgparam[\"dimension\"] = 3;\n\n\n//     // console.log(JSON.stringify(cgparam)) ;\n//     await S.cg_param_from_json_string(JSON.stringify(cgparam));\n//     await S.cg_setup_CG();\n// }\n\n// main();\n\n\n//# sourceURL=webpack://granular-vr/./src/dam-break.js?");

/***/ })

}]);