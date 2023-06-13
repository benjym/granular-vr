export function add_default_lights( scene ) {
    let background_light = new THREE.AmbientLight( 0x777777 );
    scene.add( background_light );

    let fill_light = new THREE.PointLight(0x999999);
    fill_light.position.set( 0, 2.5, 2 ); 
    scene.add( fill_light );
}

export function add_smaller_lights( scene ) {
    let background_light = new THREE.AmbientLight( 0x777777 );
    scene.add( background_light );

    let fill_light = new THREE.PointLight(0x999999);
    fill_light.position.set( 0, 1.9, 1.5 ); 
    scene.add( fill_light );
}

