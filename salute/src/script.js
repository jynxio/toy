import "./reset.css";

import "./style.css";

import * as three from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import * as dat from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector(".webgl");

// Scene
const scene = new three.Scene();

// Camera
const camera = new three.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 5;
scene.add(camera);

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

// Renderer
const renderer = new three.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Render
const clock = new three.Clock();

render();

function render() {

    window.requestAnimationFrame(render);

    const elapsed_time = clock.getElapsedTime();

    controls.update();

    renderer.render(scene, camera);

}

/**
 * Test
 */
const cube = new three.Mesh(
    new three.BoxGeometry(),
    new three.MeshBasicMaterial(),
);
scene.add(cube);
