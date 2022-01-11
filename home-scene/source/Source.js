import * as three from "three";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

/* Texture */
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
    "./static/model/michelle/hello/glb-draco/scene.glb",
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

        }));

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

/**
 * 获取所有模型。
 * @returns {Array} - 模型数组。
 */
function getModels() {

    if (!models.length) console.warn("请先调用load方法。");

    return models;

}

export { load, getTextures, getModels };
