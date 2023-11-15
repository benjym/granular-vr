export let radii;
let NDParticleShader;
let v, omegaMag;
export let ray;
export let total_particle_volume;
export let x;
let F_mag_max;

import { Lut } from "../libs/Lut.js";
// import { r, R } from "./controllers.js"
import * as AUDIO from './audio.js';

// import { Lut } from './js/Lut.js'
var lut = new Lut("blackbody", 512); // options are rainbow, cooltowarm and blackbody

export let spheres;

export function reset_spheres() {
    // if ( forces !== undefined ) {
    //     for (var i = 0; i < forces.children.length; i++) {
    //         forces.children[i].geometry.dispose();
    //         forces.children[i].material.dispose();
    //     }
    // }
    // forces = new THREE.Group();
    // forces.remove_me = true;
    forces.count = 0;

    spheres = new THREE.Group();
    spheres.remove_me = true;
}

const cylinder_geometry = new THREE.CylinderGeometry(1, 1, 1, 8);
cylinder_geometry.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI / 2)); // rotate the geometry to make the forces point in the right direction
const cylinder_material = new THREE.MeshStandardMaterial({ color: 0xffffff });
cylinder_material.emissive = new THREE.Color(0x0000ff);
cylinder_material.transparent = false;
const cylinder = new THREE.Mesh(cylinder_geometry, cylinder_material);

let max_forces = 1000 // will get an error if over 1000 forces
let forces = new THREE.InstancedMesh( cylinder_geometry, cylinder_material, max_forces );

reset_spheres();

// ray = new THREE.Line(
//     new THREE.BufferGeometry().setFromPoints([
//         new THREE.Vector3(0, -3, 0),
//         new THREE.Vector3(0, 0, 0),
//     ]),
//     new THREE.LineBasicMaterial({ color: 0xffffff })
// );

export async function createNDParticleShader(params) {
    await import("./" + params.dimension + "DShader.js").then((module) => {
        NDParticleShader = module.NDDEMShader;
    });
}

export async function update_radii(S) {
    radii = await S.simu_getRadii();
}

export async function add_spheres(S, params, scene) {
    radii = await S.simu_getRadii();
    total_particle_volume = 0;
    for (let i = 0; i < radii.length; i++) {
        total_particle_volume += 4. / 3. * Math.PI * Math.pow(radii[i], 3);
    }
    console.log('Actual particle volume: ' + total_particle_volume);

    scene.add(spheres);
    // const material = new THREE.MeshStandardMaterial();


    // const matrix = new THREE.Matrix4();
    const color = new THREE.Color();
    let geometrySphere;
    if (params.dimension < 3) {
        geometrySphere = new THREE.CircleGeometry(0.5, Math.pow(2, params.quality));
        geometrySphere.applyMatrix4(new THREE.Matrix4().makeRotationZ(Math.PI / 2)); //
        geometrySphere.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI)); // rotate the geometry to make the forces point in the right direction
        // geometrySphere = new CylinderGeometry( 0.5, Math.pow(2,params.quality) );
        // geometrySphere = new SphereGeometry( 0.5, Math.pow(2,params.quality), Math.pow(2,params.quality) );
    }
    else {
        geometrySphere = new THREE.SphereGeometry(0.5, Math.pow(2, params.quality), Math.pow(2, params.quality));
    }

    for (let i = 0; i < params.N; i++) {
        const material = NDParticleShader.clone();
        var object = new THREE.Mesh(geometrySphere, material);
        object.position.set(0, 0, 0);
        object.rotation.z = Math.PI / 2;
        object.NDDEM_ID = i;
        object.visible = false;
        spheres.add(object);
        // spheres.setMatrixAt( i, matrix );
        // spheres.setColorAt( i, color.setHex( 0xffffff * Math.random() ) );

    }

    var lut_folder;
    update_particle_material(params, lut_folder)
}

