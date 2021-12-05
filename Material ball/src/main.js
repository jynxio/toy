import "./reset.css";

import "./main.css";

import * as three from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";


/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas");

// Scene
const scene = new three.Scene();

// Camera
const camera = new three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 2;
scene.add(camera);

// Renderer
const renderer = new three.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Resize
window.addEventListener("resize", _ => {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

});


/**
 * Render
 */
const clock = new three.Clock();

render();

function render() {

    window.requestAnimationFrame(render);

    controls.update();

    renderer.render(scene, camera);

}


/**
 * Light
 */
// Ambient light
const ambient_light = new three.AmbientLight(0xffffff, 1);
scene.add(ambient_light);

// Point light
const point_light = new three.PointLight(0xfffffff, 0.5);
point_light.position.z = 10;
scene.add(point_light);


/**
 * Texture
 */
const texture_loader = new three.TextureLoader();

const rock_texture_ao = texture_loader.load("/textures/rock/1k/aerial_rocks_04_ao_1k.jpg");
makeRepeat(rock_texture_ao, 2, 2);
const rock_texture_diff = texture_loader.load("/textures/rock/1k/aerial_rocks_04_diff_1k.jpg");
makeRepeat(rock_texture_diff, 2, 2);
const rock_texture_disp = texture_loader.load("/textures/rock/1k/aerial_rocks_04_disp_1k.jpg");
makeRepeat(rock_texture_disp, 2, 2);
const rock_texture_nor_gl = texture_loader.load("/textures/rock/1k/aerial_rocks_04_nor_gl_1k.jpg");
makeRepeat(rock_texture_nor_gl, 2, 2);
const rock_texture_rough = texture_loader.load("/textures/rock/1k/aerial_rocks_04_rough_1k.jpg");
makeRepeat(rock_texture_rough, 2, 2);

const wood_texture_ao = texture_loader.load("/textures/wood/2k/wood_table_001_diff_2k.jpg");
makeRepeat(wood_texture_ao, 2, 2);
const wood_texture_diff = texture_loader.load("/textures/wood/2k/wood_table_001_diff_2k.jpg");
makeRepeat(wood_texture_diff, 2, 2);
const wood_texture_nor_gl = texture_loader.load("/textures/wood/2k/wood_table_001_nor_gl_2k.jpg");
makeRepeat(wood_texture_nor_gl, 2, 2);
const wood_texture_rough = texture_loader.load("/textures/wood/2k/wood_table_001_rough_2k.jpg");
makeRepeat(wood_texture_rough, 2, 2);
const wood_texture_arm = texture_loader.load("/textures/wood/2k/wood_table_001_arm_2k.jpg");
makeRepeat(wood_texture_arm, 2, 2);
const wood_texture_disp = texture_loader.load("/textures/wood/2k/wood_table_001_disp_2k.jpg");
makeRepeat(wood_texture_disp, 2, 2);

const metal_texture_ao = texture_loader.load("/textures/metal/1k/metal_plate_ao_1k.jpg");
makeRepeat(metal_texture_ao, 3, 3);
const metal_texture_diff = texture_loader.load("/textures/metal/1k/metal_plate_diff_1k.jpg");
makeRepeat(metal_texture_diff, 3, 3);
const metal_texture_disp = texture_loader.load("/textures/metal/1k/metal_plate_disp_1k.jpg");
makeRepeat(metal_texture_disp, 3, 3);
const metal_texture_nor_gl = texture_loader.load("/textures/metal/1k/metal_plate_nor_gl_1k.jpg");
makeRepeat(metal_texture_nor_gl, 3, 3);
const metal_texture_metal = texture_loader.load("/textures/metal/1k/metal_plate_metal_1k.jpg");
makeRepeat(metal_texture_metal, 3, 3);
const metal_texture_rough = texture_loader.load("/textures/metal/1k/metal_plate_rough_1k.jpg");
makeRepeat(metal_texture_rough, 3, 3);

const fabric_texture_ao = texture_loader.load("/textures/fabric/1k/fabric_pattern_07_ao_1k.jpg");
makeRepeat(fabric_texture_ao, 3, 3);
const fabric_texture_col = texture_loader.load("/textures/fabric/1k/fabric_pattern_07_col_1_1k.jpg");
makeRepeat(fabric_texture_col, 3, 3);
const fabric_texture_nor_gl = texture_loader.load("/textures/fabric/1k/fabric_pattern_07_nor_gl_1k.jpg");
makeRepeat(fabric_texture_nor_gl, 3, 3);
const fabric_texture_rough = texture_loader.load("/textures/fabric/1k/fabric_pattern_07_rough_1k.jpg");
makeRepeat(fabric_texture_rough, 3, 3);

function makeRepeat(texture, s, t) {

    texture.wrapS = three.RepeatWrapping;
    texture.wrapT = three.RepeatWrapping;
    texture.repeat.set(s, t);

}


/**
 * Object
 */
// Material
const rock_material = new three.MeshStandardMaterial();
rock_material.map = rock_texture_diff;
rock_material.aoMap = rock_texture_ao;
rock_material.displacementMap = rock_texture_disp;
rock_material.displacementScale = 0.1;
rock_material.normalMap = rock_texture_nor_gl;
rock_material.roughnessMap = rock_texture_rough;

const wood_material = new three.MeshStandardMaterial();
wood_material.map = wood_texture_diff;
wood_material.aoMap = wood_texture_ao;
wood_material.normalMap = wood_texture_nor_gl;
wood_material.roughnessMap = wood_texture_rough;
wood_material.displacementMap = wood_texture_disp;
wood_material.displacementScale = 0.01;
wood_material.emissiveMap = wood_texture_arm;
wood_material.emissive = new three.Color(0xffffff);
wood_material.emissiveIntensity = 0.1;

const metal_material = new three.MeshStandardMaterial();
metal_material.map = metal_texture_diff;
metal_material.aoMap = metal_texture_ao;
metal_material.displacementMap = metal_texture_disp;
metal_material.displacementScale = 0.025;
metal_material.normalMap = metal_texture_nor_gl;
metal_material.roughnessMap = metal_texture_rough;
metal_material.metalnessMap = metal_texture_metal;

const fabric_material = new three.MeshStandardMaterial();
fabric_material.map = fabric_texture_col;
fabric_material.aoMap = fabric_texture_ao;
fabric_material.normalMap = fabric_texture_nor_gl;
fabric_material.roughnessMap = fabric_texture_rough;

// Geometry
const sphere_geometry = new three.SphereGeometry(0.5, 512, 512);
sphere_geometry.setAttribute("uv2", new three.BufferAttribute(sphere_geometry.attributes.uv.array, 2));

// Sphere
const marble_sphere = new three.Mesh(
    sphere_geometry,
    rock_material,
);
marble_sphere.position.set(0.65, 0.65, 0);
scene.add(marble_sphere);

const wood_sphere = new three.Mesh(
    sphere_geometry,
    wood_material
);
wood_sphere.position.set(0.65, -0.65, 0);
scene.add(wood_sphere);

const metal_sphere = new three.Mesh(
    sphere_geometry,
    metal_material
);
metal_sphere.position.set(-0.65, -0.65, 0);
scene.add(metal_sphere);

const fabric_sphere = new three.Mesh(
    sphere_geometry,
    fabric_material
);
fabric_sphere.position.set(-0.65, 0.65, 0);
scene.add(fabric_sphere);
