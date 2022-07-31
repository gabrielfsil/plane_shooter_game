import * as THREE from "three";
import Stats from "../build/jsm/libs/stats.module.js";
import { initRenderer, InfoBox, degreesToRadians } from "../libs/util/util.js";
import { GLTFLoader } from "../build/jsm/loaders/GLTFLoader.js";

const container = document.getElementById("container");
const stats = new Stats();
container.appendChild(stats.dom);

var shots = [];
var missiles = [];
var enimies = [];
var enemiesGround = [];
var enemiesShots = [];
var bombs = [];
var healths = [];

var dirMoviment = ["horizontal", "vertical", "diagonal", "arco"];
var animationOn = false;

import { Airplane } from "./AirPlane.js";
import { update, MenuGame, HealthBar, StartGame } from "./SceneManager.js";
import { Enemy } from "./Enimies.js";
import { EnemiesGround } from "./EnemiesGround.js";
import { Health } from "./Health.js";
import { Bomb } from "./Bomb.js";

var scene = new THREE.Scene();
var renderer = initRenderer();
var camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
// camera.position.set(-300, 40, 0);
camera.position.set(-200, 40, 0);
camera.rotateY(degreesToRadians(-90));
camera.rotateX(degreesToRadians(-40));

const listener = new THREE.AudioListener();
camera.add(listener);

const audioLoader = new THREE.AudioLoader();

const backgroundSound = new THREE.Audio(listener);

audioLoader.load("./assets/sounds/sampleMusic.mp3", function (buffer) {
  backgroundSound.setBuffer(buffer);
  backgroundSound.setLoop(true);
  backgroundSound.setVolume(0.2);
  backgroundSound.play();
});

let dirLight = new THREE.DirectionalLight("rgb(255,255,255)");

var helperGeometry = new THREE.BoxGeometry(6, 6, 6);
var helperMaterial = new THREE.MeshLambertMaterial({
  color: "rgb(100,100,100)",
});

var helper = new THREE.Mesh(helperGeometry, helperMaterial);

helper.position.set(-120, 50, 50);

dirLight.castShadow = true;

dirLight.shadow.mapSize.width = 256;
dirLight.shadow.mapSize.height = 256;
dirLight.shadow.camera.near = 0.1;
dirLight.shadow.camera.far = 100;
dirLight.shadow.camera.left = -70;
dirLight.shadow.camera.right = 60;
dirLight.shadow.camera.bottom = -60;
dirLight.shadow.camera.top = 40;

// let spotHelper = new THREE.CameraHelper(dirLight.shadow.camera, 0xFF8C00);
// scene.add(spotHelper);
// inimigo trajado_vertical1

let loader = new GLTFLoader();

helper.add(dirLight);

scene.add(helper);

var target = new THREE.Object3D();
target.position.set(-120, -10, -0);
dirLight.target = target;
scene.add(target);

import { OBJLoader } from "../build/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "../build/jsm/loaders/MTLLoader.js";
import { getMaxSize } from "../libs/util/util.js";

export function createBoundingSpheres(sphere) {
  let boundingSpheres = new THREE.Sphere(sphere.position, 0.6);

  return boundingSpheres;
}

//teste

let assetManager = {
  plane: null,
  tank: null,
};

var airplane = new Airplane();
loadOBJFile("./assets/airplanetest/", "plane", 10, 0, true, airplane.object);

function fixPosition(obj) {
  // Fix position of the object over the ground plane
  var box = new THREE.Box3().setFromObject(obj);
  if (box.min.y > 0) obj.translateY(-box.min.y);
  else obj.translateY(-1 * box.min.y);
  return obj;
}

function loadOBJFile(
  modelPath,
  modelName,
  desiredScale,
  angle,
  visibility,
  object
) {
  var mtlLoader = new MTLLoader();
  mtlLoader.setPath(modelPath);
  mtlLoader.load(modelName + ".mtl", function (materials) {
    materials.preload();

    var objLoader = new OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.setPath(modelPath);
    objLoader.load(modelName + ".obj", function (obj) {
      obj.visible = visibility;
      obj.name = modelName;
      obj.traverse(function (child) {
        child.castShadow = true;
      });

      obj.traverse(function (node) {
        if (node.material) node.material.side = THREE.DoubleSide;
      });
      var obj = normalizeAndRescale(obj, desiredScale);
      var obj = fixPosition(obj);
      obj.rotateY(degreesToRadians(angle));

      object.add(obj);

      assetManager[modelName] = obj;
    });
  });
}

