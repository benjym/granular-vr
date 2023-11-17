export let left, right, floor, roof, front, back, walls;
export let axesHelper, arrow_x, arrow_y, arrow_z;
let arrow_body, arrow_head;
let textGeo_x, textGeo_y, textGeo_z;
// let font;
let vertical_wall_acceleration = 0;
let vertical_wall_velocity = 0;
let vertical_wall_displacement = 0;

// import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { font } from "./buttons";
import { Lut } from './Lut.js';

var lut = new Lut("bwr", 512); // options are rainbow, cooltowarm and blackbody
// var loader = new FontLoader();
// loader.load("../resources/helvetiker_bold.typeface.json", function (f) { font = f });

const wall_geometry = new THREE.BoxGeometry(1, 1, 1);
export const wall_material = new THREE.MeshStandardMaterial({side: THREE.DoubleSide});
let base_plane;

function add_wall_group() {
    walls = new THREE.Group();
    walls.remove_me = true;
    wall_material.wireframe = true;
}

add_wall_group();


const arrow_colour = 0xDDDDDD;
const arrow_material = new THREE.MeshLambertMaterial({ color: arrow_colour, side: THREE.DoubleSide });

export function add_base_plane(target) {
    const base_geometry = new THREE.PlaneGeometry(10, 10);
    // const base_material = new THREE.MeshBasicMaterial({ color: 0x333333, side: THREE.DoubleSide });
    const base_plane = new THREE.Mesh(base_geometry, wall_material);
    console.log(base_plane)
    base_plane.material.wireframe = false;
    base_plane.rotateX(Math.PI / 2.);
    base_plane.remove_me = true;
    
    target.add(base_plane);
}

export function add_shadows() {
    for (let i = 0; i < walls.children.length; i++) {
        var object = walls.children[i]
        object.castShadow = true;
        object.receiveShadow = true;
    }
}

export function add_left(params) {
    if (left !== undefined) { walls.remove(left); }
    left = new THREE.Mesh(wall_geometry, wall_material);
    left.scale.y = params.thickness;
    left.position.y = - params.L - params.thickness / 2.;
    // floor.receiveShadow = true;
    walls.add(left);
}

export function add_right(params) {
    if (right !== undefined) { walls.remove(right); }
    right = new THREE.Mesh(wall_geometry, wall_material);
    right.scale.y = params.thickness;
    right.position.y = params.L + params.thickness / 2.;
    // top.receiveShadow = true;
    walls.add(right);
}

export function add_floor(params) {
    if (floor !== undefined) { walls.remove(floor); }
    floor = new THREE.Mesh(wall_geometry, wall_material);
    floor.scale.y = params.thickness;
    floor.rotation.x = Math.PI / 2.;
    // floor.position.z = - params.L * params.aspect_ratio - params.thickness / 2.;
    // left.receiveShadow = true;
    walls.add(floor);
}

export function add_roof(params) {
    if (roof !== undefined) { walls.remove(roof); }
    roof = new THREE.Mesh(wall_geometry, wall_material);
    roof.scale.y = params.thickness;
    roof.rotation.x = Math.PI / 2.;
    roof.position.z = 2 * params.L * params.aspect_ratio + params.thickness / 2.;
    // right.receiveShadow = true;
    walls.add(roof);
}

export function add_front(params) {
    if (front !== undefined) { walls.remove(front); }
    front = new THREE.Mesh(wall_geometry, wall_material);
    front.scale.y = params.thickness;
    front.rotation.z = Math.PI / 2.;
    front.position.x = params.L + params.thickness / 2.;
    // back.receiveShadow = true;
    walls.add(front);
}

export function add_back(params) {
    if (back !== undefined) { walls.remove(back); }
    back = new THREE.Mesh(wall_geometry, wall_material);
    back.scale.y = params.thickness;
    back.rotation.z = Math.PI / 2.;
    back.position.x = -params.L - params.thickness / 2.;
    // front.receiveShadow = true;
    walls.add(back);
}

