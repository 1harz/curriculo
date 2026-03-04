// 1. Translations Dictionary
const i18n = {
    pt: {
        loader: "INICIALIZANDO_SISTEMA",
        nav_about: "// SOBRE",
        nav_directives: "// DIRETRIZES",
        nav_skills: "// TECNOLOGIAS",
        nav_experience: "// EXPERIÊNCIA",
        nav_contact: "// CONTATO",
        hero_eyebrow: "CRIANDO EXPERIÊNCIAS DIGITAIS",
        hero_subtext: "DESENVOLVEDOR FULL STACK // ENGENHARIA DE SOFTWARE",
        sec_about: "QUEM SOU EU",
        about_p1: "Sou estudante de Ciência da Computação e desenvolvedor Full Stack especializado em ecossistemas de alta performance (ReactJS, Node.js/NestJS, TypeScript e PostgreSQL). Tenho me aprofundado no desenvolvimento de sistemas logísticos críticos, mergulhando no processamento de documentos fiscais (CTe, NF-e, NFS-e), integração de APIs RESTful com Swagger e criação de dashboards analíticos.",
        about_p2: "<strong>Foco Atual: Engenharia de Software + IA.</strong> Minha dedicação atual está na convergência entre o desenvolvimento tradicional e a inteligência artificial. Estou aprofundando conhecimentos em Agentes de IA e frameworks de automação inteligente.",
        sec_directives: "DIRETRIZES GERAIS",
        dir_lead: "Os pilares que guiam minha arquitetura de código e decisões de engenharia no escopo do projeto.",
        dir_t1: "Escalabilidade",
        dir_d1: "Estruturação de sistemas visando alto volume. Arquitetura em camadas e cache eficiente (Redis) para aplicações que crescem.",
        dir_t2: "Clean Code & SOLID",
        dir_d2: "Código testável, limpo e documentado. A adoção de boas práticas diminui a fricção na manutenção do longo prazo.",
        dir_t3: "Integração com IA",
        dir_d3: "Utilização de LLMs modernos e agentes automatizados para impulsionar a experiência do usuário e otimizar rotinas.",
        sec_skills: "TECNOLOGIAS",
        sg_frontend: "Frontend",
        sg_backend: "Backend",
        sg_mobile: "Mobile",
        sg_tools: "Ferramentas",
        sg_others: "Outros",
        sec_experience: "EXPERIÊNCIA",
        tl_date1: "SET 2025 - PRESENTE",
        tl_title1: "Estágio - Full Stack",
        tl_desc1: "Desenvolvimento Full Stack de sistemas logísticos (TMS, WMS, ERP). Dashboards interativos, emissão de documentos fiscais, autenticação RBAC.",
        tl_date2: "2023 - PRESENTE",
        tl_title2: "Ciência da Computação",
        tl_desc2: "Formação superior com foco em algoritmos, arquitetura de sistemas e metodologias ágeis (Atualmente 7º semestre).",
        tl_date3: "2021 - 2023",
        tl_title3: "Freelancer & Editor",
        tl_desc3: "Edição de vídeos e programação web para projetos variados. Formação na base de HTML/CSS/JS e Python.",
        tl_date4: "FUTURO",
        tl_title4: "Próximo Desafio",
        tl_desc4: "Sempre buscando o próximo grande desafio para criar soluções escaláveis e modernas.",
        sec_portfolio: "GITHUB",
        github_link: "VER GITHUB",
        sec_contact: "CONTATO",
        form_name: "NOME",
        form_name_ph: "Seu nome",
        form_email: "EMAIL",
        form_email_ph: "email@dominio.com",
        form_message: "MENSAGEM",
        form_message_ph: "Olá Raul...",
        form_submit: "ENVIAR MENSAGEM",
        info_whatsapp: "WHATSAPP",
        info_email: "EMAIL",
        info_linkedin: "LINKEDIN",
        info_location: "LOCALIZAÇÃO",
        developed_by: "DESENVOLVIDO POR",
    },
    en: {
        loader: "SYSTEM_INITIATION",
        nav_about: "// ABOUT",
        nav_directives: "// DIRECTIVES",
        nav_skills: "// TECH STACK",
        nav_experience: "// EXPERIENCE",
        nav_contact: "// CONTACT",
        hero_eyebrow: "CRAFTING DIGITAL EXPERIENCES",
        hero_subtext: "FULL STACK DEV // SOFTWARE ENGINEERING",
        sec_about: "WHO AM I",
        about_p1: "I am a Computer Science student and Full Stack developer specializing in high-performance ecosystems (ReactJS, Node.js/NestJS, TypeScript, and PostgreSQL). I have been diving deep into critical logistics systems, working on fiscal document processing (CTe, NF-e, NFS-e), RESTful API integration with Swagger, and analytical dashboards.",
        about_p2: "<strong>Current Focus: Software Engineering + AI.</strong> My current dedication is at the convergence of traditional development and artificial intelligence. I am deepening my knowledge in AI Agents and intelligent automation frameworks.",
        sec_directives: "CORE DIRECTIVES",
        dir_lead: "The pillars that guide my code architecture and engineering decisions within the project scope.",
        dir_t1: "Scalability",
        dir_d1: "System structuring aimed at high volume. Layered architecture and efficient caching (Redis) for growing applications.",
        dir_t2: "Clean Code & SOLID",
        dir_d2: "Testable, clean, and documented code. Adopting best practices reduces friction in long-term maintenance.",
        dir_t3: "AI Integration",
        dir_d3: "Utilization of modern LLMs and automated agents to boost user experience and optimize routines.",
        sec_skills: "TECH STACK",
        sg_frontend: "Frontend",
        sg_backend: "Backend",
        sg_mobile: "Mobile",
        sg_tools: "Tools",
        sg_others: "Others",
        sec_experience: "EXPERIENCE",
        tl_date1: "SEP 2025 - PRESENT",
        tl_title1: "Internship - Full Stack",
        tl_desc1: "Full Stack development of logistics systems (TMS, WMS, ERP). Interactive dashboards, fiscal document emission, RBAC authentication.",
        tl_date2: "2023 - PRESENT",
        tl_title2: "Computer Science",
        tl_desc2: "Bachelor's degree focusing on algorithms, systems architecture, and agile methodologies (Currently in 7th semester).",
        tl_date3: "2021 - 2023",
        tl_title3: "Freelancer & Editor",
        tl_desc3: "Video editing and web programming for various projects. Basic training in HTML/CSS/JS and Python.",
        tl_date4: "FUTURE",
        tl_title4: "Next Challenge",
        tl_desc4: "Always looking for the next big challenge to build scalable and modern solutions.",
        sec_portfolio: "GITHUB",
        github_link: "VIEW GITHUB",
        sec_contact: "CONTACT",
        form_name: "NAME",
        form_name_ph: "Your name",
        form_email: "EMAIL",
        form_email_ph: "email@domain.com",
        form_message: "MESSAGE",
        form_message_ph: "Hello Raul...",
        form_submit: "SEND MESSAGE",
        info_whatsapp: "WHATSAPP",
        info_email: "EMAIL",
        info_linkedin: "LINKEDIN",
        info_location: "LOCATION",
        developed_by: "DEVELOPED BY",
    }
};

