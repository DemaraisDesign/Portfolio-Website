import React, { useRef, useEffect } from 'react';

// --- SHARED MATH UTILS ---
const lerp = (start, end, t) => start * (1 - t) + end * t;
const easeInOut = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

// ==========================================
// 1. SOUND ICON (Waveform)
// ==========================================
const WAVEFORM_STATIC_PATTERN = [0.15, 0.25, 0.40, 0.55, 0.70, 0.85, 0.75, 0.60, 0.45, 0.30];

export const Waveform = ({ color = '#FFFFFF', speed = 1, isPlaying = false }) => {
    const canvasRef = useRef(null);
    const intensityRef = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current; if (!canvas) return; const ctx = canvas.getContext('2d'); let animationFrameId;
        const logicalSize = 200; canvas.width = logicalSize; canvas.height = logicalSize;
        const numBars = 20; const heights = new Float32Array(numBars);
        const totalContentWidth = logicalSize * 0.75; const margin = (logicalSize - totalContentWidth) / 2;
        const gapRatio = 0.4; const barUnit = totalContentWidth / numBars; const barWidth = barUnit * (1 - gapRatio); const spacing = barUnit * gapRatio;
        const halfBars = Math.ceil(numBars / 2);

        const animate = () => {
            const targetIntensity = isPlaying ? 1 : 0; const transitionSpeed = 0.05;
            if (intensityRef.current < targetIntensity) { intensityRef.current = Math.min(intensityRef.current + transitionSpeed, 1); }
            else if (intensityRef.current > targetIntensity) { intensityRef.current = Math.max(intensityRef.current - transitionSpeed, 0); }
            const intensity = intensityRef.current;
            ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = color;
            const t = Date.now() * speed;
            for (let i = 0; i < halfBars; i++) {
                const rawStatic = WAVEFORM_STATIC_PATTERN[i] !== undefined ? WAVEFORM_STATIC_PATTERN[i] : 0.2;
                const hStatic = rawStatic * (canvas.height * 0.5);
                let hDynamic;
                if (i === 0) { hDynamic = canvas.height * 0.1; } else {
                    const n1 = Math.sin(t * 0.02 + i * 235); const n2 = Math.cos(t * 0.005 + i * 110); const n3 = Math.sin(t * 0.015);
                    let raw = (n1 + n2 + n3 + 3) / 6; raw = Math.pow(raw, 2.5) * 2.0; if (raw > 1) raw = 1;
                    const percentageToCenter = i / (halfBars - 1); const heightLimit = 0.4 + (0.6 * percentageToCenter); const finalScale = raw * heightLimit;
                    hDynamic = finalScale * (canvas.height * 0.6); if (hDynamic < canvas.height * 0.1) hDynamic = canvas.height * 0.1;
                }
                const h = hStatic * (1 - intensity) + hDynamic * intensity;
                heights[i] = h; heights[numBars - 1 - i] = h;
            }
            for (let i = 0; i < numBars; i++) {
                const x = margin + i * (barWidth + spacing); const y = (canvas.height - heights[i]) / 2;
                ctx.beginPath();
                ctx.roundRect(x, y, barWidth, heights[i], [barWidth / 2]);
                ctx.fill();
            }
            if (isPlaying || intensityRef.current > 0) {
                animationFrameId = requestAnimationFrame(animate);
            }
        };
        animate(); return () => cancelAnimationFrame(animationFrameId);
    }, [color, speed, isPlaying]);

    return (<div className="w-full h-full flex items-center justify-center overflow-hidden"><canvas ref={canvasRef} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /></div>);
};

