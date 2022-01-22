import "/style/reset.css";

import "/style/index.css";

import * as three from "three";

import { Lensflare, LensflareElement } from "three/examples/jsm/objects/Lensflare";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import SpotLightShell from "./SpotLightShell";

import GUI from "lil-gui";

/* ------------------------------------------------------------------------------------------------------ */
/* GUI */
const gui = new GUI();

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
/* Fog */
scene.fog = new three.FogExp2(0x262837, 0.08);
scene.background = new three.Color(0x262837);

gui.add(scene.fog, "density").min(0).max(1).min(0.00001).name("Fog");

/* Lensflare：如果使用Lensflare类，则可以实现更多层级的耀斑。 */
const texture_loader = new three.TextureLoader();
const texture_lensflare = texture_loader.load("./static/image/lensflare.png")

const lensflare_material_0xff00ff = new three.SpriteMaterial({ map: texture_lensflare, sizeAttenuation: false, color: new three.Color(0xff00ff) });
const lensflare_material_0x00ffff = new three.SpriteMaterial({ map: texture_lensflare, sizeAttenuation: false, color: new three.Color(0x00ffff) });
const lensflare_material_0xffff00 = new three.SpriteMaterial({ map: texture_lensflare, sizeAttenuation: false, color: new three.Color(0xffff00) });

lensflare_material_0xff00ff.depthTest = false;
lensflare_material_0x00ffff.depthTest = false;
lensflare_material_0xffff00.depthTest = false;
lensflare_material_0xff00ff.depthWrite = false;
lensflare_material_0x00ffff.depthWrite = false;
lensflare_material_0xffff00.depthWrite = false;

const lensflare_0xff00ff = new three.Sprite(lensflare_material_0xff00ff);
const lensflare_0x00ffff = new three.Sprite(lensflare_material_0x00ffff);
const lensflare_0xffff00 = new three.Sprite(lensflare_material_0xffff00);

lensflare_0xff00ff.scale.set(0.2, 0.2, 0.2);
lensflare_0x00ffff.scale.set(0.2, 0.2, 0.2);
lensflare_0xffff00.scale.set(0.2, 0.2, 0.2);

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
    new three.CircleGeometry(50, 254).rotateX(-Math.PI / 2),
    new three.MeshStandardMaterial({ color: 0x262837 }),
);

ground.position.set(0, -2, 0);
ground.receiveShadow = true;

scene.add(ground);

/* Ambient light */
const ambient_light = new three.AmbientLight(0xffffff, 0.05);

scene.add(ambient_light);

/* Spot light */
const spot_light_0xff00ff = new SpotLight(0xff00ff, tetrahedron);
const spot_light_0x00ffff = new SpotLight(0x00ffff, tetrahedron);
const spot_light_0xffff00 = new SpotLight(0xffff00, tetrahedron);

spot_light_0xff00ff.add(lensflare_0xff00ff);
spot_light_0x00ffff.add(lensflare_0x00ffff);
spot_light_0xffff00.add(lensflare_0xffff00);

scene.add(spot_light_0xff00ff, spot_light_0x00ffff, spot_light_0xffff00);

function SpotLight(color, target) {

    const light = new three.SpotLight(color);

    light.target = target;
    light.angle = 0.3;              // 照射范围。
    light.penumbra = 1;             // 半影衰减百分比。
    light.decay = 0;                // 随着光照距离的衰减量。
    light.distance = 20;            // 光照距离。
    light.castShadow = true;        // 启用阴影投射。
    light.shadow.mapSize.x = 1024;  // 阴影贴图的x。
    light.shadow.mapSize.y = 1024;  // 阴影贴图的y。
    light.shadow.camera.near = 0.1; // 阴影相机近端面界限。
    light.shadow.camera.far = 20;   // 阴影相机远端面界限。

    return light;

}

/* Spot light shell */
const light_shell_1 = new SpotLightShell(spot_light_0xff00ff, 1);
const light_shell_2 = new SpotLightShell(spot_light_0x00ffff, 1);
const light_shell_3 = new SpotLightShell(spot_light_0xffff00, 1);

scene.add(light_shell_1, light_shell_2, light_shell_3);

/* Spot light helper */
const light_helper_1 = new three.SpotLightHelper(spot_light_0xff00ff);
const light_helper_2 = new three.SpotLightHelper(spot_light_0x00ffff);
const light_helper_3 = new three.SpotLightHelper(spot_light_0xffff00);

const camera_helper_1 = new three.CameraHelper(spot_light_0xff00ff.shadow.camera);
const camera_helper_2 = new three.CameraHelper(spot_light_0x00ffff.shadow.camera);
const camera_helper_3 = new three.CameraHelper(spot_light_0xffff00.shadow.camera);

// scene.add(light_helper_1, light_helper_2, light_helper_3);
// scene.add(camera_helper_1, camera_helper_2, camera_helper_3);

/* Debug spot light */
const debug_options = {
    height: 10,
    radius: 1.6,
    angle: 0.4,
    penumbra: 1,
    decay: 0,
    distance: 15,
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

    spot_light_0xff00ff.position.y = h;
    spot_light_0x00ffff.position.y = h;
    spot_light_0xffff00.position.y = h;

    updateLight();

}

function updateRadius() {

    const r = debug_options.radius;

    spot_light_0xff00ff.position.x = 0;
    spot_light_0xff00ff.position.z = r;

    spot_light_0x00ffff.position.x = 2 * r / Math.sqrt(3);
    spot_light_0x00ffff.position.z = - r;

    spot_light_0xffff00.position.x = - 2 * r / Math.sqrt(3);
    spot_light_0xffff00.position.z = - r;

    updateLight();

}

function updateAngle() {

    const a = debug_options.angle;

    spot_light_0xff00ff.angle = a;
    spot_light_0x00ffff.angle = a;
    spot_light_0xffff00.angle = a;

    updateLight();

}

function updatePenumbra() {

    const p = debug_options.penumbra;

    spot_light_0xff00ff.penumbra = p;
    spot_light_0x00ffff.penumbra = p;
    spot_light_0xffff00.penumbra = p;

    updateLight();

}

function updateDecay() {

    const d = debug_options.decay;

    spot_light_0xff00ff.decay = d;
    spot_light_0x00ffff.decay = d;
    spot_light_0xffff00.decay = d;

    updateLight();

}

function updateDistance() {

    const d = debug_options.distance;

    spot_light_0xff00ff.distance = d;
    spot_light_0x00ffff.distance = d;
    spot_light_0xffff00.distance = d;

    updateLight();

}

function updateLight() {

    light_shell_1.update();
    light_shell_2.update();
    light_shell_3.update();

    light_helper_1.update();
    light_helper_2.update();
    light_helper_3.update();

    spot_light_0xff00ff.shadow.camera.updateProjectionMatrix();
    spot_light_0x00ffff.shadow.camera.updateProjectionMatrix();
    spot_light_0xffff00.shadow.camera.updateProjectionMatrix();

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
