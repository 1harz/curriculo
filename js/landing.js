document.addEventListener('DOMContentLoaded', () => {
    // --- Loading Sequence ---
    const loadingScreen = document.getElementById('loading-screen');
    const progressFill = document.querySelector('.progress-fill');
    const logLines = document.querySelectorAll('.terminal-body p');
    const gameUI = document.getElementById('game-ui');

    // Animate Progress Bar
    gsap.to(progressFill, {
        width: "100%",
        duration: 4,
        ease: "power1.inOut",
        onComplete: revealUI
    });

    // Animate Log Lines
    logLines.forEach((line, index) => {
        gsap.to(line, {
            opacity: 1,
            delay: index * 0.8,
            duration: 0.1
        });
    });

    function revealUI() {
        gsap.to(loadingScreen, {
            opacity: 0,
            duration: 1,
            pointerEvents: "none",
            onComplete: () => {
                gameUI.classList.remove('hidden');
                animateEntrance();
            }
        });
    }

    function animateEntrance() {
        // Animate Profile Card
        gsap.from("#profile-card", {
            duration: 1.5,
            x: -100,
            opacity: 0,
            ease: "back.out(1.7)",
            delay: 0.2
        });

        // Animate Menu Items with Stagger
        // Animate Menu Items with Stagger
        gsap.fromTo(".menu-item",
            {
                x: 50,
                opacity: 0
            },
            {
                x: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.2,
                ease: "power2.out",
                delay: 0.5,
                clearProps: "transform,opacity" // Ensure clean state after animation
            }
        );

        // Animate System Status
        gsap.from(".system-status", {
            duration: 1,
            y: -20,
            opacity: 0,
            delay: 0.8
        });

        // Animate Stat Bars
        gsap.from(".stat-fill", {
            width: "0%",
            duration: 1.5,
            ease: "power2.out",
            delay: 1.5,
            stagger: 0.2
        });

        init3DTilt();
    }

    // --- Interactive 3D Tilt for Profile Card ---
    function init3DTilt() {
        const card = document.getElementById('profile-card');
        const cardContent = card.querySelector('.card-content');

        document.addEventListener('mousemove', (e) => {
            if (window.innerWidth < 900) return; // Disable on mobile

            const x = (window.innerWidth / 2 - e.pageX) / 25;
            const y = (window.innerHeight / 2 - e.pageY) / 25;

            gsap.to(card, {
                rotationY: x,
                rotationX: y,
                duration: 0.5,
                ease: "power1.out"
            });

            // Parallax effect for content
            gsap.to(cardContent, {
                x: -x * 2,
                y: -y * 2,
                duration: 0.5
            });
        });

        // Reset on mouse leave
        document.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotationY: 0,
                rotationX: 0,
                duration: 1
            });
            gsap.to(cardContent, { x: 0, y: 0, duration: 1 });
        });
    }

    // --- Sound Effect Simulation (Console Log for now) ---
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            // In a real game, play blip sound
            // toggleSound('hover');
        });
    });
});
