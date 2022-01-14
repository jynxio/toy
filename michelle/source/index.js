import "/style/reset.css";

import "/style/index.css";

import * as three from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

// TODO 图片压缩 https://tinypng.com/
// TODO The environment map. To ensure a physically correct rendering, you should only
//      add environment maps which were preprocessed by PMREMGenerator.Default is null.
//      https://threejs.org/docs/index.html?q=material#api/zh/extras/PMREMGenerator
// TODO 请注意，如果在材质被使用之后，纹理贴图中这个值发生了改变， 需要触发Material.needsUpdate，来使
//      得这个值在着色器中实现。

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

/* Plane */
const plane_geometry = new three.PlaneGeometry(20, 20);

const planes = []; // px nx py ny pz nz

for (let i = 0; i < 6; i++) planes.push(new three.Mesh(plane_geometry, new three.MeshBasicMaterial()));

planes[0].position.set(10, 0, 0);
planes[0].rotateY(- Math.PI / 2);

planes[1].position.set(- 10, 0, 0);
planes[1].rotateY(Math.PI / 2);

planes[2].position.set(0, 10, 0);
planes[2].rotateX(Math.PI / 2);

planes[3].position.set(0, - 10, 0);
planes[3].rotateX(- Math.PI / 2);

planes[4].position.set(0, 0, - 10);

planes[5].position.set(0, 0, 10);
planes[5].rotateY(Math.PI);

scene.add(...planes);

/* Texture & Model */

load().then(assets => {

    const model = assets.model;
    const env_texture = assets.env_texture;
    const map_textures = assets.map_textures;

    // TODO model

});

function load() {

    const result = {
        model: undefined,
        env_texture: undefined,
        map_textures: [],
    };

    const promise = new Promise((resolve, reject) => {

        const manager = new three.LoadingManager();

        manager.onLoad = onLoad;
        manager.onError = onError;
        manager.onStart = onStart;
        manager.onProgress = onProgress;

        function onLoad() {

            console.log("开始加载资源。");

            resolve(result);

        }

        function onError(info) {

            console.log("资源加载出错。");

            reject(info);

        }

        function onStart() {

            console.log("开始加载资源。");

        }

        function onProgress(_, num_of_loaded, num_of_total) {

            console.log(`资源加载进度：${num_of_loaded}/${num_of_total}`);

        }

        /* Model */
        const draco_url = "./node_modules/three/examples/js/libs/draco/";
        const model_url = "./static/model/glb-draco/scene.glb";

        const draco_loader = new DRACOLoader();

        draco_loader.setDecoderPath(draco_url);

        const gltf_loader = new GLTFLoader(manager);

        gltf_loader.setDRACOLoader(draco_loader);
        gltf_loader.load(model_url, gltf => {

            result.model = gltf.scene;

        });

        /* Env texture */
        const texture_urls = [
            "./static/texture/shanghai-bund-hdr-4k-img-1024/px.png",
            "./static/texture/shanghai-bund-hdr-4k-img-1024/nx.png",
            "./static/texture/shanghai-bund-hdr-4k-img-1024/py.png",
            "./static/texture/shanghai-bund-hdr-4k-img-1024/ny.png",
            "./static/texture/shanghai-bund-hdr-4k-img-1024/pz.png",
            "./static/texture/shanghai-bund-hdr-4k-img-1024/nz.png",
        ];

        const env_texture_loader = new three.CubeTextureLoader(manager);

        env_texture_loader.load(texture_urls, texture => {

            texture.encoding = three.sRGBEncoding;

            result.env_texture = texture;

        });

        /* Map textures */
        const map_texture_loader = new three.TextureLoader(manager);
        texture_urls.forEach((item, index) => map_texture_loader.load(item, texture => {

            texture.encoding = three.sRGBEncoding;

            result.map_textures.push(texture);

        }));

    });

    return promise;

}

/* ------------------------------------------------------------------------------------------------------ */
/* Render */
renderer.setAnimationLoop(function loop() {

    controls.update();

    renderer.render(scene, camera);

});
