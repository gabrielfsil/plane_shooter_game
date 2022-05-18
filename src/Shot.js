import * as THREE from 'three'


export function createShot() {
    var shotGeometry = new THREE.SphereGeometry( 0.6, 8, 6);
    var shotMaterial = new THREE.MeshLambertMaterial({color: 'orange'});
    var sphere = new THREE.Mesh( shotGeometry, shotMaterial );

    sphere.position.set(-170, 10, 0);

    return sphere
}
