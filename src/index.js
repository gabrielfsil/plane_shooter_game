import * as THREE from 'three';
import {
    initRenderer,
    initDefaultBasicLight,
    InfoBox,
    degreesToRadians
} from "../libs/util/util.js";
import KeyboardState from '../libs/util/KeyboardState.js'

var keyboard = new KeyboardState();

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


let plane = createGroundPlaneWired(2000, 300, 100, 10);
scene.add(plane);

var airplane = createAirplane();
scene.add(airplane);

function keyboardUpdate() {

    keyboard.update();

    var speed = 0.5

    // if(airplane.position.x < (camera.position.y + 30)){

    if (keyboard.pressed("up")) {
        console.log(`${Math.sqrt(Math.pow(airplane.position.x - camera.position.x, 2))}`)
        airplane.translateY(-speed)
    };


    if (keyboard.pressed("down")) airplane.translateY(speed);
    if (keyboard.pressed("left")) airplane.translateZ(-speed);
    if (keyboard.pressed("right")) airplane.translateZ(speed);
}

var controls = new InfoBox();
controls.add("Plane Short");
controls.show();

render();
airplane.rotation.x += 0.05;
airplane.rotation.z += 0.05;
function render() {
    keyboardUpdate()
    update(camera, airplane, scene, animationOn);
    requestAnimationFrame(render);
    renderer.render(scene, camera)
}