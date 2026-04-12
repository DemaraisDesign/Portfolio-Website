import React, { useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { BRAND_COLORS } from '../utils/theme';

const STATEMENT_DATA = [
    {
        segments: [
            { text: "I believe that" },
            { text: "sound design starts with script analysis", highlight: true },
            { text: "— the best sonic choices are rooted in character, theme, and story." }
        ]
    },
    {
        segments: [
            { text: "The choices I'm proudest of came from" },
            { text: "working alongside the other designers,", highlight: true },
            { text: "not from working around them." }
        ]
    },
    {
        segments: [
            { text: "Knowing when to" },
            { text: "take something away", highlight: true },
            { text: "is as important as knowing when to add it." }
        ]
    }
];

const FancyBullet = ({ isHovered, baseStatementDelay }) => {
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    const [isBursting, setIsBursting] = useState(false);

    React.useEffect(() => {
        if (isInView) {
            const burstTimer = setTimeout(() => {
                setIsBursting(true);
                setTimeout(() => setIsBursting(false), 500); 
            }, (baseStatementDelay * 1000) + 300); 
            
            return () => clearTimeout(burstTimer);
        }
    }, [isInView, baseStatementDelay]);

    const activeState = isHovered || isBursting;

    return (
        <div ref={ref} className="relative w-8 h-8 md:w-10 md:h-10 shrink-0 mt-0 md:mt-1 mr-5 md:mr-8 flex items-center justify-center pointer-events-none">
            {/* Outer static ring */}
            <motion.div 
                className="absolute inset-0 rounded-full border-[1.5px]"
                style={{ borderColor: 'rgba(0, 194, 163, 0.4)' }} // Light Sound Teal
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: baseStatementDelay }}
            />
            {/* Inner dynamic fill that bursts out on hover */}
            <motion.div 
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: BRAND_COLORS.sound }} // Brand Sound
                initial={{ scale: 0 }}
                animate={{ scale: activeState ? 1 : 0 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 400, damping: 25 }}
            />
            {/* Core static dot */}
            <motion.div 
                className="w-[10px] h-[10px] md:w-[12px] md:h-[12px] rounded-full z-10 transition-colors duration-300"
                style={{ backgroundColor: activeState ? '#FFFFFF' : BRAND_COLORS.sound }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: baseStatementDelay + 0.3 }}
            />
        </div>
    );
};

const StatementCard = ({ statement, index, isHoverReady }) => {
    const [isHovered, setIsHovered] = useState(false);

    // Cascading timing locks
    const baseStatementDelay = index * 1.5; 
    const baseTextDelay = baseStatementDelay + 0.4;
    let globalCharIndex = 0;

    return (
        <motion.div 
            className="flex flex-row justify-start items-start w-full py-4 md:py-6 cursor-default group"
            onMouseEnter={() => { if (isHoverReady) setIsHovered(true); }}
            onMouseLeave={() => setIsHovered(false)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: baseStatementDelay, ease: [0.25, 1, 0.5, 1] }}
        >
            <FancyBullet isHovered={isHovered} baseStatementDelay={baseStatementDelay} />
            
            <p className="w-full pr-10 md:pr-14 lg:pr-[72px] xl:pr-[88px] text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-outfit font-light leading-[1.35] lg:leading-[1.25] tracking-tight text-brand-ink/95 m-0 transition-colors duration-300">
                {statement.segments.map((seg, i) => {
                    const words = seg.text.split(/(\s+)/);
                    return (
                        <span 
                            key={i} 
                            className={`transition-all duration-500 ease-out ${seg.highlight && isHovered ? 'font-extrabold' : (seg.highlight ? 'font-bold opacity-90' : 'opacity-100')}`}
                            style={{ 
                                color: seg.highlight ? BRAND_COLORS.black : 'inherit',
                            }}
                        >
                            {words.map((word, wordI) => {
                                if (word.trim() === '') {
                                    globalCharIndex += word.length;
                                    return <span key={wordI}>{word}</span>;
                                }
                                
                                return (
                                    <span key={wordI} className="inline-block whitespace-nowrap">
                                        {word.split('').map((char, charI) => {
                                            const charDelay = baseTextDelay + (globalCharIndex * 0.015);
                                            globalCharIndex++;
                                            
                                            return (
                                                <motion.span
                                                    key={charI}
                                                    className="inline-block"
                                                    initial={{ opacity: 0, filter: "blur(12px)", y: 6 }}
                                                    whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                                                    viewport={{ once: true, margin: "-50px" }}
                                                    transition={{ duration: 0.8, delay: charDelay, ease: "easeOut" }}
                                                >
                                                    {char}
                                                </motion.span>
                                            );
                                        })}
                                    </span>
                                );
                            })}
                            {' '}
                        </span>
                    );
                })}
            </p>
        </motion.div>
    );
};

const SoundsLogline = () => {
    const parentRef = React.useRef(null);
    const isInView = useInView(parentRef, { once: true, margin: "-50px" });
    const [isHoverReady, setIsHoverReady] = useState(false);

    React.useEffect(() => {
        if (isInView) {
            const timer = setTimeout(() => setIsHoverReady(true), 6000);
            return () => clearTimeout(timer);
        }
    }, [isInView]);

    return (
        <section 
            ref={parentRef}
            className="w-full relative flex flex-col justify-center pt-12 md:pt-20 lg:pt-24 pb-8 md:pb-16 lg:pb-24 px-9 md:px-12 lg:px-24 z-20"
            style={{ backgroundColor: BRAND_COLORS.light }}
        >
            <div className="w-full max-w-[1400px] mx-auto z-10 relative flex flex-col items-start">
                <div className="w-full grid grid-cols-1 gap-4 md:gap-6 relative ml-0">
                    {STATEMENT_DATA.map((statement, idx) => (
                        <StatementCard key={idx} statement={statement} index={idx} isHoverReady={isHoverReady} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SoundsLogline;
