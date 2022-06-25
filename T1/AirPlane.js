import * as THREE from 'three';
import {
    degreesToRadians
} from "../libs/util/util.js";



export function createAirplane() {
    var airPlaneGeometry = new THREE.CylinderGeometry(1, 0, 5, 32);
    var airPlaneMaterial = new THREE.MeshPhongMaterial({ color: "rgb(200,0,0)", shininess: "200", specular: "rgb(250,250,250)" });

    var airplane = new THREE.Mesh(airPlaneGeometry, airPlaneMaterial);

    airplane.position.set(-170, 10, 0);
    airplane.rotateZ(degreesToRadians(90));
    airplane.castShadow = true;

    return airplane;
}

