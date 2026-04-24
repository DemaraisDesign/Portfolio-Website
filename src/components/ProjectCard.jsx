import React from 'react';
import { ArrowRight, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePasswordGate } from './PasswordGate';
import { useConstructionGate } from './ConstructionGate';
import { BRAND_COLORS } from '../utils/theme';
import { audio } from '../utils/AudioEngine';

const THEMES = {
    purple: { text: 'text-brand-purple', groupHover: 'group-hover:text-brand-purple-light' },
    teal: { text: 'text-brand-teal', groupHover: 'group-hover:text-brand-teal-light' },
    blue: { text: 'text-brand-blue', groupHover: 'group-hover:text-brand-blue-light' }
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
    const ctaText = isCollection ? 'Explore Collection' : 'View work';
    const unlocked = isProjectUnlocked(project.id);
    const isConstruction = project.isConstruction;

    const handleNavigate = () => {
        const path = `/work/${project.id}`;
        if (isConstruction) {
            requestConstructionAccess(path);
        } else if (unlocked || requestAccess(path)) {
            navigate(path);
        }
    };

    return (
        <motion.button
            className="flex flex-col group w-full h-full text-left relative"
            onClick={(e) => { audio.playClick(); handleNavigate(); }}
            onMouseEnter={() => { audio.playDeepHover(); }}
        >
            <motion.div 
                className="aspect-video relative bg-brand-dark overflow-hidden rounded-t-theme-sm w-full"
            >
                <img
                    src={project.img}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
            </motion.div>
            
            <motion.div
                className={`flex-1 flex flex-col justify-between p-6 rounded-b-theme-sm`}
                style={{ backgroundColor: customBgColor || BRAND_COLORS.dark }}
            >
                <div>
                    {isCollection && (
                        <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-white mb-4 uppercase tracking-widest">
                            Collection
                        </div>
                    )}
                    <h3 className="text-2xl font-bold font-outfit text-white mb-2">{project.title}</h3>
                    <p className="text-gray-400 font-light text-sm line-clamp-3 min-h-[60px]">{project.desc}</p>
                </div>
                <div className="mt-6 flex items-center gap-2 text-[#f1f1f1]">
                    {isConstruction ? (
                        <>
                            <ClockIcon bgColor={customBgColor || BRAND_COLORS.dark} />
                            <span className={`text-xs font-bold uppercase tracking-widest transition-colors ${THEMES[theme]?.groupHover || THEMES.blue.groupHover}`}>
                                Under Construction
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
