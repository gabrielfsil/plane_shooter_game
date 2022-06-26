import * as THREE from 'three';
import Stats from '../build/jsm/libs/stats.module.js';
import {
    initRenderer,
    InfoBox,
    degreesToRadians
} from "../libs/util/util.js";
import { GLTFLoader } from '../build/jsm/loaders/GLTFLoader.js'

const container = document.getElementById('container');
const stats = new Stats();
container.appendChild(stats.dom);

var shots = []
var missiles = []
var enimies = [];
var enemiesGround = [];
var enemiesShots = []
var bombs = []

var dirMoviment = ["horizontal", "vertical", "diagonal", "arco"]
var animationOn = true;


import { Airplane } from './AirPlane.js';
import { update, MenuGame, HealthBar } from './SceneManager.js';
import { Enemy } from './Enimies.js';
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
        if (animationOn) {
            var speedEnimies = - Math.random() * 0.4 - 0.2

            let indexMoviment = Math.floor(Math.random() * 4)
            var enemy = new Enemy(camera, dirMoviment[indexMoviment], speedEnimies);

            if (indexMoviment === 1 || indexMoviment === 2) {
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
            console.log("Inimigo de ar")
        }
    }, 4000)

}

function genereteEnemiesGround() {
    return setInterval(() => {
        if (animationOn) {
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
            console.log("Inimigo de solo")

        }
    }, 6000)
}

function genereteShotEnemies() {

    return setInterval(() => {
        if (animationOn) {

            if (enimies.length > 0) {

                let index = Math.floor(Math.random() + enimies.length - 1);

                let shot = enimies[index].shot(airplane.object.position.x, airplane.object.position.y, airplane.object.position.z);

                enemiesShots.push(shot);
                scene.add(shot.object);
            }
        }

    }, 4000)

}

function genereteMissiles() {

    return setInterval(() => {
        if (animationOn) {

            if (enemiesGround.length > 0) {

                let index = Math.floor(Math.random() + enemiesGround.length - 1);

                let missile = enemiesGround[index].shot(airplane.object.position.x, airplane.object.position.y, airplane.object.position.z);

                missiles.push(missile)
                scene.add(missile.object);
            }
        }

    }, 2000)

}

var loopEnimies = genereteEnimies()
var loopEnemiesGround = genereteEnemiesGround()
var loopMissiles = genereteMissiles();
var loopShotEnemies = genereteShotEnemies();

function initialState() {
    camera.position.set(camera.position.x, 40, 0);
    airplane.restart(camera)
    animationOn = true;

    for (var i = 0; i < enemiesGround.length; i++) {
        scene.remove(enemiesGround[i].object);
    }

    for (var i = 0; i < enimies.length; i++) {
        scene.remove(enimies[i].object);
    }

    enemiesGround = []
    enimies = []
    clearInterval(loopEnimies);
    clearInterval(loopEnemiesGround);
    clearInterval(loopMissiles);
    clearInterval(loopShotEnemies);
    loopEnimies = genereteEnimies();
    loopEnemiesGround = genereteEnemiesGround()
    loopMissiles = genereteMissiles();
    loopShotEnemies = genereteShotEnemies();
    menu.style.display = "none"
    healthbar.style.display = "block"
}

var menu = MenuGame(initialState)

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

        if (enimies[i].object.position.x - camera.position.x > 0 && enimies[i].object.position.y > -10) {

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
            enemiesGround.splice(i, 1);
        } else {
            enemiesGround[i].moviment()
        }
    }
}


function gameOver() {
    animation1();
    clearInterval(loopEnimies);
    clearInterval(loopEnemiesGround);
    clearInterval(loopMissiles);
    clearInterval(loopShotEnemies);
    animationOn = false;


    for (var i = 0; i < enimies.length; i++) {

        scene.remove(enimies[i].object)
    }

    enimies = []


    setTimeout(() => {

        menu.style.display = "grid";

    }, 1000);

}


function animation1(enimie) {
    if (!animationOn) {
        airplane.drop()
    }
}


function animate() {

    animationOn = airplane.breakdown < 5;
    var removeEnimies = [];

    if (animationOn) {

        for (var i = 0; i < missiles.length; i++) {
            missiles[i].bounding.copy(missiles[i].object.geometry.boundingBox).applyMatrix4(missiles[i].object.matrixWorld);
        }

        airplane.bounding.copy(airplane.object.geometry.boundingBox).applyMatrix4(airplane.object.matrixWorld);

        for (var i = 0; i < enimies.length; i++) {

            enimies[i].bounding.copy(enimies[i].object.geometry.boundingBox).applyMatrix4(enimies[i].object.matrixWorld)

            if (enimies[i].bounding.intersectsBox(airplane.bounding) && enimies[i].active) {

                airplane.addBreadown(2);
                enimies[i].active = false
                enimies[i].drop()
                console.log("Bateu carai")

            }

        }

        for (var i = 0; i < enemiesGround.length; i++) {

            enemiesGround[i].bounding.copy(enemiesGround[i].object.geometry.boundingBox).applyMatrix4(enemiesGround[i].object.matrixWorld)

        }

        for (var i = 0; i < removeEnimies.length; i++) {
            scene.remove(enimies[removeEnimies[i]].object);
            enimies.splice(removeEnimies[i], 1);
        }

    } else {
        gameOver()

    }

}