export async function add_pool_spheres(S, params, scene) {
    radii = await S.simu_getRadii();

    spheres = new THREE.Group();
    spheres.remove_me = true;
    scene.add(spheres);

    const geometrySphere = new THREE.SphereGeometry(0.5, Math.pow(2, params.quality), Math.pow(2, params.quality));

    for (let i = 0; i < params.N; i++) {
        if (i == 0 || i == params.N - 1) { // white ball and cue stick
            var material = new THREE.MeshStandardMaterial({
                color: 0xffffff
            });
        }
        else if (i === 11) {
            var material = new THREE.MeshStandardMaterial({
                color: 0x060606
            });
        }
        else {
            var material = NDParticleShader.clone();
            material.uniforms.R.value = params.radius;
            material.uniforms.banding.value = 2 + 2 * (i % 2);
            // material.uniforms.opacity.value = 1;
        }
        var object = new THREE.Mesh(geometrySphere, material);
        object.position.set(0, 0, 0);
        object.rotation.z = Math.PI / 2;
        object.NDDEM_ID = i;
        object.castShadow = true;
        object.receiveShadow = true;
        // if (params.audio) { AUDIO.add_normal_sound(object); }
        spheres.add(object);
    }

    // display white ball
    // spheres.children[0].material.uniforms.banding.value = 1.;
    // spheres.children[0].material.uniforms.ambient.value = 5.;

    // display black ball
    // spheres.children[11].material.uniforms.banding.value = 0.;
    // spheres.children[11].material.uniforms.ambient.value = 1.;

    if (!params.vr) {
        // spheres.children[0].add(ray); // add line
    }

    // add_spheres_to_torus(params,controller1,controller2);
}

export async function update_fixed_sounds(S, params) {
    if (params.audio) {
        let contact_info = await S.simu_getContactInfos(0x80 | 0x20000); // FT_vis
        // let contact_info = await S.simu_getContactInfos(0x80 | 0x8000);
        let total_dissipation = 0;
        // if (params.lut === 'None') {
        for (let i = 0; i < params.N; i++) {
            if (spheres.children[i] !== undefined) {
                if (spheres.children[i].material.type === 'ShaderMaterial') {
                    if (spheres.children[i].material.uniforms.ambient.value !== 1) {
                        spheres.children[i].material.uniforms.ambient.value = 1;
                    }
                } else {
                    if (spheres.children[i].material.emissiveIntensity !== 0) {
                        spheres.children[i].material.emissiveIntensity = 0;
                        spheres.children[i].material.needsUpdate = true;
                    }
                }
            }
        }
        // console.log(contact_info.length)
        for (let i = 0; i < contact_info.length; i++) {
            let row = contact_info[i];
            let object_ids = [row[0], row[1]];

            let dissipation;
            if (params.dimension === 2) {
                dissipation = Math.sqrt(row[2] * row[2] + row[3] * row[3]);
            } else if (params.dimension === 3) {
                dissipation = Math.sqrt(row[2] * row[2] + row[3] * row[3] + row[4] * row[4]);
            } else if (params.dimension === 4) {
                dissipation = Math.sqrt(row[2] * row[2] + row[3] * row[3] + row[4] * row[4] + row[5] * row[5]);
            }
            // dissipation *= params.particle_volume*0.;

            // console.log(params.particle_volume)
            // dissipation = Math.log10(dissipation)/5e3;
            // dissipation = isFinite(dissipation) ? dissipation : 0.0; // remove non-finite values
            // let cutoff = 2e-2;
            if (isFinite(dissipation)) {
                dissipation *= 1e-5;
                if (dissipation > 1. / params.audio_sensitivity) {
                    if (params.lut === 'None') {
                        spheres.children[row[0]].material.uniforms.ambient.value += dissipation * params.audio_sensitivity; // make them glow
                    }
                    else {
                        spheres.children[row[0]].material.emissiveIntensity += dissipation * params.audio_sensitivity; // make them glow
                    }
                    total_dissipation += dissipation;
                }
            }


        }
        // console.log(total_dissipation/params.N/1e5);

        AUDIO.fixed_sound_source.children[0].gain.gain.value = total_dissipation / params.N;
    }
    else {
        if (AUDIO.fixed_sound_source.children[0].gain.gain.value !== 0) {
            AUDIO.fixed_sound_source.children[0].gain.gain.value = 0;
            if (params.lut === 'None') {
                for (let i = 0; i < params.N; i++) {
                    spheres.children[i].material.uniforms.ambient.value = 1.0;
                }
            } else {
                for (let i = 0; i < params.N; i++) {
                    spheres.children[i].material.emissiveIntensity = 0;
                    spheres.children[i].material.needsUpdate = true;
                }
            }
        }
    }
}

