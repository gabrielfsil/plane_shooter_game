import * as THREE from 'three';
import { createBoundingBox } from './index.js';

import { GLTFLoader } from '../build/jsm/loaders/GLTFLoader.js';


export function createEnimies(camera) {
    var enimiesGeometry = new THREE.BoxGeometry(6, 6, 6);
    var enimiesMaterial = new THREE.MeshLambertMaterial({ color: "rgb(0,100,100)" });

    var enimies = new THREE.Mesh(enimiesGeometry, enimiesMaterial);
    enimies.castShadow = false
    enimies.position.set(camera.position.x + 120, 10, Math.floor(Math.random() * 52 - 26));

    enimies.position.set(camera.position.x + 120, 10, -30);
    //enimies.position.set(camera.position.x + 120, 10, 30);

    return enimies;
}


class Enemy {

    constructor(camera, dirMoviment, speed) {

        var enimiesGeometry = new THREE.BoxGeometry(6, 6, 6);
        var enimiesMaterial = new THREE.MeshLambertMaterial({ transparent: true, opacity: 0 });

        this.object = new THREE.Mesh(enimiesGeometry, enimiesMaterial);
        

        let zPosition = Math.floor(Math.random() * 52 - 26)
        this.object.position.set(camera.position.x + 150, 10, zPosition);
        this.bounding = createBoundingBox(this.object);

        this.dirMoviment = dirMoviment
        this.speed = speed
        this.direction = zPosition > 0 ? 1 : -1

        return this;
    }

    add(object) {

        this.object = object
    }

    moviment() {

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
    }
}

export { Enemy }
