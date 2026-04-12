// eslint-disable-next-line no-unused-vars
import { motion, useInView } from "framer-motion";
import React, { useRef, useEffect } from 'react';
const PullQuote = ({ content, attribution, className = "", color }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });

    return (
        <motion.figure
            ref={ref}
            className={`my-6 pl-8 relative ${className}`}
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            {/* Vertical Line with Rounded Ends */}
            <div
                className={`absolute left-0 top-0 bottom-0 w-1 rounded-full ${color ? '' : 'bg-gradient-to-b from-brand-purple via-brand-blue to-brand-teal'}`}
                style={color ? { backgroundColor: color } : {}}
            />

            <blockquote className="text-2xl md:text-3xl font-outfit font-light leading-snug text-brand-ink mb-4">
                {content}
            </blockquote>
            {attribution && (
                <figcaption className="text-sm font-sans font-medium text-brand-ink-muted tracking-wide uppercase">
                    — {attribution}
                </figcaption>
            )}
        </motion.figure>
    );
};

export default PullQuote;
