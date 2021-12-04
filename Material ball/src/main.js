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
const point_light = new three.PointLight(0xffffff, 1);
point_light.position.set(0, 0, 5);
scene.add(point_light);


/**
 * Texture
 */
const texture_loader = new three.TextureLoader();
const rock_texture_ao = texture_loader.load("/textures/rock/1k/aerial_rocks_04_ao_1k.jpg");
const rock_texture_diff = texture_loader.load("/textures/rock/1k/aerial_rocks_04_diff_1k.jpg");
const rock_texture_disp = texture_loader.load("/textures/rock/1k/aerial_rocks_04_disp_1k.jpg");
const rock_texture_nor = texture_loader.load("/textures/rock/1k/aerial_rocks_04_nor_gl_1k.jpg");
const rock_texture_rough = texture_loader.load("/textures/rock/1k/aerial_rocks_04_rough_1k.jpg");


/**
 * Object
 */
// Material
const marble_material = new three.MeshStandardMaterial();
marble_material.map = rock_texture_diff;
marble_material.aoMap = rock_texture_ao;
marble_material.displacementMap = rock_texture_disp;
marble_material.displacementScale = 0.3;
marble_material.normalMap = rock_texture_nor;
marble_material.roughnessMap = rock_texture_rough;

// Geometry
const sphere_geometry = new three.SphereGeometry(0.5, 512, 512);
sphere_geometry.setAttribute("uv2", new three.BufferAttribute(sphere_geometry.attributes.uv.array, 2));

// Marble sphere
const marble_sphere = new three.Mesh(
    sphere_geometry,
    marble_material,
);
scene.add(marble_sphere);
