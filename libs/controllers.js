export function onRedirectButtonSelectStart( object, controller ) {
    window.location.href = object.userData.url + ".html"; // simulate mouse click
}

export function onRedirectButtonSelectEnd( object, controller ) {
    // do nothing, you're already gone
};

export function selectStartLoading( params, object, controller ) {
    params.loading_active = !params.loading_active;
    // console.log(object.material)
    if ( params.loading_active ) { object.material.emissiveIntensity = 1; }
    else { object.material.emissiveIntensity = 0; }
}

export function selectEndLoading( params, object, controller ) {
    // do nothing
}

export function intersectLoading( params, object ) {
    if ( params.loading_active ) { object.material.emissiveIntensity = 1; }
    else { object.material.emissiveIntensity = 0; }
}

export const doNothing = () => {};

export function noEmissivity( object ) {
    object.material.emissiveIntensity = 0;
}


export const handleBeamSelectStart = (object, controller) => {
    // console.log(controller)
    if (renderer.xr.isPresenting) {
        if (controller !== undefined) {
            controller.selected = object;
            const intersection_point = controls.raycaster.intersectObject(object)[0].point;
            controller.select_start_position = intersection_point;
        }
    }
}

export const handleBeamIntersection = (object) => {
    if (renderer.xr.isPresenting) {
        // console.log(controls.vrControls.controllers.right.selected)
        let intersection_point;
        let controller;
        if (controls.vrControls.controllers.left.selected === object) {
            intersection_point = controls.raycaster.intersectObject(object)[0].point;
            controller = controls.vrControls.controllers.left;
        } else if (controls.vrControls.controllers.right.selected === object) {
            intersection_point = controls.raycaster.intersectObject(object)[0].point;
            controller = controls.vrControls.controllers.right;
        }
        if (intersection_point !== undefined) {
            params.displacement.subVectors(controller.select_start_position, intersection_point); // 
            params.load_position = intersection_point.x + params.length / 2.;
            params.displacement.y = Math.sign(params.displacement.y) * Math.min(Math.abs(params.displacement.y), PHYSICS.max_displacement);
            console.log(params.load_position);//,params.displacement.x,controller.select_start_position.x,intersection_point.x)

            const supportHaptic = 'hapticActuators' in controller.gamepad && controller.gamepad.hapticActuators != null && controller.gamepad.hapticActuators.length > 0;
            if ( supportHaptic ) {
                const intensity = Math.abs(PHYSICS.P/PHYSICS.P_max);
                controller.gamepad.hapticActuators[ 0 ].pulse( intensity, 100 );
            }
    
        }

    }
}