export function add_shadows() {
    for (let i = 0; i < spheres.children.length; i++) {
        var object = spheres.children[i]
        object.castShadow = true;
        // console.log(object)
        // object.receiveShadow = true;
    }
}

export function add_spheres_to_torus(params, target) {
    const pointsGeometry = new THREE.SphereGeometry(
        1,
        Math.max(Math.pow(2, params.quality - 2), 4),
        Math.max(Math.pow(2, params.quality - 2), 4)
    );

    var scale = 20; // size of particles on tori
    let group = new THREE.Group();

    for (let i = 0; i < params.N; i++) {
        let color;
        if (i == 0) { color = 0xaaaaaa; }
        else if (i === 11) { color = 0x060606 }
        else if (i % 3) { color = 0x00ff00 }
        else { color = 0xff0000 }
        var pointsMaterial = new PointsMaterial({ color: color });
        var object = new THREE.Mesh(pointsGeometry, pointsMaterial);

        object.scale.set(R / scale, R / scale, R / scale);

        group.add(object);
    }
    target.add(group);
}

export function move_spheres_on_torus(params, target) {
    // console.log(target.children[0]);
    let real_target = target.children[0];
    if (params.dimension === 4) {
        for (let i = 0; i < params.N; i++) {
            var object = real_target.children[i];
            var phi = (2 * Math.PI * (params.d4.cur - x[i][3])) / (params.d4.max - params.d4.min) - Math.PI / 2;
            var x_obj = (R + r) * Math.cos(phi);
            var y_obj = (R + r) * Math.sin(phi);
            var z_obj = 0;
            object.position.set(x_obj, y_obj, z_obj);
        }
    }
    else if (params.dimension > 4) {
        console.log('trying both torus axes')
        for (let i = 0; i < params.N; i++) {
            var object = real_target.children[i];
            var phi = (2 * Math.PI * (params.d4.cur - x[i][3])) / (params.d4.max - params.d4.min) - Math.PI / 2;
            var theta = (2 * Math.PI * (params.d5.cur - x[i][4])) / (params.d5.max - params.d5.min);
            var x_obj = (R + r * Math.cos(theta)) * Math.cos(phi);
            var y_obj = (R + r * Math.cos(theta)) * Math.sin(phi);
            var z_obj = r * Math.sin(theta);
            object.position.set(x_obj, y_obj, z_obj);
        }
    }
}

