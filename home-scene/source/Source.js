import * as three from "three";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

/* Texture */
let cube_texture;
const textures = [];
const textures_url = [
    "./static/texture/env-shanghai-4k-2048/px.png",
    "./static/texture/env-shanghai-4k-2048/nx.png",
    "./static/texture/env-shanghai-4k-2048/py.png",
    "./static/texture/env-shanghai-4k-2048/ny.png",
    "./static/texture/env-shanghai-4k-2048/pz.png",
    "./static/texture/env-shanghai-4k-2048/nz.png",
];

/* Model */
const models = [];
const models_url = [
    "./static/model/michelle/standing/glb-draco/scene.glb",
];

/**
 * 加载资源。
 * @returns {Promise} 若加载成功，则返回true，若任意资源加载失败则返回false且向控制台输出错误信息。
 */
function load() {

    const manager = new three.LoadingManager();
    const promise = new Promise((resolve, reject) => {

        manager.onStart = onStart;
        manager.onProgress = onProgress;
        manager.onError = onError;
        manager.onLoad = onLoad;

        /* Texture */
        const texture_loader = new three.TextureLoader(manager);
        textures_url.forEach((item, index) => texture_loader.load(item, texture => {

            texture.encoding = three.sRGBEncoding;
            textures[index] = texture;

            // TODO 压缩图片  [TinyPNG](https://tinypng.com/)
            // TODO The environment map. To ensure a physically correct rendering, you should only add environment maps which were preprocessed by PMREMGenerator. Default is null.
            // TODO https://threejs.org/docs/index.html?q=material#api/zh/extras/PMREMGenerator
            // TODO 请注意，如果在材质被使用之后，纹理贴图中这个值发生了改变， 需要触发Material.needsUpdate，来使得这个值在着色器中实现。

        }));

        /* Cube texture */
        const cube_texture_loader = new three.CubeTextureLoader(manager);
        cube_texture = cube_texture_loader.load(textures_url);
        cube_texture.encoding = three.sRGBEncoding;

        /* Model */
        const draco_loader = new DRACOLoader();
        draco_loader.setDecoderPath("./node_modules/three/examples/js/libs/draco/");

        const gltf_loader = new GLTFLoader(manager);
        gltf_loader.setDRACOLoader(draco_loader);
        models_url.forEach((item, index) => gltf_loader.load(item, gltf => {

            models[index] = gltf.scene;

        }));

        /* Event */
        function onStart() {

            console.log("开始加载资源。");

        }

        function onProgress(url, num_of_loaded, num_of_total) {

            console.log("加载进度：" + num_of_loaded + "/" + num_of_total);

        }

        function onError(url) {

            console.log("加载出错：" + url);

            reject(false);

        }

        function onLoad() {

            console.log("资源加载完成。");

            resolve(true);

        }

    });

    return promise;

}

/**
 * 获取所有纹理。
 * @returns {Array} - 纹理数组。
 */
function getTextures() {

    if (!textures.length) console.warn("请先调用load方法。");

    return textures;

}

function getCubeTexture() {

    if (!cube_texture) console.warn("请先调用load方法。");

    return cube_texture;

}

/**
 * 获取所有模型。
 * @returns {Array} - 模型数组。
 */
function getModels() {

    if (!models.length) console.warn("请先调用load方法。");

    return models;

}

export { load, getTextures, getCubeTexture, getModels };