export function add_cuboid_walls(params) {
    add_wall_group();
    // const wall_geometry = new THREE.BoxGeometry( params.L*2 + params.thickness*2, params.thickness, params.L*2 + params.thickness*2 );
    // const wall_material = new THREE.ShadowMaterial( )

    add_left(params, walls);
    add_right(params, walls);
    add_floor(params, walls);
    add_roof(params, walls);
    add_front(params, walls);
    add_back(params, walls);

}

export function hide_left() {
    front.position.y = 1e10;
}

export function show_left() {
    front.position.y = params.L;
}

export function add_dam_break_walls(params) {
    add_wall_group();
    // const wall_geometry = new THREE.BoxGeometry( params.L*2 + params.thickness*2, params.thickness, params.L*2 + params.thickness*2 );
    // const wall_material = new THREE.ShadowMaterial( )

    add_left(params, walls);
    add_right(params, walls);
    add_floor(params, walls);
    add_roof(params, walls);
    add_front(params, walls);
    add_back(params, walls);

    roof.position.z = params.H + params.thickness / 2.;
    floor.position.z = -params.H - params.thickness / 2.;
    left.position.y = -params.L;
    right.position.y = params.L;
    front.position.x = params.L;
    back.position.x = -params.L;

    var horiz_walls = [floor, roof];
    var vert_walls = [left, right, front, back];

    vert_walls.forEach(function (mesh) {
        mesh.scale.x = 2 * params.L + 2 * params.thickness;
        mesh.scale.z = 2 * (params.H) + 2 * params.thickness;
    });

    horiz_walls.forEach(function (mesh) {
        mesh.scale.x = 2 * params.L;//+ 2*params.thickness;
        mesh.scale.z = 2 * params.L;//+ 2*params.thickness;
    });

    walls.position.y = params.H; // needed when the floor is not moving


}

export function add_2d_box(params) {
    add_wall_group();
    
    const material = new THREE.LineBasicMaterial( { color: 0xffffff } );
    const points = [];
    points.push( new THREE.Vector3( -params.L, 0, 0 ) );
    points.push( new THREE.Vector3(  params.L, 0, 0 ) );
    points.push( new THREE.Vector3(  params.L, 2*params.L, 0 ) );
    points.push( new THREE.Vector3( -params.L, 2*params.L, 0 ) );
    points.push( new THREE.Vector3( -params.L, 0, 0 ) );

    const geometry = new THREE.BufferGeometry().setFromPoints( points );
    const line = new THREE.Line( geometry, material );
    walls.add(line);

}

export function add_2d_circle(params) {
    add_wall_group();
    
    const circle_geometry = new THREE.RingGeometry( params.L, params.L+params.thickness, 100, 1 );
    let circle = new THREE.Mesh( circle_geometry, wall_material );
    circle.rotation.x = Math.PI;
    circle.position.y = params.L;
    walls.add( circle );   
}

export function add_sphere(params){
    add_wall_group();

    const sphere_geometry = new THREE.SphereGeometry( params.L, 128, 64 ); 
    // let sphere_material = new THREE.MeshStandardMaterial( {color: 0x333333, side: THREE.DoubleSide} );
    let sphere = new THREE.Mesh( sphere_geometry, wall_material );
    sphere.receiveShadow = true;
    sphere.position.y = params.L;
    wall_material.wireframe = false;
    walls.add( sphere );
}

export function add_2d_ellipse(params) {
    add_wall_group();
    
    const circle_geometry = new THREE.RingGeometry( params.L, params.L+params.thickness, 100, 1 );
    let circle = new THREE.Mesh( circle_geometry, wall_material );
    circle.rotation.x = Math.PI;
    circle.position.y = params.L;
    circle.scale.x = params.ellipse_ratio;
    walls.add( circle );
    
}

export function update_d4(params) {
    if (params !== undefined ) {
        if (params.d4 !== undefined ) {
            lut.setMin( params.d4.min );
            lut.setMax( params.d4.max );
            wall_material.color = lut.getColor(params.d4.cur);
        }
    }
    else {
        wall_material.color = new THREE.Color(0xffffff);
    }
}

