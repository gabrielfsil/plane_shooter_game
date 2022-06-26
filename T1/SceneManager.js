import * as THREE from 'three';
import { degreesToRadians } from '../libs/util/util.js';


var speed = 0.3


var vectorDirection = new THREE.Vector3(0, Math.cos(degreesToRadians(50)), -Math.sin(degreesToRadians(50)));
var vectorDirection = new THREE.Vector3(0, Math.cos(degreesToRadians(50)), -Math.sin(degreesToRadians(50)));
var controlPlane = -1;

export function createGroundPlane(gcolor = "rgb(86, 80, 71)", x = 0, y = 0, z = -0.02) {

    var planeGeometry = new THREE.PlaneGeometry(400, 300, 120, 80);
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

export function update(camera, airplane, scene, light, animationOn, target) {

    if (controlPlane === -1) {
        scene.add(plane);
        controlPlane++;
    }
    if (animationOn) {
        if (camera.position.x < (10 + (controlPlane * 200))) {
            camera.translateOnAxis(vectorDirection, speed)
            airplane.translateX(speed)
            light.translateX(speed)
            target.translateX(speed)

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

export function HealthBar() {
    var content = document.createElement("div");
    content.style.position = "absolute";
    content.style.right = `0px`
    content.style.top = `0px`
    content.style.width = "200px";
    content.style.height = "100px";
    content.style.background = "black";
    content.style.opacity = '0.6';

    var title = document.createElement("h3");
    title.style.fontFamily = "sans-serif"
    title.style.fontSize = "18px";
    title.style.textAlign = "left";
    title.style.marginLeft = '16px';
    title.style.color = 'white';

    // var healthbar = document.createElement("div");
    // healthbar.style.position = 'absolute';
    // healthbar.style.left = `16px`;
    // healthbar.style.top = `50px`;
    // healthbar.style.width = '130px';
    // healthbar.style.height = '20px';
    // healthbar.style.border = `2px solid white`
 
    var progressbar = document.createElement("progress");
    progressbar.style.width = '150px';
    progressbar.style.height = '20px';
    progressbar.style.marginLeft = '16px';
    progressbar.style.borderRadius = '0';
    progressbar.id = 'health';
    progressbar.value = '100';
    progressbar.max = '100';


    

    var textTitle = document.createTextNode("Barra de Danos");

    title.appendChild(textTitle);
    content.appendChild(title);
    content.appendChild(progressbar)



    document.body.appendChild(content);
    return content;

}