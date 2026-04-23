import React, { useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import {  AnimatePresence, useScroll, useTransform , motion } from 'framer-motion';
import { BRAND_COLORS } from '../utils/theme';

import StickyScrollingSection from '../components/StickyScroll';
import StickyProjectCard from '../components/StickyProjectCard';
import { ExperimentsIcon } from '../components/AnimatedIcons';
import AnimatedDivider from '../components/AnimatedDivider';
import SectionPreheader from '../components/SectionPreheader';
import PullQuote from '../components/PullQuote';
import { DebugSpacer } from '../components/LayoutDebugger';

import { PROJECTS } from '../data/projects';

const Explorations = () => {
    const DATA = PROJECTS.filter(p => p.discipline === 'experiment');

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
            className="bg-brand-experimentsDeep min-h-screen text-white"
        >
            {/* HERO WRAPPER - Full Bleed Split on Desktop, Stacked on Mobile */}
            <section ref={imageContainerRef} className="relative w-full lg:min-h-[90vh] flex flex-col lg:justify-center overflow-hidden pt-40 md:pt-52 lg:pt-64 bg-white lg:bg-brand-experimentsDeep pb-16 lg:pb-0">

                {/* Desktop Background Image (Right Side) - Hidden on Mobile */}
                <div className="absolute inset-0 z-0 hidden lg:block">
                    <motion.img
                        src="https://res.cloudinary.com/dqabyzuzf/image/upload/v1775484952/Gemini_Generated_Image_jsk16kjsk16kjsk1_od52gy.jpg"
                        alt="Creative Technology Exploration"
                        className="w-full h-full object-cover"
                        style={{
                            objectPosition: "50% 50%",
                            y: yParallax,
                            x: "7vw",
                            scale: 1
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
                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center p-0 shrink-0" style={{ backgroundColor: BRAND_COLORS.experiments }}>
                                    <ExperimentsIcon color="#FFFFFF" speed={1} isPlaying={false} />
                                </div>

                                <span className="text-sm md:text-base font-semibold font-outfit tracking-widest text-brand-ink/60 uppercase">
                                    Explorations<br className="hidden md:block" />
                                    <strong className="font-extrabold text-brand-ink leading-tight block mt-1">AI Statement</strong>
                                </span>
                            </div>

                            <div className="relative mt-4 md:mt-8 mb-12 md:mb-16 pl-2 md:pl-4">
                                <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light font-outfit leading-[1.1] tracking-tight text-brand-ink">
                                    "Every tool carries with it the spirit of the thing it was made to do."
                                </h1>

                                <div className="flex items-center justify-start gap-4 md:gap-6 mt-8 md:mt-12">
                                    <AnimatedDivider width={60} className="h-[3px]" styleContent={{ backgroundColor: BRAND_COLORS.experiments }} />
                                    <p className="text-lg md:text-xl lg:text-2xl font-sans font-semibold tracking-wider text-brand-ink/60">
                                        <em className="italic">Werner Heisenberg</em>
                                    </p>
                                </div>
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
                            src="https://res.cloudinary.com/dqabyzuzf/image/upload/v1775484952/Gemini_Generated_Image_jsk16kjsk16kjsk1_od52gy.jpg"
                            alt="Creative Technology Exploration"
                            className="w-full h-full object-cover"
                            style={{ objectPosition: "50% 50%" }}
                        />
                    </motion.div>
                </div>
            </section >


            {/* ARTIST STATEMENT BODY */}
            <section className="bg-white text-brand-ink px-9 md:px-12 lg:px-24 flex flex-col items-center">
                <DebugSpacer id="Main_Section_Gap_1" defaultMobile={100} defaultDesktop={120} />

                <div className="w-full max-w-3xl mx-auto">
                    <div className="text-lg text-gray-700 leading-relaxed font-sans min-w-0">
                        <React.Fragment>
                            <SectionPreheader text="Philosophies & Ethics" color={BRAND_COLORS.experiments} align="left" />
                            <DebugSpacer id="Explorations_Story_PreHeaderGap" defaultMobile={2} defaultDesktop={2} />
                        </React.Fragment>

                        <h2 className="text-3xl md:text-4xl font-bold font-outfit text-brand-ink mb-0">
                            A Dialogue, Not a Vending Machine
                        </h2>
                        <DebugSpacer id="Explorations_Story_HeadlineGap" defaultMobile={20} defaultDesktop={40} />

                        <p className="m-0">
                            This area of my website isn't just AI-assisted content, but a good deal of it is. The technology is a controversial issue, particularly with creatives. I understand why people are angry and scared. I am too.
                        </p>
                        <DebugSpacer id="Explorations_Story_Paragraph_1" defaultMobile={20} defaultDesktop={30} />

                        <p className="m-0">
                            AI is genuinely disruptive and it's evolving quickly. My honest suspicion is that the people sounding the loudest alarms about job security are going to turn out closer to right than the people waving it off. Despite all this, I personally don't believe this is the end. I think it's the beginning of something profoundly new.
                        </p>
                        <DebugSpacer id="Explorations_Story_Paragraph_2" defaultMobile={20} defaultDesktop={30} />

                        <p className="m-0">
                            Humanity's story is inseparable from its ability to build new tools and adapt to them. Disruptive technologies, even when they threaten the status quo, have a way of opening doors that weren't visible before. Photography looked like it might make painting obsolete. Instead it freed painting from the obligation of pure representation and gave us cinema as a byproduct.
                        </p>
                        <DebugSpacer id="Explorations_Story_Paragraph_4" defaultMobile={20} defaultDesktop={30} />

                        <p className="m-0">
                            Other times the disruption runs deeper than any trade. The printing press didn't threaten a craft so much as a monopoly. For centuries, the written word had been the exclusive property of the Church and the court — controlled, copied, and interpreted by the few. Gutenberg didn't just mechanize a process. He democratized access to knowledge itself, and what eventually poured through that opening were mass literacy, the Reformation, and the Enlightenment.
                        </p>
                        <DebugSpacer id="Explorations_Story_Paragraph_5" defaultMobile={20} defaultDesktop={30} />

                        <p className="m-0">
                            These technologies didn't kill the human impulse to keep reaching. They redirected the energy freed by those efficiencies toward new purposes. The tools we create are the foundations of our evolution as a species.
                        </p>
                        <DebugSpacer id="Explorations_Story_Paragraph_6" defaultMobile={20} defaultDesktop={30} />

                        <p className="m-0">
                            Lewis Mumford, writing at the height of industrialization, warned that we tend to fail in one of two ways: embracing the machine without understanding it, or rejecting it without seeing how much of it we could intelligently assimilate. Almost a century later, those are exactly the two failure modes playing out with AI, with robotics following closely behind.
                        </p>
                        <DebugSpacer id="Explorations_Story_Paragraph_7" defaultMobile={20} defaultDesktop={30} />

                        <p className="m-0">
                            The disruptions are real. Lost livelihoods, copyright regimes that can't keep pace…these are anxieties I feel acutely. But this technology has given me room to explore ideas I wouldn't have had time to reach on my own, and to work at a speed that simply wasn't possible before. As a designer, I can't look at that honestly and pretend it doesn't matter.
                        </p>
                        <DebugSpacer id="Explorations_Story_Paragraph_8" defaultMobile={20} defaultDesktop={30} />

                        <p className="m-0">
                            <strong className="font-bold text-gray-900">My own process starts with something human</strong>…an idea, a rough draft, a sound, a musical idea, a creative direction from me or a client…and uses AI to pressure test it, push it further, experiment, or take it somewhere I wouldn't have found working alone. Then I go back in, refine, and see what the model does with the update. Then the iterative process repeats. My relationship to the tool is a dialogue, not a vending machine.
                        </p>
                        <DebugSpacer id="Explorations_Story_Paragraph_9" defaultMobile={20} defaultDesktop={30} />

                        <p className="m-0">
                            I don't mind the mistakes, the misinterpretations, the hallucinations…these can be gold. Much like staying open to unexpected input when I'm directing or designing sound, some of the most interesting results have come from moments where the model misunderstood my prompt or made an unexpected choice, revealing a path genuinely worth following. That's not a flaw in the process. That's the same thing that happens when a collaborator surprises you.
                        </p>
                        <DebugSpacer id="Explorations_Story_Paragraph_10" defaultMobile={20} defaultDesktop={30} />

                        <p className="m-0">
                            These are my working conclusions and subject to revision. I am always open to feedback if my thinking is not sound.
                        </p>
                    </div>
                </div>
                <DebugSpacer id="Main_Section_Gap_Bottom" defaultMobile={100} defaultDesktop={120} />
            </section>

            <StickyScrollingSection className="" style={{ backgroundColor: BRAND_COLORS.black }}>
                {DATA.map((project, i) => (
                    <StickyProjectCard key={i} index={i} project={project} customBgColor={BRAND_COLORS.experimentsDeep} />
                ))}
            </StickyScrollingSection>


        </motion.div>
    );
};

export default Explorations;
