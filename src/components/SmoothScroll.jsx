import React, { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import Lenis from 'lenis';

const SmoothScroll = () => {
    const location = useLocation();
    const navType = useNavigationType();
    const lenisRef = React.useRef(null);

    // Scroll Restoration Logic
    useEffect(() => {
        if (navType !== 'POP') {
            // 1. Force Browser Native Scroll
            window.scrollTo(0, 0);

            // 2. Force Lenis Internal Scroll (Immediate)
            if (lenisRef.current) {
                lenisRef.current.scrollTo(0, { immediate: true });
            }
        }
    }, [location, navType]);

    // Lenis Smooth Scroll Initialization
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
        });

        lenisRef.current = lenis;

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
            lenisRef.current = null;
        };
    }, []);

    return null;
};

export default SmoothScroll;
