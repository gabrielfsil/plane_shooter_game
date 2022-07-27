import * as THREE from 'three';
import KeyboardState from '../libs/util/KeyboardState.js';
import { Bomb } from './Bomb.js';
import { createBoundingBox } from './index.js';
import { createShot, Shot } from './Shot.js';
import { GLTFLoader } from '../build/jsm/loaders/GLTFLoader.js'
// import { degreesToRadians, getMaxSize } from '../libs/util/util.js';
//teste
import {OBJLoader} from '../build/jsm/loaders/OBJLoader.js';
import {MTLLoader} from '../build/jsm/loaders/MTLLoader.js';
import {initRenderer, 
    initDefaultSpotlight,
    createGroundPlane,
    SecondaryBox,
    getMaxSize,        
    onWindowResize, 
    degreesToRadians,
    } from "../libs/util/util.js";


var keyboard = new KeyboardState();


export function createBoundingSpheres(sphere) {

    let boundingSpheres = new THREE.Sphere(sphere.position, 0.6)

    return boundingSpheres

}

//teste

let assetManager = {
    plane: null
}

loadOBJFile('./assets/airplanetest/', 'plane',3.5,0,true);

function loadOBJFile(modelPath, modelName, desiredScale, angle, visibility){
    var mtlLoader = new MTLLoader();
    mtlLoader.setPath(modelPath);
    mtlLoader.load(modelName + '.mtl', function (materials) {
        materials.preload();

        var objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath(modelPath);
        objLoader.load( modelName + ".obj", function (obj) {
            obj.visible = visibility;
            obj.name = modelName;
            obj.traverse(function (child)
            {
                child.castShadow = true;
            });

            obj.traverse( function(node)
            {
                if(node.material) ondevicemotion.material.side = THREE.DoubleSide;

            });
            var obj = normalizeAndRescale(obj, desiredScale);
            var obj = fixPosition(obj);
            obj.rotateY(degreesToRadians(angle));

            scene.add (obj);
            assetManager[modelName] = obj;
        });
    
    });
}

// Escala 

function normalizeAndRescale(obj, newScale)
{
    var scale = getMaxSize(obj);//utils.js
    obj.scale.set(newScale * (1.0/scale),
                  newScale * (1.0/scale),
                  newScale * (1.0/scale));
    return obj;
}
class Airplane {

    constructor() {
        var airPlaneGeometry = new THREE.CylinderGeometry(3, 3, 4, 20);
        var airPlaneMaterial = new THREE.MeshLambertMaterial({ transparent: true, opacity: 0 });

        this.object = new THREE.Mesh(airPlaneGeometry, airPlaneMaterial);

        this.object.position.set(-170, 10, 0);
        this.bounding = createBoundingBox(this.object);
        this.breakdown = 0;
        this.fall = true

        this.cadence = setInterval(() => {
            this.enabled = true
        }, 500);

        return this;
    }

    drop() {
        this.fall = false
        
    }


    addBreakdown(damage) {

        if (keyboard.pressed("G")) {
            console.log("Modo Furtivo")
        } else {

            if (this.breakdown < 5) {
                let health = document.getElementById("health")
                if (health) {
                    health.value -= 20 * damage
                    this.breakdown += damage
                }
            }
        }
    }

    removeBreakdown(health) {

        if (this.breakdown < 5) {
            let healthBar = document.getElementById("health")
            if (health) {
                healthBar.value += 20 * health
                this.breakdown -= health
            }
        }
    }

    restart(camera) {
        this.fall = false;
        this.breakdown = 0
        this.object.position.set(camera.position.x + 40, 10, 0);
        let health = document.getElementById("health")
        if (health) {
            health.value = 100
        }
    }

    moviment(animationOn, camera) {

        keyboard.update();

        var speed = 0.7;

        if (animationOn) {

            if (this.object.position.x - camera.position.x < 80) {
                if (keyboard.pressed("up")) this.object.translateX(speed)
            }
            if (this.object.position.x - camera.position.x > 20) {
                if (keyboard.pressed("down")) this.object.translateX(-speed);
            }
            if (this.object.position.z - camera.position.z < 28) {

                if (keyboard.pressed("right")) this.object.translateZ(speed);
            }
            if (this.object.position.z - camera.position.z > -28) {

                if (keyboard.pressed("left")) this.object.translateZ(-speed)
            }

        } else {

            if (this.fall && this.object.position.y > 0) {

                this.object.translateX(speed);
                this.object.translateY(-speed * 0.2);
                this.object.translateZ(-speed * 0.2);

            }
        }

    }

    shot() {

        if (keyboard.pressed("ctrl")) {

            if (this.enabled) {
                this.enabled = false

                var sphere = new Shot(this.object.position, new THREE.Vector3(1, 0, 0));

                return sphere
            }
        }



    }

    launch() {

        if (keyboard.down("space")) {


            var bomb = new Bomb(this.object.position);
            const upload = new GLTFLoader()

            upload.load('./assets/bomb.blend', (gltf) => {
                let object = gltf.scene
                object.rotateY(degreesToRadians(180));
                console.log(bomb)
                object.set(0.6, 0.6, 0.6)
                object.traverse(function (child) {
                    if (child) {
                        child.castShadow = true;
                    }
                })
                bomb.object.add(object)
            })



            return scene.add(bomb.object);


        }
    }
}

export { Airplane }