import * as THREE from "three"
import { degreesToRadians } from "../libs/util/util.js";


class Missile {
    constructor(x, y, z) {

        var missileGeometry = new THREE.CylinderGeometry(0.5, 0.5, 4, 10);
        var missileMaterial = new THREE.MeshLambertMaterial({ color: 'orange' });
        this.missile = new THREE.Mesh(missileGeometry, missileMaterial);

        this.destiny = new THREE.Vector3(x, 0, z);
        
        return this
    }

    moviment() {

        if (this.missile.position.y > 10) {
            

            // this.missile.rotateOnAxis(this.destiny,degreesToRadians(90))
            // this.missile.translateOnAxis(this.destiny, 0.5)
        } else {
            // this.missile.position.y += 0.5;
        }

    }
}

export { Missile }