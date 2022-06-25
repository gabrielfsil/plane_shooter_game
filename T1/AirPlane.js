import * as THREE from 'three';
import {
    degreesToRadians
} from "../libs/util/util.js";
import {GLTFLoader} from '../build/jsm/loaders/GLTFLoader'



export function createAirplane(scene) {
    // var airPlaneGeometry = new THREE.CylinderGeometry(1, 0, 5, 32);
    // var airPlaneMaterial = new THREE.MeshLambertMaterial({ color: "rgb(200,0,0)" });

    var airplane

    airplane.position.set(-170, 10, 0);
    airplane.rotateZ(degreesToRadians(90));

    // airplane image
    let loadedModel;
    const gltfLoader = new GLTFLoader();
    gltfLoader.load('./assets/airplane/airplaneGood/', (gltfScene) => {

    gltfScene.scene.rotation.y = Math.PI / 24;
    gltfScene.scene.position.y = 6;
    gltfScene.scene.scale.set(3,3,3);
    scene.add(gltfScene.scene);
    airplane = gltfScene
    });

    
    return airplane;
    

}

