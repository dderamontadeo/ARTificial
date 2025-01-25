import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

// Add CSS for UI elements
const style = document.createElement('style');
style.textContent = `
    .loading-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg, #2D1B4E, #6B46C1);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .loading-spinner {
        width: 50px;
        height: 50px;
        border: 5px solid #E9D8FD;
        border-top: 5px solid #9F7AEA;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 20px;
    }

    .loading-text {
        color: #E9D8FD;
        font-family: Arial, sans-serif;
        font-size: 1.5rem;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }

    .progress-bar {
        width: 200px;
        height: 10px;
        background: rgba(233,216,253,0.2);
        border-radius: 5px;
        margin-top: 10px;
        overflow: hidden;
    }

    .progress-fill {
        height: 100%;
        background: #9F7AEA;
        width: 0%;
        transition: width 0.3s ease;
    }

    .controls-help {
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0,0,0,0.7);
        color: white;
        padding: 15px;
        border-radius: 10px;
        font-family: Arial, sans-serif;
        z-index: 100;
        transition: opacity 0.3s, transform 0.3s;
        cursor: pointer;
    }

    .controls-help.hidden {
        opacity: 0;
        pointer-events: none;
        transform: translateY(-10px);
    }

    .controls-help::after {
        content: "Toca para ocultar";
        display: none;
        font-size: 0.8em;
        margin-top: 10px;
        color: #9F7AEA;
    }

    .joystick-container {
        position: fixed;
        bottom: 40px;
        left: 50%;
        transform: translateX(-50%);
        width: 150px;
        height: 150px;
        background: rgba(233,216,253,0.2);
        border: 2px solid rgba(233,216,253,0.4);
        border-radius: 50%;
        display: none;
        touch-action: none;
        z-index: 1000;
    }

    .joystick-knob {
        position: absolute;
        width: 50px;
        height: 50px;
        background: rgba(159,122,234,0.8);
        border-radius: 50%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        cursor: pointer;
    }

    @media (max-width: 768px) {
        .joystick-container {
            display: block;
        }
        
        .controls-help {
            cursor: default;
        }
        
        .controls-help::after {
            display: block;
        }
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

let colliderObjects = [];

// Create loading screen
const loadingContainer = document.createElement('div');
loadingContainer.className = 'loading-container';

const spinner = document.createElement('div');
spinner.className = 'loading-spinner';

const loadingText = document.createElement('div');
loadingText.className = 'loading-text';
loadingText.textContent = 'Cargando...';

const progressBar = document.createElement('div');
progressBar.className = 'progress-bar';

const progressFill = document.createElement('div');
progressFill.className = 'progress-fill';

progressBar.appendChild(progressFill);
loadingContainer.appendChild(spinner);
loadingContainer.appendChild(loadingText);
loadingContainer.appendChild(progressBar);
document.body.appendChild(loadingContainer);

// Create controls help
const controlsHelp = document.createElement('div');
controlsHelp.className = 'controls-help';
controlsHelp.innerHTML = `
    <h3>Controles</h3>
    <p>Escritorio:</p>
    <ul>
        <li>W/A/S/D - Moverse</li>
        <li>Ratón - Mirar alrededor</li>
        <li>H - Alternar ayuda</li>
    </ul>
    <p>Móvil:</p>
    <ul>
        <li>Joystick virtual - Moverse</li>
        <li>Tocar y arrastrar - Mirar alrededor</li>
    </ul>
`;
document.body.appendChild(controlsHelp);

// Create joystick
const joystickContainer = document.createElement('div');
joystickContainer.className = 'joystick-container';

const joystickKnob = document.createElement('div');
joystickKnob.className = 'joystick-knob';

joystickContainer.appendChild(joystickKnob);
//document.body.appendChild(joystickContainer);

// Three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
document.body.appendChild(renderer.domElement);

// Lighting Setup
const ambientLight = new THREE.AmbientLight(0xfff0dd, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 500;
directionalLight.shadow.bias = -0.0001;
scene.add(directionalLight);

const hemisphereLight = new THREE.HemisphereLight(0x87CEEB, 0x3d3d3d, 0.6);
scene.add(hemisphereLight);

const pointLight1 = new THREE.PointLight(0xff9000, 0.5, 100);
pointLight1.position.set(10, 5, 0);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0x0060ff, 0.5, 100);
pointLight2.position.set(-10, 5, 0);
scene.add(pointLight2);

// Background Setup
const backgroundColor = {
    topColor: new THREE.Color(0x87CEEB),
    bottomColor: new THREE.Color(0xE6AA68)
};

const backgroundMaterial = new THREE.ShaderMaterial({
    uniforms: {
        topColor: { value: backgroundColor.topColor },
        bottomColor: { value: backgroundColor.bottomColor },
        offset: { value: 33 },
        exponent: { value: 0.6 }
    },
    vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
            vec4 worldPosition = modelMatrix * vec4(position, 1.0);
            vWorldPosition = worldPosition.xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        uniform float offset;
        uniform float exponent;
        varying vec3 vWorldPosition;
        void main() {
            float h = normalize(vWorldPosition + offset).y;
            gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
        }
    `,
    side: THREE.BackSide
});

