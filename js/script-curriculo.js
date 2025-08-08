const translations = {
    "pt-BR": {
        "about": "Sobre Mim",
        "experience": "Experiência",
        "skills": "Habilidades",
        "portfolio": "Portifólio",
        "contact": "Contato",
        "hero_title": "Olá, eu sou o Raul. Um entusiasta e estudante de TI",
        "hero_subtitle": "&lt;&gt; Entusiasta em desenvolvimento de soluções que resolvam problemas de forma eficaz e eficiente utilizando a tecnologia &lt;/&gt;.",
        "contact_me": "Entre em Contato",
        "view_experience": "Ver Experiência",
        "scroll_down": "Role para baixo",
        "about_title": "Quem sou eu?",
        "about_text1": "Meu nome é <span>Raul Fragoso</span>, tenho <span id=\"idade\"></span> anos e sou natural de Brasília. Concluí o ensino básico no Centro Educacional Leonardo da Vinci e, atualmente, estou fazendo dois bacharelados, um no Centro Universitário de Brasília - CEUB e outro na Universidade de Brasília - UnB 📑.",
        "about_text2": "Tenho como objetivo principal me inserir em um ambiente onde eu possa aplicar e desenvolver minhas habilidades em desenvolvimento de software. Nesse sentido, minha meta é adquirir experiência prática em um ambiente profissional dinâmico, contribuindo com projetos inovadores que otimizem processos e melhorem a experiência dos usuários. Estou motivado a aprender novas tecnologias e colaborar em equipes, visando crescimento profissional no campo de TI.",
        "about_text3": "Não deixe de entrar em contato, será um prazer te conhecer! 👊",
        "skills_title": "Habilidades",
        "flip_all_cards": "Virar Todas as Cartas",
        "frontend": "Frontend",
        "backend": "Backend",
        "tools": "Ferramentas",
        "others": "Outros",
        "experience_title": "Experiência",
        "degree1": "Bacharelado em Ciências da Computação",
        "degree1_desc": "Centro Universitário de Brasília - CEUB, atualmente no 5º semestre",
        "experience_title2": "Experiências e Certificados",
        "experience1": "Freelancer em Edição de Vídeos (17 a 20 anos) e como programador Web",
        "experience2": "Certificado de conclusão em C, Python, HTML e CSS, com outros cursos em andamento.",
        "present": "Presente",
        "portfolio_title": "Portifólio",
        "portfolio_desc": "Confira meus projetos diretamente no GitHub clicando no link abaixo.",
        "portfolio_github_desc": "Todos meus projetos open-source e contribuições",
        "portfolio_projects_desc": "Diversos projetos pessoais e acadêmicos",
        "visit_github": "Visitar GitHub",
        "projects": "Projetos",
        "request_access": "Solicitar Acesso",
        "contact_title": "Contato",
        "get_in_touch": "Entre em contato",
        "contact_text": "Estou interessado em oportunidades de trabalho, projetos freelance ou apenas bater um papo sobre tecnologia.",
        "name": "Nome:",
        "email": "Email:",
        "message": "Mensagem:",
        "send": "Enviar Mensagem",
        "whatsapp": "(61) 98407-8564",
        "linkedin": "linkedin.com/in/raulfalluh",
        "footer_tagline": "Desenvolvedor e Estudante de TI",
        "rights": "Todos os direitos reservados."
    },
    "en-US": {
        "about": "About Me",
        "experience": "Experience",
        "skills": "Skills",
        "flip_all_cards": "Show All Cards",
        "portfolio": "Portfolio",
        "contact": "Contact",
        "hero_title": "Hi, I'm Raul. A tech enthusiast and student",
        "hero_subtitle": "&lt;&gt; Enthusiast in developing solutions that solve problems effectively and efficiently using technology &lt;/&gt;.",
        "contact_me": "Contact Me",
        "view_experience": "View Experience",
        "scroll_down": "Scroll down",
        "about_title": "Who am I?",
        "about_text1": "My name is <span>Raul Fragoso</span>, I'm <span id=\"idade\"></span> years old and I'm from Brasília. I completed my basic education at Centro Educacional Leonardo da Vinci and I'm currently pursuing two bachelor's degrees, one at Centro Universitário de Brasília - CEUB and another at Universidade de Brasília - UnB 📑.",
        "about_text2": "My main objective is to join an environment where I can apply and develop my skills in software development. In this sense, my goal is to gain practical experience in a dynamic professional environment, contributing to innovative projects that optimize processes and improve user experience. I'm motivated to learn new technologies and collaborate in teams, aiming for professional growth in the IT field.",
        "about_text3": "Don't hesitate to get in touch, it will be a pleasure to meet you! 👊",
        "skills_title": "Skills",
        "frontend": "Frontend",
        "backend": "Backend",
        "tools": "Tools",
        "others": "Others",
        "experience_title": "Experience",
        "degree1": "Bachelor's in Computer Science",
        "degree1_desc": "Centro Universitário de Brasília - CEUB, currently in the 5th semester",
        "degree2": "Bachelor's in Software Engineering",
        "degree2_desc": "Universidade de Brasília - UnB, currently in the 5th semester",
        "experience_title2": "Experiences and Certificates",
        "experience1": "Freelancer in Video Editing (ages 17 to 20) and as a Web Developer",
        "experience2": "Certificates of completion in C, Python, HTML and CSS, with other courses in progress.",
        "present": "Present",
        "portfolio_title": "Portfolio",
        "portfolio_desc": "Check out my projects directly on GitHub by clicking the link below.",
        "portfolio_github_desc": "All my open-source projects and contributions",
        "portfolio_projects_desc": "Various personal and academic projects",
        "visit_github": "Visit GitHub",
        "projects": "Projects",
        "request_access": "Request Access",
        "contact_title": "Contact",
        "get_in_touch": "Get in touch",
        "contact_text": "I'm interested in job opportunities, freelance projects or just chatting about technology.",
        "name": "Name:",
        "email": "Email:",
        "message": "Message:",
        "send": "Send Message",
        "whatsapp": "+55 61 98407-8564",
        "linkedin": "linkedin.com/in/raulfalluh",
        "footer_tagline": "Developer and IT Student",
        "rights": "All rights reserved."
    }
};

