// eslint-disable-next-line no-unused-vars
import { motion, useInView } from "framer-motion";
import React, { useRef, useEffect } from 'react';
import { audio } from '../utils/AudioEngine';

const AnimatedDivider = ({ className = "", width = 96, styleContent = {} }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
    // If a custom background color is provided, don't apply the default gradient class
    const hasCustomBg = styleContent.backgroundColor || styleContent.background;
    const gradientClass = hasCustomBg ? "" : "bg-gradient-to-r from-brand-purple via-brand-blue to-brand-teal";

    useEffect(() => {
        if (isInView) audio.playPreheadPing();
    }, [isInView]);

    return (
        <motion.div
            ref={ref}
            initial={{ width: 0 }}
            animate={{ width: isInView ? width : 0 }}
            transition={{ duration: 1, ease: "circOut" }}
            className={`h-1 rounded-full ${gradientClass} ${className}`}
            style={styleContent}
        />
    );
};

export default AnimatedDivider;
