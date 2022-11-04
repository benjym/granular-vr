export function onRedirectButtonSelectStart( object, controller ) {
    window.location.href = object.userData.url; // simulate mouse click
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