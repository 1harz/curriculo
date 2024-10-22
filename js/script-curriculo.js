// Funcao que aplica o modo escuro e atualiza a escrita do botao
const darkModeToggle = document.getElementById('dark-mode-toggle');
const body = document.body;

if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
    darkModeToggle.textContent = 'Modo Claro';
}

darkModeToggle.addEventListener('click', function() {
    body.classList.toggle('dark-mode');

    if (body.classList.contains('dark-mode')) {
        darkModeToggle.textContent = 'Modo Claro';
        localStorage.setItem('theme', 'dark');
    } else {
        darkModeToggle.textContent = 'Modo Escuro';
        localStorage.setItem('theme', 'light');
    }
});

//Funcao da funcionalidade carrossel no hero

let currentImageIndex = 0;
const images = document.querySelectorAll('.carousel-images img');
const indicators = document.querySelectorAll('.indicator');

function showImage(index) {
    images.forEach((img, i) => {
        img.classList.toggle('active', i === index);
    });
    indicators.forEach((indicator, i) => {
        indicator.classList.toggle('active', i === index);
    });
}

function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    showImage(currentImageIndex);
}

indicators.forEach(indicator => {
    indicator.addEventListener('click', () => {
        currentImageIndex = parseInt(indicator.getAttribute('data-index'));
        showImage(currentImageIndex);
    });
});

setInterval(nextImage, 3000); //3 segundos (3000ms) para trocar a imagem

// Funcao da funcionalidade de voltar ao topo
const backToTopButton = document.getElementById('back-to-top');

window.addEventListener('scroll', function() {
    if (window.scrollY > 200) {
        backToTopButton.classList.add('show');
    }else {
        backToTopButton.classList.remove('show');
    }
});

backToTopButton.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

//Funcao que calcula a idade para manter atualizado no html

function calcularIdade(dataNascimento) {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();

    return idade;
}

const idade = calcularIdade("2002-07-05");
document.getElementById("idade").textContent = idade;

document.getElementById('hamburger-menu').addEventListener('click', function() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('open');
});

window.addEventListener('resize', function() {
    const navLinks = document.querySelector('.nav-links');
    const hamburgerMenu = document.getElementById('hamburger-menu');
    
    if (window.innerWidth > 576 && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
    }
});

//Funcao que mantem o alinhamento

window.onload = function() {
    stickFooter();
};

window.onresize = function() {
    stickFooter();
};

function stickFooter() {
    var bodyHeight = document.body.offsetHeight;
    var windowHeight = window.innerHeight;
    var footer = document.querySelector('footer');

    if (bodyHeight < windowHeight) {
        footer.classList.add('sticky-footer');
    } else {
        footer.classList.remove('sticky-footer');
    }
}

