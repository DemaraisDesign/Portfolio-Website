import React, { useEffect, useRef } from 'react';

// --- CONSTANTS ---
const PALETTE_SF = ['#00C2A3', '#56C6FF', '#A88EFF'];
const FOCAL_LENGTH = 400;

// --- GLOBAL SPRITE CACHE ---
const starSprites = {};
const createSpr = (color, type) => {
    const size = 64;
    const c = document.createElement('canvas');
    c.width = size; c.height = size;
    const x = c.getContext('2d');
    const ctr = size / 2;
    const r = size * 0.4;
    const g = x.createRadialGradient(ctr, ctr, 0, ctr, ctr, r);
    g.addColorStop(0, '#FFFFFF');
    g.addColorStop(0.05, color);
    g.addColorStop(0.4, color);
    g.addColorStop(1, 'transparent');
    x.fillStyle = g; x.beginPath(); x.arc(ctr, ctr, r, 0, Math.PI * 2); x.fill();

    if (type === 'flare') {
        x.save();
        x.globalCompositeOperation = 'screen';
        x.strokeStyle = '#FFFFFF';
        x.lineWidth = 1;
        x.globalAlpha = 0.8;
        x.beginPath();
        x.moveTo(ctr - r, ctr); x.lineTo(ctr + r, ctr);
        x.moveTo(ctr, ctr - r); x.lineTo(ctr, ctr + r);
        x.stroke();
        x.shadowBlur = 4; x.shadowColor = '#FFFFFF'; x.stroke();
        x.restore();
    }
    return c;
};

// Generate sprites once
PALETTE_SF.forEach(c => {
    starSprites[c] = { normal: createSpr(c, 'normal'), flare: createSpr(c, 'flare') };
});

const Starfield = ({
    speed = 0.2,
    density = 1000,
    enabled = true,
    opacity = 1.0
}) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let width, height, centerX, centerY;
        let stars = [];
        let animationFrameId; // Track the frame ID for cancellation

        function StarObj() { this.init(true); }
        StarObj.prototype.init = function (randomZ) {
            this.x = (Math.random() - 0.5) * width * 3;
            this.y = (Math.random() - 0.5) * height * 3;
            this.z = randomZ ? Math.random() * 2000 : 2000;
            this.c = PALETTE_SF[Math.floor(Math.random() * PALETTE_SF.length)];
            this.type = Math.random() < 0.05 ? 'flare' : 'normal';
            this.twink = Math.random() < 0.05;
            this.baseSize = (Math.pow(Math.random(), 3) * 2.76) + 0.5;
            this.baseOpacity = Math.random() * 0.7 + 0.3;
            this.pulseSpeed = Math.random() * 0.5 + 0.5;
            this.angle = Math.random() * Math.PI * 2;
        };
        StarObj.prototype.update = function (dt) {
            // Use speed prop here
            this.z -= speed;
            if (this.z <= 0.1) this.init(false);
            const depthMult = (this.z > 1400) ? 0.375 : 1.0;
            this.angle += this.pulseSpeed * depthMult * dt;
        };
        StarObj.prototype.draw = function () {
            const s = FOCAL_LENGTH / this.z;
            const x = this.x * s + centerX;
            const y = this.y * s + centerY;

            // Bounds check optimized
            if (x < -50 || x > width + 50 || y < -50 || y > height + 50) return;

            const pulse = Math.sin(this.angle);
            let alpha = this.baseOpacity;
            let scale = 1.0;

            if (this.twink) {
                alpha += pulse * 0.1;
                scale = 1 + (pulse * 0.01);
            }

            // Fade in/out based on Z-depth
            alpha *= 1.15;
            if (this.z < 200) alpha *= (this.z / 200);
            if (this.z > 1800) alpha *= 1 - ((this.z - 1800) / 200);

            // Clamp alpha
            alpha = Math.max(0, Math.min(1, alpha));

            // Apply Global Opacity Prop
            alpha *= opacity;

            const sprite = starSprites[this.c] ? starSprites[this.c][this.type] : null;
            if (sprite) {
                const size = this.baseSize * s * scale * 6; // Scale factor matches original
                ctx.globalAlpha = alpha;
                ctx.drawImage(sprite, x - size / 2, y - size / 2, size, size);
                ctx.globalAlpha = 1.0;
            }
        };

        // --- RESIZING (ResizeObserver) ---
        // Use ResizeObserver to match parent container size exactly.
        // This fixes the vertical stretching issue where window height != section height.
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                if (entry.target === canvas.parentElement) {
                    width = entry.contentRect.width;
                    height = entry.contentRect.height;
                    centerX = width / 2;
                    centerY = height / 2;
                    canvas.width = width;
                    canvas.height = height;
                }
            }
        });

        const init = () => {
            // Initialize with current parent size if available
            if (canvas.parentElement) {
                resizeObserver.observe(canvas.parentElement);
                const rect = canvas.parentElement.getBoundingClientRect();
                width = rect.width;
                height = rect.height;
                centerX = width / 2;
                centerY = height / 2;
                canvas.width = width;
                canvas.height = height;
            } else {
                // Fallback
                width = window.innerWidth;
                height = window.innerHeight;
            }

            stars = [];
            for (let i = 0; i < density; i++) {
                stars.push(new StarObj());
            }
        };

        // window.addEventListener('resize', resize); // OBSOLETE
        init();

        // Loop
        let lastTime = 0;
        const animate = (time) => {
            if (!enabled) return;

            const dt = (time - lastTime) * 0.06;
            lastTime = time;

            // Clear
            ctx.clearRect(0, 0, width, height);

            // Update and Draw
            stars.forEach(star => {
                star.update(dt);
                star.draw();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        if (enabled) {
            animationFrameId = requestAnimationFrame(animate);
        }

        return () => {
            resizeObserver.disconnect();
            cancelAnimationFrame(animationFrameId);
        };
    }, [enabled, speed, density, opacity]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ mixBlendMode: 'screen', opacity: opacity }}
        />
    );
};

export default Starfield;
