import * as THREE from 'three';
import { Missile } from './Missile.js';



class EnemiesGround {
    enemieGround
    constructor(camera) {
        var enimiesGeometry = new THREE.BoxGeometry(6, 3, 6);
        var enimiesMaterial = new THREE.MeshLambertMaterial({ color: "rgb(200,100,0)" });

        this.enemieGround = new THREE.Mesh(enimiesGeometry, enimiesMaterial);

        this.enemieGround.position.set(camera.position.x + 80, 3, Math.floor(Math.random() * 52 - 26));

        return this;
    }

    shot(x, y, z) {

        let missile = new Missile(x, y, z);

        missile.missile.position.set(this.enemieGround.position.x, this.enemieGround.position.y, this.enemieGround.position.z)

        console.log(x, y, z)
        console.log(this.enemieGround.position.x, this.enemieGround.position.y, this.enemieGround.position.z)
        return missile
    }
}

export { EnemiesGround }