export function update_particle_material(params, lut_folder) {
    if (params.particle_opacity === undefined) { params.particle_opacity = 1; }
    if (params.lut === 'None') {
        for (let i = 0; i < params.N; i++) {
            var object = spheres.children[i];
            object.material = NDParticleShader.clone();
            if ( params.dimension == 2 ) { object.material.side = THREE.DoubleSide }
            // console.log(NDParticleShader)
            if (params.particle_opacity < 1) { object.material.transparent = true; }
            // object.material.opacity = params.particle_opacity;
            object.material.uniforms.opacity.value = params.particle_opacity;
            // console.log(object.material);
        }
    }
    else {
        for (let i = 0; i < params.N; i++) {
            var object = spheres.children[i];
            object.material = new THREE.MeshStandardMaterial({ side: THREE.DoubleSide });
            object.material.transparent = true;
            object.material.opacity = params.particle_opacity;
        }
    }
    if (params.lut === 'Velocity') {
        lut.setMin(0);
        lut.setMax(params.vmax);
        // var min_el = lut_folder.add()
    } else if (params.lut === 'Fluct Velocity') {
        lut.setMin(0);
        lut.setMax(params.vmax / 2.);
    } else if (params.lut === 'Size') {
        lut = new Lut("grainsize", 512);
        lut.setMin(params.r_min);
        lut.setMax(params.r_max);
        for (let i = 0; i < params.N; i++) {
            var object = spheres.children[i];
            object.material.color = lut.getColor(radii[i]);
        }
    } else if (params.lut === 'White') {
        // do nothing, they're already white
    } else if (params.lut === "Rotation Rate") {
        lut.setMin(0);
        lut.setMax(params.omegamax);
    } else if (params.view_mode === "D4") {
        lut.setMin(params.d4.cur - 2 * r);
        lut.setMax(params.d4.cur + 2 * r);
        // object.material.color = lut.getColor(x3_unrotated);
        // TORUS.wristband1.children[i].material.color = lut.getColor(
        // x3_unrotated
        // );
    } else if (params.view_mode === "D5") {
        lut.setMin(params.d5.cur - 2 * r);
        lut.setMax(params.d5.cur + 2 * r);
        // object.material.color = lut.getColor(x[i][4]);
        // TORUS.wristband1.children[i].material.color = lut.getColor(
        // x[i][4]
        // );
    }

    // if ( params.show_colorbar ) {
    //     let canvas = document.getElementById("canvas");
    //     let colorbar = document.createElement("canvas");
    //     canvas.appendChild(colorbar);
    //     colorbar.setAttribute("id", "colorbar");
    //     let colorbarCanvas = lut.createCanvas();
    //
    //     console.log(canvas)
    //     colorbar.width = canvas.offsetWidth;
    //     colorbar.height = 50;
    //
    //     //grab the context from your destination canvas
    //     var ctx = colorbar.getContext('2d');
    //
    //
    //     ctx.translate(ctx.width/2., ctx.height/2.);
    //
    //     // rotate around that point, converting our
    //     // angle from degrees to radians
    //     ctx.rotate(Math.PI/2.);
    //     ctx.translate(-ctx.width/2.,-ctx.height/2.);
    //
    //     // draw it up and to the left by half the width
    //     // and height of the image
    //     // ctx.drawImage(colorbarCanvas, -(colorbarCanvas.width/2), -(colorbarCanvas.height/2));
    //     ctx.drawImage(colorbarCanvas, 0, 0, ctx.width, ctx.height);
    // }
}

