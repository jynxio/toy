import "/style/reset.css";

import * as three from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import * as dat from "lil-gui";
import { FileLoader } from "three";


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
renderer.toneMapping = three.ReinhardToneMapping; // 修改色调映射。
renderer.toneMappingExposure = 3;
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


/**
 * Render
 */
function render() {

    controls.update();

    renderer.render(scene, camera);

}


/**
 * House
 */
const geometry = new three.PlaneGeometry(10, 10);
const planes = [];

for (let i = 0; i < 6; i++) {

    planes[i] = new three.Mesh(geometry, new three.MeshBasicMaterial());

    scene.add(planes[i]);

}

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

loadHouseMap();

function loadHouseMap() {

    const env_map_url = [
        "./static/texture/env-indoor-1024/px.png",
        "./static/texture/env-indoor-1024/nx.png",
        "./static/texture/env-indoor-1024/py.png",
        "./static/texture/env-indoor-1024/ny.png",
        "./static/texture/env-indoor-1024/pz.png",
        "./static/texture/env-indoor-1024/nz.png",
    ];
    const env_map = [];

    const manager = new three.LoadingManager();

    manager.onStart = _ => {

        console.log("开始加载资源。");

    };
    manager.onLoad = _ => {

        console.log("资源加载完成。");

        for (let i = 0; i < 6; i++) {

            planes[i].material.map = env_map[i];
            planes[i].material.needsUpdate = true;

        }

    };
    manager.onProgress = (url, num_of_loaded, num_of_total) => {

        console.log("加载进度：" + num_of_loaded + "/" + num_of_total);

    };
    manager.onError = url => {

        console.log("加载出错：" + url);

    };

    const loader = new three.TextureLoader(manager);

    env_map_url.forEach((item, index) => {

        loader.load(item, texture => {

            texture.encoding = three.sRGBEncoding;
            env_map[index] = texture;

        });

    });

}
