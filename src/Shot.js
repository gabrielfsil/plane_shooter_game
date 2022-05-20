import * as THREE from 'three'


export function createShot(position) {
    var shotGeometry = new THREE.SphereGeometry(0.6, 8, 6);
    var shotMaterial = new THREE.MeshLambertMaterial({ color: 'orange' });
    var sphere = new THREE.Mesh(shotGeometry, shotMaterial);

    sphere.position.set(position.x, position.y, position.z);

    // sphere Bouding Box
    let sphereShot = new THREE.Sphere(sphere.position, 0.6)


    return sphere
}
