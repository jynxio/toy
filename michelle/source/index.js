import "/style/reset.css";

import "/style/index.css";

import * as three from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

import GUI from "lil-gui";

// TODO 图片压缩 https://tinypng.com/
// TODO The environment map. To ensure a physically correct rendering, you should only
//      add environment maps which were preprocessed by PMREMGenerator.Default is null.
//      https://threejs.org/docs/index.html?q=material#api/zh/extras/PMREMGenerator

// TODO 我使用tinypng来压缩环境贴图和模型纹理，压缩后文件体积减小到原来的54%，网页加载速度提升32%，
//      模型质量几乎不变（极近距离观看时才会发现模型的皮肤变粗糙），环境贴图质量下降较为明显。

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
const camera = new three.PerspectiveCamera(
    50,                                     // fov
    window.innerWidth / window.innerHeight, // aspect
    0.01,                                   // near
    100,                                    // far
);

scene.add(camera);

/* Controls */
const controls = new OrbitControls(camera, renderer.domElement);

controls.enableDamping = true;
controls.enablePan = false;
// controls.enableZoom = false;
controls.target = new three.Vector3(0, 0, 0.01);

/* Resize */
window.addEventListener("resize", _ => {

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

});

/* ------------------------------------------------------------------------------------------------------ */
/* Light */
const light = new three.DirectionalLight(0xff00ff, 3);

light.position.set(- 1, - 1, 10);
light.castShadow = true;
light.shadow.mapSize.x = 1024;
light.shadow.mapSize.y = 1024;
light.shadow.camera.top = 2.5;
light.shadow.camera.bottom = 0;
light.shadow.camera.right = 1;
light.shadow.camera.left = - 1;
light.shadow.camera.far = 11.5;
light.shadow.camera.near = 0.1;

scene.add(light);

// const gui = new GUI();

// gui.add(light.position, "x").min(- 10).max(10).step(0.1);
// gui.add(light.position, "y").min(- 10).max(10).step(0.1);
// gui.add(light.position, "z").min(- 10).max(10).step(0.1);

// const helper_1 = new three.DirectionalLightHelper(light);

// scene.add(helper_1);

// const helper_2 = new three.CameraHelper(light.shadow.camera);

// scene.add(helper_2);

// window.requestAnimationFrame(function loop() {

//     window.requestAnimationFrame(loop);

//     helper_1.update();

//     light.shadow.camera.updateProjectionMatrix();
//     helper_2.update();

// });

/* Texture & model */

load().then(assets => {

    const { model, texture } = assets;

    /* Environment */
    scene.background = texture;

    /* Model */
    model.rotateY(Math.PI);
    model.scale.set(0.012, 0.012, 0.012);
    model.position.set(0, - 1.99, 7.76);

    scene.add(model);

    light.target = model;

    updateModel();

    function updateModel() {

        model.traverse(item => {

            if (item instanceof three.Mesh === false) return;
            if (item.material instanceof three.MeshStandardMaterial === false) return;

            item.material.envMap = texture;
            item.material.envMapIntensity = 8;

            item.castShadow = true;
            item.receiveShadow = true;

        });

    }

    /* Shadow ground */
    const ground = new three.Mesh(
        new three.PlaneGeometry(20, 20).rotateX(- Math.PI / 2),
        new three.ShadowMaterial({ opacity: 0.35 }),
        // new three.MeshStandardMaterial(),
    );

    ground.position.copy(model.position);
    ground.receiveShadow = true;

    scene.add(ground);

});

function load() {

    const result = {
        model: undefined,
        texture: undefined,
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
        const model_url = "./static/model/glb-compress-draco/scene.glb";
        // const model_url = "./static/model/glb-draco/scene.glb";

        const draco_loader = new DRACOLoader();

        draco_loader.setDecoderPath(draco_url);

        const gltf_loader = new GLTFLoader(manager);

        gltf_loader.setDRACOLoader(draco_loader);
        gltf_loader.load(model_url, gltf => {

            result.model = gltf.scene;

        });

        /* Env texture */
        const texture_urls = [
            "./static/texture/shanghaibund-hdr4k-img1024-compress/px.png",
            "./static/texture/shanghaibund-hdr4k-img1024-compress/nx.png",
            "./static/texture/shanghaibund-hdr4k-img1024-compress/py.png",
            "./static/texture/shanghaibund-hdr4k-img1024-compress/ny.png",
            "./static/texture/shanghaibund-hdr4k-img1024-compress/pz.png",
            "./static/texture/shanghaibund-hdr4k-img1024-compress/nz.png",
            // "./static/texture/shanghaibund-hdr4k-img1024/px.png",
            // "./static/texture/shanghaibund-hdr4k-img1024/nx.png",
            // "./static/texture/shanghaibund-hdr4k-img1024/py.png",
            // "./static/texture/shanghaibund-hdr4k-img1024/ny.png",
            // "./static/texture/shanghaibund-hdr4k-img1024/pz.png",
            // "./static/texture/shanghaibund-hdr4k-img1024/nz.png",
        ];

        const env_texture_loader = new three.CubeTextureLoader(manager);

        env_texture_loader.load(texture_urls, texture => {

            texture.encoding = three.sRGBEncoding;

            result.texture = texture;

        });

    });

    return promise;

}

/* ------------------------------------------------------------------------------------------------------ */
/* Render */
renderer.setAnimationLoop(function loop() {

    controls.update();

    renderer.render(scene, camera);

});
