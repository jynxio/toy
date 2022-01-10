import "/style/reset.css";

import "/style/index.css";

import * as three from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

import * as dat from "lil-gui";


/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Scene
const scene = new three.Scene();

// Renderer
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

// Camera
const camera = new three.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 100);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
// controls.enablePan = false;
// controls.enableZoom = false;
controls.target = new three.Vector3(0, 0, -0.01);

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
function render() {

    controls.update();

    renderer.render(scene, camera);

}


/**
 * Light
 */
const light = new three.DirectionalLight(0xffffff, 3);
light.position.set();


/**
 * Furniture
 */
// House
const planes = createPlanes();
planes.forEach(item => scene.add(item));

function createPlanes() {

    const geometry = new three.PlaneGeometry(10, 10);
    const planes = [];

    for (let i = 0; i < 6; i++) planes[i] = new three.Mesh(geometry, new three.MeshBasicMaterial());

    planes[0].position.set(5, 0, 0);
    planes[0].rotateY(- Math.PI / 2);

    planes[1].position.set(- 5, 0, 0);
    planes[1].rotateY(Math.PI / 2);

    planes[2].position.set(0, 5, 0);
    planes[2].rotateX(Math.PI / 2);

    planes[3].position.set(0, - 5, 0);
    planes[3].rotateX(- Math.PI / 2);

    planes[4].position.set(0, 0, - 5);

    planes[5].position.set(0, 0, 5);
    planes[5].rotateY(Math.PI);

    return planes;

}

// Model and texture
loadSource().then(source => {

    const textures = source.texture;
    const models = source.model;

    textures.forEach((item, index) => {

        planes[index].material.map = item;
        planes[index].material.needsUpdate = true;

    });

    models.forEach((item, index) => {

        item.scale.set(0.002, 0.002, 0.002);
        item.position.set(0, 0, - 1);
        scene.add(item);

    });

});


/**
 * Loading manager
 */
function loadSource() {

    const texture_url = [
        "./static/texture/env-shanghai-4k-2048/px.png",
        "./static/texture/env-shanghai-4k-2048/nx.png",
        "./static/texture/env-shanghai-4k-2048/py.png",
        "./static/texture/env-shanghai-4k-2048/ny.png",
        "./static/texture/env-shanghai-4k-2048/pz.png",
        "./static/texture/env-shanghai-4k-2048/nz.png",
    ];
    const model_url = [
        "./static/model/michelle/draco/scene.glb",
    ];
    const result = {
        texture: [],
        model: [],
    };

    const manager = new three.LoadingManager();
    const promise = new Promise((resolve, reject) => {

        manager.onStart = onStart;
        manager.onProgress = onProgress;
        manager.onError = onError;
        manager.onLoad = onLoad;

        // Texture
        const texture_loader = new three.TextureLoader(manager);
        texture_url.forEach((item, index) => texture_loader.load(item, texture => {

            texture.encoding = three.sRGBEncoding;
            result.texture[index] = texture;

        }));

        // Model
        const draco_loader = new DRACOLoader();
        draco_loader.setDecoderPath("./node_modules/three/examples/js/libs/draco/");

        const gltf_loader = new GLTFLoader(manager);
        gltf_loader.setDRACOLoader(draco_loader);
        model_url.forEach((item, index) => gltf_loader.load(item, gltf => {

            result.model[index] = gltf.scene;

        }));

        // Event
        function onStart() {

            console.log("开始加载资源。");

        }

        function onProgress(url, num_of_loaded, num_of_total) {

            console.log("加载进度：" + num_of_loaded + "/" + num_of_total);

        }

        function onError(url) {

            console.log("加载出错：" + url);

            reject(url);

        }

        function onLoad() {

            console.log("资源加载完成。");

            resolve(result);

        }

    });

    return promise;

}
