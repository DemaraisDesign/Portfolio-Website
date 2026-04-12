// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import React from 'react';

const Timeline = ({ items, className = "", color }) => {
    return (
        <div className={`relative pl-4 ${className}`}>
            <div className="mb-6 -ml-4">
                <h4 className="text-sm font-sans font-bold uppercase tracking-wider text-brand-ink/50 pb-2 pl-4">
                    Timeline
                </h4>
                <div
                    className="h-[1.5px] w-full rounded-full"
                    style={{ backgroundColor: color || '#E5E7EB' }}
                />
            </div>
            <div className="relative">
                {/* Vertical Spine - starts at first dot */}
                <div
                    className="absolute top-[9px] bottom-0 w-[1.5px] bg-brand-dark/20 rounded-full"
                    style={{ left: '-16.75px' }}
                />

                <div className="space-y-6">
                    {items.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className="relative"
                        >
                            {/* Dot marker with mask */}
                            <div className="absolute -left-[21px] top-[9px] w-2.5 h-2.5 rounded-full bg-white z-10">
                                <div
                                    className="w-full h-full rounded-full border-2 border-white"
                                    style={{ backgroundColor: color || '#6B21A8' }}
                                />
                            </div>

                            <div className="text-lg font-outfit font-bold text-brand-ink">
                                {item.year}
                            </div>
                            <div className="text-sm font-sans text-brand-ink-body leading-snug">
                                {item.desc}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Timeline;
