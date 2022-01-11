import "/style/reset.css";

import "/style/index.css";

import * as three from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import * as dat from "lil-gui";

import * as Source from "./Source";

import * as Environment from "./Environment";


/* ----------------------------------------------------------------------------------------------------------------------------------------------- */
/* BASE */
/* ----------------------------------------------------------------------------------------------------------------------------------------------- */
/* Debug */
const gui = new dat.GUI();

/* Scene */
const scene = new three.Scene();

/* Renderer */
const use_antialias = window.devicePixelRatio < 2 ? true : false;
const renderer = new three.WebGLRenderer({ antialias: use_antialias });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.physicallyCorrectLights = true;          // 令光源使用真实的光照单位。
renderer.outputEncoding = three.sRGBEncoding;     // 使用更加真实的输出编码。
renderer.toneMapping = three.NoToneMapping;       // 修改色调映射。
renderer.toneMappingExposure = 1;                 // 修改曝光度。
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = three.PCFSoftShadowMap;
renderer.setAnimationLoop(render);

gui.add(renderer, "toneMappingExposure").min(0).max(10).step(0.001);
gui.add(renderer, "toneMapping", {
    No: three.NoToneMapping,
    Linear: three.LinearToneMapping,
    Reinhard: three.ReinhardToneMapping,
    Cineon: three.CineonToneMapping,
    ACESFilmic: three.ACESFilmicToneMapping,
});

document.body.append(renderer.domElement);

/* Camera */
const camera = new three.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 100);
scene.add(camera);

/* Controls */
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
// controls.enablePan = false;
// controls.enableZoom = false;
controls.target = new three.Vector3(0, 0, 0.01);

/* Light */
const light = new three.DirectionalLight(0xffffff, 6);

light.position.set(- 10, 10, 10);
scene.add(light);

const helper = new three.DirectionalLightHelper(light);

scene.add(helper);

// const helper = new three.CameraHelper(light.shadow.camera);
// scene.add(helper);

/* Resize */
window.addEventListener("resize", _ => {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

});

/* ----------------------------------------------------------------------------------------------------------------------------------------------- */
/* RENDER */
/* ----------------------------------------------------------------------------------------------------------------------------------------------- */
function render() {

    helper.update();

    controls.update();

    renderer.render(scene, camera);

}
/* ----------------------------------------------------------------------------------------------------------------------------------------------- */
/* ENVIRONMENT */
/* ----------------------------------------------------------------------------------------------------------------------------------------------- */
const environment = Environment.init();

environment.forEach(item => scene.add(item));

/* ----------------------------------------------------------------------------------------------------------------------------------------------- */
/* SOURCE */
/* ----------------------------------------------------------------------------------------------------------------------------------------------- */
Source.load().then(response => {

    if (!response) {

        console.warn("资源加载发生错误。");

        return;

    }

    /* Textures */
    const textures = Source.getTextures();

    /* Cube texture */
    const cube_texture = Source.getCubeTexture();

    /* Environment */
    Environment.addTexture(textures);

    /* Model */
    const models = Source.getModels();
    const model = models[0];

    model.rotateY(Math.PI);
    model.scale.set(0.12, 0.12, 0.12);
    model.position.set(0, - 1.99, 7.76);
    model.traverse(item => {

        if (item instanceof three.Mesh === false) return;
        if (item.material instanceof three.MeshStandardMaterial === false) return;

        item.material.envMap = cube_texture;
        item.material.envMapIntensity = 3; // TODO 调试出一个合适的envmap强度

    });

    scene.add(model);

    light.target = model;

    gui.add(model.position, "x").min(- 10).max(10).step(0.01);
    gui.add(model.position, "y").min(- 10).max(10).step(0.01);
    gui.add(model.position, "z").min(- 10).max(10).step(0.01);

});