const hamburgerMenu = document.getElementById('hamburger-menu');
const navLinks = document.querySelector('.nav-links');

hamburgerMenu.addEventListener('click', function(e) {
    e.stopPropagation();
    this.classList.toggle('open');
    navLinks.classList.toggle('open');
});

document.addEventListener('click', function(e) {
    if (!navLinks.contains(e.target) && !hamburgerMenu.contains(e.target)) {
        hamburgerMenu.classList.remove('open');
        navLinks.classList.remove('open');
    }
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburgerMenu.classList.remove('open');
        navLinks.classList.remove('open');
    });
});

function changeLanguage(language) {
    document.documentElement.lang = language;
    
    const form = document.getElementById('contact-form');
    if (form) {
        form.setAttribute('_language', language);
    }
    
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[language] && translations[language][key]) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translations[language][key];
            } else {
                element.innerHTML = translations[language][key];
            }
        }
    });
    
    const languageToggle = document.getElementById('language-toggle');
    if (languageToggle) {
        languageToggle.textContent = language === 'pt-BR' ? 'EN' : 'PT';
    }
    
    localStorage.setItem('language', language);
}

const savedLanguage = localStorage.getItem('language') || 
    (navigator.language.startsWith('pt') ? 'pt-BR' : 'en-US');

changeLanguage(savedLanguage);

document.getElementById('language-toggle').addEventListener('click', function() {
    const currentLang = document.documentElement.lang;
    const newLang = currentLang === 'pt-BR' ? 'en-US' : 'pt-BR';
    changeLanguage(newLang);
});


const darkModeToggle = document.getElementById('dark-mode-toggle');
const html = document.documentElement;

function applySavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        html.setAttribute('data-theme', 'dark');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        html.removeAttribute('data-theme');
        darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
}

applySavedTheme();

darkModeToggle.addEventListener('click', function() {
    if (html.getAttribute('data-theme') === 'dark') {
        html.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
        html.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
});

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('theme')) {
        applySavedTheme();
    }
});

function init3DParallax() {
  const hero = document.getElementById('hero');
  const container = document.querySelector('.hero-3d-container');
  const content = document.querySelector('.hero-content');
  const image = document.querySelector('.hero-image-container');
  const textElements = document.querySelectorAll('.hero-text h2, .hero-text p');
  
  hero.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const { width, height, left, top } = hero.getBoundingClientRect();
    
    // Posição normalizada (-0.5 a 0.5)
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;
    
    // Movimento 3D
    container.style.transform = `
      rotateY(${x * 10}deg)
      rotateX(${y * -10}deg)
    `;
    
    // Parallax dos elementos
    content.style.transform = `
      translateX(${x * -30}px)
      translateY(${y * -20}px)
      scale(${1 - Math.abs(x) * 0.05})
    `;
    
    image.style.transform = `
      translateX(${x * 40}px)
      translateY(${y * 30}px)
      scale(${1 + Math.abs(x) * 0.05})
    `;
    
    // Efeito de inclinação no texto
    textElements.forEach((el, i) => {
      const delay = i * 0.1;
      el.style.transform = `
        translateX(${x * 20 * (i + 1)}px)
        translateY(${y * 10 * (i + 1)}px)
        rotate(${x * 5}deg)
      `;
    });
    
    // Efeito de brilho dinâmico
    const glowX = (x + 0.5) * 100;
    const glowY = (y + 0.5) * 100;
    hero.style.background = `
      radial-gradient(
        circle at ${glowX}% ${glowY}%,
        rgba(67, 97, 238, 0.1) 0%,
        rgba(67, 97, 238, 0) 70%
      )
    `;
  });
  
  // Reset ao sair
  hero.addEventListener('mouseleave', () => {
    container.style.transform = '';
    content.style.transform = '';
    image.style.transform = '';
    textElements.forEach(el => el.style.transform = '');
    hero.style.background = '';
  });
}

window.addEventListener('load', init3DParallax);

function initSkillsCards() {
    const cards = document.querySelectorAll('.skills-card');
    const flipAllButton = document.getElementById('flip-all-cards');
    let allFlipped = false;
    
    cards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
        });
    });
    
    flipAllButton.addEventListener('click', () => {
        allFlipped = !allFlipped;
        
        cards.forEach(card => {
            if (allFlipped) {
                card.classList.add('flipped');
            } else {
                card.classList.remove('flipped');
            }
        });

        const span = flipAllButton.querySelector('span');
        if (allFlipped) {
            span.setAttribute('data-i18n', 'unflip_all_cards');
            span.textContent = 'Virar Todas de Volta';
        } else {
            span.setAttribute('data-i18n', 'flip_all_cards');
            span.textContent = 'Virar Todas as Cartas';
        }
    });
}

window.addEventListener('load', initSkillsCards);

function initBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');
    
    if (!backToTopButton) return;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });
    
    backToTopButton.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

window.addEventListener('load', function() {
    initBackToTop();
});