export async function move_spheres(S, params, controller1, controller2) {
    x = await S.simu_getX();
    // console.log(x.length)
    // console.log(spheres.children.length)
    if (x.length === spheres.children.length) {

        let orientation = await S.simu_getOrientation();
        if (params.lut === 'Velocity' || params.lut === 'Fluct Velocity') {
            v = await S.simu_getVelocity();
        }
        else if (params.lut === 'Rotation Rate') {
            omegaMag = await S.simu_getRotationRate();
        }
        else if (params.lut === 'Particle Stress') {
            // forceMag = S.simu_getParticleStress(); // NOTE: NOT IMPLEMENTED YET
            console.warn('PARTICLE STRESSES NOT IMPLEMENTED YET')
        }
        let R_draw;
        for (let i = 0; i < params.N; i++) {
            let object = spheres.children[i];
            if (object !== undefined) {
                if (params.dimension <= 3) {
                    R_draw = radii[i];
                }
                else if (params.dimension == 4) {
                    R_draw = Math.sqrt(
                        Math.pow(radii[i], 2) - Math.pow(params.d4.cur - x[i][3], 2)
                    );
                } else if (params.dimension == 5) {
                    R_draw = Math.sqrt(
                        Math.pow(radii[i], 2) -
                        Math.pow(params.d4.cur - x[i][3], 2) -
                        Math.pow(params.d5.cur - x[i][4], 2)
                    );
                } else if (params.dimension == 6) {
                    R_draw = Math.sqrt(
                        Math.pow(radii[i], 2) -
                        Math.pow(params.d4.cur - x[i][3], 2) -
                        Math.pow(params.d5.cur - x[i][4], 2) -
                        Math.pow(params.d6.cur - x[i][5], 2)
                    );
                } else if (params.dimension == 7) {
                    R_draw = Math.sqrt(
                        Math.pow(radii[i], 2) -
                        Math.pow(params.d4.cur - x[i][3], 2) -
                        Math.pow(params.d5.cur - x[i][4], 2) -
                        Math.pow(params.d6.cur - x[i][5], 2) -
                        Math.pow(params.d7.cur - x[i][6], 2)
                    );
                } else if (params.dimension == 8) {
                    R_draw = Math.sqrt(
                        Math.pow(radii[i], 2) -
                        Math.pow(params.d4.cur - x[i][3], 2) -
                        Math.pow(params.d5.cur - x[i][4], 2) -
                        Math.pow(params.d6.cur - x[i][5], 2) -
                        Math.pow(params.d7.cur - x[i][6], 2) -
                        Math.pow(params.d8.cur - x[i][7], 2)
                    );
                } else if (params.dimension == 10) {
                    R_draw = Math.sqrt(
                        Math.pow(radii[i], 2) -
                        Math.pow(params.d4.cur - x[i][3], 2) -
                        Math.pow(params.d5.cur - x[i][4], 2) -
                        Math.pow(params.d6.cur - x[i][5], 2) -
                        Math.pow(params.d7.cur - x[i][6], 2) -
                        Math.pow(params.d8.cur - x[i][7], 2) -
                        Math.pow(params.d9.cur - x[i][8], 2) -
                        Math.pow(params.d10.cur - x[i][9], 2)
                    );
                } else if (params.dimension == 30) {
                    R_draw = Math.sqrt(
                        Math.pow(radii[i], 2) -
                        Math.pow(params.d4.cur - x[i][3], 2) -
                        Math.pow(params.d5.cur - x[i][4], 2) -
                        Math.pow(params.d6.cur - x[i][5], 2) -
                        Math.pow(params.d7.cur - x[i][6], 2) -
                        Math.pow(params.d8.cur - x[i][7], 2) -
                        Math.pow(params.d9.cur - x[i][8], 2) -
                        Math.pow(params.d10.cur - x[i][9], 2) -
                        Math.pow(params.d11.cur - x[i][10], 2) -
                        Math.pow(params.d12.cur - x[i][11], 2) -
                        Math.pow(params.d13.cur - x[i][12], 2) -
                        Math.pow(params.d14.cur - x[i][13], 2) -
                        Math.pow(params.d15.cur - x[i][14], 2) -
                        Math.pow(params.d16.cur - x[i][15], 2) -
                        Math.pow(params.d17.cur - x[i][16], 2) -
                        Math.pow(params.d18.cur - x[i][17], 2) -
                        Math.pow(params.d19.cur - x[i][18], 2) -
                        Math.pow(params.d20.cur - x[i][19], 2) -
                        Math.pow(params.d21.cur - x[i][20], 2) -
                        Math.pow(params.d22.cur - x[i][21], 2) -
                        Math.pow(params.d23.cur - x[i][22], 2) -
                        Math.pow(params.d24.cur - x[i][23], 2) -
                        Math.pow(params.d25.cur - x[i][24], 2) -
                        Math.pow(params.d26.cur - x[i][25], 2) -
                        Math.pow(params.d27.cur - x[i][26], 2) -
                        Math.pow(params.d28.cur - x[i][27], 2) -
                        Math.pow(params.d29.cur - x[i][28], 2) -
                        Math.pow(params.d30.cur - x[i][29], 2)
                    );
                }
                if (isNaN(R_draw)) {
                    object.visible = false;
                } else {
                    object.visible = true;
                    object.scale.setScalar(2 * R_draw);
                    // spheres.setMatrixAt( i, matrix );
                    if (params.dimension > 2) { object.position.set(x[i][0], x[i][2], x[i][1]); }
                    else if (params.dimension === 2) { object.position.set(x[i][1], x[i][0], 0); }
                    else { object.position.set(x[i][0], 0, 0); }
                }
                if (object.material.type === 'ShaderMaterial') { // found a custom shader material
                    for (var j = 0; j < params.dimension - 3; j++) {
                        object.material.uniforms.xview.value[j] =
                            params.d4.cur;
                        object.material.uniforms.xpart.value[j] =
                            x[i][j + 3];
                    }
                    object.material.uniforms.A.value = orientation[i];
                } else if (params.lut === 'Velocity') {
                    // update brightness of textured particle
                    // object.material.uniforms.ambient.value = 0.5 + 1e-3*( Math.pow(v[i][0],2) + Math.pow(v[i][1],2) + Math.pow(v[i][2],2) );
                    // use LUT to set an actual colour
                    let vel_mag = Math.sqrt(Math.pow(v[i][0], 2) + Math.pow(v[i][1], 2) + Math.pow(v[i][2], 2));
                    object.material.color = lut.getColor(vel_mag);
                } else if (params.lut === 'Fluct Velocity') {
                    let vel_mag = Math.sqrt(Math.pow(v[i][0], 2) + Math.pow(v[i][1] - params.shear_rate * x[i][0], 2) + Math.pow(v[i][2], 2));
                    object.material.color = lut.getColor(vel_mag);
                } else if (params.lut === 'Rotation Rate') {
                    // console.log(omegaMag[i])
                    // object.material.uniforms.ambient.value = 0.5 + 0.1*omegaMag[i];
                    object.material.color = lut.getColor(omegaMag[i]);
                }
            }
            // if (params.dimension > 3) {
            //
            // }
        }

    }
    // spheres.instanceMatrix.needsUpdate = true;
    // console.log(orientation[0])
}

