import React, { useState } from 'react';
import { useMotionValueEvent, motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";
import { ArrowRight, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePasswordGate } from './PasswordGate';
import { useConstructionGate } from './ConstructionGate';

import SectionPreheader from './SectionPreheader';
import { BRAND_COLORS } from '../utils/theme';

const StickyProjectCard = ({
    project,
    index,
    customBgColor = null, // Optional hex override
    isLightMode = false, // Toggle for dark text on light backgrounds
    dwellProgress, // From StickyScroll wrapper
    pageProgress, // From StickyScroll wrapper
    triggerPoint // From StickyScroll wrapper (When card is docked)
}) => {
    const navigate = useNavigate();
    const { requestAccess, isProjectUnlocked } = usePasswordGate();
    const { requestConstructionAccess } = useConstructionGate();
    const unlocked = isProjectUnlocked(project.id);
    const isConstruction = project.isConstruction;

    // Initialize as false for ALL cards to ensure we wait for the trigger point
    const [isRevealed, setIsRevealed] = useState(false);

    const isYellowBoat = project.id === 'the-yellow-boat';

    // --- 3D Parallax State (Images Only) --- //
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const isHovering = useMotionValue(0);

    const springConfig = { stiffness: 300, damping: 20 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);
    const springHover = useSpring(isHovering, springConfig);

    const rotateX = useTransform(springY, [-0.5, 0.5], [8, -8]);
    const rotateY = useTransform(springX, [-0.5, 0.5], [-8, 8]);
    const scaleAnim = useTransform(springHover, [0, 1], [1, 1.02]);

    const glareX = useTransform(springX, [-0.5, 0.5], [0, 100]);
    const glareY = useTransform(springY, [-0.5, 0.5], [0, 100]);
    const glareOpacity = useTransform(springHover, [0, 1], [0, 1]);
    const backgroundGlare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.2) 0%, transparent 60%)`;

    const handleMouseMove = (e) => {
        if (!isYellowBoat) return;
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
        mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
    };
    const handleMouseEnter = () => { if (isYellowBoat) isHovering.set(1); };
    const handleMouseLeave = () => {
        if (!isYellowBoat) return;
        mouseX.set(0); mouseY.set(0); isHovering.set(0);
    };

    useMotionValueEvent(pageProgress, "change", (latest) => {
        // If we haven't revealed yet, and we pass the trigger point
        // For the first card, triggerPoint is small (e.g. 0.05)
        if (!isRevealed && latest >= (triggerPoint || 0)) {
            setIsRevealed(true);
        }
    });

    // Helper for brand colors
    const getBrandColor = (d) => {
        switch (d) {
            case 'stage': return BRAND_COLORS.stage;
            case 'screen': return BRAND_COLORS.screens;
            case 'sound': return BRAND_COLORS.sound;
            case 'experiment': return BRAND_COLORS.experiments;
            default: return BRAND_COLORS.purple;
        }
    };

    // Text Colors
    const primaryText = isLightMode ? 'text-brand-ink' : 'text-white';
    const secondaryText = isLightMode ? 'text-brand-ink-body' : 'text-gray-400';

    // Use inline styles for custom hex colors
    const containerStyle = customBgColor ? { backgroundColor: customBgColor } : {};
    const mainBgClass = customBgColor ? '' : 'bg-brand-black';
    const curtainBgClass = customBgColor ? '' : 'bg-brand-black';

    // Layout: Even = Text Left / Image Right
    const isEven = index % 2 === 0;

    const handleNavigate = () => {
        const target = project.id ? `/work/${project.id}` : '/case-study-template';
        if (isConstruction) {
            requestConstructionAccess(target);
        } else if (unlocked || requestAccess(target)) {
            navigate(target);
        }
    };

    return (
        // Grid always enforced: Fixed 60/40 Split
        <div className={`w-full h-full ${mainBgClass} relative overflow-hidden flex flex-col lg:grid ${isEven ? 'lg:grid-cols-[40%_60%]' : 'lg:grid-cols-[60%_40%]'}`} style={containerStyle}>

            {/* TEXT COLUMN */}
            <div className={`relative flex flex-col items-start justify-center px-9 py-12 lg:p-16 pt-12 lg:pt-[96px] z-30 order-2 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                <div className={`max-w-xl ${primaryText} w-full`}>
                    <SectionPreheader
                        text={project.cat || "Project Category"}
                        color="#FFFFFF"
                        textColor="#FFFFFF"
                        customTrigger={isRevealed}
                    />
                    <h2 className="mb-6"><button onClick={handleNavigate} className="text-left text-4xl md:text-5xl lg:text-6xl font-extrabold font-outfit leading-tight cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-purple rounded-md">{project.title}</button></h2>
                    <p className={`text-base md:text-lg ${secondaryText} leading-relaxed mb-8`}>
                        {project.desc}
                    </p>

                    <button
                        type="button"
                        aria-label={`View Case Study for ${project.title}`}
                        onClick={handleNavigate}
                        className={`group/cta inline-flex items-center gap-2 text-[#f1f1f1] text-xs font-bold uppercase tracking-widest cursor-pointer transition-all duration-300 hover:gap-4 hover:opacity-80`}
                    >
                        {isConstruction ? (
                            <>
                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" fill="currentColor" stroke="none" />
                                    <polyline points="12 6 12 12 15.5 15.5" stroke={customBgColor || BRAND_COLORS.dark} strokeWidth="3" fill="none" />
                                </svg>
                                View Case Study
                            </>
                        ) : unlocked ? (
                            <>
                                View Case Study
                                <ArrowRight className="w-5 h-5" />
                            </>
                        ) : (
                            <>
                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M7 10V7a5 5 0 0 1 10 0v3" fill="none" />
                                    <rect x="3" y="10" width="18" height="12" rx="2" fill="currentColor" stroke="none" />
                                    <circle cx="12" cy="16" r="1.5" fill="currentColor" stroke="currentColor" strokeWidth="3" style={{ color: customBgColor || BRAND_COLORS.dark }} />
                                </svg>
                                View Case Study
                            </>
                        )}
                    </button>




                </div>

                {/* DWELL PROGRESS INDICATOR - YELLOW LINE */}

            </div>

            {/* IMAGE COLUMN */}
            <div className={`relative h-full overflow-hidden pt-0 order-1 ${isEven ? 'lg:order-2' : 'lg:order-1'}`} style={{ perspective: "1200px" }}>

                {/* Visual "Curtain" - Now just the permanent image container */}
                <motion.div
                    className={`absolute bottom-0 left-0 right-0 top-0 lg:top-[96px] z-10 ${curtainBgClass} overflow-hidden cursor-pointer group/image focus:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-brand-purple ${isEven ? 'lg:rounded-tl-3xl' : 'lg:rounded-tr-3xl'}`}
                    style={{
                        ...containerStyle,
                        ...(isYellowBoat ? {
                            rotateX,
                            rotateY,
                            scale: scaleAnim,
                            transformStyle: "preserve-3d"
                        } : {})
                    }}
                    onClick={handleNavigate}
                    onMouseMove={handleMouseMove}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    role="presentation"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleNavigate();
                    }}
                >
                    {isYellowBoat && (
                        <motion.div
                            className="absolute inset-0 z-50 pointer-events-none"
                            style={{ background: backgroundGlare, opacity: glareOpacity, transform: "translateZ(1px)" }}
                        />
                    )}

                    {project.img === 'LOGO' ? (
                        <div className="w-full h-full flex items-center justify-center bg-[#141D26]">
                            <div className="relative w-[340px] h-[320px] md:w-[510px] md:h-[480px]">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[120px] md:w-[180px] md:h-[180px] rounded-full" style={{ backgroundColor: BRAND_COLORS.purple }} />
                                <div className="absolute bottom-0 left-0 w-[120px] h-[120px] md:w-[180px] md:h-[180px] rounded-full" style={{ backgroundColor: BRAND_COLORS.blue }} />
                                <div className="absolute bottom-0 right-0 w-[120px] h-[120px] md:w-[180px] md:h-[180px] rounded-full" style={{ backgroundColor: BRAND_COLORS.teal }} />
                            </div>
                        </div>
                    ) : (
                        <motion.img
                            src={project.img}
                            alt={project.title}
                            className="w-full h-full object-cover"
                            style={{
                                objectPosition: project.imgPosition || 'center',
                                ...(isYellowBoat ? { transform: "translateZ(30px) scale(1.1)", transformStyle: "preserve-3d" } : {})
                            }}
                            loading="lazy"
                            decoding="async"
                        />
                    )}
                </motion.div>

            </div>

            {/* GRADIENT METER LINE - Full Width Bottom */}
            {dwellProgress && (
                <div className="absolute bottom-0 left-0 w-full h-[6px] z-50 bg-white/10">
                    <motion.div
                        className="h-full origin-left"
                        style={{ scaleX: dwellProgress, backgroundColor: getBrandColor(project.discipline) }}
                    />
                </div>
            )}

        </div>
    );
};

export default StickyProjectCard;
