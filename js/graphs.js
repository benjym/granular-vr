import * as BUTTONS from "./buttons";

let axes;
let data_points = new THREE.Group();
data_points.last_updated = 0;
data_points.nchildren = 1000;

export function add_axes(xlabel, ylabel, scene) {
    axes = new THREE.Group();
    let bg_mat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
    let bg_geom = new THREE.CylinderGeometry(0.01, 0.01, 1, 32);
    let background = new THREE.Mesh(bg_geom, bg_mat);

    let cone_geom = new THREE.CylinderGeometry(0.0, 0.02, 0.05, 32);
    let cone1 = new THREE.Mesh(cone_geom, bg_mat);
    cone1.position.y = 0.5;
    background.add(cone1);

    axes.add(background);

    let background2 = new THREE.Mesh(bg_geom, bg_mat);
    let cone2 = new THREE.Mesh(cone_geom, bg_mat);
    cone2.position.y = 0.5;
    background2.add(cone2);
    background2.rotateZ(-Math.PI / 2.);
    background2.position.x = 0.5;
    background2.position.y = -0.5;

    axes.add(background2);

    axes.scale.set(0.1, 0.1, 0.1);
    axes.position.set(0.05, 0, 0);

    axes.add(BUTTONS.make_button_object(xlabel, [1.2, -0.5, 0], 0.2));
    axes.add(BUTTONS.make_button_object(ylabel, [0.0, 0.6, 0], 0.2));

    let fg_mat = new THREE.PointsMaterial({ color: 0xaaaaaa });
    let fg_geom = new THREE.CircleGeometry(0.01, 8);
    let data_point = new THREE.Mesh(fg_geom, fg_mat);
    data_point.position.set(null, null, null); // don't show to begin with

    for (let i = 0; i < data_points.nchildren; i++) {
        data_points.add(data_point.clone());
    }

    axes.add(data_points)
    scene.add(axes);

}

export function update_data(xvalue, yvalue) {
    // console.log(data_points.last_updated)
    data_points.children[data_points.last_updated].position.x = xvalue;
    data_points.children[data_points.last_updated].position.y = yvalue - 0.5;

    data_points.last_updated += 1;
    if (data_points.last_updated == data_points.nchildren - 1) { data_points.last_updated = 0; }

}