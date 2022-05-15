import * as THREE from 'three';

var speed = 0.08
var vectorDirection = new THREE.Vector3(0, 0.6442, -0.7648);

export function update(camera, airplane, animationOn) {

    if (animationOn) {
        if (camera.position.x < 800) {

            camera.translateOnAxis(vectorDirection, speed)
            airplane.translateY(-speed)

        }

    }
}