import React, { useState, useRef, useEffect } from 'react';
import { Network, RotateCcw, Image, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGesture } from '@use-gesture/react';
const InteractiveUserFlowToBe = ({ color = '#56C6FF' }) => {
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
  const [path9, setPath9] = useState(null); // VIEW TUTORIAL -> CLICK +
  const [path10, setPath10] = useState(null); // CLICK EXIT -> CLICK +
  const [pathWatchGeneral, setPathWatchGeneral] = useState(null); // Watch General Tutorial -> View Tutorial / Click Exit
  const [pathPlus, setPathPlus] = useState(null); // CLICK + -> VIEW PLAYLIST TUTORIAL?
  const [path11, setPath11] = useState(null); // VIEW PLAYLIST TUTORIAL? -> ...
  const [path12, setPath12] = useState(null); // VIEW PLAYLIST TUTORIAL? (Y) -> VIEW TUTORIAL
  const [path13, setPath13] = useState(null); // VIEW PLAYLIST TUTORIAL? (N) -> CLICK "EXIT"
  const [path14, setPath14] = useState(null); // VIEW TUTORIAL (Playlist) -> CLICK +
  const [path15, setPath15] = useState(null); // CLICK EXIT (Playlist) -> CLICK +
  const [path16, setPath16] = useState(null); // CLICK + (Playlist) -> CHOOSE MEDIA
  const [path17, setPath17] = useState(null); // CHOOSE MEDIA -> SAVE CONTENT?
  const [path18, setPath18] = useState(null); // SAVE CONTENT? (Y) -> CLICK SAVE
  const [path19, setPath19] = useState(null); // SAVE CONTENT? (N) -> CLICK "EXIT"
  const [path20, setPath20] = useState(null); // CLICK SAVE -> ...
  const [path21, setPath21] = useState(null); // CLICK "EXIT" -> ...
  const [path22, setPath22] = useState(null); // HIT "PREVIEW" -> ...

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
  const getCameraY = (currentStep, paths) => {
    const { path, path2, path3, path4, path5, path6, path7, path8, path9, path10, path11, path12, path13, path14, path15, path16, path17, path18, path19, path20, path21, path22, pathWatchGeneral, pathPlus } = paths;
    // Enforce strict top-down step matching so deeper cached paths don't hijack the camera 
    // when the user is explicitly interacting with a higher node.
    
    // Step 14/15 camera logic (Terminal Node SUCCESS via Hit Preview)
    if ((currentStep >= 14) && path22 === 'Y') return -3741; // SUCCESS! Node target: 3957 top + 84 radius - 300 = 3741

    if (currentStep >= 22 && path8 === 'Y') return -5118; // Terminal Node: Success (5338 + 80 - 300)
    if (currentStep === 21 && path8 === 'Y') return -4904; // Action Node: Select Display (5180 + 24 - 300)
    if (currentStep === 20 && path8 === 'Y') return -4746; // Action Node: Select Media (5022 + 24 - 300)
    if (currentStep === 19 && path8 === 'Y') return -4588; // Action Node: Click Add (4864 + 24 - 300)
    if (currentStep === 18 && path8 === 'Y') return -4430; // Action Node: Go to playlists (4706 + 24 - 300)
    if (currentStep === 17 && path8 === 'Y') return -4272; // Action Node: Choose Media offset (4548 + 24 - 300)
    if (currentStep >= 17 && path8 === 'N') return -3763; // Diamond 8 FAIL centered
    if (currentStep === 16) return -3763; // Diamond 8 centered (Target 4063 => offset -3763)
    if (currentStep === 15 && path7 === 'Y') return -3515; // "Enter info & code" (Target 3815 => offset -3515)
    if (currentStep === 14) return -3030; // Diamond 7 centered (Target 3330 => offset -3030)
    
    // Step 13/14 camera logic (Hit Preview from Hit Save)
    if ((currentStep === 13 || currentStep === 14) && path20 === 'Y') return -3513;

    // Step 13 camera logic (Click Save via Click Exit merger)
    if (currentStep === 13 && path21 === 'Y') return -3365;

    // Step 12 camera logic (Click Save / Click Exit nodes from Save Content branches)
    if (currentStep === 12 && path18 === 'Y') return -3365; // CLICK SAVE Action Node target: 3641 top + 24 half-height - 300 = 3365
    if (currentStep === 12 && path18 === 'N') return -2856; // CLICK EXIT Action Node stays horizontal with Diamond 11 center = 2856

    // Step 11 camera logic (Save Content? Decision Node)
    if (currentStep === 11 && path18 === 'Y') return -3365; // CLICK SAVE
    if (currentStep === 11 && path18 === 'N') return -2856; // CLICK EXIT horizontal
    if (currentStep === 11) return -2856; // SAVE CONTENT target: 3056 center + 100 diamond height radius - 300 = 2856

    // Step 10 camera logic (Choose Media Action Node from Playlist Tutorial branches)
    if (currentStep === 10 && path16 === 'Y') return -2632; // CHOOSE MEDIA Action Node target: 2908 + 24 half-height - 300 = 2632
    if (currentStep === 10 && path5 === 'Y') return -2294;
    if (currentStep === 10 && path5 === 'N') return -1729;
    if (currentStep === 10) return -2300;
    if (currentStep === 9 && path4 === 'N') return -1729;
    if (currentStep === 9 && path4 === 'Y') return -2238;
    if (currentStep >= 13 && currentStep < 14) return -2762; // Click "Add Display" (Target 3062 => offset -2762)
    if (currentStep === 12) return -2238; // Download App node absolute center
    if (currentStep === 11 && path6 === 'N') return -2294;
    if (currentStep === 11 && path6 === 'Y') return -2238;
    if (currentStep === 8 && path3 === 'N') return -1729;
    if (currentStep === 8 && path3 === 'Y') return -2238;
    
    // Step 9 camera logic (Click + Action Node from Playlist Tutorial branches)
    if (currentStep === 9 && path15 === 'Y') return -2484; // CLICK + Action Node (via Click Exit)
    if (currentStep === 9 && (path11 === 'Y' || path12 === 'Y')) return -2484; // CLICK + Action Node (via View Tutorial)
    if (currentStep === 9 && (path11 === 'N' || path13 === 'Y')) return -1828; // CLICK EXIT centered

    // Step 8 camera logic (View Playlist Tutorial Y/N branches)
    if (currentStep === 8 && path11 === 'Y') return -2337; // VIEW TUTORIAL Action Node target: 2613 top + 24 half-height - 300 = 2337
    if (currentStep === 8 && path11 === 'N') return -1900; // N-Branch Action Node keeps Diamond 3 centered

    // Step 7 camera logic (View Playlist Tutorial Decision)
    if (currentStep === 7 && path11 === 'Y') return -2337; // VIEW TUTORIAL action node
    if (currentStep === 7 && path11 === 'N') return -1900; // Diamond 3 centered with action node
    if (currentStep === 7) return -1900; // Centers firmly on the Diamond

    // Step 6 camera logic
    if (currentStep === 6 && path10 === 'Y') return -1504; // CLICK + Action Node (via Click Exit)
    if (currentStep === 6 && path2 === 'Y') return -1505;
    if (currentStep === 6 && path2 === 'N') return -996;
    if (currentStep === 6 && (path === 'Y' || pathWatchGeneral === 'Y')) return -1504; // CLICK + Action Node
    if (currentStep === 6 && (path === 'N' || pathWatchGeneral === 'N')) return -848; // CLICK EXIT
    
    // Step 5 camera logic
    if (currentStep === 5 && (path === 'Y' || pathWatchGeneral === 'Y')) return -1357; // VIEW TUTORIAL Action Node target: 1633 top + 24 half-height - 300 = 1357
    if (currentStep === 5 && (path === 'N' || pathWatchGeneral === 'N')) return -848;
    
    // Step 4 camera logic
    if (currentStep === 4 && (path === 'Y' || pathWatchGeneral === 'Y')) return -1357; // VIEW TUTORIAL
    if (currentStep === 4 && (path === 'N' || pathWatchGeneral === 'N')) return -848; // N-Branch Action Node array keeps Diamond 2 centered
    if (currentStep === 4) return -848; // Diamond 2 target: 1148 center. 1148 - 300 = 848
    if (currentStep === 3) return -387; // Sign Up Target 663 + (1/2 * 48) = 687. 687 - 300 = offset 387.
    if (currentStep === 1) return -39;
    if (currentStep === 0) return 165;
    if (currentStep === 2) return -189; // Wide Action Node replacing Diamond 1
    return -263;
  };
  
  const currentPaths = { path, path2, path3, path4, path5, path6, path7, path8, path9, path10, path11, path12, path13, path14, path15, path16, path17, path18, path19, path20, path21, path22, pathWatchGeneral, pathPlus };
  const cameraY = getCameraY(activeStep, currentPaths);

  const getCameraX = (currentStep, paths) => {
    const { path, path2, path3, path4, path5, path6, path7, path8, path9, path10, path11, path12, path13, path14, path15, path16, path17, path18, path19, path20, path21, path22, pathWatchGeneral, pathPlus } = paths;
    // Enforce strict top-down step matching for X axis as well
    if ((currentStep >= 14) && path22 === 'Y') return 0; // SUCCESS! centered
    if ((currentStep === 13 || currentStep === 14) && path20 === 'Y') return 0; // Hit Preview centered
    if (currentStep === 13 && path21 === 'Y') return 0; // Click Save centered via Click Exit merger
    if (currentStep === 12 && path18 === 'N') return -140; // Click Exit horizontal offset
    if (currentStep === 12 && path18 === 'Y') return 0; // Click Save centered
    if (currentStep === 11 && path18 === 'N') return -140; // Save Content N branch view horizontal offset
    if (currentStep === 11) return 0; // Save Content centered
    if (currentStep === 10 && path16 === 'Y') return 0; // Choose Media centered
    if (currentStep >= 17 && path8 === 'N') return -140;
    if (currentStep >= 15 && path7 === 'N') return -140;
    if (currentStep === 10 && path5 === 'Y') return -834;
    if (currentStep === 10 && path5 === 'N') return -974;
    if (currentStep === 9 && path4 === 'N') return -834;
    if (currentStep === 9 && path4 === 'Y') return 0;
    if (currentStep === 9 && path15 === 'Y') return 0; // Click + centered
    if (currentStep === 9 && path11 === 'N') return -140; // N-branch Click Exit shifts right
    if (currentStep === 9 && path11 === 'Y') return 22; // Centered View Tutorial before animating down
    if (currentStep === 11 && path6 === 'N') return -974;
    if (currentStep === 11 && path6 === 'Y') return 0;
    if (currentStep === 8 && path3 === 'N') return -417; // Centers Diamond 4 (x=+417 offset)
    if (currentStep === 8 && path3 === 'Y') return 0;
    if (currentStep === 8 && path11 === 'Y') return 22; // Centered View Tutorial
    if (currentStep === 7 && path11 === 'Y') return 22;
    if (currentStep === 7) return 0; // Diamond 3
    if (currentStep === 6 && path2 === 'N') return -140; // N-branch on Diamond 2 shifts right
    if (currentStep === 3 && (path === 'N' || pathWatchGeneral === 'N')) return -140; // N-branch on Diamond 1 shifts right
    if (currentStep === 4 && (path === 'Y' || pathWatchGeneral === 'Y')) return 22;
    return 0; // Center
  };
  const cameraX = getCameraX(activeStep, currentPaths);

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
      if (contextOverrides.fastUpdate) {
        updaterFunction(pathValue);
        if (pathId) {
          setRevealed(prev => new Set(prev).add(`${pathId}_${pathValue}`));
        }
      } else {
        updaterFunction(pathValue);
        // Delay cache state by 50ms so SVGs can mount with an initial pathLength of 0 without auto-completing to 1
        setTimeout(() => {
          if (pathId) {
            setRevealed(prev => new Set(prev).add(`${pathId}_${pathValue}`));
          }
        }, 50);
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
        y: getCameraY(originStep, { ...currentPaths, ...contextOverrides }),
        x: getCameraX(originStep, { ...currentPaths, ...contextOverrides })
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
          style={{ backgroundImage: "radial-gradient(circle, #141D26 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

        {/* Dark Blue Header Block */}
        <div className="relative z-20 flex flex-col px-6 md:px-8 pt-6 pb-8" style={{ backgroundColor: '#1b262f' }}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center shrink-0 w-12 h-12 rounded-full shadow-sm border border-transparent text-[#141F28]" style={{ backgroundColor: color }}>
                <Network size={22} className="[&_rect]:fill-current" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">To-Be Flow</h1>
                <p className="text-sm font-medium text-white/70 mt-0.5">Display Now</p>
              </div>
            </div>

            {/* Flowchart Statistics */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm md:justify-end">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#56C6FF]" />
                <span className="font-medium text-white/90">10 action steps</span>
              </div>
              <div className="hidden md:block w-px h-4 bg-white/20" />
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#A88EFF]" />
                <span className="font-medium text-white/90">3 decision points</span>
              </div>
              <div className="hidden md:block w-px h-4 bg-white/20" />
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#FF7374]" />
                <span className="font-medium text-white/90">0 failure endpoints</span>
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
            style={{ transformOrigin: `50% ${-getCameraY(activeStep, currentPaths) + 300}px` }}
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
                        HIT "ENTER SITE"
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

                  {/* --- NEW ACTION NODE REPLACING DECISION --- */}
                  <div className="absolute top-[463px] left-1/2 -translate-x-1/2 z-20">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.7 }}
                    >
                      <motion.div
                        animate={{
                          scale: activeStep === 2 ? [1, 1.05, 1] : 0.95,
                          opacity: activeStep === 2 ? 1 : 0.5
                        }}
                        transition={{
                          scale: { duration: activeStep === 2 ? 3 : 0.5, repeat: activeStep === 2 ? Infinity : 0, ease: "easeInOut" }
                        }}
                        onPointerDownCapture={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          // Move to Sign Up node (Step 3)
                          focusOnNode(2, 3);
                        }}
                        className="w-auto whitespace-nowrap min-w-[260px] md:min-w-[320px] py-3.5 bg-[#56C6FF] text-brand-ink flex flex-col items-center justify-center px-8 md:px-10 text-center text-xs md:text-sm font-bold uppercase tracking-widest leading-snug rounded-theme-sm shadow-md border border-brand-dark/10 cursor-pointer hover:shadow-lg transition-shadow"
                      >
                        HIT "PURCHASE", "SIGN IN" OR "TRY IT FREE"
                      </motion.div>
                    </motion.div>
                  </div>

                </>
              )}

              {/* Step 3 Elements */}
              {step >= 3 && (
                <>
                  {/* Animated Arrow Connector 3 */}
                  {/* Drops from action node 2 (bottom at 463+48=511) down to step 3 */}
                  <motion.div
                    className="absolute left-1/2 -translate-x-1/2 top-[525px] z-10 w-12 h-[126px] flex flex-col items-center"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.svg width="40" height="126" viewBox="0 0 40 126" fill="none" className="stroke-brand-dark overflow-visible">
                      <motion.line x1="20" y1="0" x2="20" y2="126" strokeWidth="2.5" strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.7, ease: "easeInOut" }}
                      />
                    </motion.svg>
                  </motion.div>

                  {/* Node 3: Sign Up */}
                  <div className="absolute top-[663px] left-1/2 -translate-x-1/2 z-20">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.7 }}
                    >
                      <motion.div
                        animate={{
                          scale: activeStep === 3 ? [1, 1.05, 1] : 0.95,
                          opacity: activeStep === 3 ? 1 : 0.5
                        }}
                        transition={{
                          scale: { duration: activeStep === 3 ? 3 : 0.5, repeat: activeStep === 3 ? Infinity : 0, ease: "easeInOut" }
                        }}
                        onPointerDownCapture={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation();
                          focusOnNode(3, 4);
                        }}
                        className="w-40 md:w-56 h-12 bg-[#56C6FF] text-brand-ink flex flex-col items-center justify-center px-4 text-center text-xs md:text-sm font-bold uppercase tracking-widest leading-snug rounded-theme-sm shadow-md border border-brand-dark/10 cursor-pointer hover:shadow-lg transition-shadow"
                      >
                        HIT "SIGN UP"
                      </motion.div>
                    </motion.div>
                  </div>
                </>
              )}

              {/* Step 4 Elements (Decision 2 - Watch Tutorial) */}
              {step >= 4 && (
                <>
                  {/* Animated Arrow Connector 4 (Vertical) */}
                  {/* Drops from Sign Up (bottom at 663+48=711) down to Diamond 2 */}
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
                        transition={{ duration: 1.05, ease: "easeInOut" }}
                      />
                    </motion.svg>
                  </motion.div>

                  {/* --- DECISION NODE 2 (Step 4) --- */}
                  <div className="absolute top-[1148px] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-[200px] h-[200px] md:w-[220px] md:h-[220px]">
                    <div className="absolute inset-0">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: step > 4 ? 0.5 : 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.7 }}
                        className="relative w-full h-full flex items-center justify-center cursor-pointer"
                        onClick={(e) => { e.stopPropagation(); focusOnNode(4, 4); }}
                        onPointerDownCapture={(e) => e.stopPropagation()}
                      >
                        {/* Diamond Background Shape (Rotated) */}
                        <div className="absolute inset-0 m-auto w-[141px] h-[141px] md:w-[155px] md:h-[155px] rotate-45 rounded-xl shadow-xl" style={{ backgroundColor: '#FFDE21' }} />

                        {/* Text Content */}
                        <div className="relative z-10 w-full text-center px-4">
                          <span className="text-[12px] md:text-sm font-bold leading-snug block" style={{ color: '#141D26' }}>Watch general<br />tutorial?</span>
                        </div>
                      </motion.div>
                    </div>

                    {/* Yes Button (Anchored to Diamond center) */}
                    <motion.div
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 -ml-[22px] mt-[113px] pointer-events-auto"
                      animate={{
                        scale: pathWatchGeneral === 'Y' || revealed.has('pathWatchGeneral_Y') ? 1 : [1, 1.15, 1],
                        opacity: pathWatchGeneral === 'Y' || revealed.has('pathWatchGeneral_Y') ? 0.5 : 1
                      }}
                      transition={{
                        scale: { duration: pathWatchGeneral === 'Y' || revealed.has('pathWatchGeneral_Y') ? 0.5 : 3, repeat: pathWatchGeneral === 'Y' || revealed.has('pathWatchGeneral_Y') ? 0 : Infinity, ease: "easeInOut" },
                        opacity: { duration: 0.5 }
                      }}
                      onPointerDownCapture={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        focusOnNode(4, 5, setPathWatchGeneral, 'Y', 'pathWatchGeneral');
                      }}
                    >
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.7 }}
                        className="relative w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center text-sm md:text-base font-bold shadow-md cursor-pointer hover:shadow-lg" style={{ backgroundColor: '#00B782', color: '#141D26' }}
                      >
                        Y
                      </motion.div>
                    </motion.div>

                    {/* No Button Anchor & Sequence Branch */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex items-center pointer-events-auto ml-[135px]">
                      {/* The N Node Itself */}
                      <motion.div
                        animate={{
                          scale: pathWatchGeneral === 'N' || revealed.has('pathWatchGeneral_N') ? 1 : [1, 1.15, 1],
                          opacity: pathWatchGeneral === 'N' || revealed.has('pathWatchGeneral_N') ? 0.5 : 1
                        }}
                        transition={{
                          scale: { duration: pathWatchGeneral === 'N' || revealed.has('pathWatchGeneral_N') ? 0.5 : 3, repeat: pathWatchGeneral === 'N' || revealed.has('pathWatchGeneral_N') ? 0 : Infinity, ease: "easeInOut" },
                          opacity: { duration: 0.5 }
                        }}
                        onPointerDownCapture={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation();
                          focusOnNode(4, 6, setPathWatchGeneral, 'N', 'pathWatchGeneral');
                        }}
                        className="relative z-50 flex-shrink-0 cursor-pointer pointer-events-auto"
                      >
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.9 }}
                          className="relative w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center text-sm md:text-base font-bold shadow-md hover:shadow-lg" style={{ backgroundColor: '#FF7474', color: '#141D26' }}
                        >
                          N
                        </motion.div>
                      </motion.div>

                      {/* Side Branch: -> "Click Exit" */}
                      {pathWatchGeneral === 'N' || revealed.has('pathWatchGeneral_N') ? (
                        <div className="absolute left-full top-1/2 -translate-y-1/2 flex items-center gap-[10px] ml-[10px]">
                          <motion.div
                            className="h-[2.5px] w-8 md:w-12 flex-shrink-0 z-10 rounded-full"
                            style={{ backgroundColor: '#141D26', transformOrigin: "left center" }}
                            initial={{ scaleX: 0, opacity: 0 }}
                            animate={{ scaleX: 1, opacity: 1 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                          />
                          <motion.div
                            className="w-32 md:w-40 h-10 flex-shrink-0 flex items-center justify-center px-3 text-center rounded-theme-sm shadow-md border border-brand-dark/10 cursor-pointer z-20 hover:shadow-lg transition-shadow"
                            style={{ backgroundColor: '#56C6FF', color: '#141D26' }}
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{
                              scale: activeStep === 6 && pathWatchGeneral === 'N' && !path10 && !revealed.has('path10_Y') ? [1, 1.05, 1] : 0.95,
                              opacity: activeStep === 6 && pathWatchGeneral === 'N' && !path10 && !revealed.has('path10_Y') ? 1 : 0.5
                            }}
                            transition={{
                              scale: { duration: activeStep === 6 && path === 'N' && !path10 && !revealed.has('path10_Y') ? 3 : 0.5, repeat: activeStep === 6 && path === 'N' && !path10 && !revealed.has('path10_Y') ? Infinity : 0, ease: "easeInOut" },
                              opacity: { duration: 0.5 }
                            }}
                            onClick={(e) => { e.stopPropagation(); focusOnNode(6, 6, setPath10, 'Y', 'path10'); }}
                          >
                            <span className="relative z-10 block text-xs md:text-sm font-bold tracking-widest uppercase">CLICK "EXIT"</span>
                          </motion.div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </>
              )}

              {/* Step 5 Elements (Y Branch Action Node) */}
              {(step >= 5 && pathWatchGeneral === 'Y') || revealed.has('pathWatchGeneral_Y') ? (
                <>
                  {/* Vertical Connector drops from Y button (center ~1261px) down to action node */}
                  <motion.div
                    className="absolute left-1/2 -translate-x-1/2 top-[1325px] z-10 w-[40px] h-[288px] flex flex-col items-center justify-center"
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

                  {/* Node 5: View Tutorial */}
                  <div className="absolute top-[1633px] left-1/2 -translate-x-1/2 z-20">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.7 }}
                    >
                      <motion.div
                        animate={{
                          scale: activeStep === 5 ? [1, 1.05, 1] : 0.95,
                          opacity: activeStep === 5 ? 1 : 0.5
                        }}
                        transition={{
                          scale: { duration: activeStep === 5 ? 3 : 0.5, repeat: activeStep === 5 ? Infinity : 0, ease: "easeInOut" }
                        }}
                        onPointerDownCapture={(e) => e.stopPropagation()}
                        onClick={(e) => { e.stopPropagation(); focusOnNode(5, 6, setPath9, 'Y', 'path9'); }}
                        className="w-40 md:w-56 h-12 bg-[#56C6FF] text-brand-ink flex flex-col items-center justify-center px-4 text-center text-xs md:text-sm font-bold uppercase tracking-widest rounded-theme-sm shadow-md border border-brand-dark/10 cursor-pointer hover:shadow-lg transition-shadow"
                      >
                        HIT "VIEW TUTORIAL"
                      </motion.div>
                    </motion.div>
                  </div>
                </>
              ) : null}

              {/* Step 6 Elements (Y Branch Action Node 2 or N Branch Curved Connector) */}
              {/* Separate wrappers prevent unmounting/remounting the opposite branch when switching */}

              {/* Vertical Connector drops from View Tutorial down to click + */}
              {((step >= 6 && path9 === 'Y') || revealed.has('path9_Y')) && (
                <motion.div
                  className="absolute left-1/2 -translate-x-1/2 top-[1700px] z-10 w-[40px] h-[60px] flex flex-col items-center justify-center"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.svg width="40" height="60" viewBox="0 0 40 60" fill="none" className="stroke-brand-dark overflow-visible">
                    <motion.line x1="20" y1="0" x2="20" y2="60" strokeWidth="2.5" strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.7, ease: "easeInOut", delay: 0.2 }}
                    />
                  </motion.svg>
                </motion.div>
              )}

              {/* Curved Connector drops from Click Exit down to click + */}
              {((step >= 6 && path10 === 'Y') || revealed.has('path10_Y')) && (
                <motion.div
                  className="absolute left-1/2 top-[1188px] z-10 flex flex-col items-center justify-center pointer-events-none"
                  style={{ marginLeft: '132px', width: '173px', height: '616px' }}
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.svg width="173" height="616" viewBox="0 0 173 616" fill="none" className="stroke-brand-dark overflow-visible">
                    <motion.path
                      d="M 173 0 C 173 308, 86 616, 0 616"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      fill="none"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 1.05, ease: "easeInOut", delay: 0.4 }}
                    />
                  </motion.svg>
                </motion.div>
              )}

              {/* Node 6: Click + */}
              {(step >= 6 && (path9 === 'Y' || path10 === 'Y')) || revealed.has('path9_Y') || revealed.has('path10_Y') ? (
                <>
                  <div className="absolute top-[1780px] left-1/2 -translate-x-1/2 z-20">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.7 }}
                    >
                      <motion.div
                        animate={{
                          scale: activeStep === 6 ? [1, 1.05, 1] : (activeStep > 6 ? 0.95 : 1),
                          opacity: activeStep === 6 ? 1 : (activeStep > 6 ? 0.5 : 1)
                        }}
                        transition={{
                          scale: { duration: activeStep === 6 ? 3 : 0.5, repeat: activeStep === 6 ? Infinity : 0, ease: "easeInOut" }
                        }}
                        onPointerDownCapture={(e) => e.stopPropagation()}
                        onClick={(e) => { e.stopPropagation(); focusOnNode(6, 7, setPathPlus, 'Y', 'pathPlus'); }}
                        className="w-40 md:w-56 h-12 bg-[#56C6FF] text-brand-ink flex flex-col items-center justify-center px-4 text-center text-xs md:text-sm font-bold uppercase tracking-widest rounded-theme-sm shadow-md border border-brand-dark/10 cursor-pointer hover:shadow-lg transition-shadow"
                      >
                        HIT "+"
                      </motion.div>
                    </motion.div>
                  </div>
                </>
              ) : null}

              {/* Step 7 Elements (View playlist tutorial? Decision Node) */}
              {(step >= 7 && pathPlus === 'Y') || revealed.has('pathPlus_Y') ? (
                <>
                  {/* Vertical Connector drops from Click + down to Diamond Decision 7 */}
                  {((step >= 7 && pathPlus === 'Y') || revealed.has('pathPlus_Y')) && (
                    <motion.div
                      className="absolute left-1/2 -translate-x-1/2 top-[1848px] z-10 w-[40px] h-[160px] flex flex-col items-center justify-center"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.svg width="40" height="160" viewBox="0 0 40 160" fill="none" className="stroke-brand-dark overflow-visible">
                        <motion.line x1="20" y1="0" x2="20" y2="160" strokeWidth="2.5" strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.7, ease: "easeInOut" }}
                        />
                      </motion.svg>
                    </motion.div>
                  )}

                  {/* Node 7: View playlist tutorial? (Diamond) */}
                  <div className="absolute top-[2128px] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-[200px] h-[200px] md:w-[220px] md:h-[220px]">
                    <div className="absolute inset-0">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: step > 7 ? 0.5 : 1, scale: activeStep === 7 ? [1, 1.05, 1] : 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.7 }}
                        className="relative w-full h-full flex items-center justify-center cursor-pointer"
                        onClick={(e) => { e.stopPropagation(); focusOnNode(7, 7); }}
                        onPointerDownCapture={(e) => e.stopPropagation()}
                      >
                        {/* Diamond Background Shape (Rotated) */}
                        <div className="absolute inset-0 m-auto w-[141px] h-[141px] md:w-[155px] md:h-[155px] rotate-45 rounded-xl shadow-xl" style={{ backgroundColor: '#FEE685' }} />

                        {/* Text Content */}
                        <div className="relative z-10 w-full text-center px-4">
                          <span className="text-[12px] md:text-sm font-bold leading-snug block" style={{ color: '#141D26' }}>View playlist<br />tutorial?</span>
                        </div>
                      </motion.div>
                    </div>

                    {/* Yes Button (Anchored to Diamond center) */}
                    <motion.div
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 -ml-[22px] mt-[113px] pointer-events-auto"
                      animate={{
                        scale: path11 === 'Y' || revealed.has('path11_Y') ? 1 : [1, 1.15, 1],
                        opacity: path11 === 'Y' || revealed.has('path11_Y') ? 0.5 : 1
                      }}
                      transition={{
                        scale: { duration: path11 === 'Y' || revealed.has('path11_Y') ? 0.5 : 3, repeat: path11 === 'Y' || revealed.has('path11_Y') ? 0 : Infinity, ease: "easeInOut" },
                        opacity: { duration: 0.5 }
                      }}
                      onPointerDownCapture={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        focusOnNode(7, 8, setPath11, 'Y', 'path11');
                      }}
                    >
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.7 }}
                        className="relative w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center text-sm md:text-base font-bold shadow-md cursor-pointer hover:shadow-lg" style={{ backgroundColor: '#00B782', color: '#141D26' }}
                      >
                        Y
                      </motion.div>
                    </motion.div>

                    {/* No Button Anchor & Sequence Branch */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex items-center pointer-events-auto ml-[135px]">
                      {/* The N Node Itself */}
                      <motion.div
                        animate={{
                          scale: path11 === 'N' || revealed.has('path11_N') ? 1 : [1, 1.15, 1],
                          opacity: path11 === 'N' || revealed.has('path11_N') ? 0.5 : 1
                        }}
                        transition={{
                          scale: { duration: path11 === 'N' || revealed.has('path11_N') ? 0.5 : 3, repeat: path11 === 'N' || revealed.has('path11_N') ? 0 : Infinity, ease: "easeInOut" },
                          opacity: { duration: 0.5 }
                        }}
                        onPointerDownCapture={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation();
                          focusOnNode(7, 8, setPath11, 'N', 'path11');
                        }}
                        className="relative z-50 flex-shrink-0 cursor-pointer pointer-events-auto"
                      >
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.9 }}
                          className="relative w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center text-sm md:text-base font-bold shadow-md hover:shadow-lg" style={{ backgroundColor: '#FF7474', color: '#141D26' }}
                        >
                          N
                        </motion.div>
                      </motion.div>

                      {/* Side Branch */}
                      {path11 === 'N' || revealed.has('path11_N') ? (
                        <div className="absolute left-full top-1/2 -translate-y-1/2 flex items-center gap-[10px] ml-[10px]">
                          <motion.div
                            className="h-[2.5px] w-8 md:w-12 flex-shrink-0 z-10 rounded-full"
                            style={{ backgroundColor: '#141D26', transformOrigin: "left center" }}
                            initial={{ scaleX: 0, opacity: 0 }}
                            animate={{ scaleX: 1, opacity: 1 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                          />
                          <div className="relative z-20">
                            <motion.div
                              className="w-32 md:w-40 h-10 flex-shrink-0 flex items-center justify-center px-3 text-center rounded-theme-sm shadow-md border border-brand-dark/10 cursor-pointer hover:shadow-lg transition-shadow"
                              style={{ backgroundColor: '#56C6FF', color: '#141D26' }}
                              initial={{ scale: 0.5, opacity: 0 }}
                              animate={{
                                scale: activeStep === 8 && path11 === 'N' && !path13 && !revealed.has('path13_Y') ? [1, 1.05, 1] : 0.95,
                                opacity: activeStep === 8 && path11 === 'N' && !path13 && !revealed.has('path13_Y') ? 1 : 0.5
                              }}
                              transition={{
                                scale: { duration: activeStep === 8 && path11 === 'N' && !path13 && !revealed.has('path13_Y') ? 3 : 0.5, repeat: activeStep === 8 && path11 === 'N' && !path13 && !revealed.has('path13_Y') ? Infinity : 0, ease: "easeInOut" },
                                opacity: { duration: 0.5 }
                              }}
                              onClick={(e) => { e.stopPropagation(); focusOnNode(8, 8, setPath13, 'Y', 'path13'); }}
                            >
                              <span className="relative z-10 block text-xs md:text-sm font-bold tracking-widest uppercase">HIT "EXIT"</span>
                            </motion.div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </>
              ) : null}

            </AnimatePresence>

            {/* Step 8 Elements (Y Branch Action Node for Decision 7) */}
            <AnimatePresence>
              {(step >= 8 && path11 === 'Y') || revealed.has('path11_Y') ? (
                <>
                  {/* Vertical Connector drops from Y button (center ~2241px) down to action node */}
                  <motion.div
                    className="absolute left-1/2 -translate-x-1/2 top-[2305px] z-10 w-[40px] h-[288px] flex flex-col items-center justify-center"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.svg width="40" height="288" viewBox="0 0 40 288" fill="none" className="stroke-brand-dark overflow-visible">
                      <motion.line x1="20" y1="0" x2="20" y2="288" strokeWidth="2.5" strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.05, ease: "easeInOut", delay: 0.4 }}
                      />
                    </motion.svg>
                  </motion.div>

                  {/* Node 8: View Tutorial */}
                  <div className="absolute top-[2613px] left-1/2 -translate-x-1/2 z-20">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.7 }}
                    >
                      <motion.div
                        animate={{
                          scale: activeStep === 8 && path11 === 'Y' && !path12 && !revealed.has('path12_Y') ? [1, 1.05, 1] : 0.95,
                          opacity: activeStep === 8 && path11 === 'Y' && !path12 && !revealed.has('path12_Y') ? 1 : 0.5
                        }}
                        transition={{
                          scale: { duration: activeStep === 8 && path11 === 'Y' && !path12 && !revealed.has('path12_Y') ? 3 : 0.5, repeat: activeStep === 8 && path11 === 'Y' && !path12 && !revealed.has('path12_Y') ? Infinity : 0, ease: "easeInOut" },
                          opacity: { duration: 0.5 }
                        }}
                        onPointerDownCapture={(e) => e.stopPropagation()}
                        onClick={(e) => { e.stopPropagation(); focusOnNode(8, 9, setPath12, 'Y', 'path12'); }}
                        className="w-48 md:w-64 h-12 bg-[#56C6FF] text-brand-ink flex flex-col items-center justify-center px-4 text-center text-xs md:text-sm font-bold uppercase tracking-widest leading-snug rounded-theme-sm shadow-md border border-brand-dark/10 cursor-pointer hover:shadow-lg transition-shadow"
                      >
                        HIT "VIEW TUTORIAL"
                      </motion.div>
                    </motion.div>
                  </div>
                </>
              ) : null}

            </AnimatePresence>

            {/* Step 9 Elements (Final Converging "Click +" Node) */}
            <AnimatePresence>
              {/* Vertical Connector drops from View Tutorial down to click + */}
              {((step >= 9 && path12 === 'Y') || revealed.has('path12_Y')) && (
                <motion.div
                  className="absolute left-1/2 -translate-x-1/2 top-[2680px] z-10 w-[40px] h-[60px] flex flex-col items-center justify-center"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.svg width="40" height="60" viewBox="0 0 40 60" fill="none" className="stroke-brand-dark overflow-visible">
                    <motion.line x1="20" y1="0" x2="20" y2="60" strokeWidth="2.5" strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.7, ease: "easeInOut", delay: 0.2 }}
                    />
                  </motion.svg>
                </motion.div>
              )}

              {/* Curved Connector drops from Click Exit down to click + */}
              {((step >= 9 && path13 === 'Y') || revealed.has('path13_Y')) && (
                <motion.div
                  className="absolute left-1/2 top-[2168px] z-10 flex flex-col items-center justify-center pointer-events-none"
                  style={{ marginLeft: '132px', width: '173px', height: '616px' }}
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.svg width="173" height="616" viewBox="0 0 173 616" fill="none" className="stroke-brand-dark overflow-visible">
                    <motion.path
                      d="M 173 0 C 173 308, 86 616, 0 616"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      fill="none"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 1.05, ease: "easeInOut", delay: 0.4 }}
                    />
                  </motion.svg>
                </motion.div>
              )}

              {/* Node 9: Click + */}
              {(step >= 9 && (path12 === 'Y' || path13 === 'Y')) || revealed.has('path12_Y') || revealed.has('path13_Y') ? (
                <>
                  <div className="absolute top-[2760px] left-1/2 -translate-x-1/2 z-20">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.7 }}
                    >
                      <motion.div
                        animate={{
                          scale: activeStep === 9 ? [1, 1.05, 1] : (activeStep > 9 ? 0.95 : 1),
                          opacity: activeStep === 9 ? 1 : (activeStep > 9 ? 0.5 : 1)
                        }}
                        transition={{
                          scale: { duration: activeStep === 9 ? 3 : 0.5, repeat: activeStep === 9 ? Infinity : 0, ease: "easeInOut" }
                        }}
                        onPointerDownCapture={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation();
                          focusOnNode(9, 10, setPath16, 'Y', 'path16');
                        }}
                        className="w-40 md:w-56 h-12 bg-[#56C6FF] text-brand-ink flex flex-col items-center justify-center px-4 text-center text-xs md:text-sm font-bold uppercase tracking-widest rounded-theme-sm shadow-md border border-brand-dark/10 cursor-pointer hover:shadow-lg transition-shadow"
                      >
                        HIT "+"
                      </motion.div>
                    </motion.div>
                  </div>
                </>
              ) : null}
            </AnimatePresence>

            {/* Step 10 Elements (Choose Media Node) */}
            <AnimatePresence>
              {((step >= 10 && path16 === 'Y') || revealed.has('path16_Y')) && (
                <>
                  {/* Vertical Connector drops from Click + down to Choose Media */}
                  <motion.div
                    className="absolute left-1/2 -translate-x-1/2 top-[2828px] z-10 w-[40px] h-[60px] flex flex-col items-center justify-center"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.svg width="40" height="60" viewBox="0 0 40 60" fill="none" className="stroke-brand-dark overflow-visible">
                      <motion.line x1="20" y1="0" x2="20" y2="60" strokeWidth="2.5" strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 0.7, ease: "easeInOut", delay: 0.3 }}
                      />
                    </motion.svg>
                  </motion.div>

                  {/* Node 10: Choose Media */}
                  <div className="absolute top-[2908px] left-1/2 -translate-x-1/2 z-20">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.8 }}
                    >
                      <motion.div
                        animate={{
                          scale: activeStep === 10 ? [1, 1.05, 1] : (activeStep > 10 ? 0.95 : 1),
                          opacity: activeStep === 10 ? 1 : (activeStep > 10 ? 0.5 : 1)
                        }}
                        transition={{
                          scale: { duration: activeStep === 10 ? 3 : 0.5, repeat: activeStep === 10 ? Infinity : 0, ease: "easeInOut" }
                        }}
                        onPointerDownCapture={(e) => e.stopPropagation()}
                        onClick={(e) => { e.stopPropagation(); focusOnNode(10, 11, setPath17, 'Y', 'path17'); }}
                        className="w-40 md:w-56 h-12 bg-[#56C6FF] text-brand-ink flex flex-col items-center justify-center px-4 text-center text-xs md:text-sm font-bold uppercase tracking-widest rounded-theme-sm shadow-md border border-brand-dark/10 cursor-pointer hover:shadow-lg transition-shadow"
                      >
                        HIT "CHOOSE MEDIA"
                      </motion.div>
                    </motion.div>
                  </div>
                </>
              )}
            </AnimatePresence>

            {/* Step 11 Elements (Save content? Decision Node) */}
            <AnimatePresence>
              {((step >= 11 && path17 === 'Y') || revealed.has('path17_Y')) && (
                <>
                  {/* Vertical Connector drops from Choose Media down to Save Content Diamond */}
                  <motion.div
                    className="absolute left-1/2 -translate-x-1/2 top-[2976px] z-10 w-[40px] h-[60px] flex flex-col items-center justify-center"
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

                  {/* Node 11: Save content? (Diamond) */}
                  <div className="absolute top-[3156px] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-[200px] h-[200px] md:w-[220px] md:h-[220px]">
                    <div className="absolute inset-0">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: step > 11 ? 0.5 : 1, scale: activeStep === 11 ? [1, 1.05, 1] : 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.7 }}
                        className="relative w-full h-full flex items-center justify-center cursor-pointer"
                        onClick={(e) => { e.stopPropagation(); focusOnNode(11, 11); }}
                        onPointerDownCapture={(e) => e.stopPropagation()}
                      >
                        {/* Diamond Background Shape (Rotated) */}
                        <div className="absolute inset-0 m-auto w-[141px] h-[141px] md:w-[155px] md:h-[155px] rotate-45 rounded-xl shadow-xl" style={{ backgroundColor: '#FEE685' }} />

                        {/* Text Content */}
                        <div className="relative z-10 w-full text-center px-4">
                          <span className="text-[12px] md:text-sm font-bold leading-snug block" style={{ color: '#141D26' }}>Save<br />content?</span>
                        </div>
                      </motion.div>
                    </div>

                    {/* Yes Button (Anchored to Diamond center) */}
                    <motion.div
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 -ml-[22px] mt-[113px] pointer-events-auto"
                      animate={{
                        scale: path18 === 'Y' || revealed.has('path18_Y') ? 1 : [1, 1.15, 1],
                        opacity: path18 === 'Y' || revealed.has('path18_Y') ? 0.5 : 1
                      }}
                      transition={{
                        scale: { duration: path18 === 'Y' || revealed.has('path18_Y') ? 0.5 : 3, repeat: path18 === 'Y' || revealed.has('path18_Y') ? 0 : Infinity, ease: "easeInOut" },
                        opacity: { duration: 0.5 }
                      }}
                      onPointerDownCapture={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        focusOnNode(11, 12, setPath18, 'Y', 'path18');
                      }}
                    >
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.7 }}
                        className="relative w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center text-sm md:text-base font-bold shadow-md cursor-pointer hover:shadow-lg" style={{ backgroundColor: '#00B782', color: '#141D26' }}
                      >
                        Y
                      </motion.div>
                    </motion.div>

                    {/* No Button Anchor & Sequence Branch */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex items-center pointer-events-auto ml-[135px]">
                      {/* The N Node Itself */}
                      <motion.div
                        animate={{
                          scale: path18 === 'N' || revealed.has('path18_N') ? 1 : [1, 1.15, 1],
                          opacity: path18 === 'N' || revealed.has('path18_N') ? 0.5 : 1
                        }}
                      transition={{
                        scale: { duration: path18 === 'N' || revealed.has('path18_N') ? 0.5 : 3, repeat: path18 === 'N' || revealed.has('path18_N') ? 0 : Infinity, ease: "easeInOut" },
                        opacity: { duration: 0.5 }
                      }}
                      onPointerDownCapture={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        focusOnNode(11, 12, setPath18, 'N', 'path18');
                      }}
                      >
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.9 }}
                          className="relative w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center text-sm md:text-base font-bold shadow-md hover:shadow-lg" style={{ backgroundColor: '#FF7474', color: '#141D26' }}
                        >
                          N
                        </motion.div>
                      </motion.div>

                      {/* Side Branch: -> "Click Exit" */}
                      {path18 === 'N' || revealed.has('path18_N') ? (
                        <div className="absolute left-full top-1/2 -translate-y-1/2 flex items-center gap-[10px] ml-[10px]">
                          <motion.div
                            className="h-[2.5px] w-8 md:w-12 flex-shrink-0 z-10 rounded-full"
                            style={{ backgroundColor: '#141D26', transformOrigin: "left center" }}
                            initial={{ scaleX: 0, opacity: 0 }}
                            animate={{ scaleX: 1, opacity: 1 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                          />
                          <div className="relative z-20">
                            <motion.div
                              className="w-32 md:w-40 h-10 flex-shrink-0 flex items-center justify-center px-3 text-center rounded-theme-sm shadow-md border border-brand-dark/10 cursor-pointer hover:shadow-lg transition-shadow"
                              style={{ backgroundColor: '#56C6FF', color: '#141D26' }}
                              initial={{ scale: 0.5, opacity: 0 }}
                              animate={{
                                scale: activeStep === 12 && path18 === 'N' && !path21 && !revealed.has('path21_Y') ? [1, 1.05, 1] : 0.95,
                                opacity: activeStep === 12 && path18 === 'N' && !path21 && !revealed.has('path21_Y') ? 1 : 0.5
                              }}
                              transition={{
                                scale: { duration: activeStep === 12 && path18 === 'N' && !path21 && !revealed.has('path21_Y') ? 3 : 0.5, repeat: activeStep === 12 && path18 === 'N' && !path21 && !revealed.has('path21_Y') ? Infinity : 0, ease: "easeInOut" },
                                opacity: { duration: 0.5 }
                              }}
                              onClick={(e) => { e.stopPropagation(); focusOnNode(12, 13, setPath21, 'Y', 'path21'); }}
                            >
                              <span className="relative z-10 block text-xs md:text-sm font-bold tracking-widest uppercase">HIT "EXIT"</span>
                            </motion.div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </>
              )}
            </AnimatePresence>

            {/* Sequence: Save Content Y Branch (Vertical Line to Click Save) */}
            <AnimatePresence>
              {(step >= 12 && path18 === 'Y') || revealed.has('path18_Y') ? (
                <motion.div
                  className="absolute left-1/2 -translate-x-1/2 top-[3333px] z-10 w-[40px] h-[288px] flex flex-col items-center justify-center"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.svg width="40" height="288" viewBox="0 0 40 288" fill="none" className="stroke-brand-dark overflow-visible">
                    <motion.line x1="20" y1="0" x2="20" y2="288" strokeWidth="2.5" strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 1.05, ease: "easeInOut", delay: 0.4 }}
                    />
                  </motion.svg>
                </motion.div>
              ) : null}
            </AnimatePresence>

            {/* Sequence: Save Content N Branch Merger (Curved Line from Click Exit to Click Save) */}
            <AnimatePresence>
              {(step >= 13 && path21 === 'Y') || revealed.has('path21_Y') ? (
                <motion.div
                  className="absolute left-1/2 top-[3196px] ml-[148px] z-10 flex items-center justify-center overflow-visible"
                  style={{ width: '157px', height: '469px' }}
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.svg width="157" height="469" viewBox="0 0 157 469" fill="none" className="stroke-brand-dark overflow-visible">
                    <motion.path 
                      d="M 157 0 C 157 234, 80 469, 0 469" 
                      strokeWidth="2.5" 
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 1.05, ease: "easeInOut", delay: 0.4 }}
                    />
                  </motion.svg>
                </motion.div>
              ) : null}
            </AnimatePresence>

            {/* Shared Node: Click Save (Convergence point for both Y and N paths) */}
            <AnimatePresence>
              {(step >= 12 && path18 === 'Y') || revealed.has('path18_Y') || (step >= 13 && path21 === 'Y') || revealed.has('path21_Y') ? (
                <div className="absolute top-[3641px] left-1/2 -translate-x-1/2 z-20">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.7 }}
                  >
                    <motion.div
                      animate={{
                        scale: (activeStep === 12 && path18 === 'Y' && !path20 && !revealed.has('path20_Y')) || (activeStep === 13 && path21 === 'Y' && !path20 && !revealed.has('path20_Y')) ? [1, 1.05, 1] : 0.95,
                        opacity: (activeStep === 12 && path18 === 'Y' && !path20 && !revealed.has('path20_Y')) || (activeStep === 13 && path21 === 'Y' && !path20 && !revealed.has('path20_Y')) ? 1 : 0.5
                      }}
                      transition={{
                        scale: { duration: (activeStep === 12 && path18 === 'Y' && !path20 && !revealed.has('path20_Y')) || (activeStep === 13 && path21 === 'Y' && !path20 && !revealed.has('path20_Y')) ? 3 : 0.5, repeat: (activeStep === 12 && path18 === 'Y' && !path20 && !revealed.has('path20_Y')) || (activeStep === 13 && path21 === 'Y' && !path20 && !revealed.has('path20_Y')) ? Infinity : 0, ease: "easeInOut" },
                        opacity: { duration: 0.5 }
                      }}
                      onPointerDownCapture={(e) => e.stopPropagation()}
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        focusOnNode(activeStep, activeStep + 1, setPath20, 'Y', 'path20'); 
                      }}
                      className="w-48 md:w-64 h-12 bg-[#56C6FF] text-brand-ink flex flex-col items-center justify-center px-4 text-center text-xs md:text-sm font-bold uppercase tracking-widest leading-snug rounded-theme-sm shadow-md border border-brand-dark/10 cursor-pointer hover:shadow-lg transition-shadow"
                    >
                      HIT "SAVE"
                    </motion.div>
                  </motion.div>
                </div>
              ) : null}
            </AnimatePresence>

            {/* Sequence: Hit Preview (via Hit Save) */}
            <AnimatePresence>
              {((step >= 13 && path20 === 'Y') || revealed.has('path20_Y')) && (
                <>
                  {/* Vertical Connector drops from Hit Save down to Hit Preview */}
                  <motion.div
                    className="absolute left-1/2 -translate-x-1/2 top-[3709px] z-10 w-[40px] h-[60px] flex flex-col items-center justify-center"
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

                  {/* Node 13/14: Hit Preview */}
                  <div className="absolute top-[3789px] left-1/2 -translate-x-1/2 z-20">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.7 }}
                    >
                      <motion.div
                        animate={{
                          scale: ((activeStep === 13 || activeStep === 14) && path20 === 'Y') && !path22 && !revealed.has('path22_Y') ? [1, 1.05, 1] : 0.95,
                          opacity: ((activeStep === 13 || activeStep === 14) && path20 === 'Y') && !path22 && !revealed.has('path22_Y') ? 1 : 0.5
                        }}
                        transition={{
                          scale: { duration: ((activeStep === 13 || activeStep === 14) && path20 === 'Y') && !path22 && !revealed.has('path22_Y') ? 3 : 0.5, repeat: ((activeStep === 13 || activeStep === 14) && path20 === 'Y') && !path22 && !revealed.has('path22_Y') ? Infinity : 0, ease: "easeInOut" },
                          opacity: { duration: 0.5 }
                        }}
                        onPointerDownCapture={(e) => e.stopPropagation()}
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          focusOnNode(activeStep, activeStep + 1, setPath22, 'Y', 'path22'); 
                        }}
                        className="w-48 md:w-64 h-12 bg-[#56C6FF] text-brand-ink flex flex-col items-center justify-center px-4 text-center text-xs md:text-sm font-bold uppercase tracking-widest leading-snug rounded-theme-sm shadow-md border border-brand-dark/10 cursor-pointer hover:shadow-lg transition-shadow"
                      >
                        HIT "PREVIEW"
                      </motion.div>
                    </motion.div>
                  </div>
                </>
              )}
            </AnimatePresence>

            {/* --- STEP 14/15: TERMINAL NODE ('SUCCESS!') --- */}
            <AnimatePresence>
                {((step >= 14 && path22 === 'Y') || revealed.has('path22_Y')) && (
                    <>
                        {/* Action Node Vertical Line */}
                        <motion.div
                            className="absolute left-1/2 -translate-x-1/2 top-[3857px] z-10 w-[40px] h-[80px] flex flex-col items-center justify-center pointer-events-none"
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
                        <div key="node-success" className="absolute top-[3957px] left-1/2 -translate-x-1/2 z-20">
                            <motion.div
                                className="w-32 h-32 md:w-40 md:h-40 flex items-center justify-center p-4 text-center text-[16px] md:text-lg font-bold tracking-widest uppercase rounded-full shadow-lg border border-transparent cursor-pointer hover:shadow-xl transition-shadow"
                                style={{ backgroundColor: '#61F5B9', color: '#141D26', willChange: 'transform', backfaceVisibility: 'hidden', WebkitFontSmoothing: 'subpixel-antialiased' }}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{
                                    scale: activeStep >= 14 && path22 === 'Y' ? [1, 1.05, 1] : 0.95,
                                    opacity: activeStep >= 14 && path22 === 'Y' ? 1 : 0.5
                                }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                transition={{
                                    scale: { duration: activeStep >= 14 && path22 === 'Y' ? 3 : 0.5, repeat: activeStep >= 14 && path22 === 'Y' ? Infinity : 0, ease: "easeInOut" },
                                    opacity: { duration: 0.5 }
                                }}
                                onPointerDownCapture={(e) => e.stopPropagation()}
                                onClick={(e) => { e.stopPropagation(); focusOnNode(activeStep, activeStep + 1); }}
                            >
                                SUCCESS!
                            </motion.div>
                        </div>
                    </>
                )}
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
                src="https://res.cloudinary.com/dqabyzuzf/image/upload/f_auto,q_auto/v1773677095/Display_Now_To_Be_Flow_gcvrgr.jpg"
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

export default InteractiveUserFlowToBe;
