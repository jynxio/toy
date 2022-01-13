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
console.log(use_antialias);
const renderer = new three.WebGLRenderer({ antialias: use_antialias });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.physicallyCorrectLights = true;          // 令光源使用真实的光照单位。
renderer.outputEncoding = three.sRGBEncoding;     // 使用更加真实的输出编码。
renderer.toneMapping = three.ACESFilmicToneMapping;       // 修改色调映射。
renderer.toneMappingExposure = 1;                 // 修改曝光度。
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = three.PCFSoftShadowMap;
renderer.setAnimationLoop(render);

document.body.append(renderer.domElement);

gui.add(renderer, "toneMappingExposure").min(0).max(10).step(0.001);
gui.add(renderer, "toneMapping", {
    No: three.NoToneMapping,
    Linear: three.LinearToneMapping,
    Reinhard: three.ReinhardToneMapping,
    Cineon: three.CineonToneMapping,
    ACESFilmic: three.ACESFilmicToneMapping,
});

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
const light = new three.DirectionalLight(0xff00ff, 4);
light.position.set(- 1.56, - 0.58, 10);
light.castShadow = true;
light.shadow.mapSize.set(1024, 1024);
light.shadow.camera.far = 15;
light.shadow.camera.top = 5;
light.shadow.camera.right = 5;
light.shadow.camera.bottom = -5;
light.shadow.camera.left = -5;
light.shadow.camera.far = 10;
// light.shadow.camera.near = 5;
scene.add(light);

gui.add(light.position, "x").min(- 10).max(10).name("light-x");
gui.add(light.position, "y").min(- 10).max(10).name("light-y");
gui.add(light.position, "z").min(- 10).max(10).name("light-z");

const helper = new three.DirectionalLightHelper(light);
// scene.add(helper);

const helper_2 = new three.CameraHelper(light.shadow.camera);
// scene.add(helper_2);

gui.add(light, "castShadow").name("shadow");
// gui.add(light.shadow.camera, "top").min(0).max(10).name("shadow-top").step(0.01);
// gui.add(light.shadow.camera, "bottom").min(- 10).max(0).name("shadow-bottom").step(- 0.01);
// gui.add(light.shadow.camera, "left").min(- 10).max(0).name("shadow-left").step(- 0.01);
// gui.add(light.shadow.camera, "right").min(0).max(10).name("shadow-right").step(0.01);
// gui.add(light.shadow.camera, "far").min(0).max(20).name("shadow-far").step(0.01);
// gui.add(light.shadow.camera, "near").min(0).max(20).name("shadow-near").step(0.01);

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

    light.shadow.camera.updateProjectionMatrix();
    helper.update();
    helper_2.update();

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
    model.scale.set(0.015, 0.015, 0.015);
    model.position.set(0, - 1.99, 7.76);

    scene.add(model);

    light.target = model;

    // gui.add(model.position, "x").min(- 10).max(10).step(0.01).name("model-x");
    // gui.add(model.position, "y").min(- 10).max(10).step(0.01).name("model-y");
    // gui.add(model.position, "z").min(- 10).max(10).step(0.01).name("model-z");

    const debug_opstions = {
        envMapIntensity: 8,
    };

    updateModelEnvMap();

    function updateModelEnvMap() {

        model.traverse(item => {

            if (item instanceof three.Mesh === false) return;
            if (item.material instanceof three.MeshStandardMaterial === false) return;

            item.material.envMap = cube_texture;
            item.material.envMapIntensity = debug_opstions.envMapIntensity;
            item.castShadow = true;
            item.receiveShadow = true;

        });

    }

    gui.add(debug_opstions, "envMapIntensity").min(0).max(10).step(0.01).name("env-map-intensity").onChange(updateModelEnvMap);

    /* Ground */
    const ground = new three.Mesh(
        new three.PlaneGeometry(8, 8).rotateX(- Math.PI / 2),
        new three.ShadowMaterial({ opacity: 0.5 }),
    );
    ground.position.copy(model.position);
    ground.receiveShadow = true;
    scene.add(ground);

});