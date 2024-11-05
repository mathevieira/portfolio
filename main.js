const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x000000, 0); 

document.getElementById('planet-container').appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;  
controls.dampingFactor = 0.05;  
controls.enableZoom = true;     
controls.autoRotate = false;    

//Sol
const sunGeometry = new THREE.SphereGeometry(3, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

//Luz solar
const sunLight = new THREE.PointLight(0xffffff, 2);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);

//Textura da Terra
const textureLoader = new THREE.TextureLoader();
const planets = []; 

// Função para criar planetas com textura
function createPlanet(size, distance, texturePath, speed) {
    const geometry = new THREE.SphereGeometry(size, 32, 32);
    const material = new THREE.MeshStandardMaterial({
        map: textureLoader.load(texturePath) // Carregue a textura
    });
    const planet = new THREE.Mesh(geometry, material);
    planet.userData = { distance: distance, speed: speed, angle: 0 };
    scene.add(planet);
    return planet;
}

// Criando os planetas com suas respectivas texturas
planets.push(createPlanet(0.4, 5, 'img/mercury.png', 0.04)); // Mercúrio
planets.push(createPlanet(0.7, 7, 'img/venus.png', 0.03)); // Vênus
planets.push(createPlanet(1, 10, 'img/earth.png', 0.02)); // Terra
planets.push(createPlanet(0.5, 12, 'img/mars.png', 0.018)); // Marte
planets.push(createPlanet(1.5, 20, 'img/jupiter.png', 0.008)); // Júpiter
planets.push(createPlanet(1.2, 25, 'img/saturn.png', 0.006)); // Saturno
planets.push(createPlanet(1, 30, 'img/uranus.png', 0.004)); // Urano
planets.push(createPlanet(0.9, 35, 'img/neptune.png', 0.002)); // Netuno

const ambientLight = new THREE.AmbientLight(0x404040); 
scene.add(ambientLight);

const starTexture = textureLoader.load('img/circle.png');

//Função para criar uma estrela
function createStar() {
    const starGeometry = new THREE.PlaneGeometry(1, 1); //Tamanho da estrela
    const starMaterial = new THREE.MeshBasicMaterial({ map: starTexture, transparent: true }); 
    const star = new THREE.Mesh(starGeometry, starMaterial);

    
    star.position.x = Math.random() * 300 - 100; 
    star.position.y = Math.random() * 300 - 100;
    star.position.z = Math.random() * 300 - 100;

    
    scene.add(star);
}


const starCount = 200; // Número de estrelas
for (let i = 0; i < starCount; i++) {
    createStar();
}


const gridYSize = 100;  // Tamanho no eixo Y
const gridYDivisions = 10;   // Número no eixo Y

const gridHelperY = new THREE.GridHelper(gridYSize, gridYDivisions);
gridHelperY.rotation.x = -Math.PI / 2;  // Rotaciona o plano para ficar horizontal
scene.add(gridHelperY);
gridHelperY.visible = false;  // Começa invisível

// Criação do plano de grade no eixo X
const gridXSize = 100;  
const gridXDivisions = 10;  

const gridHelperX = new THREE.GridHelper(gridXSize, gridXDivisions);
gridHelperX.rotation.y = -Math.PI / 2; 
scene.add(gridHelperX);
gridHelperX.visible = false;  // Começa invisível

// Adiciona lógica do botão para ativar/desativar a gravidade
const toggleGravityButton = document.getElementById('toggle-gravity');
let gravityEnabled = false;  // Estado da gravidade

toggleGravityButton.addEventListener('click', () => {
    gravityEnabled = !gravityEnabled;  // Alterna o estado
    gridHelperY.visible = gravityEnabled;  
    gridHelperX.visible = gravityEnabled;  
    toggleGravityButton.textContent = gravityEnabled ? 'Desativar Gravidade' : 'Ativar Gravidade';  // Altera o texto do botão
});


const toggleRotationButton = document.getElementById('toggle-rotation');
let rotationEnabled = true;  
toggleRotationButton.addEventListener('click', () => {
    rotationEnabled = !rotationEnabled; 
    toggleRotationButton.textContent = rotationEnabled ? 'Parar Rotação' : 'Iniciar Rotação'; 
});


const resetCameraButton = document.getElementById('reset-camera');

resetCameraButton.addEventListener('click', () => {
    camera.position.set(0, 0, 50);  
    controls.target.set(0, 0, 0);  
    controls.update();
});

// Posiciona a câmera
camera.position.z = 50;


function moveCameraTo(newPosition, duration) {
    const startPosition = camera.position.clone(); 
    const endPosition = new THREE.Vector3(...newPosition); 
    const startTime = performance.now(); 

    function animateCamera() {
        const elapsedTime = performance.now() - startTime; 
        const progress = Math.min(elapsedTime / duration, 1);

        
        camera.position.lerpVectors(startPosition, endPosition, progress);

        // Atualiza a câmera
        controls.update();

        // Verifica se a animação deve continuar
        if (progress < 1) {
            requestAnimationFrame(animateCamera); // Continua a animação
        }
    }

    animateCamera();
}


document.getElementById('go-to-earth').addEventListener('click', () => {
    moveCameraTo([0, 0, 15], 2000); // Mover para a posição da Terra em 2 segundos
});

document.getElementById('go-to-test').addEventListener('click', () => {
    moveCameraTo([4, 32, 56], 2000); 
});
document.getElementById('go-to-test2').addEventListener('click', () => {
    moveCameraTo([42, 60, 12], 2000);
});


// Controle de velocidade
let speedMultiplier = 0.2;  
const speedIncrement = 0.1; 

// Botão para aumentar a velocidade
document.getElementById('increase-speed').addEventListener('click', () => {
    speedMultiplier += speedIncrement;  // Aumenta o multiplicador de velocidade
    console.log(`Velocidade aumentada para: ${speedMultiplier}`);
});

// Botão para diminuir a velocidade
document.getElementById('decrease-speed').addEventListener('click', () => {
    speedMultiplier = Math.max(0, speedMultiplier - speedIncrement);  
    console.log(`Velocidade diminuída para: ${speedMultiplier}`);
});


function animate() {
    requestAnimationFrame(animate);
    
   
    if (rotationEnabled) {
        planets.forEach(planet => {
            planet.userData.angle += (planet.userData.speed * speedMultiplier);  // Atualiza o ângulo com a velocidade
            planet.position.x = planet.userData.distance * Math.cos(planet.userData.angle);
            planet.position.z = planet.userData.distance * Math.sin(planet.userData.angle);
        });
    }

    
    controls.update();
    renderer.render(scene, camera);
}


animate();

// Redimensiona a cena quando a janela muda de tamanho
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
