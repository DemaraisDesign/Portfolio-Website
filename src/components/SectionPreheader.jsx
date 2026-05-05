import React, { useRef, useEffect, useCallback } from 'react';
// eslint-disable-next-line no-unused-vars
import { useAnimation, useInView, motion } from "framer-motion";

const SectionPreheader = ({ text, color = "#171717", textColor, customTrigger, align = 'left', mobileAlign = null, showCircles = true }) => {
    const containerRef = useRef(null);
    const controlsLeft = useAnimation();
    const controlsRight = useAnimation();
    const controlsText = useAnimation();
    const isInView = useInView(containerRef, { once: true });
    const hasAnimated = useRef(false);

    const circleSize = typeof window !== 'undefined' && window.innerWidth < 768 ? 8 : 10;
    const gap = typeof window !== 'undefined' && window.innerWidth < 768 ? 10 : 12;
    const expandScale = 4;

    const shouldAnimate = customTrigger !== undefined ? customTrigger : isInView;

    // Effective alignment
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const effectiveAlign = (isMobile && mobileAlign) ? mobileAlign : align;

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

        controlsLeft.set({ scale: 0, opacity: 1 });
        controlsRight.set({ scale: 0, opacity: 1 });
        controlsText.set({ clipPath: "inset(0 50% 0 50%)", opacity: 0 });

        // Phase 1: Expand + reveal text simultaneously
        await Promise.all([
            controlsText.start({
                clipPath: "inset(0 0% 0 0%)",
                opacity: 1,
                transition: { duration: 0.5, ease: "backOut" }
            }),
            controlsLeft.start({
                scale: expandScale,
                transition: { duration: 0.5, ease: "backOut" }
            }),
            controlsRight.start({
                scale: expandScale,
                transition: { duration: 0.5, ease: "backOut" }
            }),
        ]);

        // Phase 2: Shrink to resting size
        await Promise.all([
            controlsLeft.start({
                scale: 1,
                transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
            }),
            controlsRight.start({
                scale: 1,
                transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
            })
        ]);

        hasAnimated.current = true;
    }, [controlsLeft, controlsRight, controlsText, expandScale, showCircles]);

    useEffect(() => {
        if (shouldAnimate && !hasAnimated.current) {
            runIntroAnimation();
        }
    }, [shouldAnimate, runIntroAnimation]);

    const justifyMap = {
        left: 'justify-start',
        right: 'justify-end',
        center: 'justify-center',
    };

    return (
        <div
            ref={containerRef}
            className={`relative flex items-center ${justifyMap[effectiveAlign] || 'justify-start'} py-2 mb-2`}
        >
            <div className="inline-flex items-center" style={{ gap: `${gap}px` }}>
                {/* Left Circle */}
                {showCircles && (
                    <motion.div
                        animate={controlsLeft}
                        initial={{ scale: 0 }}
                        style={{
                            width: circleSize,
                            height: circleSize,
                            borderRadius: "50%",
                            backgroundColor: color,
                            flexShrink: 0,
                        }}
                    />
                )}

                {/* Text */}
                <motion.h3
                    animate={controlsText}
                    initial={{ opacity: 0 }}
                    className="font-bold uppercase tracking-widest text-sm md:text-base whitespace-nowrap z-10 py-1 leading-normal"
                    style={{
                        fontFamily: "'Outfit', sans-serif",
                        color: textColor || '#141D26',
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
                            width: circleSize,
                            height: circleSize,
                            borderRadius: "50%",
                            backgroundColor: color,
                            flexShrink: 0,
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default SectionPreheader;
