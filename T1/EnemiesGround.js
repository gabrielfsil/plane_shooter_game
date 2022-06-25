import * as THREE from 'three';
import { Missile } from './Missile.js';

class EnemiesGround {

    constructor(camera) {
        var enimiesGeometry = new THREE.BoxGeometry(0, 0, 0);
        var enimiesMaterial = new THREE.MeshLambertMaterial();

        this.enemieGround = new THREE.Mesh(enimiesGeometry, enimiesMaterial);

        this.enemieGround.position.set(camera.position.x + 80, 0, Math.floor(Math.random() * 52 - 26));


        return this;
    }

    add(object) {

        this.enemieGround = object
    }

    shot(x, y, z) {

        let missile = new Missile([this.enemieGround.position.x, this.enemieGround.position.y, this.enemieGround.position.z], [x, y, z]);

        missile.missile.position.set(this.enemieGround.position.x, this.enemieGround.position.y, this.enemieGround.position.z)

        return missile
    }
}

export { EnemiesGround }