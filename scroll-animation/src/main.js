import "./reset.css";

import "./main.css";

import * as three from "three";

import gsap from "gsap";

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas");

// Scene
const scene = new three.Scene();

// Camera
const camera = new three.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 6;
scene.add(camera);

// Renderer
const renderer = new three.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Resize
window.addEventListener("resize", _ => {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

});

/**
 * Object
 */
// Texture
const loader = new three.TextureLoader();
const texture = loader.load("textures/gradients/5.jpg");
texture.minFilter = three.NearestFilter;
texture.magFilter = three.NearestFilter;

// Material
const material = new three.MeshToonMaterial({ gradientMap: texture });

// Spacing
const spacing = 5;

// Torus
const torus = new three.Mesh(
    new three.TorusGeometry(1, 0.4, 64, 128),
    material
);
torus.position.x = 2;
scene.add(torus);

// Cone
const cone = new three.Mesh(
    new three.ConeGeometry(1, 2, 128),
    material
);
cone.position.x = 2;
cone.position.y = - spacing;
scene.add(cone);

// Torusknot
const torusknot = new three.Mesh(
    new three.TorusKnotGeometry(0.8, 0.35, 256, 64),
    material
);
torusknot.position.x = 2;
torusknot.position.y = - spacing * 2;
scene.add(torusknot);

/**
 * Light
 */
const light = new three.DirectionalLight();
light.position.set(1, 1, 0);
scene.add(light);

/**
 * Scroll
 */


/**
 * Render
 */
const clock = new three.Clock();

render();

function render() {

    window.requestAnimationFrame(render);

    const elapsed_time = clock.getElapsedTime();

    torus.rotation.x = elapsed_time * 0.15;
    torus.rotation.y = elapsed_time * 0.15;
    cone.rotation.x = elapsed_time * 0.15;
    cone.rotation.y = elapsed_time * 0.15;

    renderer.render(scene, camera);

}
