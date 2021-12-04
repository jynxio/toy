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
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Renderer
const renderer = new three.WebGLRenderer({ canvas });
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
 * Object
 */
const cube = new three.Mesh(
    new three.BoxGeometry(),
    new three.MeshNormalMaterial(),
);

scene.add(cube);
