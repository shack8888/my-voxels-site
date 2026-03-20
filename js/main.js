/* ============================================
   MY VOXELS INC. — POP STYLE JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initScrollReveal();
    initNavbar();
    initMobileMenu();
    initSmoothScroll();
    initContactForm();
    initCursorGlow();
});

/* ===== PARTICLES — colorful confetti style ===== */
function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];
    const mouse = { x: null, y: null, r: 160 };

    const palette = [
        'rgba(124, 58, 237, .25)',
        'rgba(236, 72, 153, .22)',
        'rgba(6, 182, 212, .22)',
        'rgba(249, 115, 22, .18)',
        'rgba(16, 185, 129, .18)',
        'rgba(251, 191, 36, .16)',
    ];

    function resize() { W = canvas.width = innerWidth; H = canvas.height = innerHeight; }

    class P {
        constructor() { this.init(); }
        init() {
            this.x = Math.random() * W;
            this.y = Math.random() * H;
            this.s = Math.random() * 4 + 1.5;
            this.vx = (Math.random() - .5) * .3;
            this.vy = (Math.random() - .5) * .3;
            this.c = palette[~~(Math.random() * palette.length)];
            this.o = Math.random() * .5 + .1;
            this.bo = this.o;
            this.shape = Math.random();
            this.rot = Math.random() * Math.PI * 2;
            this.rotV = (Math.random() - .5) * .02;
        }
        update() {
            this.x += this.vx; this.y += this.vy;
            this.rot += this.rotV;
            if (mouse.x !== null) {
                const dx = mouse.x - this.x, dy = mouse.y - this.y;
                const d = Math.sqrt(dx * dx + dy * dy);
                if (d < mouse.r) {
                    const f = (mouse.r - d) / mouse.r;
                    this.x -= dx * f * .015;
                    this.y -= dy * f * .015;
                    this.o = this.bo + f * .3;
                } else this.o += (this.bo - this.o) * .05;
            }
            if (this.x < -10) this.x = W + 10;
            if (this.x > W + 10) this.x = -10;
            if (this.y < -10) this.y = H + 10;
            if (this.y > H + 10) this.y = -10;
        }
        draw() {
            ctx.globalAlpha = this.o;
            ctx.fillStyle = this.c;
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rot);
            if (this.shape < .33) {
                // Circle
                ctx.beginPath();
                ctx.arc(0, 0, this.s / 2, 0, Math.PI * 2);
                ctx.fill();
            } else if (this.shape < .66) {
                // Rounded square
                const r = this.s * .2;
                const hs = this.s / 2;
                ctx.beginPath();
                ctx.moveTo(-hs + r, -hs);
                ctx.lineTo(hs - r, -hs);
                ctx.quadraticCurveTo(hs, -hs, hs, -hs + r);
                ctx.lineTo(hs, hs - r);
                ctx.quadraticCurveTo(hs, hs, hs - r, hs);
                ctx.lineTo(-hs + r, hs);
                ctx.quadraticCurveTo(-hs, hs, -hs, hs - r);
                ctx.lineTo(-hs, -hs + r);
                ctx.quadraticCurveTo(-hs, -hs, -hs + r, -hs);
                ctx.fill();
            } else {
                // Triangle
                ctx.beginPath();
                ctx.moveTo(0, -this.s / 2);
                ctx.lineTo(this.s / 2, this.s / 2);
                ctx.lineTo(-this.s / 2, this.s / 2);
                ctx.closePath();
                ctx.fill();
            }
            ctx.restore();
            ctx.globalAlpha = 1;
        }
    }

    function spawn() {
        const n = Math.min(~~((W * H) / 14000), 100);
        particles = Array.from({ length: n }, () => new P());
    }

    function lines() {
        const max = 110;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
                const d = Math.sqrt(dx * dx + dy * dy);
                if (d < max) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(124, 58, 237, ${.04 * (1 - d / max)})`;
                    ctx.lineWidth = .4;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    (function loop() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => { p.update(); p.draw(); });
        lines();
        requestAnimationFrame(loop);
    })();

    addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
    addEventListener('mouseleave', () => { mouse.x = mouse.y = null; });
    addEventListener('resize', () => { resize(); spawn(); });
    resize(); spawn();
}

/* ===== CURSOR GLOW ===== */
function initCursorGlow() {
    const glow = document.getElementById('cursor-glow');
    if (!glow || window.innerWidth < 768) return;

    let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX; mouseY = e.clientY;
        glow.classList.add('active');
    });
    document.addEventListener('mouseleave', () => glow.classList.remove('active'));

    (function animate() {
        glowX += (mouseX - glowX) * .08;
        glowY += (mouseY - glowY) * .08;
        glow.style.left = glowX + 'px';
        glow.style.top = glowY + 'px';
        requestAnimationFrame(animate);
    })();
}

/* ===== SCROLL REVEAL ===== */
function initScrollReveal() {
    const els = document.querySelectorAll('.anim');
    const hero = document.getElementById('hero');

    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: .08, rootMargin: '0px 0px -50px 0px' });

    els.forEach(el => {
        if (hero && hero.contains(el)) el.classList.add('visible');
        else obs.observe(el);
    });
}

/* ===== NAVBAR ===== */
function initNavbar() {
    const nav = document.getElementById('navbar');
    if (!nav) return;
    const secs = document.querySelectorAll('section[id]');
    const links = document.querySelectorAll('.nav-link:not(.nav-link--cta)');

    addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', scrollY > 60);
        let cur = '';
        secs.forEach(s => { if (scrollY >= s.offsetTop - 200) cur = s.id; });
        links.forEach(l => {
            l.classList.toggle('active', l.getAttribute('href') === `#${cur}`);
        });
    }, { passive: true });
}

/* ===== MOBILE MENU ===== */
function initMobileMenu() {
    const tog = document.getElementById('nav-toggle');
    const menu = document.getElementById('nav-menu');
    if (!tog || !menu) return;

    tog.addEventListener('click', () => {
        tog.classList.toggle('active');
        menu.classList.toggle('active');
        document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
    });

    menu.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => {
        tog.classList.remove('active');
        menu.classList.remove('active');
        document.body.style.overflow = '';
    }));
}

/* ===== SMOOTH SCROLL ===== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function (e) {
            e.preventDefault();
            const t = document.querySelector(this.getAttribute('href'));
            if (t) window.scrollTo({ top: t.getBoundingClientRect().top + scrollY - 80, behavior: 'smooth' });
        });
    });
}

/* ===== CONTACT FORM ===== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const toast = document.getElementById('toast');
    if (!form || !toast) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        // TODO: Connect to a form backend (e.g., Formspree, Google Forms)
        // For now, show a notice that the form is not yet functional
        toast.textContent = 'お問い合わせフォームは現在準備中です。SNSからご連絡ください。';
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 4000);
    });
}