"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkgranular_vr"] = self["webpackChunkgranular_vr"] || []).push([["src_menu_js"],{

/***/ "./src/menu.js":
/*!*********************!*\
  !*** ./src/menu.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"init\": () => (/* binding */ init)\n/* harmony export */ });\n/* harmony import */ var _css_main_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../css/main.css */ \"./css/main.css\");\n/* harmony import */ var _depasquale_three_immersive_controls__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @depasquale/three-immersive-controls */ \"./node_modules/@depasquale/three-immersive-controls/build/three-immersive-controls.js\");\n/* harmony import */ var _libs_buttons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../libs/buttons */ \"./libs/buttons.js\");\n/* harmony import */ var _libs_lights__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../libs/lights */ \"./libs/lights.js\");\n/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./index */ \"./src/index.js\");\n/* provided dependency */ var THREE = __webpack_require__(/*! three */ \"./node_modules/three/build/three.module.js\");\n\n// import loading_css from \"../css/loading_screen.css\";\n\n\n// import * as CONTROLLERS from \"../libs/controllers\";\n\n// import * as AUDIO from \"../libs/audio\";\n\n\n\n\nfunction init() {\n\n    _libs_lights__WEBPACK_IMPORTED_MODULE_3__.add_default_lights(_index__WEBPACK_IMPORTED_MODULE_4__.scene);\n\n    const base_geometry = new THREE.PlaneGeometry(10, 10);\n    const base_material = new THREE.MeshBasicMaterial({ color: 0x333333, side: THREE.DoubleSide });\n    const plane = new THREE.Mesh(base_geometry, base_material);\n    plane.rotateX(Math.PI / 2.);\n    plane.remove_me = true;\n    _index__WEBPACK_IMPORTED_MODULE_4__.scene.add(plane);\n\n    let height = (_index__WEBPACK_IMPORTED_MODULE_4__.apps.list.length)*0.2;\n    _index__WEBPACK_IMPORTED_MODULE_4__.apps.list.forEach( (val, index) => {\n        if ( val.url !== 'menu' ) {\n            _libs_buttons__WEBPACK_IMPORTED_MODULE_2__.add_scene_change_button(val.url, String(index) + '. ' + val.name, _index__WEBPACK_IMPORTED_MODULE_4__.controls, _index__WEBPACK_IMPORTED_MODULE_4__.scene, [0, height - 0.2*index, 0], 0.3, [0, 0, 0]);\n        }\n    });\n\n    _index__WEBPACK_IMPORTED_MODULE_4__.renderer.setAnimationLoop(render);\n}\n\nfunction render() {\n    if ( _index__WEBPACK_IMPORTED_MODULE_4__.controls !== undefined ) { _index__WEBPACK_IMPORTED_MODULE_4__.controls.update() }\n    _index__WEBPACK_IMPORTED_MODULE_4__.renderer.render(_index__WEBPACK_IMPORTED_MODULE_4__.scene, _index__WEBPACK_IMPORTED_MODULE_4__.camera);\n};\n\n//# sourceURL=webpack://granular-vr/./src/menu.js?");

/***/ })

}]);