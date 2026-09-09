// Main JS - handling 3D Scene and Animations

document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initThreeJS();
    initScrollAnimations();
    initTilt();
});

function initLoader() {
    const loader = document.querySelector('.loader-overlay');
    const bar = document.querySelector('.bar-fill');

    // Fake loading progress
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress > 100) progress = 100;
        bar.style.width = `${progress}%`;

        if (progress === 100) {
            clearInterval(interval);
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => loader.style.display = 'none', 500);
                startHeroAnimations();
            }, 500);
        }
    }, 100);
}

function startHeroAnimations() {
    const tl = gsap.timeline();

    tl.to('.hero-subtitle', { y: 0, opacity: 1, duration: 1, ease: 'power3.out' })
        .to('.title-line', { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power3.out' }, "-=0.5")
        .to('.hero-desc', { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }, "-=0.7")
        .to('.hero-actions', { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }, "-=0.7")
        .to('.scroll-indicator', { opacity: 0.5, duration: 1 }, "-=0.5");
}

function initScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Navbar Blur on Scroll
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            nav.style.background = 'rgba(2, 6, 23, 0.8)';
            nav.style.backdropFilter = 'blur(10px)';
        } else {
            nav.style.background = 'transparent';
            nav.style.backdropFilter = 'none';
        }
    });

    // About Cards Stagger
    gsap.from('.about-card, .about-stat', {
        scrollTrigger: {
            trigger: '.about-grid',
            start: 'top 80%',
        },
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out'
    });

    // Products Stagger
    gsap.from('.product-card', {
        scrollTrigger: {
            trigger: '.products-grid',
            start: 'top 80%',
        },
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out'
    });
}

function initTilt() {
    // Initialize Vanilla Tilt on elements with data-tilt attribute
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
            max: 15,
            speed: 400,
            glare: true,
            "max-glare": 0.2,
            scale: 1.05
        });
    }
}

function initThreeJS() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    // SCENE
    const scene = new THREE.Scene();

    // CAMERA
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // PARTICLES (Molecule Effect)
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 700;

    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        // Spread particles
        posArray[i] = (Math.random() - 0.5) * 60;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    // Material
    const material = new THREE.PointsMaterial({
        size: 0.15,
        color: 0x06b6d4, /* Cyan Accent */
        transparent: true,
        opacity: 0.8,
    });

    // Mesh
    const particlesMesh = new THREE.Points(particlesGeometry, material);
    scene.add(particlesMesh);

    // MOUSE INTERACTION
    let mouseX = 0;
    let mouseY = 0;

    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    // ANIMATION LOOP
    const clock = new THREE.Clock();

    const tick = () => {
        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;

        const elapsedTime = clock.getElapsedTime();

        // Rotate entire mesh slowly
        particlesMesh.rotation.y = .2 * elapsedTime;
        particlesMesh.rotation.x += .05 * (targetY - particlesMesh.rotation.x);
        particlesMesh.rotation.y += .05 * (targetX - particlesMesh.rotation.y);

        renderer.render(scene, camera);
        window.requestAnimationFrame(tick);
    };

    tick();

    // RESIZE HANDLER
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}
