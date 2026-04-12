import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Volume2, VolumeX } from 'lucide-react';
import ScrollHint from './ScrollHint';
import '../styles/IntroExperience.css';

const IntroExperience = ({ onComplete }) => {
    const rootRef = useRef(null);
    const [showScrollHint, setShowScrollHint] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        const rootElement = rootRef.current;
        if (!rootElement) {
            console.warn("IntroExperience: rootRef is null");
            return;
        }


        // --- SCOPED STATE ---
        let audioStarted = false;
        let soundEnabled = false;
        let silenceTimer = null;
        let animationFrameId = null;

        // Audio Nodes
        let padSynth, pianoSynth, droneSynth, windSynth;
        let masterBus, reverb, delay;

        // Visual State
        const canvas = rootElement.querySelector('#starfield');
        const ctx = canvas ? canvas.getContext('2d') : null;
        const STAR_COUNT = 1000;
        const HAZE_COUNT = 30;
        const SPEED_SF = 0.2156;
        const FOCAL_LENGTH = 400;
        const PALETTE_SF = ['#00C2A3', '#56C6FF', '#A88EFF'];
        const starSprites = {};
        let stars = [];
        let hazeParticles = [];
        let width, height, centerX, centerY;
        let bgGradient = null;
        let lastTime = Date.now();

        // Scroll/Logic State
        const text1 = rootElement.querySelector('#text1');
        const text2 = rootElement.querySelector('#text2');
        const text3 = rootElement.querySelector('#text3');
        const text4 = rootElement.querySelector('#text4');
        const text5 = rootElement.querySelector('#text5');

        // Finale Elements
        const finaleContainer = rootElement.querySelector('#finale-container');
        const zoomDiv = rootElement.querySelector('#finale-zoom');
        const spinDiv = rootElement.querySelector('#finale-spin');
        const itemGreen = rootElement.querySelector('#item-green');
        const itemBlue = rootElement.querySelector('#item-blue');
        const itemPurple = rootElement.querySelector('#item-purple');

        let lastScrollY = window.scrollY;
        let isScrollLocked = false;
        let lockedScrollY = 0;
        let hasLocked = { text1: false, text2: false, text3: false, text4: false, text5: false };
        let audioState = { text1: false, text2: false, text3: false, text4: false, text5: false };
        let finaleTimer = null;
        let isFinaleActive = false;
        let isFinaleExited = false;
        let seqTimers = [];

        // --- HELPER FUNCTIONS ---
        const lerp = (start, end, t) => start * (1 - t) + end * t;
        const easeInOut = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
        const easeOutBack = (t) => {
            const c1 = 1.5; const c3 = c1 + 1;
            return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
        };

        const resize_sf = () => {
            width = window.innerWidth; height = window.innerHeight;
            centerX = width / 2; centerY = height / 2;
            if (canvas) {
                canvas.width = width; canvas.height = height;
                if (ctx) {
                    bgGradient = ctx.createRadialGradient(centerX, centerY, height * 0.2, centerX, centerY, height);
                    bgGradient.addColorStop(0, '#0a0a14'); bgGradient.addColorStop(1, '#000000');
                }
            }
        };

        const createSpr = (color, type) => {
            const size = 64; const c = document.createElement('canvas'); c.width = size; c.height = size; const x = c.getContext('2d'); const ctr = size / 2;
            const r = size * 0.4; const g = x.createRadialGradient(ctr, ctr, 0, ctr, ctr, r);
            g.addColorStop(0, '#FFFFFF'); g.addColorStop(0.05, color); g.addColorStop(0.4, color); g.addColorStop(1, 'transparent');
            x.fillStyle = g; x.beginPath(); x.arc(ctr, ctr, r, 0, Math.PI * 2); x.fill();
            if (type === 'flare') { x.save(); x.globalCompositeOperation = 'screen'; x.strokeStyle = '#FFFFFF'; x.lineWidth = 1; x.globalAlpha = 0.8; x.beginPath(); x.moveTo(ctr - r, ctr); x.lineTo(ctr + r, ctr); x.moveTo(ctr, ctr - r); x.lineTo(ctr, ctr + r); x.stroke(); x.shadowBlur = 4; x.shadowColor = '#FFFFFF'; x.stroke(); x.restore(); }
            return c;
        };

        const genSprites = () => {
            PALETTE_SF.forEach(c => {
                starSprites[c] = { normal: createSpr(c, 'normal'), flare: createSpr(c, 'flare') };
            });
        };

        // --- INTRO SEQUENCE LOGIC ---
        const introOverlay = rootElement.querySelector('#intro-overlay');
        const introText = rootElement.querySelector('#intro-text');
        const introIcons = rootElement.querySelector('#intro-icons');
        const btnOn = rootElement.querySelector('#btn-sound-on');
        const btnOff = rootElement.querySelector('#btn-sound-off');
        const btnSkip = rootElement.querySelector('#btn-skip-intro');

        // Startup Timeline
        setTimeout(() => { if (canvas) canvas.style.opacity = '1'; }, 500);
        setTimeout(() => { if (introText) introText.style.opacity = '1'; }, 100);
        setTimeout(() => { if (introIcons) introIcons.style.opacity = '1'; }, 100);
        setTimeout(() => { if (btnSkip) btnSkip.style.opacity = '1'; }, 100);

        // 4. Interaction Handlers
        const enableAudio = () => {
            soundEnabled = true;
            initAudio(); // Starts Tone.js
        };

        const enableSilent = () => {
            soundEnabled = false;
            unlockExperience(); // Just removes overlay
        };

        // Explicit event listeners for buttons
        if (btnOn) {
            btnOn.onclick = enableAudio;
            btnOn.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') enableAudio(); };
        }
        if (btnOff) {
            btnOff.onclick = enableSilent;
            btnOff.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') enableSilent(); };
        }
        if (btnSkip) {
            const triggerSkip = (e) => {
                if (e) e.preventDefault();
                navigate('/'); // Force redirect to Home
                // Delay unmount slightly to ensure Router state updates to '/' before Layout mounts.
                // THIS FIXES THE "FLASH" BUG.
                setTimeout(() => {
                    if (onComplete) onComplete(true);
                }, 100);
            };
            btnSkip.onclick = triggerSkip;
            btnSkip.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') triggerSkip(); };
        }

        // --- SAFELY LOCK SCROLL (Prevent events without hiding overflow) ---
        const preventScroll = (e) => {
            e.preventDefault();
            e.stopPropagation();
            return false;
        };

        const preventScrollKeys = (e) => {
            // Space, PageUp, PageDown, Home, End, Arrows
            const keys = [' ', 'PageUp', 'PageDown', 'Home', 'End', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
            // Only block if we aren't focused on an interactive element (buttons)
            const isInteractive = ['BUTTON', 'A', 'INPUT'].includes(document.activeElement?.tagName);

            if (keys.includes(e.key) && !isInteractive) {
                e.preventDefault();
                return false;
            }
        };

        // Attach blockers to the OVERLAY, not the window/body
        // This prevents the scroll signal from reaching the document 
        // without changing layout/scrollbar width.
        if (introOverlay) {
            // Passive: false is crucial for preventDefault to work
            introOverlay.addEventListener('wheel', preventScroll, { passive: false });
            introOverlay.addEventListener('touchmove', preventScroll, { passive: false });
            window.addEventListener('keydown', preventScrollKeys, { passive: false }); // Keydown must be global to catch page actions
        }

        const unlockExperience = () => {
            if (introOverlay) {
                // Remove blockers
                introOverlay.removeEventListener('wheel', preventScroll);
                introOverlay.removeEventListener('touchmove', preventScroll);
                window.removeEventListener('keydown', preventScrollKeys);

                introOverlay.style.opacity = '0';
                document.body.style.overflow = ''; // Ensure standard unlock logic remains (though we didn't lock it this time)
                setTimeout(() => introOverlay.remove(), 1000);
            }
            updateScrollTriggers();

            // Start timer for scroll hint
            setTimeout(() => {
                if (window.scrollY < 50) { // If user hasn't scrolled much
                    setShowScrollHint(true);
                }
            }, 4500);
        };

        // --- CLASSES (SCOPED) ---
        function StarObj() { this.init(true); }
        StarObj.prototype.init = function (rz) {
            this.x = (Math.random() - 0.5) * width * 3;
            this.y = (Math.random() - 0.5) * height * 3;
            this.z = rz ? Math.random() * 2000 : 2000;
            this.c = PALETTE_SF[Math.floor(Math.random() * PALETTE_SF.length)];
            this.type = Math.random() < 0.05 ? 'flare' : 'normal';
            this.twink = Math.random() < 0.05;
            this.bs = (Math.pow(Math.random(), 3) * 2.76) + 0.5;
            this.bo = Math.random() * 0.7 + 0.3;
            this.ps = Math.random() * 0.5 + 0.5;
            this.a = Math.random() * Math.PI * 2;
        };
        StarObj.prototype.update = function (dt) {
            this.z -= SPEED_SF;
            if (this.z <= 0.1) this.init(false);
            const dm = (this.z > 1400) ? 0.375 : 1.0;
            this.a += this.ps * dm * dt;
        };
        StarObj.prototype.draw = function () {
            const s = FOCAL_LENGTH / this.z;
            const x = this.x * s + centerX;
            const y = this.y * s + centerY;
            if (x < -50 || x > width + 50 || y < -50 || y > height + 50) return;
            const p = Math.sin(this.a);
            let a = this.bo;
            let sp = 1.0;
            if (this.twink) { a += p * 0.1; sp = 1 + (p * 0.01); }
            a *= 1.15;
            if (this.z < 200) a *= (this.z / 200);
            if (this.z > 1800) a *= 1 - ((this.z - 1800) / 200);
            a = Math.max(0, Math.min(1, a));
            const spr = starSprites[this.c] ? starSprites[this.c][this.type] : null;
            if (spr) {
                const sz = this.bs * s * sp * 6;
                ctx.globalAlpha = a;
                ctx.drawImage(spr, x - sz / 2, y - sz / 2, sz, sz);
                ctx.globalAlpha = 1.0;
            }
        };

        function HazeObj() { this.init(true); }
        HazeObj.prototype.init = function (rz) {
            this.x = (Math.random() - 0.5) * width * 4;
            this.y = (Math.random() - 0.5) * height * 4;
            this.z = rz ? Math.random() * 1500 + 500 : 2000;
            this.c = PALETTE_SF[Math.floor(Math.random() * PALETTE_SF.length)];
            this.sz = (Math.random() * 400 + 200) * 1.4;
            this.o = (Math.random() * 0.05 + 0.02) * 0.375;
        };
        HazeObj.prototype.update = function () {
            this.z -= SPEED_SF * 0.3;
            if (this.z <= 50) this.init(false);
        };
        HazeObj.prototype.draw = function () {
            const s = FOCAL_LENGTH / this.z;
            const x = this.x * s + centerX;
            const y = this.y * s + centerY;
            const sz = this.sz * s;
            const g = ctx.createRadialGradient(x, y, 0, x, y, sz);
            ctx.globalAlpha = this.o;
            ctx.fillStyle = g;
            g.addColorStop(0, this.c);
            g.addColorStop(1, 'transparent');
            ctx.beginPath();
            ctx.arc(x, y, sz, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1.0;
        };            // --- ICON CLASSES ---
        function WaveformIcon(selectorId) {
            this.canvas = rootElement.querySelector('#' + selectorId);
            this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
            this.intensity = 0; this.startTime = null; this.isPlaying = false; this.show = false;
            this.staticPattern = [0.15, 0.25, 0.40, 0.55, 0.70, 0.85, 0.75, 0.60, 0.45, 0.30];
            this.color = '#FFFFFF';
        }
        WaveformIcon.prototype.start = function () { this.show = true; this.startTime = Date.now(); };
        WaveformIcon.prototype.setPlaying = function (p) { this.isPlaying = p; };
        WaveformIcon.prototype.draw = function (now) {
            if (!this.canvas) return;
            const canvas = this.canvas; const ctx = this.ctx;
            const logicalSize = 200; canvas.width = logicalSize; canvas.height = logicalSize;
            let entranceScale = 0;
            if (this.show && this.startTime) {
                const elapsed = now - this.startTime;
                entranceScale = easeOutBack(Math.min(Math.max(elapsed / 800, 0), 1));
            }
            if (entranceScale <= 0.01) { ctx.clearRect(0, 0, 200, 200); return; }
            const isEntranceDone = entranceScale >= 0.99;
            const targetIntensity = (this.isPlaying && isEntranceDone) ? 1 : 0;
            if (this.intensity < targetIntensity) this.intensity = Math.min(this.intensity + 0.05, 1);
            else if (this.intensity > targetIntensity) this.intensity = Math.max(this.intensity - 0.05, 0);
            ctx.clearRect(0, 0, 200, 200); ctx.fillStyle = this.color;
            const numBars = 20; const halfBars = 10; const heights = new Float32Array(numBars);
            const totalW = 150; const margin = 25; const gapRatio = 0.4;
            const barUnit = totalW / numBars; const barW = barUnit * (1 - gapRatio); const spacing = barUnit * gapRatio;
            for (let i = 0; i < halfBars; i++) {
                const rawStatic = this.staticPattern[i] || 0.2; const hStatic = rawStatic * 100;
                let hDynamic; if (i === 0) hDynamic = 20; else {
                    const t = now; const n1 = Math.sin(t * 0.02 + i * 235);
                    const n2 = Math.cos(t * 0.005 + i * 110); const n3 = Math.sin(t * 0.015);
                    let raw = (n1 + n2 + n3 + 3) / 6; raw = Math.pow(raw, 2.5) * 2.0; if (raw > 1) raw = 1;
                    hDynamic = raw * (0.4 + 0.6 * (i / 9)) * 120; if (hDynamic < 20) hDynamic = 20;
                }
                const h = hStatic * (1 - this.intensity) + hDynamic * this.intensity;
                heights[i] = h; heights[numBars - 1 - i] = h;
            }
            ctx.save(); ctx.translate(100, 100); ctx.scale(entranceScale, entranceScale); ctx.translate(-100, -100);
            for (let i = 0; i < numBars; i++) { ctx.fillRect(margin + i * (barW + spacing), (200 - heights[i]) / 2, barW, heights[i]); }
            ctx.restore();
        };

        function UXIcon(selectorId) {
            this.canvas = rootElement.querySelector('#' + selectorId);
            this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
            this.intensity = 0; this.timeOffset = 0; this.lastPlayState = false;
            this.startTime = null; this.show = false; this.isPlaying = false; this.color = '#FFFFFF';
        }
        UXIcon.prototype.start = function () { this.show = true; this.startTime = Date.now(); };
        UXIcon.prototype.setPlaying = function (p) { this.isPlaying = p; };
        UXIcon.prototype.draw = function (now) {
            if (!this.canvas) return;
            const ctx = this.ctx;
            const logicalSize = 200;
            this.canvas.width = logicalSize;
            this.canvas.height = logicalSize;
            ctx.scale(2, 2);

            let entranceScale = 0;
            if (this.show && this.startTime) {
                entranceScale = easeOutBack(Math.min(Math.max((now - this.startTime) / 800, 0), 1));
            }

            if (entranceScale <= 0.01) { ctx.clearRect(0, 0, 100, 100); return; }

            const isEntranceDone = entranceScale >= 0.99;
            const effPlaying = this.isPlaying && isEntranceDone;
            const cycle = 2000;

            if (effPlaying && !this.lastPlayState) {
                this.timeOffset = now - (cycle - 600);
            }
            this.lastPlayState = effPlaying;
            const t = effPlaying ? (now - this.timeOffset) : 0;

            ctx.clearRect(0, 0, 100, 100); ctx.save();
            const contentScale = 0.75 * entranceScale;
            ctx.translate(50, 50); ctx.scale(contentScale, contentScale); ctx.translate(-50, -50);
            ctx.strokeStyle = this.color; ctx.fillStyle = this.color;
            ctx.lineWidth = 4; ctx.lineCap = "round"; ctx.lineJoin = "round";
            const pW = 50, pH = 80, pX = 25, pY = 10, r = 6;
            ctx.beginPath(); ctx.moveTo(pX + r, pY); ctx.lineTo(pX + pW - r, pY); ctx.quadraticCurveTo(pX + pW, pY, pX + pW, pY + r);
            ctx.lineTo(pX + pW, pY + pH - r); ctx.quadraticCurveTo(pX + pW, pY + pH, pX + pW - r, pY + pH);
            ctx.lineTo(pX + r, pY + pH); ctx.quadraticCurveTo(pX, pY + pH, pX, pY + pH - r);
            ctx.lineTo(pX, pY + r); ctx.quadraticCurveTo(pX, pY, pX + r, pY); ctx.stroke();
            ctx.beginPath(); ctx.arc(50, pY + pH - 8, 3, 0, 6.28); ctx.fill();
            ctx.beginPath(); ctx.moveTo(44, pY + 8); ctx.lineTo(56, pY + 8); ctx.stroke();
            const layouts = [[{ x: 0, y: 0, w: 1, h: 0.25 }, { x: 0, y: 0.3, w: 0.45, h: 0.7 }, { x: 0.5, y: 0.3, w: 0.5, h: 0.7 }], [{ x: 0, y: 0, w: 1, h: 0.2 }, { x: 0, y: 0.25, w: 1, h: 0.35 }, { x: 0, y: 0.65, w: 1, h: 0.35 }], [{ x: 0, y: 0, w: 0.3, h: 1 }, { x: 0.35, y: 0, w: 0.65, h: 0.5 }, { x: 0.35, y: 0.55, w: 0.65, h: 0.45 }]];
            const screenW = pW - 12, screenH = pH - 28, sX = pX + 6, sY = pY + 14;
            const totalT = t % (cycle * 3); const idx = Math.floor(totalT / cycle); const nextIdx = (idx + 1) % 3;
            const subT = totalT % cycle; let morph = 0; if (subT > (cycle - 600)) morph = easeInOut((subT - (cycle - 600)) / 600);
            const curL = layouts[idx]; const nextL = layouts[nextIdx];
            for (let b = 0; b < 3; b++) {
                const start = effPlaying ? curL[b] : layouts[0][b]; const end = nextL[b]; const mT = effPlaying ? morph : 0;
                const x = lerp(start.x, end.x, mT) * screenW + sX; const y = lerp(start.y, end.y, mT) * screenH + sY;
                const w = lerp(start.w, end.w, mT) * screenW; const h = lerp(start.h, end.h, mT) * screenH;
                if (b === 2) {
                    ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
                    for (let l = 0; l < 15; l++) {
                        const ly = y + l * 7; const fade = Math.max(0, Math.min(1, ((y + h) - ly) / 5)); ctx.globalAlpha = fade; ctx.fillRect(x, ly, w, 3);
                    } ctx.restore();
                } else { ctx.fillRect(x, y, w, h); }
            } ctx.restore();
        };

        function TheatreIcon(selectorId) {
            this.canvas = rootElement.querySelector('#' + selectorId);
            this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
            this.timeOffset = 0; this.lastPlayState = false; this.startTime = null; this.show = false; this.isPlaying = false; this.color = '#FFFFFF';
        }
        TheatreIcon.prototype.start = function () { this.show = true; this.startTime = Date.now(); };
        TheatreIcon.prototype.setPlaying = function (p) { this.isPlaying = p; };
        TheatreIcon.prototype.draw = function (now) {
            if (!this.canvas) return;
            const ctx = this.ctx;
            const logicalSize = 200;
            this.canvas.width = logicalSize;
            this.canvas.height = logicalSize;
            ctx.scale(2, 2);
            const REF = 100;

            let entranceScale = 0;
            if (this.show && this.startTime) {
                entranceScale = easeOutBack(Math.min(Math.max((now - this.startTime) / 800, 0), 1));
            }

            if (entranceScale <= 0.01) { ctx.clearRect(0, 0, 100, 100); return; }

            const isEntranceDone = entranceScale >= 0.99;
            const effPlaying = this.isPlaying && isEntranceDone;
            const stageDur = 800;

            if (effPlaying && !this.lastPlayState) {
                this.timeOffset = now - stageDur;
            }
            this.lastPlayState = effPlaying;
            const t = effPlaying ? (now - this.timeOffset) : 0;

            ctx.clearRect(0, 0, 100, 100); ctx.save();
            const contentScale = 0.75 * entranceScale;
            ctx.translate(50, 50); ctx.scale(contentScale, contentScale); ctx.translate(-50, -50);

            const cycle = stageDur * 7;
            const p = effPlaying ? (t % cycle) / stageDur : 0;

            let i1 = 0, i2 = 0, i3 = 0;
            if (p < 1) { /* empty */ } else if (p < 2) { i1 = p - 1; } else if (p < 3) { i1 = 1; i2 = p - 2; } else if (p < 4) { i1 = 1; i2 = 1; i3 = p - 3; }
            else if (p < 5) { i1 = 1 - (p - 4); i2 = 1; i3 = 1; } else if (p < 6) { i2 = 1 - (p - 5); i3 = 1; } else if (p < 7) { i3 = 1 - (p - 6); }
            i1 = easeInOut(Math.max(0, i1)); i2 = easeInOut(Math.max(0, i2)); i3 = easeInOut(Math.max(0, i3));
            const ints = [i1, i2, i3]; const maxI = Math.max(i1, i2, i3);
            const sources = [{ x: 50, y: 0 }, { x: 90, y: 20 }, { x: 10, y: 20 }]; const floorY = 82;
            ints.forEach((int, idx) => {
                if (int <= 0.01) return;
                const w = lerp(0, 30, int); ctx.save(); ctx.beginPath();
                ctx.moveTo(sources[idx].x, sources[idx].y); ctx.lineTo(50 + w, floorY + 5);
                ctx.bezierCurveTo(50 + w, floorY + 12, 50 - w, floorY + 12, 50 - w, floorY + 5);
                ctx.lineTo(sources[idx].x, sources[idx].y);
                ctx.fillStyle = `rgba(255,255,255,${int * 0.7})`; ctx.fill(); ctx.restore();
            });
            if (maxI > 0.01) {
                const maxBeamW = 30; const currentBeamW = lerp(0, maxBeamW, maxI);
                ctx.save(); ctx.globalCompositeOperation = 'destination-out';
                ctx.beginPath(); ctx.ellipse(50, floorY + 5, currentBeamW, currentBeamW * 0.3, 0, 0, Math.PI * 2);
                ctx.lineWidth = 4; ctx.stroke();
                ctx.globalCompositeOperation = 'source-over';
                ctx.beginPath(); ctx.ellipse(50, floorY + 5, currentBeamW, currentBeamW * 0.3, 0, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${maxI})`; ctx.fill();
                ctx.beginPath();
                ctx.moveTo(50 + currentBeamW, floorY + 5);
                ctx.bezierCurveTo(50 + currentBeamW, floorY + 12, 50 - currentBeamW, floorY + 12, 50 - currentBeamW, floorY + 5);
                ctx.lineWidth = 4; ctx.strokeStyle = `rgba(255, 255, 255, ${maxI})`; ctx.stroke();
                ctx.restore();
            }
            const personPath = new Path2D();
            personPath.arc(50, floorY - 52 * 0.85, 11 * 0.85, 0, 6.28);
            personPath.moveTo(50 - 18, floorY - 38 * 0.85); personPath.quadraticCurveTo(50, floorY - 43 * 0.85, 50 + 18, floorY - 38 * 0.85);
            personPath.lineTo(50 + 10, floorY); personPath.lineTo(50 - 10, floorY); personPath.closePath();
            ctx.save(); ctx.fillStyle = this.color; ctx.fill(personPath); ctx.restore();
            ints.forEach((int, idx) => {
                if (int <= 0.01) return;
                ctx.save(); ctx.beginPath();
                ctx.moveTo(sources[idx].x, sources[idx].y); ctx.lineTo(50 + 30, floorY + 5);
                ctx.bezierCurveTo(50 + 30, floorY + 12, 50 - 30, floorY + 12, 50 - 30, floorY + 5);
                ctx.lineTo(sources[idx].x, sources[idx].y); ctx.clip();
                ctx.fillStyle = 'black'; ctx.globalAlpha = int; ctx.fill(personPath); ctx.restore();
            });
            ctx.restore(); ctx.restore();
        };

        // --- AUDIO ENGINE ---
        const initAudio = async () => {
            if (audioStarted) return;
            audioStarted = true;
            unlockExperience(); // Remove overlay now that audio is ready
        };

        // --- SCROLL LOGIC ---
        const checkSilence = () => {
            clearTimeout(silenceTimer);
        };

        const playScrollSound = (index) => {
            return true;
        }

        const playFinaleEvent = (type) => {};

        const triggerScrollLock = (duration) => {
            if (isScrollLocked) return;
            isScrollLocked = true;
            lockedScrollY = window.scrollY;
            document.body.style.overflow = 'hidden';
            setTimeout(() => {
                document.body.style.overflow = ''; isScrollLocked = false;
            }, duration);
        }

        const updateScrollTriggers = () => {
            checkSilence();
            let currentScrollY = window.scrollY;

            // Hide hint if scrolling starts
            if (currentScrollY > 10) {
                setShowScrollHint(false);
            }

            if (isScrollLocked) {
                window.scrollTo(0, lockedScrollY);
                currentScrollY = lockedScrollY;
            }
            const viewportHeight = window.innerHeight;
            const totalScroll = document.documentElement.scrollHeight - viewportHeight;
            const progress = totalScroll > 0 ? currentScrollY / totalScroll : 0;
            const isBacktracking = currentScrollY < lastScrollY;

            // Text Refs
            const texts = [text1, text2, text3, text4, text5];

            if (isBacktracking) texts.forEach(t => t?.classList.add('backtracking'));
            else texts.forEach(t => t?.classList.remove('backtracking'));
            lastScrollY = currentScrollY;

            if (progress >= 0.02 && progress < 0.20) {
                if (!isBacktracking && !hasLocked.text1) { triggerScrollLock(2250); hasLocked.text1 = true; }
                text1?.classList.add('active'); text1?.classList.remove('smoke');
                if (!audioState.text1) { if (playScrollSound(1)) audioState.text1 = true; }
            } else {
                if (progress < 0.02) { hasLocked.text1 = false; audioState.text1 = false; }
                if (progress >= 0.20) { text1?.classList.remove('active'); text1?.classList.add('smoke'); }
                else { text1?.classList.remove('active'); text1?.classList.remove('smoke'); }
            }

            if (progress >= 0.20 && progress < 0.40) {
                if (!isBacktracking && !hasLocked.text2) { triggerScrollLock(1200); hasLocked.text2 = true; }
                text2?.classList.add('active'); text2?.classList.remove('smoke');
                if (!audioState.text2) { if (playScrollSound(2)) audioState.text2 = true; }
            } else {
                if (progress < 0.20) { hasLocked.text2 = false; audioState.text2 = false; }
                if (progress >= 0.40) { text2?.classList.remove('active'); text2?.classList.add('smoke'); }
                else { text2?.classList.remove('active'); text2?.classList.remove('smoke'); }
            }

            if (progress >= 0.40 && progress < 0.60) {
                if (!isBacktracking && !hasLocked.text3) { triggerScrollLock(1200); hasLocked.text3 = true; }
                text3?.classList.add('active'); text3?.classList.remove('smoke');
                if (!audioState.text3) { if (playScrollSound(3)) audioState.text3 = true; }
            } else {
                if (progress < 0.40) { hasLocked.text3 = false; audioState.text3 = false; }
                if (progress >= 0.60) { text3?.classList.remove('active'); text3?.classList.add('smoke'); }
                else { text3?.classList.remove('active'); text3?.classList.remove('smoke'); }
            }

            if (progress >= 0.60 && progress < 0.80) {
                if (!isBacktracking && !hasLocked.text4) { triggerScrollLock(1200); hasLocked.text4 = true; }
                text4?.classList.add('active'); text4?.classList.remove('smoke');
                if (!audioState.text4) { if (playScrollSound(4)) audioState.text4 = true; }
            } else {
                if (progress < 0.60) { hasLocked.text4 = false; audioState.text4 = false; }
                if (progress >= 0.80) { text4?.classList.remove('active'); text4?.classList.add('smoke'); }
                else { text4?.classList.remove('active'); text4?.classList.remove('smoke'); }
            }

            if (progress >= 0.80) {
                if (isBacktracking) {
                    // Only reset if we are definitely not resizing and moving significantly back
                    // Using isResizing guard protects against layout shifts
                    if ((isFinaleActive || isFinaleExited)) resetFinaleExit();
                    text5?.classList.remove('active');
                    clearTimeout(finaleTimer);
                    if (progress < 0.80) { hasLocked.text5 = false; audioState.text5 = false; }
                } else {
                    if (!hasLocked.text5) { triggerScrollLock(3000); hasLocked.text5 = true; }
                    if (!text5?.classList.contains('active') && !isFinaleActive) {
                        text5?.classList.add('active');
                        if (!audioState.text5) { if (playScrollSound(5)) audioState.text5 = true; }
                        if (windSynth) windSynth.volume.rampTo(-Infinity, 10);
                        clearTimeout(finaleTimer);
                        finaleTimer = setTimeout(() => {
                            if (text5?.classList.contains('active')) startFinaleSequence();
                        }, 2000);
                    }
                }
            } else {
                if (progress < 0.80) { hasLocked.text5 = false; audioState.text5 = false; }
                if (!isFinaleActive) {
                    text5?.classList.remove('active');
                    clearTimeout(finaleTimer);
                }
            }
        }

        // --- ANIMATION HELPERS ---
        const buildFancyTitle = (id, text, color) => {
            const el = rootElement.querySelector('#' + id);
            if (!el) return;
            el.innerHTML = '';
            const h2 = document.createElement('h2');
            h2.className = "font-outfit font-bold tracking-tight leading-none text-[clamp(2.5rem,6vw,6rem)]";
            h2.style.color = color;
            text.split('').forEach((char, i) => {
                const s = document.createElement('span');
                s.className = 'char-span'; s.textContent = char === ' ' ? '\u00A0' : char;
                s.style.animationDelay = (i * 0.06) + 's';
                h2.appendChild(s);
            });
            el.appendChild(h2);
        }
        const triggerFancyTitle = (id) => {
            const el = rootElement.querySelector('#' + id);
            if (el) el.querySelectorAll('.char-span').forEach(s => s.classList.add('char-reveal-anim'));
        }

        const startFinaleSequence = () => {
            if (isFinaleActive) return;
            isFinaleActive = true; isFinaleExited = false;
            playFinaleEvent('start');

            ['animate-exit-icon', 'animate-exit-text'].forEach(c => rootElement.querySelectorAll('.' + c).forEach(el => el.classList.remove(c)));
            if (itemGreen) itemGreen.style.opacity = '1';
            if (itemBlue) itemBlue.style.opacity = '1';
            if (itemPurple) itemPurple.style.opacity = '1';

            buildFancyTitle('title-green', 'Sounds', '#00C2A3');
            buildFancyTitle('title-blue', 'Screens', '#56C6FF');
            buildFancyTitle('title-purple', 'Stages', '#A88EFF');

            text5?.classList.add('finale-fade-out');
            finaleContainer?.classList.remove('opacity-0');
            zoomDiv?.classList.add('animate-zoom-entrance');
            spinDiv?.classList.add('animate-spin-group');
            rootElement.querySelectorAll('.spin-counter').forEach(el => el.classList.add('animate-spin-icon-counter'));
            itemGreen?.classList.add('animate-move-green');
            itemBlue?.classList.add('animate-move-blue');
            itemPurple?.classList.add('animate-move-purple');

            seqTimers.forEach(t => clearTimeout(t)); seqTimers = [];

            seqTimers.push(setTimeout(() => {
                waveIcon.start(); waveIcon.setPlaying(true);
                playFinaleEvent('green');
                if (itemGreen) itemGreen.style.opacity = '1';
                if (itemBlue) itemBlue.style.opacity = '0.5';
                if (itemPurple) itemPurple.style.opacity = '0.5';
            }, 4500));
            seqTimers.push(setTimeout(() => triggerFancyTitle('title-green'), 5000));

            seqTimers.push(setTimeout(() => {
                uxIcon.start(); uxIcon.setPlaying(true);
                playFinaleEvent('blue');
                if (itemGreen) itemGreen.style.opacity = '0.5';
                if (itemBlue) itemBlue.style.opacity = '1';
                if (itemPurple) itemPurple.style.opacity = '0.5';
            }, 7000));
            seqTimers.push(setTimeout(() => triggerFancyTitle('title-blue'), 7500));

            seqTimers.push(setTimeout(() => {
                theatreIcon.start(); theatreIcon.setPlaying(true);
                playFinaleEvent('purple');
                if (itemGreen) itemGreen.style.opacity = '0.5';
                if (itemBlue) itemBlue.style.opacity = '0.5';
                if (itemPurple) itemPurple.style.opacity = '1';
            }, 9500));
            seqTimers.push(setTimeout(() => triggerFancyTitle('title-purple'), 10000));

            seqTimers.push(setTimeout(() => {
                if (itemGreen) itemGreen.style.opacity = '1';
                if (itemBlue) itemBlue.style.opacity = '1';
                if (itemPurple) itemPurple.style.opacity = '1';
            }, 12000));

            seqTimers.push(setTimeout(() => triggerFinaleExit(), 14500));
        }

        const triggerFinaleExit = () => {
            if (isFinaleExited) return;
            isFinaleExited = true;
            playFinaleEvent('exit');
            seqTimers.forEach(t => clearTimeout(t)); seqTimers = [];

            // --- ON COMPLETE HOOK (Visual & Logic) ---
            setTimeout(() => {
                navigate('/'); // Force redirect to Home

                // Delay unmount slightly to ensure Router state updates to '/' before Layout mounts.
                // THIS FIXES THE "FLASH" BUG.
                setTimeout(() => {
                    if (onComplete) onComplete(false); // Transitions to Home safely
                }, 100);
            }, 4000);

            // Fade out stars after icons leave
            setTimeout(() => {
                if (canvas) {
                    canvas.style.transition = 'opacity 2s ease-in-out';
                    canvas.style.opacity = '0';
                }
            }, 1200);

            const gIcon = itemGreen?.querySelector('.icon-wrapper'); const gText = rootElement.querySelector('#title-green');
            if (gIcon) gIcon.classList.add('animate-exit-icon'); if (gText) gText.classList.add('animate-exit-text');

            setTimeout(() => {
                const bIcon = itemBlue?.querySelector('.icon-wrapper'); const bText = rootElement.querySelector('#title-blue');
                if (bIcon) bIcon.classList.add('animate-exit-icon'); if (bText) bText.classList.add('animate-exit-text');
            }, 150);

            setTimeout(() => {
                const pIcon = itemPurple?.querySelector('.icon-wrapper'); const pText = rootElement.querySelector('#title-purple');
                if (pIcon) pIcon.classList.add('animate-exit-icon'); if (pText) pText.classList.add('animate-exit-text');
            }, 300);
        }

        const resetFinaleExit = () => {
            isFinaleActive = false; isFinaleExited = false;
            seqTimers.forEach(t => clearTimeout(t)); seqTimers = [];

            if (canvas) {
                canvas.style.transition = 'opacity 3s ease-in-out';
                canvas.style.opacity = '1';
            }

            if (finaleContainer) {
                finaleContainer.style.transition = 'none';
                finaleContainer.classList.add('opacity-0');
                void finaleContainer.offsetWidth;
                setTimeout(() => { finaleContainer.style.transition = ''; }, 50);
            }
            ['animate-exit-icon', 'animate-exit-text', 'animate-zoom-entrance', 'animate-spin-group', 'animate-move-green', 'animate-move-blue', 'animate-move-purple'].forEach(c => {
                rootElement.querySelectorAll('.' + c).forEach(el => el.classList.remove(c));
            });
            rootElement.querySelectorAll('.animate-spin-icon-counter').forEach(el => el.classList.remove('animate-spin-icon-counter'));
            rootElement.querySelectorAll('.char-reveal-anim').forEach(el => el.classList.remove('char-reveal-anim'));
            if (itemGreen) itemGreen.style.opacity = '1';
            if (itemBlue) itemBlue.style.opacity = '1';
            if (itemPurple) itemPurple.style.opacity = '1';
            text5?.classList.remove('finale-fade-out');
            waveIcon.show = false; uxIcon.show = false; theatreIcon.show = false;
        }

        // --- ANIMATION LOOP ---
        function globalAnimate() {
            const now = Date.now();
            if (isFinaleActive) { waveIcon.draw(now); uxIcon.draw(now); theatreIcon.draw(now); }
            const dt = (now - lastTime) * 0.001; lastTime = now;
            if (ctx && bgGradient) {
                ctx.fillStyle = bgGradient; ctx.fillRect(0, 0, width, height);
                ctx.globalCompositeOperation = 'screen';
                hazeParticles.forEach(haze => { haze.update(); haze.draw(); });
                stars.forEach(star => { star.update(dt); star.draw(); });
                ctx.globalCompositeOperation = 'source-over';
            }
            animationFrameId = requestAnimationFrame(globalAnimate);
        }

        // --- EXECUTION ---
        resize_sf();
        genSprites();
        if (canvas) {
            for (let i = 0; i < STAR_COUNT; i++) stars.push(new StarObj());
            for (let i = 0; i < HAZE_COUNT; i++) hazeParticles.push(new HazeObj());
        }
        const waveIcon = new WaveformIcon('canvas-sound');
        const uxIcon = new UXIcon('canvas-screen');
        const theatreIcon = new TheatreIcon('canvas-theatre');

        globalAnimate();

        const onScroll = () => updateScrollTriggers();
        const onResize = () => resize_sf();

        window.addEventListener('scroll', onScroll);
        window.addEventListener('resize', onResize);

        // Force scroll to top on mount
        window.scrollTo(0, 0);

        // Add class to body for scrollbar hiding
        document.body.classList.add('intro-experience-active');
        document.documentElement.classList.add('intro-experience-active');

        // Cleanup
        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onResize);
            cancelAnimationFrame(animationFrameId);
            clearTimeout(silenceTimer);
            clearTimeout(finaleTimer);
            seqTimers.forEach(t => clearTimeout(t));

            if (introOverlay) {
                introOverlay.removeEventListener('wheel', preventScroll);
                introOverlay.removeEventListener('touchmove', preventScroll);
            }
            window.removeEventListener('keydown', preventScrollKeys);

            document.body.classList.remove('intro-experience-active');
            document.documentElement.classList.remove('intro-experience-active');

            if (btnOn) { btnOn.onclick = null; btnOn.onkeydown = null; }
            if (btnOff) { btnOff.onclick = null; btnOff.onkeydown = null; }
            if (btnSkip) { btnSkip.onclick = null; btnSkip.onkeydown = null; }

            if (audioStarted) {
                try {
                    if (masterBus) masterBus.gain.rampTo(0, 0.1);
                    setTimeout(() => {
                        [padSynth, pianoSynth, droneSynth, windSynth, masterBus, reverb, delay].forEach(n => n?.dispose());
                    }, 150);
                } catch { /* ignore */ }
            }
        };
    }, [navigate, onComplete]);

    // JSX RENDER
    return (
        <div ref={rootRef} className="relative w-full bg-[#050508] text-white overflow-hidden font-sans">

            {/* INTRO OVERLAY */}
            <div id="intro-overlay">
                <h2 id="intro-text" className="text-white text-center font-public font-medium text-xl md:text-2xl tracking-wide opacity-0 transition-opacity duration-500 mb-16 max-w-lg px-6 leading-relaxed">
                    Hello my friend. <br />Would you like the full <span className="font-semibold">audio experience</span> while browsing my website?
                </h2>

                <div id="intro-icons" className="flex gap-12 md:gap-24 opacity-0 transition-opacity duration-500">

                    {/* Sound On Btn (Green: #00C2A3) */}
                    <div id="btn-sound-on" role="button" aria-label="Enable Audio" tabIndex="0" className="group cursor-pointer flex flex-col items-center gap-6 outline-none">
                        <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-[#00C2A3] bg-transparent group-hover:bg-[#00C2A3] group-hover:scale-110 transition-all duration-500 flex items-center justify-center overflow-hidden backdrop-blur-sm shadow-2xl focus-visible:ring-2 focus-visible:ring-[#00C2A3]">
                            <Volume2 strokeWidth={2} className="w-10 h-10 text-[#00C2A3] group-hover:text-[#050508] transition-colors duration-500" />
                        </div>
                    </div>

                    {/* Sound Off Btn (Orange: #CE4D35) */}
                    <div id="btn-sound-off" role="button" aria-label="Silent Mode" tabIndex="0" className="group cursor-pointer flex flex-col items-center gap-6 outline-none">
                        <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-[#CE4D35] bg-transparent group-hover:bg-[#CE4D35] group-hover:scale-110 transition-all duration-500 flex items-center justify-center overflow-hidden backdrop-blur-sm shadow-2xl focus-visible:ring-2 focus-visible:ring-[#CE4D35]">
                            <VolumeX strokeWidth={2} className="w-10 h-10 text-[#CE4D35] group-hover:text-[#050508] transition-colors duration-500" />
                        </div>
                    </div>

                </div>

                {/* Skip Intro Button */}
                <button id="btn-skip-intro" className="mt-16 text-xs text-gray-400 font-light hover:text-white transition-colors cursor-pointer uppercase tracking-widest opacity-0 transition-opacity duration-500 outline-none focus-visible:text-white" aria-disabled="true">
                    Skip Intro
                </button>

            </div>

            {/* Scroll Track */}
            <div style={{ height: '1000vh' }}></div>

            {/* Fixed Content Container */}
            <div className="fixed inset-0 z-10 pointer-events-none">
                <div className="absolute inset-0 flex items-center justify-center p-6">
                    <h1 id="text1" className="scrolly-text text-[clamp(1.5rem,min(5vw,10vh),6rem)] font-outfit font-semibold text-center leading-tight tracking-tight text-white max-w-6xl">
                        I’m drawn to ambitious projects that explore <span className="inner-light">new paths</span>—or old paths in new ways.
                    </h1>
                </div>
                <div className="absolute inset-0 flex items-center justify-center p-6">
                    <h1 id="text2" className="scrolly-text fast-entry text-[clamp(1.5rem,min(5vw,10vh),6rem)] font-outfit font-semibold text-center leading-tight tracking-tight text-white max-w-6xl">
                        I value <span className="inner-light">efficient design</span>: using only what’s necessary to serve the goal.
                    </h1>
                </div>
                <div className="absolute inset-0 flex items-center justify-center p-6">
                    <h1 id="text3" className="scrolly-text fast-entry text-[clamp(1.5rem,min(5vw,10vh),6rem)] font-outfit font-semibold text-center leading-tight tracking-tight text-white max-w-6xl">
                        I work <span className="inner-light">openly and collaboratively</span>, and believe that good ideas can come from anywhere.
                    </h1>
                </div>
                <div className="absolute inset-0 flex items-center justify-center p-6">
                    <h1 id="text4" className="scrolly-text fast-entry text-[clamp(1.5rem,min(5vw,10vh),6rem)] font-outfit font-semibold text-center leading-tight tracking-tight text-white max-w-6xl">
                        I see constraints not as limitations, but as invitations for <span className="inner-light">creative thinking</span>.
                    </h1>
                </div>
                <div className="absolute inset-x-0 top-0 pt-[15vh] flex justify-center p-6">
                    <h1 id="text5" className="scrolly-text fast-entry text-[clamp(1.5rem,min(5vw,10vh),6rem)] font-outfit font-semibold text-center leading-tight tracking-tight text-white max-w-6xl">
                        I express these values through:
                    </h1>
                </div>
            </div>

            {/* FINALE ANIMATION CONTAINER */}
            <div id="finale-container" className="fixed inset-0 z-20 pointer-events-none opacity-0 transition-opacity duration-1000">
                <div id="finale-zoom" className="absolute inset-0">
                    <div id="finale-spin" className="absolute inset-0">

                        {/* STAGE (Purple) */}
                        <div id="item-purple" className="absolute left-1/2 top-1/2 w-[12vmin] h-[12vmin] z-10 transition-opacity duration-700 opacity-1">
                            <div className="spin-counter relative w-full h-full">
                                <div className="icon-wrapper rounded-full flex items-center justify-center relative overflow-hidden w-full h-full bg-[#A88EFF] shadow-2xl shadow-purple-500/20">
                                    <canvas id="canvas-theatre" className="w-full h-full object-contain"></canvas>
                                </div>
                                <div id="title-purple" className="absolute left-full top-0 h-full flex items-center pl-[3vw] w-[60vw]"></div>
                            </div>
                        </div>

                        {/* SCREEN (Blue) */}
                        <div id="item-blue" className="absolute left-1/2 top-1/2 w-[12vmin] h-[12vmin] z-10 transition-opacity duration-700 opacity-1">
                            <div className="spin-counter relative w-full h-full">
                                <div className="icon-wrapper rounded-full flex items-center justify-center relative overflow-hidden w-full h-full bg-[#56C6FF] shadow-2xl shadow-sky-500/20">
                                    <canvas id="canvas-screen" className="w-full h-full object-contain"></canvas>
                                </div>
                                <div id="title-blue" className="absolute left-full top-0 h-full flex items-center pl-[3vw] w-[60vw]"></div>
                            </div>
                        </div>

                        {/* SOUND (Green) */}
                        <div id="item-green" className="absolute left-1/2 top-1/2 w-[12vmin] h-[12vmin] z-10 transition-opacity duration-700 opacity-1">
                            <div className="spin-counter relative w-full h-full">
                                <div className="icon-wrapper rounded-full flex items-center justify-center relative overflow-hidden w-full h-full bg-[#00C2A3] shadow-2xl shadow-teal-500/20">
                                    <canvas id="canvas-sound" className="w-full h-full object-contain"></canvas>
                                </div>
                                <div id="title-green" className="absolute left-full top-0 h-full flex items-center pl-[3vw] w-[60vw]"></div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <canvas id="starfield" className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none"></canvas>

            <ScrollHint show={showScrollHint} />
        </div>
    );
};

export default IntroExperience;