export function add_scale(params) {
    var XYaxeslength = 2 * params.L - params.thickness / 2.; // length of axes vectors

    var fontsize = 0.1 * params.L; // font size
    var thickness = 0.02 * params.L; // line thickness

    if (axesHelper !== undefined) {
        walls.remove(axesHelper);
    } //else {}
    // if you haven't already made the axes

    axesHelper = new THREE.Group();
    walls.add(axesHelper);

    let arrow_body = new THREE.CylinderGeometry(
        thickness,
        thickness,
        XYaxeslength - 2 * thickness,
        Math.pow(2, params.quality),
        Math.pow(2, params.quality)
    );
    let arrow_head = new THREE.CylinderGeometry(
        0,
        2 * thickness,
        4 * thickness,
        Math.pow(2, params.quality),
        Math.pow(2, params.quality)
    );

    arrow_x = new THREE.Mesh(arrow_body, arrow_material);
    arrow_y = new THREE.Mesh(arrow_body, arrow_material);

    var arrow_head_x = new THREE.Mesh(arrow_head, arrow_material);
    var arrow_head_y = new THREE.Mesh(arrow_head, arrow_material);


    arrow_head_x.position.y = XYaxeslength / 2.;
    arrow_head_y.position.y = XYaxeslength / 2.;


    arrow_x.add(arrow_head_x);
    arrow_y.add(arrow_head_y);

    var textGeo_x = new TextGeometry(String((params.L * 1e3).toFixed(2)) + " mm", {
        font: font,
        size: fontsize,
        height: fontsize / 5,
    });
    var textMaterial_x = new THREE.MeshLambertMaterial({ color: 0xff0000 });
    var mesh_x = new THREE.Mesh(textGeo_x, arrow_material);
    mesh_x.position.y = XYaxeslength / 2. - 6 * fontsize;
    mesh_x.position.x = 2 * fontsize;
    // mesh_x.position.z = fontsize / 4;
    mesh_x.rotation.z = Math.PI / 2;
    // mesh_x.rotation.y = Math.PI;
    // mesh_x.position.y = XYaxeslength/2.;
    arrow_x.add(mesh_x);

    var textGeo_y = new TextGeometry(String((params.L * 1e3).toFixed(2)) + " mm", {
        font: font,
        size: fontsize,
        height: fontsize / 5,
    });
    var textMaterial_y = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
    var mesh_y = new THREE.Mesh(textGeo_y, arrow_material);
    // mesh_y.position.x = -0.15 * params.L;
    // mesh_y.position.y = XYaxeslength;// - fontsize*6;
    // mesh_y.position.z = fontsize / 4;
    // mesh_y.rotation.z = -Math.PI / 2;
    mesh_y.position.y = XYaxeslength / 2.;// - 6*fontsize;
    mesh_y.position.x = -2 * fontsize;
    mesh_y.rotation.z = -Math.PI / 2;
    arrow_y.add(mesh_y);

    arrow_x.position.x = XYaxeslength / 2 - 2 * thickness;
    arrow_x.rotation.z = -Math.PI / 2;

    arrow_y.position.y = XYaxeslength / 2 - 2 * thickness;
    axesHelper.add(arrow_x);
    axesHelper.add(arrow_y);
    // now the z axis
    var Zaxislength = params.L + params.L_cur - params.thickness / 2.
    var fontsize = 0.1 * params.L; // font size
    var thickness = 0.02 * params.L; // line thickness

    var arrow_body_z = new THREE.CylinderGeometry(
        thickness,
        thickness,
        Zaxislength - 4 * thickness,
        Math.pow(2, params.quality),
        Math.pow(2, params.quality)
    );
    arrow_z = new THREE.Mesh(arrow_body_z, arrow_material);
    var arrow_head_z = new THREE.Mesh(arrow_head, arrow_material);
    arrow_head_z.position.y = Zaxislength / 2;
    arrow_z.add(arrow_head_z);

    var textGeo_z = new TextGeometry(String((params.L_cur * 1e3).toFixed(2)) + " mm", {
        font: font,
        size: fontsize,
        height: fontsize / 5,
    });
    var textMaterial_z = new THREE.MeshLambertMaterial({ color: 0x0000ff });
    var mesh_z = new THREE.Mesh(textGeo_z, arrow_material);
    mesh_z.position.x = - 1.5 * fontsize;
    // mesh_z.position.y = fontsize / 4;
    mesh_z.position.y = Zaxislength / 2. - 6 * fontsize;// + 1.5 * fontsize;
    // mesh_z.rotation.z = -Math.PI / 2;
    mesh_z.rotation.z = Math.PI / 2;
    arrow_z.add(mesh_z);

    // arrow_z.scale.x = Zaxislength/XYaxeslength;
    arrow_z.position.z = Zaxislength / 2 - 2 * thickness;
    arrow_z.rotation.x = Math.PI / 2;


    axesHelper.add(arrow_z);

    axesHelper.position.set(params.L, params.L, -params.L); // move to bottom left hand corner
    axesHelper.rotation.z = Math.PI;
    // axesLabels.position.set(-params.L, params.L, -params.L); // move to bottom left hand corner
    // axesLabels.rotation.z = -Math.PI/2;
}

