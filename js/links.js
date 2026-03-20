/* ============================================
   LINKS PAGE — POP STYLE JS
   ============================================ */
(function () {
    'use strict';

    const palette = [
        'rgba(124, 58, 237, .2)',
        'rgba(236, 72, 153, .18)',
        'rgba(6, 182, 212, .18)',
        'rgba(249, 115, 22, .15)',
        'rgba(16, 185, 129, .15)',
        'rgba(251, 191, 36, .14)',
    ];

    // === Colorful Particles (same style as index) ===
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];
    const mouse = { x: null, y: null };

    function resize() { W = canvas.width = innerWidth; H = canvas.height = innerHeight; }

    class P {
        constructor() { this.init(); }
        init() {
            this.x = Math.random() * W;
            this.y = Math.random() * H;
            this.s = Math.random() * 3.5 + 1.5;
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
            this.x += this.vx;
            this.y += this.vy;
            this.rot += this.rotV;
            if (this.x < -10) this.x = W + 10;
            if (this.x > W + 10) this.x = -10;
            if (this.y < -10) this.y = H + 10;
            if (this.y > H + 10) this.y = -10;

            if (mouse.x !== null) {
                const dx = this.x - mouse.x, dy = this.y - mouse.y;
                const d = Math.sqrt(dx * dx + dy * dy);
                if (d < 140) {
                    const f = (140 - d) / 140;
                    this.x += (dx / d) * f * 2;
                    this.y += (dy / d) * f * 2;
                    this.o = this.bo + f * .3;
                } else {
                    this.o += (this.bo - this.o) * .05;
                }
            }
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = this.o;
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rot);
            ctx.fillStyle = this.c;
            if (this.shape < .4) {
                ctx.beginPath();
                ctx.arc(0, 0, this.s, 0, Math.PI * 2);
                ctx.fill();
            } else if (this.shape < .7) {
                ctx.fillRect(-this.s, -this.s, this.s * 2, this.s * 2);
            } else {
                ctx.beginPath();
                const r = this.s * 1.2;
                for (let i = 0; i < 3; i++) {
                    const a = (Math.PI * 2 / 3) * i - Math.PI / 2;
                    i === 0 ? ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r)
                            : ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
                }
                ctx.closePath();
                ctx.fill();
            }
            ctx.restore();
        }
    }

    function initParticles() {
        particles = [];
        const count = Math.floor((W * H) / 22000);
        for (let i = 0; i < count; i++) particles.push(new P());
    }

    function loop() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => { p.update(); p.draw(); });

        // Connection lines
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const d = Math.sqrt(dx * dx + dy * dy);
                if (d < 90) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(124, 58, 237, ${.06 * (1 - d / 90)})`;
                    ctx.lineWidth = .5;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(loop);
    }

    resize();
    initParticles();
    loop();

    window.addEventListener('resize', () => { resize(); initParticles(); });
    document.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });

    // === Cursor Glow ===
    const glow = document.querySelector('.cursor-glow');
    if (glow) {
        document.addEventListener('mousemove', (e) => {
            glow.style.left = e.clientX + 'px';
            glow.style.top = e.clientY + 'px';
            glow.classList.add('active');
        });
        document.addEventListener('mouseleave', () => glow.classList.remove('active'));
    }

    // === Tab switching (with ARIA) ===
    document.querySelectorAll('.tab').forEach((btn) => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab').forEach((b) => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');
            document.querySelectorAll('.tab-content').forEach((p) => p.classList.remove('active'));
            const panel = document.querySelector(`.tab-content[data-panel="${btn.dataset.tab}"]`);
            if (panel) panel.classList.add('active');
        });
    });

    // === Magnetic hover on link cards (desktop) ===
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!isTouchDevice) {
        document.querySelectorAll('.link-card').forEach((card) => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                card.style.transform = `translateY(-3px) translate(${x * 0.03}px, ${y * 0.05}px)`;
            });
            card.addEventListener('mouseleave', () => { card.style.transform = ''; });
        });
    }

    // === Reduce motion for users who prefer it ===
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        document.documentElement.style.setProperty('--bounce', 'ease');
        document.documentElement.style.setProperty('--ease', 'ease');
    }
})();
