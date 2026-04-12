import React from 'react';
import { ArrowRight, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';
import { usePasswordGate } from './PasswordGate';
import { useConstructionGate } from './ConstructionGate';
import { BRAND_COLORS } from '../utils/theme';

const THEMES = {
    purple: { text: 'text-brand-purple', groupHover: 'group-hover:text-brand-purple' },
    teal: { text: 'text-brand-teal', groupHover: 'group-hover:text-brand-teal' },
    blue: { text: 'text-brand-blue', groupHover: 'group-hover:text-brand-blue' }
};

const LockIcon = ({ bgColor }) => (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 10V7a5 5 0 0 1 10 0v3" fill="none" />
        <rect x="3" y="10" width="18" height="12" rx="2" fill="currentColor" stroke="none" />
        <circle cx="12" cy="16" r="1.5" fill="currentColor" stroke="currentColor" strokeWidth="3" style={{ color: bgColor }} />
    </svg>
);

const ClockIcon = ({ bgColor }) => (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" fill="currentColor" stroke="none" />
        <polyline points="12 6 12 12 15.5 15.5" stroke={bgColor} strokeWidth="3" fill="none" />
    </svg>
);

const ProjectCard = ({ project, theme = 'blue', customBgColor }) => {
    const navigate = useNavigate();
    const { requestAccess, isProjectUnlocked } = usePasswordGate();
    const { requestConstructionAccess } = useConstructionGate();
    const isCollection = project.type === 'collection';
    const ctaText = isCollection ? 'Explore Collection' : 'View Case Study';
    const unlocked = isProjectUnlocked(project.id);
    const isConstruction = project.isConstruction;
    
    const isYellowBoat = project.id === 'the-yellow-boat';

    // --- 3D Parallax State --- //
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const isHovering = useMotionValue(0);

    const springConfig = { stiffness: 300, damping: 20 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);
    const springHover = useSpring(isHovering, springConfig);

    // X/Y mapping for rotation
    const rotateX = useTransform(springY, [-0.5, 0.5], [12, -12]);
    const rotateY = useTransform(springX, [-0.5, 0.5], [-12, 12]);
    
    // Scale on hover
    const scale = useTransform(springHover, [0, 1], [1, 1.03]);

    // Glare light mapping
    const glareX = useTransform(springX, [-0.5, 0.5], [0, 100]);
    const glareY = useTransform(springY, [-0.5, 0.5], [0, 100]);
    const glareOpacity = useTransform(springHover, [0, 1], [0, 1]);
    const backgroundGlare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.15) 0%, transparent 60%)`;

    const handleMouseMove = (e) => {
        if (!isYellowBoat) return;
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
        mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
    };

    const handleMouseEnter = () => {
        if (!isYellowBoat) return;
        isHovering.set(1);
    };

    const handleMouseLeave = () => {
        if (!isYellowBoat) return;
        mouseX.set(0);
        mouseY.set(0);
        isHovering.set(0);
    };

    const handleNavigate = () => {
        const path = `/work/${project.id}`;
        if (isConstruction) {
            requestConstructionAccess(path);
        } else if (unlocked || requestAccess(path)) {
            navigate(path);
        }
    };

    // Construct dynamic styles for the 3D effect container
    const containerStyle = isYellowBoat ? {
        rotateX,
        rotateY,
        scale,
        transformPerspective: 1200,
        transformStyle: "preserve-3d"
    } : {};

    return (
        <motion.button
            className="flex flex-col group w-full h-full text-left relative"
            onClick={handleNavigate}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={containerStyle}
        >
            {isYellowBoat && (
                <motion.div
                    className="absolute inset-0 z-50 pointer-events-none rounded-theme-sm"
                    style={{ background: backgroundGlare, opacity: glareOpacity, transform: "translateZ(1px)" }}
                />
            )}
            
            <motion.div 
                className="aspect-video relative bg-brand-dark overflow-hidden rounded-t-theme-sm w-full"
                style={isYellowBoat ? { transform: "translateZ(30px)", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" } : {}}
            >
                <img
                    src={project.img}
                    alt={project.title}
                    className={`w-full h-full object-cover transition-transform duration-700 ${isYellowBoat ? '' : 'group-hover:scale-105'}`}
                />
            </motion.div>
            
            <motion.div
                className={`flex-1 flex flex-col justify-between p-6 rounded-b-theme-sm`}
                style={Object.assign(
                    { backgroundColor: customBgColor || BRAND_COLORS.dark },
                    isYellowBoat ? { transform: "translateZ(15px)" } : {}
                )}
            >
                <div>
                    {isCollection && (
                        <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-white mb-4 uppercase tracking-widest">
                            Collection
                        </div>
                    )}
                    <h3 className="text-2xl font-bold font-outfit text-white mb-2">{project.title}</h3>
                    <p className="text-gray-400 font-light text-sm line-clamp-3">{project.desc}</p>
                </div>
                <div className="mt-6 flex items-center gap-2 text-[#f1f1f1]">
                    {isConstruction ? (
                        <>
                            <ClockIcon bgColor={customBgColor || BRAND_COLORS.dark} />
                            <span className={`text-xs font-bold uppercase tracking-widest transition-colors ${THEMES[theme]?.groupHover || THEMES.blue.groupHover}`}>
                                {ctaText}
                            </span>
                        </>
                    ) : unlocked ? (
                        <>
                            <span className={`text-xs font-bold uppercase tracking-widest transition-colors ${THEMES[theme]?.groupHover || THEMES.blue.groupHover}`}>
                                {ctaText}
                            </span>
                            <ArrowRight className={`w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 ${THEMES[theme]?.groupHover || THEMES.blue.groupHover}`} />
                        </>
                    ) : (
                        <>
                            <LockIcon bgColor={customBgColor || BRAND_COLORS.dark} />
                            <span className={`text-xs font-bold uppercase tracking-widest transition-colors ${THEMES[theme]?.groupHover || THEMES.blue.groupHover}`}>
                                {ctaText}
                            </span>
                        </>
                    )}
                </div>
            </motion.div>
        </motion.button>
    );
};

export default ProjectCard;
