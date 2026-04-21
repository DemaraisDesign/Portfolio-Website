import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import debounce from 'lodash.debounce';
import { BRAND_COLORS } from '../utils/theme';
import NavigationMap from './NavigationMap';
import { audio } from '../utils/AudioEngine';

const LOGO_SIZES = {
  small: { dot: 6, gap: 5, gapY: 4, text: "text-[21px]", containerGap: 8 },
  default: { dot: 8, gap: 7, gapY: 5, text: "text-[28px]", containerGap: 12 },
  large: { dot: 12, gap: 10, gapY: 8, text: "text-[42px]", containerGap: 16 },
};

const DemaraisLogo = ({ className = "", textColor = "", forceWhiteDots = false, size = "default", animateEntrance = false }) => {
  const finalTextColor = textColor || 'text-white';
  const s = LOGO_SIZES[size] || LOGO_SIZES.default;

  // Variants for staggered entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3 // Sync with "I'm Joseph Demarais" start delay
      }
    }
  };

  const dotVariant = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 400, damping: 20 }
    }
  };

  const textVariant = {
    hidden: { opacity: 0.7, x: -10, filter: "blur(0px)" },
    visible: {
      opacity: 1,
      x: 0,
      filter: "blur(0px)",
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <motion.div
      className={`flex items-center ${className}`}
      style={{ gap: s.containerGap }}
      aria-label="Demarais Design Logo"
      variants={animateEntrance ? containerVariants : {}}
      initial={animateEntrance ? "hidden" : "visible"}
      animate={animateEntrance ? "visible" : "visible"}
    >
      <div
        className="grid grid-cols-2 items-center flex-shrink-0"
        style={{ gap: `${s.gapY}px ${s.gap}px` }}
        aria-hidden="true"
      >
        <motion.div
          variants={animateEntrance ? dotVariant : {}}
          className="rounded-full col-span-2 justify-self-center"
          style={{ width: s.dot, height: s.dot, backgroundColor: forceWhiteDots ? BRAND_COLORS.white : BRAND_COLORS.purple }}
        />
        <motion.div
          variants={animateEntrance ? dotVariant : {}}
          className="rounded-full justify-self-end"
          style={{ width: s.dot, height: s.dot, backgroundColor: forceWhiteDots ? BRAND_COLORS.white : BRAND_COLORS.blue }}
        />
        <motion.div
          variants={animateEntrance ? dotVariant : {}}
          className="rounded-full justify-self-start"
          style={{ width: s.dot, height: s.dot, backgroundColor: forceWhiteDots ? BRAND_COLORS.white : BRAND_COLORS.teal }}
        />
      </div>
      <motion.div
        variants={animateEntrance ? textVariant : {}}
        className={`font-outfit font-light ${s.text} tracking-[0.04em] uppercase leading-none ${finalTextColor} transition-colors duration-300`}
      >
        DEMARAIS DESIGN
      </motion.div>
    </motion.div>
  );
};

const HAMBURGER_POSITIONS = [
  { x: 0, y: -12 },
  { x: -14, y: 12 },
  { x: 14, y: 12 }
];