export async function update_walls(params, S, dt = 0.001) {
    params.packing_fraction = (params.N * params.particle_volume) / Math.pow(params.L_cur - params.W_cur, params.dimension - 1) / (params.L_cur - params.H_cur) / Math.pow(2, params.dimension);
    // console.log(params.packing_fraction) // NOTE: STILL A BIT BUGGY!!!!

    if (params.loading_method == 'strain_controlled') {
        if (params.constant_volume) {
            params.L_cur = params.L * (1 - params.volumetric_strain);
            params.H_cur = params.L * params.axial_strain;
            params.W_cur = -(-Math.sqrt(params.L * params.L * params.L * (params.L - params.H_cur)) - params.H_cur * params.L + params.L * params.L) / (params.H_cur - params.L);
            // console.log(params.L_cur, params.H_cur, params.W_cur);

        }
        else {
            params.L_cur = params.L * (1 - params.volumetric_strain);
            params.H_cur = params.L * params.axial_strain;
            params.W_cur = 0;
        }


    }
    else if (params.loading_method == 'stress_controlled') {
        let delta_p = p_controller.update(params.pressure_set_pt, pressure, dt);
        let delta_q = q_controller.update(params.deviatoric_set_pt, shear, dt)
        // console.log(pressure)
        params.L_cur -= delta_p;
        params.H_cur += delta_q;

    }
    params.front = params.L_cur - params.W_cur;
    params.back = -params.L_cur + params.W_cur;
    params.left = -params.L_cur + params.W_cur;
    params.right = params.L_cur - params.W_cur;
    params.floor = -params.L_cur + params.H_cur;
    params.roof = params.L_cur - params.H_cur;

    await S.simu_setBoundary(0, [params.back, params.front]); // Set location of the walls in x
    await S.simu_setBoundary(1, [params.left, params.right]); // Set location of the walls in y
    await S.simu_setBoundary(2, [params.floor, params.roof]); // Set location of the walls in z
    for (var j = 0; j < params.dimension - 3; j++) {
        await S.simu_setBoundary(j + 3, [-params.L_cur, params.L_cur]); // Set location of the walls in z
    }
    back.position.x = params.back - params.thickness / 2.;
    front.position.x = params.front + params.thickness / 2.;
    left.position.y = params.left - params.thickness / 2.;
    right.position.y = params.right + params.thickness / 2.;
    floor.position.z = params.floor - params.thickness / 2.;
    roof.position.z = params.roof + params.thickness / 2.;

    var horiz_walls = [floor, roof];
    var vert_walls = [left, right, front, back];

    vert_walls.forEach(function (mesh) {
        mesh.scale.x = 2 * params.L_cur + 2 * params.thickness;
        mesh.scale.z = 2 * (params.L_cur - params.H_cur) + 2 * params.thickness;
    });

    horiz_walls.forEach(function (mesh) {
        mesh.scale.x = 2 * params.L_cur + 2 * params.thickness;
        mesh.scale.z = 2 * params.L_cur + 2 * params.thickness;
    });

}

