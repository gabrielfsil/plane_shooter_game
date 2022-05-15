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
camera.position.set(-200, 40, 0);
camera.rotateY(degreesToRadians(-90));
camera.rotateX(degreesToRadians(-40));
initDefaultBasicLight(scene);

var animationOn = true;

var light = new THREE.SpotLight(0xfff);
light.position.set(-250, 40, 0);
light.castShadow = true;
scene.add(light)


var airplane = createAirplane();
scene.add(airplane);

function keyboardUpdate() {

    keyboard.update();

    var speed = 0.5

    if (keyboard.pressed("up")) airplane.translateY(-speed);
    if (keyboard.pressed("down")) airplane.translateY(speed);
    if (keyboard.pressed("left")) airplane.translateZ(-speed);
    if (keyboard.pressed("right")) airplane.translateZ(speed);
}

var controls = new InfoBox();
controls.add("Plane Short");
controls.show();

render();
function render() {
    keyboardUpdate()
    update(camera, airplane, scene, light, animationOn);
    requestAnimationFrame(render);
    renderer.render(scene, camera)
}