const AnimatedHamburger = ({ isOpen, toggle, isScrolled, buttonRef, isHoveringMenu, reverseColor }) => {
  const location = useLocation();
  const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : true);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  useEffect(() => {
    const handleResize = () => {
        setIsDesktop(window.innerWidth >= 1024);
        setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isStickyPage = ['/sounds', '/screens', '/stage', '/explorations'].includes(location.pathname);

  // Determine closed color:
  // If Scrolled: Match the theme text color (passed or derived).
  // If Not Scrolled (Top):
  //   - Home: White
  //   - Sticky Pages: Dark (because they have white intro sections)


  let closedColorVal = BRAND_COLORS.white;

  if (isScrolled) {
    closedColorVal = BRAND_COLORS.ink;
  } else {
    // If reverseColor is true (force dark menu on white bg), use dark.
    if (reverseColor) {
      closedColorVal = BRAND_COLORS.ink;
    } else if (isStickyPage) {
      // If we are on a sticky page and at the top, we will use mix-blend-difference
      // which requires white dots to invert against whatever is behind it
      closedColorVal = BRAND_COLORS.white;
    } else {
      // Home page at top should be dark
      if (location.pathname === '/') {
        closedColorVal = BRAND_COLORS.ink;
      } else {
        closedColorVal = BRAND_COLORS.white;
      }
    }
  }

  const openColor = BRAND_COLORS.ink;
  const activeHoverColorVal = BRAND_COLORS.white;

  const xColor = (isOpen && isHoveringMenu) ? `text-[${BRAND_COLORS.ink}]` : (isOpen ? "text-white" : `text-[${BRAND_COLORS.ink}]`);

  const getDotVariant = (i) => {
    const startX = HAMBURGER_POSITIONS[i].x;
    const startY = HAMBURGER_POSITIONS[i].y;

    if (isOpen) {
      if (i === 0) {
        return {
          x: [startX, 0, 0],
          y: [startY, 0, 0],
          scale: [1, 1, 4.4],
          opacity: 1,
          backgroundColor: isHoveringMenu ? activeHoverColorVal : openColor,
          transition: {
            x: { duration: 0.6, times: [0, 0.4, 1], ease: "easeInOut" },
            y: { duration: 0.6, times: [0, 0.4, 1], ease: "easeInOut" },
            scale: { duration: 0.6, times: [0, 0.4, 1], ease: "easeInOut" },
            backgroundColor: { duration: 0.2 }
          }
        };
      } else {
        return {
          x: [startX, 0, 0],
          y: [startY, 0, 0],
          scale: 1,
          opacity: [1, 1, 0],
          backgroundColor: isHoveringMenu ? activeHoverColorVal : openColor,
          transition: {
            duration: 0.6, times: [0, 0.4, 1], ease: "easeInOut",
            backgroundColor: { duration: 0.2 }
          }
        };
      }
    } else {
      // Re-entrance / Default state
      return {
        x: startX,
        y: startY,
        scale: 1,
        opacity: 1,
        backgroundColor: closedColorVal,
        transition: { duration: 0.3, delay: 0.2 } // Add Delay to wait for curtain
      };
    }
  };

  const containerSize = "w-16 h-16";

  return (
    <button
      onClick={toggle}
      ref={buttonRef}
      className={`relative ${containerSize} flex items-center justify-center focus:outline-none rounded-full z-[80] cursor-pointer transition-all duration-500`}
      style={{ transform: isMobile ? 'scale(1)' : (isScrolled ? 'scale(1)' : 'scale(1.25)') }}
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={getDotVariant(i)}
            initial={{ x: HAMBURGER_POSITIONS[i].x, y: HAMBURGER_POSITIONS[i].y, scale: 1, opacity: 1, backgroundColor: closedColorVal }}
            className="absolute w-3.5 h-3.5 rounded-full"
          />
        ))}

        <motion.div
          animate={{
            scale: isOpen ? 1 : 0,
            rotate: isOpen ? 0 : -90,
            opacity: isOpen ? 1 : 0
          }}
          transition={{
            delay: isOpen ? 0.4 : 0.2, // Delay closing animation
            duration: 0.3,
            ease: "backOut"
          }}
          className={`absolute z-10 ${xColor} transition-colors duration-200`}
        >
          <X size={24} strokeWidth={3} />
        </motion.div>
      </div>
    </button>
  );
};



const MENU_ITEMS = [
  { label: 'Sound Design', id: '/sounds', color: BRAND_COLORS.sound },
  { label: 'UX/UI Design', id: '/screens', color: BRAND_COLORS.screens },
  { label: 'Direction for Stage', id: '/stage', color: BRAND_COLORS.stage },
  { label: 'Explorations', id: '/explorations', color: BRAND_COLORS.experiments }
];

