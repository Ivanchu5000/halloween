let score = 0;
let minTimeInterval = 1500;
let maxTimeInterval = 1700;
let pumpkinInterval;
let gameOver = false;

const gameArea = document.getElementById('game');
const scoreDisplay = document.getElementById('score');
const gameOverScreen = document.getElementById('game-over');
const winScreen = document.getElementById('win');
const customCursor = document.getElementById('custom-cursor'); // Nuevo cursor personalizado

function startGame() {
    gameOver = false;
    score = 0;
    minTimeInterval = 1500;
    maxTimeInterval = 1700;
    scoreDisplay.textContent = `Puntuación: ${score}`;
    gameOverScreen.classList.add('hidden');
    winScreen.classList.add('hidden');
    
    // Limpiar cualquier intervalo de calabaza anterior
    if (pumpkinInterval) clearTimeout(pumpkinInterval);

    dropPumpkin();
}

// Función para mover el cursor personalizado
document.addEventListener('mousemove', (event) => {
    const mouseX = event.pageX;
    const mouseY = event.pageY;
    customCursor.style.left = `${mouseX}px`;
    customCursor.style.top = `${mouseY}px`;
});

// Función para hacer que el cursor rote 90 grados y vuelva a su posición original cuando se haga clic
document.addEventListener('click', () => {
    customCursor.style.transform = 'translate(-50%, -50%) rotate(90deg)'; // Rota 90 grados
    setTimeout(() => {
        customCursor.style.transform = 'translate(-50%, -50%) rotate(0deg)'; // Vuelve a la posición original
    }, 50); // Vuelve a la posición original después de 200 ms
});

function dropPumpkin() {
    // Crea una nueva calabaza
    const newPumpkin = document.createElement('div');
    newPumpkin.classList.add('pumpkin');
    
    // Posición aleatoria en el eje X
    const pumpkinLeft = Math.random() * 950; // Ajusta según el ancho del área de juego
    newPumpkin.style.left = `${pumpkinLeft}px`;

    gameArea.appendChild(newPumpkin);

    let pumpkinPosition = -100;
    let fallingSpeed = 1; // Velocidad inicial de la calabaza
    let dropInterval = setInterval(() => {
        if (gameOver) return clearInterval(dropInterval);

        pumpkinPosition += fallingSpeed;
        newPumpkin.style.top = `${pumpkinPosition}px`;

        // Aumentar la velocidad lentamente
        fallingSpeed += 0.01; // Incremento lento en la velocidad

        // Si la calabaza llega al fondo de la pantalla, termina el juego
        if (pumpkinPosition >= 450) {
            clearInterval(dropInterval);
            newPumpkin.remove(); // Elimina la calabaza que ha llegado al fondo
            endGame();
        }
    }, 16);

    // Añadir el evento de clic para destruir la calabaza con animación de aplastamiento
    newPumpkin.addEventListener('click', () => {
        clearInterval(dropInterval); // Detener el movimiento de esta calabaza
        
        // Aplastar la calabaza (reducir altura a 0)
        newPumpkin.style.height = '0px';
        
        // Después de 200ms, eliminar la calabaza del DOM
        setTimeout(() => {
            newPumpkin.remove(); 
        }, 200);

        score++;
        scoreDisplay.textContent = `Puntuación: ${score}`;

        // Verificar si el jugador ha ganado
        if (score >= 50) {
            winGame();
            return;
        }

        // Reducir el intervalo de aparición
        if (minTimeInterval > 300) minTimeInterval -= 20;
        if (maxTimeInterval > 500) maxTimeInterval -= 20;
    });

    // Después de un intervalo de tiempo aleatorio, cae otra calabaza
    pumpkinInterval = setTimeout(() => {
        dropPumpkin();
    }, randomTimeInterval());
}

function randomTimeInterval() {
    return Math.floor(Math.random() * (maxTimeInterval - minTimeInterval) + minTimeInterval);
}

function endGame() {
    gameOver = true;
    gameOverScreen.classList.remove('hidden');

    // Reiniciar el intervalo de tiempos de aparición al perder
    minTimeInterval = 1500;
    maxTimeInterval = 1700;
    
    // Limpiar cualquier intervalo activo para evitar nuevas calabazas
    if (pumpkinInterval) clearTimeout(pumpkinInterval);
    
    // Limpiar todas las calabazas restantes
    document.querySelectorAll('.pumpkin').forEach(pumpkin => pumpkin.remove());
}

function winGame() {
    gameOver = true;
    winScreen.classList.remove('hidden');

    // Reiniciar el intervalo de tiempos de aparición al ganar
    minTimeInterval = 1500;
    maxTimeInterval = 1700;

    // Limpiar cualquier intervalo activo para evitar nuevas calabazas
    if (pumpkinInterval) clearTimeout(pumpkinInterval);

    // Limpiar todas las calabazas restantes
    document.querySelectorAll('.pumpkin').forEach(pumpkin => pumpkin.remove());
}

function restartGame() {
    startGame();
}

// Iniciar el juego cuando la página se carga
window.onload = startGame;
