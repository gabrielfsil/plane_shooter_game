import * as THREE from 'three';
import Stats from '../build/jsm/libs/stats.module.js';
import {
    initRenderer,
    InfoBox,
    degreesToRadians
} from "../libs/util/util.js";
import KeyboardState from '../libs/util/KeyboardState.js';
import { GLTFLoader } from '../build/jsm/loaders/GLTFLoader.js'

const container = document.getElementById('container');
const stats = new Stats();
container.appendChild(stats.dom);

var shots = []
var missiles = []
var enimies = [];
var enemiesGround = [];
var sphereShots = [];

var dirMoviment = ["horizontal", "vertical", "diagonal", "arco"]
var animationOn = true;


import { Airplane } from './AirPlane.js';
import { update, MenuGame, HealthBar } from './SceneManager.js';
import { Enemy, createEnimies } from './Enimies.js';
import { createShot } from './Shot.js';
import { EnemiesGround } from './EnemiesGround.js';


var scene = new THREE.Scene();
var renderer = initRenderer();
var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(-200, 40, 0);
camera.rotateY(degreesToRadians(-90));
camera.rotateX(degreesToRadians(-40));

let dirLight = new THREE.DirectionalLight("rgb(255,255,255)")

var helperGeometry = new THREE.BoxGeometry(6, 6, 6);
var helperMaterial = new THREE.MeshLambertMaterial({ color: "rgb(100,100,100)" });

var helper = new THREE.Mesh(helperGeometry, helperMaterial);

helper.position.set(-120, 50, 50)


dirLight.castShadow = true;

dirLight.shadow.mapSize.width = 256
dirLight.shadow.mapSize.height = 256
dirLight.shadow.camera.near = 0.1
dirLight.shadow.camera.far = 100
dirLight.shadow.camera.left = -70
dirLight.shadow.camera.right = 60
dirLight.shadow.camera.bottom = -60
dirLight.shadow.camera.top = 40

// let spotHelper = new THREE.CameraHelper(dirLight.shadow.camera, 0xFF8C00);
// scene.add(spotHelper);
// inimigo trajado_vertical1

let loader = new GLTFLoader();






helper.add(dirLight);

scene.add(helper);

var target = new THREE.Object3D()
target.position.set(-120, -10, -0)
dirLight.target = target
scene.add(target)
// class Position {
//     constructor(x,y,z) {
//         this.x = x;
//         this.y = y;
//         this.z = z;
//     }

// }

// const position_vertical = new Position(120,10,30);

// var enimie = createEnimies(camera);
// var boundingBox = createBoundingBox(enimie);
// scene.add(enimie);
// var speedEnimies = -0.4
// boxEnimies.push(boundingBox);
// enimies.push({ enimie, speed: speedEnimies });





//var enimie = createEnimies(camera);
// var boundingBox = createBoundingBox(enimie);
// scene.add(enimie);
//     var speedEnimies = -0.4 
//     boxEnimies.push(boundingBox);
//     enimies.push({ enimie, speed: speedEnimies });





export function createBoundingBox(box) {

    let boundingBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());

    boundingBox.setFromObject(box);


    return boundingBox

}


var airplane = new Airplane();
const gltfLoader = new GLTFLoader();

gltfLoader.load('./assets/airplane.glb', (gltf) => {

    let object = gltf.scene;
    object.rotateY(degreesToRadians(180));
    object.scale.set(0.6, 0.6, 0.6)
    object.traverse(function (child) {
        if (child) {
            child.castShadow = true;
        }
    })
    airplane.object.add(object);
});

scene.add(airplane.object);

function genereteEnimies() {

    return setInterval(() => {

        var speedEnimies = - Math.random() * 0.4 - 0.2

        let indexMoviment = Math.floor(Math.random() * 4)
        var enemy = new Enemy(camera, dirMoviment[indexMoviment], speedEnimies);

        if ( indexMoviment === 1 || indexMoviment === 2) {
            loader.load('./assets/airplane/scene.gltf', (gltf) => {

                let object = gltf.scene;
                object.traverse(function (child) {
                    if (child) {
                        child.castShadow = true;
                    }
                })
                
                enemy.object.add(object)
            });
        } else {

            loader.load("./assets/fighter.glb", function (gltf) {
                let object = gltf.scene;
                object.traverse(function (child) {
                    if (child) {
                        child.castShadow = true;
                    }
                })
                object.rotateY(degreesToRadians(-90))
                enemy.object.add(object)
            }, null, null);
        }

        scene.add(enemy.object);
        enimies.push(enemy);
    }, 3000)

}

function genereteEnemiesGround() {
    return setInterval(() => {
        var enimie = new EnemiesGround(camera);
        loader.load("./assets/toon_tank.glb", function (gltf) {
            let object = gltf.scene;
            object.traverse(function (child) {
                if (child) {
                    child.castShadow = true;
                }
            })
            object.rotateY(degreesToRadians(-90))
            enimie.object.add(object)
        }, null, null);

        scene.add(enimie.object);
        enemiesGround.push(enimie);

    }, 6000)
}

function genereteMissiles() {

    return setInterval(() => {
        if (enemiesGround.length > 0) {

            let index = Math.floor(Math.random() + enemiesGround.length - 1);

            let missile = enemiesGround[index].shot(airplane.object.position.x, airplane.object.position.y, airplane.object.position.z);

            missiles.push(missile)
            scene.add(missile.object);
        }

    }, 2000)

}

