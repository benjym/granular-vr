import * as BUTTONS from "./buttons";

let axes;
let data_points = new THREE.Group();
data_points.last_updated = 0;
data_points.nchildren = 1000;
// let global_scale = 0.05;
let global_scale = 2;

export function add_axes(xlabel, ylabel, xmin, xmax, ymin, ymax, scene) {
    axes = new THREE.Group();
    let bg_mat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
    let bg_geom = new THREE.CylinderGeometry(0.02, 0.02, 1, 32);
    let background = new THREE.Mesh(bg_geom, bg_mat);

    let cone_geom = new THREE.CylinderGeometry(0.0, 0.04, 0.1, 32);
    let cone1 = new THREE.Mesh(cone_geom, bg_mat);
    cone1.position.y = 0.5;
    background.add(cone1);

    axes.add(background);

    let background2 = new THREE.Mesh(bg_geom, bg_mat);
    let cone2 = new THREE.Mesh(cone_geom, bg_mat);
    cone2.position.y = 0.55;
    background2.add(cone2);
    background2.rotateZ(-Math.PI / 2.);
    background2.position.x = 0.5;
    background2.position.y = -0.5;

    axes.add(background2);

    axes.scale.set(global_scale, global_scale, global_scale);
    axes.position.set(global_scale, 0.00, global_scale/2.);

    axes.add(BUTTONS.make_text(xlabel, [1.1, -0.52, 0], 0.2));
    axes.add(BUTTONS.make_text(ylabel, [-0.15, 0.55, 0], 0.2));

    axes.add(BUTTONS.make_text(xmin, [0.01, -0.59, 0], 0.2));
    axes.add(BUTTONS.make_text(xmax, [0.9, -0.59, 0], 0.2));
    axes.add(BUTTONS.make_text(ymin, [-0.07, -0.5, 0], 0.2));
    axes.add(BUTTONS.make_text(ymax, [-0.38, 0.47, 0], 0.2));

    let fg_mat = new THREE.PointsMaterial({ color: 0xeeeeee });
    let fg_geom = new THREE.CircleGeometry(0.005, 8);
    let data_point = new THREE.Mesh(fg_geom, fg_mat);
    data_point.position.set(null, null, null); // don't show to begin with

    for (let i = 0; i < data_points.nchildren; i++) {
        data_points.add(data_point.clone());
    }

    axes.add(data_points)

    scene.add(axes);

    return axes;

}

export function update_data(xvalue, yvalue) {
    // console.log(data_points.last_updated)
    data_points.children[data_points.last_updated].position.x = xvalue;
    data_points.children[data_points.last_updated].position.y = yvalue - 0.5;

    data_points.last_updated += 1;
    if (data_points.last_updated == data_points.nchildren - 1) { data_points.last_updated = 0; }

}