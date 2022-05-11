import * as THREE from 'three';
import {
    initRenderer,
    initDefaultBasicLight,
    InfoBox,
    createGroundPlaneWired,
    degreesToRadians
} from "../libs/util/util.js";

var scene = new THREE.Scene();    // Create main scene
var renderer = initRenderer();    // View function in util/utils
var camera = new THREE.PerspectiveCamera(50, 1, 0.1, 2000); // Init camera in this position
camera.position.set(-100, 30, 0);
camera.lookAt(-60, 0, 0);
camera.up.set(0, 1, 0);
initDefaultBasicLight(scene);


// create the ground plane
let plane = createGroundPlaneWired(200, 150);
scene.add(plane);

var airPlaneGeometry = new THREE.CylinderGeometry(0.5, 0.2, 5, 32);
var airPlaneMaterial = new THREE.MeshLambertMaterial({ color: "rgb(200,0,0)" });

var airPlane = new THREE.Mesh( airPlaneGeometry, airPlaneMaterial);

airPlane.position.set(-80, 10, 0);
airPlane.rotateZ(degreesToRadians(90));
scene.add(airPlane);

// Use this to show information onscreen
var controls = new InfoBox();
controls.add("Basic Scene");
controls.addParagraph();
controls.add("Use mouse to interact:");
controls.add("* Left button to rotate");
controls.add("* Right button to translate (pan)");
controls.add("* Scroll to zoom in/out.");
controls.show();

render();
function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera) // Render scene
}