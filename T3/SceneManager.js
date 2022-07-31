import * as THREE from "three";
import { degreesToRadians } from "../libs/util/util.js";
import { Water } from "../build/jsm/objects/Water.js";
import { Sky } from "../build/jsm/objects/Sky.js";

var speed = 0.3;

var vectorDirection = new THREE.Vector3(
  0,
  Math.cos(degreesToRadians(50)),
  -Math.sin(degreesToRadians(50))
);
var vectorDirection = new THREE.Vector3(
  0,
  Math.cos(degreesToRadians(50)),
  -Math.sin(degreesToRadians(50))
);
var controlPlane = -1;

const waterGeometry = new THREE.PlaneGeometry(400, 300);

var sun = new THREE.Vector3();
const sky = new Sky();
sky.scale.setScalar(10000);

const skyUniforms = sky.material.uniforms;

skyUniforms["turbidity"].value = 10;
skyUniforms["rayleigh"].value = 2;
skyUniforms["mieCoefficient"].value = 0.005;
skyUniforms["mieDirectionalG"].value = 0.8;

const parameters = {
  elevation: 15,
  azimuth: 180,
};

const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
const theta = THREE.MathUtils.degToRad(parameters.azimuth);

sun.setFromSphericalCoords(1, phi, theta);

sky.material.uniforms["sunPosition"].value.copy(sun);

export function createWater() {
  var water = new Water(waterGeometry, {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: new THREE.TextureLoader().load(
      "./assets/waternormals.jpg",
      function (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      }
    ),
    sunDirection: new THREE.Vector3(),
    sunColor: 0xffffff,
    waterColor: 0x001e0f,
    distortionScale: 3.7,
  });

  water.rotation.x = -Math.PI / 2;

  return water;
}

function createObjectBorder() {
  var textureLoader = new THREE.TextureLoader();
  var map = textureLoader.load("./assets/asfalto.jpg");
  // Object Material
  var objectMaterial = new THREE.MeshBasicMaterial({ map: map });

  //   let convexGeometry = new ConvexGeometry(points);
  var cubeGeometry = new THREE.BoxGeometry(400, 400, 400);

  let object = new THREE.Mesh(cubeGeometry, objectMaterial);
  object.castShadow = true;
  object.visible = true;

  return object;
}

function createObjectGround() {
  var textureLoader = new THREE.TextureLoader();
  var map = textureLoader.load("./assets/grass.jpg");
  // Object Material
  var objectMaterial = new THREE.MeshBasicMaterial({ map: map });

  //   let convexGeometry = new ConvexGeometry(points);
  var cubeGeometry = new THREE.BoxGeometry(400, 80, 17);

  let object = new THREE.Mesh(cubeGeometry, objectMaterial);
  object.castShadow = true;
  object.visible = true;

  return object;
}

export function createGroundPlane(
  gcolor = "rgb(250, 250, 250)",
  x = 0,
  y = 0,
  z = -0.02
) {
  let borderLeft = createObjectBorder();
  let borderRight = createObjectBorder();

  let groundLeft = createObjectGround();
  let groundRight = createObjectGround();

  borderLeft.rotateX(degreesToRadians(45));
  borderRight.rotateX(degreesToRadians(-45));

  var planeGeometry = new THREE.PlaneGeometry(400, 300, 120, 80);
  planeGeometry.translate(x, y, z);
  var planeMaterial = new THREE.MeshPhongMaterial({
    color: gcolor,
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1,
  });

  var wireframe = new THREE.WireframeGeometry(planeGeometry);
  var line = new THREE.LineSegments(wireframe);
  line.material.color.setStyle("rgb(150, 150, 150)");

  var plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.receiveShadow = true;
  plane.rotateX(-Math.PI / 2);
  borderLeft.position.set(x, y + 40, 0);
  borderRight.position.set(x, y - 40, 0);
  plane.add(borderRight);
  plane.add(borderLeft);
  borderRight.translateY(194)
  borderRight.translateZ(-194)
  borderLeft.translateY(-194)
  borderLeft.translateZ(-194)
  groundLeft.position.set(x, y + 80, 0);
  groundRight.position.set(x, y - 80, 0);
  plane.add(groundRight);
  plane.add(groundLeft);
  return plane;
}

let plane = createGroundPlane();
let planeAux = createGroundPlane();

let water = createWater();
let waterAux = createWater();

export function update(camera, airplane, scene, light, animationOn, target) {
  water.material.uniforms["time"].value += 1.0 / 60.0;
  if (controlPlane === -1) {
    scene.add(plane);
    controlPlane++;
    scene.add(water);
    scene.add(sky);
  }
  if (animationOn) {
    if (camera.position.x < 10 + controlPlane * 200) {
      camera.translateOnAxis(vectorDirection, speed);
      airplane.translateX(speed);
      light.translateX(speed);
      target.translateX(speed);
      sky.translateX(speed);
    } else {
      controlPlane++;
      if (controlPlane % 2 === 0) {
        planeAux.position.set(controlPlane * 200, 0, -0.02);
        waterAux.position.set(controlPlane * 200, 0, -0.02);
        scene.add(planeAux);
        scene.add(waterAux);
      } else {
        plane.position.set(controlPlane * 200, 0, -0.02);
        scene.add(plane);
        water.position.set(controlPlane * 200, 0, -0.02);
        scene.add(water);
      }
    }
  }
}