export function setCollisionTimeAndRestitutionCoefficient(tc, eps, mass) {
    // stolen from MercuryDPM
    // ONLY USE THIS FOR LINEAR SPRINGS
    // Sets k, disp such that it matches a given tc and eps for a collision of two copies of equal mass m.
    //
    // Parameters
    // [in]	tc	collision time
    // [in]	eps	restitution coefficient
    // [in]	mass	harmonic average particle mass, \(\frac{2}{1/m1+1/m2}\)
    let stiffness, dissipation
    if (eps === 0.0) {
        stiffness = 0.5 * mass * Math.pow(Math.PI / tc, 2);
        dissipation = Math.sqrt(2.0 * mass * stiffness);
    } else {
        dissipation = -mass / tc * Math.log(eps);
        stiffness = 0.5 * mass * (Math.pow(Math.PI / tc, 2) + Math.pow(dissipation / mass, 2));
    }
    return { 'dissipation': dissipation, 'stiffness': stiffness }
}

export function getHertzCriticalTimestep(bulk_modulus, poisson_coefficient, radius, density) {
    // stolen from Burns et at 2019
    let beta = 0.8766 + 0.163 * poisson_coefficient;
    let critical_timestep = Math.PI * radius / beta * Math.sqrt(density / bulk_modulus);

    return critical_timestep
}

