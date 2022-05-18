import * as THREE from 'three';
import {
    degreesToRadians
} from "../libs/util/util.js";



export function createEnimies() {
    var enimiesGeometry = new THREE.BoxGeometry(5, 5, 3);
    var enimiesMaterial = new THREE.MeshLambertMaterial({ color: "rgb(0,100,100)" });
    
    var enimies = new THREE.Mesh(enimiesGeometry, enimiesMaterial);
    
    enimies.position.set(-Math.floor(Math.random()*100), 10, Math.floor(Math.random()*100));      
    
    return enimies;
}
