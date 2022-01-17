import "/style/reset.css";

import "/style/index.css";

import * as three from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import GUI from "lil-gui";

/* ------------------------------------------------------------------------------------------------------ */
/* Renderer */
const renderer = new three.WebGLRenderer({ antialias: window.devicePixelRatio < 2 });

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = three.PCFSoftShadowMap;

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
const spot_light_1 = new SpotLight(0xff00ff, tetrahedron);
const spot_light_2 = new SpotLight(0x00ffff, tetrahedron);
const spot_light_3 = new SpotLight(0xffff00, tetrahedron);

scene.add(spot_light_1, spot_light_2, spot_light_3);

function SpotLight(color, target) {

    const light = new three.SpotLight(color);

    light.target = target;
    // light.angle = 0.2;              // 照射范围。
    // light.penumbra = 0.2;           // 半影衰减百分比。
    // light.decay = 1;                // 随着光照距离的衰减量。
    // light.distance = 20;            // 光照距离。
    light.castShadow = true;        // 启用阴影投射。
    light.shadow.mapSize.x = 1024;  // 阴影贴图的x。
    light.shadow.mapSize.y = 1024;  // 阴影贴图的y。
    light.shadow.camera.near = 0.1; // 阴影相机近端面界限。
    light.shadow.camera.far = 20;   // 阴影相机远端面界限。

    return light;

}

/* Spot light helper */
const light_helper_1 = new three.SpotLightHelper(spot_light_1);
const light_helper_2 = new three.SpotLightHelper(spot_light_2);
const light_helper_3 = new three.SpotLightHelper(spot_light_3);

const camera_helper_1 = new three.CameraHelper(spot_light_1.shadow.camera);
const camera_helper_2 = new three.CameraHelper(spot_light_2.shadow.camera);
const camera_helper_3 = new three.CameraHelper(spot_light_3.shadow.camera);

scene.add(light_helper_1, light_helper_2, light_helper_3);
// scene.add(camera_helper_1, camera_helper_2, camera_helper_3);

/* Debug spot light */
const gui = new GUI();

const debug_options = {
    height: 1,
    radius: 1,
    angle: 0.2,
    penumbra: 0.2,
    decay: 1,
    distance: 10,
};

updateHeight(debug_options.height);
updateRadius(debug_options.radius);
updateAngle(debug_options.angle);
updatePenumbra(debug_options.penumbra);
updateDecay(debug_options.decay);
updateDistance(debug_options.distance);

gui.add(debug_options, "height").min(0).max(20).step(0.01).name("Height").onChange(updateHeight);
gui.add(debug_options, "radius").min(0).max(20).step(0.01).name("Radius").onChange(updateRadius);
gui.add(debug_options, "angle").min(0).max(Math.PI / 2).step(Math.PI / 200).name("Angle").onChange(updateAngle);
gui.add(debug_options, "penumbra").min(0).max(1).step(0.01).name("Penumbra").onChange(updatePenumbra);
gui.add(debug_options, "decay").min(0).max(10).step(0.01).name("Decay").onChange(updateDecay);
gui.add(debug_options, "distance").min(0).max(50).step(0.01).name("Distance").onChange(updateDistance);

function updateHeight() {

    const h = debug_options.height;

    spot_light_1.position.y = h;
    spot_light_2.position.y = h;
    spot_light_3.position.y = h;

    updateLight();

}

function updateRadius() {

    const r = debug_options.radius;

    spot_light_1.position.x = 0;
    spot_light_1.position.z = r;

    spot_light_2.position.x = 2 * r / Math.sqrt(3);
    spot_light_2.position.z = - r;

    spot_light_3.position.x = - 2 * r / Math.sqrt(3);
    spot_light_3.position.z = - r;

    updateLight();

}

function updateAngle() {

    const a = debug_options.angle;

    spot_light_1.angle = a;
    spot_light_2.angle = a;
    spot_light_3.angle = a;

    updateLight();

}

function updatePenumbra() {

    const p = debug_options.penumbra;

    spot_light_1.penumbra = p;
    spot_light_2.penumbra = p;
    spot_light_3.penumbra = p;

    updateLight();

}

function updateDecay() {

    const d = debug_options.decay;

    spot_light_1.decay = d;
    spot_light_2.decay = d;
    spot_light_3.decay = d;

    updateLight();

}

function updateDistance() {

    const d = debug_options.distance;

    spot_light_1.distance = d;
    spot_light_2.distance = d;
    spot_light_3.distance = d;

    updateLight();

}

function updateLight() {

    light_helper_1.update();
    light_helper_2.update();
    light_helper_3.update();

    spot_light_1.shadow.camera.updateProjectionMatrix();
    spot_light_2.shadow.camera.updateProjectionMatrix();
    spot_light_3.shadow.camera.updateProjectionMatrix();

    camera_helper_1.update();
    camera_helper_2.update();
    camera_helper_3.update();

}

/* ------------------------------------------------------------------------------------------------------ */
/* Render */
const clock = new three.Clock();

let previous_time = 0;
let elapsed_time = 0;
let delta_time = 0;

renderer.setAnimationLoop(function loop() {

    /* Rotate tetrahedron */
    elapsed_time = clock.getElapsedTime();
    delta_time = elapsed_time - previous_time;
    previous_time = elapsed_time;

    tetrahedron.rotateY(delta_time * 1);
    tetrahedron.rotateZ(delta_time * 1);

    /* Update Light's helper */
    updateLight();

    /* Update Controls */
    controls.update();

    /* Render */
    renderer.render(scene, camera);

});
