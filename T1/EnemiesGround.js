import * as THREE from 'three';
import { createBoundingBox } from './index.js';
import { Missile } from './Missile.js';

class EnemiesGround {

    constructor(camera) {
        var enimiesGeometry = new THREE.BoxGeometry(10, 1, 10);
        var enimiesMaterial = new THREE.MeshLambertMaterial({ transparent: true, opacity: 0 });

        this.object = new THREE.Mesh(enimiesGeometry, enimiesMaterial);
        this.bounding = createBoundingBox(this.object)
        this.fall = false;
        // let zPosition = Math.floor(Math.random() * 52 - 26)
        let zPosition = -20;
        this.object.position.set(camera.position.x + 160, 0, zPosition);

        return this;
    }

    drop() {
        this.fall = true
    }

    add(object) {

        this.object = object
    }

    shot(x, y, z) {

        let missile = new Missile([this.object.position.x, this.object.position.y, this.object.position.z], [x, y, z]);

        missile.object.position.set(this.object.position.x, this.object.position.y, this.object.position.z)

        return missile
    }

    moviment() {
        if (this.fall) {
            if (this.object.position.y > -10) {
                this.object.translateY(-0.5)
                this.object.translateZ(-0.5)
            }
        }
    }
}

export { EnemiesGround }