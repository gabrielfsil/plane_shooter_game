import * as THREE from 'three';
import { degreesToRadians } from '../libs/util/util.js';

var speed = 0.05
var vectorDirection = new THREE.Vector3(0, Math.cos(degreesToRadians(50)), -Math.sin(degreesToRadians(50)));
var controlPlane = -1;

export function createGroundPlane(x = 0, y = 0, z = -0.02) {
    let gcolor = "rgb(60, 30, 150)";


    var planeGeometry = new THREE.PlaneGeometry(400, 200, 20, 10);
    planeGeometry.translate(x, y, z);
    var planeMaterial = new THREE.MeshPhongMaterial({
        color: gcolor,
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1
    });

    var wireframe = new THREE.WireframeGeometry(planeGeometry);
    var line = new THREE.LineSegments(wireframe);
    line.material.color.setStyle("rgb(150, 150, 150)");

    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;
    plane.add(line);
    plane.rotateX(-Math.PI / 2);

    return plane;
}

let plane = createGroundPlane();
let planeAux = createGroundPlane();

export function update(camera, airplane, scene, animationOn) {

    if (controlPlane === -1) {
        scene.add(plane);
        controlPlane++;
    }
    if (animationOn) {
        if (camera.position.x < (10 + (controlPlane * 200))) {
            camera.translateOnAxis(vectorDirection, speed)
            airplane.translateY(-speed)

        } else {
            controlPlane++;
            if (controlPlane % 2 === 0) {
                planeAux.position.set(controlPlane * 200, 0, -0.02)
                scene.add(planeAux);
            } else {
                plane.position.set(controlPlane * 200, 0, -0.02)
                scene.add(plane);
            }

        }

    }
}