const backgroundSphere = new THREE.Mesh(
    new THREE.SphereGeometry(100, 32, 32),
    backgroundMaterial
);
scene.add(backgroundSphere);

camera.position.set(0.25, 0, 46.55);

// Mobile detection and controls
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Touch controls
let isTouching = false;
let lastTouchX = 0;
let lastTouchY = 0;
let joystickActive = false;
let joystickCenter = { x: 0, y: 0 };
let joystickPosition = { x: 0, y: 0 };

const movementSpeed = 0.1;
const rotationSpeed = 0.05;
let mouseX = 0;
let mouseY = 0;
let yaw = 0;
let pitch = 0;
const moveSpeed = 0.05;
const keys = {};

// Joystick functions
// Modified joystick functions
function handleJoystickStart(event) {
    joystickActive = true;
    const touch = event.touches[0];
    const rect = joystickContainer.getBoundingClientRect();
    joystickCenter = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
    };
    updateJoystickPosition(touch);
}

function handleJoystickMove(event) {
    if (!joystickActive) return;
    event.preventDefault();
    updateJoystickPosition(event.touches[0]);
}

function handleJoystickEnd() {
    joystickActive = false;
    joystickPosition = { x: 0, y: 0 };
    joystickKnob.style.transform = 'translate(-50%, -50%)';
}