// Language Toggle Logic
let currentLang = 'pt';
const langToggleBtn = document.getElementById('lang-toggle');

function setLanguage(lang) {
    currentLang = lang;
    langToggleBtn.innerText = lang === 'pt' ? 'EN' : 'PT';

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (i18n[lang][key]) {
            el.innerHTML = i18n[lang][key];
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (i18n[lang][key]) {
            el.placeholder = i18n[lang][key];
        }
    });

    // We can also swap the scramble text string to PT or EN
    const scrambler = document.getElementById('loader-scramble');
    if (scrambler && scrambler.innerText !== 'SYSTEM_READY') {
        scrambler.innerText = lang === 'pt' ? 'INICIALIZANDO...' : 'INITIALIZING...';
    }
}
if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
        setLanguage(currentLang === 'pt' ? 'en' : 'pt');
        // Refresh ScrollTrigger to recalculate metrics after text changes
        setTimeout(() => ScrollTrigger.refresh(), 100);
    });
}
setLanguage('pt'); // Default to PT

// 2. Initialize Lenis Smooth Scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Tie Lenis to GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// 3. Custom Cursor & Text Changing
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');
const cursorText = document.getElementById('cursor-text');

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 500, fill: "forwards" });

    if (cursorText) {
        cursorText.style.left = `${posX}px`;
        cursorText.style.top = `${posY}px`;
    }
});

