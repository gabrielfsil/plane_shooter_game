import * as THREE from 'three';
import { GLTFLoader } from '../build/jsm/loaders/GLTFLoader.js';


export function createEnimies(camera) {
    var enimiesGeometry = new THREE.BoxGeometry(6, 6, 6);
    var enimiesMaterial = new THREE.MeshLambertMaterial({ color: "rgb(0,100,100)" });

    var enimies = new THREE.Mesh(enimiesGeometry, enimiesMaterial);

    enimies.position.set(camera.position.x + 120, 10, -30);
    //enimies.position.set(camera.position.x + 120, 10, 30);

    return enimies;
}



   
    

    

