import React, { useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { useScroll, useTransform, motion } from "framer-motion";
import { BRAND_COLORS } from '../utils/theme';
import { audio } from '../utils/AudioEngine';
import { useEffect } from 'react';

const StickyScrollingSection = ({ children, className = "", style = {} }) => {
    // --- CONSTANTS ---
    const TRANSITION_FACTOR = 1.0;
    // BLOCK_SIZE dictates how much "page scroll" separates the start of each card.
    // If BLOCK_SIZE > TRANSITION_FACTOR, we get a "dwell" gap where the card sits still.
    // Let's set BLOCK_SIZE to 2.5 (1.0 enter + 1.5 dwell).
    const BLOCK_SIZE = 2.5;

    // DWELL_FACTOR shifts the whole stack start down? 
    // In previous logic: entryStart = (i-1)*B + D.
    // Let's keep DWELL_FACTOR for initial offset.
    const DWELL_FACTOR = 2.5;

    const ref = useRef(null);
    const content = React.Children.toArray(children);
    const total = content.length;

    // SCROLL HEIGHT:
    // Last card index = total - 1.
    // Last card entry start = (total - 2) * BLOCK_SIZE + DWELL_FACTOR.
    // wait... index 0 enters at 0 (logically).
    // Let's just use a generous height based on blocks.
    const scrollPages = (total) * BLOCK_SIZE + DWELL_FACTOR;

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end end"]
    });

    // Map 0-1 progress to 0-total pages
    const pageProgress = useTransform(scrollYProgress, [0, 1], [0, scrollPages]);

    return (
        <div ref={ref} className={`relative ${className}`} style={{ height: `${(scrollPages + 1) * 100}vh`, ...style }}>
            <div
                className={`sticky top-0 h-screen w-full overflow-hidden ${className.includes('bg-') ? '' : `bg-[${BRAND_COLORS.black}]`}`}
                style={style}
            >
                {content.map((child, i) => (
                    <StickyCardWrapper
                        key={i}
                        index={i}
                        total={total}
                        pageProgress={pageProgress}
                        transitionFactor={TRANSITION_FACTOR}
                        dwellFactor={DWELL_FACTOR}
                        blockSize={BLOCK_SIZE}
                    >
                        {child}
                    </StickyCardWrapper>
                ))}
            </div>
        </div>
    );
};

const StickyCardWrapper = ({ children, index, total, pageProgress, transitionFactor, dwellFactor, blockSize }) => {

    // --- TIMING LOGIC ---

    // Entry Start: When this card starts appearing (sliding up).
    // For index 0, it's always there.
    // For index > 0:
    const entryStart = (index - 1) * blockSize + dwellFactor;

    // Entry End: When this card is fully docked (0vh).
    const entryEnd = entryStart + transitionFactor;

    // Cover Start: When the NEXT card starts entering (sliding up over this one).
    // This card is "exposed" from entryEnd until coverStart.
    const coverStart = index * blockSize + dwellFactor;

    // Shrink/Fade: Happens as the next card covers it.
    // We want it to stay visible until it's mostly covered.
    const shrinkStart = coverStart + (transitionFactor * 0.2); // Start shrinking a bit into the next card's entry
    const shrinkEnd = coverStart + (transitionFactor * 0.9); // Fully gone just before next card finishes entry

    const y = useTransform(
        pageProgress,
        (pp) => {
            if (index === 0) return "0vh"; // Card 0 static at top

            // Before entry:
            if (pp < entryStart) return "100vh";

            // During entry:
            if (pp >= entryStart && pp <= entryEnd) {
                const p = (pp - entryStart) / (transitionFactor);
                // Ease out cubic for smooth specific locking feel? Or linear for direct control?
                // Let's use linear for predictable scroll mapping, 
                // or a slight easeOut to make the "clunk" feel better.
                // For now, linear to ensure exact 1:1 scroll feel.
                return `${100 * (1 - p)}vh`;
            }

            // After entry (Dwell):
            return "0vh";
        }
    );

    // DWELL PROGRESS (Gradient Meter)
    // Should fill from 0 to 1 while the card is sitting still (Locked).
    // Start: entryEnd (Locked)
    // End: coverStart (Next card starts covering)
    // Current logic requires: BLOCK_SIZE > TRANSITION_FACTOR for there to be a gap.
    // With B=2.5 and T=1.0, gap is 1.5.

    const dwellProgress = useTransform(
        pageProgress,
        (pp) => {
            if (pp < entryEnd) return 0;
            if (pp > coverStart) return 1;
            return (pp - entryEnd) / (coverStart - entryEnd);
        }
    );

    // Visibility Optimization
    const visibility = useTransform(pageProgress, (pp) => {
        // ALWAYS show index 0 initially
        if (index === 0 && pp <= shrinkEnd) {
            return "visible";
        }

        // Last card stays visible once entered
        if (index === total - 1) {
            return pp < entryStart - 0.5 ? "hidden" : "visible";
        }

        // Others hide if out of meaningful range
        // Note: entryStart - 0.5 buffer ensures it's ready before sliding in.
        // shrinkEnd ensures it stays visible while being covered.
        if (pp < entryStart - 0.5 || pp > shrinkEnd) {
            return "hidden";
        }
        return "visible";
    });

    const hasTicked = useRef(false);
    useEffect(() => {
        const unsubscribe = pageProgress.on("change", (pp) => {
            if (pp >= entryEnd && !hasTicked.current) {
                audio.playCarouselLock();
                hasTicked.current = true;
            } else if (pp < entryStart && hasTicked.current) {
                hasTicked.current = false; // Reset if we scroll back up
            }
        });
        return unsubscribe;
    }, [pageProgress, entryStart, entryEnd, index]);

    const childWithProps = React.cloneElement(children, {
        dwellProgress,
        pageProgress, // RAW MotionValue
        triggerPoint: index === 0 ? 0 : entryEnd
    });

    const isLast = index === total - 1;
    const effectiveScaleT = useTransform(pageProgress, [shrinkStart, shrinkEnd], [1, 0.9]);
    const effectiveOpacityT = useTransform(pageProgress, [shrinkStart, shrinkEnd], [1, 0]);
    const effectiveOverlayOpacityT = useTransform(pageProgress, [shrinkStart, shrinkEnd], [0, 0.8]);

    const effectiveScale = isLast ? 1 : effectiveScaleT;
    const effectiveOpacity = isLast ? 1 : effectiveOpacityT;
    const effectiveOverlayOpacity = isLast ? 0 : effectiveOverlayOpacityT;

    return (
        <div className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden pointer-events-none">
            <motion.div
                className="w-full h-full flex items-center justify-center pointer-events-auto"
                style={{
                    y,
                    scale: effectiveScale,
                    opacity: effectiveOpacity,
                    zIndex: index,
                    visibility
                }}
            >
                <div className="w-full h-full relative">
                    {childWithProps}
                    {/* Dark Overlay */}
                    <motion.div
                        className="absolute inset-0 bg-black pointer-events-none z-50"
                        style={{ opacity: effectiveOverlayOpacity }}
                    />
                </div>
            </motion.div>
        </div>
    );
};

export default StickyScrollingSection;