// Cursor hover effect on links & specific classes
const hoverElements = document.querySelectorAll('a, button, input, textarea, .interactive-row');
hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursorOutline.style.width = '60px';
        cursorOutline.style.height = '60px';
        cursorOutline.style.borderColor = 'var(--text)';
        cursorOutline.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';

        if (el.classList.contains('cursor-hover')) {
            const text = el.getAttribute('data-cursor') || 'VIEW';
            cursorText.innerText = text;
            cursorText.style.opacity = '1';
        }
    });
    el.addEventListener('mouseleave', () => {
        cursorOutline.style.width = '40px';
        cursorOutline.style.height = '40px';
        cursorOutline.style.borderColor = 'rgba(255, 255, 255, 0.5)';
        cursorOutline.style.backgroundColor = 'transparent';
        cursorText.style.opacity = '0';
    });
});

// 4. Loading Animation with fast scramble text
document.body.style.overflow = 'hidden';
let loadProgress = 0;
const loaderBar = document.querySelector('.loader-bar');
const loaderCounter = document.querySelector('.loader-counter');
const scrambleEl = document.getElementById('loader-scramble');

const fastChars = '!<>-_\\/[]{}—=+*^?#_';
const scrambleTimer = setInterval(() => {
    if (scrambleEl && loadProgress < 100) {
        let text = scrambleEl.innerText;
        let randomChar = fastChars[Math.floor(Math.random() * fastChars.length)];
        let idx = Math.floor(Math.random() * text.length);
        let newText = text.substring(0, idx) + randomChar + text.substring(idx + 1);
        scrambleEl.innerText = newText;
    }
}, 50);

const loadTimer = setInterval(() => {
    loadProgress += Math.floor(Math.random() * 10) + 2;
    if (loadProgress > 100) loadProgress = 100;

    loaderCounter.innerText = (loadProgress < 10 ? '0' : '') + loadProgress;
    loaderBar.style.width = `${loadProgress}%`;

    if (loadProgress === 100) {
        clearInterval(loadTimer);
        clearInterval(scrambleTimer);
        if (scrambleEl) scrambleEl.innerText = 'SYSTEM_READY';
        setTimeout(revealSite, 600);
    }
}, 100);

function revealSite() {
    const tl = gsap.timeline();

    tl.to('.loader', {
        y: '-100%',
        duration: 1,
        ease: 'power4.inOut',
        onComplete: () => {
            document.body.style.overflow = '';
            document.querySelector('.loader').style.display = 'none';
        }
    })
        .to('.hero-text-anim .line', {
            y: '0%',
            duration: 1.2,
            stagger: 0.1,
            ease: 'power4.out'
        }, "-=0.2")
        .fromTo('.hero-image-wrapper',
            { scale: 1.1, opacity: 0, clipPath: 'inset(100% 0 0 0)' },
            { scale: 1, opacity: 1, clipPath: 'inset(0% 0 0 0)', duration: 1.5, ease: 'power4.inOut' },
            "-=1"
        );
}

// 5. Global ScrollTrigger animations

// Title Reveals (Every section title)
const sectionTitles = document.querySelectorAll('.section-title .line');
sectionTitles.forEach(title => {
    gsap.to(title, {
        scrollTrigger: {
            trigger: title.parentNode,
            start: "top 85%",
        },
        y: '0%',
        duration: 1.2,
        ease: 'power4.out'
    });
});

// About Image Reveal (Clip Path Animation)
const aboutImgWrapper = document.querySelector('.img-reveal-wrapper');
if (aboutImgWrapper) {
    gsap.to(aboutImgWrapper, {
        scrollTrigger: {
            trigger: aboutImgWrapper,
            start: "top 80%",
        },
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
        duration: 1.5,
        ease: 'power4.inOut'
    });

    gsap.from('.about-img', {
        scrollTrigger: {
            trigger: aboutImgWrapper,
            start: "top 80%",
            end: "bottom top",
            scrub: 1
        },
        scale: 1.2,
        y: '10%',
        ease: 'none'
    });
}

// Marquee infinite scroll + Reversing on wheel direction
const marqueeInner = document.querySelector('.marquee-inner');
if (marqueeInner) {
    let marqueeText = marqueeInner.innerHTML;
    marqueeInner.innerHTML = marqueeText + marqueeText;

    let marqueeTween = gsap.to(marqueeInner, {
        xPercent: -50,
        ease: "none",
        duration: 20,
        repeat: -1
    });

    ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
            // Speed up and reverse based on scroll direction
            gsap.to(marqueeTween, {
                timeScale: self.direction === 1 ? 1.5 : -1.5,
                duration: 0.5,
                overwrite: true
            });
            // return to normal
            gsap.to(marqueeTween, {
                timeScale: self.direction === 1 ? 1 : -1,
                duration: 0.5,
                delay: 0.5,
                overwrite: 'auto'
            });
        }
    });
}

