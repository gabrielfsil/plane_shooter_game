import * as THREE from 'three';
import { createBoundingBox } from './index.js';



class Health{

    constructor(camera){

        var enimiesGeometry = new THREE.BoxGeometry(4, 4, 6);
        var enimiesMaterial = new THREE.MeshLambertMaterial();

        this.object = new THREE.Mesh(enimiesGeometry, enimiesMaterial);

        // let zPosition = Math.floor(Math.random() * 52 - 26)
        let zPosition = 0
        this.object.position.set(camera.position.x + 150, 10, zPosition);
        this.bounding = createBoundingBox(this.object);

        return this;
    }


}

export { Health }