function updateJoystickPosition(touch) {
    const deltaX = touch.clientX - joystickCenter.x;
    const deltaY = touch.clientY - joystickCenter.y;
    const angle = Math.atan2(deltaY, deltaX);
    const distance = Math.min(50, Math.hypot(deltaX, deltaY));
    
    const moveX = distance * Math.cos(angle);
    const moveY = distance * Math.sin(angle);
    
    joystickKnob.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px))`;
    
    joystickPosition = {
        x: moveX / 50,
        y: moveY / 50
    };
}

// Event listeners
joystickContainer.addEventListener('touchstart', handleJoystickStart);
joystickContainer.addEventListener('touchmove', handleJoystickMove);
joystickContainer.addEventListener('touchend', handleJoystickEnd);
joystickContainer.addEventListener('touchcancel', handleJoystickEnd);

if (isMobileDevice()) {
    controlsHelp.addEventListener('touchstart', (e) => {
        e.preventDefault();
        controlsHelp.classList.add('hidden');
    });

    let touchStartY = 0;
    document.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    });

    document.addEventListener('touchmove', (e) => {
        const touchY = e.touches[0].clientY;
        const deltaY = touchY - touchStartY;

        if (touchStartY < 50 && deltaY > 50) {
            controlsHelp.classList.remove('hidden');
        }
    });
} else {
    document.addEventListener('keydown', (event) => {
        if (event.key.toLowerCase() === 'h') {
            controlsHelp.classList.toggle('hidden');
        }
        keys[event.key.toLowerCase()] = true;
    });
}

document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX / window.innerWidth - 0.5;
    mouseY = event.clientY / window.innerHeight - 0.5;
    yaw -= mouseX * 0.02;
    pitch -= mouseY * 0.02;
    pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch));
});

document.addEventListener('keydown', (event) => {
    keys[event.key.toLowerCase()] = true;
});

document.addEventListener('keyup', (event) => {
    keys[event.key.toLowerCase()] = false;
});

document.addEventListener('touchstart', (event) => {
    isTouching = true;
    lastTouchX = event.touches[0].clientX;
    lastTouchY = event.touches[0].clientY;
});

document.addEventListener('touchmove', (event) => {
    if (!isTouching) return;

    const touchX = event.touches[0].clientX;
    const touchY = event.touches[0].clientY;

    const deltaX = (lastTouchX - touchX) / window.innerWidth; // Invert X
    const deltaY = (lastTouchY - touchY) / window.innerHeight; // Invert Y

    yaw -= deltaX * 2;
    pitch += deltaY * 2; // Adjust as needed
    pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch));

    lastTouchX = touchX;
    lastTouchY = touchY;
});

document.addEventListener('touchend', () => {
    isTouching = false;
});

// Window resize handler (continued)
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});



// Define boundaries and restricted areas
const playableArea = new THREE.Box3(
    new THREE.Vector3(-16.31, -3.51, 50),
    new THREE.Vector3(16.68, 3.51, -31)
);

const boundaries = {
    minX: -16,
    maxX: 16,
    minZ: -30,
    maxZ: 48,
    minY: 0,
    maxY: 5
};

const restrictedAreas = [
    { minX: -10.5, maxX: 10.5, minZ: 37, maxZ: 39, minY: 0, maxY: 5 },
    { minX: 6.69, maxX: 8.7, minZ: -25, maxZ: -5, minY: 0, maxY: 5 },
    { minX: 7.3, maxX: 8.6, minZ: 5, maxZ: 25, minY: 0, maxY: 5 }, 
    { minX: -1, maxX: 1, minZ: -12, maxZ: 13, minY: 0, maxY: 5 },//1 12 0.12 -12.56
    { minX: -8.7, maxX: -7, minZ: 5.03, maxZ: 25.47, minY: 0, maxY: 5 },//-8.47 -5.06 -7.53 -25.21
    { minX: -8.7, maxX: -7, minZ: -25.21, maxZ: -5, minY: 0, maxY: 5 }//-8.47 -5.06 -7.53 -25.21
];

function checkBoundary(position) {
    const isWithinBoundaries =
        position.x >= boundaries.minX &&
        position.x <= boundaries.maxX &&
        position.z >= boundaries.minZ &&
        position.z <= boundaries.maxZ &&
        position.y >= boundaries.minY &&
        position.y <= boundaries.maxY;

    if (!isWithinBoundaries) return false;

    for (const area of restrictedAreas) {
        if (
            position.x >= area.minX &&
            position.x <= area.maxX &&
            position.z >= area.minZ &&
            position.z <= area.maxZ &&
            position.y >= area.minY &&
            position.y <= area.maxY
        ) {
            return false;
        }
    }

    return true;
}

// Load the 3D model
const loader = new GLTFLoader();
loader.setMeshoptDecoder(MeshoptDecoder);
//loader.setDRACOLoader(dracoLoader);

loader.load(
    '/models/galeriac.glb',
    (gltf) => {
        scene.add(gltf.scene);
        loadingContainer.remove();
		document.body.appendChild(joystickContainer);
		
        gltf.scene.traverse((node) => {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;

                if (node.name.toLowerCase().includes('wall') || 
                    node.name.toLowerCase().includes('pared') ||
                    node.name.toLowerCase().includes('floor') ||
                    node.name.toLowerCase().includes('suelo')) {
                    
                    const bbox = new THREE.Box3().setFromObject(node);
                    colliderObjects.push({
                        mesh: node,
                        bbox: bbox
                    });
                }

                if (node.material) {
                    node.material.envMapIntensity = 1;
                    node.material.needsUpdate = true;
                }
            }
        });
    },
    (xhr) => {
        if (xhr.lengthComputable) {
            const percentComplete = xhr.loaded / xhr.total * 100;
            loadingText.textContent = `Cargando ${percentComplete.toFixed(2)}%`;
            progressFill.style.width = `${percentComplete}%`;
        }
    },
    (error) => {
        console.error('Error al cargar el modelo:', error);
        loadingText.textContent = 'Error al cargar.';
    }
);
function animate() {
    camera.rotation.order = 'YXZ';
    camera.rotation.y = yaw;
    camera.rotation.x = pitch;

    const moveDirection = new THREE.Vector3();
    
    if (isMobileDevice() && joystickActive) {
        // Use joystick for direction only
        moveDirection.x = joystickPosition.x;
        moveDirection.z = joystickPosition.y;
    } else {
        // Keyboard controls for PC
        if (keys['w']) moveDirection.z = -1;
        if (keys['s']) moveDirection.z = 1;
        if (keys['a']) moveDirection.x = -1;
        if (keys['d']) moveDirection.x = 1;
    }

    if (moveDirection.length() > 0) {
        moveDirection.normalize();
        moveDirection.applyQuaternion(camera.quaternion);
        moveDirection.y = 0;
        moveDirection.normalize();

        const moveAmount = isMobileDevice() ? moveSpeed : moveSpeed;
        const newPosition = camera.position.clone().add(moveDirection.multiplyScalar(moveAmount));

        if (checkBoundary(newPosition)) {
            camera.position.copy(newPosition);
        }
        
        console.log(`Position: x=${camera.position.x.toFixed(2)}, y=${camera.position.y.toFixed(2)}, z=${camera.position.z.toFixed(2)}`);
    }

    const time = Date.now() * 0.001;
    pointLight1.position.x = Math.sin(time) * 10;
    pointLight2.position.x = Math.cos(time) * 10;
    
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

// Check WebGL support and start animation
animate();