import * as THREE from 'three';
import {
    initRenderer,
    initDefaultBasicLight,
    InfoBox,
    createGroundPlaneWired,
    degreesToRadians
} from "../libs/util/util.js";

import { createAirplane } from './AirPlane.js';
import { update } from './SceneManager.js';

var scene = new THREE.Scene();   
var renderer = initRenderer();   
var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000); 
camera.position.set(-1000, 40, 0);
camera.rotateY(degreesToRadians(-90));
camera.rotateX(degreesToRadians(-40));
initDefaultBasicLight(scene);

var animationOn = true;


var createLight = function() {
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(10, 20, 20);
    spotLight.castShadow = true;
    scene.add(spotLight)
}
var createLight = createLight();


let plane = createGroundPlaneWired(2000, 200, 100, 10);
scene.add(plane);

var airplane = createAirplane();
scene.add(airplane);

var controls = new InfoBox();
controls.add("Plane Short");
controls.show();

render();
airplane.rotation.x += 0.05;
airplane.rotation.z += 0.05;
function render() {
    update(camera, airplane, animationOn);
    requestAnimationFrame(render);
    renderer.render(scene, camera) 
}