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
const ambient_light = new three.AmbientLight(0xffffff, 0.5);
scene.add(ambient_light);

// Point light
const point_light_1 = new three.PointLight(0xffffff, 0.5);
point_light_1.position.set(0, 5, 5);

const point_light_2 = new three.PointLight(0xffffff, 0.5);
point_light_2.position.set(5.8, -5, 5);

const point_light_3 = new three.PointLight(0xffffff, 0.5);
point_light_3.position.set(-5.8, -5, 5);

scene.add(point_light_1, point_light_2, point_light_3);


/**
 * Texture
 */
const texture_loader = new three.TextureLoader();

const rock_texture_ao = texture_loader.load("/textures/rock/1k/aerial_rocks_04_ao_1k.jpg");
const rock_texture_diff = texture_loader.load("/textures/rock/1k/aerial_rocks_04_diff_1k.jpg");
const rock_texture_disp = texture_loader.load("/textures/rock/1k/aerial_rocks_04_disp_1k.jpg");
const rock_texture_nor_gl = texture_loader.load("/textures/rock/1k/aerial_rocks_04_nor_gl_1k.jpg");
const rock_texture_rough = texture_loader.load("/textures/rock/1k/aerial_rocks_04_rough_1k.jpg");

const wood_texture_ao = texture_loader.load("/textures/wood/2k/wood_table_001_diff_2k.jpg");
const wood_texture_diff = texture_loader.load("/textures/wood/2k/wood_table_001_diff_2k.jpg");
const wood_texture_nor_gl = texture_loader.load("/textures/wood/2k/wood_table_001_nor_gl_2k.jpg");
const wood_texture_rough = texture_loader.load("/textures/wood/2k/wood_table_001_rough_2k.jpg");

const metal_texture_ao = texture_loader.load("/textures/metal/1k/metal_plate_ao_1k.jpg");
metal_texture_ao.wrapS = three.RepeatWrapping;
metal_texture_ao.wrapT = three.RepeatWrapping;
metal_texture_ao.repeat.set(3, 3);
const metal_texture_diff = texture_loader.load("/textures/metal/1k/metal_plate_diff_1k.jpg");
metal_texture_diff.wrapS = three.RepeatWrapping;
metal_texture_diff.wrapT = three.RepeatWrapping;
metal_texture_diff.repeat.set(3, 3);
const metal_texture_disp = texture_loader.load("/textures/metal/1k/metal_plate_disp_1k.jpg");
metal_texture_disp.wrapS = three.RepeatWrapping;
metal_texture_disp.wrapT = three.RepeatWrapping;
metal_texture_disp.repeat.set(3, 3);
const metal_texture_nor_gl = texture_loader.load("/textures/metal/1k/metal_plate_nor_gl_1k.jpg");
metal_texture_nor_gl.wrapS = three.RepeatWrapping;
metal_texture_nor_gl.wrapT = three.RepeatWrapping;
metal_texture_nor_gl.repeat.set(3, 3);
const metal_texture_metal = texture_loader.load("/textures/metal/1k/metal_plate_metal_1k.jpg");
metal_texture_metal.wrapS = three.RepeatWrapping;
metal_texture_metal.wrapT = three.RepeatWrapping;
metal_texture_metal.repeat.set(3, 3);
const metal_texture_rough = texture_loader.load("/textures/metal/1k/metal_plate_rough_1k.jpg");
metal_texture_rough.wrapS = three.RepeatWrapping;
metal_texture_rough.wrapT = three.RepeatWrapping;
metal_texture_rough.repeat.set(3, 3);

const fabric_texture_ao = texture_loader.load("/textures/fabric/1k/fabric_pattern_07_ao_1k.jpg");
fabric_texture_ao.wrapS = three.RepeatWrapping;
fabric_texture_ao.wrapT = three.RepeatWrapping;
fabric_texture_ao.repeat.set(3, 3);
const fabric_texture_col = texture_loader.load("/textures/fabric/1k/fabric_pattern_07_col_1_1k.jpg");
fabric_texture_col.wrapS = three.RepeatWrapping;
fabric_texture_col.wrapT = three.RepeatWrapping;
fabric_texture_col.repeat.set(3, 3);
const fabric_texture_nor_gl = texture_loader.load("/textures/fabric/1k/fabric_pattern_07_nor_gl_1k.jpg");
fabric_texture_nor_gl.wrapS = three.RepeatWrapping;
fabric_texture_nor_gl.wrapT = three.RepeatWrapping;
fabric_texture_nor_gl.repeat.set(3, 3);
const fabric_texture_rough = texture_loader.load("/textures/fabric/1k/fabric_pattern_07_rough_1k.jpg");
fabric_texture_rough.wrapS = three.RepeatWrapping;
fabric_texture_rough.wrapT = three.RepeatWrapping;
fabric_texture_rough.repeat.set(3, 3);


/**
 * Object
 */
// Material
const marble_material = new three.MeshStandardMaterial();
marble_material.map = rock_texture_diff;
marble_material.aoMap = rock_texture_ao;
marble_material.displacementMap = rock_texture_disp;
marble_material.normalMap = rock_texture_nor_gl;
marble_material.roughnessMap = rock_texture_rough;

const wood_material = new three.MeshStandardMaterial();
wood_material.map = wood_texture_diff;
wood_material.aoMap = wood_texture_ao;
wood_material.normalMap = wood_texture_nor_gl;
wood_material.roughnessMap = wood_texture_rough;

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
    marble_material,
);
marble_sphere.position.set(0.65, 0.65, 0);
marble_sphere.scale.set(0.5, 0.5, 0.5);
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
