import * as THREE from 'three';
import { degreesToRadians } from '../libs/util/util.js';


var speed = 0.3


var vectorDirection = new THREE.Vector3(0, Math.cos(degreesToRadians(50)), -Math.sin(degreesToRadians(50)));
var controlPlane = -1;

export function createGroundPlane(x = 0, y = 0, z = -0.02) {
    let gcolor = "rgb(60, 30, 150)";


    var planeGeometry = new THREE.PlaneGeometry(400, 300, 20, 10);
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

export function update(camera, airplane, scene, light, animationOn) {

    if (controlPlane === -1) {
        scene.add(plane);
        controlPlane++;
    }
    if (animationOn) {
        if (camera.position.x < (10 + (controlPlane * 200))) {
            camera.translateOnAxis(vectorDirection, speed)
            airplane.translateX(speed)
            light.translateX(-speed)

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

export function MenuGame(initialState) {


    var contentBox = document.createElement("div");
    contentBox.style.display = "none";
    contentBox.style.position = "absolute";
    contentBox.style.left = `${(screen.availWidth - 640) / 2}px`
    contentBox.style.top = `${(screen.availHeight - 480) / 2}px`
    contentBox.style.width = "640px";
    contentBox.style.height = "480px";
    contentBox.style.background = "#fd9000";
    contentBox.style.borderRadius = "8px";

    var title = document.createElement("h3");
    title.style.fontFamily = "sans-serif"
    title.style.fontWeight = "bold"
    title.style.fontSize = "72px";
    title.style.textAlign = "center";

    var textTitle = document.createTextNode("Game Over!");

    title.appendChild(textTitle);
    contentBox.appendChild(title);

    var text = document.createElement("p");
    text.style.fontFamily = "sans-serif"
    text.style.fontSize = "24px";
    text.style.textAlign = "center";

    var textContent = document.createTextNode("Aperte o botão abaixo para reiniciar");

    text.appendChild(textContent);
    contentBox.appendChild(text);

    var button = document.createElement("button");
    button.append("Reiniciar")
    button.style.height = "48px"
    button.style.width = "174px"
    button.style.margin = "0 233px 0 233px";
    button.style.borderRadius = "8px";
    button.style.border = "none";
    button.style.cursor = "pointer"
    button.onclick = () => {
        
        initialState();
    }

    contentBox.appendChild(button);


    document.body.appendChild(contentBox);

    return contentBox;
}