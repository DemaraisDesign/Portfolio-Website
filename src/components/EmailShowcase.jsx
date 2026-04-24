import { useState, useEffect, useCallback, useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";

// Email data - Cloudinary hosted images
const emails = [
    {
        id: 1,
        image: 'https://res.cloudinary.com/dqabyzuzf/image/upload/f_auto,q_auto/v1770223347/MorganEmail1_kug2zj.jpg',
        title: 'Finance University Launch',
        description: 'Platform launch for “Finance University” which operates under distinct visual guidelines. Designed the hero graphic as well.',
    },
    {
        id: 2,
        image: 'https://res.cloudinary.com/dqabyzuzf/image/upload/f_auto,q_auto/v1770223347/MorganEmail2_nreuyp.jpg',
        title: 'Saving vs. Investing (Part 1)',
        description: 'Educational email for Wealth Management. Side-by-side format comparing saving and investing. The goal: distill dense financial concepts into something scannable without losing accuracy.',
    },
    {
        id: 3,
        image: 'https://res.cloudinary.com/dqabyzuzf/image/upload/f_auto,q_auto/v1770223347/MorganEmail3_abi8qn.jpg',
        title: 'Saving vs. Investing (Part 2)',
        description: 'Second in the series. This one shows what $4,000/year becomes over 30 years: $120K under a mattress, $128K in savings, $338K invested.',
    },
    {
        id: 4,
        image: 'https://res.cloudinary.com/dqabyzuzf/image/upload/f_auto,q_auto/v1770223347/MorganEmail4_cbfspl.jpg',
        title: 'Modular Template System',
        description: 'This is a sample of the numerous templates I created for various departments: hero, intro blocks, two-column cards, three-column icons, event listings. Other teams could build emails without starting from scratch or breaking brand.',
    },
];

const slideVariants = {
    enter: (direction) => ({
        x: direction > 0 ? 300 : -300,
        opacity: 0,
    }),
    center: {
        x: 0,
        opacity: 1,
    },
    exit: (direction) => ({
        x: direction < 0 ? 300 : -300,
        opacity: 0,
    }),
};

const captionVariants = {
    enter: {
        opacity: 0,
        y: 10,
    },
    center: {
        opacity: 1,
        y: 0,
    },
    exit: {
        opacity: 0,
        y: -10,
    },
};

export default function EmailShowcase() {
    const [[activeIndex, direction], setActiveIndex] = useState([0, 0]);
    const [showScrollHint, setShowScrollHint] = useState(true);
    const scrollRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const startY = useRef(0);
    const startScrollTop = useRef(0);
    const startRawX = useRef(0);
    const startRawY = useRef(0);
    const touchStartX = useRef(null);
    const touchStartY = useRef(null);
    const touchEndX = useRef(null);
    const touchEndY = useRef(null);

    const paginate = useCallback((newDirection) => {
        setActiveIndex((prev) => {
            const newIndex = prev[0] + newDirection;
            if (newIndex < 0) return [emails.length - 1, newDirection];
            if (newIndex >= emails.length) return [0, newDirection];
            return [newIndex, newDirection];
        });
        // Reset scroll position when changing slides
        if (scrollRef.current) {
            scrollRef.current.scrollTop = 0;
        }
        setShowScrollHint(true);
    }, []);

    const goToSlide = useCallback((index) => {
        setActiveIndex((prev) => [index, index > prev[0] ? 1 : -1]);
        if (scrollRef.current) {
            scrollRef.current.scrollTop = 0;
        }
        setShowScrollHint(true);
    }, []);

    const handleScroll = useCallback(() => {
        if (scrollRef.current && scrollRef.current.scrollTop > 20) {
            setShowScrollHint(false);
        }
    }, []);

    const handleInteraction = useCallback(() => {
        setShowScrollHint(false);
    }, []);

    // Drag to scroll logic
    const handleMouseDown = (e) => {
        setIsDragging(true);
        startY.current = e.pageY - scrollRef.current.offsetTop;
        startScrollTop.current = scrollRef.current.scrollTop;
        startRawX.current = e.pageX;
        startRawY.current = e.pageY;
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleMouseUp = (e) => {
        setIsDragging(false);
        const diffX = startRawX.current - e.pageX;
        const diffY = startRawY.current - e.pageY;

        // Verify if it was a horizontal swipe intention (horizontal dist > vertical dist)
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            paginate(diffX > 0 ? 1 : -1);
        }
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const y = e.pageY - scrollRef.current.offsetTop;
        const walk = (y - startY.current) * 1.5; // Scroll speed multiplier
        scrollRef.current.scrollTop = startScrollTop.current - walk;
        if (Math.abs(walk) > 5) setShowScrollHint(false);
    };

    // Touch Swipe Logic
    const onTouchStart = (e) => {
        handleInteraction();
        touchEndX.current = null;
        touchStartY.current = null;
        touchStartX.current = e.targetTouches[0].clientX;
        touchStartY.current = e.targetTouches[0].clientY;
    };

    const onTouchMove = (e) => {
        touchEndX.current = e.targetTouches[0].clientX;
        touchEndY.current = e.targetTouches[0].clientY;
    };

    const onTouchEnd = () => {
        if (!touchStartX.current || !touchEndX.current) return;

        const diffX = touchStartX.current - touchEndX.current;
        const diffY = touchStartY.current - touchEndY.current;
        const isHorizontal = Math.abs(diffX) > Math.abs(diffY);

        if (isHorizontal && Math.abs(diffX) > 50) {
            paginate(diffX > 0 ? 1 : -1);
        }
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowLeft') paginate(-1);
            if (e.key === 'ArrowRight') paginate(1);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [paginate]);

    const currentEmail = emails[activeIndex];

    return (
        <div className="flex flex-col items-center w-full">

            {/* iPad Frame */}
            <div className="relative">
                {/* iPad Body */}
                <div
                    className="relative bg-[#1a1a1a] rounded-[3rem] p-3"
                    style={{
                        boxShadow:
                            '0 8px 20px -8px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
                    }}
                >
                    {/* Screen bezel highlight */}
                    <div
                        className="absolute inset-3 rounded-[2.25rem] pointer-events-none"
                        style={{
                            background:
                                'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)',
                        }}
                    />

                    {/* Camera */}
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#2a2a2a] border border-[#333]">
                        <div className="absolute inset-0.5 rounded-full bg-[#1a1a2e]" />
                    </div>

                    {/* Screen */}
                    <div
                        className="relative bg-white rounded-[2rem] overflow-hidden"
                        style={{ width: '425px', height: '600px' }}
                        onMouseEnter={handleInteraction}
                    >
                        {/* Scrollable Email Container */}
                        <AnimatePresence initial={false} custom={direction} mode="wait">
                            <motion.div
                                key={activeIndex}
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    x: { type: 'spring', stiffness: 300, damping: 30 },
                                    opacity: { duration: 0.2 },
                                }}
                                className={`absolute inset-0 overflow-y-auto overflow-x-hidden ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                                ref={scrollRef}
                                data-lenis-prevent
                                onWheel={(e) => e.stopPropagation()}
                                onScroll={handleScroll}
                                onMouseDown={handleMouseDown}
                                onMouseLeave={handleMouseLeave}
                                onMouseUp={handleMouseUp}
                                onMouseMove={handleMouseMove}
                                onTouchStart={onTouchStart}
                                onTouchMove={onTouchMove}
                                onTouchEnd={onTouchEnd}
                                style={{
                                    scrollbarWidth: 'none',
                                    msOverflowStyle: 'none',
                                }}
                            >
                                <style>{`
                    .scroll-container::-webkit-scrollbar {
                      display: none;
                    }
                  `}</style>
                                <img
                                    src={currentEmail.image}
                                    alt={currentEmail.title}
                                    className="w-full h-auto scroll-container select-none"
                                    draggable={false}
                                />
                            </motion.div>
                        </AnimatePresence>

                        {/* Scroll hint indicator */}
                        <AnimatePresence>
                            {showScrollHint && (
                                <>
                                    {/* Semi-transparent white gradient background */}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="absolute bottom-0 left-0 right-0 pointer-events-none"
                                        style={{
                                            height: '150px',
                                            background: 'linear-gradient(to top, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 100%)',
                                            borderRadius: '0 0 2rem 2rem'
                                        }}
                                    />
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none"
                                    >
                                        <motion.div
                                            animate={{ y: [0, 6, 0] }}
                                            transition={{
                                                duration: 1.5,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                            className="flex flex-col items-center gap-1"
                                        >
                                            <div className="px-4 py-1.5 rounded-full flex items-center justify-center" style={{ backgroundColor: '#56C6FF' }}>
                                                <span className="text-brand-ink text-xs font-bold">Scroll to explore</span>
                                            </div>
                                            <svg
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="#56C6FF"
                                            >
                                                <path
                                                    d="M6 9L12 15L18 9"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </motion.div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Home indicator */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 rounded-full bg-[#444]" />
                </div>

                {/* Subtle reflection on desk */}
                <div
                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-4/5 h-8 rounded-full blur-xl opacity-20"
                    style={{
                        background:
                            'linear-gradient(to bottom, #1a1a1a, transparent)',
                    }}
                />
            </div>

            {/* Controls Container (Arrows + Dots) */}
            <div className="flex items-center gap-6 mt-8">
                {/* Left Arrow */}
                <button
                    onClick={() => paginate(-1)}
                    className="group p-2 rounded-full transition-all duration-300 hover:bg-[#56C6FF]/10 focus:outline-none focus:ring-2 focus:ring-[#56C6FF]/50"
                    aria-label="Previous email"
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#16161D"
                        className="transition-colors duration-300"
                    >
                        <path
                            d="M15 18L9 12L15 6"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>

                {/* Dot Navigation */}
                <div className="flex gap-2">
                    {emails.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#56C6FF]/50 focus:ring-offset-2 ${index === activeIndex
                                ? 'bg-[#56C6FF] w-6'
                                : 'bg-[#141D26]/20 hover:bg-[#141D26]/40'
                                }`}
                            aria-label={`Go to email ${index + 1}`}
                            aria-current={index === activeIndex ? 'true' : 'false'}
                        />
                    ))}
                </div>

                {/* Right Arrow */}
                <button
                    onClick={() => paginate(1)}
                    className="group p-2 rounded-full transition-all duration-300 hover:bg-[#56C6FF]/10 focus:outline-none focus:ring-2 focus:ring-[#56C6FF]/50"
                    aria-label="Next email"
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#16161D"
                        className="transition-colors duration-300"
                    >
                        <path
                            d="M9 18L15 12L9 6"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
            </div>


            {/* Caption Area */}
            <div
                className="mt-8 text-center px-4"
                style={{ maxWidth: '500px', minHeight: '150px' }}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeIndex}
                        variants={captionVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                        <h3
                            className="text-xl font-bold text-brand-ink mb-2"
                            style={{ fontFamily: 'Outfit, sans-serif' }}
                        >
                            {currentEmail.title}
                        </h3>
                        <p
                            className="text-base text-brand-ink/70 leading-relaxed"
                            style={{ fontFamily: 'Public Sans, sans-serif' }}
                        >
                            {currentEmail.description}
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
