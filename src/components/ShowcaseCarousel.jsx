import React, { useState, useCallback } from 'react';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowLeft, ArrowRight } from 'lucide-react';

const slideVariants = {
    enter: (direction) => ({
        x: direction > 0 ? '100%' : '-100%',
        opacity: 0,
        scale: 1.1,
    }),
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1,
        scale: 1,
    },
    exit: (direction) => ({
        zIndex: 0,
        x: direction < 0 ? '100%' : '-100%',
        opacity: 0,
        scale: 0.95,
    })
};

const textVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { delay: 0.1, duration: 0.4, ease: "easeOut" }
    },
    exit: { opacity: 0, y: -5, transition: { duration: 0.2 } }
};

export default function ShowcaseCarousel({ images = [], accentColor = "#000000", className = "" }) {
    const [[page, direction], setPage] = useState([0, 0]);
    const [isDragging, setIsDragging] = useState(false);

    const paginate = useCallback((newDirection) => {
        setPage([page + newDirection, newDirection]);
    }, [page]);

    if (!images || images.length === 0) return null;

    const imageIndex = Math.abs(page % images.length);
    const currentImage = images[imageIndex];

    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset, velocity) => {
        return Math.abs(offset) * velocity;
    };

    return (
        <div className={`w-auto relative group ${className}`}>

            {/* Main Stage - Image Area */}
            <div className="relative aspect-[16/10] bg-brand-light/20 overflow-hidden md:rounded-theme-md">
                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                    <motion.img
                        key={page}
                        src={currentImage.src}
                        alt={currentImage.alt || currentImage.title}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.4 },
                            scale: { duration: 0.6 }
                        }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={1}
                        onDragStart={() => setIsDragging(true)}
                        onDragEnd={(e, { offset, velocity }) => {
                            setIsDragging(false);
                            const swipe = swipePower(offset.x, velocity.x);
                            if (swipe < -swipeConfidenceThreshold) paginate(1);
                            else if (swipe > swipeConfidenceThreshold) paginate(-1);
                        }}
                        className={`absolute inset-0 w-full h-full object-cover ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} select-none`}
                        draggable={false}
                    />
                </AnimatePresence>
            </div>

            {/* Caption & Controls Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mt-8 px-4 md:px-8">

                {/* Text Content */}
                <div className="max-w-2xl mb-4 md:mb-0">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={page}
                            variants={textVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <h3 className="text-2xl md:text-3xl font-outfit font-medium text-brand-ink mb-1">
                                {currentImage.title}
                            </h3>
                            <div className="flex items-center gap-3">
                                <div className="h-[1px] w-8 bg-brand-dark/20" style={{ backgroundColor: accentColor }} />
                                <p className="text-sm font-sans tracking-widest uppercase text-brand-ink/60">
                                    {currentImage.credit}
                                </p>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-8 self-end md:self-auto">
                    {/* Pagination Dots */}
                    <div className="flex gap-2">
                        {images.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setPage([page + (idx - imageIndex), idx > imageIndex ? 1 : -1])}
                                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${idx === imageIndex ? '' : 'bg-brand-dark/20 hover:bg-brand-dark/40'}`}
                                style={{ backgroundColor: idx === imageIndex ? accentColor : undefined }}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>

                    {/* Arrows */}
                    <div className="flex gap-2">
                        <button
                            className="p-3 rounded-full border border-brand-dark/10 hover:bg-brand-dark/5 text-brand-ink transition-colors active:scale-95"
                            onClick={() => paginate(-1)}
                            aria-label="Previous image"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            className="p-3 rounded-full border border-brand-dark/10 hover:bg-brand-dark/5 text-brand-ink transition-colors active:scale-95"
                            onClick={() => paginate(1)}
                            aria-label="Next image"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