var loopEnimies = genereteEnimies()
var loopEnemiesGround = genereteEnemiesGround()
var loopMissiles = genereteMissiles();

function initialState() {
    camera.position.set(camera.position.x, 40, 0);
    airplane.object.position.set(airplane.object.position.x, 10, 0);
    animationOn = true;
    loopEnimies = genereteEnimies();
    menu.style.display = "none"
    healthbar.style.display = 'flex'
}

var menu = MenuGame(initialState)
var healthbar = HealthBar()

let health = document.getElementById("health")

health.onclick = function() {
    health.value -= 20;

}

function missilesManager() {

    for (var i = 0; i < missiles.length; i++) {

        if ((airplane.object.position.x - camera.position.x < 80) && (airplane.object.position.x - camera.position.x > 20) && (missiles[i].object.position.z - camera.position.z < 35) && (missiles[i].object.position.z - camera.position.z > -35)) {
            missiles[i].moviment()
        } else {
            scene.remove(missiles[i].object);
            enemiesGround.splice(i, 1)
        }
    }


}

function enimiesManager() {

    for (var i = 0; i < enimies.length; i++) {

        if (enimies[i].object.position.x - camera.position.x > 20) {

            if (animationOn) {

                enimies[i].moviment()
            }
        } else {
            scene.remove(enimies[i].object);
            enimies.splice(i, 1)
        }
    }

    for (var i = 0; i < enemiesGround.length; i++) {

        if (!(enemiesGround[i].object.position.x - camera.position.x > 20)) {

            scene.remove(enemiesGround[i].object);
            enemiesGround.splice(i, 1)
        }
    }
}


function gameOver(indexEnimies) {
    animation1();
    clearInterval(loopEnimies);
    clearInterval(loopEnemiesGround);
    clearInterval(loopMissiles);
    animationOn = false;


    for (var i = 0; i < enimies.length; i++) {

        scene.remove(enimies[i].enemie)
    }

    enimies = []


    setTimeout(() => {

        menu.style.display = "grid";
        scene.remove(enimies[indexEnimies].enimie);
        enimies.splice(indexEnimies, 1)

    }, 3000);

}


function animation1(enimie) {
    if (!animationOn) {
        enimie.rotation.y += 0.05
    }
}

function animation2(x, y, z, size) {

}


function animate() {

    if (animationOn) {

        for (var i = 0; i < missiles.length; i++) {
            missiles[i].bounding.copy(missiles[i].object.geometry.boundingBox).applyMatrix4(missiles[i].object.matrixWorld);
        }

        airplane.bounding.copy(airplane.object.geometry.boundingBox).applyMatrix4(airplane.object.matrixWorld);

        for (var i = 0; i < enimies.length; i++) {

            enimies[i].bounding.copy(enimies[i].object.geometry.boundingBox).applyMatrix4(enimies[i].object.matrixWorld)

            if (enimies[i].bounding.intersectsBox(airplane.bounding)) {

                // gameOver(i);
                airplane.addBreadown(2);
                console.log("Bateu carai");

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

        for (var i = 0; i < enimies.length; i++) {

            if (enimies[i].bounding.intersectsBox(airplane.bounding)) {
                animation1(enimies[i].object)
            }

        }
    }

}


function collisionManager() {
    var removeEnimies = [];
    var removeShots = [];

    for (var i = 0; i < enimies.length; i++) {

        for (var j = 0; j < sphereShots.length; j++) {

            if (sphereShots[j]) {
                if (enimies[i].bounding.intersectsSphere(sphereShots[j])) {

                    animation2(enimies[i].object.position.x, enimies[i].object.position.y, enimies[i].object.position.z, 0.02);
                    removeEnimies.push(i);
                    removeShots.push(j);

                }

            }
        }
    }

    for (var i = 0; i < missiles.length; i++) {
        if (missiles[i].bounding.intersectsBox(airplane.bounding)) {

            // gameOver(i);
            console.log("Booomm")
            airplane.addBreadown(2)

        }


    }

    for (var i = 0; i < removeEnimies.length; i++) {
        scene.remove(enimies[removeEnimies[i]].object);
        enimies.splice(removeEnimies[i], 1);
    }

    for (var i = 0; i < removeShots.length; i++) {
        scene.remove(shots[removeShots[i]]);
        sphereShots.splice(removeShots[i], 1);
        shots.splice(removeShots[i], 1);
    }

}

// var enemyClass = [enemyDiagonal, enemyHorizontal, enemyVertical, enemyArco, enemyTerra, airplane]
// var enemyHp = [1,1,1,1,1,5]
// var enemyStrenght = [1,1,1,1,2,1]
var airplaneIsDead = false
var airplaneHitPoints
var Strenght = 1



function fight() {
    if (airplaneHitPoints > 0) {
        airplaneHitPoints = airplaneHitPoints - Strenght
        document.getElementById("airplaneHp").innerHTML = airplaneHitPoints
    }
    else if (!airplaneIsDead) {
        airplaneHitPoints = 0
        airplaneIsDead = true
        document.getElementById("airplaneHp").innerHTML = airplaneHitPoints
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
    stats.update();
    collisionManager();

    airplane.moviment(animationOn, camera)
    airplane.shot(scene, shots, sphereShots)

    enimiesManager();
    missilesManager();
    animate();
    // fight();
    update(camera, airplane.object, scene, helper, animationOn, target);
    requestAnimationFrame(render);
    renderer.render(scene, camera);

}