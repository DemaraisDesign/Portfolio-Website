import React, { useRef } from 'react';
import { BRAND_COLORS } from '../utils/theme';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, useScroll, useTransform, motion } from 'framer-motion';


import StickyScrollingSection from '../components/StickyScroll';
import StickyProjectCard from '../components/StickyProjectCard';

import { Waveform } from '../components/AnimatedIcons';
import AnimatedDivider from '../components/AnimatedDivider';
import SoundsLogline from '../components/SoundsLogline';
import SectionPreheader from '../components/SectionPreheader';
import { DebugSpacer } from '../components/LayoutDebugger';
import PullQuote from '../components/PullQuote';

// Updated assets
import { PROJECTS } from '../data/projects';

const Sounds = () => {
    const DATA = PROJECTS.filter(p => p.discipline === 'sound');

    // Parallax Setup
    const imageContainerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: imageContainerRef,
        offset: ["start end", "end start"]
    });

    // Custom offset calculated from dev tool to position image
    const yParallax = useTransform(scrollYProgress, [0, 1], ["calc(-12% + 4vw)", "calc(12% + 4vw)"]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="bg-brand-soundDeep min-h-screen text-white"
        >
            {/* HERO WRAPPER - Full Bleed Split on Desktop, Stacked on Mobile */}
            <section ref={imageContainerRef} className="relative w-full lg:min-h-[90vh] flex flex-col lg:justify-center overflow-hidden pt-40 md:pt-52 lg:pt-64 bg-white lg:bg-brand-soundDeep pb-16 lg:pb-0">

                {/* Desktop Background Image (Right Side) - Hidden on Mobile */}
                <div className="absolute inset-0 z-0 hidden lg:block">
                    <motion.img
                        src="https://res.cloudinary.com/dqabyzuzf/image/upload/v1775157768/Group_203_ugn9ph.png"
                        alt="Sound Design Feature"
                        className="w-full h-full object-cover"
                        style={{
                            objectPosition: "50% 50%",
                            y: yParallax,
                            x: "31vw",
                            scale: 1.2
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
                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center p-0 shrink-0" style={{ backgroundColor: BRAND_COLORS.sound }}>
                                    <Waveform color="#FFFFFF" speed={1} isPlaying={false} />
                                </div>

                                <div className="flex flex-col justify-center uppercase tracking-widest font-outfit text-brand-ink/60 leading-tight">
                                    <span className="text-base md:text-lg font-extrabold text-brand-ink">Sounds</span>
                                    <span className="text-xs md:text-sm mt-0.5">Design Statement</span>
                                </div>
                            </div>

                            <div className="relative mt-4 md:mt-8 mb-12 md:mb-16 pl-2 md:pl-4">
                                <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light font-outfit leading-[1.1] tracking-tight text-brand-ink">
                                    Music is the <span className="font-extrabold" style={{ color: BRAND_COLORS.sound }}>space</span> between the notes.
                                </h1>

                                <div className="flex items-center justify-start gap-4 md:gap-6 mt-8 md:mt-12">
                                    <AnimatedDivider width={60} className="h-[3px]" styleContent={{ backgroundColor: BRAND_COLORS.sound }} />
                                    <p className="text-lg md:text-xl lg:text-2xl font-sans font-semibold tracking-wider text-brand-ink/60">
                                        <em className="italic">Claude Debussy <span className="text-sm font-normal normal-case tracking-normal opacity-70">(possibly)</span></em>
                                    </p>
                                </div>
                                <motion.button
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => document.getElementById('case-studies')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="inline-block mt-12 md:mt-16 bg-[#16161D]/50 backdrop-blur-[2px] text-white border border-transparent px-8 py-3 rounded-full font-outfit font-medium uppercase tracking-[0.2em] hover:bg-[#050508] hover:border-white/20 hover:text-white transition-all duration-300 focus:ring-1 focus:ring-offset-1 focus:ring-brand-sound focus:outline-none pointer-events-auto cursor-pointer"
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
                            src="https://res.cloudinary.com/dqabyzuzf/image/upload/v1775157768/Group_203_ugn9ph.png"
                            alt="Sound Design Feature"
                            className="w-full h-full object-cover"
                            style={{ objectPosition: "50% 50%" }}
                        />
                    </motion.div>
                </div>
            </section >

            {/* ARTIST STATEMENT LOGLINE */}
            <SoundsLogline />

            {/* ARTIST STATEMENT BODY */}
            <section className="bg-white text-brand-ink px-9 md:px-12 lg:px-24 flex flex-col items-center">
                <DebugSpacer id="Main_Section_Gap_1" defaultMobile={80} defaultDesktop={120} />

                <div className="w-full max-w-3xl mx-auto">
                    <div className="text-lg text-gray-700 leading-relaxed font-sans min-w-0">
                        <React.Fragment>
                            <SectionPreheader text="Philosophies & Process" color={BRAND_COLORS.sound} align="left" />
                            <DebugSpacer id="Sounds_Story_PreHeaderGap" defaultMobile={2} defaultDesktop={2} />
                        </React.Fragment>

                        <h2 className="text-3xl md:text-4xl font-bold font-outfit text-brand-ink mb-0">
                            Listen First. Design Second.
                        </h2>
                        <DebugSpacer id="Sounds_Story_HeadlineGap" defaultMobile={20} defaultDesktop={40} />

                        <p className="m-0">
                            For me, the measure of a design is the degree to which audiences stop thinking about the sound and starts living in the story. The choices that land are those that serve the material and the creative team…not those that call attention to themselves.
                        </p>
                        <DebugSpacer id="Sounds_Story_P1" defaultMobile={16} defaultDesktop={24} />

                        <p className="m-0">
                            It starts with the script. I read it the way an actor would—identifying the themes, the story structure and character arcs. By the time I sit down with a director, I've already formed instincts that I'm ready to abandon. Those conversations are some of my favorite parts of the process. 
                        </p>
                        <DebugSpacer id="Sounds_Story_P2" defaultMobile={16} defaultDesktop={24} />

                        <p className="m-0">
                            In my experience directors vary enormously in how much they've considered sound. Some arrive with detailed references; others have an instinct they haven't put words to yet. Both are great starting places.
                        </p>
                        <DebugSpacer id="Sounds_Story_P3" defaultMobile={16} defaultDesktop={24} />

                        <p className="m-0">
                            I'll take anything: a half formed thought, an image, a mood, five seconds of a song…anything. A director once told me she couldn't articulate what she wanted but that it felt like "baseball bats hitting electrified steel drums." I built an entire design from that starting place. The more instinctual and abstract a direction, the more interesting it is to explore. It bypasses the obvious and points somewhere unexpected.
                        </p>
                        <DebugSpacer id="Sounds_Story_Quote_Top" defaultMobile={24} defaultDesktop={24} />

                        <PullQuote 
                            content="A director once told me she couldn't articulate what she wanted but that it felt like &quot;baseball bats hitting electrified steel drums.&quot; I built an entire design from that starting place."
                            color={BRAND_COLORS.sound}
                        />
                        <DebugSpacer id="Sounds_Story_Quote_Bottom" defaultMobile={24} defaultDesktop={24} />

                        <p className="m-0">
                            From there I build sonic collages — layers of found sound and music assembled to capture the tonal world of the script rather than map it literally. Depending on the material it might be languid and atmospheric, or something far more abrasive and rhythmic — whatever serves the emotional world of the script. It's a pitch for a direction, something I can play for a director or a collaborator and ask: does this feel right? I'll often play a version at the first read-through so performers get a sense of the world they're inhabiting.
                        </p>
                        <DebugSpacer id="Sounds_Story_P4" defaultMobile={16} defaultDesktop={24} />

                        <p className="m-0">
                            Because I've spent as much of my career acting and directing as designing, I watch performers differently than many sound designers do. I'm tracking character drives and psychology alongside the cue sheet, and I try to make choices that support that work — sometimes metaphorically, sometimes by simply giving a performer a cue that helps them get where they need to go emotionally.
                        </p>
                        <DebugSpacer id="Sounds_Story_P5" defaultMobile={16} defaultDesktop={24} />

                        <p className="m-0">
                            Then I start building the clearest moments first and begin talking with other designers (particularly lighting) about where our instincts overlap. We talk arcs and how they relate to our choices, pace, tone, transitions, dynamics…it starts to feel like music composition. <strong className="font-bold text-brand-ink">When sound and light are truly working well together they are inseparable.</strong>
                        </p>
                        <DebugSpacer id="Sounds_Story_P6" defaultMobile={16} defaultDesktop={24} />

                        <p className="m-0">
                            And then there's what you don't use. Silence can land harder than any effect or piece of music if used skillfully. Knowing when to pull back, when to let a performer or a lighting shift carry the moment, how to build toward a silence that actually lands…these are often the most challenging and important choices. Some of the most powerful moments in shows I've worked on came from cutting something I was proud of.
                        </p>
                    </div>
                </div>
                
                <DebugSpacer id="Main_Section_Gap_Bottom" defaultMobile={100} defaultDesktop={120} />
            </section>

            {/* Sticky Stack Section */}
            <div id="case-studies" />
            <StickyScrollingSection className="" style={{ backgroundColor: BRAND_COLORS.black }}>
                {DATA.map((project, i) => (
                    <StickyProjectCard
                        key={i}
                        index={i}
                        project={project}
                        theme="teal"
                        customBgColor={BRAND_COLORS.soundDeep}
                    />
                ))}
            </StickyScrollingSection>

        </motion.div>
    );
};

export default Sounds;
