import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import AwardCard from './AwardCard';
import { BRAND_COLORS } from '../utils/theme';

const StickyAwards = ({ awardsData }) => {
    // 1. Group the awards into 'pages'. 
    const ITEMS_PER_PAGE = 1;
    const pages = [];
    for (let i = 0; i < awardsData.length; i += ITEMS_PER_PAGE) {
        pages.push(awardsData.slice(i, i + ITEMS_PER_PAGE));
    }
    const totalPages = pages.length;

    // 2. Interactive Pagination State
    const [activeIndex, setActiveIndex] = useState(0);

    const handleNext = () => {
        setActiveIndex((prev) => (prev + 1) % totalPages);
    };

    const handlePrev = () => {
        setActiveIndex((prev) => (prev - 1 + totalPages) % totalPages);
    };

    // Mobile View: Normally stacked
    const mobileView = (
        <div className="lg:hidden w-full pt-8 pb-12">
            <h3 className="font-outfit font-bold text-2xl text-brand-ink mb-6">
                Awards and Honors
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {awardsData.map((award, i) => (
                    <AwardCard key={i} {...award} />
                ))}
            </div>
        </div>
    );

    // Desktop View: Sticky interactive box
    const desktopView = (
        <div className="hidden lg:block w-full sticky top-28 pt-0">

            {/* Header & Controls Container */}
            <div className="flex flex-col mb-4">
                <h3 className="font-outfit font-bold text-2xl text-brand-ink mb-6">
                    Awards and Honors
                </h3>

                {/* Pagination Controls */}
                <div className="flex items-center justify-between w-full max-w-sm">
                    {/* Left/Right Arrows */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handlePrev}
                            className="p-2 rounded-full border border-brand-dark/10 hover:bg-brand-dark/5 text-brand-ink transition-colors active:scale-95 flex items-center justify-center"
                            aria-label="Previous Award"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            onClick={handleNext}
                            className="p-2 rounded-full border border-brand-dark/10 hover:bg-brand-dark/5 text-brand-ink transition-colors active:scale-95 flex items-center justify-center"
                            aria-label="Next Award"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>

                    {/* Progress Indicators (Dots) */}
                    <div className="flex gap-1.5 items-center opacity-80">
                        {pages.map((_, i) => (
                            <div
                                key={i}
                                className={`w-2 h-2 rounded-full transition-colors duration-300 ${i !== activeIndex ? 'bg-brand-dark/20' : ''}`}
                                style={i === activeIndex ? { backgroundColor: BRAND_COLORS.stage } : {}}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Animated Card Container */}
            <div className="w-full">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="w-full flex flex-col gap-6"
                    >
                        {pages[activeIndex].map((award, i) => (
                            <AwardCard key={`${activeIndex}-${i}`} {...award} />
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );

    return (
        <div className="w-full h-full relative">
            {mobileView}
            {desktopView}
        </div>
    );
};

export default StickyAwards;