export function MenuGame(initialState) {
  var contentBox = document.createElement("div");
  contentBox.style.display = "none";
  contentBox.style.position = "absolute";
  contentBox.style.left = `${(screen.availWidth - 640) / 2}px`;
  contentBox.style.top = `${(screen.availHeight - 480) / 2}px`;
  contentBox.style.width = "640px";
  contentBox.style.height = "480px";
  contentBox.style.background = "#fd9000";
  contentBox.style.borderRadius = "8px";

  var title = document.createElement("h3");
  title.style.fontFamily = "sans-serif";
  title.style.fontWeight = "bold";
  title.style.fontSize = "72px";
  title.style.textAlign = "center";

  var textTitle = document.createTextNode("Game Over!");

  title.appendChild(textTitle);
  contentBox.appendChild(title);

  var text = document.createElement("p");
  text.style.fontFamily = "sans-serif";
  text.style.fontSize = "24px";
  text.style.textAlign = "center";

  var textContent = document.createTextNode(
    "Aperte o botão abaixo para reiniciar"
  );

  text.appendChild(textContent);
  contentBox.appendChild(text);

  var button = document.createElement("button");
  button.append("Reiniciar");
  button.style.height = "48px";
  button.style.width = "174px";
  button.style.margin = "0 233px 0 233px";
  button.style.borderRadius = "8px";
  button.style.border = "none";
  button.style.cursor = "pointer";
  button.onclick = () => {
    initialState();
  };

  contentBox.appendChild(button);

  document.body.appendChild(contentBox);

  return contentBox;
}

export function StartGame(startGame) {
  var contentBox = document.createElement("div");
  contentBox.style.display = "grid";
  contentBox.style.position = "absolute";
  contentBox.style.left = `${(screen.availWidth - 640) / 2}px`;
  contentBox.style.top = `${(screen.availHeight - 480) / 2}px`;
  contentBox.style.width = "640px";
  contentBox.style.height = "480px";
  contentBox.style.background = "#fd9000";
  contentBox.style.borderRadius = "8px";

  var title = document.createElement("h3");
  title.style.fontFamily = "sans-serif";
  title.style.fontWeight = "bold";
  title.style.fontSize = "72px";
  title.style.textAlign = "center";

  var textTitle = document.createTextNode("Plane Shooter Game!");

  title.appendChild(textTitle);
  contentBox.appendChild(title);

  var text = document.createElement("p");
  text.style.fontFamily = "sans-serif";
  text.style.fontSize = "24px";
  text.style.textAlign = "center";

  var textContent = document.createTextNode(
    "Aperte o botão abaixo para iniciar"
  );

  text.appendChild(textContent);
  contentBox.appendChild(text);

  var button = document.createElement("button");
  button.append("Iniciar");
  button.style.height = "48px";
  button.style.width = "174px";
  button.style.margin = "0 233px 0 233px";
  button.style.borderRadius = "8px";
  button.style.border = "none";
  button.style.cursor = "pointer";
  button.onclick = () => {
    startGame();
  };

  contentBox.appendChild(button);

  document.body.appendChild(contentBox);

  return contentBox;
}

export function HealthBar() {
  var content = document.createElement("div");
  content.style.position = "absolute";
  content.style.right = "0px";
  content.style.top = "0px";
  content.style.width = "200px";
  content.style.height = "100px";
  content.style.background = "black";
  content.style.opacity = "0.6";

  var title = document.createElement("h3");
  title.style.fontFamily = "sans-serif";
  title.style.fontSize = "18px";
  title.style.textAlign = "left";
  title.style.marginLeft = "16px";
  title.style.color = "white";

  // var healthbar = document.createElement("div");
  // healthbar.style.position = 'absolute';
  // healthbar.style.left = 16px;
  // healthbar.style.top = 50px;
  // healthbar.style.width = '130px';
  // healthbar.style.height = '20px';
  // healthbar.style.border = 2px solid white

  var progressbar = document.createElement("progress");
  progressbar.style.width = "150px";
  progressbar.style.height = "20px";
  progressbar.style.marginLeft = "16px";
  progressbar.style.borderRadius = "0";
  progressbar.id = "health";
  progressbar.value = "100";
  progressbar.max = "100";

  var textTitle = document.createTextNode("Health");

  title.appendChild(textTitle);
  content.appendChild(title);
  content.appendChild(progressbar);

  document.body.appendChild(content);
  return content;
}