// Escala

function normalizeAndRescale(obj, newScale) {
  var scale = getMaxSize(obj); //utils.js
  obj.scale.set(
    newScale * (1.0 / scale),
    newScale * (1.0 / scale),
    newScale * (1.0 / scale)
  );
  return obj;
}

export function createBoundingBox(box) {
  let boundingBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());

  boundingBox.setFromObject(box);

  return boundingBox;
}

scene.add(airplane.object);

function genereteEnimies() {
  if (animationOn) {
    return setInterval(() => {
      var speedEnimies = -Math.random() * 0.4 - 0.2;

      let indexMoviment = Math.floor(Math.random() * 4);
      var enemy = new Enemy(camera, dirMoviment[indexMoviment], speedEnimies);

      if (indexMoviment === 2) {
        loader.load("./assets/airplane/scene.gltf", (gltf) => {
          let object = gltf.scene;
          object.traverse(function (child) {
            if (child) {
              child.castShadow = true;
            }
          });

          enemy.object.add(object);
        });
      } else if (indexMoviment === 1) {
        loader.load("./assets/teco-teco.glb", (gltf) => {
          let object = gltf.scene;
          object.traverse(function (child) {
            if (child) {
              child.castShadow = true;
            }
          });
          object.rotateY(degreesToRadians(-90));
          enemy.object.add(object);
        });
      } else {
        loader.load(
          "./assets/fighter.glb",
          function (gltf) {
            let object = gltf.scene;
            object.traverse(function (child) {
              if (child) {
                child.castShadow = true;
              }
            });
            object.rotateY(degreesToRadians(-90));
            enemy.object.add(object);
          },
          null,
          null
        );
      }

      scene.add(enemy.object);
      enimies.push(enemy);
    }, 4000);
  } else {
    clearInterval(loopEnimies);
  }
}

function genereteEnemiesGround() {
  if (animationOn) {
    return setInterval(() => {
      var enimie = new EnemiesGround(camera);
      loadOBJFile("./assets/tank/", "tank", 13, -90, true, enimie.object);
      scene.add(enimie.object);
      enemiesGround.push(enimie);
    }, 6000);
  } else {
    clearInterval(loopEnemiesGround);
  }
}

function genereteShotEnemies() {
  return setInterval(() => {
    if (animationOn) {
      if (enimies.length > 0) {
        let index = Math.floor(Math.random() + enimies.length - 1);

        let shot = enimies[index].shot(
          airplane.object.position.x,
          airplane.object.position.y,
          airplane.object.position.z
        );

        enemiesShots.push(shot);
        scene.add(shot.object);
      }
    }
  }, 4000);
}

function genereteMissiles() {
  return setInterval(() => {
    if (animationOn) {
      if (enemiesGround.length > 0) {
        let index = Math.floor(Math.random() + enemiesGround.length - 1);

        let missile = enemiesGround[index].shot(
          airplane.object.position.x,
          airplane.object.position.y,
          airplane.object.position.z
        );

        missiles.push(missile);
        scene.add(missile.object);
      }
    }
  }, 2000);
}

function genereteHealth() {
  return setInterval(() => {
    if (animationOn) {
      let health = new Health(camera);

      scene.add(health.object);
      healths.push(health);
    }
  }, 10000);
}

var loopEnimies = genereteEnimies();
var loopEnemiesGround = genereteEnemiesGround();
var loopMissiles = genereteMissiles();
var loopShotEnemies = genereteShotEnemies();
var loopHealth = genereteHealth();

