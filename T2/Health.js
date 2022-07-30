import * as THREE from 'three';
import { createBoundingBox } from './index.js';
import { CSG } from '../libs/other/CSGMesh.js'


class Health {

    constructor(camera) {

        const cubeMesh = new THREE.Mesh(
            new THREE.BoxGeometry(2, 4, 2),
            new THREE.MeshPhongMaterial({ color: 0xff0000 })
        )

        const cubeMesh2 = new THREE.Mesh(
            new THREE.BoxGeometry(2, 2, 4),
            new THREE.MeshPhongMaterial({ color: 0xff0000 })
        )

        cubeMesh.position.set(-5, 10, -6)

        const cubeCSG = CSG.fromMesh(cubeMesh)

        cubeMesh2.position.set(-7, 10, -7)

        const cube2CSG = CSG.fromMesh(cubeMesh2)
        const cubeCrossIntersectCSG = cube2CSG.union(cubeCSG)
        const cubeCrossIntersectMesh = CSG.toMesh(
            cubeCrossIntersectCSG,
            new THREE.Matrix4()
        )

        // let zPosition = Math.floor(Math.random() * 52 - 26)
        let zPosition = 0
        this.object = cubeCrossIntersectMesh

        this.object.material = new THREE.MeshLambertMaterial({
            color: 0xff0000
        });
        this.object.castShadow = true;
        this.object.position.set(camera.position.x + 150, 10, zPosition);
        this.bounding = createBoundingBox(this.object);

        return this;
    }

    moviment() {

        this.object.rotateY(0.05)
    }


}

export { Health }