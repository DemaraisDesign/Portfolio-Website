import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from 'lucide-react';

// --- CONFIG ---
import { BRAND_COLORS } from '../utils/theme';

const COLORS = [BRAND_COLORS.stage, BRAND_COLORS.screens, BRAND_COLORS.white, BRAND_COLORS.sound]; // Purple, Blue, White, Teal
const CYCLE_DURATION = 2800;

const ScrollHint = ({ show }) => {
    const [colorIndex, setColorIndex] = useState(0);

    useEffect(() => {
        if (!show) return;
        const interval = setInterval(() => {
            setColorIndex((prev) => (prev + 1) % COLORS.length);
        }, CYCLE_DURATION);
        return () => clearInterval(interval);
    }, [show]);

    const fgColor = COLORS[colorIndex];
    // Track color logic could be simplified to just white/10 as per original design for cleaner look
    
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="fixed left-1/2 -translate-x-1/2 z-50 pointer-events-none"
                    style={{ bottom: '33%' }}
                >
                    <div className="relative w-[100px] h-[100px] flex items-center justify-center">
                        <AnimationLoop color={fgColor} />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const AnimationLoop = ({ color }) => {
    // TIMING CONSTANTS (Percentages of 2.8s)
    // 1. Wipe Down: 0 -> 0.30
    // 2. Morph:     0.30 -> 0.40
    // 3. Hold:      0.40 -> 0.60
    // 4. Shrink:    0.60 -> 0.70
    // 5. Pop:       0.70 -> 0.90
    // 6. Idle:      0.90 -> 1.00

    const tWipeEnd = 0.30;
    const tMorphEnd = 0.40;
    const tHoldEnd = 0.60;
    const tShrinkEnd = 0.70;
    const tPopEnd = 0.90;

    return (
        <div className="relative w-12 h-24 bg-transparent flex justify-center">
            {/* The Background Track */}
            {/* Adjusted to start 12px down so the circle forms at the top of the line */}
            <motion.div className="absolute w-1 rounded-full bg-white/10" style={{ top: '12px', height: '84px' }} />

            {/* Moving Container (Handles Y-Position) */}
            <motion.div
                className="absolute top-0 w-6 h-6 flex items-center justify-center -ml-3 left-1/2" // 24px container, centered
                animate={{
                    y: [0, 84, 84, 84, 0, 0],
                    color: color,
                }}
                transition={{
                    y: {
                        duration: 2.8,
                        ease: "linear",
                        repeat: Infinity,
                        times: [0, tWipeEnd, tShrinkEnd, 0.701, 0.702, 1]
                    },
                    color: { duration: 0.5 }
                }}
            >
                {/* 1. CIRCLE SHAPE (Explicitly 12px) */}
                <motion.div
                    className="absolute bg-current rounded-full shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                    style={{ width: 12, height: 12 }} // Explicit size
                    animate={{
                        opacity: [1, 1, 0, 0, 0, 1, 1],
                        scale: [1, 1, 1, 0, 0, 1, 1]
                    }}
                    transition={{
                        duration: 2.8,
                        ease: "linear",
                        repeat: Infinity,
                        times: [0, tWipeEnd, tMorphEnd, tShrinkEnd, 0.701, tPopEnd, 1]
                    }}
                />

                {/* 2. ARROW SHAPE (Larger) */}
                <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{
                        opacity: [0, 0, 1, 1, 0, 0],
                        scale: [0.5, 0.5, 1, 1, 0, 0]
                    }}
                    transition={{
                        duration: 2.8,
                        ease: "linear",
                        repeat: Infinity,
                        times: [0, tWipeEnd, tMorphEnd, tHoldEnd, tShrinkEnd, 1]
                    }}
                >
                    <ChevronDown size={24} strokeWidth={4} />
                </motion.div>
            </motion.div>
        </div>
    );
};

export default ScrollHint;
