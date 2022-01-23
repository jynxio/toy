import "/style/reset.css";

import "/style/index.css";

import * as three from "three";

import { Lensflare, LensflareElement } from "three/examples/jsm/objects/Lensflare";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import SpotLightShell from "./SpotLightShell";

import GUI from "lil-gui";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";

import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";

import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";

import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

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
/* Test */
const g = new three.ConeGeometry(2, 10, 64, 1);
const m = new three.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.01,
    side: three.DoubleSide,
});
const p = new three.Mesh(g, m);

m.depthTest = false;
m.depthWrite = false;
m.needsUpdate = true;

p.renderOrder = 1;
p.position.y = 3;

scene.add(p);

function floodlight({
    renderer,
    scene,
    camera,
    targets,
}) {

    /* 合成器1（制造全局泛光） */
    const composer_bloom = new EffectComposer(renderer);                                                              // 效果合成器
    const pass_render = new RenderPass(scene, camera);                                                                // 后期处理（基本）
    const pass_bloom = new UnrealBloomPass(
        renderer.getSize(new three.Vector2),
        1.5,
        0.4,
        0.85,
    );

    pass_bloom.threshold = 0;
    pass_bloom.strength = 5;
    pass_bloom.radius = 0.2;

    composer_bloom.renderToScreen = false;
    composer_bloom.addPass(pass_render);
    composer_bloom.addPass(pass_bloom);
    composer_bloom.setSize(...renderer.getSize(new three.Vector2).toArray());

    /* 合成器2（制造局部泛光） */
    const pass_final = new ShaderPass(
        new three.ShaderMaterial({
            uniforms: {
                baseTexture: { value: null },
                bloomTexture: { value: composer_bloom.renderTarget2.texture }
            },
            vertexShader: "varying vec2 vUv;void main() {vUv = uv;gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );}",
            fragmentShader: "uniform sampler2D baseTexture;uniform sampler2D bloomTexture;varying vec2 vUv;void main() {gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );}",
            defines: {}
        }),
        "baseTexture"
    );

    pass_final.needsSwap = true;

    const composer_final = new EffectComposer(renderer);

    composer_final.addPass(pass_render);
    composer_final.addPass(pass_final);
    composer_final.setSize(window.innerWidth, window.innerHeight);

    const material_black = new three.MeshBasicMaterial({ color: 0x000000 });

    renderer.setAnimationLoop(_ => {

        const materials_map = new Map();

        scene.traverse(object3d => {

            if (!object3d.material) return;

            let is_target = false;

            for (let i = 0; i < targets.length; i++) {

                if (targets[i] !== object3d) continue;

                is_target = true;

                break;

            }

            if (is_target) return;

            const id = object3d.id;
            const material = object3d.material;

            materials_map.set(id, material);

            object3d.material = material_black;

        });

        scene.fog.color.set(0x000000);
        scene.background.set(0x000000);

        composer_bloom.render();

        materials_map.forEach((value, key) => {

            scene.getObjectById(key).material = value;

        });

        scene.fog.color.set(0x262837);
        scene.background.set(0x262837);

        composer_final.render();

    });

    window.addEventListener("resize", _ => {

        const size = renderer.getSize(new three.Vector2).toArray();

        composer_bloom.setSize(...size);
        composer_final.setSize(...size);

    });

}

/* Fog */
scene.fog = new three.FogExp2(0x262837, 0.05);
scene.background = new three.Color(0x262837);

// gui.add(scene.fog, "density").min(0).max(1).min(0.00001).name("Fog");

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
    decay: 1,
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

floodlight({ renderer, scene, camera, targets: [p] });
