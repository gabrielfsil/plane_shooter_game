import * as THREE from "three"
import { degreesToRadians } from "../libs/util/util.js";


class Missile {
    constructor([x1, y1, z1], [x2, y2, z2]) {

        var missileGeometry = new THREE.CylinderGeometry(0.3, 0.3, 1, 10);
        var missileMaterial = new THREE.MeshLambertMaterial({ color: 'orange' });
        this.missile = new THREE.Mesh(missileGeometry, missileMaterial);

        this.destiny = new THREE.Vector3(x2 - x1 + 40, 0, z2 - z1);

        return this
    }

    moviment() {

        if (this.missile.position.y === 10) {

            this.missile.position.y += 0.05;


        } else if (this.missile.position.y > 10) {

            this.missile.translateOnAxis(this.destiny, 0.01)

        } else {
            this.missile.position.y += 0.25;
        }

    }
}

export { Missile }