// ==========================================
// 2. SCREEN ICON (UX/Phone)
// ==========================================
export const UXIcon = ({ color = '#FFFFFF', speed = 1, isPlaying = false }) => {
    const canvasRef = useRef(null);
    const intensityRef = useRef(0);
    const timeOffset = useRef(0);
    const lastPlayState = useRef(isPlaying);

    useEffect(() => {
        const canvas = canvasRef.current; if (!canvas) return; const ctx = canvas.getContext('2d'); let animationFrameId;
        const logicalSize = 200; canvas.width = logicalSize; canvas.height = logicalSize; ctx.scale(2, 2); const REF_SIZE = 100;
        const drawRoundedRect = (x, y, w, h, r) => { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath(); };
        const layouts = [[{ x: 0, y: 0, w: 1, h: 0.25 }, { x: 0, y: 0.3, w: 0.45, h: 0.7 }, { x: 0.5, y: 0.3, w: 0.5, h: 0.7 }], [{ x: 0, y: 0, w: 1, h: 0.2 }, { x: 0, y: 0.25, w: 1, h: 0.35 }, { x: 0, y: 0.65, w: 1, h: 0.35 }], [{ x: 0, y: 0, w: 0.3, h: 1 }, { x: 0.35, y: 0, w: 0.65, h: 0.5 }, { x: 0.35, y: 0.55, w: 0.65, h: 0.45 }]];
        const animate = () => {
            const cycleDuration = 2000;
            if (isPlaying && !lastPlayState.current) { timeOffset.current = (Date.now() * speed) - (cycleDuration - 600); }
            lastPlayState.current = isPlaying;
            const t = (Date.now() * speed) - timeOffset.current;
            const targetIntensity = isPlaying ? 1 : 0; const transitionSpeed = 0.08;
            if (intensityRef.current < targetIntensity) { intensityRef.current = Math.min(intensityRef.current + transitionSpeed, 1); }
            else if (intensityRef.current > targetIntensity) { intensityRef.current = Math.max(intensityRef.current - transitionSpeed, 0); }
            ctx.clearRect(0, 0, REF_SIZE, REF_SIZE); ctx.save(); const contentScale = 0.75; ctx.translate(REF_SIZE / 2, REF_SIZE / 2); ctx.scale(contentScale, contentScale); ctx.translate(-REF_SIZE / 2, -REF_SIZE / 2); ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 4; ctx.lineCap = "round"; ctx.lineJoin = "round";
            const phoneW = 50; const phoneH = 80; const phoneX = (REF_SIZE - phoneW) / 2; const phoneY = (REF_SIZE - phoneH) / 2;
            ctx.save(); drawRoundedRect(phoneX, phoneY, phoneW, phoneH, 6); ctx.stroke(); ctx.beginPath(); ctx.arc(phoneX + phoneW / 2, phoneY + phoneH - 8, 3, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.moveTo(phoneX + phoneW / 2 - 6, phoneY + 8); ctx.lineTo(phoneX + phoneW / 2 + 6, phoneY + 8); ctx.stroke(); ctx.restore();
            ctx.save(); const screenMargin = 14; const screenW = phoneW - 12; const screenH = phoneH - 28; const screenX = phoneX + 6; const screenY = phoneY + screenMargin;
            const totalTime = t % (cycleDuration * 3); const layoutIndex = Math.floor(totalTime / cycleDuration); const nextLayoutIndex = (layoutIndex + 1) % 3; const timeInCycle = totalTime % cycleDuration; let morphT = 0;
            if (timeInCycle > (cycleDuration - 600)) { morphT = easeInOut((timeInCycle - (cycleDuration - 600)) / 600); }
            const currentLayout = layouts[layoutIndex]; const nextLayout = layouts[nextLayoutIndex];
            for (let b = 0; b < 3; b++) {
                const start = currentLayout[b]; const end = nextLayout[b]; const activeT = isPlaying ? morphT : 0; const activeStart = isPlaying ? start : layouts[0][b]; const activeEnd = isPlaying ? end : layouts[0][b];
                const xPct = lerp(activeStart.x, activeEnd.x, activeT); const yPct = lerp(activeStart.y, activeEnd.y, activeT); const wPct = lerp(activeStart.w, activeEnd.w, activeT); const hPct = lerp(activeStart.h, activeEnd.h, activeT);
                const finalX = screenX + (xPct * screenW); const finalY = screenY + (yPct * screenH); const finalW = wPct * screenW; const finalH = hPct * screenH;
                if (b === 2) {
                    const fixedLineHeight = 3; const fixedGap = 4; const stride = fixedLineHeight + fixedGap; ctx.save(); ctx.beginPath(); ctx.rect(finalX, finalY, finalW, finalH); ctx.clip(); const maxLines = Math.ceil(screenH / stride);
                    for (let l = 0; l < maxLines; l++) { const ly = finalY + l * stride; const distFromBottom = (finalY + finalH) - ly; const fadeThreshold = fixedLineHeight + 2; let alpha = 1; if (distFromBottom < fadeThreshold) alpha = Math.max(0, distFromBottom / fadeThreshold); ctx.globalAlpha = alpha; ctx.fillRect(finalX, ly, finalW, fixedLineHeight); ctx.globalAlpha = 1.0; } ctx.restore();
                } else { ctx.fillRect(finalX, finalY, finalW, finalH); }
            }
            ctx.restore(); ctx.restore();
            if (isPlaying) {
                animationFrameId = requestAnimationFrame(animate);
            }
        };
        animate(); return () => cancelAnimationFrame(animationFrameId);
    }, [color, speed, isPlaying]);

    return (<div className="w-full h-full flex items-center justify-center overflow-hidden"><canvas ref={canvasRef} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /></div>);
};

// ==========================================
// 3. STAGE ICON (Lighting Director)
// ==========================================
export const TheatreIcon = ({ color = '#FFFFFF', speed = 1, isPlaying = false }) => {
    const canvasRef = useRef(null);
    const timeOffset = useRef(0);
    const lastPlayState = useRef(isPlaying);

    useEffect(() => {
        const canvas = canvasRef.current; if (!canvas) return; const ctx = canvas.getContext('2d'); let animationFrameId;
        const logicalSize = 200; canvas.width = logicalSize; canvas.height = logicalSize; ctx.scale(2, 2); const REF_SIZE = 100;
        const getLightIntensities = (progress) => {
            let i1 = 0, i2 = 0, i3 = 0; const p = Math.max(0, progress);
            if (p < 1) { i1 = 0; i2 = 0; i3 = 0; } else if (p < 2) { i1 = p - 1; i2 = 0; i3 = 0; } else if (p < 3) { i1 = 1; i2 = p - 2; i3 = 0; } else if (p < 4) { i1 = 1; i2 = 1; i3 = p - 3; } else if (p < 5) { i1 = 1 - (p - 4); i2 = 1; i3 = 1; } else if (p < 6) { i1 = 0; i2 = 1 - (p - 5); i3 = 1; } else if (p < 7) { i1 = 0; i2 = 0; i3 = 1 - (p - 6); } else { i1 = 0; i2 = 0; i3 = 0; }
            return [easeInOut(i1), easeInOut(i2), easeInOut(i3)];
        };
        const animate = () => {
            const stageDuration = 800;

            // Resume from stage 4 (all lights on) to match the idle visual
            if (isPlaying && !lastPlayState.current) {
                timeOffset.current = (Date.now() * speed) - (4 * stageDuration);
            }
            lastPlayState.current = isPlaying;

            const t = (Date.now() * speed) - timeOffset.current;

            ctx.clearRect(0, 0, REF_SIZE, REF_SIZE); ctx.save(); const contentScale = 0.75; ctx.translate(REF_SIZE / 2, REF_SIZE / 2); ctx.scale(contentScale, contentScale); ctx.translate(-REF_SIZE / 2, -REF_SIZE / 2);
            const totalStages = 7; const totalCycleTime = stageDuration * totalStages; const loopProgress = isPlaying ? (t % totalCycleTime) / stageDuration : 4;
            const [i1, i2, i3] = getLightIntensities(loopProgress); const intensities = [i1, i2, i3]; const maxIntensity = Math.max(i1, i2, i3);
            const centerX = REF_SIZE / 2; const floorY = REF_SIZE - 18; const lightSourceY_Center = 0; const lightSourceY_Side = 20; const lightOffsetX = 40;
            const lightSources = [{ x: centerX, y: lightSourceY_Center }, { x: centerX + lightOffsetX, y: lightSourceY_Side }, { x: centerX - lightOffsetX, y: lightSourceY_Side }];
            const figScale = 0.85; const headR = 11 * figScale; const headCenterY = floorY - 52 * figScale; const bodyTopY = floorY - 38 * figScale; const bodyBottomY = floorY; const shoulderW = 36 * figScale; const waistW = 20 * figScale;
            const drawHead = () => { ctx.beginPath(); ctx.arc(centerX, headCenterY, headR, 0, Math.PI * 2); ctx.closePath(); };
            const drawBody = () => { 
                ctx.beginPath(); 
                ctx.moveTo(centerX - shoulderW / 2 + 1.5, bodyTopY); 
                ctx.quadraticCurveTo(centerX, bodyTopY - 5, centerX + shoulderW / 2 - 1.5, bodyTopY); 
                ctx.quadraticCurveTo(centerX + shoulderW / 2 + 0.5, bodyTopY + 0.5, centerX + shoulderW / 2, bodyTopY + 2);
                ctx.lineTo(centerX + waistW / 2, bodyBottomY - 2); 
                ctx.quadraticCurveTo(centerX + waistW / 2 - 0.5, bodyBottomY, centerX + waistW / 2 - 2, bodyBottomY);
                ctx.lineTo(centerX - waistW / 2 + 2, bodyBottomY); 
                ctx.quadraticCurveTo(centerX - waistW / 2 + 0.5, bodyBottomY, centerX - waistW / 2, bodyBottomY - 2);
                ctx.lineTo(centerX - shoulderW / 2, bodyTopY + 2);
                ctx.quadraticCurveTo(centerX - shoulderW / 2 - 0.5, bodyTopY + 0.5, centerX - shoulderW / 2 + 1.5, bodyTopY);
                ctx.closePath(); 
            };
            intensities.forEach((intensity, index) => { if (intensity <= 0.01) return; const source = lightSources[index]; const minBeamW = 0; const maxBeamW = 30; const currentBeamW = lerp(minBeamW, maxBeamW, intensity); const lightOpacity = intensity; ctx.save(); ctx.beginPath(); ctx.moveTo(centerX - currentBeamW, floorY + 5); ctx.arcTo(source.x, source.y, centerX + currentBeamW, floorY + 5, 2); ctx.lineTo(centerX + currentBeamW, floorY + 5); ctx.bezierCurveTo(centerX + currentBeamW, floorY + 12, centerX - currentBeamW, floorY + 12, centerX - currentBeamW, floorY + 5); ctx.closePath(); ctx.fillStyle = `rgba(255, 255, 255, ${lightOpacity * 0.7})`; ctx.fill(); ctx.restore(); });
            if (maxIntensity > 0.01) {
                const maxBeamW = 30;
                const currentBeamW = lerp(0, maxBeamW, maxIntensity);
                ctx.save();
                ctx.beginPath();
                ctx.ellipse(centerX, floorY + 5, currentBeamW, currentBeamW * 0.3, 0, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${maxIntensity})`;
                ctx.fill();
                ctx.globalCompositeOperation = 'destination-out';
                ctx.beginPath();
                ctx.ellipse(centerX, floorY + 5, currentBeamW + 1.5, (currentBeamW * 0.3) + 0.5, 0, 0, Math.PI * 2);
                ctx.lineWidth = 3;
                ctx.stroke();
                ctx.restore();
            }
            ctx.save(); ctx.fillStyle = color; ctx.globalAlpha = 1; drawHead(); ctx.fill(); drawBody(); ctx.fill(); ctx.restore();
            intensities.forEach((intensity, index) => { if (intensity <= 0.01) return; const source = lightSources[index]; const minBeamW = 0; const maxBeamW = 30; const currentBeamW = lerp(minBeamW, maxBeamW, intensity); const lightOpacity = intensity; ctx.save(); ctx.beginPath(); ctx.moveTo(centerX - currentBeamW, floorY + 5); ctx.arcTo(source.x, source.y, centerX + currentBeamW, floorY + 5, 2); ctx.lineTo(centerX + currentBeamW, floorY + 5); ctx.bezierCurveTo(centerX + currentBeamW, floorY + 12, centerX - currentBeamW, floorY + 12, centerX - currentBeamW, floorY + 5); ctx.closePath(); ctx.clip(); ctx.globalAlpha = lightOpacity; ctx.fillStyle = 'black'; drawHead(); ctx.fill(); drawBody(); ctx.fill(); ctx.restore(); });
            ctx.restore();
            if (isPlaying) {
                animationFrameId = requestAnimationFrame(animate);
            }
        };
        animate(); return () => cancelAnimationFrame(animationFrameId);
    }, [color, speed, isPlaying]);
    return (<div className="w-full h-full flex items-center justify-center overflow-hidden"><canvas ref={canvasRef} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /></div>);
};

// ==========================================
// 4. EXPERIMENTS ICON (Distillation Apparatus)
// ==========================================
export const ExperimentsIcon = ({ color = '#FFFFFF', speed = 1, isPlaying = false }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current; if (!canvas) return; const ctx = canvas.getContext('2d'); let animationFrameId;
        const logicalSize = 200; canvas.width = logicalSize; canvas.height = logicalSize; ctx.scale(2, 2); const REF_SIZE = 100;

        // GEOMETRY
        const floorY = REF_SIZE - 20;

        // Left Flask (Erlenmeyer)
        const leftX = 30;
        const leftBaseW = 32;
        const leftNeckW = 12; // Thicker 
        const leftH = 36;
        const leftNeckH = 14;
        const leftY = floorY;

        // Right Flask (Round)
        const rightX = 70;
        const rightR = 15;
        const rightNeckH = 14;
        const rightNeckW = 12; // Thicker
        const rightY = floorY - 5;

        // Connection
        const connectionY = floorY - leftH - leftNeckH - 10;

        const drawApparatus = () => {
            // 1. LEFT FLASK (Erlenmeyer)
            ctx.beginPath();
            const lCenter = leftX;
            const lTopY = leftY - leftH;
            const lNeckTopY = lTopY - leftNeckH;

            ctx.moveTo(lCenter - leftNeckW / 2, lNeckTopY);
            ctx.lineTo(lCenter + leftNeckW / 2, lNeckTopY);
            ctx.lineTo(lCenter + leftNeckW / 2, lTopY);
            ctx.lineTo(lCenter + leftBaseW / 2, leftY);
            ctx.quadraticCurveTo(lCenter + leftBaseW / 2, leftY + 3, lCenter + leftBaseW / 2 - 3, leftY + 3);
            ctx.lineTo(lCenter - leftBaseW / 2 + 3, leftY + 3);
            ctx.quadraticCurveTo(lCenter - leftBaseW / 2, leftY + 3, lCenter - leftBaseW / 2, leftY);
            ctx.lineTo(lCenter - leftNeckW / 2, lTopY);
            ctx.closePath();
            ctx.stroke();

            // 2. RIGHT FLASK (Round)
            const rCenter = rightX;
            const rCenterY = rightY - rightR;
            const rNeckTopY = rCenterY - rightR - rightNeckH;

            ctx.beginPath();
            ctx.moveTo(rCenter - rightNeckW / 2, rNeckTopY);
            ctx.lineTo(rCenter + rightNeckW / 2, rNeckTopY);
            ctx.lineTo(rCenter + rightNeckW / 2, rCenterY - rightR + 3);
            ctx.arc(rCenter, rCenterY, rightR, -Math.PI / 2 + 0.5, Math.PI * 2 - 0.5 - Math.PI / 2);
            ctx.lineTo(rCenter - rightNeckW / 2, rNeckTopY);
            ctx.closePath();
            ctx.stroke();

            // 3. CONNECTION Tube & Coil
            ctx.save();
            ctx.lineJoin = "round";
            ctx.beginPath();
            ctx.moveTo(leftX, lNeckTopY + 5);
            ctx.lineTo(leftX, connectionY + 12);
            ctx.quadraticCurveTo(leftX, connectionY, leftX + 8, connectionY);

            // Coil Loops
            const coilStart = leftX + 8;
            const coilEnd = rightX - 8;
            const coilW = coilEnd - coilStart;
            const loops = 3;
            const loopW = coilW / loops;

            let cx = coilStart;
            for (let i = 0; i < loops; i++) {
                ctx.bezierCurveTo(cx + loopW / 4, connectionY - 14, cx + loopW * 0.75, connectionY - 14, cx + loopW, connectionY);
                cx += loopW;
            }

            ctx.quadraticCurveTo(rightX, connectionY, rightX, connectionY + 12);
            ctx.lineTo(rightX, rNeckTopY + 5);
            ctx.stroke();
            ctx.restore();
        };

        const drawLiquids = (t) => {
            // LEFT FLASK LIQUID (Boiling)
            ctx.save();
            ctx.beginPath();
            const lCenter = leftX;
            const lTopY = leftY - leftH;
            const lNeckTopY = lTopY - leftNeckH;
            ctx.moveTo(lCenter - leftNeckW / 2, lNeckTopY);
            ctx.lineTo(lCenter + leftNeckW / 2, lNeckTopY);
            ctx.lineTo(lCenter + leftNeckW / 2, lTopY);
            ctx.lineTo(lCenter + leftBaseW / 2, leftY);
            ctx.quadraticCurveTo(lCenter + leftBaseW / 2, leftY + 3, lCenter + leftBaseW / 2 - 3, leftY + 3);
            ctx.lineTo(lCenter - leftBaseW / 2 + 3, leftY + 3);
            ctx.quadraticCurveTo(lCenter - leftBaseW / 2, leftY + 3, lCenter - leftBaseW / 2, leftY);
            ctx.lineTo(lCenter - leftNeckW / 2, lTopY);
            ctx.closePath();
            ctx.clip();

            const fillH = 16;
            const surfaceY = leftY - fillH;

            // White liquid @ 20% opacity (visible on Red bg)
            ctx.fillStyle = color;
            ctx.globalAlpha = 0.2;
            ctx.fillRect(lCenter - 20, surfaceY, 40, fillH + 5);

            // Bubbles (Slower: 0.005 -> 0.003)
            const bubT = t * 0.003;
            ctx.globalAlpha = 1.0;
            for (let i = 0; i < 5; i++) {
                const offset = i * 2;
                const bx = lCenter + Math.sin(bubT + offset) * 7;
                const by = leftY - 4 - (Math.abs(Math.sin(bubT * 2 + i)) * 12) % 15;
                const r = 1.8;
                ctx.beginPath(); ctx.arc(bx, by, r, 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.fill();
            }
            ctx.restore();

            // RIGHT FLASK LIQUID (Boiling/Collecting)
            ctx.save();
            const rCenter = rightX;
            const rCenterY = rightY - rightR;
            const rNeckTopY = rCenterY - rightR - rightNeckH;

            ctx.beginPath();
            ctx.moveTo(rCenter - rightNeckW / 2, rNeckTopY);
            ctx.lineTo(rCenter + rightNeckW / 2, rNeckTopY);
            ctx.lineTo(rCenter + rightNeckW / 2, rCenterY - rightR + 3);
            ctx.arc(rCenter, rCenterY, rightR, -Math.PI / 2 + 0.5, Math.PI * 2 - 0.5 - Math.PI / 2);
            ctx.lineTo(rCenter - rightNeckW / 2, rNeckTopY);
            ctx.closePath();
            ctx.clip();

            // Slower fill oscillation (0.002 -> 0.0012)
            const rFill = 10 + Math.sin(t * 0.0012) * 2;
            const rSurfaceY = (rCenterY + rightR) - rFill;

            // White liquid @ 20% opacity
            ctx.fillStyle = color;
            ctx.globalAlpha = 0.2;
            ctx.fillRect(rightX - 20, rSurfaceY, 40, rFill + 5);

            // Bubbles
            ctx.globalAlpha = 1.0;
            for (let i = 0; i < 3; i++) {
                const offset = i * 4;
                const bx = rCenter + Math.sin(bubT + offset) * 6;
                const by = (rCenterY + rightR) - 3 - (Math.abs(Math.sin(bubT * 3 + i)) * 8) % 10;
                const r = 1.5;
                ctx.beginPath(); ctx.arc(bx, by, r, 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.fill();
            }

            // Drip
            if (isPlaying && (t % 2000 < 500)) {
                const dropY = (rNeckTopY + 5) + (t % 500) / 500 * (rSurfaceY - (rNeckTopY + 5));
                if (dropY < rSurfaceY) {
                    ctx.beginPath(); ctx.arc(rightX, dropY, 2.0, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill();
                }
            }
            ctx.restore();
        };

        const drawParticles = (t) => {
            if (!isPlaying) return;
            const pathTime = 3500; // Slower particles
            const numP = 2;

            for (let i = 0; i < numP; i++) {
                const offset = i * (pathTime / numP);
                const localT = (t + offset) % pathTime;
                const p = localT / pathTime;

                let px = 0, py = 0;

                if (p < 0.2) {
                    const segP = p / 0.2;
                    px = leftX;
                    py = lerp(floorY - 36 - 15, connectionY, segP);
                }
                else if (p < 0.8) {
                    const segP = (p - 0.2) / 0.6;
                    px = lerp(leftX, rightX, segP);
                    py = connectionY + Math.sin(segP * Math.PI * 6) * -8;
                }
                else {
                    const segP = (p - 0.8) / 0.2;
                    px = rightX;
                    py = lerp(connectionY, floorY - 20 - 15 - 14, segP);
                }

                ctx.beginPath();
                ctx.arc(px, py, 2.0, 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.fill();
            }
        };

        const animate = () => {
            const t = Date.now() * speed;

            ctx.clearRect(0, 0, REF_SIZE, REF_SIZE);
            ctx.save();
            const contentScale = 0.70;
            ctx.translate(REF_SIZE / 2, REF_SIZE / 2);
            ctx.scale(contentScale, contentScale);
            ctx.translate(-REF_SIZE / 2, -REF_SIZE / 2);

            ctx.strokeStyle = color;
            ctx.fillStyle = color;
            ctx.lineWidth = 3.5;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";

            // DRAW ORDER CHANGED: Liquid first, then Outline, then Particles
            drawLiquids(t);
            drawApparatus();
            drawParticles(t);

            ctx.restore();
            if (isPlaying) {
                animationFrameId = requestAnimationFrame(animate);
            }
        };
        animate(); return () => cancelAnimationFrame(animationFrameId);
    }, [color, speed, isPlaying]);

    return (<div className="w-full h-full flex items-center justify-center overflow-hidden"><canvas ref={canvasRef} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /></div>);
};
