import React, { useRef } from 'react';
import { BRAND_COLORS } from '../utils/theme';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, useScroll, useTransform, motion } from 'framer-motion';
import { ArrowUpRight, ArrowRight, X } from 'lucide-react';
import { UXIcon } from '../components/AnimatedIcons';
import AnimatedDivider from '../components/AnimatedDivider';
import ProjectCard from '../components/ProjectCard';
import ScreensLogline from '../components/ScreensLogline';
import SectionPreheader from '../components/SectionPreheader';
import { DebugSpacer } from '../components/LayoutDebugger';
import PullQuote from '../components/PullQuote';

// --- ASSETS ---
import { PROJECTS } from '../data/projects';

const Screens = () => {
    const DATA = PROJECTS.filter(p => p.discipline === 'screen');

    // Parallax Setup
    const imageContainerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: imageContainerRef,
        offset: ["start end", "end start"]
    });

    // Subtle, mathematically precise parallax to accommodate 1.06 scale without exposing the black background bleed
    const yParallax = useTransform(scrollYProgress, [0, 1], ["-3%", "3%"]);
    const textContainerRef = useRef(null);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white min-h-screen text-brand-ink pb-32"
        >
            {/* HERO WRAPPER - Full Bleed Split on Desktop, Stacked on Mobile */}
            <section ref={imageContainerRef} className="relative w-full lg:min-h-[90vh] flex flex-col lg:justify-center overflow-hidden pt-40 md:pt-52 lg:pt-64 bg-white lg:bg-brand-screensDeep pb-16 lg:pb-0">

                {/* Desktop Background Image (Right Side) - Hidden on Mobile */}
                <div className="absolute inset-0 z-0 hidden lg:block">
                    <motion.img
                        src="https://res.cloudinary.com/dqabyzuzf/image/upload/v1775078293/hugo-rocha-qFpnvZ_j9HU-unsplash_zwechd.jpg"
                        alt="UX UI Design Feature"
                        className="w-full h-full object-cover"
                        style={{
                            objectPosition: "50% 50%", 
                            y: yParallax,
                            x: "29%", 
                            scale: 1.06
                        }}
                    />
                </div>

                {/* Desktop Curved White Overlay (Left Side) - Hidden on Mobile */}
                <div
                    className="absolute top-[-20%] bottom-[-20%] left-[-15%] xl:left-[-10%] w-[75vw] xl:w-[70vw] z-10 bg-white shadow-[10px_0_30px_rgba(0,0,0,0.15)] hidden lg:block"
                    style={{
                        borderRadius: '0 50% 50% 0 / 0 50% 50% 0'
                    }}
                ></div >

                {/* Content */}
                <div className="relative z-20 w-full px-9 md:px-12 lg:px-24 lg:-translate-y-24 mb-6 lg:mb-0">
                    <div className="max-w-lg md:max-w-2xl lg:max-w-[45%] xl:max-w-[50%]">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-4 md:gap-6 mb-8">
                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center p-0 shrink-0" style={{ backgroundColor: BRAND_COLORS.screens }}>
                                    <UXIcon color="#FFFFFF" speed={0.858} isPlaying={false} />
                                </div>

                                <span className="text-sm md:text-base font-semibold font-outfit tracking-widest text-brand-ink/60 uppercase">
                                    Design Statement<br />
                                    <strong className="font-extrabold text-brand-ink">UX/UI Design & Research</strong>
                                </span>
                            </div>

                            <div className="relative mt-4 md:mt-8 mb-12 md:mb-16 pl-2 md:pl-4">
                                <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light font-outfit leading-[1.1] tracking-tight text-brand-ink">
                                    "The ability to simplify means to eliminate the unnecessary so that the necessary may speak."
                                </h1>

                                <div className="flex items-center justify-start gap-4 md:gap-6 mt-8 md:mt-12">
                                    <AnimatedDivider width={60} className="h-[3px]" styleContent={{ backgroundColor: BRAND_COLORS.screens }} />
                                    <p className="text-lg md:text-xl lg:text-2xl font-sans font-semibold tracking-wider text-brand-ink/60">
                                        <em className="italic">Hans Hofmann</em>
                                    </p>
                                </div>
                                <motion.button
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => document.getElementById('case-studies')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="inline-block mt-12 md:mt-16 bg-[#16161D]/50 backdrop-blur-[2px] text-white border border-transparent px-8 py-3 rounded-full font-outfit font-medium uppercase tracking-[0.2em] hover:bg-[#050508] hover:border-white/20 hover:text-white transition-all duration-300 focus:ring-1 focus:ring-offset-1 focus:ring-brand-screens focus:outline-none pointer-events-auto cursor-pointer"
                                >
                                    Selected work
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </div >

                {/* Mobile Image - Below Text - Hidden on Desktop */}
                <div className="lg:hidden w-full px-9 md:px-12 relative z-20">
                    <motion.div
                        className="w-full aspect-[4/3] md:aspect-video rounded-theme-md overflow-hidden shadow-xl"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <img
                            src="https://res.cloudinary.com/dqabyzuzf/image/upload/v1775078293/hugo-rocha-qFpnvZ_j9HU-unsplash_zwechd.jpg"
                            alt="UX UI Design Feature"
                            className="w-full h-full object-cover"
                            style={{ objectPosition: "50% 50%" }}
                        />
                    </motion.div>
                </div>
            </section>
            {/* ARTIST STATEMENT LOGLINE */}
            <ScreensLogline />

            {/* ARTIST STATEMENT BODY */}
            <section className="bg-white text-brand-ink px-9 md:px-12 lg:px-24 flex flex-col items-center">
                <DebugSpacer id="Main_Section_Gap_1" defaultMobile={80} defaultDesktop={120} />

                <div className="w-full max-w-3xl mx-auto">
                    <div ref={textContainerRef} className="text-lg text-gray-700 leading-relaxed font-sans min-w-0">
                        <React.Fragment>
                            <SectionPreheader text="My Philosophy" color={BRAND_COLORS.screens} align="left" />
                            <DebugSpacer id="Screens_Story_PreHeaderGap" defaultMobile={2} defaultDesktop={2} />
                        </React.Fragment>

                        <h2 className="text-3xl md:text-4xl font-bold font-outfit text-brand-ink mb-0">
                            Empathy and Simplicity Drive Effective Choices
                        </h2>
                        <DebugSpacer id="Screens_Story_HeadlineGap" defaultMobile={20} defaultDesktop={40} />

                        <p className="m-0">
                            Research and discovery is where I'm most alive. That combination of empathetic listening and analytical problem solving. The challenge of sitting with someone and tuning in not just to what they say, but to what they can't quite articulate yet. The spontaneous reactions. The little details about their lives that quietly shape their perspective on everything. I'm drawn to problems without obvious solutions—the ones where you have to look at the challenge from several angles before a novel path appears.
                        </p>
                        <DebugSpacer id="Screens_Story_Quote_Top" defaultMobile={24} defaultDesktop={24} />

                        <PullQuote 
                            content="I'm drawn to problems without obvious solutions—the ones where you have to look at the challenge from several angles before a novel path appears."
                            color={BRAND_COLORS.screens}
                        />
                        <DebugSpacer id="Screens_Story_Quote_Bottom" defaultMobile={24} defaultDesktop={24} />

                        <p className="m-0">
                            The first time I was aware of design was my father's entertainment system remote. It was a labyrinth of multicolored buttons, cryptic labels, modes inside modes. I remember the specific feeling of being a kid who was supposed to be good with technology and still not being able to turn the TV on without help. 
                        </p>
                        <DebugSpacer id="Screens_Story_Paragraph_2" defaultMobile={20} defaultDesktop={30} />
                        
                        <p className="m-0">
                            Years later, the first time I used an iPod, I understood what the remote had been missing. Yes, I realize this is a cliche. But the scroll wheel was a revelation for me. It made something that had been complicated on every other device feel effortless. It stripped away everything that wasn't earning its place. That philosophy made me aware of good industrial design, and is ingrained in how I approach UX. 
                        </p>
                        <DebugSpacer id="Screens_Story_Paragraph_3" defaultMobile={20} defaultDesktop={30} />

                        <p className="m-0">
                            I delight in stripping clutter, solving complex IA problems, and pulling cognitive load off the user wherever it isn't serving them. Then, within those constraints, finding the moments that make an experience feel satisfying, surprising, and intuitive rather than just functional. Clarity is the cake. Delight is the frosting.
                        </p>
                        <DebugSpacer id="Screens_Story_Paragraph_4" defaultMobile={20} defaultDesktop={30} />

                        <p className="m-0">
                            My process in those loops has shifted significantly since AI entered the picture, and will keep shifting as the tools evolve and I learn to harness them more effectively. I use Figma increasingly for low to mid-fidelity work…establishing architecture, spatial relationships, and overall direction. When I have a specific visual idea, it's far more effective to show it than to describe it, so I'll mock it up first and hand that directly to the AI as a reference rather than trying to abstract it into language. Now I start with code with visual references, and go back to tools like Figma to tweak. 
                        </p>
                        <DebugSpacer id="Screens_Story_Paragraph_5" defaultMobile={20} defaultDesktop={30} />

                        <p className="m-0">
                            For complex or animated elements, I tend to prototype in isolation — working with Claude or Gemini to build and refine a specific component until it's exactly right, then bringing that code into the broader project for integration. Prototyping in code lets me see almost precisely what I'll actually get, and iterating is dramatically faster than the traditional design-to-handoff cycle. The gap between what something looks like in Figma and what it looks like built has always been a frustration, and working this way closes it significantly.
                        </p>
                        <DebugSpacer id="Screens_Story_Paragraph_6" defaultMobile={20} defaultDesktop={30} />

                        <p className="m-0">
                            Emerging technologies are where I most want to do this work. The foundational design decisions made now will shape who feels invited in and who feels shut out. <strong className="font-bold text-gray-900">I want to be part of making emerging tech as intuitive, accessible, and empowering as possible, so that nobody, particularly those who feel alienated or intimidated, is left behind.</strong>
                        </p>
                    </div>
                </div>

                {/* Elegant Architectural Divider */}
                <motion.div 
                    className="w-full h-[1px] bg-brand-dark/10 rounded-full mt-24"
                    initial={{ scaleX: 0, opacity: 0 }}
                    whileInView={{ scaleX: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                />

                <DebugSpacer id="Main_Section_Gap_2" defaultMobile={0} defaultDesktop={0} />
            </section>

            {/* NEW GRID LAYOUT SECTION */}
            <section className="w-full px-9 md:px-12 lg:px-24 py-16 lg:py-32 relative z-10">
                {/* Scaled down by 15%: max width reduced from 1600px to 1360px, width kept proportional to 85% on desktop */}
                <div id="case-studies" className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-[1400px] mx-auto scroll-mt-24 md:scroll-mt-[100px]">
                    {DATA.map((project, i) => {
                        let p = project;
                        if (project.id === 'display-now') p = { ...project, img: 'https://res.cloudinary.com/dqabyzuzf/image/upload/v1774880743/Group_148_jszprn.png' };
                        if (project.id === 'morgan-stanley') p = { ...project, img: 'https://res.cloudinary.com/dqabyzuzf/image/upload/v1774880880/ms_yyikni.png' };
                        if (project.id === 'still') p = { ...project, img: 'https://res.cloudinary.com/dqabyzuzf/image/upload/v1775071962/Haiba_1_tweys9.png' };
                        if (project.id === 'solve-24') p = { ...project, img: 'https://res.cloudinary.com/dqabyzuzf/image/upload/v1774881660/Gemini_Generated_Image_ij89q1ij89q1ij89_1_k19alh.png' };
                        if (project.id === 'still-app') p = { ...project, img: 'https://res.cloudinary.com/dqabyzuzf/image/upload/v1774887121/Group_149_muakoe.png' };
                        if (project.id === 'my-portfolio') p = { ...project, img: 'https://res.cloudinary.com/dqabyzuzf/image/upload/v1775590354/Gemini_Generated_Image_tft4jetft4jetft4_nunes5.jpg' };
                        const isLastOdd = i === DATA.length - 1 && DATA.length % 2 === 1;
                        return (
                            <div key={i} className={isLastOdd ? 'md:col-span-2 flex justify-center' : ''}>
                                <div className={isLastOdd ? 'w-full md:max-w-[calc(50%-12px)] lg:max-w-[calc(50%-24px)]' : 'w-full'}>
                                    <ProjectCard project={p} theme="blue" customBgColor={BRAND_COLORS.screensDeep} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

        </motion.div>
    );
};

export default Screens;
