// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import React from 'react';

const ImpactList = ({ items, color = '#3B82F6', theme = 'light' }) => {
    const isDark = theme === 'dark';
    return (
        <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                {items.map((item, index) => (
                    <motion.div
                        key={index}
                        className={`p-6 md:p-8 rounded-2xl relative group ${isDark ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-100 shadow-sm'}`}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                    >
                        <div>
                            <span
                                className="block text-4xl md:text-5xl font-outfit font-extrabold mb-2 tracking-tight"
                                style={{ color: color }}
                            >
                                {item.value}
                            </span>
                            {item.label && (
                                <h3 className={`text-sm font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-white/70' : 'text-brand-ink-body'}`}>
                                    {item.label}
                                </h3>
                            )}
                            <p className={`text-sm leading-relaxed font-medium ${isDark ? 'text-white/90' : 'text-brand-ink-body'}`}>
                                {item.description}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default ImpactList;
