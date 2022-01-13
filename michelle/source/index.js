import "/style/reset.css";

import "/style/index.css";

import * as three from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

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

load();

function load() {

    const result = {
        model: undefined,
        env_texture: undefined,
        map_textures: [],
    };

    const manager = new three.LoadingManager();

    const promise = new Promise((resolve, reject) => {

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
        const draco_loader = new DRACOLoader();

        draco_loader.setDecoderPath("./node_modules/three/examples/js/libs/draco/");

        const gltf_loader = new GLTFLoader(manager);

        gltf_loader.setDRACOLoader(draco_loader);
        gltf_loader.load("./static/model/glb-draco/scene.glb", gltf => {

            result.model = gltf.scene;

        });

        /* Env texture */
        const cube_texture_loader = new three.CubeTextureLoader(manager);

        cube_texture_loader
            .setPath("./static/texture/shanghai-bund-hdr-4k-img-1024/")
            .load(["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"], texture => {

                texture.encoding = three.sRGBEncoding;

                result.env_texture = texture;

            });

        /* Map textures */
        const texture_loader = new three.TextureLoader(manager);

        // TODO

    });

}

/* ------------------------------------------------------------------------------------------------------ */
/* Render */
renderer.setAnimationLoop(function loop() {

    controls.update();

    renderer.render(scene, camera);

});
