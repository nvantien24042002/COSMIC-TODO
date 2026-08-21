import React, { useEffect, useRef } from 'react';

export default function CosmicBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates for interactive gravity / parallax
    let mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2, active: false };

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);

    // Star configuration
    const STAR_COUNT = Math.min(Math.floor((width * height) / 7000), 160);
    const DUST_COUNT = 30;
    let stars = [];
    let dustParticles = [];
    let shootingStars = [];

    const STAR_COLORS = [
      'rgba(255, 255, 255, ',
      'rgba(147, 197, 253, ', // Ice blue
      'rgba(196, 181, 253, ', // Violet
      'rgba(103, 232, 249, ', // Cyan
      'rgba(253, 230, 138, ', // Starlight Gold
    ];

    class Star {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.8 + 0.4;
        this.baseAlpha = Math.random() * 0.7 + 0.3;
        this.alpha = this.baseAlpha;
        this.twinkleSpeed = Math.random() * 0.02 + 0.005;
        this.twinkleOffset = Math.random() * Math.PI * 2;
        this.colorPrefix = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];
        this.vx = (Math.random() - 0.5) * 0.08;
        this.vy = (Math.random() - 0.5) * 0.08;
      }

      update(time) {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;

        // Twinkle
        this.alpha = this.baseAlpha + Math.sin(time * this.twinkleSpeed + this.twinkleOffset) * 0.25;
        this.alpha = Math.max(0.1, Math.min(1, this.alpha));

        // Gentle mouse parallax
        if (mouse.active) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 200 && dist > 1) {
            const force = (200 - dist) / 200 * 0.015;
            this.x -= (dx / dist) * force * 15;
            this.y -= (dy / dist) * force * 15;
          }
        }
      }

      draw(context) {
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fillStyle = `${this.colorPrefix}${this.alpha})`;
        context.shadowBlur = this.size > 1.2 ? 6 : 0;
        context.shadowColor = 'rgba(103, 232, 249, 0.6)';
        context.fill();
        context.shadowBlur = 0;
      }
    }

    class DustParticle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 25 + 15;
        this.vx = (Math.random() - 0.5) * 0.15;
        this.vy = (Math.random() - 0.5) * 0.15;
        this.alpha = Math.random() * 0.04 + 0.015;
        this.hue = Math.random() > 0.5 ? 260 : 190; // Violet or Cyan
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < -50) this.x = width + 50;
        if (this.x > width + 50) this.x = -50;
        if (this.y < -50) this.y = height + 50;
        if (this.y > height + 50) this.y = -50;
      }

      draw(context) {
        const gradient = context.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          this.size
        );
        gradient.addColorStop(0, `hsla(${this.hue}, 80%, 65%, ${this.alpha})`);
        gradient.addColorStop(1, `hsla(${this.hue}, 80%, 65%, 0)`);

        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fillStyle = gradient;
        context.fill();
      }
    }

    class ShootingStar {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width * 1.2 - width * 0.1;
        this.y = Math.random() * (height * 0.4);
        this.length = Math.random() * 90 + 50;
        this.speed = Math.random() * 12 + 10;
        this.angle = (Math.PI / 4) + (Math.random() * 0.2 - 0.1); // ~45 degrees
        this.alpha = 1;
        this.fade = Math.random() * 0.02 + 0.015;
        this.active = false;
        this.nextSpawn = Date.now() + Math.random() * 6000 + 3000;
      }

      update() {
        if (!this.active) {
          if (Date.now() > this.nextSpawn) {
            this.active = true;
          }
          return;
        }

        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.alpha -= this.fade;

        if (this.alpha <= 0 || this.x > width + 100 || this.y > height + 100) {
          this.reset();
        }
      }

      draw(context) {
        if (!this.active || this.alpha <= 0) return;

        const tailX = this.x - Math.cos(this.angle) * this.length;
        const tailY = this.y - Math.sin(this.angle) * this.length;

        const gradient = context.createLinearGradient(this.x, this.y, tailX, tailY);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${this.alpha})`);
        gradient.addColorStop(0.3, `rgba(103, 232, 249, ${this.alpha * 0.8})`);
        gradient.addColorStop(1, `rgba(147, 51, 234, 0)`);

        context.beginPath();
        context.moveTo(this.x, this.y);
        context.lineTo(tailX, tailY);
        context.strokeStyle = gradient;
        context.lineWidth = 1.8;
        context.stroke();

        // Glowing head
        context.beginPath();
        context.arc(this.x, this.y, 1.5, 0, Math.PI * 2);
        context.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
        context.shadowBlur = 8;
        context.shadowColor = '#67e8f9';
        context.fill();
        context.shadowBlur = 0;
      }
    }

    function initStars() {
      stars = [];
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push(new Star());
      }
      dustParticles = [];
      for (let i = 0; i < DUST_COUNT; i++) {
        dustParticles.push(new DustParticle());
      }
      shootingStars = [new ShootingStar(), new ShootingStar()];
    }

    initStars();

    let startTime = Date.now();

    const render = () => {
      const time = (Date.now() - startTime) * 0.001;

      // Smooth mouse easing
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Deep space gradient
      const bgGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.3,
        50,
        width * 0.5,
        height * 0.5,
        Math.max(width, height)
      );
      bgGrad.addColorStop(0, '#0a1029');
      bgGrad.addColorStop(0.5, '#050817');
      bgGrad.addColorStop(1, '#02040a');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Render floating nebula dust
      dustParticles.forEach((dust) => {
        dust.update();
        dust.draw(ctx);
      });

      // Render Stars
      stars.forEach((star) => {
        star.update(time);
        star.draw(ctx);
      });

      // Render Shooting Stars
      shootingStars.forEach((meteor) => {
        meteor.update();
        meteor.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
      {/* Subtle top & bottom glow overlays */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}
