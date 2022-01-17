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
const spot_light_1 = new SpotLight();
const spot_light_2 = new SpotLight();
const spot_light_3 = new SpotLight();

spot_light_1.position.set(0, 5, - 5);
spot_light_1.target = tetrahedron;
spot_light_1.color = new three.Color(0xff00ff);

spot_light_2.position.set(- 5 / 2 * Math.sqrt(3), 5, 5 / 2);
spot_light_2.target = tetrahedron;
spot_light_2.color = new three.Color(0x00ffff);

spot_light_3.position.set(5 / 2 * Math.sqrt(3), 5, 5 / 2);
spot_light_3.target = tetrahedron;
spot_light_3.color = new three.Color(0xffff00);

scene.add(spot_light_1, spot_light_2, spot_light_3);

function SpotLight() {

    const light = new three.SpotLight();

    light.angle = 0.2;              // 照射范围。
    // light.penumbra = 0.2;           // 半影衰减百分比。
    // light.decay = 1;                // 随着光照距离的衰减量。
    light.distance = 15;            // 光照距离。
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
scene.add(camera_helper_1, camera_helper_2, camera_helper_3);

// gui.add(light.position, "x").min(- 10).max(10).step(0.1).name("X").onChange(updateLight);
// gui.add(light.position, "y").min(- 10).max(10).step(0.1).name("Y").onChange(updateLight);
// gui.add(light.position, "z").min(- 10).max(10).step(0.1).name("Z").onChange(updateLight);
// gui.add(light, "angle").min(0).max(Math.PI / 2).step(Math.PI / 100).name("Angle").onChange(updateLight);
// gui.add(light, "penumbra").min(0).max(1).step(0.1).name("Penumbra").onChange(updateLight);
// gui.add(light, "decay").min(0).max(10).step(0.1).name("Decay").onChange(updateLight);
// gui.add(light, "distance").min(0).max(40).step(0.1).name("Distance").onChange(updateLight);

// TODO 阴影BUG

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
