import * as THREE from 'three';
import {
    initRenderer,
    initDefaultBasicLight,
    InfoBox,
    degreesToRadians
} from "../libs/util/util.js";
import KeyboardState from '../libs/util/KeyboardState.js';

var shots = []
var enimies = [];
var boxEnimies = []
var sphereShots = [];

var animationOn = true;


var keyboard = new KeyboardState();

import { createAirplane } from './AirPlane.js';
import { update, MenuGame } from './SceneManager.js';
import { createEnimies } from './Enimies.js';
import { createShot } from './Shot.js';

var scene = new THREE.Scene();
var renderer = initRenderer();
var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(-200, 40, 0);
camera.rotateY(degreesToRadians(-90));
camera.rotateX(degreesToRadians(-40));
initDefaultBasicLight(scene);



var light = new THREE.SpotLight(0xfff);
light.position.set(-250, 40, 0);
light.castShadow = true;
scene.add(light)




var airplane = createAirplane();
scene.add(airplane);


function genereteEnimies() {

    return setInterval(() => {
        var enimie = createEnimies(camera);
        var boundingBox = createBoundingBox(enimie);
        var speedEnimies = - Math.random() * 0.4 - 0.2
        scene.add(enimie);
        boxEnimies.push(boundingBox);
        enimies.push({ enimie, speed: speedEnimies });
    }, 3000)

}

var loopEnimies = genereteEnimies()

function initialState() {
    camera.position.set(camera.position.x, 40, 0);
    airplane.position.set(airplane.position.x, 10, 0);
    animationOn = true;
    light.position.set(light.position.x, 40, 0);
    loopEnimies = genereteEnimies();
    menu.style.display = "none"
}

function createBoundingBox(box) {

    let boundingBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
    boundingBox.setFromObject(box);

    return boundingBox

}

function createBoundingSpheres(sphere) {

    let boundingSpheres = new THREE.Sphere(sphere.position, 0.6)

    return boundingSpheres

}


var boxAirplane = createBoundingBox(airplane);

var menu = MenuGame(initialState)

function keyboardUpdate() {

    keyboard.update();

    var speed = 0.8;

    if (animationOn) {

        if (airplane.position.x - camera.position.x < 80) {
            if (keyboard.pressed("up")) airplane.translateY(-speed)
        }
        if (airplane.position.x - camera.position.x > 20) {
            if (keyboard.pressed("down")) airplane.translateY(speed);
        }
        if (airplane.position.z - camera.position.z < 28) {

            if (keyboard.pressed("right")) airplane.translateZ(speed);
        }
        if (airplane.position.z - camera.position.z > -28) {

            if (keyboard.pressed("left")) airplane.translateZ(-speed)
        }
        if (keyboard.down("space") || keyboard.down("ctrl")) {

            var sphere = createShot(airplane.position);
            var boundingSphere = createBoundingSpheres(sphere);
            scene.add(sphere)
            shots.push(sphere)
            sphereShots.push(boundingSphere);

        }
    }


}



function enimiesManager() {

    for (var i = 0; i < enimies.length; i++) {

        if (enimies[i].enimie.position.x - camera.position.x > 20) {

            if (animationOn) {
                enimies[i].enimie.translateX(enimies[i].speed)
            }
        } else {
            scene.remove(enimies[i].enimie);
            enimies.splice(i, 1)
            boxEnimies.splice(i, 1)
        }
    }
}


function gameOver(indexEnimies) {
    animation1();
    clearInterval(loopEnimies);
    animationOn = false;



    setTimeout(() => {

        menu.style.display = "grid";
        scene.remove(enimies[indexEnimies].enimie);
        enimies.splice(indexEnimies, 1)
        boxEnimies.splice(indexEnimies, 1);

    }, 3000);

}


function animation1(enimie) {
    if (!animationOn) {
        enimie.rotation.y += 0.05
    }
}

function animation2(x, y, z, size) {
    var bulbGeometry = new THREE.SphereGeometry(0.5, 16, 8);
    var bulbLight = new THREE.PointLight(0x2b88a1, 1, 100, 2);
    var bulbMat = new THREE.MeshStandardMaterial({
        emissive: 0xfd9000,
        emissiveIntensity: 10,
        color: 0x000000
    });
    bulbLight.add(new THREE.Mesh(bulbGeometry, bulbMat));
    bulbLight.castShadow = true;
    bulbLight.position.set(x, y, z);
    scene.add(bulbLight);

    var lightInterval = setInterval(() => {
        bulbLight.scale.setScalar(size)
        size += 1
    }, 100);

    setTimeout(() => {
        clearInterval(lightInterval);
        scene.remove(bulbLight);
    }, 300)

}


function animate() {

    if (animationOn) {

        boxAirplane.copy(airplane.geometry.boundingBox).applyMatrix4(airplane.matrixWorld);

        for (var i = 0; i < boxEnimies.length; i++) {

            boxEnimies[i].copy(enimies[i].enimie.geometry.boundingBox).applyMatrix4(enimies[i].enimie.matrixWorld)

            if (boxEnimies[i].intersectsBox(boxAirplane)) {

                gameOver(i);

            }

        }
        var speedShot = 1;


        if (shots.length > 0) {
            for (var i = 0; i < sphereShots.length; i++) {

                if (shots[i].position.x - camera.position.x < 120) {
                    if (shots[i].geometry.boundingSphere === null) {
                        shots[i].geometry.computeBoundingSphere();
                    } else {
                        sphereShots[i].copy(shots[i].geometry.boundingSphere).applyMatrix4(shots[i].matrixWorld)
                    }
                    shots[i].translateX(speedShot);

                } else {

                    scene.remove(shots[i]);
                    sphereShots.splice(i, 1);
                    shots.splice(i, 1);
                }

            }
        }
    } else {

        for (var i = 0; i < boxEnimies.length; i++) {

            if (boxEnimies[i].intersectsBox(boxAirplane)) {
                animation1(enimies[i].enimie)
            }

        }
    }

}


function collisionManager() {
    var removeEnimies = [];
    var removeShots = [];

    for (var i = 0; i < boxEnimies.length; i++) {

        for (var j = 0; j < sphereShots.length; j++) {

            if (sphereShots[j]) {
                if (boxEnimies[i].intersectsSphere(sphereShots[j])) {

                    animation2(enimies[i].enimie.position.x, enimies[i].enimie.position.y, enimies[i].enimie.position.z, 0.02);
                    removeEnimies.push(i);
                    removeShots.push(j);

                }

            }
        }
    }

    for (var i = 0; i < removeEnimies.length; i++) {
        scene.remove(enimies[removeEnimies[i]].enimie);
        boxEnimies.splice(removeEnimies[i], 1);
        enimies.splice(removeEnimies[i], 1);
    }

    for (var i = 0; i < removeShots.length; i++) {
        scene.remove(shots[removeShots[i]]);
        sphereShots.splice(removeShots[i], 1);
        shots.splice(removeShots[i], 1);
    }

}

var controls = new InfoBox();
controls.add("Plane Short");
controls.addParagraph();
controls.add("Up arrow move to up")
controls.add("Down arrow move to down")
controls.add("Left arrow move to left")
controls.add("Right arrow move to right")
controls.add("Space or Ctrl dispatch shot")
controls.show();

render();
function render() {
    collisionManager();
    keyboardUpdate();
    enimiesManager();
    animate();
    update(camera, airplane, scene, light, animationOn);
    requestAnimationFrame(render);
    renderer.render(scene, camera)
}