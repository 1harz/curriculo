document.getElementById('start-button').addEventListener('click', function() {
    const fadeOverlay = document.querySelector('.fade-out-overlay');
    fadeOverlay.classList.add('fade-out-active');
    setTimeout(function() {
        window.location.href = 'curriculo.html';
    }, 500);
});

// Configurações para o canvas animado
const canvas = document.getElementById('background-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];
const numberOfParticles = 30;

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 5 + 1;
        this.speedX = (Math.random() * 1.5) - 0.75; // Velocidade reduzida
        this.speedY = (Math.random() * 1.5) - 0.75; // Velocidade reduzida
        this.alpha = 0; // Transparência inicial
        this.fadeSpeed = Math.random() * 0.005 + 0.002; // Velocidade de fade
        this.fadingIn = true;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Aparecimento gradual
        if (this.fadingIn) {
            this.alpha += this.fadeSpeed;
            if (this.alpha >= 0.8) this.fadingIn = false;
        } else {
            // Desaparecimento gradual
            this.alpha -= this.fadeSpeed;
            if (this.alpha <= 0) {
                this.reset();
            }
        }

        // Reaparece do outro lado se sair da tela
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.reset();
        }
    }

    draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 5 + 1;
        this.speedX = (Math.random() * 1.5) - 0.75; // Velocidade reduzida
        this.speedY = (Math.random() * 1.5) - 0.75; // Velocidade reduzida
        this.alpha = 0;
        this.fadingIn = true;
    }
}

function init() {
    particlesArray = [];
    for (let i = 0; i < numberOfParticles; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        particlesArray.push(new Particle(x, y));
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesArray.forEach(particle => {
        particle.update();
        particle.draw();
    });
    requestAnimationFrame(animate);
}

// Ajusta o canvas quando a janela é redimensionada
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

// Inicializa e anima as partículas
init();
animate();