export async function update_triaxial_walls(params, S, dt = 1) {
    params.packing_fraction = (params.N * params.particle_volume) / Math.pow(params.L_cur - params.W_cur, params.dimension - 1) / (params.L_cur * params.aspect_ratio - params.H_cur) / Math.pow(2, params.dimension);
    // console.log(params.packing_fraction) // NOTE: STILL A BIT BUGGY!!!!

    if (params.consolidate_active) {
        let delta_p = p_controller.update(params.pressure_set_pt, params.current_pressure, dt);
        params.L_cur -= delta_p;

        // let delta_q = q_controller.update(0,params.current_shear,dt) // keep zero axial
        // params.H_cur += delta_q;
    }
    if (params.shear_active) {
        if (params.constant_volume) {
            params.H_cur += params.loading_rate * dt
            params.W_cur = params.L_cur - Math.sqrt(params.V_const / (params.L_cur - params.H_cur));
            // console.log(params.W_cur)
        } else {
            // constant pressure
            let delta_p = p_controller.update(params.pressure_set_pt, params.current_pressure, dt);
            params.W_cur -= delta_p;
            // strain controlled loading axially
            params.H_cur += params.loading_rate * dt
        }
    }

    // if ( params.consolidate_active || params.shear_active ) {
    params.front = params.L_cur - params.W_cur;
    params.back = -params.L_cur + params.W_cur;
    params.left = -params.L_cur + params.W_cur;
    params.right = params.L_cur - params.W_cur;
    params.floor = -params.L_cur * params.aspect_ratio + params.H_cur * params.aspect_ratio;
    params.roof = params.L_cur * params.aspect_ratio - params.H_cur * params.aspect_ratio;

    await S.simu_setBoundary(0, [params.back, params.front]); // Set location of the walls in x
    await S.simu_setBoundary(1, [params.left, params.right]); // Set location of the walls in y
    await S.simu_setBoundary(2, [params.floor, params.roof]); // Set location of the walls in z
    for (var j = 0; j < params.dimension - 3; j++) {
        await S.simu_setBoundary(j + 3, [-params.L_cur, params.L_cur]); // Set location of the walls in z
    }

    // and now tidy things up on the threejs side
    back.position.x = params.back - params.thickness / 2.;
    front.position.x = params.front + params.thickness / 2.;
    left.position.y = params.left - params.thickness / 2.;
    right.position.y = params.right + params.thickness / 2.;
    floor.position.z = params.floor - params.thickness / 2.;
    roof.position.z = params.roof + params.thickness / 2.;

    var horiz_walls = [floor, roof];
    var vert_walls = [left, right, front, back];

    vert_walls.forEach(function (mesh) {
        mesh.scale.x = 2 * params.L_cur + 2 * params.thickness;
        mesh.scale.z = 2 * (params.L_cur * params.aspect_ratio - params.H_cur) + 2 * params.thickness;
    });

    horiz_walls.forEach(function (mesh) {
        mesh.scale.x = 2 * params.L_cur + 2 * params.thickness;
        mesh.scale.z = 2 * params.L_cur + 2 * params.thickness;
    });
    // }

}

export async function update_top_wall(params, S, dt = 0.001) {
    params.packing_fraction = (params.N * params.particle_volume) / Math.pow(params.L, params.dimension - 1) / (params.L_cur) / Math.pow(2, params.dimension) * 2;
    // console.log(params.packing_fraction) // NOTE: STILL A BIT BUGGY!!!!

    // params.L_cur =  params.L*(1-2*params.vertical_displacement);
    params.L_cur = params.L - params.vertical_displacement;
    params.roof = params.L_cur;// - params.H_cur;
    params.floor = -params.L;

    await S.simu_setBoundary(0, [-params.L, params.L]); // Set location of the walls in x
    await S.simu_setBoundary(1, [-params.L, params.L]); // Set location of the walls in y
    await S.simu_setBoundary(2, [-params.L, params.roof]); // Set location of the walls in z
    roof.position.z = params.roof + params.thickness / 2.;
    floor.position.z = params.floor - params.thickness / 2.;

    var horiz_walls = [floor, roof];
    var vert_walls = [left, right, front, back];

    vert_walls.forEach(function (mesh) {
        mesh.scale.x = 2 * params.L + 2 * params.thickness;
        mesh.scale.z = 2 * (params.L) + 2 * params.thickness;
    });

    horiz_walls.forEach(function (mesh) {
        mesh.scale.x = 2 * params.L + 2 * params.thickness;
        mesh.scale.z = 2 * params.L + 2 * params.thickness;
    });

    if (axesHelper !== undefined) { add_scale(params); }

}