export async function randomise_particles(params, S) {
    if (S !== undefined) {
        for (let i = 0; i < params.N; i++) {
            await simu_fixParticle(i, [
                -params.L + Math.random() * 2 * params.L,
                -params.L + Math.random() * 2 * params.L,
                -params.L + Math.random() * 2 * params.L]);
        }
    }
}

export async function randomise_particles_isotropic(params, S) {
    if (S !== undefined) {
        for (let i = 0; i < params.N; i++) {
            S.simu_fixParticle(i, [
                -params.L + params.r_max + Math.random() * 2 * (params.L - params.r_max),
                -params.L + params.r_max + Math.random() * 2 * (params.L - params.r_max),
                params.r_max + Math.random() * 2 * (params.H - params.r_max)]);
        }
    }
}

export async function haptic_pulse(S, params, controller, NDDEM_index) {
    
    if ('F_mag_max' in params) {
        F_mag_max = params.F_mag_max;
    } else {
        F_mag_max = 1e0;
    }
    
    if (controller.gamepad.hapticActuators !== undefined) {
        if ( controller.gamepad.hapticActuators.length > 0) {

            var F = await S.simu_getContactInfos(0x80 | 0x100);
            for (let i = 0; i < F.length; i++) {
                if (F[i][0] === NDDEM_index || F[i][1] || NDDEM_index) {
                    let F_mag;
                    if (params.dimension === 2) {
                        F_mag = Math.sqrt(
                            Math.pow(F[i][2], 2) +
                            Math.pow(F[i][3], 2)
                        )
                    }
                    else if (params.dimension === 3) {
                        F_mag = Math.sqrt(
                            Math.pow(F[i][2], 2) +
                            Math.pow(F[i][3], 2) +
                            Math.pow(F[i][4], 2)
                        )
                    }
                    else if (params.dimension === 4) {
                        F_mag = Math.sqrt(
                            Math.pow(F[i][2], 2) +
                            Math.pow(F[i][3], 2) +
                            Math.pow(F[i][4], 2) +
                            Math.pow(F[i][5], 2)
                        )
                    }
                    controller.gamepad.hapticActuators[0].pulse(F_mag / F_mag_max, 100);
                }
            }
        }
    }
}

export async function draw_force_network(S, params, scene) {
    forces.instanceMatrix.needsUpdate = true;
    if ( forces.children.length === 0) { 
        scene.add(forces);
    }
    // console.log(S)
    if (S !== undefined) {
        if (params.particle_opacity === 1) {
            forces.count = 0;
            // for ( let i=0; i<forces.children.length; i++){
            //     forces.children[i].visible = false;
            // }
        }
        else {

            var F = await S.simu_getContactInfos(0x80 | 0x100);
            
            let width = params.r_min;
            if ('F_mag_max' in params) {
                F_mag_max = params.F_mag_max;
            } else {
                F_mag_max = 1e0;
            }

            // step 1: work out how many to draw
            const c = new THREE.Object3D();
            let n = 0;
            for (let i = 0; i < F.length; i++) {
                // forces.children[i].visible = false;
                // for ( let i = 0; i < 100; i ++ ) {
                let F_mag;
                if (params.dimension === 2) {
                    F_mag = Math.sqrt(
                        Math.pow(F[i][2], 2) +
                        Math.pow(F[i][3], 2)
                    )
                }
                else if (params.dimension === 3) {
                    F_mag = Math.sqrt(
                        Math.pow(F[i][2], 2) +
                        Math.pow(F[i][3], 2) +
                        Math.pow(F[i][4], 2)
                    )
                }
                else if (params.dimension === 4) {
                    F_mag = Math.sqrt(
                        Math.pow(F[i][2], 2) +
                        Math.pow(F[i][3], 2) +
                        Math.pow(F[i][4], 2) +
                        Math.pow(F[i][5], 2)
                    )
                }

                if (F_mag > 0 && spheres.children[F[i][0]] !== undefined) {
                    let a = spheres.children[F[i][0]].position;
                    let b = spheres.children[F[i][1]].position;
                    let distance = a.distanceTo(b);

                    if (spheres.children[F[i][0]].visible && spheres.children[F[i][1]].visible) {
                        if (distance < (radii[F[i][0]] + radii[F[i][1]])) { // ignore periodic boundaries
                            let mid_point = new THREE.Vector3();
                            mid_point.addVectors(a, b);
                            mid_point.divideScalar(2);

                            c.position.copy(mid_point);
                            
                            let scale = width; // nothing bigger than this
                            if (F_mag < F_mag_max) { scale = width * F_mag / F_mag_max; }
                            c.scale.set(scale,scale,distance);
                            c.lookAt(a);

                            c.updateMatrix();
                            forces.setMatrixAt( n, c.matrix );
                            n += 1;
        
                        }
                    }
                    
                }
            }

            if ( n > max_forces ) { n = max_forces }// only draw first max_forces forces         
            forces.count = n;
        }
    }
}


