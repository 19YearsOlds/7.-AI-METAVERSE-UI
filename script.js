import * as THREE from "three";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("vrCanvas") });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 2️⃣ Add a 3D Cube
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
camera.position.z = 5;

function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
}
animate();

// 3️⃣ Load Hand Tracking Model
import * as handTrack from "handtrackjs";

const video = document.getElementById("handVideo");
const modelParams = { flipHorizontal: true, maxNumBoxes: 2 };
let model;

handTrack.load(modelParams).then(lModel => {
    model = lModel;
    handTrack.startVideo(video).then(status => {
        if (status) {
            detectHands();
        }
    });
});

function detectHands() {
    model.detect(video).then(predictions => {
        if (predictions.length > 0) {
            console.log("Hand detected", predictions);
            cube.material.color.set(0xff0000); // Change cube color on hand detect
        } else {
            cube.material.color.set(0x00ff00);
        }
        requestAnimationFrame(detectHands);
    });
}

// 4️⃣ Enable Multiplayer (WebRTC)
import Peer from "peerjs";
const peer = new Peer();
peer.on("open", id => console.log("My peer ID:", id));

peer.on("connection", conn => {
    conn.on("data", data => console.log("Received:", data));
});

function sendData(data) {
    const conn = peer.connect("remote-peer-id"); // Replace with actual ID
    conn.on("open", () => conn.send(data));
}