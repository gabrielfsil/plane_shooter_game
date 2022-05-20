import * as THREE from 'three';
import {
    degreesToRadians
} from "../libs/util/util.js";



export function createAirplane() {
    var airPlaneGeometry = new THREE.CylinderGeometry(1, 0, 5, 32);
    var airPlaneMaterial = new THREE.MeshLambertMaterial({ color: "rgb(200,0,0)" });

    var airplane = new THREE.Mesh(airPlaneGeometry, airPlaneMaterial);

    airplane.position.set(-170, 10, 0);
    airplane.rotateZ(degreesToRadians(90));

    return airplane;
}

export function createCollisionAirplane(airplane) {
    // cube Bounding Box
    let cubeAirplane = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
    cubeAirplane.setFromObject(airplane);

    return cubeAirplane

}