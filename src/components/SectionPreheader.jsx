import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';
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
        expandOffset: 15, // Initial calculate: ((10*4)-10)/2
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
                return {
                    circleWidth: cw,
                    gap: g,
                    expandScale: es,
                    expandOffset: eo,
                    isMobile: isMobile
                };
            });
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Determines when to fire animation:
    // If Custom Trigger provided (e.g. for Sticky Cards), use that.
    // Otherwise, default to standard scroll/viewport detection.
    const shouldAnimate = customTrigger !== undefined ? customTrigger : isInView;

    // Store measured target positions
    const targetPos = useRef({ left: 0, right: 0 });

    useLayoutEffect(() => {
        if (textRef.current) {
            const width = textRef.current.offsetWidth;

            const travelDistance = (width / 2) + d.gap;

            targetPos.current = {
                left: -travelDistance,
                right: travelDistance
            };

            // eslint-disable-next-line react-hooks/set-state-in-effect
            if (!isMeasured) setIsMeasured(true);
        }
    }, [text, d, isMeasured]); // Re-measure when text OR dimensions change

    const hasAnimated = useRef(false);

    React.useEffect(() => {
        if (shouldAnimate && isMeasured && !hasAnimated.current) {
            hasAnimated.current = true;
            const animate = async () => {
                // 0. Initial State: Center (x=0 relative to flex center)
                controlsLeft.set({ scale: 0, x: 0, opacity: 1 });
                controlsRight.set({ scale: 0, x: 0, opacity: 1 });
                controlsText.set({ clipPath: "inset(0 50% 0 50%)", opacity: 0 });

                // 1. Pop & Expand (Simultaneously reveal text)
                const animations = [
                    // Text Reveals
                    controlsText.start({
                        clipPath: "inset(0 0% 0 0%)",
                        opacity: 1,
                        transition: { duration: 0.5, ease: "backOut" }
                    })
                ];

                if (showCircles) {
                    animations.push(
                        controlsLeft.start({
                            scale: d.expandScale,
                            x: targetPos.current.left - d.expandOffset,
                            transition: { duration: 0.5, ease: "backOut" }
                        }),
                        controlsRight.start({
                            scale: d.expandScale,
                            x: targetPos.current.right + d.expandOffset,
                            transition: { duration: 0.5, ease: "backOut" }
                        })
                    );
                }

                await Promise.all(animations);

                // 2. Shrink to resting position (Only if circles exist)
                if (showCircles) {
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
                }
            };
            animate();
        }
    }, [shouldAnimate, isMeasured, controlsLeft, controlsRight, controlsText, d, showCircles, text]);

    // Determine effective alignment
    const effectiveAlign = (d.isMobile && mobileAlign) ? mobileAlign : align;

    // For non-circle version, we just want simple text alignment without the intricate spacing
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
            <div
                className="relative flex items-center justify-center"
            >
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