function shotsManager() {

    var shot = airplane.shot();
    var bomb = airplane.launch();

    if (shot) {
        scene.add(shot.object);
        shots.push(shot);
    }

    if (bomb) {
        scene.add(bomb.object);
        bombs.push(bomb);
    }

    if (shots.length > 0) {
        for (var i = 0; i < shots.length; i++) {

            if (shots[i].object.position.x - camera.position.x < 120) {
                if (shots[i].object.geometry.boundingSphere === null) {
                    shots[i].object.geometry.computeBoundingSphere();
                } else {
                    shots[i].bounding.copy(shots[i].object.geometry.boundingSphere).applyMatrix4(shots[i].object.matrixWorld)
                }
                shots[i].moviment();

            } else {

                scene.remove(shots[i].object);
                shots.splice(i, 1);
            }

        }
    }

    if (bombs.length > 0) {
        for (var i = 0; i < bombs.length; i++) {

            if (bombs[i].object.position.y > -10) {
                if (bombs[i].object.geometry.boundingSphere === null) {
                    bombs[i].object.geometry.computeBoundingSphere();
                } else {
                    bombs[i].bounding.copy(bombs[i].object.geometry.boundingBox).applyMatrix4(bombs[i].object.matrixWorld)
                }
                bombs[i].moviment();

            } else {

                scene.remove(bombs[i].object);
                bombs.splice(i, 1);
            }

        }
    }

    if (enemiesShots.length > 0) {

        for (var i = 0; i < enemiesShots.length; i++) {

            if (enemiesShots[i].object.position.x - camera.position.x > 0) {
                if (enemiesShots[i].object.geometry.boundingSphere === null) {
                    enemiesShots[i].object.geometry.computeBoundingSphere();
                } else {
                    enemiesShots[i].bounding.copy(enemiesShots[i].object.geometry.boundingSphere).applyMatrix4(enemiesShots[i].object.matrixWorld)
                }
                enemiesShots[i].moviment();

            } else {

                scene.remove(enemiesShots[i].object);
                enemiesShots.splice(i, 1);
            }

        }
    }
}


function collisionManager() {
    var removeEnimies = [];
    var removeShots = [];
    var removeEnemiesShots = [];
    var removeMissiles = [];

    for (var i = 0; i < enimies.length; i++) {

        for (var j = 0; j < shots.length; j++) {

            if (shots[j]) {
                if (enimies[i].bounding.intersectsSphere(shots[j].bounding)) {
                    enimies[i].drop()
                    removeShots.push(j);

                }

            }
        }
    }

    for (var i = 0; i < enemiesShots.length; i++) {
        if (enemiesShots[i]) {
            if (airplane.bounding.intersectsSphere(enemiesShots[i].bounding)) {
                removeEnemiesShots.push(i);
                airplane.addBreadown(1);
                console.log("Tiro de inimigo no ar")

            }
        }
    }

    for (var i = 0; i < missiles.length; i++) {
        if (missiles[i].bounding.intersectsBox(airplane.bounding)) {
            removeMissiles.push(i);
            airplane.addBreadown(2);
            console.log("Boom")

        }
    }



    for (var j = 0; j < bombs.length; j++) {
        for (var i = 0; i < enemiesGround.length; i++) {

            if (bombs[j]) {
                if (enemiesGround[i].bounding.intersectsBox(bombs[j].bounding)) {
                    enemiesGround[i].drop()

                }

            }
        }
    }

    for (var i = 0; i < removeEnimies.length; i++) {
        scene.remove(enimies[removeEnimies[i]].object);
        enimies.splice(removeEnimies[i], 1);
    }

    for (var i = 0; i < removeMissiles.length; i++) {
        scene.remove(missiles[removeMissiles[i]].object);
        missiles.splice(removeMissiles[i], 1);
    }

    for (var i = 0; i < removeShots.length; i++) {
        scene.remove(shots[removeShots[i]].object);
        shots.splice(removeShots[i], 1);
    }

    for (var i = 0; i < removeEnemiesShots.length; i++) {
        scene.remove(enemiesShots[removeEnemiesShots[i]].object);
        enemiesShots.splice(removeEnemiesShots[i], 1);
    }

}

var healthbar = HealthBar()

let health = document.getElementById("health")

health.onclick = function () {
    health.value -= 20;

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


    enimiesManager();
    missilesManager();
    shotsManager()
    animate();
    // fight();
    update(camera, airplane.object, scene, helper, animationOn, target);
    requestAnimationFrame(render);
    renderer.render(scene, camera);

}