import * as three from "three";

const _vector = /*@__PURE__*/ new three.Vector3();

/**
     * Spot light的外壳。
     * @param   {Object} light         - SpotLight实例。
     * @param   {number} [opacity = 1] - 透明度，默认值是1。
     * @returns {Object}
     * @example
     * new SpotLightShell(new three.SoptLight(), undefined, 0.3);
     */
export default class SpotLightHelper extends three.Object3D {

    constructor(light, opacity = 1) {

        super();

        this.light = light;
        this.light.updateMatrixWorld();

        this.opacity = 1;

        this.matrix = light.matrixWorld;
        this.matrixAutoUpdate = false;

        this.color = light.color.getHex();

        const geometry = new three.BufferGeometry();

        const positions = [
            0, 0, 0, 0, 0, 1,
            0, 0, 0, 1, 0, 1,
            0, 0, 0, - 1, 0, 1,
            0, 0, 0, 0, 1, 1,
            0, 0, 0, 0, - 1, 1
        ];

        for (let i = 0, j = 1, l = 32; i < l; i++, j++) {

            const p1 = (i / l) * Math.PI * 2;
            const p2 = (j / l) * Math.PI * 2;

            positions.push(
                Math.cos(p1), Math.sin(p1), 1,
                Math.cos(p2), Math.sin(p2), 1
            );

        }

        geometry.setAttribute('position', new three.Float32BufferAttribute(positions, 3));

        const material = new three.LineBasicMaterial();

        this.cone = new three.LineSegments(geometry, material);
        this.add(this.cone);

        this.update();

    }

    dispose() {

        this.cone.geometry.dispose();
        this.cone.material.dispose();

    }

    update() {

        this.light.updateMatrixWorld();

        const coneLength = this.light.distance ? this.light.distance : 1000;
        const coneWidth = coneLength * Math.tan(this.light.angle);

        this.cone.scale.set(coneWidth, coneWidth, coneLength);

        _vector.setFromMatrixPosition(this.light.target.matrixWorld);

        this.cone.lookAt(_vector);

        if (this.color !== undefined) {

            this.cone.material.color.set(this.color);

        } else {

            this.cone.material.color.copy(this.light.color);

        }

    }

}
