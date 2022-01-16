import "/style/reset.css";

import "/style/index.css";

import * as three from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import GUI from "lil-gui";

/* ------------------------------------------------------------------------------------------------------ */
/* Debug */
const gui = new GUI();

/* Renderer */
const renderer = new three.WebGLRenderer({ antialias: window.devicePixelRatio < 2 });

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.append(renderer.domElement);

/* Scene */
const scene = new three.Scene();

/* Camera */
const camera = new three.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.01,
    100,
);

camera.position.set(0, 5, - 5);

scene.add(camera);

/* Controls */
const controls = new OrbitControls(camera, renderer.domElement);

controls.enableDamping = true;

/* Resize */
window.addEventListener("resize", _ => {

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

});

/* Render */
renderer.setAnimationLoop(function loop() {

    controls.update();

    renderer.render(scene, camera);

});

/* ------------------------------------------------------------------------------------------------------ */
/* Tetrahedron */
const tetrahedron = new three.Mesh(
    new three.TetrahedronGeometry(1, 0),
    new three.MeshStandardMaterial(),
);

tetrahedron.castShadow = true;
tetrahedron.receiveShadow = true;

scene.add(tetrahedron);

/* Ground */
const ground = new three.Mesh(
    new three.PlaneGeometry(25, 25).rotateX(-Math.PI / 2),
    new three.MeshStandardMaterial({ color: 0x888888 }),
);

ground.position.set(0, -2, 0);
ground.receiveShadow = true;

scene.add(ground);

/* Ambient light */
const ambient_light = new three.AmbientLight(0xffffff, 0.1);

scene.add(ambient_light);

/* Spot light */
const light = new three.SpotLight(0xff00ff);

light.position.set(5, 5, 5);
light.target = tetrahedron;
light.angle = 0.2;              // 照射范围。
light.penumbra = 0.2;           // 半影衰减百分比。
light.decay = 1;                // 随着光照距离的衰减量。
light.distance = 15;            // 光照距离。
light.castShadow = true;        // 启用阴影投射。
light.shadow.mapSize.x = 1024;  // 阴影贴图的x。
light.shadow.mapSize.y = 1024;  // 阴影贴图的y。
light.shadow.camera.near = 0.1; // 阴影相机近端面界限。
light.shadow.camera.far = 20;   // 阴影相机远端面界限。

scene.add(light);

const helper_1 = new three.SpotLightHelper(light);

scene.add(helper_1);

gui.add(light.position, "x").min(- 10).max(10).step(0.1).name("X").onChange(updateLight);
gui.add(light.position, "y").min(- 10).max(10).step(0.1).name("Y").onChange(updateLight);
gui.add(light.position, "z").min(- 10).max(10).step(0.1).name("Z").onChange(updateLight);
gui.add(light, "angle").min(0).max(Math.PI / 2).step(Math.PI / 100).name("Angle").onChange(updateLight);
gui.add(light, "penumbra").min(0).max(1).step(0.1).name("Penumbra").onChange(updateLight);
gui.add(light, "decay").min(0).max(10).step(0.1).name("Decay").onChange(updateLight);
gui.add(light, "distance").min(0).max(40).step(0.1).name("Distance").onChange(updateLight);

function updateLight() {

    helper_1.update();

}
