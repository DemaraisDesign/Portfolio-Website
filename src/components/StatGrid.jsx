// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import React from 'react';

const StatGrid = ({ title, items, className = "", color, theme = "light" }) => {
    const isDark = theme === "dark";

    const containerStyle = isDark
        ? "bg-brand-dark p-6 md:p-8 rounded-2xl border border-gray-800"
        : "";

    const titleStyle = isDark
        ? "text-brand-blue/90"
        : "text-brand-ink/50";

    const dividerColor = isDark ? "#1E293B" : (color || '#E5E7EB');

    const valueStyle = isDark ? "text-white" : "text-brand-ink";
    const labelStyle = isDark ? "text-gray-400" : "text-brand-ink-muted";
    const descStyle = isDark ? "text-brand-ink-muted" : "text-brand-ink-muted";

    return (
        <div className={`space-y-4 ${containerStyle} ${className}`}>
            {title && (
                <div className="mb-4">
                    <h4 className={`text-sm font-sans font-bold uppercase tracking-wider pb-2 ${titleStyle}`}>
                        {title}
                    </h4>
                    <div
                        className="h-[1.5px] w-full rounded-full"
                        style={{ backgroundColor: dividerColor }}
                    />
                </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-1 gap-4 md:gap-6">
                {items.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="flex flex-col"
                    >
                        <span className={`text-lg lg:text-xl font-outfit font-bold leading-tight mb-1 whitespace-pre-line ${valueStyle}`}>
                            {item.value}
                        </span>
                        <span className={`text-sm font-sans font-medium uppercase tracking-wide whitespace-pre-line ${labelStyle}`}>
                            {item.label}
                        </span>
                        {item.desc && (
                            <span className={`text-xs font-sans mt-1 ${descStyle}`}>
                                {item.desc}
                            </span>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default StatGrid;
