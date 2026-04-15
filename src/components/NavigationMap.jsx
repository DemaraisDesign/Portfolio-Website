import React, { useState, useEffect, useRef, useMemo } from "react";
import { ArrowRight, ExternalLink, Clock, Lock } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import { getProject } from '../data/projects';
import { usePasswordGate } from './PasswordGate';
import { useConstructionGate } from './ConstructionGate';
import { audio } from '../utils/AudioEngine';
// ═══════════════════════════════════════════════════
//  MATH & COLOR UTILS
// ═══════════════════════════════════════════════════
const lerp = (start, end, t) => start * (1 - t) + end * t;
const easeInOut = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);


// ═══════════════════════════════════════════════════
//  DESIGN TOKENS & CONFIG
// ═══════════════════════════════════════════════════
const THEME = {
    purple: "#A88EFF", teal: "#00C2A3", blue: "#56C6FF",
    orange: "#CE4D35", yellow: "#FFDE21",
    dark: "#0D1216", black: "#050508",
    light: "#F5F7F8", white: "#FFFFFF",
    textSub: "rgba(13, 18, 22, 0.5)",
    deep: {
        stage: "#8369B8",
        screen: "#4278A8",
        sound: "#00918D",
        exp: "#B14636"
    }
};

const EASE_ELASTIC = "cubic-bezier(0.34, 1.45, 0.64, 1)";
const EASE_SMOOTH = "cubic-bezier(0.25, 1, 0.5, 1)";

// ═══════════════════════════════════════════════════
//  ANIMATED ICONS
// ═══════════════════════════════════════════════════

const WAVEFORM_STATIC_PATTERN = [0.15, 0.25, 0.40, 0.55, 0.70, 0.85, 0.75, 0.60, 0.45, 0.30];
const Waveform = ({ color = '#FFFFFF', isPlaying = false }) => {
    const canvasRef = useRef(null);
    const intensityRef = useRef(0);
    useEffect(() => {
        const canvas = canvasRef.current; if (!canvas) return; const ctx = canvas.getContext('2d'); let animationFrameId;
        const logicalSize = 200; canvas.width = logicalSize; canvas.height = logicalSize;
        const numBars = 20; const heights = new Float32Array(numBars);
        const totalContentWidth = logicalSize * 0.95; const margin = (logicalSize - totalContentWidth) / 2;
        const barUnit = totalContentWidth / numBars; const barWidth = barUnit * 0.6; const spacing = barUnit * 0.4;
        const halfBars = Math.ceil(numBars / 2);
        const animate = () => {
            const targetIntensity = isPlaying ? 1 : 0; const transitionSpeed = 0.05;
            if (intensityRef.current < targetIntensity) { intensityRef.current = Math.min(intensityRef.current + transitionSpeed, 1); }
            else if (intensityRef.current > targetIntensity) { intensityRef.current = Math.max(intensityRef.current - transitionSpeed, 0); }
            const intensity = intensityRef.current;
            ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = color;
            const t = Date.now();
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
            animationFrameId = requestAnimationFrame(animate);
        };
        animate(); return () => cancelAnimationFrame(animationFrameId);
    }, [color, isPlaying]);
    return (<div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}><canvas ref={canvasRef} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /></div>);
};

const UXIcon = ({ color = '#FFFFFF', isPlaying = false, speed = 1 }) => {
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
            const targetIntensity = 1; const transitionSpeed = 0.08;
            if (intensityRef.current < targetIntensity) { intensityRef.current = Math.min(intensityRef.current + transitionSpeed, 1); }
            else if (intensityRef.current > targetIntensity) { intensityRef.current = Math.max(intensityRef.current - transitionSpeed, 0); }
            ctx.clearRect(0, 0, REF_SIZE, REF_SIZE); ctx.save();
            const contentScale = 0.95;
            ctx.translate(REF_SIZE / 2, REF_SIZE / 2); ctx.scale(contentScale, contentScale); ctx.translate(-REF_SIZE / 2, -REF_SIZE / 2); ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 4; ctx.lineCap = "round"; ctx.lineJoin = "round";
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
            ctx.restore(); ctx.restore(); animationFrameId = requestAnimationFrame(animate);
        };
        animate(); return () => cancelAnimationFrame(animationFrameId);
    }, [color, isPlaying, speed]);
    return (<div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}><canvas ref={canvasRef} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /></div>);
};

