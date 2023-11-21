import { move_to } from "../src/index.js";

export function moveInD4(params, controller) {
    if (controller !== undefined) {
        if (controller.vrControls !== undefined ) {
            if (controller.vrControls.controllers.right !== undefined) {
                let d4_rate = 0.01;
                params.d4.cur += d4_rate * controls.vrControls.controllers.right.gamepad.axes[3];
                if (params.d4.cur < params.d4.min) {
                    params.d4.cur = params.d4.min;
                } else if (params.d4.cur > params.d4.max) {
                    params.d4.cur = params.d4.max;
                }
            }
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

export function onSceneChangeRainfallButtonSelectStart(object, controller) {
    console.log(object)
    object.S.simu_interpret_command("gravity 0 0 " + String(-50) + "0 ".repeat(object.dimension - 3));
    setTimeout(() => {object.S.simu_interpret_command("set damping 0.1");}, 2000);
    setTimeout(() => {move_to(object.userData.new_scene)}, 5000);
}

export function onSceneChangeButtonSelectEnd(object, controller) {
    console.log('scene change end')
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

export function toggleParticleOpacity(params, controls){
    if (controls.vrControls.controllerGrips.right !== undefined) {
        if ( controls.vrControls.controllerGrips.right.buttons.right.b.buttonDown ) {
            if (params.particle_opacity === 1) { params.particle_opacity = 0.2; }
            else { params.particle_opacity = 1; }
        }
    }
}