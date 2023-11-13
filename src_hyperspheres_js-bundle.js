"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkgranular_vr"] = self["webpackChunkgranular_vr"] || []).push([["src_hyperspheres_js"],{

/***/ "./src/hyperspheres.js":
/*!*****************************!*\
  !*** ./src/hyperspheres.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"init\": () => (/* binding */ init)\n/* harmony export */ });\n/* harmony import */ var _css_main_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../css/main.css */ \"./css/main.css\");\n/* harmony import */ var _text_to_speech_hyperspheres_mp3__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../text-to-speech/hyperspheres.mp3 */ \"./text-to-speech/hyperspheres.mp3\");\n/* harmony import */ var _libs_buttons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../libs/buttons */ \"./libs/buttons.js\");\n/* harmony import */ var _libs_audio__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../libs/audio */ \"./libs/audio.js\");\n/* harmony import */ var _libs_lights__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../libs/lights */ \"./libs/lights.js\");\n/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./index */ \"./src/index.js\");\n/* provided dependency */ var THREE = __webpack_require__(/*! three */ \"./node_modules/three/build/three.module.js\");\n\n\n\n// import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';\n// import ImmersiveControls from '@depasquale/three-immersive-controls';\n\n// import * as CONTROLLERS from '../libs/controllers.js';\n\n\n\n\n\n\nlet label2, label3;\n\nfunction init() {\n    _libs_lights__WEBPACK_IMPORTED_MODULE_4__.add_default_lights(_index__WEBPACK_IMPORTED_MODULE_5__.scene);\n\n\n    const sphere_geometry = new THREE.SphereGeometry(0.5, 256, 256);\n    const circle_geometry = new THREE.CircleGeometry(0.5, 256);\n    const material = new THREE.MeshStandardMaterial({ color: 0xeeeeee, side: THREE.DoubleSide });\n    const arrow_material = new THREE.MeshStandardMaterial({ color: 0xfc2eff, side: THREE.DoubleSide });\n\n    const base_geometry = new THREE.PlaneGeometry(10, 10);\n    const base_material = new THREE.MeshBasicMaterial({ color: 0x333333, side: THREE.DoubleSide });\n    const plane = new THREE.Mesh(base_geometry, base_material);\n    plane.rotateX(Math.PI / 2.);\n    _index__WEBPACK_IMPORTED_MODULE_5__.scene.add(plane);\n\n    var sphere = new THREE.Mesh(sphere_geometry, material);\n    var circle = new THREE.Mesh(circle_geometry, material.clone());\n    sphere.material.transparent = true;\n    sphere.material.opacity = 0.7;\n    sphere.material.roughness = 0.2;\n    sphere.material.metalness = 0.5;\n    const line_geometry = new THREE.CylinderGeometry(0.01, 0.01, 1, 32);\n\n    var line = new THREE.Mesh(line_geometry, material);\n    line.rotateZ(Math.PI / 2);\n    sphere.position.x = 1.5;\n    circle.position.x = 0;\n    line.position.x = -1.5;\n\n\n    let label1 = new THREE.Group();\n    const head_geometry = new THREE.CylinderGeometry(0.03, 0.0, 0.05, 32);\n    let arrow_head = new THREE.Mesh(head_geometry, arrow_material);\n    arrow_head.rotateZ(Math.PI / 2);\n    arrow_head.position.x = 0.5 - 0.05 / 2.;\n    const body_geometry = new THREE.CylinderGeometry(0.01, 0.01, 0.5 - 0.03 / 2., 32);\n    let arrow_body = new THREE.Mesh(body_geometry, arrow_material);\n    arrow_body.rotateZ(Math.PI / 2);\n    arrow_body.position.x = (0.5 - 0.05 / 2.) / 2.;\n    let radius_text = _libs_buttons__WEBPACK_IMPORTED_MODULE_2__.make_text('r', 0xfc2eff, [0.25, -0.12, 0], 0.5);\n    // radius_text.position.x = 0.25;\n    // radius_text.position.y = -0.12;\n\n    label1.add(arrow_head);\n    label1.add(arrow_body);\n    label1.add(radius_text);\n\n    label2 = label1.clone()\n    label3 = label1.clone()\n    label1.position.x = -1.5;\n    label1.position.y -= 0.03 + 0.01;\n    label3.position.x = 1.5;\n\n\n    let objects = new THREE.Group();\n\n    objects.add(sphere);\n    objects.add(circle);\n    objects.add(line);\n    objects.add(label1);\n    objects.add(label2);\n    objects.add(label3);\n\n    objects.position.y = 1.6;\n    objects.remove_me = true;\n    _index__WEBPACK_IMPORTED_MODULE_5__.scene.add(objects);\n\n    _index__WEBPACK_IMPORTED_MODULE_5__.renderer.setAnimationLoop(update);\n\n    _libs_buttons__WEBPACK_IMPORTED_MODULE_2__.add_scene_change_button(_index__WEBPACK_IMPORTED_MODULE_5__.apps.list[_index__WEBPACK_IMPORTED_MODULE_5__.apps.current - 1].url, 'Back: ' + _index__WEBPACK_IMPORTED_MODULE_5__.apps.list[_index__WEBPACK_IMPORTED_MODULE_5__.apps.current - 1].name, _index__WEBPACK_IMPORTED_MODULE_5__.controls, _index__WEBPACK_IMPORTED_MODULE_5__.scene, [-1, 1, 1], 0.25, [0, Math.PI / 4, 0]);\n    setTimeout(() => { _libs_buttons__WEBPACK_IMPORTED_MODULE_2__.add_scene_change_button(_index__WEBPACK_IMPORTED_MODULE_5__.apps.list[_index__WEBPACK_IMPORTED_MODULE_5__.apps.current + 1].url, 'Next: ' + _index__WEBPACK_IMPORTED_MODULE_5__.apps.list[_index__WEBPACK_IMPORTED_MODULE_5__.apps.current + 1].name, _index__WEBPACK_IMPORTED_MODULE_5__.controls, _index__WEBPACK_IMPORTED_MODULE_5__.scene, [1, 1, 1], 0.25, [0, -Math.PI / 4, 0]) }, _index__WEBPACK_IMPORTED_MODULE_5__.apps.list[_index__WEBPACK_IMPORTED_MODULE_5__.apps.current].button_delay);\n}\n\nasync function update() {\n    if ( _index__WEBPACK_IMPORTED_MODULE_5__.visibility === 'visible' ) {\n        var t = _index__WEBPACK_IMPORTED_MODULE_5__.clock.getDelta();\n        label2.rotateZ(0.2 * t);\n        label3.rotateZ(0.2 * t);\n        label3.rotateY(0.2 * t);\n        if (_index__WEBPACK_IMPORTED_MODULE_5__.controls !== undefined) { _index__WEBPACK_IMPORTED_MODULE_5__.controls.update(); }\n        _index__WEBPACK_IMPORTED_MODULE_5__.renderer.render(_index__WEBPACK_IMPORTED_MODULE_5__.scene, _index__WEBPACK_IMPORTED_MODULE_5__.camera);\n    }\n}\n\n//# sourceURL=webpack://granular-vr/./src/hyperspheres.js?");

/***/ }),

/***/ "./text-to-speech/hyperspheres.mp3":
/*!*****************************************!*\
  !*** ./text-to-speech/hyperspheres.mp3 ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = __webpack_require__.p + \"7f507776a68be4b7ef28.mp3\";\n\n//# sourceURL=webpack://granular-vr/./text-to-speech/hyperspheres.mp3?");

/***/ })

}]);