const TheatreIcon = ({ color = '#FFFFFF', isPlaying = false, speed = 1 }) => {
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
            if (isPlaying && !lastPlayState.current) { timeOffset.current = (Date.now() * speed) - (4 * stageDuration); }
            lastPlayState.current = isPlaying;
            const t = (Date.now() * speed) - timeOffset.current;
            ctx.clearRect(0, 0, REF_SIZE, REF_SIZE); ctx.save();
            const contentScale = 0.95;
            ctx.translate(REF_SIZE / 2, REF_SIZE / 2); ctx.scale(contentScale, contentScale); ctx.translate(-REF_SIZE / 2, -REF_SIZE / 2);
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
                
                // 1. Draw solid pool first
                ctx.beginPath();
                ctx.ellipse(centerX, floorY + 5, currentBeamW, currentBeamW * 0.3, 0, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${maxIntensity})`; 
                ctx.fill();
                
                // 2. Erase expanding outline all the way around
                ctx.globalCompositeOperation = 'destination-out';
                ctx.beginPath();
                ctx.ellipse(centerX, floorY + 5, currentBeamW + 1.5, (currentBeamW * 0.3) + 0.5, 0, 0, Math.PI * 2);
                ctx.lineWidth = 3; 
                ctx.stroke();
                
                ctx.restore();
            }
            ctx.save(); ctx.fillStyle = color; ctx.globalAlpha = 1; drawHead(); ctx.fill(); drawBody(); ctx.fill(); ctx.restore();
            intensities.forEach((intensity, index) => { if (intensity <= 0.01) return; const source = lightSources[index]; const minBeamW = 0; const maxBeamW = 30; const currentBeamW = lerp(minBeamW, maxBeamW, intensity); const lightOpacity = intensity; ctx.save(); ctx.beginPath(); ctx.moveTo(centerX - currentBeamW, floorY + 5); ctx.arcTo(source.x, source.y, centerX + currentBeamW, floorY + 5, 2); ctx.lineTo(centerX + currentBeamW, floorY + 5); ctx.bezierCurveTo(centerX + currentBeamW, floorY + 12, centerX - currentBeamW, floorY + 12, centerX - currentBeamW, floorY + 5); ctx.closePath(); ctx.clip(); ctx.globalAlpha = lightOpacity; ctx.fillStyle = 'black'; drawHead(); ctx.fill(); drawBody(); ctx.fill(); ctx.restore(); });
            ctx.restore(); animationFrameId = requestAnimationFrame(animate);
        };
        animate(); return () => cancelAnimationFrame(animationFrameId);
    }, [color, isPlaying, speed]);
    return (<div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}><canvas ref={canvasRef} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /></div>);
};

const ExperimentsIcon = ({ color = '#FFFFFF', isPlaying = false }) => {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current; if (!canvas) return; const ctx = canvas.getContext('2d'); let animationFrameId;
        const logicalSize = 200; canvas.width = logicalSize; canvas.height = logicalSize; ctx.scale(2, 2); const REF_SIZE = 100;
        const floorY = REF_SIZE - 20;
        const leftX = 30; const leftBaseW = 32; const leftNeckW = 12; const leftH = 36; const leftNeckH = 14; const leftY = floorY;
        const rightX = 70; const rightR = 15; const rightNeckH = 14; const rightNeckW = 12; const rightY = floorY - 5;
        const connectionY = floorY - leftH - leftNeckH - 10;
        const drawApparatus = () => {
            ctx.beginPath(); const lCenter = leftX; const lTopY = leftY - leftH; const lNeckTopY = lTopY - leftNeckH;
            ctx.moveTo(lCenter - leftNeckW / 2, lNeckTopY); ctx.lineTo(lCenter + leftNeckW / 2, lNeckTopY); ctx.lineTo(lCenter + leftNeckW / 2, lTopY); ctx.lineTo(lCenter + leftBaseW / 2, leftY); ctx.quadraticCurveTo(lCenter + leftBaseW / 2, leftY + 3, lCenter + leftBaseW / 2 - 3, leftY + 3); ctx.lineTo(lCenter - leftBaseW / 2 + 3, leftY + 3); ctx.quadraticCurveTo(lCenter - leftBaseW / 2, leftY + 3, lCenter - leftBaseW / 2, leftY); ctx.lineTo(lCenter - leftNeckW / 2, lTopY); ctx.closePath(); ctx.stroke();
            const rCenter = rightX; const rCenterY = rightY - rightR; const rNeckTopY = rCenterY - rightR - rightNeckH;
            ctx.beginPath(); ctx.moveTo(rCenter - rightNeckW / 2, rNeckTopY); ctx.lineTo(rCenter + rightNeckW / 2, rNeckTopY); ctx.lineTo(rCenter + rightNeckW / 2, rCenterY - rightR + 3); ctx.arc(rCenter, rCenterY, rightR, -Math.PI / 2 + 0.5, Math.PI * 2 - 0.5 - Math.PI / 2); ctx.lineTo(rCenter - rightNeckW / 2, rNeckTopY); ctx.closePath(); ctx.stroke();
            ctx.save(); ctx.lineJoin = "round"; ctx.beginPath(); ctx.moveTo(leftX, lNeckTopY + 5); ctx.lineTo(leftX, connectionY + 12); ctx.quadraticCurveTo(leftX, connectionY, leftX + 8, connectionY);
            const coilStart = leftX + 8; const coilEnd = rightX - 8; const coilW = coilEnd - coilStart; const loops = 3; const loopW = coilW / loops;
            let cx = coilStart; for (let i = 0; i < loops; i++) { ctx.bezierCurveTo(cx + loopW / 4, connectionY - 14, cx + loopW * 0.75, connectionY - 14, cx + loopW, connectionY); cx += loopW; }
            ctx.quadraticCurveTo(rightX, connectionY, rightX, connectionY + 12); ctx.lineTo(rightX, rNeckTopY + 5); ctx.stroke(); ctx.restore();
        };
        const drawLiquids = (t) => {
            const bubT = isPlaying ? t * 0.003 : 0;
            ctx.save(); ctx.beginPath(); const lCenter = leftX; const lTopY = leftY - leftH; const lNeckTopY = lTopY - leftNeckH;
            ctx.moveTo(lCenter - leftNeckW / 2, lNeckTopY); ctx.lineTo(lCenter + leftNeckW / 2, lNeckTopY); ctx.lineTo(lCenter + leftNeckW / 2, lTopY); ctx.lineTo(lCenter + leftBaseW / 2, leftY); ctx.quadraticCurveTo(lCenter + leftBaseW / 2, leftY + 3, lCenter + leftBaseW / 2 - 3, leftY + 3); ctx.lineTo(lCenter - leftBaseW / 2 + 3, leftY + 3); ctx.quadraticCurveTo(lCenter - leftBaseW / 2, leftY + 3, lCenter - leftBaseW / 2, leftY); ctx.lineTo(lCenter - leftNeckW / 2, lTopY); ctx.closePath(); ctx.clip();
            const fillH = 16; const surfaceY = leftY - fillH;
            ctx.fillStyle = color; ctx.globalAlpha = 0.2; ctx.fillRect(lCenter - 20, surfaceY, 40, fillH + 5);
            ctx.globalAlpha = 1.0; for (let i = 0; i < 5; i++) { const offset = i * 2; const bx = lCenter + Math.sin(bubT + offset) * 7; const by = leftY - 4 - (Math.abs(Math.sin(bubT * 2 + i)) * 12) % 15; const r = 1.8; ctx.beginPath(); ctx.arc(bx, by, r, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill(); } ctx.restore();
            ctx.save(); const rCenter = rightX; const rCenterY = rightY - rightR; const rNeckTopY = rCenterY - rightR - rightNeckH;
            ctx.beginPath(); ctx.moveTo(rCenter - rightNeckW / 2, rNeckTopY); ctx.lineTo(rCenter + rightNeckW / 2, rNeckTopY); ctx.lineTo(rCenter + rightNeckW / 2, rCenterY - rightR + 3); ctx.arc(rCenter, rCenterY, rightR, -Math.PI / 2 + 0.5, Math.PI * 2 - 0.5 - Math.PI / 2); ctx.lineTo(rCenter - rightNeckW / 2, rNeckTopY); ctx.closePath(); ctx.clip();
            const rFill = 10 + (isPlaying ? Math.sin(t * 0.0012) * 2 : 0);
            const rSurfaceY = (rCenterY + rightR) - rFill;
            ctx.fillStyle = color; ctx.globalAlpha = 0.2; ctx.fillRect(rightX - 20, rSurfaceY, 40, rFill + 5);
            ctx.globalAlpha = 1.0; for (let i = 0; i < 3; i++) { const offset = i * 4; const bx = rCenter + Math.sin(bubT + offset) * 6; const by = (rCenterY + rightR) - 3 - (Math.abs(Math.sin(bubT * 3 + i)) * 8) % 10; const r = 1.5; ctx.beginPath(); ctx.arc(bx, by, r, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill(); }
            if (isPlaying && (t % 2000 < 500)) { const dropY = (rNeckTopY + 5) + (t % 500) / 500 * (rSurfaceY - (rNeckTopY + 5)); if (dropY < rSurfaceY) { ctx.beginPath(); ctx.arc(rightX, dropY, 2.0, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill(); } } ctx.restore();
        };
        const drawParticles = (t) => {
            if (!isPlaying) return; const pathTime = 3500; const numP = 2;
            for (let i = 0; i < numP; i++) {
                const offset = i * (pathTime / numP); const localT = (t + offset) % pathTime; const p = localT / pathTime; let px = 0, py = 0;
                if (p < 0.2) { const segP = p / 0.2; px = leftX; py = lerp(floorY - 36 - 15, connectionY, segP); }
                else if (p < 0.8) {
                    const segP = (p - 0.2) / 0.6;
                    px = lerp(leftX, rightX, segP);
                    py = connectionY + Math.sin(segP * Math.PI * 6) * -8;
                }
                else { const segP = (p - 0.8) / 0.2; px = rightX; py = lerp(connectionY, floorY - 20 - 15 - 14, segP); }
                ctx.beginPath(); ctx.arc(px, py, 2.0, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill();
            }
        };
        const animate = () => {
            animationFrameId = requestAnimationFrame(animate); const t = Date.now();
            ctx.clearRect(0, 0, REF_SIZE, REF_SIZE); ctx.save();
            const contentScale = 0.95;
            ctx.translate(REF_SIZE / 2, REF_SIZE / 2); ctx.scale(contentScale, contentScale); ctx.translate(-REF_SIZE / 2, -REF_SIZE / 2);
            ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 3.5; ctx.lineCap = "round"; ctx.lineJoin = "round";
            drawLiquids(t); drawApparatus(); drawParticles(t); ctx.restore();
        };
        animate(); return () => cancelAnimationFrame(animationFrameId);
    }, [color, isPlaying]);
    return (<div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}><canvas ref={canvasRef} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /></div>);
};

// ═══════════════════════════════════════════════════
//  DATA MODEL
// ═══════════════════════════════════════════════════

const RoundedFilledHome = ({ color, size, ...props }) => (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg
            width={size * 0.55}
            height={size * 0.55}
            viewBox="0 0 24 24"
            fill={color}
            {...props}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.6 2.7C11.4 2 12.6 2 13.4 2.7L20.3 8.6C20.8 9.0 21 9.6 21 10.2V18C21 20.2 19.2 22 17 22H7C4.8 22 3 20.2 3 18V10.2C3 9.6 3.2 9.0 3.7 8.6L10.6 2.7ZM10 22V16C10 14.9 10.9 14 12 14C13.1 14 14 14.9 14 16V22H10Z"
            />
        </svg>
    </div>
);

// RoundedFilledHome used directly as StaticHome — passthrough wrapper removed

const SECTIONS = [
    {
        id: "stage", label: "Stages", desc: "Artist Statement", color: THEME.purple, deep: THEME.deep.stage,
        icon: TheatreIcon, quadrant: "tl", link: "/stage",
        children: [
            { id: "coeurage", label: "Coeurage Theatre", desc: "Leadership", img: getProject('coeurage')?.img, contain: true },
            { id: "secret", label: "Secret in the Wings", desc: "Show Direction", img: getProject('secret')?.img },
            { id: "the-sparrow", label: "The Sparrow", desc: "Show Direction", img: getProject('the-sparrow')?.img, imgPosition: "center 30%" },
            { id: "rcc", label: "Teaching Statement", desc: "Education", img: "https://res.cloudinary.com/dqabyzuzf/image/upload/v1775591224/Gemini_Generated_Image_l207s0l207s0l207_cveupt.jpg" },
            { id: "the-yellow-boat", label: "The Yellow Boat", desc: "Show Direction", img: "https://res.cloudinary.com/dqabyzuzf/image/upload/v1774795598/YB1COMP_haxo8w.png" },
            { id: "4th-graders", label: "4th Graders...", desc: "Show Direction", img: getProject('4th-graders')?.img },
            { id: "performance", label: "Reel/Resume", desc: "Performance", img: getProject('performance')?.img },
        ],
    },
    {
        id: "sound", label: "Sounds", desc: "Design Statement", color: THEME.teal, deep: THEME.deep.sound,
        icon: Waveform, quadrant: "tr", link: "/sounds",
        children: [
            { id: "writers-theatre", label: "Writer's Theatre", desc: "Audio Dramas", img: "https://res.cloudinary.com/dqabyzuzf/image/upload/v1774802925/1631371112504_rkyy1k.jpg" },
            { id: "a-christmas-carol", label: "A Christmas Carol", desc: "Broadcast Sound", img: "https://res.cloudinary.com/dqabyzuzf/image/upload/v1774451233/Screenshot_2026-03-25_at_10.06.51_AM_d3ezqv.png" },
            { id: "higherl", label: "HigherL", desc: "Interactive Audio", img: "https://res.cloudinary.com/dqabyzuzf/image/upload/v1774448918/Logo_No_Text_1_vgchkl.png", contain: true, imgScale: 1.4, imgNudge: { x: 2, y: 2 } },
            { id: "frozen-fluid", label: "Frozen Fluid", desc: "Live Sound Design", img: "https://res.cloudinary.com/dqabyzuzf/image/upload/v1774452020/Melting-Ice-Climate-Change-Concept-Art_hjsz7p.jpg" },
            { id: "take-with-water", label: "Take With Water", desc: "Film Audio", img: "https://res.cloudinary.com/dqabyzuzf/image/upload/v1774450795/images-1_msp631.jpg" },
            { id: "under-milkwood", label: "Under Milkwood", desc: "Live Sound Design", img: "https://res.cloudinary.com/dqabyzuzf/image/upload/v1775165440/Gemini_Generated_Image_ymlnahymlnahymln_viquel.jpg" },
            { id: "she-kills-monsters", label: "She Kills Monsters", desc: "Live Sound Design", img: "https://res.cloudinary.com/dqabyzuzf/image/upload/v1774451516/Group_65_cjvm2n.png" },
            { id: "the-nomad-project", label: "The Nomad Project", desc: "Audio Dramas", img: "https://res.cloudinary.com/dqabyzuzf/image/upload/v1775186682/nomad_j6cl80.png" },
        ],
    },
    {
        id: "lab", label: "Explorations", desc: "Thoughts on AI", color: THEME.orange, deep: THEME.deep.exp,
        icon: ExperimentsIcon, quadrant: "br", link: "/explorations",
        children: [
            { id: "ui-prototypes", label: "Prototypes", desc: '"Vibe" Coding', img: "https://res.cloudinary.com/dqabyzuzf/image/upload/v1775591695/markus-spiske-hbb6GkG6p9M-unsplash_ycfhze.jpg", imgScale: 1.1 },
            { id: "redesigns", label: "Redesigns & Concepts", desc: "game audio", img: "https://res.cloudinary.com/dqabyzuzf/image/upload/v1775492599/Screenshot_2026-04-06_at_9.50.34_AM_yqtrep.png" },
            { id: "surrija", label: "Project Surrija", desc: "XR Concept", img: "https://res.cloudinary.com/dqabyzuzf/image/upload/v1775585447/Gemini_Generated_Image_90up1q90up1q90up_mqrrl4.jpg" },
            { id: "ai-media", label: "Images, Video & Music", desc: "Media Experiments", img: "https://res.cloudinary.com/dqabyzuzf/image/upload/v1775592998/tj2_fkyibp.png" },
        ],
    },
    {
        id: "ux", label: "Screens", desc: "Design Statement", color: THEME.blue, deep: THEME.deep.screen,
        icon: UXIcon, quadrant: "bl", link: "/screens",
        children: [
            { id: "morgan-stanley", label: "Morgan Stanley", desc: "Email Design", img: getProject('morgan-stanley')?.img, imgScale: getProject('morgan-stanley')?.imgScale },
            { id: "display-now", label: "Display Now", desc: "UX Research/Writing", img: getProject('display-now')?.img, imgScale: getProject('display-now')?.imgScale },
            { id: "still", label: "Haiba Labs", desc: "UX Research", img: getProject('still')?.img },
            { id: "still-app", label: "Still", desc: "App Concept", img: "https://res.cloudinary.com/dqabyzuzf/image/upload/v1774547046/Still_bananna_rzjxm0.png" },
            { id: "solve-24", label: "Solve 24", desc: "UX Research", img: getProject('solve-24')?.img, imgScale: getProject('solve-24')?.imgScale },
            { id: "my-portfolio", label: "My Portfolio", desc: "Branding/Web Design", img: getProject('my-portfolio')?.img },
        ],
    },
];

// ═══════════════════════════════════════════════════
//  SMART LAYOUT ENGINE
// ═══════════════════════════════════════════════════
const computeLayout = (w, h, focusedId, isLaunched) => {
    const cx = w / 2;
    const cy = h / 2;
    const minDim = Math.min(w, h);

    const isSmallMobile = w <= 430 || h <= 430;

    const SIZES = {
        home: (focusedId || (isLaunched && w < 768)) ? 60 : (isLaunched && w >= 768 ? 55 : 110),
        sectionActive: isSmallMobile ? 80 : 110,
        sectionBg: focusedId ? 35 : 110, // Always 110 unless minimized as background nodes
        subPetalActive: 55,
        subPetalDefault: w >= 768 ? 55 : 14,
        subPetalBg: 10,
    };

    const DISTANCES = {
        unlaunched: (110 / 2) + (55 / 2),
        default: w >= 768 ? minDim * 0.35 : minDim * 0.24,
    };

    // On mobile, the useable space is between the top Navbar (~60px) and the bottom of the screen.
    // Center is: 60 + (h - 60) / 2 = h/2 + 30 = cy + 30
    const visualCenterY = w < 768 ? cy + 30 : cy;

    const origDx = w < 768 ? Math.max(90, w * 0.22) : Math.max(250, w * 0.35); // Pulled back out slightly
    const newDy = w < 768 ? Math.max(125, h * 0.16) : Math.max(180, h * 0.22); // Pulled back out slightly

    let hx = cx;
    let hy = visualCenterY;

    if (w < 768) {
        // Unconditionally anchor the mobile home button to its cluster target to avoid unnecessary travel
        const paddingBottom = -80;
        const orbitOffset = 15;
        const homeOrbitRadius = (SIZES.home / 2) + (SIZES.sectionBg / 2) + orbitOffset;
        const homeClusterRadius = homeOrbitRadius + (SIZES.sectionBg / 2);
        hy = h - (paddingBottom + homeClusterRadius);
    } else if (isLaunched && !focusedId) {
        hy = visualCenterY + 30; // Shift ONLY the home icon down on desktop
    }

    // Display position strictly matches computed origin
    let hx_display = hx;
    let hy_display = w < 768 ? (h - (SIZES.home / 2) - 5) : hy;

    let activeX = cx;
    let activeY = visualCenterY;

    if (focusedId && isLaunched) {
        // focusedId is set, so the active section is guaranteed to exist

        // 1. Exact site-wide CSS padding values extracted from Navbar
        let paddingX = w >= 1024 ? 96 : (w >= 768 ? 48 : 36);
        let paddingTop = w >= 768 ? 96 : 60;
        let paddingBottom = w < 768 ? -50 : -10; // Scooched even further down closer to the bottom edge; extra push on mobile

        // 2. Computed geometric limits
        const activeRadius = SIZES.sectionActive / 2; // activeSec is always the focused section, so this is always sectionActive/2
        const orbitOffset = (w < 768 ? 15 : 35);
        const homeOrbitRadius = (SIZES.home / 2) + (SIZES.sectionBg / 2) + orbitOffset;
        const homeClusterRadius = homeOrbitRadius + (SIZES.sectionBg / 2);

        // 3. Absolute corner anchors guaranteed to respect site padding
        let active_TL = { x: paddingX + activeRadius, y: paddingTop + activeRadius };
        
        let home_Target;
        if (w < 768) {
            // Lock horizontally to center screen, vertically to bottom
            home_Target = { x: cx, y: h - (paddingBottom + homeClusterRadius) };
        } else {
            // Lock to bottom-right corner
            home_Target = { x: w - (paddingX + homeClusterRadius), y: h - (paddingBottom + homeClusterRadius) };
        }

        // 4. Standardize all focus views to use the layout geometry
        activeX = active_TL.x;
        activeY = active_TL.y;
        hx = home_Target.x;
        hy = home_Target.y;

        hx_display = hx;
        hy_display = w < 768 ? (h - (SIZES.home / 2) - 5) : hy;
    }

    const sections = SECTIONS.map((sec) => {
        const isFocused = sec.id === focusedId;
        const isBg = focusedId && !isFocused;


        const dynamicLayoutAngle = Math.atan2(
            sec.quadrant.includes('b') ? newDy : -newDy,
            sec.quadrant.includes('r') ? origDx : -origDx
        );

        let sx = cx + Math.cos(dynamicLayoutAngle) * DISTANCES.unlaunched;
        let sy = visualCenterY + Math.sin(dynamicLayoutAngle) * DISTANCES.unlaunched;

        const currentSectionSize = !focusedId ? SIZES.sectionBg : (isFocused ? SIZES.sectionActive : SIZES.sectionBg);
        const currentPetalSize = !focusedId ? SIZES.subPetalDefault : SIZES.subPetalActive;

        if (isLaunched) {
            let targetX = cx;
            let targetY = visualCenterY;

            // Symmetrical placements in the general corners of the screen
            const isTablet = w >= 768 && w < 1024;
            const dx = w < 768 ? origDx : (isTablet ? Math.max(180, w * 0.22) : Math.max(60, w * 0.08)); // Tablet: push far into corners

            // Constrain vertical pushes so nodes cannot clip top/bottom edges of screen
            const maxTopDy = Math.max(0, visualCenterY - 140);
            const maxBotDy = Math.max(0, h - visualCenterY - 100);

            let rawDy = w < 768 ? newDy : (isTablet ? Math.max(210, h * 0.28) : Math.max(220, h * 0.26));
            let rawTopDy = w < 768 ? newDy * 0.8 : (isTablet ? Math.max(180, h * 0.24) : Math.max(150, h * 0.22));

            const dy = Math.min(rawDy, maxBotDy);
            const topDy = Math.min(rawTopDy, maxTopDy);

            if (sec.quadrant === 'bl') { targetX = cx - dx; targetY = visualCenterY + dy + (w < 768 ? 50 : 0); }
            if (sec.quadrant === 'br') { targetX = cx + dx; targetY = visualCenterY + dy + (w < 768 ? 50 : 0); }
            if (sec.quadrant === 'tl') { targetX = cx - dx; targetY = visualCenterY - topDy; }
            if (sec.quadrant === 'tr') { targetX = cx + dx; targetY = visualCenterY - topDy; }

            if (!focusedId) {
                sx = targetX;
                sy = targetY;
            } else if (isFocused) {
                sx = activeX;
                sy = activeY;
            } else {
                const others = SECTIONS.filter(s => s.id !== focusedId);
                const idx = others.findIndex(s => s.id === sec.id);
                // Give them a wider orbit radius and much wider spread angle to prevent them clipping like coins
                const orbitRadius = (SIZES.home / 2) + (SIZES.sectionBg / 2) + (w < 768 ? 20 : 35);

                // Point the inactive cluster diagonally inwards (use display position for rendering)
                const angleToCenter = Math.atan2(visualCenterY - hy_display, cx - hx_display);
                const spreadAngle = Math.PI * 0.90;

                const angles = [
                    angleToCenter - spreadAngle / 2,
                    angleToCenter,
                    angleToCenter + spreadAngle / 2
                ];

                const orbitAngle = angles[idx];
                sx = hx_display + Math.cos(orbitAngle) * orbitRadius;
                sy = hy_display + Math.sin(orbitAngle) * orbitRadius;
            }
        }

        const petalOffset = (w >= 768 && !focusedId) ? 20 : 0;
        const petalRestRadius = (currentSectionSize / 2) + (currentPetalSize / 2) + petalOffset;

        const subPetals = sec.children.map((child, i) => {
            let cxChild = sx;
            let cyChild = sy;
            let gridRow = null;
            let gridCol = null;
            let isAnchorPetal = false; // Set inside fan branch for mobile-only anchor petal

            if (isLaunched && focusedId) {
                // Ensure mobile colSpacing and rowSpacing compactly reflect the new popup label system
                const colSpacing = w < 768 ? 100 : 140;
                const rowSpacing = w < 768 ? 85 : (h < 768 ? 160 : 180);

                // 1. Calculate true visual center using available bounding empty space
                const gridCenterX = w < 768 ? cx : (activeX + hx) / 2;

                const topCeiling = activeY + (SIZES.sectionActive / 2);
                
                const orbitOffset = (w < 768 ? 15 : 35);
                const homeOrbitRadius = (SIZES.home / 2) + (SIZES.sectionBg / 2) + orbitOffset;
                const homeClusterRadius = homeOrbitRadius + (SIZES.sectionBg / 2);
                const bottomFloor = hy - homeClusterRadius;

                const gridCenterY = (topCeiling + bottomFloor) / 2;

                // 2. Dynamically solve arrangement based on true physical width strictly preventing X-overlaps
                let paddingX = w >= 1024 ? 96 : (w >= 768 ? 48 : 20); // Reduce mobile side padding
                const safeW = w - (paddingX * 2) - 20;
                let maxCols = w < 768 ? 3 : Math.max(1, Math.floor(safeW / colSpacing));
                if (maxCols > 3) maxCols = 3;
                if (sec.children.length === 4) maxCols = 2; // Force exactly 4 items into a tidy 2x2 grid
                if (sec.children.length > 0 && sec.children.length < maxCols) maxCols = sec.children.length;

                const row = Math.floor(i / maxCols);
                const col = i % maxCols;

                const totalColsInThisRow = Math.min(maxCols, sec.children.length - (row * maxCols));

                const gridStartX = gridCenterX - ((totalColsInThisRow - 1) * colSpacing) / 2;
                const totalRows = Math.ceil(sec.children.length / maxCols);
                const gridStartY = gridCenterY - ((totalRows - 1) * rowSpacing) / 2;

                cxChild = gridStartX + (col * colSpacing);
                cyChild = gridStartY + (row * rowSpacing);
            } else {
                const count = sec.children.length;
                let fanSpread = Math.PI * 1.0;
                let fanCenterAngle = dynamicLayoutAngle;

                // Adjust spread and radius based on state and screen size
                const isLargeUnfocused = (isLaunched && !focusedId && w >= 768);

                if (isLargeUnfocused) {
                    const isLeft = sec.quadrant.includes('l');
                    const isTablet = w >= 768 && w < 1024;

                    if (isTablet) {
                        // ═══ SOLAR SYSTEM LAYOUT (tablet 768-1024px) ═══
                        // Nodes orbit their parent in a circle
                        const count = sec.children.length;
                        const orbitRadius = Math.min(minDim * 0.16, 145); // Larger orbit ring

                        // Offset the orbit center away from screen center to avoid overlapping with other quadrants
                        const orbitCenterX = sx;
                        const orbitCenterY = sy;

                        // Start angle: top of circle, distribute evenly
                        const startAngle = -Math.PI / 2; // 12 o'clock
                        const angleStep = (Math.PI * 2) / count;

                        cxChild = orbitCenterX + Math.cos(startAngle + (angleStep * i)) * orbitRadius;
                        cyChild = orbitCenterY + Math.sin(startAngle + (angleStep * i)) * orbitRadius;

                        // Store orbit info for SVG ring rendering
                        gridRow = -1; // Signal that this is orbit mode, not grid
                        gridCol = i;
                    } else {
                        // ═══ DESKTOP GRID LAYOUT (≥1024px) — isThreeColSector is always true, constants inlined ═══
                        const colSpacing = 140;
                        const rowSpacing = 144;

                        const paddingFromIcon = 60;
                        const minPaddingFromEdge = w >= 1024 ? 68 : 40;

                        const maxAvailableSpace = isLeft
                            ? sx - paddingFromIcon - minPaddingFromEdge
                            : w - sx - paddingFromIcon - minPaddingFromEdge;

                        let maxCols = 3;
                        const spaceNeededFor3 = (2 * colSpacing) + 100; // always 3-col mode

                        if (maxAvailableSpace < spaceNeededFor3) maxCols = 2;
                        if (sec.children.length > 0 && sec.children.length < maxCols) maxCols = sec.children.length;
                        
                        maxCols = 3; // always 3-col mode

                        gridRow = Math.floor(i / maxCols);
                        const col = i % maxCols;

                        const totalColsInThisRow = Math.min(maxCols, sec.children.length - (gridRow * maxCols));

                        const dirX = 1;

                        const fullGridTotalWidth = (maxCols - 1) * colSpacing;

                        let fullGridStartX;
                        if (isLeft) {
                            const availableSpaceCenter = (minPaddingFromEdge + (sx - paddingFromIcon)) / 2;
                            fullGridStartX = availableSpaceCenter - (fullGridTotalWidth / 2);

                            fullGridStartX = Math.max(fullGridStartX, minPaddingFromEdge);
                            fullGridStartX = Math.min(fullGridStartX, sx - paddingFromIcon - fullGridTotalWidth);
                        } else {
                            const availableSpaceCenter = (sx + paddingFromIcon + (w - minPaddingFromEdge)) / 2;
                            fullGridStartX = availableSpaceCenter - (fullGridTotalWidth / 2);

                            fullGridStartX = Math.max(fullGridStartX, sx + paddingFromIcon);
                            fullGridStartX = Math.min(fullGridStartX, w - minPaddingFromEdge - fullGridTotalWidth);
                        }

                        gridCol = col;
                        if (isLeft && totalColsInThisRow < maxCols) {
                            const missingCols = maxCols - totalColsInThisRow;
                            gridCol = col + missingCols;
                        } else if (!isLeft && totalColsInThisRow < maxCols) {
                            gridCol = col;
                        }

                        const totalRowsInGrid = Math.ceil(sec.children.length / maxCols);
                        const gridTotalHeight = (totalRowsInGrid - 1) * rowSpacing;
                        const startY = sy - (gridTotalHeight / 2);

                        cxChild = fullGridStartX + (dirX * gridCol * colSpacing);
                        cyChild = startY + (gridRow * rowSpacing);
                    }

                } else {
                    if (isLaunched && isBg) {
                        fanCenterAngle = Math.atan2(sy - hy, sx - hx);
                    }

                    // tl (Stages) + bl (Screens): rightmost petal at 12 o'clock
                    // tr (Sounds) + br (Explorations): leftmost petal at 12 o'clock
                    const isLeftQuadrant = sec.quadrant === 'tl' || sec.quadrant === 'bl';
                    
                    // Only reverse mapping on mobile for Stages & Screens so data order matches 
                    const visualIndex = (sec.id === 'stage' || sec.id === 'ux') ? (count - 1 - i) : i;
                    
                    const anchorIdx = isLeftQuadrant ? count - 1 : 0;
                    isAnchorPetal = visualIndex === anchorIdx;

                    // Variable step: wider gap around the anchor (big circle), tighter between small petals
                    const smallStep = Math.PI / 6;  // 30° between small petals
                    const anchorGap = Math.PI / 3;  // 60° on either side of the anchor

                    // Build cumulative angle array for all petals in this section
                    const angles = [0];
                    for (let j = 1; j < count; j++) {
                        const isAnchorTransition =
                            (isLeftQuadrant && j === count - 1) ||   // last petal IS the anchor
                            (!isLeftQuadrant && j === 1);              // first petal IS the anchor (gap after it)
                        angles.push(angles[j - 1] + (isAnchorTransition ? anchorGap : smallStep));
                    }

                    // Pin the anchor to exactly 12 o'clock (-PI/2), shift the whole fan accordingly
                    const anchorAngleInFan = angles[anchorIdx];
                    const fanStart = (-Math.PI / 2) - anchorAngleInFan;

                    const petalAngle = fanStart + angles[visualIndex];

                    // Wider orbit radius for the anchor so it clears the section icon edge
                    const anchorOrbitRadius = (currentSectionSize / 2) + (SIZES.subPetalActive / 2);
                    const effectiveRadius = isAnchorPetal ? anchorOrbitRadius : petalRestRadius;

                    cxChild = sx + Math.cos(petalAngle) * effectiveRadius;
                    cyChild = sy + Math.sin(petalAngle) * effectiveRadius;
                }
            }

            return {
                ...child,
                x: cxChild,
                y: cyChild,
                size: isAnchorPetal ? SIZES.subPetalActive : currentPetalSize,
                color: sec.deep,
                parentColor: sec.color,
                // Always keep them rendered if launched, for smoother CSS transitions
                visible: isLaunched,
                isParentFocused: isFocused,
                alignLabel: (sec.quadrant === 'tl' || sec.quadrant === 'bl') ? 'right' : 'left',
                img: child.img,
                isAnchor: isAnchorPetal,
                gridRow: gridRow,
                gridCol: gridCol
            };
        });

        return { ...sec, x: sx, y: sy, isFocused, isBg, size: currentSectionSize, subPetals };
    });

    return { home: { x: hx_display, y: hy_display, size: SIZES.home }, sections };
};

// ═══════════════════════════════════════════════════
//  SUB-COMPONENTS
// ═══════════════════════════════════════════════════

const OrganicPath = React.memo(({ x1, y1, x2, y2, color, isDashed, isActive, width = 1, visible }) => {
    const dist = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    const d = `M${x1},${y1} L${x2},${y2}`;

    return (
        <path
            d={d} stroke={color} strokeWidth={isActive ? width * 1.8 : width}
            fill="none" strokeDasharray={isDashed ? "3, 6" : "none"} strokeLinecap="round"
            style={{
                opacity: (!visible || dist < 40) ? 0 : (isDashed ? 0.3 : 0.8),
                transition: "opacity 0.6s ease-in 0.2s, stroke-width 0.6s ease"
            }}
        />
    );
});

const Node = ({ x, y, size, color, ringColor, iconColor, icon: Icon, onClick, className = "", isChild, zIndex, showIcon, isFocused, isBg, isResizing, initialOpacity = 0, isDimmed, labelData, disableAnimation, isShortViewport, flipKey, flipDelay = 0, noFlyTransition = false, sizeDelay = 0, alwaysShowLabel = false }) => {
    const { isProjectUnlocked } = usePasswordGate();
    const [hover, setHover] = useState(false);
    const [tapped, setTapped] = useState(false);
    const iconSize = isChild ? size * 0.5 : size * 0.75;
    const shouldAnimate = hover && !disableAnimation && showIcon;

    const handleNodeClick = (e) => {
        // Handle touch devices popping open the text on short viewports first
        if (isShortViewport && labelData && labelData.show) {
            // If they are on a touch device and haven't tapped yet, simply reveal the label.
            if (!tapped && !hover) {
                e.preventDefault();
                setTapped(true);
                return;
            }
        }
        if (onClick) {
            audio.playClick();
            onClick(e);
        }
    };

    const handleMouseLeave = () => {
        setHover(false);
        setTapped(false);
    };

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    // On mobile with no section focused, isBg is null (not false), so we need the extra isMobile && !isBg check.
    // !isChild ensures sub-petal case study circles don't inherit this and show their label popups.
    const isActiveLayout = isFocused || (isBg === false) || (isMobile && !isBg && !isChild) || alwaysShowLabel;
    const isLabelVisible = showIcon && labelData && labelData.show && (isMobile ? isActiveLayout : (hover || tapped || isActiveLayout));
    const flyDelay = (isBg && isMobile) ? 0.3 : 0;

    return (
        <button
            type="button"
            aria-label={labelData ? labelData.text : "Navigation Node"}
            className={`node-interactive ${className} group`}
            onClick={handleNodeClick}
            onMouseEnter={() => { setHover(true); if (onClick) audio.playHover(); }}
            onMouseLeave={handleMouseLeave}
            onFocus={() => setHover(true)}
            onBlur={handleMouseLeave}
            style={{
                position: 'absolute',
                top: y,
                left: x,
                width: size,
                height: size,
                opacity: initialOpacity * (isDimmed ? 0.25 : 1.0),
                transform: 'translate(-50%, -50%)', zIndex: zIndex,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: onClick ? 'pointer' : 'default',
                perspective: '1000px',
                transition: isResizing ? 'none' : `${noFlyTransition ? '' : `top 1.0s cubic-bezier(0.25, 1, 0.5, 1) ${flyDelay}s, left 1.0s cubic-bezier(0.25, 1, 0.5, 1) ${flyDelay}s, `}width 0.8s cubic-bezier(0.25, 1, 0.5, 1) ${sizeDelay}s, height 0.8s cubic-bezier(0.25, 1, 0.5, 1) ${sizeDelay}s, opacity 0.8s ease`
            }}
        >
            <motion.div
                key={flipKey || 'default'}
                initial={flipKey ? { opacity: 0, rotateY: -90 } : false}
                animate={{ opacity: 1, rotateY: 0 }}
                whileHover={!disableAnimation ? { scale: 1.05 } : {}}
                whileTap={!disableAnimation ? { scale: 0.95 } : {}}
                transition={flipKey ? { delay: flipDelay, type: "spring", stiffness: 60, damping: 12, mass: 0.8 } : { type: "spring", stiffness: 400, damping: 25 }}
                style={{
                    width: '100%', height: '100%', borderRadius: '50%',
                    background: (isChild && !isDimmed && labelData?.img && labelData?.contain) ? THEME.white : color,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    border: isChild && !isDimmed && !labelData?.img ? `1px solid ${THEME.white}` : `none`,
                    position: 'relative', overflow: 'hidden', flexShrink: 1,
                    zIndex: 2,
                    boxShadow: isChild && !isDimmed && labelData?.img ? `0 0 0 4px ${ringColor || color}` : 'none'
                }}>
                {isChild && !isDimmed && labelData?.img ? (
                    <>
                        {labelData.Icon ? (
                            <div className="w-full h-full flex items-center justify-center" style={{
                                opacity: showIcon ? 1 : 0,
                                transition: 'opacity 0.8s ease',
                                transform: `${labelData?.imgScale ? `scale(${labelData.imgScale})` : ''} ${labelData?.imgNudge ? `translate(${labelData.imgNudge.x}px, ${labelData.imgNudge.y}px)` : ''}`.trim() || 'none'
                            }}>
                                <labelData.Icon color={THEME.orange} isPlaying={isSettled && (sec.isFocused || isLargeUnfocused)} />
                            </div>
                        ) : labelData.img === "LOGO" ? (
                            <div className="w-full h-full flex items-center justify-center bg-white" style={{
                                opacity: showIcon ? 1 : 0,
                                transition: 'opacity 0.8s ease',
                            }}>
                                <div className="grid grid-cols-2 items-center flex-shrink-0" style={{ gap: '5px 7px' }}>
                                    <div className="w-3 h-3 rounded-full col-span-2 justify-self-center" style={{ backgroundColor: THEME.purple }} />
                                    <div className="w-3 h-3 rounded-full justify-self-end" style={{ backgroundColor: THEME.blue }} />
                                    <div className="w-3 h-3 rounded-full justify-self-start" style={{ backgroundColor: THEME.teal }} />
                                </div>
                            </div>
                        ) : (
                            <img
                                src={labelData.img}
                                alt=""
                                style={{
                                    width: '100%', height: '100%', 
                                    objectFit: labelData.contain ? 'contain' : 'cover',
                                    objectPosition: labelData.imgPosition || 'center',
                                    opacity: showIcon ? 1 : 0,
                                    transform: `${labelData?.imgScale ? `scale(${labelData.imgScale})` : ''} ${labelData?.imgNudge ? `translate(${labelData.imgNudge.x}px, ${labelData.imgNudge.y}px)` : ''}`.trim() || 'none',
                                    transition: 'opacity 0.8s ease'
                                }}
                            />
                        )}
                        {labelData?.screenColor && (
                            <div style={{
                                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                backgroundColor: labelData.screenColor,
                                mixBlendMode: 'screen',
                                pointerEvents: 'none'
                            }} />
                        )}
                        {/* Lock/Clock overlay on case study thumbnails */}
                        {labelData?.projectId && getProject(labelData.projectId)?.isConstruction ? (
                            <div style={{
                                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                backgroundColor: 'rgba(0, 0, 0, 0.55)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                pointerEvents: 'none',
                                opacity: 0.9
                            }}>
                                <svg style={{ width: '35%', height: '35%', opacity: 1 }} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" fill="white" stroke="none" />
                                    <polyline points="12 6 12 12 15.5 15.5" stroke="rgba(0,0,0,0.6)" strokeWidth="3" fill="none" />
                                </svg>
                            </div>
                        ) : labelData?.projectId && !isProjectUnlocked(labelData.projectId) && (
                            <div style={{
                                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                backgroundColor: 'rgba(0, 0, 0, 0.55)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                pointerEvents: 'none',
                                opacity: 0.9
                            }}>
                                <svg style={{ width: '35%', height: '35%', opacity: 1 }} viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M7 10V7a5 5 0 0 1 10 0v3" fill="none" />
                                    <rect x="3" y="10" width="18" height="12" rx="2" fill="white" stroke="none" />
                                    <circle cx="12" cy="16" r="1.5" fill="rgba(0,0,0,0.6)" stroke="rgba(0,0,0,0.6)" strokeWidth="3" />
                                </svg>
                            </div>
                        )}
                    </>
                ) : (
                    <div style={{
                        width: iconSize, height: iconSize, opacity: showIcon ? 1 : 0,
                        transition: 'opacity 0.8s ease 1s, transform 0.6s cubic-bezier(0.34, 1.5, 0.64, 1) 1.2s',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transform: showIcon ? 'scale(1)' : 'scale(0.2)'
                    }}>
                        {Icon ? (
                            <Icon size={iconSize} color={iconColor || THEME.dark} isPlaying={shouldAnimate} speed={1} />
                        ) : isChild ? (
                            <ExternalLink size={iconSize * 0.8} color="white" strokeWidth={2.5} />
                        ) : null}
                    </div>
                )}
            </motion.div>

            {labelData && (
                <div style={{
                    position: 'absolute',
                    top: labelData.align === 'top' ? 'auto' : (labelData.align === 'right' || labelData.align === 'left' ? '50%' : '100%'),
                    bottom: labelData.align === 'top' ? '100%' : 'auto',
                    left: labelData.align === 'right' ? '100%' : (labelData.align === 'left' ? '0' : '50%'),
                    transform: isLabelVisible 
                        ? (labelData.align === 'right' ? 'translate(20px, -50%)' : (labelData.align === 'left' ? 'translate(calc(-100% - 20px), -50%)' : 'translate(-50%, 0)')) 
                        : (labelData.align === 'right' ? 'translate(10px, -50%)' : (labelData.align === 'left' ? 'translate(calc(-100% - 10px), -50%)' : `translate(-50%, ${labelData.align === 'top' ? '10px' : '-10px'})`)),
                    marginTop: labelData.align === 'top' || labelData.align === 'right' || labelData.align === 'left' ? '0' : '20px',
                    marginBottom: labelData.align === 'top' ? '20px' : '0',
                    textAlign: isShortViewport ? (labelData.align === 'center' ? 'center' : 'left') : (labelData.align === 'right' ? 'left' : (labelData.align === 'left' ? 'right' : 'center')),
                    whiteSpace: isShortViewport ? 'nowrap' : 'normal',
                    width: isShortViewport ? 'auto' : '180px',
                    minWidth: isShortViewport ? '140px' : 'auto',
                    opacity: isLabelVisible ? 1 : 0,
                    transition: `opacity ${isLabelVisible ? '0.4s' : '0.2s'} ease ${isLabelVisible ? sizeDelay : 0}s, transform ${isLabelVisible ? '0.4s' : '0.2s'} ease ${isLabelVisible ? sizeDelay : 0}s`,
                    display: 'flex',
                    flexDirection: isShortViewport ? 'row' : 'column',
                    alignItems: isShortViewport ? 'center' : (labelData.align === 'right' ? 'flex-start' : (labelData.align === 'left' ? 'flex-end' : 'center')),
                    gap: isShortViewport ? '10px' : '0',
                    pointerEvents: 'none',
                    zIndex: 1,
                    // Additional card styles for short viewports
                    ...(isShortViewport ? {
                        background: THEME.white,
                        padding: '8px 14px 8px 10px',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        border: `1px solid ${THEME.light}`
                    } : {})
                }}>
                    {isShortViewport && (
                        <div style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            backgroundColor: ringColor || color,
                            flexShrink: 0
                        }} />
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: isChild && !isShortViewport ? '13px' : '16px', fontWeight: 800, color: THEME.dark, letterSpacing: '0.02em', WebkitFontSmoothing: 'antialiased', lineHeight: 1.25 }}>{labelData.title}</span>
                        {labelData.desc && <span style={{ fontSize: '10px', fontWeight: 600, color: THEME.textSub, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '2px' }}>{labelData.desc}</span>}
                        {labelData.subDesc && <span style={{ fontSize: '10px', fontWeight: 600, color: THEME.textSub, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '1px' }}>{labelData.subDesc}</span>}
                    </div>
                </div>
            )}
        </button>
    );
};



// ═══════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════
export default function NavigationMap({ closeMenu }) {
    const navigate = useNavigate();
    const { requestAccess, isProjectUnlocked } = usePasswordGate();
    const { requestConstructionAccess } = useConstructionGate();
    const [focusedId, setFocusedId] = useState(null);
    const [animPhase, setAnimPhase] = useState(0);
    const [parkedPetalData, setParkedPetalData] = useState(null);   // petal currently parked over section icon
    const [outgoingPetalData, setOutgoingPetalData] = useState(null); // petal springing back to fan
    const isLaunched = animPhase >= 1;
    const isSettled = animPhase >= 2;
    const showLabels = animPhase >= 3;
    const drawLines = animPhase >= 4;

    const [isResizing, setIsResizing] = useState(false);
    const [viewport, setViewport] = useState({ w: 1200, h: 800 });
    const resizeTimer = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                setIsResizing(true);
                setViewport({ w: containerRef.current.clientWidth, h: containerRef.current.clientHeight });
                if (resizeTimer.current) clearTimeout(resizeTimer.current);
                resizeTimer.current = setTimeout(() => setIsResizing(false), 200);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);

        const isMobileDevice = window.innerWidth < 768;
        const t1 = setTimeout(() => setAnimPhase(1), 950); // same for mobile and desktop
        const t2 = setTimeout(() => setAnimPhase(2), isMobileDevice ? 1100 : 1950);
        const t3 = setTimeout(() => setAnimPhase(3), isMobileDevice ? 1200 : 2350);
        const t4 = setTimeout(() => setAnimPhase(4), isMobileDevice ? 1300 : 2650);

        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
            clearTimeout(t4);
        };
    }, []);

    // Automatically exit focus view if the screen is resized to desktop widths
    useEffect(() => {
        if (viewport.w >= 768 && focusedId !== null) {
            setTimeout(() => setFocusedId(null), 0);
        }
    }, [viewport.w, focusedId]);

    const layout = useMemo(() =>
        computeLayout(viewport.w, viewport.h, focusedId, isLaunched),
        [viewport, focusedId, isLaunched]
    );

    const handleSectionClick = (id) => {
        if (!isLaunched) return;

        if (viewport.w < 768) {
            // Mobile: always navigate directly to the section — no drill-down level
            const section = SECTIONS.find(s => s.id === id);
            if (section && section.link) {
                if (closeMenu) closeMenu();
                navigate(section.link);
            }
        } else {
            const section = SECTIONS.find(s => s.id === id);
            if (section && section.link) {
                if (closeMenu) closeMenu();
                navigate(section.link);
            }
        }
    };

    const handleHomeClick = () => {
        if (!isLaunched) return;
        if (closeMenu) closeMenu();
        navigate("/");
    };

    // Mobile-only: fly new petal forward AND reverse old one simultaneously
    const handleMobilePetalClick = (sp, sec) => {
        if (parkedPetalData?.id === sp.id) return; // already parked here

        // Kick the currently parked petal back to its fan position (runs in parallel)
        if (parkedPetalData) setOutgoingPetalData(parkedPetalData);

        // Fly the new petal forward immediately (same tick — simultaneous)
        setParkedPetalData({
            id: sp.id,
            startX: sp.x, startY: sp.y, startSize: sp.size,
            targetX: sec.x, targetY: sec.y, targetSize: sec.size,
            img: sp.img, color: sp.color || sec.deep
        });
    };

    const isShortDesktop = viewport.h < 680 && viewport.w >= 768;

    return (
        <div ref={containerRef} style={{
            width: '100%', height: '100%',
            fontFamily: '"Outfit", sans-serif', overflow: 'visible', position: 'relative',
            userSelect: 'none'
        }}>
            <style>{`
        .node-interactive { cursor: pointer; transition: z-index 0.3s; }
        .node-interactive:hover { z-index: 60 !important; }
        
        .fade-enter { animation: fadeIn 0.5s ease forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .depth-bg { opacity: 0.8; transition: all 0.8s cubic-bezier(0.25, 1, 0.5, 1); }
        .depth-active { opacity: 1; z-index: 10; transition: all 0.8s cubic-bezier(0.25, 1, 0.5, 1); }

        @keyframes dd-teensy-settle {
          0% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.02); }
          100% { transform: translate(-50%, -50%) scale(1); }
        }
        .launched-node { animation: dd-teensy-settle 0.5s ease-out 2.0s forwards; }
      `}</style>

            {/* SVG Connector Lines for Grid View */}
            <svg style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0,
                overflow: 'visible',
                opacity: isLaunched && !focusedId && viewport.w >= 768 ? 1 : 0,
                transition: isResizing ? 'none' : 'opacity 0.8s ease 0.4s'
            }}>
                {layout.sections.map(sec => {
                    const isLeft = sec.quadrant.includes('l');
                    const lines = [];

                    // Check if this section uses orbit mode (tablet solar system)
                    const isOrbitMode = sec.subPetals.some(sp => sp.gridRow === -1 && sp.visible);

                    if (isOrbitMode) {
                        // Draw a single orbit ring circle around the section icon
                        const visiblePetals = sec.subPetals.filter(sp => sp.visible);
                        if (visiblePetals.length > 0) {
                            // Calculate orbit radius from the first child's distance to parent
                            const dx = visiblePetals[0].x - sec.x;
                            const dy = visiblePetals[0].y - sec.y;
                            const orbitR = Math.sqrt(dx * dx + dy * dy);

                            lines.push(
                                <circle key={`orbit-${sec.id}`}
                                    cx={sec.x} cy={sec.y} r={orbitR}
                                    stroke={sec.color} strokeWidth="2" fill="none" opacity="0.5"
                                    pathLength="1"
                                    strokeDasharray="1 1"
                                    strokeDashoffset={drawLines ? 0 : 1}
                                    style={{ transition: isResizing ? 'none' : 'stroke-dashoffset 0.6s ease-out, cx 1s cubic-bezier(0.25, 1, 0.5, 1), cy 1s cubic-bezier(0.25, 1, 0.5, 1), r 0.6s ease-out' }}
                                />
                            );
                        }
                    } else {
                        // Desktop grid connector lines
                        const rows = {};
                        sec.subPetals.forEach(sp => {
                            if (sp.gridRow !== null && sp.visible) {
                                if (!rows[sp.gridRow]) rows[sp.gridRow] = [];
                                rows[sp.gridRow].push(sp);
                            }
                        });

                        Object.values(rows).forEach((rowItems) => {
                            rowItems.sort((a, b) => a.gridCol - b.gridCol);
                            if (rowItems.length === 0) return;

                            const closestNode = isLeft ? rowItems[rowItems.length - 1] : rowItems[0];
                            const startX = sec.x;
                            const startY = sec.y;
                            const endX = closestNode.x;
                            const endY = closestNode.y;

                            const midX = (startX + endX) / 2;
                            const pathD = `M ${startX},${startY} C ${midX},${startY} ${midX},${endY} ${endX},${endY}`;

                            lines.push(
                                <path key={`L-P-${closestNode.id}`} d={pathD}
                                    stroke={sec.color} strokeWidth="2" fill="none" opacity="0.6" pathLength="1"
                                    strokeDasharray="1 1"
                                    strokeDashoffset={drawLines ? 0 : 1}
                                    style={{ transition: isResizing ? 'none' : 'stroke-dashoffset 0.4s ease-out, d 1s cubic-bezier(0.25, 1, 0.5, 1)' }} />
                            );

                            for (let i = 0; i < rowItems.length - 1; i++) {
                                const curr = rowItems[i];
                                const next = rowItems[i + 1];

                                const originNode = isLeft ? next : curr;
                                const targetNode = isLeft ? curr : next;

                                const x1 = originNode.x;
                                const y1 = originNode.y;
                                const x2 = targetNode.x;
                                const y2 = targetNode.y;

                                const outwardIndex = isLeft ? (rowItems.length - 2 - i) : i;
                                const animDelay = 0.4 + (outwardIndex * 0.25);

                                lines.push(
                                    <line key={`L-${curr.id}-${next.id}`} x1={x1} y1={y1} x2={x2} y2={y2}
                                        stroke={sec.color} strokeWidth="2" opacity="0.6" pathLength="1"
                                        strokeDasharray="1 1"
                                        strokeDashoffset={drawLines ? 0 : 1}
                                        style={{ transition: isResizing ? 'none' : `stroke-dashoffset 0.4s ease-out ${animDelay}s, x1 1s cubic-bezier(0.25, 1, 0.5, 1), y1 1s cubic-bezier(0.25, 1, 0.5, 1), x2 1s cubic-bezier(0.25, 1, 0.5, 1), y2 1s cubic-bezier(0.25, 1, 0.5, 1)` }} />
                                );
                            }
                        });
                    }

                    return <g key={`lines-${sec.id}`}>{lines}</g>;
                })}
            </svg>


            {/* Mobile petal overlays — both run simultaneously when switching */}

            {/* Outgoing: parked petal springs back to its fan position */}
            <AnimatePresence>
                {outgoingPetalData && viewport.w < 768 && (
                    <motion.div
                        key={`petal-out-${outgoingPetalData.id}`}
                        initial={{ x: 0, y: 0, scale: 1 }}
                        animate={{
                            x: outgoingPetalData.startX - outgoingPetalData.targetX,
                            y: outgoingPetalData.startY - outgoingPetalData.targetY,
                            scale: outgoingPetalData.startSize / outgoingPetalData.targetSize,
                        }}
                        onAnimationComplete={() => setOutgoingPetalData(null)}
                        transition={{ type: 'spring', stiffness: 260, damping: 16, mass: 0.9 }}
                        style={{
                            position: 'absolute',
                            top: outgoingPetalData.targetY,
                            left: outgoingPetalData.targetX,
                            width: outgoingPetalData.targetSize,
                            height: outgoingPetalData.targetSize,
                            marginTop: -outgoingPetalData.targetSize / 2,
                            marginLeft: -outgoingPetalData.targetSize / 2,
                            borderRadius: '50%',
                            backgroundImage: outgoingPetalData.img ? `url(${outgoingPetalData.img})` : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundColor: outgoingPetalData.color,
                            zIndex: 199,
                            pointerEvents: 'none',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Incoming: new petal flies to section icon center and parks */}
            <AnimatePresence>
                {parkedPetalData && viewport.w < 768 && (
                    <motion.div
                        key={`petal-in-${parkedPetalData.id}`}
                        initial={{
                            x: parkedPetalData.startX - parkedPetalData.targetX,
                            y: parkedPetalData.startY - parkedPetalData.targetY,
                            scale: parkedPetalData.startSize / parkedPetalData.targetSize,
                        }}
                        animate={{ x: 0, y: 0, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 16, mass: 0.9, delay: 0.15 }}
                        style={{
                            position: 'absolute',
                            top: parkedPetalData.targetY,
                            left: parkedPetalData.targetX,
                            width: parkedPetalData.targetSize,
                            height: parkedPetalData.targetSize,
                            marginTop: -parkedPetalData.targetSize / 2,
                            marginLeft: -parkedPetalData.targetSize / 2,
                            borderRadius: '50%',
                            backgroundImage: parkedPetalData.img ? `url(${parkedPetalData.img})` : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundColor: parkedPetalData.color,
                            zIndex: 200,
                            pointerEvents: 'none',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
                        }}
                    />
                )}
            </AnimatePresence>

            {(() => {
                const currentFlipKey = focusedId ? `flip-${focusedId}` : null;
                const isNoFly = !!focusedId;

                return (
                    <>


                        {layout.sections.map((sec, secIdx) => (
                            <React.Fragment key={sec.id}>
                                <Node
                                    x={sec.x}
                                    y={sec.y}
                                    size={sec.size}
                                    color={sec.color} iconColor={THEME.white} icon={sec.icon}
                                    onClick={() => handleSectionClick(sec.id)}
                                    className={`${sec.isBg ? "depth-bg" : "depth-active"} ${isLaunched && !focusedId ? 'launched-node' : ''}`}
                                    isFocused={sec.isFocused} isBg={sec.isBg} zIndex={sec.isFocused ? 15 : 12}
                                    showIcon={isLaunched} useElastic={isLaunched}
                                    isResizing={isResizing} initialOpacity={1}
                                    disableAnimation={sec.isBg}
                                    labelData={{
                                        title: sec.label,
                                        desc: sec.desc,
                                        subDesc: "Case Studies",
                                        show: showLabels,
                                        align: viewport.w < 768 ? (sec.isFocused ? 'right' : 'center') : (isShortDesktop && sec.quadrant.includes('b') ? 'top' : 'center')
                                    }}
                                    isShortViewport={isShortDesktop || (viewport.w >= 768 && viewport.w < 1024)}
                                    noFlyTransition={sec.isFocused && isNoFly}
                                    flipKey={sec.isFocused ? currentFlipKey : null}
                                    flipDelay={viewport.w < 768 ? 0 : (sec.isFocused && focusedId ? 1.0 : (!focusedId ? secIdx * 0.15 : 0))}
                                    sizeDelay={viewport.w < 768 ? 0 : (sec.isFocused && focusedId ? 1.0 : (!focusedId ? secIdx * 0.15 : 0))}
                                />
                                <AnimatePresence mode="popLayout">
                                    {(sec.isFocused || !focusedId) && sec.subPetals.map((sp, idx) => {
                                        if (!sp.visible) return null;

                                        const isInitialLoadDelay = !isSettled; // Only show sub-petals when in Phase 2
                                        const opacityMul = (isInitialLoadDelay || sec.isBg) ? 0 : 1;

                                        const isLargeUnfocused = (viewport.w >= 768 && !focusedId);
                                        const nodeDelay = (sec.isFocused && focusedId ? 1.0 : 0.3 + (secIdx * 0.15)) + (idx * 0.08);

                                        const isMobileViewport = viewport.w < 768;
                                        const nodeContent = (
                                            <div style={{ pointerEvents: 'auto' }}>
                                                <Node
                                                    x={sp.x} y={sp.y} size={sp.size}
                                                    color={sp.color} ringColor={sp.parentColor} iconColor={THEME.white}
                                                    onClick={() => {
                                                        if (viewport.w < 768 && !focusedId) {
                                                            handleMobilePetalClick(sp, sec);
                                                        } else {
                                                            const path = sp.link || sp.path || `/work/${sp.id}`;
                                                            if (getProject(sp.id)?.isConstruction) {
                                                                requestConstructionAccess(path);
                                                            } else if (isProjectUnlocked(sp.id)) {
                                                                if (closeMenu) closeMenu();
                                                                navigate(path);
                                                            } else {
                                                                requestAccess(path);
                                                            }
                                                        }
                                                    }}
                                                    className={sec.isFocused || isLargeUnfocused ? "depth-active" : ""}
                                                    zIndex={sec.isFocused || isLargeUnfocused ? 12 : 2}
                                                    showIcon={isSettled && (sec.isFocused || isLargeUnfocused || (sp.isAnchor && viewport.w < 768))} useElastic={isSettled}
                                                    isResizing={isResizing} isChild={true} initialOpacity={opacityMul}
                                                    isDimmed={!sec.isFocused && !isLargeUnfocused && !(sp.isAnchor && viewport.w < 768)}
                                                    labelData={isLargeUnfocused ? { title: sp.label, desc: sp.desc, projectId: sp.id, inProgress: sp.inProgress, align: ((isShortDesktop || (viewport.w >= 768 && viewport.w < 1024)) && sec.quadrant.includes('b')) ? 'top' : 'center', img: sp.img, Icon: sp.Icon, contain: sp.contain, screenColor: sp.screenColor, imgPosition: sp.imgPosition, imgScale: sp.imgScale, imgNudge: sp.imgNudge, show: showLabels } : { title: sp.label, desc: sp.desc, projectId: sp.id, inProgress: sp.inProgress, align: (isShortDesktop && sec.quadrant.includes('b')) ? 'top' : (viewport.w < 768 ? 'center' : sp.alignLabel), img: sp.img, Icon: sp.Icon, contain: sp.contain, screenColor: sp.screenColor, imgPosition: sp.imgPosition, imgScale: sp.imgScale, imgNudge: sp.imgNudge, show: (viewport.w < 768 && !focusedId) ? false : showLabels }}
                                                    isShortViewport={isShortDesktop || viewport.w < 1024}
                                                    noFlyTransition={isNoFly}
                                                    alwaysShowLabel={isLargeUnfocused && !(isShortDesktop || viewport.w < 1024)}
                                                />
                                            </div>
                                        );

                                        return (isMobileViewport && !focusedId) ? (
                                            <div
                                                key={`wrapper-${sp.id}-${sec.isFocused ? 'focus' : 'bg'}`}
                                                style={{
                                                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                                    pointerEvents: 'none',
                                                    opacity: (parkedPetalData?.id === sp.id || outgoingPetalData?.id === sp.id) ? 0 : 1,
                                                }}
                                            >
                                                {nodeContent}
                                            </div>
                                        ) : (
                                            <motion.div
                                                key={`wrapper-${sp.id}-${sec.isFocused ? 'focus' : 'bg'}`}
                                                initial={{ opacity: 0, rotateY: -90 }}
                                                animate={{ opacity: 1, rotateY: 0 }}
                                                exit={{ opacity: 0, rotateY: 90 }}
                                                transition={{ delay: focusedId ? nodeDelay : 0, type: "spring", stiffness: 60, damping: 12, mass: 0.8 }}
                                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', perspective: '1000px' }}
                                            >
                                                {nodeContent}
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            </React.Fragment>
                        ))}
                    </>
                );
            })()}



        </div>
    );
}
