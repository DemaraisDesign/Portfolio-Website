import React, { useRef, useLayoutEffect, useState, useEffect, useCallback } from 'react';
// eslint-disable-next-line no-unused-vars
import { useAnimation, useInView, motion } from "framer-motion";

const SectionPreheader = ({ text, color = "#171717", textColor, customTrigger, align = 'left', mobileAlign = null, showCircles = true }) => {
    const containerRef = useRef(null);
    const textRef = useRef(null);
    const controlsLeft = useAnimation();
    const controlsRight = useAnimation();
    const controlsText = useAnimation();
    const isInView = useInView(containerRef, { once: true });
    const [isMeasured, setIsMeasured] = useState(false);

    // Responsive Dimensions State
    const [d, setDimensions] = useState({
        circleWidth: 10,
        gap: 12,
        expandScale: 4,
        expandOffset: 15,
        isMobile: false
    });

    useEffect(() => {
        const handleResize = () => {
            const isMobile = window.innerWidth < 768;
            const cw = isMobile ? 8 : 10;
            const g = isMobile ? 10 : 12;
            const es = 4;
            const eo = ((cw * es) - cw) / 2;

            setDimensions(prev => {
                if (prev.isMobile === isMobile && prev.circleWidth === cw) return prev;
                return { circleWidth: cw, gap: g, expandScale: es, expandOffset: eo, isMobile };
            });
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const shouldAnimate = customTrigger !== undefined ? customTrigger : isInView;

    // Store measured target positions
    const targetPos = useRef({ left: 0, right: 0 });

    // Track whether the intro animation has completed
    const hasAnimated = useRef(false);

    // Measure text width and update targetPos — runs whenever text or dimensions change
    useLayoutEffect(() => {
        if (!textRef.current) return;
        const width = textRef.current.offsetWidth;
        const travelDistance = (width / 2) + d.gap;
        targetPos.current = { left: -travelDistance, right: travelDistance };
        if (!isMeasured) setIsMeasured(true);
    }, [text, d]); // note: isMeasured deliberately excluded to avoid loop

    // After animation completes, snap circles to updated positions on resize/reflow
    useLayoutEffect(() => {
        if (!hasAnimated.current || !showCircles || !isMeasured) return;
        // Instantly reposition — no transition, no scale change
        controlsLeft.set({ x: targetPos.current.left, scale: 1 });
        controlsRight.set({ x: targetPos.current.right, scale: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [d, text]); // Re-snap whenever layout-affecting things change

    // Run the intro animation (once per mount, when in view + measured)
    const runIntroAnimation = useCallback(async () => {
        if (!showCircles) {
            controlsText.set({ clipPath: "inset(0 50% 0 50%)", opacity: 0 });
            await controlsText.start({
                clipPath: "inset(0 0% 0 0%)",
                opacity: 1,
                transition: { duration: 0.5, ease: "backOut" }
            });
            return;
        }

        controlsLeft.set({ scale: 0, x: 0, opacity: 1 });
        controlsRight.set({ scale: 0, x: 0, opacity: 1 });
        controlsText.set({ clipPath: "inset(0 50% 0 50%)", opacity: 0 });

        // Phase 1: Expand + reveal text simultaneously
        await Promise.all([
            controlsText.start({
                clipPath: "inset(0 0% 0 0%)",
                opacity: 1,
                transition: { duration: 0.5, ease: "backOut" }
            }),
            controlsLeft.start({
                scale: d.expandScale,
                x: targetPos.current.left - d.expandOffset,
                transition: { duration: 0.5, ease: "backOut" }
            }),
            controlsRight.start({
                scale: d.expandScale,
                x: targetPos.current.right + d.expandOffset,
                transition: { duration: 0.5, ease: "backOut" }
            }),
        ]);

        // Phase 2: Shrink to resting position
        await Promise.all([
            controlsLeft.start({
                scale: 1,
                x: targetPos.current.left,
                transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
            }),
            controlsRight.start({
                scale: 1,
                x: targetPos.current.right,
                transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
            })
        ]);

        hasAnimated.current = true;
    }, [controlsLeft, controlsRight, controlsText, d, showCircles]);

    useEffect(() => {
        if (shouldAnimate && isMeasured && !hasAnimated.current) {
            runIntroAnimation();
        }
    }, [shouldAnimate, isMeasured, runIntroAnimation]);

    // Determine effective alignment
    const effectiveAlign = (d.isMobile && mobileAlign) ? mobileAlign : align;

    const simpleStyle = !showCircles ? {} : {
        marginLeft: effectiveAlign === 'left' ? (d.gap + d.circleWidth / 2) : 0,
        marginRight: effectiveAlign === 'right' ? (d.gap + d.circleWidth / 2) : 0
    };

    return (
        <div
            ref={containerRef}
            className={`relative flex items-center ${effectiveAlign === 'right' ? 'justify-end' : 'justify-start'} py-2 mb-2`}
            style={simpleStyle}
        >
            <div className="relative flex items-center justify-center">
                {/* Left Circle */}
                {showCircles && (
                    <motion.div
                        animate={controlsLeft}
                        initial={{ scale: 0 }}
                        style={{
                            width: d.circleWidth,
                            height: d.circleWidth,
                            borderRadius: "50%",
                            backgroundColor: color,
                            position: 'absolute',
                        }}
                    />
                )}

                {/* Text */}
                <motion.h3
                    ref={textRef}
                    animate={controlsText}
                    initial={{ opacity: 0 }}
                    className="font-bold uppercase tracking-widest text-sm md:text-base whitespace-nowrap z-10 py-1 leading-normal"
                    style={{
                        fontFamily: "'Outfit', sans-serif",
                        color: textColor || '#0D1216',
                        paddingLeft: '0.1em'
                    }}
                >
                    {text}
                </motion.h3>

                {/* Right Circle */}
                {showCircles && (
                    <motion.div
                        animate={controlsRight}
                        initial={{ scale: 0 }}
                        style={{
                            width: d.circleWidth,
                            height: d.circleWidth,
                            borderRadius: "50%",
                            backgroundColor: color,
                            position: 'absolute',
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default SectionPreheader;
