import { move_to } from "../src/index.js";

export function moveInD4(params, controller) {
    if (controller.vrControls.controllers.right !== undefined) {
        let d4_rate = 0.01;
        params.d4.cur += d4_rate * controls.vrControls.controllers.right.gamepad.axes[3];
        if (params.d4.cur < params.d4.min) {
            params.d4.cur = params.d4.min;
        } else if (params.d4.cur > params.d4.max) {
            params.d4.cur = params.d4.max;
        }
    }
    return params
}

export function onRedirectButtonSelectStart(object, controller) {
    window.location.href = object.userData.url; // simulate mouse click
}

export function onRedirectButtonSelectEnd(object, controller) {
    // do nothing, you're already gone
};

export function onSceneChangeButtonSelectStart(object, controller) {
    move_to(object.userData.new_scene);

}

export function onSceneChangeButtonSelectEnd(object, controller) {
    // do nothing, you're already gone
};

export function selectStartLoading(params, object, controller) {
    params.loading_active = !params.loading_active;
    // console.log(object.material)
    if (params.loading_active) { object.material.emissiveIntensity = 1; }
    else { object.material.emissiveIntensity = 0; }
}

export function selectEndLoading(params, object, controller) {
    // do nothing
}

export function intersectLoading(params, object) {
    if (params.loading_active) { object.material.emissiveIntensity = 1; }
    else { object.material.emissiveIntensity = 0; }
}

export const doNothing = () => { };

export function noEmissivity(object) {
    object.material.emissiveIntensity = 0;
}