function initialState() {
  camera.position.set(camera.position.x, 40, 0);
  airplane.restart(camera);
  animationOn = true;

  for (var i = 0; i < enemiesGround.length; i++) {
    scene.remove(enemiesGround[i].object);
  }

  for (var i = 0; i < enimies.length; i++) {
    scene.remove(enimies[i].object);
  }

  enemiesGround = [];
  enimies = [];
  clearInterval(loopEnimies);
  clearInterval(loopEnemiesGround);
  clearInterval(loopMissiles);
  clearInterval(loopShotEnemies);
  clearInterval(loopHealth);
  loopEnimies = genereteEnimies();
  loopEnemiesGround = genereteEnemiesGround();
  loopMissiles = genereteMissiles();
  loopShotEnemies = genereteShotEnemies();
  loopHealth = genereteHealth();
  menu.style.display = "none";
  healthbar.style.display = "block";
}

function startGame() {
  animationOn = true;
  start.style.display = "none";
  initialState();
}

var menu = MenuGame(initialState);
var start = StartGame(startGame);

function missilesManager() {
  for (var i = 0; i < missiles.length; i++) {
    if (
      airplane.object.position.x - camera.position.x < 80 &&
      airplane.object.position.x - camera.position.x > 20 &&
      missiles[i].object.position.z - camera.position.z < 35 &&
      missiles[i].object.position.z - camera.position.z > -35
    ) {
      missiles[i].moviment();
    } else {
      scene.remove(missiles[i].object);
      missiles.splice(i, 1);
    }
  }
}

function enimiesManager() {
  for (var i = 0; i < enimies.length; i++) {
    if (
      enimies[i].object.position.x - camera.position.x > 0 &&
      enimies[i].object.position.y > -10
    ) {
      if (animationOn) {
        enimies[i].moviment();
      }
    } else {
      scene.remove(enimies[i].object);
      enimies.splice(i, 1);
    }
  }

  for (var i = 0; i < enemiesGround.length; i++) {
    if (enemiesGround[i].object.position.x - camera.position.x > 0) {
      enemiesGround[i].moviment();
    } else {
      scene.remove(enemiesGround[i].object);
      enemiesGround.splice(i, 1);
    }
  }
}

function gameOver() {
  animation1();
  clearInterval(loopEnimies);
  clearInterval(loopEnemiesGround);
  clearInterval(loopMissiles);
  clearInterval(loopShotEnemies);
  clearInterval(loopHealth);
  animationOn = false;

  for (var i = 0; i < enimies.length; i++) {
    scene.remove(enimies[i].object);
  }

  enimies = [];

  setTimeout(() => {
    menu.style.display = "grid";
  }, 1000);
}

function animation1(enimie) {
  if (!animationOn) {
    airplane.drop();
  }
}