export async function update_damped_wall(params, S, dt) {
    vertical_wall_acceleration = (params.target_pressure - params.current_pressure - params.viscosity * vertical_wall_velocity) / params.wall_mass;

    vertical_wall_velocity += vertical_wall_acceleration * dt;
    vertical_wall_displacement += vertical_wall_velocity * dt;

    let L_cur = params.L - vertical_wall_displacement

    await S.simu_setBoundary(1, [-L_cur, L_cur]); // Set location of the walls in y

    console.log(L_cur, params.target_pressure, params.current_pressure);
}

export async function update_isotropic_wall(params, S, dt = 0.001) {
    //params.packing_fraction = (params.N*params.particle_volume)/Math.pow(params.L,params.dimension-1)/(params.L_cur)/Math.pow(2,params.dimension)*2;
    // console.log(params.packing_fraction) // NOTE: STILL A BIT BUGGY!!!!

    // params.L_cur =  params.L*(1-2*params.vertical_displacement);
    params.H_cur = (1 - params.epsilonv / 3.) * params.H;
    params.L_cur = (1 - params.epsilonv / 3.) * params.L;

    await S.simu_setBoundary(0, [-params.L_cur, params.L_cur]); // Set location of the walls in x
    await S.simu_setBoundary(1, [-params.L_cur, params.L_cur]); // Set location of the walls in y
    await S.simu_setBoundary(2, [0, 2 * params.H_cur]); // Set location of the walls in z

    roof.position.z = params.H_cur + params.thickness / 2.;
    floor.position.z = -params.H_cur - params.thickness / 2.;
    left.position.y = -params.L_cur;
    right.position.y = params.L_cur;
    front.position.x = params.L_cur;
    back.position.x = -params.L_cur;

    var horiz_walls = [floor, roof];
    var vert_walls = [left, right, front, back];

    vert_walls.forEach(function (mesh) {
        mesh.scale.x = 2 * params.L_cur + 2 * params.thickness;
        mesh.scale.z = 2 * (params.H_cur) + 2 * params.thickness;
    });

    horiz_walls.forEach(function (mesh) {
        mesh.scale.x = 2 * params.L_cur;//+ 2*params.thickness;
        mesh.scale.z = 2 * params.L_cur;//+ 2*params.thickness;
    });

    if (!params.hideaxes && axesHelper !== undefined) { add_scale_isotropic(params); }

    walls.position.y = params.H_cur; // needed when the floor is not moving

}

