import { spheres } from "./SphereHandler";

let ref_location;
let old_ref_location = new THREE.Vector3(NaN,NaN,NaN);
let data_points;

export function add_ghosts(scene, N=1000, radius=0.005, color=0xeeeeee) {
    data_points = new THREE.Group();
    data_points.nchildren = N;
    data_points.last_updated = 0;
    data_points.prev_updated = 0;
    
    let fg_mat = new THREE.PointsMaterial({ color: color, side: THREE.DoubleSide });
    // let fg_mat = new THREE.MeshStandardMaterial({ color: color, side: THREE.DoubleSide });
    // let fg_geom = new THREE.CircleGeometry(radius, 8);
    let fg_geom = new THREE.CylinderGeometry(radius/5., radius/5., 1, 4);
    fg_geom.applyMatrix4( new THREE.Matrix4().makeRotationX( Math.PI / 2 ) ); // rotate the geometry to make the forces point in the right direction

    let data_point = new THREE.Mesh(fg_geom, fg_mat);
    data_point.position.set(NaN, NaN, NaN); // don't show to begin with

    for (let i = 0; i < data_points.nchildren; i++) {
        data_points.add(data_point.clone());
    }
    scene.add(data_points);
}

export function reset_ghosts(){
    if ( data_points !== undefined ) {
        for (let i = 0; i < data_points.nchildren; i++) {
            data_points.children[i].position.set(NaN,NaN,NaN);
            data_points.children[i].scale.z = 0;
        }
        // onDeselectParticle();
    }
    ref_location = undefined;
    old_ref_location = new THREE.Vector3(NaN,NaN,NaN);
    // INTERSECTED = 0;
}


export function update_ghosts() {
    if ( spheres.children[0] !== undefined && data_points !== undefined ) {
        ref_location = spheres.children[0].position;
        data_points.children[data_points.last_updated].position.x = (ref_location.x + old_ref_location.x)/2.;
        data_points.children[data_points.last_updated].position.y = (ref_location.y + old_ref_location.y)/2.;
        data_points.children[data_points.last_updated].position.z = (ref_location.z + old_ref_location.z)/2.;

        let l = ref_location.distanceTo(old_ref_location);
        data_points.children[data_points.last_updated].scale.z = l;
        data_points.children[data_points.last_updated].lookAt(ref_location);

        data_points.prev_updated = data_points.last_updated;
        data_points.last_updated += 1;

        old_ref_location = ref_location.clone();
        if (data_points.last_updated == data_points.nchildren - 1) { data_points.last_updated = 0; }
    }
}