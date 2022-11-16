export let pool_cue, small_end_radius, small_sphere;

export async function add_pool_cue( target ) {
    pool_cue = new THREE.Group();

    small_end_radius = 0.02; // any smaller and things go very poorly (at least using the webxr fake platform with apparently large step sizes)
    let large_end_radius = 0.04;
    let length = 1.4;

    const cylinder_geometry = new THREE.CylinderGeometry( large_end_radius, small_end_radius, length, 16 );
    cylinder_geometry.applyMatrix4( new THREE.Matrix4().makeRotationX( -Math.PI / 2 ) ); // rotate the geometry to make the forces point in the right direction
    const wood_material = new THREE.MeshStandardMaterial( {color: 0x5d2906} ); // wood colour
    const cylinder = new THREE.Mesh( cylinder_geometry, wood_material );
    pool_cue.add(cylinder);

    const small_sphere_geometry = new THREE.SphereGeometry( small_end_radius, 32, 16 );
    const chalk = new THREE.MeshStandardMaterial( {color: 0xffffff} ); // chalk colour
    small_sphere = new THREE.Mesh( small_sphere_geometry, chalk );

    pool_cue.add(small_sphere);
    small_sphere.position.z = length/2.;

    const large_sphere_geometry = new THREE.SphereGeometry( large_end_radius, 32, 16 );
    const large_sphere = new THREE.Mesh( large_sphere_geometry, wood_material );

    pool_cue.add(large_sphere);
    large_sphere.position.z = -length/2.;

    // pool_cue.position.z = -length/4.

    pool_cue.remove_me = true;
    if ( target !== undefined ) { target.add( pool_cue ); }
    else {
        setTimeout(() => {add_pool_cue(target)}, 100);
    }

    return 1
}

export function snap ( controls ) {
    let loc = new THREE.Vector3();
    if ( controls.vrControls.controllers.left !== undefined ) {
        controls.vrControls.controllers.left.getWorldPosition( loc );
        pool_cue.lookAt( loc );
    }
}