function animate() {
  // animationOn = airplane.breakdown < 5;
  var removeEnimies = [];
  var removeHealth = [];

  if (animationOn) {
    for (var i = 0; i < missiles.length; i++) {
      missiles[i].bounding
        .copy(missiles[i].object.geometry.boundingBox)
        .applyMatrix4(missiles[i].object.matrixWorld);
    }

    for (var i = 0; i < healths.length; i++) {
      healths[i].bounding
        .copy(healths[i].object.geometry.boundingBox)
        .applyMatrix4(healths[i].object.matrixWorld);
      if (healths[i].object.position.x - camera.position.x < 0) {
        removeHealth.push(i);
      } else {
        healths[i].moviment();
      }
    }

    airplane.bounding
      .copy(airplane.object.geometry.boundingBox)
      .applyMatrix4(airplane.object.matrixWorld);

    for (var i = 0; i < enimies.length; i++) {
      enimies[i].bounding
        .copy(enimies[i].object.geometry.boundingBox)
        .applyMatrix4(enimies[i].object.matrixWorld);

      if (
        enimies[i].bounding.intersectsBox(airplane.bounding) &&
        enimies[i].active
      ) {
        airplane.addBreakdown(2);
        enimies[i].active = false;
        enimies[i].drop();
      }
    }

    for (var i = 0; i < enemiesGround.length; i++) {
      enemiesGround[i].bounding
        .copy(enemiesGround[i].object.geometry.boundingBox)
        .applyMatrix4(enemiesGround[i].object.matrixWorld);
    }

    for (var i = 0; i < removeEnimies.length; i++) {
      scene.remove(enimies[removeEnimies[i]].object);
      enimies.splice(removeEnimies[i], 1);
    }

    for (var i = 0; i < removeHealth.length; i++) {
      scene.remove(healths[removeHealth[i]].object);
      healths.splice(removeHealth[i], 1);
    }
  }
  if (airplane.breakdown >= 5) {
    gameOver();
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
          shots[i].bounding
            .copy(shots[i].object.geometry.boundingSphere)
            .applyMatrix4(shots[i].object.matrixWorld);
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
        bombs[i].bounding
          .copy(bombs[i].object.geometry.boundingBox)
          .applyMatrix4(bombs[i].object.matrixWorld);

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
          enemiesShots[i].bounding
            .copy(enemiesShots[i].object.geometry.boundingSphere)
            .applyMatrix4(enemiesShots[i].object.matrixWorld);
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
  var removeHealth = [];

  for (var i = 0; i < enimies.length; i++) {
    for (var j = 0; j < shots.length; j++) {
      if (shots[j]) {
        if (enimies[i].bounding.intersectsSphere(shots[j].bounding)) {
          enimies[i].drop();
          enimies[i].active = false;
          removeShots.push(j);
        }
      }
    }
  }

  for (var i = 0; i < enemiesShots.length; i++) {
    if (enemiesShots[i]) {
      if (airplane.bounding.intersectsSphere(enemiesShots[i].bounding)) {
        removeEnemiesShots.push(i);
        airplane.addBreakdown(1);
      }
    }
  }

  for (var i = 0; i < missiles.length; i++) {
    if (missiles[i].bounding.intersectsBox(airplane.bounding)) {
      removeMissiles.push(i);
      airplane.addBreakdown(2);
    }
  }

  for (var i = 0; i < healths.length; i++) {
    if (healths[i].bounding.intersectsBox(airplane.bounding)) {
      removeHealth.push(i);
      airplane.removeBreakdown(1);
    }
  }

  for (var i = 0; i < enemiesGround.length; i++) {
    for (var j = 0; j < bombs.length; j++) {
      if (bombs[j]) {
        if (enemiesGround[i].bounding.intersectsBox(bombs[j].bounding)) {
          enemiesGround[i].drop();
        }
      }
    }
  }

  for (var i = 0; i < removeEnimies.length; i++) {
    if (enimies[removeEnimies[i]]) {
      scene.remove(enimies[removeEnimies[i]].object);
    }
    enimies.splice(removeEnimies[i], 1);
  }

  for (var i = 0; i < removeMissiles.length; i++) {
    if (missiles[removeMissiles[i]]) {
      scene.remove(missiles[removeMissiles[i]].object);
    }
    missiles.splice(removeMissiles[i], 1);
  }

  for (var i = 0; i < removeShots.length; i++) {
    if (shots[removeShots[i]]) {
      scene.remove(shots[removeShots[i]].object);
    }
    shots.splice(removeShots[i], 1);
  }

  for (var i = 0; i < removeEnemiesShots.length; i++) {
    if (enemiesShots[removeEnemiesShots[i]]) {
      scene.remove(enemiesShots[removeEnemiesShots[i]].object);
    }
    enemiesShots.splice(removeEnemiesShots[i], 1);
  }

  for (var i = 0; i < removeHealth.length; i++) {
    if (healths[removeHealth[i]]) {
      scene.remove(healths[removeHealth[i]].object);
    }
    healths.splice(removeHealth[i], 1);
  }
}

var healthbar = HealthBar();

var controls = new InfoBox();
controls.add("Plane Short");
controls.addParagraph();
controls.add("Up arrow move to up");
controls.add("Down arrow move to down");
controls.add("Left arrow move to left");
controls.add("Right arrow move to right");
controls.add("Space or Ctrl dispatch shot");
controls.show();

export function pause() {
  if (animationOn) {
    clearInterval(loopEnimies);
    clearInterval(loopEnemiesGround);
    clearInterval(loopMissiles);
    clearInterval(loopShotEnemies);
    clearInterval(loopHealth);
    animationOn = false;
  } else {
    initialState();
  }
}

render();
function render() {
  stats.update();
  collisionManager();

  airplane.moviment(animationOn, camera);

  enimiesManager();
  missilesManager();
  shotsManager();
  animate();
  // fight();
  update(camera, airplane.object, scene, helper, animationOn, target);
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}
