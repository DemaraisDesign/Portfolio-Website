import { useState, useCallback, useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DebugSpacer } from './LayoutDebugger';



const slideVariants = {
    enter: (direction) => ({
        x: direction > 0 ? 500 : -500,
        opacity: 0,
    }),
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1,
    },
    exit: (direction) => ({
        zIndex: 0,
        x: direction < 0 ? 500 : -500,
        opacity: 0,
    })
};

export default function ProductionCarousel({ images = [], credit = "", accentColor = "#000000" }) {
    const [[page, direction], setPage] = useState([0, 0]);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef(null);

    // We wrap the index to ensure infinite looping logic if needed, 
    // or just clamped logic. Here we use modulo for infinite loop.
    const imageIndex = Math.abs(page % images.length);
    const currentImage = images[imageIndex];

    const paginate = useCallback((newDirection) => {
        setPage([page + newDirection, newDirection]);
    }, [page]);

    // Drag / Swipe Logic matching EmailShowcase but simplified for single Image
    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset, velocity) => {
        return Math.abs(offset) * velocity;
    };

    return (
        <>
            <DebugSpacer id="ProductionCarousel_Top" defaultMobile={60} defaultDesktop={100} />
            <div className="w-full max-w-4xl mx-auto mb-0 space-y-6">

                {/* Carousel Container */}
                <div
                    className="relative bg-brand-light/5 rounded-theme-md overflow-hidden"
                    ref={containerRef}
                >
                    {/* Aspect Ratio / Height container - we let the image define height 
                   but smoothly animate. Since images load dynamically, 
                   we might want a fixed aspect ratio wrapper OR 
                   let framer motion animate height. 
                   For now, we'll use a layout animation on the wrapper.
               */}
                    <div
                        className="group relative w-full aspect-video bg-black/5 overflow-hidden rounded-theme-md isolation-isolate"
                    >
                        <AnimatePresence initial={false} custom={direction}>
                            <motion.img
                                key={page}
                                src={currentImage.src}
                                alt={currentImage.alt}
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    x: { type: "spring", stiffness: 300, damping: 30 },
                                    opacity: { duration: 0.2 }
                                }}
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={1}
                                onDragStart={() => setIsDragging(true)}
                                onDragEnd={(e, { offset, velocity }) => {
                                    setIsDragging(false);
                                    const swipe = swipePower(offset.x, velocity.x);

                                    if (swipe < -swipeConfidenceThreshold) {
                                        paginate(1);
                                    } else if (swipe > swipeConfidenceThreshold) {
                                        paginate(-1);
                                    }
                                }}
                                className={`absolute inset-0 w-full h-full object-cover ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} select-none shadow-sm`}
                                draggable={false}
                            />
                        </AnimatePresence>

                        {/* Overlay Controls */}
                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                            <button
                                className="p-3 bg-black/40 hover:bg-black/60 rounded-full text-white transition-all pointer-events-auto transform hover:scale-110 active:scale-95"
                                onClick={() => paginate(-1)}
                                aria-label="Previous image"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                className="p-3 bg-black/40 hover:bg-black/60 rounded-full text-white transition-all pointer-events-auto transform hover:scale-110 active:scale-95"
                                onClick={() => paginate(1)}
                                aria-label="Next image"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>

                    </div>
                </div>

                {/* Caption & Metadata */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-2 border-t border-brand-dark/10 pt-4">
                    {/* Progress / Dots */}
                    <div className="flex gap-2">
                        {images.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setPage([page + (idx - imageIndex), idx > imageIndex ? 1 : -1])}
                                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${idx === imageIndex
                                    ? ''
                                    : 'bg-brand-dark/20 hover:bg-brand-dark/40'
                                    }`}
                                style={{ backgroundColor: idx === imageIndex ? accentColor : undefined }}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>

                    {/* Caption & Credit */}
                    <div className="flex flex-col items-start md:items-end text-left md:text-right mt-2 md:mt-0">
                        {currentImage?.alt && (
                            <div className="text-sm font-public font-bold text-brand-ink tracking-wide">
                                {currentImage.alt}
                            </div>
                        )}
                        {credit && (
                            <div className="text-xs font-public text-brand-ink/60 tracking-wide mt-1">
                                Photos by <span className="font-semibold" style={{ color: accentColor }}>{credit}</span>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </>
    );
}
