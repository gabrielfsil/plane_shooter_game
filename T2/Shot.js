import * as THREE from 'three'
import { createBoundingSpheres } from './AirPlane.js';


export function createShot(position) {
    var shotGeometry = new THREE.SphereGeometry(0.4, 8, 6);
    var shotMaterial = new THREE.MeshLambertMaterial({ color: 'red' });
    var sphere = new THREE.Mesh(shotGeometry, shotMaterial);

    sphere.position.set(position.x, position.y, position.z);

    return sphere
}


class Shot {

    constructor(position, direction, speed = 1) {
        var shotGeometry = new THREE.SphereGeometry(0.4, 8, 6);
        var shotMaterial = new THREE.MeshLambertMaterial({ color: 'orange' });
        this.object = new THREE.Mesh(shotGeometry, shotMaterial);
        this.bounding = createBoundingSpheres(this.object)
        this.object.position.set(position.x, position.y, position.z);
        this.direction = direction
        this.speed = speed
        return this
    }

    moviment() {

        this.object.translateOnAxis(this.direction, this.speed)
    }
}

export { Shot }