export async function draw_force_network_DEP(S, params, scene) {
    if ( forces.children.length === 0) { 
        scene.add(forces);
    }
    // console.log(S)
    if (S !== undefined) {
        if (params.particle_opacity === 1) {
            for ( let i=0; i<forces.children.length; i++){
                forces.children[i].visible = false;
            }
        }
        else {

            var F = await S.simu_getContactInfos(0x80 | 0x100);
            
            let width = params.r_min;
            if ('F_mag_max' in params) {
                F_mag_max = params.F_mag_max;
            } else {
                F_mag_max = 1e0;
            }

            for (let i = 0; i < F.length; i++) {
                if (forces.children[i] === undefined) {
                    let c = cylinder.clone();
                    forces.add(c);
                }
                forces.children[i].visible = false;
                // for ( let i = 0; i < 100; i ++ ) {
                let F_mag;
                if (params.dimension === 2) {
                    F_mag = Math.sqrt(
                        Math.pow(F[i][2], 2) +
                        Math.pow(F[i][3], 2)
                    )
                }
                else if (params.dimension === 3) {
                    F_mag = Math.sqrt(
                        Math.pow(F[i][2], 2) +
                        Math.pow(F[i][3], 2) +
                        Math.pow(F[i][4], 2)
                    )
                }
                else if (params.dimension === 4) {
                    F_mag = Math.sqrt(
                        Math.pow(F[i][2], 2) +
                        Math.pow(F[i][3], 2) +
                        Math.pow(F[i][4], 2) +
                        Math.pow(F[i][5], 2)
                    )
                }

                if (F_mag > 0 && spheres.children[F[i][0]] !== undefined) {
                    // let c = cylinder.clone();
                    let c = forces.children[i];
                    let a = spheres.children[F[i][0]].position;
                    let b = spheres.children[F[i][1]].position;
                    let distance = a.distanceTo(b);

                    if (spheres.children[F[i][0]].visible && spheres.children[F[i][1]].visible) {
                        if (distance < (radii[F[i][0]] + radii[F[i][1]])) { // ignore periodic boundaries
                            let mid_point = new THREE.Vector3();
                            mid_point.addVectors(a, b);
                            mid_point.divideScalar(2);
                            c.position.copy(mid_point);
                            let scale = width; // nothing bigger than this
                            if (F_mag < F_mag_max) { scale = width * F_mag / F_mag_max; }
                            if ( scale > 0. ) { 
                                c.scale.set(scale,
                                    scale,
                                    distance);
                                c.lookAt(a);
                                // if (params.audio) { AUDIO.add_normal_sound(c); }

                                // c.material.emissiveIntensity = F_mag/F_mag_max;
                                c.visible = true;
                                // forces.add(c);
                                // console.log(scale)
                            }
                        }
                    }
                }
            }
            // hide anything else
            for ( let i=F.length; i<forces.children.length; i++){
                forces.children[i].visible = false;
            }
        }
    }

}
