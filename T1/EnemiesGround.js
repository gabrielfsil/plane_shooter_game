import * as THREE from 'three';
import { Missile } from './Missile.js';

class EnemiesGround {

    constructor(camera) {
        var enimiesGeometry = new THREE.BoxGeometry(0, 0, 0);
        var enimiesMaterial = new THREE.MeshLambertMaterial();

        this.object = new THREE.Mesh(enimiesGeometry, enimiesMaterial);

        this.object.position.set(camera.position.x + 160, 0, Math.floor(Math.random() * 52 - 26));

        return this;
    }

    add(object) {

        this.object = object
    }

    shot(x, y, z) {

        let missile = new Missile([this.object.position.x, this.object.position.y, this.object.position.z], [x, y, z]);

        missile.object.position.set(this.object.position.x, this.object.position.y, this.object.position.z)

        return missile
    }
}

export { EnemiesGround }