const Navbar = ({ show = true, reverseColor = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const [isLocked, setIsLocked] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeColor, setActiveColor] = useState(null);
  const menuRef = useRef(null);
  const hamburgerButtonRef = useRef(null);
  const navRef = useRef(null);
  const [clipPathOrigin, setClipPathOrigin] = useState("95% 5");
  const [menuRadius, setMenuRadius] = useState(1500); // Default large value
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const showTimeoutRef = useRef(null);

  // Create a reusable calculation function
  const calculateClipPath = (closing = false) => {
    if (hamburgerButtonRef.current) {
      const rect = hamburgerButtonRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      // If closing, shift down slightly to hit the visual center (centroid) of the dots
      const centerY = rect.top + rect.height / 2 + (closing ? 6 : 0);

      setClipPathOrigin(`${centerX}px ${centerY}px`);

      const corners = [
        { x: 0, y: 0 },
        { x: window.innerWidth, y: 0 },
        { x: window.innerWidth, y: window.innerHeight },
        { x: 0, y: window.innerHeight }
      ];

      let maxDist = 0;
      corners.forEach(corner => {
        const dist = Math.hypot(corner.x - centerX, corner.y - centerY);
        if (dist > maxDist) maxDist = dist;
      });

      setMenuRadius(Math.ceil(maxDist + 50));
    }
  };

  // Basic scroll handler merged into main logic below

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Recalc after layout shift (scrollbar removal) to ensure steady state is correct
      setTimeout(calculateClipPath, 50);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    // Initial calc
    calculateClipPath(isOpen);

    // Ensure clip path grows if browser is resized while menu is open
    // Debounce to improve performance and stop slugishness
    const debouncedCalculateClipPath = debounce(() => calculateClipPath(isOpen), 150);
    const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
        debouncedCalculateClipPath();
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      debouncedCalculateClipPath.cancel();
    };
  }, [isOpen]);

  const handleToggle = () => {
    // 1. Calculate the exact button center NOW
    calculateClipPath(isOpen);

    // 2. Defer the state toggle slightly to allow the clipPathOrigin state to update 
    // and the component to re-render with the new origin BEFORE via AnimatePresence locks the props for exit.
    setTimeout(() => {
      setIsOpen(!isOpen);
      if (!isOpen) {
        audio.playMenuOpen();
      } else {
        audio.playMenuClose();
      }
    }, 10);
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsLocked(true), 0);
    } else {
      setTimeout(() => setActiveColor(null), 0);
    }
  }, [isOpen]);

  useLayoutEffect(() => {
    if (isLocked) {
      const handleTab = (e) => {
        if (e.key === 'Escape') setIsOpen(false);
      };
      window.addEventListener('keydown', handleTab);
      return () => window.removeEventListener('keydown', handleTab);
    }
  }, [isLocked]);

  // Theme Configuration
  // Restoring default behavior: No custom themes for subpages unless specified.

  // Logic:
  // - If Scrolled: White BG + Black Text (Default)
  // - If Top: Transparent BG + Text (White for Home, Black for others)

  const currentTheme = null; // Forces default "white" behavior
  const isStickyPage = ['/sounds', '/stage', '/explorations', '/screens'].includes(location.pathname);

  // Determine if we should apply the mix-blend mode to the hamburger wrapper.
  // Only on sub-pages (isStickyPage), and only when at the very top (!scrolled), and only when closed (!isOpen).
  const useMixBlend = isStickyPage && !scrolled && !isOpen;

  // Let's Refine logic:

  // Final Text Color Determination
  let finalLogoColor = "text-white";
  if (scrolled) {
    finalLogoColor = currentTheme ? currentTheme.text : `text-[${BRAND_COLORS.ink}]`;
  } else {
    // At Top
    if (isStickyPage) {
      finalLogoColor = `text-[${BRAND_COLORS.ink}]`;
    } else if (location.pathname === '/') {
      finalLogoColor = `text-[${BRAND_COLORS.ink}]`; // Force dark on Home top
    }
  }

  let bgStyle = 'bg-transparent';
  let borderStyle = 'border-transparent';
  let shadowStyle = 'shadow-none';
  let backdropStyle = 'none';

  if (scrolled) {
    if (!isVisible) {
      // If hiding (scrolling down), force transparent background immediately so it "evaporates" cleanly.
      bgStyle = 'bg-transparent';
      borderStyle = 'border-transparent';
      shadowStyle = 'shadow-none';
      backdropStyle = 'none';
    } else {
      bgStyle = currentTheme ? currentTheme.bg : 'bg-white/[0.96]';
      borderStyle = currentTheme ? 'border-white/5' : 'border-gray-100'; // Subtle border for dark mode
      shadowStyle = 'shadow-lg';
      backdropStyle = 'blur(24px)';
    }
  }

  // Hamburger Color Logic needs to match
  // We need to pass this down or let Hamburger derive it.
  // Hamburger currently calculates its own colors. 
  // We should probably pass a rigid `color` prop to Hamburger to force it to match Logo.

  // Let's rely on `isScrolled` and `isStickyPage` props in Hamburger for now?
  // No, let's look at AnimatedHamburger.
  // It derives `isStickyPage`.
  // It calculates `closedColorVal`.
  // formatting is tricky there.
  // Let's finish the Navbar props first.

  const navPadding = scrolled ? "py-4" : "py-6";
  const hamburgerSpacerSize = "w-16 h-16";

  useEffect(() => {
    const handleMouseMove = debounce((e) => {
      // Keep visible and cancel hiding if mouse is near top
      if (e.clientY < 100) {
        setIsVisible(true);
        if (showTimeoutRef.current) {
          clearTimeout(showTimeoutRef.current);
          showTimeoutRef.current = null;
        }
      } else {
        // If mouse moves away from top while scrolled down AND no timeout is currently ticking,
        // start the 3.5s dismissal countdown
        if (window.scrollY > 50 && !isOpen && !showTimeoutRef.current) {
          showTimeoutRef.current = setTimeout(() => {
            setIsVisible(false);
            showTimeoutRef.current = null;
          }, 3500);
        }
      }
    }, 50);

    const handleScrollBehavior = debounce(() => {
      // If menu is open, do NOTHING. Stay visible, stable, frozen.
      if (isOpen) {
        setIsVisible(true);
        return;
      }

      const currentScrollY = window.scrollY;
      const threshold = 2; // Reduced for immediate response

      // Update basic scrolled state (for styling)
      setScrolled(currentScrollY > 50);

      // Bounce protection
      if (Math.abs(currentScrollY - lastScrollY.current) < threshold) return;

      // Logic:
      // 1. If at top (< 50), always show.
      // 2. If scrolling DOWN, hide.
      // 3. If scrolling UP, show.
      if (currentScrollY < 50) {
        setIsVisible(true);
        if (showTimeoutRef.current) {
          clearTimeout(showTimeoutRef.current);
          showTimeoutRef.current = null;
        }
      } else if (currentScrollY > lastScrollY.current) {
        // Scrolling Down
        if (!isOpen) setIsVisible(false);
        if (showTimeoutRef.current) {
          clearTimeout(showTimeoutRef.current);
          showTimeoutRef.current = null;
        }
      } else {
        // Scrolling Up
        setIsVisible(true);
        if (showTimeoutRef.current) {
          clearTimeout(showTimeoutRef.current);
        }
        showTimeoutRef.current = setTimeout(() => {
          setIsVisible(false);
          showTimeoutRef.current = null;
        }, 3500);
      }

      lastScrollY.current = currentScrollY;
    }, 10, { leading: true, maxWait: 50 });

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScrollBehavior, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScrollBehavior);
      handleMouseMove.cancel();
      handleScrollBehavior.cancel();
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
    };
  }, [isOpen]);



  return (
    <>
      <motion.div
        className="fixed top-0 right-0 left-0 z-40"
        initial={{
          opacity: 0,
          y: -20
        }}
        animate={{
          opacity: isVisible ? 1 : 0,
          y: isVisible ? 0 : -20
        }}
        transition={{ duration: isVisible ? 0.8 : 0.2, ease: "easeInOut" }}
        style={{
          pointerEvents: isVisible ? "auto" : "none",
          willChange: "opacity, transform",
          transform: "translateZ(0)"
        }}
      >
        <nav
          ref={navRef}
          role="navigation"
          aria-label="Main navigation"
          className={`w-full ${navPadding} ${bgStyle} border-b ${borderStyle} ${shadowStyle} ${!show ? 'opacity-0' : ''} transition-all duration-500 ease-in-out`}
          style={{ backdropFilter: backdropStyle }}
        >
          <div className="w-full px-9 md:px-12 lg:px-24 flex justify-between items-center">
            {/* LOGO CONTAINER */}
            <Link to="/">
              <DemaraisLogo
                key={show}
                size={isMobile ? "small" : "default"}
                textColor={finalLogoColor}
                animateEntrance={true}
              />
            </Link>
            <div className={`${hamburgerSpacerSize} pointer-events-none`} />
          </div>
        </nav>
      </motion.div>

      <motion.div
        className={`fixed top-0 right-0 left-0 z-[90] ${useMixBlend ? 'mix-blend-difference' : ''}`}
        initial={{
          opacity: 0,
          y: -20
        }}
        animate={{
          opacity: isVisible ? 1 : 0,
          y: isVisible ? 0 : -20
        }}
        transition={{ duration: isVisible ? 0.8 : 0.2, ease: "easeInOut" }}
        style={{
          pointerEvents: "none",
          willChange: "opacity, transform"
        }}
      >
        <div className={`w-full px-9 md:px-12 lg:px-24 flex justify-end ${navPadding}`} style={{ transition: 'padding 500ms ease-in-out' }}>
          <motion.div
            key={show}
            className="pointer-events-auto"
            initial={{ scale: 0, opacity: 0.75, rotate: 180, filter: "blur(1px)" }}
            animate={isVisible && show ? { scale: 1, opacity: 1, rotate: 0, filter: "blur(0px)" } : { scale: 0, opacity: 0, rotate: 180, filter: "blur(1px)" }}
            transition={{
              duration: 0.8,
              ease: [0.34, 1.56, 0.64, 1], // Spring-like feel
              delay: 0.3 // Slight delay to stagger after logo
            }}
          >
            <AnimatedHamburger
              isOpen={isOpen}
              toggle={handleToggle}
              isScrolled={scrolled}
              buttonRef={hamburgerButtonRef}
              isHoveringMenu={!!activeColor}
              reverseColor={reverseColor}
            />
          </motion.div>
        </div>
      </motion.div>

      <AnimatePresence onExitComplete={() => setIsLocked(false)}>
        {isOpen && (
          <motion.div
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Main menu"
            initial={{ clipPath: `circle(0px at ${clipPathOrigin})` }}
            animate={{
              clipPath: `circle(${menuRadius}px at ${clipPathOrigin})`,
              transition: { clipPath: { duration: 0.6, ease: "easeInOut", delay: 0.35 } }
            }}
            exit={{
              clipPath: `circle(0px at ${clipPathOrigin})`,
              transition: { duration: 0.5, ease: "easeInOut" }
            }}
            className="fixed inset-0 z-[70] flex flex-col items-center overflow-y-auto overflow-x-hidden"
          >
            <div
              className="fixed inset-0 z-0 transition-colors duration-300 ease-in-out"
              style={{ backgroundColor: activeColor || BRAND_COLORS.light }}
            />

            <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navPadding} border-b border-transparent`}>
              <div className="w-full fluid-px flex justify-between items-center">
                <Link to="/" onClick={() => setIsOpen(false)} className="relative block">
                  <DemaraisLogo
                    size={isMobile ? "small" : "default"}
                    textColor={activeColor ? 'text-white' : `text-[${BRAND_COLORS.dark}]`}
                    forceWhiteDots={!!activeColor}
                    animateEntrance={false}
                  />
                </Link>
                <div className={`${hamburgerSpacerSize} pointer-events-none`} />
              </div>
            </div>

            <div
              className="relative z-10 w-full flex-shrink-0 flex items-center justify-center pt-20 md:pt-24 pb-8"
              style={{ height: isMobile ? '100dvh' : 'max(100vh, 750px)' }}
            >
              <NavigationMap closeMenu={() => setIsOpen(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
