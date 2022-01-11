import * as three from "three";

const environment = []; // px nx py ny pz nz

/**
 * 创建环境，环境是6面墙，它们将组成一个Box。
 * @returns {Array}
 */
function init() {

    const geometry = new three.PlaneGeometry(20, 20);


    /* Px */
    const env_px = new three.Mesh(geometry, new three.MeshBasicMaterial());

    env_px.position.set(10, 0, 0);
    env_px.rotateY(- Math.PI / 2);

    /* Nx */
    const env_nx = new three.Mesh(geometry, new three.MeshBasicMaterial());

    env_nx.position.set(- 10, 0, 0);
    env_nx.rotateY(Math.PI / 2);

    /* Py */
    const env_py = new three.Mesh(geometry, new three.MeshBasicMaterial());

    env_py.position.set(0, 10, 0);
    env_py.rotateX(Math.PI / 2);

    /* Ny */
    const env_ny = new three.Mesh(geometry, new three.MeshBasicMaterial());

    env_ny.position.set(0, - 10, 0);
    env_ny.rotateX(- Math.PI / 2);

    /* Pz */
    const env_pz = new three.Mesh(geometry, new three.MeshBasicMaterial());

    env_pz.position.set(0, 0, - 10);

    /* Nz */
    const env_nz = new three.Mesh(geometry, new three.MeshBasicMaterial());

    env_nz.position.set(0, 0, 10);
    env_nz.rotateY(Math.PI);

    /* Push */
    environment.push(env_px, env_nx, env_py, env_ny, env_pz, env_nz);

    return environment;

}

/**
 * 获取环境。
 * @returns {Array}
 */
function get() {

    if (environment.length) return environment;

    init();

    return environment;

}

/**
 * 增加纹理。
 * @param {Array} textures - 存储6个纹理的数组，纹理的顺序是：px nx py ny pz nz。
 * @returns {Array}
 */
function addTexture(textures) {

    if (!environment.length) init();

    textures.forEach((item, index) => {

        const material = environment[index].material;

        material.map = item;
        material.needsUpdate = true;

    });

    return environment;

}

export { init, get, addTexture };