// Parallax Hero Container
gsap.to('.wrapper-parallax', {
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
    },
    y: '20%',
    ease: 'none'
});

// Scrubbing Giant Text
const scrubText = document.querySelector('.scrub-text');
if (scrubText) {
    gsap.to(scrubText, {
        xPercent: -60,
        ease: 'none',
        scrollTrigger: {
            trigger: '.scrub-container',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
        }
    });
}

// Directives Pinned Left Section
const dirLeft = document.querySelector('.dir-left');
const directivesSec = document.querySelector('.directives');
if (dirLeft && directivesSec) {
    let mm = gsap.matchMedia();
    mm.add("(min-width: 901px)", () => {
        ScrollTrigger.create({
            trigger: directivesSec,
            start: "top 20%",
            end: "bottom 80%",
            pin: dirLeft,
            pinSpacing: false
        });
    });

    // Fade in right cards
    const dirCards = document.querySelectorAll('.dir-card');
    dirCards.forEach(card => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 80%'
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });
    });
}

// Skills Interactive Hover Image (Following Cursor)
const skillsWrap = document.querySelector('.skills-list-wrap');
const hoverImgWrap = document.querySelector('.hover-reveal-img');
const hriInner = document.querySelector('.hri-inner');

if (skillsWrap && hoverImgWrap) {
    const rows = document.querySelectorAll('.skill-row');

    // Map text for different rows
    const tags = {
        'frontend': 'UI/UX_RENDER',
        'backend': 'CORE_SYS_ACTIVE',
        'mobile': 'MOBILE_SYNC',
        'tools': 'INFRA_READY',
        'others': 'ARCH_SOLID'
    };

    rows.forEach(row => {
        row.addEventListener('mouseenter', () => {
            hoverImgWrap.classList.add('active');
            let t = row.getAttribute('data-tech');
            hriInner.innerText = tags[t] || 'MATCH_FOUND';
        });
        row.addEventListener('mouseleave', () => {
            hoverImgWrap.classList.remove('active');
        });
    });

    skillsWrap.addEventListener('mousemove', (e) => {
        gsap.to(hoverImgWrap, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
}


// Horizontal Scroll for Experience Section
const horizontalSection = document.querySelector('.horizontal-scroll-content');
const horizontalWrapper = document.querySelector('.horizontal-scroll-wrapper');
if (horizontalSection && horizontalWrapper) {
    let mm = gsap.matchMedia();
    mm.add("(min-width: 769px)", () => {
        let amountToScroll = horizontalSection.scrollWidth - window.innerWidth + 200;

        gsap.to(horizontalSection, {
            x: () => -amountToScroll + "px",
            ease: "none",
            scrollTrigger: {
                trigger: horizontalWrapper,
                start: "center center",
                end: () => "+=" + amountToScroll,
                pin: true,
                scrub: 1,
                invalidateOnRefresh: true,
                anticipatePin: 1
            }
        });
    });
}

// Form & Contact Reveals
gsap.from('.form-reveal', {
    scrollTrigger: { trigger: '.contact-form-side', start: 'top 80%' },
    y: 30, opacity: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out'
});
gsap.from('.info-reveal', {
    scrollTrigger: { trigger: '.contact-info-side', start: 'top 80%' },
    x: 30, opacity: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out'
});

// Magnetic Elements Component (Buttons & cards)
const magneticEls = document.querySelectorAll('.magnetic-btn');
magneticEls.forEach(el => {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(el, { duration: 0.3, x: x * 0.4, y: y * 0.4, ease: 'power2.out' });
        // Scale inner element if exists
        const inner = el.querySelector('.hl-arrow-wrap');
        if (inner) gsap.to(inner, { duration: 0.3, x: x * 0.2, y: y * 0.2, ease: 'power2.out' });
    });
    el.addEventListener('mouseleave', () => {
        gsap.to(el, { duration: 0.3, x: 0, y: 0, ease: 'elastic.out(1, 0.3)' });
        const inner = el.querySelector('.hl-arrow-wrap');
        if (inner) gsap.to(inner, { duration: 0.3, x: 0, y: 0, ease: 'elastic.out(1, 0.3)' });
    });
});
