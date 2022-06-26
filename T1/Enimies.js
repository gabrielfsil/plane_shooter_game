import * as THREE from 'three';
import { createBoundingBox } from './index.js';

import { degreesToRadians } from '../libs/util/util.js';
import { Shot } from './Shot.js';



class Enemy {

    constructor(camera, dirMoviment, speed) {

        var enimiesGeometry = new THREE.BoxGeometry(4, 4, 4);
        var enimiesMaterial = new THREE.MeshLambertMaterial({ transparent: true, opacity: 0 });

        this.object = new THREE.Mesh(enimiesGeometry, enimiesMaterial);

        let zPosition = Math.floor(Math.random() * 52 - 26)
        this.object.position.set(camera.position.x + 150, 10, zPosition);
        this.bounding = createBoundingBox(this.object);

        this.dirMoviment = dirMoviment
        this.speed = speed
        this.direction = zPosition > 0 ? 1 : -1
        this.fall = false
        this.active = true;

        return this;
    }

    drop() {
        this.fall = true
    }

    add(object) {

        this.object = object
    }

    shot(x, y, z) {

        var sphere = new Shot(this.object.position, new THREE.Vector3(x - this.object.position.x + 40, 0, z - this.object.position.z), 0.01);

        return sphere
    }

    moviment() {

        if (!this.fall) {
            switch (this.dirMoviment) {
                case "vertical":
                    this.object.translateX(this.speed)
                    break;
                case "horizontal":
                    this.object.translateZ(this.speed * 0.2 * this.direction)
                    break;
                case "diagonal":
                    this.object.translateX(this.speed)
                    this.object.translateZ(this.speed * 0.4 * this.direction)
                    break;
                case "arco":
                    this.object.translateX(this.speed * 0.6)
                    this.object.translateZ(Math.sin(this.object.position.x / 10) * 0.4)
                    break;
                default:
                    break;
            }
        } else {
            this.object.rotateX(degreesToRadians(-0.5));
            this.object.translateY(-0.15)
            this.object.translateZ(-0.15)
            this.object.translateX(this.speed)

        }

    }


}

export { Enemy }
