import * as THREE from 'three';
import KeyboardState from '../libs/util/KeyboardState.js';
import { createShot } from './Shot.js';


var keyboard = new KeyboardState();


function createBoundingSpheres(sphere) {

    let boundingSpheres = new THREE.Sphere(sphere.position, 0.6)

    return boundingSpheres

}

class Airplane {

    constructor() {
        var airPlaneGeometry = new THREE.CylinderGeometry(3, 3, 4, 20);
        var airPlaneMaterial = new THREE.MeshLambertMaterial({ transparent: true, opacity: 0 });

        this.object = new THREE.Mesh(airPlaneGeometry, airPlaneMaterial);

        this.object.position.set(-170, 10, 0);
        // this.object.rotateZ(degreesToRadians(90));

        this.cadence = setInterval(() => {
            this.enabled = true
        }, 500);

        return this;
    }

    moviment(animationOn, camera) {

        keyboard.update();

        var speed = 0.8;

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


            // setInterval(() => {
            //     if (keyboard.pressed("ctrl")) {
            //         var sphere = createShot(this.object.position);
            //         var boundingSphere = createBoundingSpheres(sphere);
            //         scene.add(sphere)
            //         shots.push(sphere)
            //         sphereShots.push(boundingSphere);
            //     }

            // }, 500)
        }

    }

    shot(scene, shots, sphereShots) {

        if (keyboard.down("space") || keyboard.pressed("ctrl")) {

            if (this.enabled) {
                this.enabled = false
                var sphere = createShot(this.object.position);
                var boundingSphere = createBoundingSpheres(sphere);

                scene.add(sphere)
                shots.push(sphere)
                sphereShots.push(boundingSphere);
            }
        }



    }
}

export { Airplane }