export function add_scale_isotropic(params) {
    var XYaxeslength = 2 * params.L_cur - params.thickness / 2.; // length of axes vectors

    var fontsize = 0.1 * params.L; // font size
    var thickness = 0.02 * params.L; // line thickness

    if (axesHelper !== undefined) {
        walls.remove(axesHelper);
    } //else {}
    // if you haven't already made the axes

    axesHelper = new THREE.Group();
    walls.add(axesHelper);

    let arrow_length = XYaxeslength - 2 * thickness;
    if (arrow_body === undefined) {
        arrow_body = new THREE.CylinderGeometry(
            thickness,
            thickness,
            1,
            Math.pow(2, params.quality),
            Math.pow(2, params.quality)
        );

        arrow_head = new THREE.CylinderGeometry(
            0,
            2 * thickness,
            4 * thickness,
            Math.pow(2, params.quality),
            Math.pow(2, params.quality)
        );
    }
    if (textGeo_x !== undefined) {
        textGeo_x.dispose();
        // textGeo_y.dispose();
        textGeo_z.dispose();
    }

    arrow_x = new THREE.Group();
    arrow_y = new THREE.Group();

    let arrow_body_x = new THREE.Mesh(arrow_body, arrow_material);
    let arrow_body_y = new THREE.Mesh(arrow_body, arrow_material);
    arrow_body_x.scale.y = arrow_length;
    arrow_body_y.scale.y = arrow_length;


    arrow_x.add(arrow_body_x);
    arrow_y.add(arrow_body_y);

    var arrow_head_x = new THREE.Mesh(arrow_head, arrow_material);
    var arrow_head_y = new THREE.Mesh(arrow_head, arrow_material);


    arrow_head_x.position.y = XYaxeslength / 2.;
    arrow_head_y.position.y = XYaxeslength / 2.;


    arrow_x.add(arrow_head_x);
    arrow_y.add(arrow_head_y);

    textGeo_x = new TextGeometry(String((2 * params.L_cur * 1e3).toFixed(2)) + " mm", {
        font: font,
        size: fontsize,
        height: fontsize / 5,
    });
    var mesh_x = new THREE.Mesh(textGeo_x, arrow_material);
    mesh_x.position.y = XYaxeslength / 2. - 6 * fontsize;
    mesh_x.position.x = 2 * fontsize;
    // mesh_x.position.z = fontsize / 4;
    mesh_x.rotation.z = Math.PI / 2;
    // mesh_x.rotation.y = Math.PI;
    // mesh_x.position.y = XYaxeslength/2.;
    arrow_x.add(mesh_x);

    // textGeo_y = new TextGeometry(String((2 * params.L_cur * 1e3).toFixed(2)) + " mm", {
    //     font: font,
    //     size: fontsize,
    //     height: fontsize / 5,
    // });
    var mesh_y = new THREE.Mesh(textGeo_x, arrow_material);
    mesh_y.position.y = XYaxeslength / 2.;// - 6*fontsize;
    mesh_y.position.x = -2 * fontsize;
    mesh_y.rotation.z = -Math.PI / 2;
    arrow_y.add(mesh_y);

    arrow_x.position.x = XYaxeslength / 2 - 2 * thickness;
    arrow_x.rotation.z = -Math.PI / 2;

    arrow_y.position.y = XYaxeslength / 2 - 2 * thickness;
    axesHelper.add(arrow_x);
    axesHelper.add(arrow_y);
    // now the z axis
    var Zaxislength = 2 * params.H_cur - params.thickness / 2.
    var fontsize = 0.1 * params.L; // font size
    var thickness = 0.02 * params.L; // line thickness

    // var arrow_body_z = new CylinderGeometry(
    //   thickness,
    //   thickness,
    //   Zaxislength - 4*thickness,
    //   Math.pow(2, params.quality),
    //   Math.pow(2, params.quality)
    // );
    let arrow_body_z = new THREE.Mesh(arrow_body, arrow_material);
    arrow_body_z.scale.y = Zaxislength - 4 * thickness;
    var arrow_head_z = new THREE.Mesh(arrow_head, arrow_material);
    arrow_head_z.position.y = Zaxislength / 2;

    arrow_z = new THREE.Group();
    arrow_z.add(arrow_body_z);
    arrow_z.add(arrow_head_z);

    textGeo_z = new TextGeometry(String((2 * params.H_cur * 1e3).toFixed(2)) + " mm", {
        font: font,
        size: fontsize,
        height: fontsize / 5,
    });
    //var textMaterial_z = new MeshLambertMaterial({ color: 0x0000ff });
    var mesh_z = new THREE.Mesh(textGeo_z, arrow_material);
    mesh_z.position.x = - 1.5 * fontsize;
    // mesh_z.position.y = fontsize / 4;
    mesh_z.position.y = Zaxislength / 2. - 6 * fontsize;// + 1.5 * fontsize;
    // mesh_z.rotation.z = -Math.PI / 2;
    mesh_z.rotation.z = Math.PI / 2;
    arrow_z.add(mesh_z);

    // arrow_z.scale.x = Zaxislength/XYaxeslength;
    arrow_z.position.z = Zaxislength / 2 - 2 * thickness;
    arrow_z.rotation.x = Math.PI / 2;


    axesHelper.add(arrow_z);

    axesHelper.position.set(params.L_cur, params.L_cur, -params.H_cur); // move to bottom left hand corner
    axesHelper.rotation.z = Math.PI;
    // axesLabels.position.set(-params.L, params.L, -params.L); // move to bottom left hand corner
    // axesLabels.rotation.z = -Math.PI/2;
}
