import * as THREE from 'three';



export function createEnimies(camera) {
    var enimiesGeometry = new THREE.BoxGeometry(6, 6, 6);
    var enimiesMaterial = new THREE.MeshLambertMaterial({ color: "rgb(0,100,100)" });

    var enimies = new THREE.Mesh(enimiesGeometry, enimiesMaterial);
    enimies.castShadow = true
    enimies.position.set(camera.position.x + 120, 10, Math.floor(Math.random() * 52 - 26));

    return enimies;
}
