"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkgranular_vr"] = self["webpackChunkgranular_vr"] || []).push([["src_preamble_js"],{

/***/ "./src/preamble.js":
/*!*************************!*\
  !*** ./src/preamble.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"camera\": () => (/* binding */ camera),\n/* harmony export */   \"clock\": () => (/* binding */ clock),\n/* harmony export */   \"controls\": () => (/* binding */ controls),\n/* harmony export */   \"move_to\": () => (/* binding */ move_to),\n/* harmony export */   \"renderer\": () => (/* binding */ renderer),\n/* harmony export */   \"scene\": () => (/* binding */ scene)\n/* harmony export */ });\n/* harmony import */ var _depasquale_three_immersive_controls__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @depasquale/three-immersive-controls */ \"./node_modules/@depasquale/three-immersive-controls/build/three-immersive-controls.js\");\n/* harmony import */ var _libs_controllers_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../libs/controllers.js */ \"./libs/controllers.js\");\n/* harmony import */ var _libs_SphereHandler_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../libs/SphereHandler.js */ \"./libs/SphereHandler.js\");\n/* harmony import */ var _libs_WallHandler_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../libs/WallHandler.js */ \"./libs/WallHandler.js\");\n/* harmony import */ var _libs_buttons__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../libs/buttons */ \"./libs/buttons.js\");\n/* harmony import */ var _libs_graphs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../libs/graphs */ \"./libs/graphs.js\");\n/* harmony import */ var _libs_audio__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../libs/audio */ \"./libs/audio.js\");\n/* harmony import */ var _libs_lights__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../libs/lights */ \"./libs/lights.js\");\n/* provided dependency */ var THREE = __webpack_require__(/*! three */ \"./node_modules/three/build/three.module.js\");\n\n\n\n\n\n\n\n\n\nlet container = document.createElement(\"div\");\ndocument.body.appendChild(container);\n\nlet camera, scene, renderer, controls, clock;\n\nasync function add_common_properties() {\n    clock = new THREE.Clock();\n\n    // let urlParams = new URLSearchParams(window.location.search);\n    // if (urlParams.has('quality')) { params.quality = parseInt(urlParams.get('quality')); }\n\n    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1e-2, 100);\n\n    renderer = new THREE.WebGLRenderer({ antialias: true });//, logarithmicDepthBuffer: true });\n    renderer.setPixelRatio(window.devicePixelRatio);\n    renderer.setSize(window.innerWidth, window.innerHeight);\n    // renderer.shadowMap.enabled = true;\n    // renderer.shadowMap.mapSize = new THREE.Vector2(512,512);\n    // renderer.shadowMap.type = THREE.PCFSoftShadowMap;\n    // renderer.outputEncoding = THREE.sRGBEncoding;\n\n\n    container.appendChild( renderer.domElement );\n\n    wipe_scene();\n\n    window.addEventListener('resize', onWindowResize, false);\n}\n\nfunction wipe_scene() {\n    // if ( scene !== undefined ) { scene.dispose() // not implemented }\n    // if ( controls !== undefined ) { controls.dispose() // not implemented }\n    scene = new THREE.Scene();\n    scene.background = new THREE.Color(0x111);\n\n    controls = new _depasquale_three_immersive_controls__WEBPACK_IMPORTED_MODULE_0__[\"default\"](camera, renderer, scene, {\n        initialPosition: new THREE.Vector3(0, 1.6, 2),\n        showEnterVRButton: false,\n        showExitVRButton: false,\n        // moveSpeed: { keyboard: 0.025, vr: 0.025 }\n    });\n\n    _libs_audio__WEBPACK_IMPORTED_MODULE_6__.end_current_track();\n}\n\nadd_common_properties();\n\nfunction onWindowResize() {\n\n    camera.aspect = window.innerWidth / window.innerHeight;\n    camera.updateProjectionMatrix();\n\n    renderer.setSize(window.innerWidth, window.innerHeight);\n}\n\nfunction move_to( filename ) {\n    console.log('CHANGING TO ' + filename)\n        __webpack_require__(\"./src lazy recursive ^\\\\.\\\\/.*$\")(\"./\" + filename).then((module) => {\n            wipe_scene();\n            module.init();\n        });\n}\n\n// import(\"./\" + file).then((module) => {\n//     module.init();\n// });\n\n//# sourceURL=webpack://granular-vr/./src/preamble.js?");

/***/ })

}]);