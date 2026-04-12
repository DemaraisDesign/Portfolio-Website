import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BRAND_COLORS } from '../utils/theme';

const STATEMENT_DATA = [
    {
        segments: [
            { text: "I’m drawn to theatre that descends into the darkest corners of human experience without losing a sense of" },
            { text: "wonder and hope.", highlight: true, color: BRAND_COLORS.stageDeep }
        ]
    },
    {
        segments: [
            { text: "My work strives for efficiency, theatricality, and" },
            { text: "sonic envelopment.", highlight: true, color: BRAND_COLORS.stageDeep }
        ]
    },
    {
        segments: [
            { text: "I believe that" },
            { text: "constraint,", highlight: true, color: BRAND_COLORS.stageDeep },
            { text: "when embraced as a creative challenge, tends to produce imaginative and novel solutions." }
        ]
    }
];

const SequenceStatement = ({ segments, isVisible, isFadingOut }) => {
    const allWords = segments.flatMap(seg => 
        seg.text.split(' ').filter(w => w).map(word => ({ word, highlightColor: seg.highlight ? seg.color : null }))
    );

    const containerVariants = {
        hidden: { opacity: 1 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.12 }
        },
        fadeOut: {
            opacity: 1,
            transition: { staggerChildren: 0.06 }
        }
    };

    const wordVariants = {
        hidden: { opacity: 0, y: 20, filter: "blur(20px)" },
        visible: {
            opacity: 1, y: 0, filter: "blur(0px)",
            transition: { duration: 1.2, ease: "easeOut" }
        },
        fadeOut: {
            opacity: 0, y: -20, filter: "blur(20px)",
            transition: { duration: 1.2, ease: "easeInOut" }
        }
    };

    let animationState = "hidden";
    if (isVisible && !isFadingOut) animationState = "visible";
    if (isVisible && isFadingOut) animationState = "fadeOut"; 

    return (
        <motion.div
            style={{ 
                position: 'absolute', 
                top: 0, left: 0, right: 0, bottom: 0, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'flex-start',
                pointerEvents: isVisible && !isFadingOut ? 'auto' : 'none'
            }}
            className="px-9 md:px-12 lg:px-24"
        >
            <motion.h2 
                variants={containerVariants}
                initial="hidden"
                animate={animationState}
                className="max-w-4xl text-left text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-outfit font-light leading-[1.2] tracking-tight text-brand-ink/95 m-0"
            >
                {allWords.map((item, i) => (
                    <motion.span
                        key={i}
                        variants={wordVariants}
                        className={`inline-block ${item.highlightColor ? 'font-extrabold' : ''}`}
                        style={{ 
                            color: item.highlightColor || 'inherit',
                            marginRight: '0.25em',
                            marginBottom: '0.1em'
                        }}
                    >
                        {item.word}
                    </motion.span>
                ))}
            </motion.h2>
        </motion.div>
    );
};

const StageLogline = () => {
    const containerRef = useRef(null);
    const [step, setStep] = useState(0);
    const [isLocked, setIsLocked] = useState(false);

    // Primary Scroll Interceptor & Snap-Lock
    useEffect(() => {
        const handleScrollState = () => {
            if (step >= 5) {
                if (isLocked) setIsLocked(false);
                return;
            }
            if (!containerRef.current) return;
            
            const rect = containerRef.current.getBoundingClientRect();
            // Lock ONLY when the container organically hits the top natively (perfect pin)
            if (rect.top <= 2 && rect.bottom >= window.innerHeight * 0.5) {
                if (!isLocked) {
                    setIsLocked(true);
                    if (step === 0) setStep(1); // Ignition!
                }
            } else {
                // If they scroll back up ABOVE the component quickly, unlock
                if (rect.top > 2 && isLocked) {
                    setIsLocked(false);
                }
            }
        };

        window.addEventListener('scroll', handleScrollState, { passive: true });
        
        return () => window.removeEventListener('scroll', handleScrollState);
    }, [step, isLocked]);

    // Active block on momentum that safely allows upwards exit
    useEffect(() => {
        const handleWheel = (e) => {
            if (isLocked && step < 5) {
                if (e.deltaY > 0) {
                    e.preventDefault();
                }
            }
        };

        let touchStartY = 0;
        const handleTouchStart = (e) => {
            touchStartY = e.touches[0].clientY;
        };
        
        const handleTouchMove = (e) => {
            if (isLocked && step < 5) {
                const currentY = e.touches[0].clientY;
                if (touchStartY - currentY > 0) { // Scrolling down
                    e.preventDefault();
                }
            }
        };

        const opts = { passive: false };
        window.addEventListener('wheel', handleWheel, opts);
        window.addEventListener('touchstart', handleTouchStart, opts);
        window.addEventListener('touchmove', handleTouchMove, opts);

        return () => {
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
        };
    }, [isLocked, step]);

    // Time-based sequence Engine
    useEffect(() => {
        if (!isLocked) return;

        let timer;
        if (step === 1) {
            timer = setTimeout(() => setStep(2), 4400); // Wait for typing + reading
        } else if (step === 2) {
            timer = setTimeout(() => setStep(3), 2400); // Wait for fadeOut
        } else if (step === 3) {
            timer = setTimeout(() => setStep(4), 4400); // Wait for typing + reading
        } else if (step === 4) {
            timer = setTimeout(() => setStep(5), 2400); // Wait for fadeOut
        }
        
        return () => clearTimeout(timer);
    }, [step, isLocked]);

    return (
        <section ref={containerRef} className="w-full bg-white relative" style={{ height: "150vh" }}>
            <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-start">
                

                <div className="relative w-full max-w-[1400px] h-full mx-auto z-10">
                    <SequenceStatement 
                        segments={STATEMENT_DATA[0].segments} 
                        isVisible={step >= 1} 
                        isFadingOut={step >= 2} 
                    />
                    <SequenceStatement 
                        segments={STATEMENT_DATA[1].segments} 
                        isVisible={step >= 3} 
                        isFadingOut={step >= 4} 
                    />
                    <SequenceStatement 
                        segments={STATEMENT_DATA[2].segments} 
                        isVisible={step >= 5} 
                        isFadingOut={false} 
                    />
                </div>
            </div>
        </section>
    );
};

export default StageLogline;
