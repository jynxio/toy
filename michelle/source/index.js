import "/style/reset.css";

import "/style/index.css";

import * as three from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/* ------------------------------------------------------------------------------------------------------ */
/* Renderer */
const renderer = new three.WebGLRenderer({ antialias: window.devicePixelRatio < 2 });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = three.sRGBEncoding;
renderer.toneMapping = three.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = three.PCFSoftShadowMap;

document.body.append(renderer.domElement);

/* Scene */
const scene = new three.Scene();

/* Camera */
const camera_options = {
    fov: 50,
    aspect: window.innerWidth / window.innerHeight,
    near: 0.01,
    far: 100,
};

const camera = new three.PerspectiveCamera(
    camera_options.fov,
    camera_options.aspect,
    camera_options.near,
    camera_options.far,
);

scene.add(camera);

/* Controls */
const controls = new OrbitControls(camera, renderer.domElement);

controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.target = new three.Vector3(0, 0, 0.01);

/* Resize */
window.addEventListener("resize", _ => {

    renderer.setSize(window.innerWidth, window.innerHeight);

    camera_options.aspect = window.innerWidth / window.innerHeight;
    camera.aspect = camera_options.aspect;
    camera.updateProjectionMatrix();

});

/* ------------------------------------------------------------------------------------------------------ */
/* Light */
const light = new three.DirectionalLight(0xff00ff, 4);

light.position.set(- 1.56, - 0.58, 10);
light.castShadow = true;
light.shadow.mapSize.x = 1024;
light.shadow.mapSize.y = 1024;
light.shadow.camera.top = 5;
light.shadow.camera.bottom = - 5;
light.shadow.camera.right = 5;
light.shadow.camera.left = - 5;
light.shadow.camera.far = 20;
light.shadow.camera.near = 1;

scene.add(light);

/* ------------------------------------------------------------------------------------------------------ */
/* Render */
renderer.setAnimationLoop(function loop() {

    controls.update();

    renderer.render(scene, camera);

});
