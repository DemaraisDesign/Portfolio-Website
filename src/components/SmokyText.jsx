import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";
import { audio } from '../utils/AudioEngine';

const SpeakingHeadIcon = ({ isHovered, className, onMouseEnter, onMouseLeave, onClick }) => (
    <motion.div
        layout
        className={`relative inline-flex items-center justify-center transition-transform duration-200 ${className}`}
        initial={false}
        animate={{ scale: isHovered ? 1.05 : 1 }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
    >
        <svg width="1em" height="1em" viewBox="0 0 484 484" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <circle cx="242" cy="242" r="242" className="fill-brand-dark/50 transition-colors duration-300 group-hover:fill-[#050508]" />
            <path d="M379 328.187V284.471C379 275.426 382.43 266.814 387.008 258.98C394.636 245.926 399 230.779 399 214.625C399 165.541 358.706 125.75 309 125.75C259.939 125.75 220.047 164.232 219.02 217.457C218.994 218.838 218.706 220.215 218.138 221.477L199 264L219 273.875C229 308.437 227 318.312 259 318.312C291 318.312 294 313.375 299 298.562" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round" className="stroke-white transition-colors duration-300 group-hover:stroke-white" />
            <path d="M162.962 236.677C147.879 259.085 157.792 288.269 164.633 300.06" strokeWidth="24" strokeLinecap="round" className="stroke-white transition-colors duration-300 group-hover:stroke-white" />
            <path d="M132.725 223.301C111.178 255.312 125.339 297.003 135.113 313.848" strokeWidth="24" strokeLinecap="round" className="stroke-white transition-colors duration-300 group-hover:stroke-white" />
            <path d="M103.336 209.924C75.3252 251.539 93.7344 305.738 106.44 327.635" strokeWidth="24" strokeLinecap="round" className="stroke-white transition-colors duration-300 group-hover:stroke-white" />
        </svg>
    </motion.div>
);

const SmokyText = ({ text = "Demarais.", phonetic = "(dem-uh-RAY).", className = "" }) => {
    const [isHovered, setIsHovered] = useState(false);

    const activeText = isHovered ? phonetic : text;
    const characters = activeText.split('');

    const containerVariants = {
        initial: {},
        animate: {
            transition: {
                staggerChildren: 0.05,
                delayChildren: 0.1
            }
        },
        exit: {
            transition: {
                staggerChildren: 0.02,
                staggerDirection: -1
            }
        }
    };

    const letterVariants = {
        initial: {
            opacity: 0,
            y: 10,
            filter: "blur(12px)",
            scale: 1.5
        },
        animate: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            scale: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        },
        exit: {
            opacity: 0,
            y: -10,
            filter: "blur(12px)",
            scale: 0.8,
            transition: {
                duration: 0.3,
                ease: "easeIn"
            }
        }
    };

    return (
        <motion.span
            layout
            className={`inline-flex items-center gap-3 group relative ${className}`}
            onPointerEnter={(e) => { if (e.pointerType === 'mouse') { setIsHovered(true); audio.playHover(); } }}
            onPointerLeave={(e) => { if (e.pointerType === 'mouse') { setIsHovered(false); } }}
            onClick={(e) => { e.preventDefault(); setIsHovered(!isHovered); audio.playClick(); }}
            transition={{ layout: { duration: 0.3, ease: "easeInOut" } }}
        >
            <motion.span
                layout
                className="inline-block relative whitespace-nowrap cursor-pointer"
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >
                <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                        key={isHovered ? 'phonetic' : 'text'}
                        layout
                        variants={containerVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className={`inline-block ${isHovered ? 'text-[0.65em] tracking-wide align-middle font-bold text-brand-ink' : 'text-brand-ink'}`}
                    >
                        {characters.map((char, index) => (
                            <motion.span
                                key={index}
                                variants={letterVariants}
                                className={`inline-block whitespace-pre ${char === '-' ? 'font-light opacity-60' : ''}`}
                            >
                                {char}
                            </motion.span>
                        ))}
                    </motion.span>
                </AnimatePresence>
            </motion.span>

            <SpeakingHeadIcon
                isHovered={isHovered}
                className="w-[0.75em] h-[0.75em] md:w-[0.65em] md:h-[0.65em] cursor-pointer opacity-80 hover:opacity-100 transition-opacity p-1 -m-1 translate-y-[8%] md:translate-y-0"
            />
        </motion.span>
    );
};

export default SmokyText;
