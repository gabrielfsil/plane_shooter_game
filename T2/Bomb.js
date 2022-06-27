import { degreesToRadians } from "../libs/util/util.js";
import * as THREE from "three"
import { createBoundingBox } from "./index.js";


class Bomb {

    constructor(position) {
        var missileGeometry = new THREE.CylinderGeometry(0.3, 0.3, 2, 10);
        var missileMaterial = new THREE.MeshLambertMaterial({ color: 'blue' });
        this.object = new THREE.Mesh(missileGeometry, missileMaterial);
        this.object.position.set(position.x, position.y, position.z);
        this.object.rotateZ(degreesToRadians(90))

        this.bounding = createBoundingBox(this.object)

        return this
    }

    moviment() {

        this.object.translateX(-0.3)
        this.object.translateY(-0.4)
    }
}

export { Bomb }