// Configurações iniciais da cena, câmera e renderizador
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x000000, 0);  // Fundo transparente

// Adiciona o renderizador ao container
document.getElementById('planet-container').appendChild(renderer.domElement);

// Controle de rotação
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;  
controls.dampingFactor = 0.05;  
controls.enableZoom = true;     
controls.autoRotate = false;    

// Criação do Sol
const sunGeometry = new THREE.SphereGeometry(3, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Adiciona uma luz que simula a luz solar
const sunLight = new THREE.PointLight(0xffffff, 2);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);

// Carregar a textura da Terra
const textureLoader = new THREE.TextureLoader();
const planets = []; // Declara o array de planetas

// Função para criar planetas com textura
function createPlanet(size, distance, texturePath, speed) {
    const geometry = new THREE.SphereGeometry(size, 32, 32);
    const material = new THREE.MeshStandardMaterial({
        map: textureLoader.load(texturePath) // Carregue a textura
    });
    const planet = new THREE.Mesh(geometry, material);
    planet.userData = { distance: distance, speed: speed, angle: 0 };  // Armazena distância e velocidade
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

// Adiciona luz ambiente para suavizar a aparência
const ambientLight = new THREE.AmbientLight(0x404040); 
scene.add(ambientLight);

// Carregar a textura da estrela
const starTexture = textureLoader.load('circle.png'); // Substitua pelo caminho da sua imagem

// Função para criar uma estrela em uma posição aleatória
function createStar() {
    const starGeometry = new THREE.PlaneGeometry(1, 1); // Tamanho da estrela
    const starMaterial = new THREE.MeshBasicMaterial({ map: starTexture, transparent: true }); // Usar a textura da estrela
    const star = new THREE.Mesh(starGeometry, starMaterial);

    // Define uma posição aleatória para a estrela
    star.position.x = Math.random() * 300 - 100; // Ajuste os valores conforme necessário
    star.position.y = Math.random() * 300 - 100;
    star.position.z = Math.random() * 300 - 100;

    // Adiciona a estrela à cena
    scene.add(star);
}

// Adicionar várias estrelas à cena
const starCount = 200; // Número de estrelas desejadas
for (let i = 0; i < starCount; i++) {
    createStar();
}

// Criação do plano de grade no eixo Y
const gridYSize = 100;  // Tamanho da grade no eixo Y
const gridYDivisions = 10;   // Número de divisões no eixo Y

const gridHelperY = new THREE.GridHelper(gridYSize, gridYDivisions);
gridHelperY.rotation.x = -Math.PI / 2;  // Rotaciona o plano para ficar horizontal
scene.add(gridHelperY);
gridHelperY.visible = false;  // Começa invisível

// Criação do plano de grade no eixo X
const gridXSize = 100;  // Tamanho da grade no eixo X
const gridXDivisions = 10;   // Número de divisões no eixo X

const gridHelperX = new THREE.GridHelper(gridXSize, gridXDivisions);
gridHelperX.rotation.y = -Math.PI / 2;  // Rotaciona o plano para ficar horizontal
scene.add(gridHelperX);
gridHelperX.visible = false;  // Começa invisível

// Adiciona lógica do botão para ativar/desativar a gravidade
const toggleGravityButton = document.getElementById('toggle-gravity');
let gravityEnabled = false;  // Estado da gravidade

toggleGravityButton.addEventListener('click', () => {
    gravityEnabled = !gravityEnabled;  // Alterna o estado
    gridHelperY.visible = gravityEnabled;  // Mostra ou oculta a grade Y
    gridHelperX.visible = gravityEnabled;  // Mostra ou oculta a grade X
    toggleGravityButton.textContent = gravityEnabled ? 'Desativar Gravidade' : 'Ativar Gravidade';  // Altera o texto do botão
});

// Controle de rotação
const toggleRotationButton = document.getElementById('toggle-rotation');
let rotationEnabled = true;  // Estado da rotação

toggleRotationButton.addEventListener('click', () => {
    rotationEnabled = !rotationEnabled;  // Alterna o estado
    toggleRotationButton.textContent = rotationEnabled ? 'Parar Rotação' : 'Iniciar Rotação';  // Altera o texto do botão
});

// Resetar a posição da câmera
const resetCameraButton = document.getElementById('reset-camera');

resetCameraButton.addEventListener('click', () => {
    camera.position.set(0, 0, 50);  // Reseta a posição da câmera
    controls.target.set(0, 0, 0);  // Reseta o alvo da câmera
    controls.update();
});

// Posiciona a câmera
camera.position.z = 50;

// Função para mover a câmera suavemente para uma nova posição
function moveCameraTo(newPosition, duration) {
    const startPosition = camera.position.clone(); // Posição inicial
    const endPosition = new THREE.Vector3(...newPosition); // Posição final
    const startTime = performance.now(); // Marca o tempo de início

    function animateCamera() {
        const elapsedTime = performance.now() - startTime; // Tempo decorrido
        const progress = Math.min(elapsedTime / duration, 1); // Progresso normalizado (0 a 1)

        // Interpolação linear entre a posição inicial e final
        camera.position.lerpVectors(startPosition, endPosition, progress);

        // Atualiza a câmera
        controls.update();

        // Verifica se a animação deve continuar
        if (progress < 1) {
            requestAnimationFrame(animateCamera); // Continua a animação
        }
    }

    animateCamera(); // Inicia a animação
}

// Adiciona o evento ao botão "Ir para a Terra"
document.getElementById('go-to-earth').addEventListener('click', () => {
    moveCameraTo([0, 0, 15], 2000); // Mover para a posição da Terra em 2 segundos
});
// Adiciona o evento ao botão "Ir para a Terra"
document.getElementById('go-to-test').addEventListener('click', () => {
    moveCameraTo([4, 32, 56], 2000); // Mover para a posição da Terra em 2 segundos
});
document.getElementById('go-to-test2').addEventListener('click', () => {
    moveCameraTo([42, 60, 12], 2000); // Mover para a posição da Terra em 2 segundos
});


// Controle de velocidade
let speedMultiplier = 0.2;  // Multiplicador de velocidade inicial
const speedIncrement = 0.1;  // Incremento/decremento da velocidade

// Botão para aumentar a velocidade
document.getElementById('increase-speed').addEventListener('click', () => {
    speedMultiplier += speedIncrement;  // Aumenta o multiplicador de velocidade
    console.log(`Velocidade aumentada para: ${speedMultiplier}`);
});

// Botão para diminuir a velocidade
document.getElementById('decrease-speed').addEventListener('click', () => {
    speedMultiplier = Math.max(0, speedMultiplier - speedIncrement);  // Diminui o multiplicador de velocidade, mas não deixa cair abaixo de 0
    console.log(`Velocidade diminuída para: ${speedMultiplier}`);
});

// Função de animação
function animate() {
    requestAnimationFrame(animate);
    
    // Atualiza a órbita dos planetas, se a rotação estiver habilitada
    if (rotationEnabled) {
        planets.forEach(planet => {
            planet.userData.angle += (planet.userData.speed * speedMultiplier);  // Atualiza o ângulo com a velocidade
            planet.position.x = planet.userData.distance * Math.cos(planet.userData.angle);
            planet.position.z = planet.userData.distance * Math.sin(planet.userData.angle);
        });
    }

    // Atualiza o controle de câmera e renderização
    controls.update();
    renderer.render(scene, camera);
}

// Inicia a animação
animate();

// Redimensiona a cena quando a janela muda de tamanho
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
