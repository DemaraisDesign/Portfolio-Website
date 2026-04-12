import React, { useState, useRef, useEffect } from 'react';
import { Network, RotateCcw, Image, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGesture } from '@use-gesture/react';
const InteractiveUserFlow = ({ color = '#00CAE3' }) => {
    const [step, setStep] = useState(0);
    const [activeStep, setActiveStep] = useState(0); // Tracks exactly where the camera should focus
    const [isLightboxOpen, setIsLightboxOpen] = useState(false); // Controls the full flow artifact overlay
    const [path, setPath] = useState(null);
    const [path2, setPath2] = useState(null);
    const [path3, setPath3] = useState(null);
    const [path4, setPath4] = useState(null);
    const [path5, setPath5] = useState(null);
    const [path6, setPath6] = useState(null);
    const [path7, setPath7] = useState(null);
    const [path8, setPath8] = useState(null);

    // Visibility Lock: Once a path is revealed, it stays visible forever, even if the user changes their answer Y <-> N
    const [revealed, setRevealed] = useState(new Set());

    // Manual Pan/Zoom overrides
    const [isManual, setIsManual] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
    const [tempTarget, setTempTarget] = useState(null); // Used to instantly queue forward-camera movement while states delay
    const contentRef = useRef(null);
    const containerRef = useRef(null);

    // Prevent native browser zooming (trackpad pinch or mobile multi-touch)
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleWheel = (e) => {
            // true if pinch-zooming on a trackpad
            if (e.ctrlKey) {
                e.preventDefault();
            }
        };

        const handleTouchMove = (e) => {
            // Detect multi-touch pinch on touch devices
            if (e.touches && e.touches.length > 1) {
                e.preventDefault();
            }
        };

        // Must be non-passive to allow e.preventDefault()
        container.addEventListener('wheel', handleWheel, { passive: false });
        container.addEventListener('touchmove', handleTouchMove, { passive: false });

        return () => {
            container.removeEventListener('wheel', handleWheel);
            container.removeEventListener('touchmove', handleTouchMove);
        };
    }, []);

    // Camera tracks the active node to the dead center (300px) of the 600px tall canvas.
    // Node 1 (Objective): top 55, h 160. Center = 135px. Needs +165px.
    // Connector 1: 215 -> 315.
    // Node 2 (Enter Site): top 315, h 48. Center = 339px. Needs -39px.
    // Connector 2: 363 -> 463.
    // Node 3 (Diamond): top 563 (center). Needs -263px offset.
    const getCameraY = (currentStep, currentPath, currentPath2, currentPath3, currentPath4, currentPath5, currentPath6, currentPath7, currentPath8) => {
        // Enforce strict top-down step matching so deeper cached paths don't hijack the camera 
        // when the user is explicitly interacting with a higher node.
        if (currentStep >= 22 && currentPath8 === 'Y') return -5118; // Terminal Node: Success (5338 + 80 - 300)
        if (currentStep === 21 && currentPath8 === 'Y') return -4904; // Action Node: Select Display (5180 + 24 - 300)
        if (currentStep === 20 && currentPath8 === 'Y') return -4746; // Action Node: Select Media (5022 + 24 - 300)
        if (currentStep === 19 && currentPath8 === 'Y') return -4588; // Action Node: Click Add (4864 + 24 - 300)
        if (currentStep === 18 && currentPath8 === 'Y') return -4430; // Action Node: Go to playlists (4706 + 24 - 300)
        if (currentStep === 17 && currentPath8 === 'Y') return -4272; // Action Node: Choose Media offset (4548 + 24 - 300)
        if (currentStep >= 17 && currentPath8 === 'N') return -3763; // Diamond 8 FAIL centered
        if (currentStep === 16) return -3763; // Diamond 8 centered (Target 4063 => offset -3763)
        if (currentStep === 15 && currentPath7 === 'Y') return -3515; // "Enter info & code" (Target 3815 => offset -3515)
        if (currentStep === 15 && currentPath7 === 'N') return -3030; // Diamond 7 FAIL centered
        if (currentStep === 14) return -3030; // Diamond 7 centered (Target 3330 => offset -3030)
        if (currentStep === 10 && currentPath5 === 'Y') return -2294;
        if (currentStep === 10 && currentPath5 === 'N') return -1729;
        if (currentStep === 10) return -2300;
        if (currentStep === 9 && currentPath4 === 'N') return -1729;
        if (currentStep === 9 && currentPath4 === 'Y') return -2238;
        if (currentStep >= 13 && currentStep < 14) return -2762; // Click "Add Display" (Target 3062 => offset -2762)
        if (currentStep === 12) return -2238; // Download App node absolute center
        if (currentStep === 11 && currentPath6 === 'N') return -2294;
        if (currentStep === 11 && currentPath6 === 'Y') return -2238;
        if (currentStep === 8 && currentPath3 === 'N') return -1729;
        if (currentStep === 8 && currentPath3 === 'Y') return -2238;
        if (currentStep === 7) return -1729;
        if (currentStep === 6 && currentPath2 === 'Y') return -1505;
        if (currentStep === 6 && currentPath2 === 'N') return -996;
        if (currentStep === 5) return -996;
        if (currentStep === 4 && currentPath === 'Y') return -772;
        if (currentStep === 3) return -263;
        if (currentStep === 1) return -39;
        if (currentStep === 0) return 165;
        if (currentStep === 2) return -263; // Diamond 1
        return -263;
    };
    const cameraY = getCameraY(activeStep, path, path2, path3, path4, path5, path6, path7, path8);

    const getCameraX = (currentStep, currentPath, currentPath2, currentPath3, currentPath4, currentPath5, currentPath6, currentPath7, currentPath8) => {
        // Enforce strict top-down step matching for X axis as well
        if (currentStep >= 17 && currentPath8 === 'N') return -140;
        if (currentStep >= 15 && currentPath7 === 'N') return -140;
        if (currentStep === 10 && currentPath5 === 'Y') return -834;
        if (currentStep === 10 && currentPath5 === 'N') return -974;
        if (currentStep === 9 && currentPath4 === 'N') return -834;
        if (currentStep === 9 && currentPath4 === 'Y') return 0;
        if (currentStep === 11 && currentPath6 === 'N') return -974;
        if (currentStep === 11 && currentPath6 === 'Y') return 0;
        if (currentStep === 8 && currentPath3 === 'N') return -417; // Centers Diamond 4 (x=+417 offset)
        if (currentStep === 8 && currentPath3 === 'Y') return 0;
        if (currentStep === 7) return 0; // Diamond 3
        if (currentStep === 6 && currentPath2 === 'N') return -140; // N-branch on Diamond 2 shifts right
        if (currentStep === 3 && currentPath === 'N') return -140; // N-branch on Diamond 1 shifts right
        if (currentStep === 4 && currentPath === 'Y') return 22;
        return 0; // Center
    };
    const cameraX = getCameraX(activeStep, path, path2, path3, path4, path5, path6, path7, path8);

    // Combine manual pan/zoom with automated camera tracking
    // Combine manual pan/zoom with automated camera tracking
    // If a tempTarget is active (during an 800ms delay trap), aggressively prioritize that to prevent the "dual jump" backwards
    const currentY = tempTarget ? tempTarget.y : (isManual ? panOffset.y : cameraY);
    const currentX = tempTarget ? tempTarget.x : (isManual ? panOffset.x : cameraX);
    const currentScale = zoom; // Always use the explicitly tracked zoom state

    // Gesture definitions for Drag and Pinch (Trackpad/Mobile)
    const bindGestures = useGesture(
        {


            onDrag: ({ offset: [dx, dy] }) => {
                setIsManual(true);
                setPanOffset({ x: dx, y: dy });
            },
            onPinch: ({ offset: [d], first }) => {
                if (first && !isManual) {
                    // Sync pan offset to active camera position instantly on pinch start
                    setPanOffset({ x: cameraX, y: cameraY });
                }
                setIsManual(true);
                // Clamp zoom between 0.02x and 2x
                setZoom(Math.max(0.02, Math.min(2, d)));
            }
        },
        {
            drag: {
                from: () => [currentX, currentY]
            },
            pinch: {
                from: () => [currentScale, 0],
                scaleBounds: { min: 0.02, max: 2 },
                rubberband: false
            }
        }
    );

    // Global tap-to-focus helper for all nodes enforcing a strict 2-Step animation:
    // 1. Instantly snap camera to the node that was just clicked (using originStep)
    // 2. Wait a moment, then process the path update so the camera smoothly tracks the line downwards
    const focusOnNode = (originStep, targetStep, updaterFunction = null, pathValue = null, pathId = null, contextOverrides = {}) => {
        const isSignificantlyZoomed = Math.abs(zoom - 1) > 0.05;
        const isSignificantlyPanned = isManual && (Math.abs(panOffset.x - cameraX) > 20 || Math.abs(panOffset.y - cameraY) > 20);
        const needsDelay = (isSignificantlyZoomed || isSignificantlyPanned);

        // Step 1: Immediately cancel any manual drag/zoom states and escape "Show All" mode
        setIsManual(false);

        setZoom(1);


        if (updaterFunction && pathValue) {
            updaterFunction(pathValue);
            if (pathId) {
                setRevealed(prev => {
                    const next = new Set(prev);
                    next.add(`${pathId}_${pathValue}`);
                    return next;
                });
            }
        }

        const executeStateUpdate = () => {
            setStep(prevStep => Math.max(prevStep, targetStep));
            setActiveStep(targetStep); // Force camera down new branch
            setTempTarget(null); // Release the temporary override lock to allow the new target to take over
        };

        if (needsDelay) {
            // Step 1b: Calculate and forcibly lock the camera to the *current* visual state (where the clicked node is)
            // By setting tempTarget to the originStep coordinates, we prevent the camera from instantly jumping
            // to the bottom before the line has even animated.
            setTempTarget({
                y: getCameraY(originStep,
                    contextOverrides.path || path,
                    contextOverrides.path2 || path2,
                    contextOverrides.path3 || path3,
                    contextOverrides.path4 || path4,
                    contextOverrides.path5 || path5,
                    contextOverrides.path6 || path6,
                    contextOverrides.path7 || path7,
                    contextOverrides.path8 || path8),
                x: getCameraX(originStep,
                    contextOverrides.path || path,
                    contextOverrides.path2 || path2,
                    contextOverrides.path3 || path3,
                    contextOverrides.path4 || path4,
                    contextOverrides.path5 || path5,
                    contextOverrides.path6 || path6,
                    contextOverrides.path7 || path7,
                    contextOverrides.path8 || path8)
            });

            // Step 2: Wait 600ms for the user to visually land on the clicked node, then push the state update
            // This causes the `getCameraY` arrays to trigger their new deeper coordinates,
            // and Framer Motion's springs will smoothly drag the camera down the connector line.
            setTimeout(executeStateUpdate, 600);
        } else {
            // If already at default view (not zoomed or manually panned), execute immediately
            executeStateUpdate();
        }
    };

    return (
        <div className="w-full font-sans" style={{ fontFamily: '"Outfit", "Inter", sans-serif' }}>
            <div className="relative w-full overflow-hidden bg-[#F5F7F8] border border-gray-200 rounded-2xl shadow-lg">
                <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                    style={{ backgroundImage: "radial-gradient(circle, #0D1216 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

                {/* Dark Blue Header Block */}
                <div className="relative z-20 flex flex-col px-6 md:px-8 pt-6 pb-8" style={{ backgroundColor: '#1b262f' }}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center shrink-0 w-12 h-12 rounded-full shadow-sm border border-transparent text-[#141F28]" style={{ backgroundColor: color }}>
                                <Network size={22} className="[&_rect]:fill-current" />
                            </div>
                            <div>
                                <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">As-Is Flow</h1>
                                <p className="text-sm font-medium text-white/70 mt-0.5">Display Now</p>
                            </div>
                        </div>

                        {/* Flowchart Statistics */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm md:justify-end">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#56C6FF]" />
                                <span className="font-medium text-white/90">11 action steps</span>
                            </div>
                            <div className="hidden md:block w-px h-4 bg-white/20" />
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#A88EFF]" />
                                <span className="font-medium text-white/90">8 decision points</span>
                            </div>
                            <div className="hidden md:block w-px h-4 bg-white/20" />
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#FF7374]" />
                                <span className="font-medium text-white/90">6 failure endpoints</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Flowchart Canvas (Gesture Wrapper) */}
                <div
                    ref={containerRef}
                    {...bindGestures()}
                    className="relative z-10 w-full h-[600px] overflow-hidden bg-[#F5F7F8] touch-none"
                    style={{ cursor: isManual ? 'grabbing' : 'grab' }}
                >


                    {/* Show All Button */}

                    {/* Full Flow Artifact Lightbox Button */}
                    <button
                        onClick={() => setIsLightboxOpen(true)}
                        className="absolute top-6 left-6 px-4 py-2 bg-white border border-gray-200 shadow-sm text-brand-ink hover:bg-gray-50 transition-colors z-30 rounded-full flex items-center gap-2 font-medium text-xs md:text-sm"
                    >
                        <Image size={16} className="text-brand-ink/70" />
                        Full Flow Artifact
                    </button>

                    {/* Restart Button */}
                    <button
                        onClick={() => {
                            focusOnNode(-1, 0);
                            setPath(null);
                            setPath2(null);
                            setPath3(null);
                            setPath4(null);
                            setPath5(null);
                            setPath6(null);
                            setPath7(null);
                            setPath8(null);
                            setRevealed(new Set());
                            setActiveStep(0);

                        }}
                        className="absolute top-6 right-6 p-2 text-gray-400 font-light hover:text-brand-ink transition-colors z-30 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow active:scale-95"
                        title="Restart Flow"
                    >
                        <RotateCcw size={18} />
                    </button>

                    {/* Camera Track */}
                    <motion.div
                        ref={contentRef}
                        className="absolute inset-x-0 top-0 w-full"
                        // Anchor Zoom around the currently selected / interacted node
                        style={{ transformOrigin: `50% ${-getCameraY(activeStep, path, path2, path3, path4, path5, path6, path7, path8) + 300}px` }}
                        animate={{ y: currentY, x: currentX, scale: currentScale }}
                        transition={{
                            y: isManual ? { duration: 0 } : { type: "spring", stiffness: 90, damping: 13.5, mass: 1 },
                            x: isManual ? { duration: 0 } : { type: "spring", stiffness: 90, damping: 13.5, mass: 1 },
                            scale: isManual ? { duration: 0 } : { duration: 0.7, ease: "easeInOut" }
                        }}
                    >

                        {/* Node 1: Objective */}
                        <div className="absolute top-[55px] left-1/2 -translate-x-1/2 z-20">
                            <motion.div
                                className="w-32 h-32 md:w-40 md:h-40 flex items-center justify-center p-4 text-center text-sm font-medium rounded-full shadow-lg border border-transparent cursor-pointer hover:shadow-xl transition-shadow"
                                style={{ backgroundColor: '#1b262f', color: '#56C6FF', willChange: 'transform', backfaceVisibility: 'hidden', WebkitFontSmoothing: 'subpixel-antialiased' }}
                                initial={{ scale: 1, opacity: 1 }}
                                animate={{
                                    scale: activeStep === 0 ? [1, 1.05, 1] : 0.95,
                                    opacity: activeStep === 0 ? 1 : 0.5
                                }}
                                transition={{
                                    scale: { duration: activeStep === 0 ? 3 : 0.5, repeat: activeStep === 0 ? Infinity : 0, ease: "easeInOut" }
                                }}
                                onPointerDownCapture={(e) => e.stopPropagation()}
                                onClick={(e) => { e.stopPropagation(); focusOnNode(0, 1); }}
                            >
                                I want to create an original test display
                            </motion.div>
                        </div>

                        {/* Step 1 Elements */}
                        <AnimatePresence>
                            {step >= 1 && (
                                <>
                                    {/* Animated Arrow Connector 1 */}
                                    <motion.div
                                        className="absolute left-1/2 -translate-x-1/2 top-[225px] z-10 w-12 h-[80px] flex flex-col items-center"
                                        initial={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <motion.svg
                                            width="40"
                                            height="80"
                                            viewBox="0 0 40 80"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="stroke-brand-dark overflow-visible"
                                        >
                                            <motion.line
                                                x1="20"
                                                y1="0"
                                                x2="20"
                                                y2="80"
                                                strokeWidth="2.5"
                                                strokeLinecap="round"
                                                initial={{ pathLength: 0 }}
                                                animate={{ pathLength: 1 }}
                                                transition={{ duration: 0.7, ease: "easeInOut" }}
                                            />
                                        </motion.svg>
                                    </motion.div>

                                    {/* Node 2: Enter site */}
                                    <div className="absolute top-[315px] left-1/2 -translate-x-1/2 z-20">
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.5 }}
                                            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.7 }}
                                        >
                                            <motion.div
                                                animate={{
                                                    scale: activeStep === 1 ? [1, 1.05, 1] : 0.95,
                                                    opacity: activeStep === 1 ? 1 : 0.5
                                                }}
                                                transition={{
                                                    scale: { duration: activeStep === 1 ? 3 : 0.5, repeat: activeStep === 1 ? Infinity : 0, ease: "easeInOut" }
                                                }}
                                                onPointerDownCapture={(e) => e.stopPropagation()}
                                                onClick={(e) => { e.stopPropagation(); focusOnNode(1, 2); }}
                                                className="w-40 md:w-56 h-12 bg-[#56C6FF] text-brand-ink flex flex-col items-center justify-center px-4 text-center text-xs md:text-sm font-bold uppercase tracking-widest rounded-theme-sm shadow-md border border-brand-dark/10 cursor-pointer hover:shadow-lg transition-shadow"
                                            >
                                                ENTER SITE
                                            </motion.div>
                                        </motion.div>
                                    </div>
                                </>
                            )}

                            {/* Step 2 Elements */}
                            {step >= 2 && (
                                <>
                                    {/* Animated Arrow Connector 2 */}
                                    <motion.div
                                        className="absolute left-1/2 -translate-x-1/2 top-[373px] z-10 w-12 h-[80px] flex flex-col items-center"
                                        initial={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <motion.svg width="40" height="80" viewBox="0 0 40 80" fill="none" className="stroke-brand-dark overflow-visible">
                                            <motion.line x1="20" y1="0" x2="20" y2="80" strokeWidth="2.5" strokeLinecap="round"
                                                initial={{ pathLength: 0 }}
                                                animate={{ pathLength: 1 }}
                                                transition={{ duration: 0.7, ease: "easeInOut" }}
                                            />
                                        </motion.svg>
                                    </motion.div>

                                    {/* --- REUSABLE DECISION NODE GROUP --- */}
                                    {/* The wrapper is the exact size and position of the diamond. The Y and N buttons are absolutely aligned to the exact center (top-1/2 left-1/2) of this wrapper, and then pushed out using their specific margins. This locks the entire group together permanently. */}
                                    <div className="absolute top-[563px] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-[200px] h-[200px] md:w-[220px] md:h-[220px]">
                                        <div className="absolute inset-0">
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.5 }}
                                                animate={{ opacity: step > 3 ? 0.5 : 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.5 }}
                                                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.7 }}
                                                className="relative w-full h-full flex items-center justify-center cursor-pointer"
                                                onClick={(e) => { e.stopPropagation(); focusOnNode(2, 2); }}
                                                onPointerDownCapture={(e) => e.stopPropagation()}
                                            >
                                                {/* Diamond Background Shape (Rotated) */}
                                                <div className="absolute inset-0 m-auto w-[141px] h-[141px] md:w-[155px] md:h-[155px] rotate-45 rounded-xl shadow-xl" style={{ backgroundColor: '#FFDE21' }} />

                                                {/* Text Content (Straight) */}
                                                <div className="relative z-10 w-full text-center">
                                                    <span className="text-sm md:text-base font-bold leading-snug md:leading-tight block" style={{ color: '#0D1216' }}>Do you have a <br /> Windows PC?</span>
                                                </div>
                                            </motion.div>
                                        </div>

                                        {/* 2. Yes Button */}
                                        <motion.div
                                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 -ml-[22px] mt-[113px] pointer-events-auto"
                                            animate={{
                                                scale: path === 'Y' || revealed.has('path_Y') ? 1 : [1, 1.15, 1],
                                                opacity: path === 'Y' || revealed.has('path_Y') ? 0.5 : 1
                                            }}
                                            transition={{
                                                scale: { duration: path === 'Y' || revealed.has('path_Y') ? 0.5 : 3, repeat: path === 'Y' || revealed.has('path_Y') ? 0 : Infinity, ease: "easeInOut" },
                                                opacity: { duration: 0.5 }
                                            }}
                                            onPointerDownCapture={(e) => e.stopPropagation()}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                focusOnNode(2, 4, setPath, 'Y', 'path');
                                            }}
                                        >
                                            <motion.div
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.7 }}
                                                className="relative w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center text-sm md:text-base font-bold shadow-md cursor-pointer hover:shadow-lg" style={{ backgroundColor: '#00B782', color: '#0D1216' }}
                                            >
                                                Y
                                            </motion.div>
                                        </motion.div>

                                        {/* 3. No Button Anchor & Branch (Anchored to Diamond center, correctly skewed 135px right) */}
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex items-center pointer-events-auto ml-[135px]">
                                            {/* The N Node Itself */}
                                            <motion.div
                                                animate={{
                                                    scale: path === 'N' || revealed.has('path_N') ? 1 : [1, 1.15, 1],
                                                    opacity: path === 'N' || revealed.has('path_N') ? 0.5 : 1
                                                }}
                                                transition={{
                                                    scale: { duration: path === 'N' || revealed.has('path_N') ? 0.5 : 3, repeat: path === 'N' || revealed.has('path_N') ? 0 : Infinity, ease: "easeInOut" },
                                                    opacity: { duration: 0.5 }
                                                }}
                                                onPointerDownCapture={(e) => e.stopPropagation()}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    focusOnNode(2, 3, setPath, 'N', 'path');
                                                }}
                                                className="relative z-50 flex-shrink-0 cursor-pointer pointer-events-auto"
                                            >
                                                <motion.div
                                                    initial={{ scale: 0, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.9 }}
                                                    className="relative w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center text-sm md:text-base font-bold shadow-md hover:shadow-lg" style={{ backgroundColor: '#FF7474', color: '#0D1216' }}
                                                >
                                                    N
                                                </motion.div>
                                            </motion.div>

                                            {/* Fail Branch Container (Locked right of N Node) */}
                                            {(step >= 3 && path === 'N') || revealed.has('path_N') ? (
                                                <div className="absolute left-full top-1/2 -translate-y-1/2 flex items-center gap-[10px] ml-[10px]">
                                                    <motion.div
                                                        className="h-[2.5px] w-12 md:w-20 flex-shrink-0 z-10 rounded-full"
                                                        style={{ backgroundColor: '#0D1216', transformOrigin: "left center" }}
                                                        initial={{ scaleX: 0, opacity: 0 }}
                                                        animate={{ scaleX: 1, opacity: 1 }}
                                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                                    />
                                                    <motion.div
                                                        className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 flex items-center justify-center p-2 text-center rounded-full shadow-lg border border-transparent cursor-default z-20"
                                                        style={{ backgroundColor: '#FF7474', color: '#0D1216' }}
                                                        initial={{ scale: 0.5, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.25 }}
                                                    >
                                                        <span className="relative z-10 block text-sm md:text-base font-bold tracking-widest uppercase">FAIL</span>
                                                    </motion.div>
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>

                                </>
                            )}

                            {/* Step 4 Elements (Y Path) */}
                            {(step >= 4 && path === 'Y') || revealed.has('path_Y') ? (
                                <>
                                    {/* Animated Arrow Connector 3 (Vertical) */}
                                    <motion.div
                                        className="absolute left-1/2 -translate-x-1/2 top-[740px] z-10 w-[40px] h-[288px] flex flex-col items-center justify-center"
                                        initial={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <motion.svg width="40" height="288" viewBox="0 0 40 288" fill="none" className="stroke-brand-dark overflow-visible">
                                            <motion.line x1="20" y1="0" x2="20" y2="288" strokeWidth="2.5" strokeLinecap="round"
                                                initial={{ pathLength: 0 }}
                                                animate={{ pathLength: 1 }}
                                                transition={{ duration: 0.7, ease: "easeInOut" }}
                                            />
                                        </motion.svg>
                                    </motion.div>

                                    {/* Node 4: Click 'Free Trial' */}
                                    <div className="absolute top-[1048px] left-1/2 -translate-x-1/2 z-20">
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.5 }}
                                            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.7 }}
                                        >
                                            <motion.div
                                                animate={{
                                                    scale: activeStep === 4 ? [1, 1.05, 1] : 0.95,
                                                    opacity: activeStep === 4 ? 1 : 0.5
                                                }}
                                                transition={{
                                                    scale: { duration: activeStep === 4 ? 3 : 0.5, repeat: activeStep === 4 ? Infinity : 0, ease: "easeInOut" }
                                                }}
                                                onPointerDownCapture={(e) => e.stopPropagation()}
                                                onClick={(e) => { e.stopPropagation(); focusOnNode(4, 5); }}
                                                className="w-40 md:w-56 h-12 bg-[#56C6FF] text-brand-ink flex flex-col items-center justify-center px-4 text-center text-xs md:text-sm font-bold uppercase tracking-widest rounded-theme-sm shadow-md border border-brand-dark/10 cursor-pointer hover:shadow-lg transition-shadow"
                                            >
                                                CLICK 'FREE TRIAL'
                                            </motion.div>
                                        </motion.div>
                                    </div>
                                </>
                            ) : null}

                            {/* Step 5 Elements (Decision 2 - Outlook/Gmail) */}
                            {step >= 5 && path === 'Y' && (
                                <>
                                    {/* Animated Arrow Connector 4 (Vertical) */}
                                    {/* Drops from Free Trial (bottom: 1096px) to Decision 2 top pad */}
                                    <motion.div
                                        className="absolute left-1/2 -translate-x-1/2 top-[1116px] z-10 w-[40px] h-[60px] flex flex-col items-center justify-center"
                                        initial={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <motion.svg width="40" height="60" viewBox="0 0 40 60" fill="none" className="stroke-brand-dark overflow-visible">
                                            <motion.line x1="20" y1="0" x2="20" y2="60" strokeWidth="2.5" strokeLinecap="round"
                                                initial={{ pathLength: 0 }}
                                                animate={{ pathLength: 1 }}
                                                transition={{ duration: 0.7, ease: "easeInOut" }}
                                            />
                                        </motion.svg>
                                    </motion.div>

                                    {/* --- REUSABLE DECISION NODE GROUP 2 --- */}
                                    {/* Tracks perfectly from the center axis directly below Free Trial Node */}
                                    <div className="absolute top-[1296px] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-[200px] h-[200px] md:w-[220px] md:h-[220px]">
                                        <div className="absolute inset-0">
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.5 }}
                                                animate={{ opacity: step > 5 ? 0.5 : 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.5 }}
                                                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.7 }}
                                                className="relative w-full h-full flex items-center justify-center cursor-pointer"
                                                onClick={(e) => { e.stopPropagation(); focusOnNode(5, 5); }}
                                                onPointerDownCapture={(e) => e.stopPropagation()}
                                            >
                                                {/* Diamond Background Shape (Rotated) */}
                                                <div className="absolute inset-0 m-auto w-[141px] h-[141px] md:w-[155px] md:h-[155px] rotate-45 rounded-xl shadow-xl" style={{ backgroundColor: '#FFDE21' }} />

                                                {/* Text Content */}
                                                <div className="relative z-10 w-full text-center px-4">
                                                    <span className="text-sm md:text-base font-bold leading-snug md:leading-tight block" style={{ color: '#0D1216' }}>Do you have<br />Outlook or<br />Gmail?</span>
                                                </div>
                                            </motion.div>
                                        </div>

                                        {/* Yes Button (Anchored to Diamond center) */}
                                        <motion.div
                                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 -ml-[22px] mt-[113px] pointer-events-auto"
                                            animate={{
                                                scale: path2 === 'Y' || revealed.has('path2_Y') ? 1 : [1, 1.15, 1],
                                                opacity: path2 === 'Y' || revealed.has('path2_Y') ? 0.5 : 1
                                            }}
                                            transition={{
                                                scale: { duration: path2 === 'Y' || revealed.has('path2_Y') ? 0.5 : 3, repeat: path2 === 'Y' || revealed.has('path2_Y') ? 0 : Infinity, ease: "easeInOut" },
                                                opacity: { duration: 0.5 }
                                            }}
                                            onPointerDownCapture={(e) => e.stopPropagation()}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                focusOnNode(5, 6, setPath2, 'Y', 'path2');
                                            }}
                                        >
                                            <motion.div
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.7 }}
                                                className="relative w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center text-sm md:text-base font-bold shadow-md cursor-pointer hover:shadow-lg" style={{ backgroundColor: '#00B782', color: '#0D1216' }}
                                            >
                                                Y
                                            </motion.div>
                                        </motion.div>

                                        {/* No Button Anchor & Fail Branch */}
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex items-center pointer-events-auto ml-[135px]">
                                            {/* The N Node Itself */}
                                            <motion.div
                                                animate={{
                                                    scale: path2 === 'N' || revealed.has('path2_N') ? 1 : [1, 1.15, 1],
                                                    opacity: path2 === 'N' || revealed.has('path2_N') ? 0.5 : 1
                                                }}
                                                transition={{
                                                    scale: { duration: path2 === 'N' || revealed.has('path2_N') ? 0.5 : 3, repeat: path2 === 'N' || revealed.has('path2_N') ? 0 : Infinity, ease: "easeInOut" },
                                                    opacity: { duration: 0.5 }
                                                }}
                                                onPointerDownCapture={(e) => e.stopPropagation()}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    focusOnNode(5, 6, setPath2, 'N', 'path2');
                                                }}
                                                className="relative z-50 flex-shrink-0 cursor-pointer pointer-events-auto"
                                            >
                                                <motion.div
                                                    initial={{ scale: 0, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.9 }}
                                                    className="relative w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center text-sm md:text-base font-bold shadow-md hover:shadow-lg" style={{ backgroundColor: '#FF7474', color: '#0D1216' }}
                                                >
                                                    N
                                                </motion.div>
                                            </motion.div>

                                            {/* Fail Branch Container */}
                                            {path2 === 'N' || revealed.has('path2_N') ? (
                                                <div className="absolute left-full top-1/2 -translate-y-1/2 flex items-center gap-[10px] ml-[10px]">
                                                    <motion.div
                                                        className="h-[2.5px] w-12 md:w-20 flex-shrink-0 z-10 rounded-full"
                                                        style={{ backgroundColor: '#0D1216', transformOrigin: "left center" }}
                                                        initial={{ scaleX: 0, opacity: 0 }}
                                                        animate={{ scaleX: 1, opacity: 1 }}
                                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                                    />
                                                    <motion.div
                                                        className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 flex items-center justify-center p-2 text-center rounded-full shadow-lg border border-transparent cursor-default z-20"
                                                        style={{ backgroundColor: '#FF7474', color: '#0D1216' }}
                                                        initial={{ scale: 0.5, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.25 }}
                                                    >
                                                        <span className="relative z-10 block text-sm md:text-base font-bold tracking-widest uppercase">FAIL</span>
                                                    </motion.div>
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Step 6 Elements (Y Path from Diamond 2) */}
                            {step >= 6 && path2 === 'Y' && (
                                <>
                                    {/* Animated Arrow Connector 5 (Vertical) */}
                                    <motion.div
                                        className="absolute left-1/2 -translate-x-1/2 top-[1473px] z-10 w-[40px] h-[288px] flex flex-col items-center justify-center"
                                        initial={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <motion.svg width="40" height="288" viewBox="0 0 40 288" fill="none" className="stroke-brand-dark overflow-visible">
                                            <motion.line x1="20" y1="0" x2="20" y2="288" strokeWidth="2.5" strokeLinecap="round"
                                                initial={{ pathLength: 0 }}
                                                animate={{ pathLength: 1 }}
                                                transition={{ duration: 0.7, ease: "easeInOut" }}
                                            />
                                        </motion.svg>
                                    </motion.div>

                                    {/* Node 6: Sign In */}
                                    <div className="absolute top-[1781px] left-1/2 -translate-x-1/2 z-20">
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.5 }}
                                            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.7 }}
                                        >
                                            <motion.div
                                                animate={{
                                                    scale: activeStep === 6 ? [1, 1.05, 1] : 0.95,
                                                    opacity: activeStep === 6 ? 1 : 0.5
                                                }}
                                                transition={{
                                                    scale: { duration: activeStep === 6 ? 3 : 0.5, repeat: activeStep === 6 ? Infinity : 0, ease: "easeInOut" }
                                                }}
                                                onPointerDownCapture={(e) => e.stopPropagation()}
                                                onClick={(e) => { e.stopPropagation(); focusOnNode(6, 7); }}
                                                className="w-40 md:w-56 h-12 bg-[#56C6FF] text-brand-ink flex flex-col items-center justify-center px-4 text-center text-xs md:text-sm font-bold uppercase tracking-widest rounded-theme-sm shadow-md border border-brand-dark/10 cursor-pointer hover:shadow-lg transition-shadow"
                                            >
                                                SIGN IN
                                            </motion.div>
                                        </motion.div>
                                    </div>
                                </>
                            )}

                            {/* Step 7 Elements (Decision 3 - Current Device?) */}
                            {step >= 7 && path2 === 'Y' && (
                                <>
                                    {/* Animated Arrow Connector 6 (Vertical) */}
                                    {/* Drops from Sign In (bottom: 1829px) to Decision 3 Top Pad */}
                                    <motion.div
                                        className="absolute left-1/2 -translate-x-1/2 top-[1849px] z-10 w-[40px] h-[60px] flex flex-col items-center justify-center"
                                        initial={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <motion.svg width="40" height="60" viewBox="0 0 40 60" fill="none" className="stroke-brand-dark overflow-visible">
                                            <motion.line x1="20" y1="0" x2="20" y2="60" strokeWidth="2.5" strokeLinecap="round"
                                                initial={{ pathLength: 0 }}
                                                animate={{ pathLength: 1 }}
                                                transition={{ duration: 0.7, ease: "easeInOut" }}
                                            />
                                        </motion.svg>
                                    </motion.div>

                                    {/* --- REUSABLE DECISION NODE GROUP 3 --- */}
                                    {/* Top is relative to Diamond center y: 2029 (1849 + 60 line = 1909 top edge + 120 center half) */}
                                    <div className="absolute top-[2029px] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-[200px] h-[200px] md:w-[220px] md:h-[220px]">
                                        <div className="absolute inset-0">
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.5 }}
                                                animate={{ opacity: step > 7 ? 0.5 : 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.5 }}
                                                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.7 }}
                                                className="relative w-full h-full flex items-center justify-center cursor-pointer"
                                                onClick={(e) => { e.stopPropagation(); focusOnNode(7, 7); }}
                                                onPointerDownCapture={(e) => e.stopPropagation()}
                                            >
                                                {/* Diamond Background Shape (Rotated) */}
                                                <div className="absolute inset-0 m-auto w-[141px] h-[141px] md:w-[155px] md:h-[155px] rotate-45 rounded-xl shadow-xl" style={{ backgroundColor: '#FFDE21' }} />

                                                {/* Text Content */}
                                                <div className="relative z-10 w-full text-center px-4">
                                                    <span className="text-[12px] md:text-sm font-bold leading-snug block" style={{ color: '#0D1216' }}>Are you<br />intending to<br />display on your<br />current device?</span>
                                                </div>
                                            </motion.div>
                                        </div>

                                        {/* Yes Button (Anchored to Diamond center) */}
                                        <motion.div
                                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 -ml-[22px] mt-[113px] pointer-events-auto"
                                            animate={{
                                                scale: path3 === 'Y' || revealed.has('path3_Y') ? 1 : [1, 1.15, 1],
                                                opacity: path3 === 'Y' || revealed.has('path3_Y') ? 0.5 : 1
                                            }}
                                            transition={{
                                                scale: { duration: path3 === 'Y' || revealed.has('path3_Y') ? 0.5 : 3, repeat: path3 === 'Y' || revealed.has('path3_Y') ? 0 : Infinity, ease: "easeInOut" },
                                                opacity: { duration: 0.5 }
                                            }}
                                            onPointerDownCapture={(e) => e.stopPropagation()}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                focusOnNode(7, 8, setPath3, 'Y', 'path3');
                                            }}
                                        >
                                            <motion.div
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.7 }}
                                                className="relative w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center text-sm md:text-base font-bold shadow-md cursor-pointer hover:shadow-lg" style={{ backgroundColor: '#00B782', color: '#0D1216' }}
                                            >
                                                Y
                                            </motion.div>
                                        </motion.div>

                                        {/* No Button Anchor & Fail Branch */}
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex items-center pointer-events-auto ml-[135px]">
                                            {/* The N Node Itself */}
                                            <motion.div
                                                animate={{
                                                    scale: path3 === 'N' || revealed.has('path3_N') ? 1 : [1, 1.15, 1],
                                                    opacity: path3 === 'N' || revealed.has('path3_N') ? 0.5 : 1
                                                }}
                                                transition={{
                                                    scale: { duration: path3 === 'N' || revealed.has('path3_N') ? 0.5 : 3, repeat: path3 === 'N' || revealed.has('path3_N') ? 0 : Infinity, ease: "easeInOut" },
                                                    opacity: { duration: 0.5 }
                                                }}
                                                onPointerDownCapture={(e) => e.stopPropagation()}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    focusOnNode(7, 8, setPath3, 'N', 'path3');
                                                }}
                                                className="relative z-50 flex-shrink-0 cursor-pointer pointer-events-auto"
                                            >
                                                <motion.div
                                                    initial={{ scale: 0, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.9 }}
                                                    className="relative w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center text-sm md:text-base font-bold shadow-md hover:shadow-lg" style={{ backgroundColor: '#FF7474', color: '#0D1216' }}
                                                >
                                                    N
                                                </motion.div>
                                            </motion.div>

                                            {/* (FAIL Branch removed per user request) */}
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Step 8 Elements (Y Path from Diamond 3) - Vertical Connector */}
                            {(step >= 8 && path3 === 'Y') || revealed.has('path3_Y') ? (
                                <motion.div
                                    className="absolute left-1/2 -translate-x-1/2 top-[2206px] z-10 w-[40px] h-[288px] flex flex-col items-center justify-center"
                                    initial={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <motion.svg width="40" height="288" viewBox="0 0 40 288" fill="none" className="stroke-brand-dark overflow-visible">
                                        <motion.line x1="20" y1="0" x2="20" y2="288" strokeWidth="2.5" strokeLinecap="round"
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ duration: 0.7, ease: "easeInOut" }}
                                        />
                                    </motion.svg>
                                </motion.div>
                            ) : null}

                            {/* Step 8 Elements (Decision 4 - Another PC?) */}
                            {(step >= 8 && path3 === 'N') || revealed.has('path3_N') ? (
                                <React.Fragment key="diamond-4">
                                    {/* Horizontal Connector attached to right of N button */}
                                    {/* N node right edge is at ~157px from center. End is at 167 + 130 = 297px */}
                                    <div className="absolute top-[2029px] left-1/2 -translate-y-1/2 flex items-center z-10 ml-[167px]">
                                        <motion.div
                                            className="h-[2.5px] w-[90px] md:w-[130px] flex-shrink-0 rounded-full"
                                            style={{ backgroundColor: '#0D1216', transformOrigin: "left center" }}
                                            initial={{ scaleX: 0, opacity: 0 }}
                                            animate={{ scaleX: 1, opacity: 1 }}
                                            transition={{ duration: 0.7, ease: "easeOut" }}
                                        />
                                    </div>

                                    {/* --- REUSABLE DECISION NODE GROUP 4 --- */}
                                    {/* Center Y = 2029 (same as Diamond 3). ml-[417px] gives exactly 10px pad after the line */}
                                    <div className="absolute top-[2029px] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-[200px] h-[200px] md:w-[220px] md:h-[220px] ml-[377px] md:ml-[417px]">
                                        <div className="absolute inset-0">
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.5 }}
                                                animate={{ opacity: step > 8 ? 0.5 : 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.5 }}
                                                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.7 }}
                                                className="relative w-full h-full flex items-center justify-center cursor-pointer"
                                                onClick={(e) => { e.stopPropagation(); focusOnNode(8, 8); }}
                                                onPointerDownCapture={(e) => e.stopPropagation()}
                                            >
                                                {/* Diamond Background */}
                                                <div className="absolute inset-0 m-auto w-[141px] h-[141px] md:w-[155px] md:h-[155px] rotate-45 rounded-xl shadow-xl" style={{ backgroundColor: '#FFDE21' }} />

                                                {/* Text Content */}
                                                <div className="relative z-10 w-full text-center px-4">
                                                    <span className="text-[12px] md:text-sm font-bold leading-snug block" style={{ color: '#0D1216' }}>Do you have<br />another PC?</span>
                                                </div>
                                            </motion.div>
                                        </div>

                                        {/* Yes Button */}
                                        <motion.div
                                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 -ml-[22px] mt-[113px] pointer-events-auto"
                                            animate={{
                                                scale: path4 === 'Y' || revealed.has('path4_Y') ? 1 : [1, 1.15, 1],
                                                opacity: path4 === 'Y' || revealed.has('path4_Y') ? 0.5 : 1
                                            }}
                                            transition={{
                                                scale: { duration: path4 === 'Y' || revealed.has('path4_Y') ? 0.5 : 3, repeat: path4 === 'Y' || revealed.has('path4_Y') ? 0 : Infinity, ease: "easeInOut" },
                                                opacity: { duration: 0.5 }
                                            }}
                                            onPointerDownCapture={(e) => e.stopPropagation()}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                focusOnNode(8, 9, setPath4, 'Y', 'path4', { path3: 'N' });
                                            }}
                                        >
                                            <motion.div
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.7 }}
                                                className="relative w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center text-sm md:text-base font-bold shadow-md cursor-pointer hover:shadow-lg" style={{ backgroundColor: '#00B782', color: '#0D1216' }}
                                            >
                                                Y
                                            </motion.div>
                                        </motion.div>

                                        {/* No Button */}
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex items-center pointer-events-auto ml-[135px]">
                                            <motion.div
                                                animate={{
                                                    scale: path4 === 'N' || revealed.has('path4_N') ? 1 : [1, 1.15, 1],
                                                    opacity: path4 === 'N' || revealed.has('path4_N') ? 0.5 : 1
                                                }}
                                                transition={{
                                                    scale: { duration: path4 === 'N' || revealed.has('path4_N') ? 0.5 : 3, repeat: path4 === 'N' || revealed.has('path4_N') ? 0 : Infinity, ease: "easeInOut" },
                                                    opacity: { duration: 0.5 }
                                                }}
                                                onPointerDownCapture={(e) => e.stopPropagation()}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    focusOnNode(8, 9, setPath4, 'N', 'path4', { path3: 'N' });
                                                }}
                                                className="relative z-50 flex-shrink-0 cursor-pointer pointer-events-auto"
                                            >
                                                <motion.div
                                                    initial={{ scale: 0, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.9 }}
                                                    className="relative w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center text-sm md:text-base font-bold shadow-md hover:shadow-lg" style={{ backgroundColor: '#FF7474', color: '#0D1216' }}
                                                >
                                                    N
                                                </motion.div>
                                            </motion.div>
                                        </div>
                                    </div>
                                </React.Fragment>
                            ) : null}

                            {/* --- CURVED CONNECTOR: Diamond 4 Y-Branch to Download App --- */}
                            {(step >= 8 && path4 === 'Y') || revealed.has('path4_Y') ? (
                                <motion.div
                                    key="connector-d4"
                                    className="absolute left-1/2 z-10 overflow-visible"
                                    style={{ top: "2206px" }}
                                    initial={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {/* Desktop Connector S-Curve */}
                                    <motion.svg width="417" height="288" viewBox="0 0 417 288" fill="none" className="stroke-brand-dark overflow-visible hidden md:block">
                                        <motion.path
                                            d="M 417 0 C 417 140, 0 172, 0 288"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ duration: 0.7, ease: "easeInOut" }}
                                        />
                                    </motion.svg>

                                    {/* Mobile Connector S-Curve (Math mirrored for mobile ratio) */}
                                    <motion.svg width="377" height="288" viewBox="0 0 377 288" fill="none" className="stroke-brand-dark overflow-visible block md:hidden">
                                        <motion.path
                                            d="M 377 0 C 377 140, 0 172, 0 288"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ duration: 0.7, ease: "easeInOut" }}
                                        />
                                    </motion.svg>
                                </motion.div>
                            ) : null}

                            {/* Node: Download & Open App (Triggered by Diamond 3 'Y', Diamond 4 'Y', OR Diamond 6 'Y') */}
                            {(step >= 8 && (path3 === 'Y' || path4 === 'Y' || path6 === 'Y')) || revealed.has('path3_Y') || revealed.has('path4_Y') || revealed.has('path6_Y') ? (
                                <div key="node-download-app" className="absolute top-[2514px] left-1/2 -translate-x-1/2 z-20">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.5 }}
                                        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.7 }}
                                    >
                                        <motion.div
                                            animate={{
                                                scale: (activeStep >= 8 && activeStep <= 12 ? [1, 1.05, 1] : 0.95),
                                                opacity: (activeStep >= 8 && activeStep <= 12) ? 1 : 0.5
                                            }}
                                            transition={{
                                                scale: {
                                                    duration: (activeStep >= 8 && activeStep <= 12) ? 3 : 0.5,
                                                    repeat: (activeStep >= 8 && activeStep <= 12) ? Infinity : 0,
                                                    ease: "easeInOut"
                                                }
                                            }}
                                            onPointerDownCapture={(e) => e.stopPropagation()}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                focusOnNode(activeStep, 13);
                                            }}
                                            className="w-56 md:w-72 h-12 bg-[#56C6FF] text-brand-ink flex flex-col items-center justify-center px-4 text-center text-xs md:text-sm font-bold uppercase tracking-widest rounded-theme-sm shadow-md border border-brand-dark/10 cursor-pointer hover:shadow-lg transition-shadow"
                                        >
                                            DOWNLOAD & OPEN APP
                                        </motion.div>
                                    </motion.div>
                                </div>
                            ) : null}

                            {/* Step 9 Elements (Decision 5 - Smart TV?) */}
                            {(step >= 9 && path4 === 'N') || revealed.has('path4_N') ? (
                                <>
                                    {/* Horizontal Connector attached to right of N button */}
                                    <div className="absolute top-[2029px] left-1/2 -translate-y-1/2 flex items-center z-10 ml-[544px] md:ml-[584px]">
                                        <motion.div
                                            className="h-[2.5px] w-[90px] md:w-[130px] flex-shrink-0 rounded-full"
                                            style={{ backgroundColor: '#0D1216', transformOrigin: "left center" }}
                                            initial={{ scaleX: 0, opacity: 0 }}
                                            animate={{ scaleX: 1, opacity: 1 }}
                                            transition={{ duration: 0.7, ease: "easeOut" }}
                                        />
                                    </div>

                                    {/* --- REUSABLE DECISION NODE GROUP 5 --- */}
                                    <div className="absolute top-[2029px] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-[200px] h-[200px] md:w-[220px] md:h-[220px] ml-[754px] md:ml-[834px]">
                                        <div className="absolute inset-0">
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.5 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.5 }}
                                                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.7 }}
                                                className="relative w-full h-full flex items-center justify-center cursor-pointer"
                                                onClick={(e) => { e.stopPropagation(); focusOnNode(9, 9); }}
                                                onPointerDownCapture={(e) => e.stopPropagation()}
                                            >
                                                {/* Diamond Background */}
                                                <div className="absolute inset-0 m-auto w-[141px] h-[141px] md:w-[155px] md:h-[155px] rotate-45 rounded-xl shadow-xl" style={{ backgroundColor: '#FFDE21' }} />

                                                {/* Text Content */}
                                                <div className="relative z-10 w-full text-center px-4">
                                                    <span className="text-[12px] md:text-sm font-bold leading-snug block" style={{ color: '#0D1216' }}>Do you have<br />a smart TV?</span>
                                                </div>
                                            </motion.div>
                                        </div>

                                        {/* Yes Button */}
                                        <motion.div
                                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 -ml-[22px] mt-[113px] pointer-events-auto"
                                            animate={{
                                                scale: path5 === 'Y' || revealed.has('path5_Y') ? 1 : [1, 1.15, 1],
                                                opacity: path5 === 'Y' || revealed.has('path5_Y') ? 0.5 : 1
                                            }}
                                            transition={{
                                                scale: { duration: path5 === 'Y' || revealed.has('path5_Y') ? 0.5 : 3, repeat: path5 === 'Y' || revealed.has('path5_Y') ? 0 : Infinity, ease: "easeInOut" },
                                                opacity: { duration: 0.5 }
                                            }}
                                            onPointerDownCapture={(e) => e.stopPropagation()}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                focusOnNode(9, 10, setPath5, 'Y', 'path5', { path4: 'N' });
                                            }}
                                        >
                                            <motion.div
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{ scale: path5 === 'Y' || revealed.has('path5_Y') ? 1 : [1, 1.15, 1], opacity: path5 === 'Y' || revealed.has('path5_Y') ? 0.5 : 1 }}
                                                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.7 }}
                                                className="relative w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center text-sm md:text-base font-bold shadow-md cursor-pointer hover:shadow-lg" style={{ backgroundColor: '#00B782', color: '#0D1216' }}
                                            >
                                                Y
                                            </motion.div>
                                        </motion.div>

                                        {/* No Button */}
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex items-center pointer-events-auto ml-[135px]">
                                            <motion.div
                                                animate={{
                                                    scale: path5 === 'N' || revealed.has('path5_N') ? 1 : [1, 1.15, 1],
                                                    opacity: path5 === 'N' || revealed.has('path5_N') ? 0.5 : 1
                                                }}
                                                transition={{
                                                    scale: { duration: path5 === 'N' || revealed.has('path5_N') ? 0.5 : 3, repeat: path5 === 'N' || revealed.has('path5_N') ? 0 : Infinity, ease: "easeInOut" },
                                                    opacity: { duration: 0.5 }
                                                }}
                                                onPointerDownCapture={(e) => e.stopPropagation()}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    focusOnNode(9, 10, setPath5, 'N', 'path5', { path4: 'N' });
                                                }}
                                                className="relative z-50 flex-shrink-0 cursor-pointer pointer-events-auto"
                                            >
                                                <motion.div
                                                    initial={{ scale: 0, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.9 }}
                                                    className="relative w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center text-sm md:text-base font-bold shadow-md hover:shadow-lg" style={{ backgroundColor: '#FF7474', color: '#0D1216' }}
                                                >
                                                    N
                                                </motion.div>
                                            </motion.div>

                                            {/* Fail Branch Container */}
                                            {(path5 === 'N' || revealed.has('path5_N')) && (
                                                <div className="absolute left-full top-1/2 -translate-y-1/2 flex items-center gap-[10px] ml-[10px]">
                                                    <motion.div
                                                        className="h-[2.5px] w-12 md:w-20 flex-shrink-0 z-10 rounded-full"
                                                        style={{ backgroundColor: '#0D1216', transformOrigin: "left center" }}
                                                        initial={{ scaleX: 0, opacity: 0 }}
                                                        animate={{ scaleX: 1, opacity: 1 }}
                                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                                    />
                                                    <motion.div
                                                        className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 flex items-center justify-center p-2 text-center rounded-full shadow-lg border border-transparent cursor-default z-20"
                                                        style={{ backgroundColor: '#FF7474', color: '#0D1216' }}
                                                        initial={{ scale: 0.5, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.25 }}
                                                    >
                                                        <span className="relative z-10 block text-sm md:text-base font-bold tracking-widest uppercase">FAIL</span>
                                                    </motion.div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            ) : null}

                            {/* Step 10 Elements (Decision 6 - Dongle?) */}
                            {(step >= 10 && path5 === 'Y') || revealed.has('path5_Y') ? (
                                <>
                                    {/* Animated Arrow Connector (Vertical) */}
                                    <motion.div
                                        className="absolute left-1/2 -translate-x-1/2 top-[2206px] z-10 w-[40px] h-[268px] flex flex-col items-center justify-center ml-[754px] md:ml-[834px]"
                                        initial={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <motion.svg width="40" height="268" viewBox="0 0 40 268" fill="none" className="stroke-brand-dark overflow-visible">
                                            <motion.line x1="20" y1="0" x2="20" y2="268" strokeWidth="2.5" strokeLinecap="round"
                                                initial={{ pathLength: 0 }}
                                                animate={{ pathLength: 1 }}
                                                transition={{ duration: 0.7, ease: "easeInOut" }}
                                            />
                                        </motion.svg>
                                    </motion.div>

                                    {/* --- REUSABLE DECISION NODE GROUP 6 --- */}
                                    <div className="absolute top-[2594px] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-[200px] h-[200px] md:w-[220px] md:h-[220px] ml-[754px] md:ml-[834px]">
                                        <div className="absolute inset-0">
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.5 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.5 }}
                                                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.7 }}
                                                className="relative w-full h-full flex items-center justify-center cursor-pointer"
                                                onClick={(e) => { e.stopPropagation(); focusOnNode(10, 10); }}
                                                onPointerDownCapture={(e) => e.stopPropagation()}
                                            >
                                                {/* Diamond Background */}
                                                <div className="absolute inset-0 m-auto w-[141px] h-[141px] md:w-[155px] md:h-[155px] rotate-45 rounded-xl shadow-xl" style={{ backgroundColor: '#FFDE21' }} />

                                                {/* Text Content */}
                                                <div className="relative z-10 w-full text-center px-4">
                                                    <span className="text-[12px] md:text-sm font-bold leading-snug block" style={{ color: '#0D1216' }}>Do you have<br />a dongle?</span>
                                                </div>
                                            </motion.div>
                                        </div>

                                        {/* Yes Button */}
                                        <motion.div
                                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 -ml-[22px] mt-[113px] pointer-events-auto"
                                            animate={{
                                                scale: path6 === 'Y' || revealed.has('path6_Y') ? 1 : [1, 1.15, 1],
                                                opacity: path6 === 'Y' || revealed.has('path6_Y') ? 0.5 : 1
                                            }}
                                            transition={{
                                                scale: { duration: path6 === 'Y' || revealed.has('path6_Y') ? 0.5 : 3, repeat: path6 === 'Y' || revealed.has('path6_Y') ? 0 : Infinity, ease: "easeInOut" },
                                                opacity: { duration: 0.5 }
                                            }}
                                            onPointerDownCapture={(e) => e.stopPropagation()}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                focusOnNode(10, 11, setPath6, 'Y', 'path6', { path5: 'Y' });
                                            }}
                                        >
                                            <motion.div
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{ scale: path6 === 'Y' || revealed.has('path6_Y') ? 1 : [1, 1.15, 1], opacity: path6 === 'Y' || revealed.has('path6_Y') ? 0.5 : 1 }}
                                                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.7 }}
                                                className="relative w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center text-sm md:text-base font-bold shadow-md cursor-pointer hover:shadow-lg" style={{ backgroundColor: '#00B782', color: '#0D1216' }}
                                            >
                                                Y
                                            </motion.div>
                                        </motion.div>

                                        {/* No Button */}
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex items-center pointer-events-auto ml-[135px]">
                                            <motion.div
                                                animate={{
                                                    scale: path6 === 'N' || revealed.has('path6_N') ? 1 : [1, 1.15, 1],
                                                    opacity: path6 === 'N' || revealed.has('path6_N') ? 0.5 : 1
                                                }}
                                                transition={{
                                                    scale: { duration: path6 === 'N' || revealed.has('path6_N') ? 0.5 : 3, repeat: path6 === 'N' || revealed.has('path6_N') ? 0 : Infinity, ease: "easeInOut" },
                                                    opacity: { duration: 0.5 }
                                                }}
                                                onPointerDownCapture={(e) => e.stopPropagation()}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    focusOnNode(10, 11, setPath6, 'N', 'path6', { path5: 'Y' });
                                                }}
                                                className="relative z-50 flex-shrink-0 cursor-pointer pointer-events-auto"
                                            >
                                                <motion.div
                                                    initial={{ scale: 0, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    transition={{ duration: 0.4, delay: 0.9, ease: "easeOut" }}
                                                    className="relative w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center text-sm md:text-base font-bold shadow-md hover:shadow-lg" style={{ backgroundColor: '#FF7474', color: '#0D1216' }}
                                                >
                                                    N
                                                </motion.div>
                                            </motion.div>

                                            {/* Fail Branch Container */}
                                            {(path6 === 'N' || revealed.has('path6_N')) && (
                                                <div className="absolute left-full top-1/2 -translate-y-1/2 flex items-center gap-[10px] ml-[10px]">
                                                    <motion.div
                                                        className="h-[2.5px] w-12 md:w-20 flex-shrink-0 z-10 rounded-full"
                                                        style={{ backgroundColor: '#0D1216', transformOrigin: "left center" }}
                                                        initial={{ scaleX: 0, opacity: 0 }}
                                                        animate={{ scaleX: 1, opacity: 1 }}
                                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                                    />
                                                    <motion.div
                                                        className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 flex items-center justify-center p-2 text-center rounded-full shadow-lg border border-transparent cursor-default z-20"
                                                        style={{ backgroundColor: '#FF7474', color: '#0D1216' }}
                                                        initial={{ scale: 0.5, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                        transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
                                                    >
                                                        <span className="relative z-10 block text-sm md:text-base font-bold tracking-widest uppercase">FAIL</span>
                                                    </motion.div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            ) : null}

                            {/* --- CURVED CONNECTOR: Diamond 6 Y-Branch to Download App --- */}
                            {(step >= 10 && path6 === 'Y') || revealed.has('path6_Y') ? (
                                <motion.div
                                    className="absolute left-1/2 z-10 hidden md:flex items-center"
                                    style={{ top: '2494px', marginLeft: '0px' }}
                                    initial={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <motion.svg width="792" height="213" viewBox="0 0 792 213" fill="none" className="stroke-brand-dark overflow-visible relative">
                                        <motion.path
                                            d="M 792 213 C 730 213, 0 -130, 0 0"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ duration: 0.7, ease: "easeInOut" }}
                                        />
                                    </motion.svg>
                                </motion.div>
                            ) : null}



                            {/* --- STEP 13: ACTION NODE ('Add Display') --- */}
                            {step >= 13 && (
                                <>
                                    {/* Action Node Vertical Line (460px length to leave 20px padding at top and bottom) */}
                                    <motion.div
                                        className="absolute left-1/2 -translate-x-1/2 top-[2582px] z-10 w-[40px] h-[460px] flex flex-col items-center justify-center pointer-events-none"
                                        initial={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <motion.svg width="40" height="460" viewBox="0 0 40 460" fill="none" className="stroke-brand-dark overflow-visible">
                                            <motion.line x1="20" y1="0" x2="20" y2="460" strokeWidth="2.5" strokeLinecap="round"
                                                initial={{ pathLength: 0 }}
                                                animate={{ pathLength: 1 }}
                                                transition={{ duration: 1.05, ease: "easeInOut" }}
                                            />
                                        </motion.svg>
                                    </motion.div>

                                    {/* App Node -> Add Display Node (Step 13) */}
                                    <div key="node-add-display" className="absolute top-[3062px] left-1/2 -translate-x-1/2 z-20">
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.5 }}
                                            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.7 }}
                                        >
                                            <motion.div
                                                animate={{
                                                    scale: activeStep === 13 ? [1, 1.05, 1] : 0.95,
                                                    opacity: activeStep === 13 ? 1 : 0.5
                                                }}
                                                transition={{
                                                    scale: {
                                                        duration: activeStep === 13 ? 3 : 0.5,
                                                        repeat: activeStep === 13 ? Infinity : 0,
                                                        ease: "easeInOut"
                                                    }
                                                }}
                                                onPointerDownCapture={(e) => e.stopPropagation()}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    focusOnNode(13, 14);
                                                }}
                                                className="w-56 md:w-72 h-12 bg-[#56C6FF] text-brand-ink flex flex-col items-center justify-center px-4 text-center text-xs md:text-sm font-bold uppercase tracking-widest rounded-theme-sm shadow-md border border-brand-dark/10 cursor-pointer hover:shadow-lg transition-shadow"
                                            >
                                                CLICK "ADD DISPLAY"
                                            </motion.div>
                                        </motion.div>
                                    </div>
                                </>
                            )}


                            {/* --- STEP 14: DECISION 7 ('Did you notice the code?') --- */}
                            {step >= 14 && (
                                <>
                                    {/* Action Node Vertical Line (70px length to leave exactly 20px padding at top and bottom) */}
                                    <motion.div
                                        className="absolute left-1/2 -translate-x-1/2 top-[3130px] z-10 w-[40px] h-[70px] flex flex-col items-center justify-center pointer-events-none"
                                        initial={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <motion.svg width="40" height="70" viewBox="0 0 40 70" fill="none" className="stroke-brand-dark overflow-visible">
                                            <motion.line x1="20" y1="0" x2="20" y2="70" strokeWidth="2.5" strokeLinecap="round"
                                                initial={{ pathLength: 0 }}
                                                animate={{ pathLength: 1 }}
                                                transition={{ duration: 0.7, ease: "easeInOut" }}
                                            />
                                        </motion.svg>
                                    </motion.div>

                                    {/* --- REUSABLE DECISION NODE GROUP 7 --- */}
                                    <div className="absolute top-[3330px] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-[200px] h-[200px] md:w-[220px] md:h-[220px]">
                                        <div className="absolute inset-0">
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.5 }}
                                                animate={{ opacity: step > 14 ? 0.5 : 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.5 }}
                                                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.7 }}
                                                className="relative w-full h-full flex items-center justify-center cursor-pointer"
                                                onClick={(e) => { e.stopPropagation(); focusOnNode(14, 14); }}
                                                onPointerDownCapture={(e) => e.stopPropagation()}
                                            >
                                                {/* Diamond Background */}
                                                <div className="absolute inset-0 m-auto w-[141px] h-[141px] md:w-[155px] md:h-[155px] rotate-45 rounded-xl shadow-xl" style={{ backgroundColor: '#FFDE21' }} />

                                                {/* Text Content */}
                                                <div className="relative z-10 w-full text-center px-4">
                                                    <span className="text-[12px] md:text-sm font-bold leading-snug block" style={{ color: '#0D1216' }}>Did you notice<br />the code?</span>
                                                </div>
                                            </motion.div>
                                        </div>

                                        {/* Yes Button */}
                                        <motion.div
                                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 -ml-[22px] mt-[113px] pointer-events-auto"
                                            animate={{
                                                scale: path7 === 'Y' || revealed.has('path7_Y') ? 1 : [1, 1.15, 1],
                                                opacity: path7 === 'Y' || revealed.has('path7_Y') ? 0.5 : 1
                                            }}
                                            transition={{
                                                scale: { duration: path7 === 'Y' || revealed.has('path7_Y') ? 0.5 : 3, repeat: path7 === 'Y' || revealed.has('path7_Y') ? 0 : Infinity, ease: "easeInOut" },
                                                opacity: { duration: 0.5 }
                                            }}
                                            onPointerDownCapture={(e) => e.stopPropagation()}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                focusOnNode(14, 15, setPath7, 'Y', 'path7');
                                            }}
                                        >
                                            <motion.div
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.7 }}
                                                className="relative w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center text-sm md:text-base font-bold shadow-md cursor-pointer hover:shadow-lg" style={{ backgroundColor: '#00B782', color: '#0D1216' }}
                                            >
                                                Y
                                            </motion.div>
                                        </motion.div>

                                        {/* No Button */}
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex items-center pointer-events-auto ml-[135px]">
                                            <motion.div
                                                animate={{
                                                    scale: path7 === 'N' || revealed.has('path7_N') ? 1 : [1, 1.15, 1],
                                                    opacity: path7 === 'N' || revealed.has('path7_N') ? 0.5 : 1
                                                }}
                                                transition={{
                                                    scale: { duration: path7 === 'N' || revealed.has('path7_N') ? 0.5 : 3, repeat: path7 === 'N' || revealed.has('path7_N') ? 0 : Infinity, ease: "easeInOut" },
                                                    opacity: { duration: 0.5 }
                                                }}
                                                onPointerDownCapture={(e) => e.stopPropagation()}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    focusOnNode(14, 15, setPath7, 'N', 'path7');
                                                }}
                                                className="relative z-50 flex-shrink-0 cursor-pointer pointer-events-auto"
                                            >
                                                <motion.div
                                                    initial={{ scale: 0, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.9 }}
                                                    className="relative w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center text-sm md:text-base font-bold shadow-md hover:shadow-lg" style={{ backgroundColor: '#FF7474', color: '#0D1216' }}
                                                >
                                                    N
                                                </motion.div>
                                            </motion.div>

                                            {/* Fail Branch Container */}
                                            {(path7 === 'N' || revealed.has('path7_N')) && (
                                                <div className="absolute left-full top-1/2 -translate-y-1/2 flex items-center gap-[10px] ml-[10px]">
                                                    <motion.div
                                                        className="h-[2.5px] w-12 md:w-20 flex-shrink-0 z-10 rounded-full"
                                                        style={{ backgroundColor: '#0D1216', transformOrigin: "left center" }}
                                                        initial={{ scaleX: 0, opacity: 0 }}
                                                        animate={{ scaleX: 1, opacity: 1 }}
                                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                                    />
                                                    <motion.div
                                                        className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 flex items-center justify-center p-2 text-center rounded-full shadow-lg border border-transparent cursor-default z-20"
                                                        style={{ backgroundColor: '#FF7474', color: '#0D1216' }}
                                                        initial={{ scale: 0.5, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.25 }}
                                                    >
                                                        <span className="relative z-10 block text-sm md:text-base font-bold tracking-widest uppercase">FAIL</span>
                                                    </motion.div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* --- STEP 15: ACTION NODE ('Enter info & code') --- */}
                            {(step >= 15 && path7 === 'Y') || revealed.has('path7_Y') ? (
                                <>
                                    {/* Action Node Vertical Line */}
                                    <motion.div
                                        className="absolute left-1/2 -translate-x-1/2 top-[3507px] z-10 w-[40px] h-[288px] flex flex-col items-center justify-center pointer-events-none"
                                        initial={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <motion.svg width="40" height="288" viewBox="0 0 40 288" fill="none" className="stroke-brand-dark overflow-visible">
                                            <motion.line x1="20" y1="0" x2="20" y2="288" strokeWidth="2.5" strokeLinecap="round"
                                                initial={{ pathLength: 0 }}
                                                animate={{ pathLength: 1 }}
                                                transition={{ duration: 1.05, ease: "easeInOut" }}
                                            />
                                        </motion.svg>
                                    </motion.div>

                                    {/* Node: Enter info & code */}
                                    <div key="node-enter-info" className="absolute top-[3815px] left-1/2 -translate-x-1/2 z-20">
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.5 }}
                                            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.7 }}
                                        >
                                            <motion.div
                                                animate={{
                                                    scale: activeStep === 15 ? [1, 1.05, 1] : 0.95,
                                                    opacity: activeStep === 15 ? 1 : 0.5
                                                }}
                                                transition={{
                                                    scale: { duration: activeStep === 15 ? 3 : 0.5, repeat: activeStep === 15 ? Infinity : 0, ease: "easeInOut" }
                                                }}
                                                onPointerDownCapture={(e) => e.stopPropagation()}
                                                onClick={(e) => { e.stopPropagation(); focusOnNode(15, 16); }}
                                                className="w-48 md:w-64 h-12 bg-[#56C6FF] text-brand-ink flex flex-col items-center justify-center px-4 text-center text-xs md:text-sm font-bold tracking-widest uppercase rounded-theme-sm shadow-md border border-brand-dark/10 cursor-pointer hover:shadow-lg transition-shadow"
                                            >
                                                ENTER INFO & CODE
                                            </motion.div>
                                        </motion.div>
                                    </div>
                                </>
                            ) : null}

                            {/* --- STEP 16: DECISION DIAMOND 8 ('Was the connection successful?') --- */}
                            {step >= 16 && (
                                <>
                                    {/* Animated Arrow Connector (Vertical from Action Node to Diamond 8) */}
                                    <motion.div
                                        className="absolute left-1/2 -translate-x-1/2 top-[3883px] z-10 w-[40px] h-[60px] flex flex-col items-center justify-center"
                                        initial={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <motion.svg width="40" height="60" viewBox="0 0 40 60" fill="none" className="stroke-brand-dark overflow-visible">
                                            <motion.line x1="20" y1="0" x2="20" y2="60" strokeWidth="2.5" strokeLinecap="round"
                                                initial={{ pathLength: 0 }}
                                                animate={{ pathLength: 1 }}
                                                transition={{ duration: 0.7, ease: "easeInOut" }}
                                            />
                                        </motion.svg>
                                    </motion.div>

                                    {/* --- REUSABLE DECISION NODE GROUP 8 --- */}
                                    <div className="absolute top-[4063px] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-[200px] h-[200px] md:w-[220px] md:h-[220px]">
                                        <div className="absolute inset-0">
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.5 }}
                                                animate={{ opacity: step > 16 ? 0.5 : 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.5 }}
                                                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.7 }}
                                                className="relative w-full h-full flex items-center justify-center cursor-pointer"
                                                onClick={(e) => { e.stopPropagation(); focusOnNode(16, 16); }}
                                                onPointerDownCapture={(e) => e.stopPropagation()}
                                            >
                                                {/* Diamond Background Shape (Rotated) */}
                                                <div className="absolute inset-0 m-auto w-[141px] h-[141px] md:w-[155px] md:h-[155px] rotate-45 rounded-xl shadow-xl" style={{ backgroundColor: '#FFDE21' }} />

                                                {/* Text Content */}
                                                <div className="relative z-10 w-full text-center px-4">
                                                    <span className="text-[12px] md:text-sm font-bold leading-snug block" style={{ color: '#0D1216' }}>Was the<br />connection<br />successful?</span>
                                                </div>
                                            </motion.div>
                                        </div>

                                        {/* Yes Button (Diamond 8) */}
                                        <motion.div
                                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 -ml-[22px] mt-[113px] pointer-events-auto"
                                            animate={{
                                                scale: path8 === 'Y' || revealed.has('path8_Y') ? 1 : [1, 1.15, 1],
                                                opacity: path8 === 'Y' || revealed.has('path8_Y') ? 0.5 : 1
                                            }}
                                            transition={{
                                                scale: { duration: path8 === 'Y' || revealed.has('path8_Y') ? 0.5 : 3, repeat: path8 === 'Y' || revealed.has('path8_Y') ? 0 : Infinity, ease: "easeInOut" },
                                                opacity: { duration: 0.5 }
                                            }}
                                            onPointerDownCapture={(e) => e.stopPropagation()}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                focusOnNode(16, 17, setPath8, 'Y', 'path8');
                                            }}
                                        >
                                            <motion.div
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.7 }}
                                                className="relative w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center text-sm md:text-base font-bold shadow-md cursor-pointer hover:shadow-lg" style={{ backgroundColor: '#00B782', color: '#0D1216' }}
                                            >
                                                Y
                                            </motion.div>
                                        </motion.div>

                                        {/* No Button Anchor & Branch (Diamond 8) */}
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex items-center pointer-events-auto ml-[135px]">
                                            {/* The N Node Itself */}
                                            <motion.div
                                                animate={{
                                                    scale: path8 === 'N' || revealed.has('path8_N') ? 1 : [1, 1.15, 1],
                                                    opacity: path8 === 'N' || revealed.has('path8_N') ? 0.5 : 1
                                                }}
                                                transition={{
                                                    scale: { duration: path8 === 'N' || revealed.has('path8_N') ? 0.5 : 3, repeat: path8 === 'N' || revealed.has('path8_N') ? 0 : Infinity, ease: "easeInOut" },
                                                    opacity: { duration: 0.5 }
                                                }}
                                                onPointerDownCapture={(e) => e.stopPropagation()}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    focusOnNode(16, 17, setPath8, 'N', 'path8');
                                                }}
                                                className="relative z-50 flex-shrink-0 cursor-pointer pointer-events-auto"
                                            >
                                                <motion.div
                                                    initial={{ scale: 0, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.9 }}
                                                    className="relative w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center text-sm md:text-base font-bold shadow-md hover:shadow-lg" style={{ backgroundColor: '#FF7474', color: '#0D1216' }}
                                                >
                                                    N
                                                </motion.div>
                                            </motion.div>

                                            {/* Fail Branch Container (Locked right of N Node) */}
                                            {(step >= 16 && path8 === 'N') || revealed.has('path8_N') ? (
                                                <div className="absolute left-full top-1/2 -translate-y-1/2 flex items-center gap-[10px] ml-[10px]">
                                                    <motion.div
                                                        className="h-[2.5px] w-12 md:w-20 flex-shrink-0 z-10 rounded-full"
                                                        style={{ backgroundColor: '#0D1216', transformOrigin: "left center" }}
                                                        initial={{ scaleX: 0, opacity: 0 }}
                                                        animate={{ scaleX: 1, opacity: 1 }}
                                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                                    />
                                                    <motion.div
                                                        className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 flex items-center justify-center p-2 text-center rounded-full shadow-lg border border-transparent cursor-default z-20"
                                                        style={{ backgroundColor: '#FF7474', color: '#0D1216' }}
                                                        initial={{ scale: 0.5, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.25 }}
                                                    >
                                                        <span className="relative z-10 block text-sm md:text-base font-bold tracking-widest uppercase">FAIL</span>
                                                    </motion.div>
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* --- STEP 17: ACTION NODE ('Choose or upload media') --- */}
                            {(step >= 17 && path8 === 'Y') || revealed.has('path8_Y') ? (
                                <>
                                    {/* Action Node Vertical Line */}
                                    <motion.div
                                        className="absolute left-1/2 -translate-x-1/2 top-[4240px] z-10 w-[40px] h-[288px] flex flex-col items-center justify-center pointer-events-none"
                                        initial={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <motion.svg width="40" height="288" viewBox="0 0 40 288" fill="none" className="stroke-brand-dark overflow-visible">
                                            <motion.line x1="20" y1="0" x2="20" y2="288" strokeWidth="2.5" strokeLinecap="round"
                                                initial={{ pathLength: 0 }}
                                                animate={{ pathLength: 1 }}
                                                transition={{ duration: 1.05, ease: "easeInOut" }}
                                            />
                                        </motion.svg>
                                    </motion.div>

                                    {/* Node: Choose Media */}
                                    <div key="node-choose-media" className="absolute top-[4548px] left-1/2 -translate-x-1/2 z-20">
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.5 }}
                                            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.7 }}
                                        >
                                            <motion.div
                                                animate={{
                                                    scale: activeStep === 17 ? [1, 1.05, 1] : 0.95,
                                                    opacity: activeStep === 17 ? 1 : 0.5
                                                }}
                                                transition={{
                                                    scale: { duration: activeStep === 17 ? 3 : 0.5, repeat: activeStep === 17 ? Infinity : 0, ease: "easeInOut" }
                                                }}
                                                onPointerDownCapture={(e) => e.stopPropagation()}
                                                onClick={(e) => { e.stopPropagation(); focusOnNode(17, 18); }}
                                                className="w-48 md:w-64 h-12 bg-[#56C6FF] text-brand-ink flex flex-col items-center justify-center px-4 text-center text-[10px] md:text-sm font-bold tracking-widest uppercase rounded-theme-sm shadow-md border border-brand-dark/10 cursor-pointer hover:shadow-lg transition-shadow"
                                            >
                                                CHOOSE OR UPLOAD MEDIA
                                            </motion.div>
                                        </motion.div>
                                    </div>
                                </>
                            ) : null}

                            {/* --- STEP 18: ACTION NODE ('Go to playlists') --- */}
                            {(step >= 18 && path8 === 'Y') || revealed.has('path8_Y_step18') ? (
                                <>
                                    {/* Action Node Vertical Line */}
                                    <motion.div
                                        className="absolute left-1/2 -translate-x-1/2 top-[4616px] z-10 w-[40px] h-[80px] flex flex-col items-center justify-center pointer-events-none"
                                        initial={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <motion.svg width="40" height="80" viewBox="0 0 40 80" fill="none" className="stroke-brand-dark overflow-visible">
                                            <motion.line x1="20" y1="0" x2="20" y2="80" strokeWidth="2.5" strokeLinecap="round"
                                                initial={{ pathLength: 0 }}
                                                animate={{ pathLength: 1 }}
                                                transition={{ duration: 0.7, ease: "easeInOut" }}
                                            />
                                        </motion.svg>
                                    </motion.div>

                                    {/* Node: Go to Playlists */}
                                    <div key="node-go-playlists" className="absolute top-[4706px] left-1/2 -translate-x-1/2 z-20">
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.5 }}
                                            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.7 }}
                                        >
                                            <motion.div
                                                animate={{
                                                    scale: activeStep === 18 ? [1, 1.05, 1] : 0.95,
                                                    opacity: activeStep === 18 ? 1 : 0.5
                                                }}
                                                transition={{
                                                    scale: { duration: activeStep === 18 ? 3 : 0.5, repeat: activeStep === 18 ? Infinity : 0, ease: "easeInOut" }
                                                }}
                                                onPointerDownCapture={(e) => e.stopPropagation()}
                                                onClick={(e) => { e.stopPropagation(); focusOnNode(18, 19); }}
                                                className="w-48 md:w-64 h-12 bg-[#56C6FF] text-brand-ink flex flex-col items-center justify-center px-4 text-center text-xs md:text-sm font-bold tracking-widest uppercase rounded-theme-sm shadow-md border border-brand-dark/10 cursor-pointer hover:shadow-lg transition-shadow"
                                            >
                                                GO TO PLAYLISTS
                                            </motion.div>
                                        </motion.div>
                                    </div>
                                </>
                            ) : null}

                            {/* --- STEP 19: ACTION NODE ('Click Add') --- */}
                            {(step >= 19 && path8 === 'Y') || revealed.has('path8_Y_step19') ? (
                                <>
                                    {/* Action Node Vertical Line */}
                                    <motion.div
                                        className="absolute left-1/2 -translate-x-1/2 top-[4774px] z-10 w-[40px] h-[80px] flex flex-col items-center justify-center pointer-events-none"
                                        initial={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <motion.svg width="40" height="80" viewBox="0 0 40 80" fill="none" className="stroke-brand-dark overflow-visible">
                                            <motion.line x1="20" y1="0" x2="20" y2="80" strokeWidth="2.5" strokeLinecap="round"
                                                initial={{ pathLength: 0 }}
                                                animate={{ pathLength: 1 }}
                                                transition={{ duration: 0.7, ease: "easeInOut" }}
                                            />
                                        </motion.svg>
                                    </motion.div>

                                    {/* Action Node: Click Add */}
                                    <div key="node-click-add" className="absolute top-[4864px] left-1/2 -translate-x-1/2 z-20">
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.5 }}
                                            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.7 }}
                                        >
                                            <motion.div
                                                animate={{
                                                    scale: activeStep === 19 ? [1, 1.05, 1] : 0.95,
                                                    opacity: activeStep === 19 ? 1 : 0.5
                                                }}
                                                transition={{
                                                    scale: { duration: activeStep === 19 ? 3 : 0.5, repeat: activeStep === 19 ? Infinity : 0, ease: "easeInOut" }
                                                }}
                                                onPointerDownCapture={(e) => e.stopPropagation()}
                                                onClick={(e) => { e.stopPropagation(); focusOnNode(19, 20); }}
                                                className="w-48 md:w-64 h-12 bg-[#56C6FF] text-brand-ink flex flex-col items-center justify-center px-4 text-center text-xs md:text-sm font-bold tracking-widest uppercase rounded-theme-sm shadow-md border border-brand-dark/10 cursor-pointer hover:shadow-lg transition-shadow"
                                            >
                                                CLICK "ADD"
                                            </motion.div>
                                        </motion.div>
                                    </div>
                                </>
                            ) : null}

                            {/* --- STEP 20: ACTION NODE ('Select media') --- */}
                            {(step >= 20 && path8 === 'Y') || revealed.has('path8_Y_step20') ? (
                                <>
                                    {/* Action Node Vertical Line */}
                                    <motion.div
                                        className="absolute left-1/2 -translate-x-1/2 top-[4932px] z-10 w-[40px] h-[80px] flex flex-col items-center justify-center pointer-events-none"
                                        initial={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <motion.svg width="40" height="80" viewBox="0 0 40 80" fill="none" className="stroke-brand-dark overflow-visible">
                                            <motion.line x1="20" y1="0" x2="20" y2="80" strokeWidth="2.5" strokeLinecap="round"
                                                initial={{ pathLength: 0 }}
                                                animate={{ pathLength: 1 }}
                                                transition={{ duration: 0.7, ease: "easeInOut" }}
                                            />
                                        </motion.svg>
                                    </motion.div>

                                    {/* Action Node: Select media */}
                                    <div key="node-select-media" className="absolute top-[5022px] left-1/2 -translate-x-1/2 z-20">
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.5 }}
                                            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.7 }}
                                        >
                                            <motion.div
                                                animate={{
                                                    scale: activeStep === 20 ? [1, 1.05, 1] : 0.95,
                                                    opacity: activeStep === 20 ? 1 : 0.5
                                                }}
                                                transition={{
                                                    scale: { duration: activeStep === 20 ? 3 : 0.5, repeat: activeStep === 20 ? Infinity : 0, ease: "easeInOut" }
                                                }}
                                                onPointerDownCapture={(e) => e.stopPropagation()}
                                                onClick={(e) => { e.stopPropagation(); focusOnNode(20, 21); }}
                                                className="w-48 md:w-64 h-12 bg-[#56C6FF] text-brand-ink flex flex-col items-center justify-center px-4 text-center text-xs md:text-sm font-bold tracking-widest uppercase rounded-theme-sm shadow-md border border-brand-dark/10 cursor-pointer hover:shadow-lg transition-shadow"
                                            >
                                                SELECT MEDIA
                                            </motion.div>
                                        </motion.div>
                                    </div>
                                </>
                            ) : null}

                            {/* --- STEP 21: ACTION NODE ('Select display') --- */}
                            {(step >= 21 && path8 === 'Y') || revealed.has('path8_Y_step21') ? (
                                <>
                                    {/* Action Node Vertical Line */}
                                    <motion.div
                                        className="absolute left-1/2 -translate-x-1/2 top-[5090px] z-10 w-[40px] h-[80px] flex flex-col items-center justify-center pointer-events-none"
                                        initial={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <motion.svg width="40" height="80" viewBox="0 0 40 80" fill="none" className="stroke-brand-dark overflow-visible">
                                            <motion.line x1="20" y1="0" x2="20" y2="80" strokeWidth="2.5" strokeLinecap="round"
                                                initial={{ pathLength: 0 }}
                                                animate={{ pathLength: 1 }}
                                                transition={{ duration: 0.7, ease: "easeInOut" }}
                                            />
                                        </motion.svg>
                                    </motion.div>

                                    {/* Action Node: Select display */}
                                    <div key="node-select-display" className="absolute top-[5180px] left-1/2 -translate-x-1/2 z-20">
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.5 }}
                                            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.7 }}
                                        >
                                            <motion.div
                                                animate={{
                                                    scale: activeStep === 21 ? [1, 1.05, 1] : 0.95,
                                                    opacity: activeStep === 21 ? 1 : 0.5
                                                }}
                                                transition={{
                                                    scale: { duration: activeStep === 21 ? 3 : 0.5, repeat: activeStep === 21 ? Infinity : 0, ease: "easeInOut" }
                                                }}
                                                onPointerDownCapture={(e) => e.stopPropagation()}
                                                onClick={(e) => { e.stopPropagation(); focusOnNode(21, 22); }}
                                                className="w-48 md:w-64 h-12 bg-[#56C6FF] text-brand-ink flex flex-col items-center justify-center px-4 text-center text-xs md:text-sm font-bold tracking-widest uppercase rounded-theme-sm shadow-md border border-brand-dark/10 cursor-pointer hover:shadow-lg transition-shadow"
                                            >
                                                SELECT DISPLAY
                                            </motion.div>
                                        </motion.div>
                                    </div>
                                </>
                            ) : null}

                            {/* --- STEP 22: TERMINAL NODE ('SUCCESS!') --- */}
                            {(step >= 22 && path8 === 'Y') || revealed.has('path8_Y_step22') ? (
                                <>
                                    {/* Action Node Vertical Line */}
                                    <motion.div
                                        className="absolute left-1/2 -translate-x-1/2 top-[5248px] z-10 w-[40px] h-[80px] flex flex-col items-center justify-center pointer-events-none"
                                        initial={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <motion.svg width="40" height="80" viewBox="0 0 40 80" fill="none" className="stroke-brand-dark overflow-visible">
                                            <motion.line x1="20" y1="0" x2="20" y2="80" strokeWidth="2.5" strokeLinecap="round"
                                                initial={{ pathLength: 0 }}
                                                animate={{ pathLength: 1 }}
                                                transition={{ duration: 0.7, ease: "easeInOut" }}
                                            />
                                        </motion.svg>
                                    </motion.div>

                                    {/* Terminal Node: Success */}
                                    <div key="node-success" className="absolute top-[5338px] left-1/2 -translate-x-1/2 z-20">
                                        <motion.div
                                            className="w-32 h-32 md:w-40 md:h-40 flex items-center justify-center p-4 text-center text-[16px] md:text-lg font-bold tracking-widest uppercase rounded-full shadow-lg border border-transparent cursor-pointer hover:shadow-xl transition-shadow"
                                            style={{ backgroundColor: '#61F5B9', color: '#0D1216', willChange: 'transform', backfaceVisibility: 'hidden', WebkitFontSmoothing: 'subpixel-antialiased' }}
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{
                                                scale: activeStep === 22 ? [1, 1.05, 1] : 0.95,
                                                opacity: activeStep === 22 ? 1 : 0.5
                                            }}
                                            exit={{ opacity: 0, scale: 0.5 }}
                                            transition={{
                                                scale: { duration: activeStep === 22 ? 3 : 0.5, repeat: activeStep === 22 ? Infinity : 0, ease: "easeInOut" },
                                                opacity: { duration: 0.5 }
                                            }}
                                            onPointerDownCapture={(e) => e.stopPropagation()}
                                            onClick={(e) => { e.stopPropagation(); focusOnNode(22, 23); }}
                                        >
                                            SUCCESS!
                                        </motion.div>
                                    </div>
                                </>
                            ) : null}

                        </AnimatePresence>
                    </motion.div>
                </div>
            </div >

            {/* --- FULLSCREEN LIGHTBOX OVERLAY --- */}
            <AnimatePresence>
                {isLightboxOpen && (
                    <motion.div
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-dark/70 backdrop-blur-md p-4 md:p-12"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Interactive overlay backdrop clicking closes the lightbox */}
                        <div
                            className="absolute inset-0 cursor-pointer"
                            onClick={() => setIsLightboxOpen(false)}
                        />

                        {/* Close X Button */}
                        <button
                            onClick={() => setIsLightboxOpen(false)}
                            className="absolute top-[110px] right-6 md:right-8 z-[110] p-3 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors backdrop-blur-sm shadow-xl border border-white/10 active:scale-95 flex items-center justify-center"
                            aria-label="Close Lightbox"
                        >
                            <X size={24} color="#FFFFFF" strokeWidth={2.5} />
                        </button>

                        <motion.div
                            className="relative z-[105] w-full max-w-[1400px] h-full flex flex-col items-center justify-center pointer-events-none pt-[140px] md:pt-[120px] pb-4"
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                            <img
                                src="https://res.cloudinary.com/dqabyzuzf/image/upload/v1773589831/Display_Now_As_Is_pkaen8.png"
                                alt="Full Flow Artifact flowchart"
                                className="max-w-full max-h-[calc(100vh-170px)] md:max-h-[calc(100vh-160px)] object-contain rounded-xl shadow-2xl pointer-events-auto"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default InteractiveUserFlow;
