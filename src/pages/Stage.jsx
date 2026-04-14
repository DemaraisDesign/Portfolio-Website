import React, { useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { useScroll, useTransform, motion } from 'framer-motion';
import { BRAND_COLORS } from '../utils/theme';
import { DebugSpacer } from '../components/LayoutDebugger';

import StickyScrollingSection from '../components/StickyScroll';
import StickyProjectCard from '../components/StickyProjectCard';
import { TheatreIcon } from '../components/AnimatedIcons';
import SectionPreheader from "../components/SectionPreheader";
import AnimatedDivider from '../components/AnimatedDivider';
import PullQuote from '../components/PullQuote';
import AwardCard from '../components/AwardCard';
import StickyAwards from '../components/StickyAwards';
import Footer from "../components/Footer";
import StageLogline from '../components/StageLogline';

import { PROJECTS } from '../data/projects';

const STAGE_AWARDS_DATA = [
    {
        title: "The Secret in the Wings",
        awards: [
            {
                organization: "Scenie Awards (Wins)",
                items: [
                    "Direction of a Play",
                    "Production of a Play"
                ]
            },
            {
                organization: "Stage Raw Awards (Nominations)",
                items: [
                    "Production of the Year",
                    "Best Direction",
                    "Best Sound Design",
                    "Best Ensemble",
                    "Best Lighting Design",
                    "Original Music",
                    "Adaptation"
                ]
            }
        ]
    },
    {
        title: "The Sparrow",
        awards: [
            {
                organization: "Ovation Awards (Nominations)",
                items: [
                    "Direction of a Play",
                    "Sound Design"
                ]
            },
            {
                organization: "Scenie Awards (Wins)",
                items: [
                    "Production of a Play",
                    "Ensemble Cast",
                    "Director of a Play",
                    "Sound Design",
                    "Lighting Design",
                    "Direction of a Drama",
                    "Choreography",
                    "Lead Actress"
                ]
            }
        ]
    },
    {
        title: "The 4th Graders Present an Unnamed Love-Suicide",
        awards: [
            {
                organization: "Ovation Awards (Nominations)",
                items: [
                    "Best Supporting Actress"
                ]
            }
        ]
    }
];

const Stage = () => {
    const RAW_DATA = PROJECTS.filter(p => p.discipline === 'stage');
    
    // Locally override thumbnail images just for the Stage list view
    const DATA = RAW_DATA.map(p => {
        if (p.id === 'coeurage') return { ...p, img: "https://res.cloudinary.com/dqabyzuzf/image/upload/v1774550544/Gemini_Generated_Image_vykcwyvykcwyvykc_kgw1r5.jpg", imgPosition: "75% center" };
        return p;
    });

    // Parallax Setup
    const imageContainerRef = useRef(null);
    const textContainerRef = useRef(null);
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
            className="bg-brand-stageDeep min-h-screen text-white"
        >
            {/* HERO WRAPPER - Full Bleed Split on Desktop, Stacked on Mobile */}
            <section ref={imageContainerRef} className="relative w-full lg:min-h-[90vh] flex flex-col lg:justify-center overflow-hidden pt-40 md:pt-52 lg:pt-64 bg-white lg:bg-brand-stageDeep pb-16 lg:pb-0">

                {/* Desktop Background Image (Right Side) - Hidden on Mobile */}
                <div className="absolute inset-0 z-0 hidden lg:block">
                    <motion.img
                        src="https://res.cloudinary.com/dqabyzuzf/image/upload/v1772168615/Sparrow1COMP_b23kfu.jpg"
                        alt="The Sparrow - Stage Design"
                        className="w-full h-full object-cover"
                        style={{
                            objectPosition: "50% 35%",
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
                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center p-0 shrink-0" style={{ backgroundColor: BRAND_COLORS.stage }}>
                                    <TheatreIcon color="#FFFFFF" speed={1} isPlaying={false} />
                                </div>

                                <span className="text-sm md:text-base font-semibold font-outfit tracking-widest text-brand-ink/60 uppercase">
                                    Artist Statement:<br className="hidden md:block" /> <strong className="font-extrabold text-brand-ink leading-tight block mt-1">Direction for the Stage</strong>
                                </span>
                            </div>

                            <div className="relative mt-4 md:mt-8 mb-12 md:mb-16 pl-2 md:pl-4">
                                <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light font-outfit leading-[1.1] tracking-tight text-brand-ink">
                                    "Piece out our imperfections<br className="hidden md:block" /> with your thoughts."
                                </h1>

                                <div className="flex items-center justify-start gap-4 md:gap-6 mt-8 md:mt-12">
                                    <AnimatedDivider width={60} className="h-[3px]" styleContent={{ backgroundColor: BRAND_COLORS.stage }} />
                                    <p className="text-lg md:text-xl lg:text-2xl font-sans font-semibold tracking-wider text-brand-ink/60">
                                        <span className="block">HENRY V</span>
                                        <em className="italic text-base md:text-lg">William Shakespeare</em>
                                    </p>
                                </div>
                                <motion.button
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => document.getElementById('case-studies')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="inline-block mt-12 md:mt-16 bg-[#16161D]/50 backdrop-blur-[2px] text-white border border-transparent px-8 py-3 rounded-full font-outfit font-medium uppercase tracking-[0.2em] hover:bg-[#050508] hover:border-white/20 hover:text-white transition-all duration-300 focus:ring-1 focus:ring-offset-1 focus:ring-brand-stage focus:outline-none pointer-events-auto cursor-pointer"
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
                            src="https://res.cloudinary.com/dqabyzuzf/image/upload/v1772168615/Sparrow1COMP_b23kfu.jpg"
                            alt="The Sparrow - Stage Design"
                            className="w-full h-full object-cover"
                            style={{ objectPosition: "50% 35%" }}
                        />
                    </motion.div>
                </div>
            </section >

            {/* ARTIST STATEMENT LOGLINE */}
            <StageLogline />

            {/* Main Stage Content */}
            <section className="bg-white text-brand-ink px-9 md:px-12 lg:px-24 flex flex-col items-center">
                <DebugSpacer id="Main_Section_Gap_1" defaultMobile={80} defaultDesktop={120} />

                {/* ARTIST STATEMENT SECTION */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 w-full max-w-4xl mx-auto">

                    {/* Main Text Content (Left on Desktop, Top on Mobile) */}
                    <div ref={textContainerRef} className="lg:col-span-2 text-lg text-gray-700 leading-relaxed font-sans min-w-0">
                        <React.Fragment>
                            <SectionPreheader text="My Story" color={BRAND_COLORS.stage} align="left" />
                            <DebugSpacer id="Stage_Story_PreHeaderGap" defaultMobile={2} defaultDesktop={2} />
                        </React.Fragment>

                        <h2 className="text-3xl md:text-4xl font-bold font-outfit text-brand-ink mb-0">
                            Finding Inspiration in Chicago's Experimental Scene
                        </h2>
                        <DebugSpacer id="Stage_Story_HeadlineGap" defaultMobile={20} defaultDesktop={40} />

                        <p className="m-0">
                            My father was a theatre director of some note in the Detroit area. Growing up around rehearsal rooms gave me an instinctive comfort with the form. What Chicago gave me was a revelation about what the form could do. The directors who truly lit something in me were in that vibrant, experimental theatre scene. Lookingglass's Mary Zimmerman showed me how much narrative weight the human body, light, and sound could bear before a single piece of scenery enters the room. Sean Graney of The Hypocrites, who often design his own sets, showed me the strength of artistic unity.
                        </p>
                        <DebugSpacer id="Stage_Story_Paragraph_1" defaultMobile={20} defaultDesktop={30} />

                        <p className="m-0">
                            The truth is, however, that I had never intended to direct again. At the time my heart was with performing. I helmed a couple of modest summer stock shows growing up in Grosse Pointe, Michigan, and assistant directed The Hypocrites's True West in Chicago. But that time in my life had planted something in me that, while I didn't realize it at the time, was yearning to grow.
                        </p>
                        <DebugSpacer id="Stage_Story_Paragraph_2" defaultMobile={20} defaultDesktop={30} />

                        <p className="m-0">
                            I co-founded Coeurage Theatre Company in Los Angeles with classmates, and spent over a decade helping build an ensemble that earned national recognition on an average production budget of $7,000–$10,000, including rent and rights. I came to directing sideways: a slot opened that needed to be filled, and I stepped in expecting it to be a one-time gig. Honestly, I was terrified.
                        </p>
                        <DebugSpacer id="Stage_Story_Quote_Top" defaultMobile={20} defaultDesktop={30} />

                        <PullQuote 
                            content="I came to directing sideways: a slot opened that needed to be filled, and I stepped in expecting it to be a one-time gig. Honestly, I was terrified."
                            color={BRAND_COLORS.stage}
                        />
                        <DebugSpacer id="Stage_Story_Quote_Bottom" defaultMobile={20} defaultDesktop={30} />

                        <p className="m-0">
                            My first production earned an Ovation Award nomination — Los Angeles's then equivalent of the Tony Awards. The second received effusive press across the board. The third earned me a Best Direction nomination alongside directors from the city's largest institutional theaters. The fourth brought a slew of Stage Raw nominations and another Ovation nomination. <strong className="font-bold text-brand-ink">Stage &amp; Cinema called me "the best director of his age working in Los Angeles."</strong>
                        </p>
                        <DebugSpacer id="Stage_Story_Paragraph_3" defaultMobile={20} defaultDesktop={30} />

                        <p className="m-0">
                            Then a period of deep personal loss, followed by the pandemic and the birth of my child, created a massive gap in my stage work. My practice has since expanded in scope and relocated: I'm now based in Minneapolis and collaborating with the technology and content creators behind the Academy Award-nominated, Emmy-winning Google Spotlight Stories, developing an immersive live XR experience that applies traditional theatre principles to the sonic, visual, and spatial freedoms of the medium.
                        </p>
                        <DebugSpacer id="Stage_Story_Paragraph_4" defaultMobile={0} defaultDesktop={0} />

                        <DebugSpacer id="Stage_Process_SectionGap" defaultMobile={100} defaultDesktop={120} />

                        <React.Fragment>
                            <SectionPreheader text="My Process" color={BRAND_COLORS.stage} align="left" />
                            <DebugSpacer id="Stage_Process_PreHeaderGap" defaultMobile={0} defaultDesktop={0} />
                        </React.Fragment>

                        <h2 className="text-3xl md:text-4xl font-bold font-outfit text-brand-ink mb-0">
                            Expanding from Instincts
                        </h2>
                        <DebugSpacer id="Stage_Process_HeadlineGap" defaultMobile={20} defaultDesktop={40} />

                        <p className="m-0">
                            I begin with instinct. Always.
                        </p>
                        <DebugSpacer id="Stage_Process_Paragraph_0" defaultMobile={20} defaultDesktop={30} />

                        <p className="m-0">
                            <strong className="font-bold text-brand-ink">I read my material repeatedly until I discover an initial instinct:</strong> a moment I can see clearly, that moves me in some way. Those moments become creative anchors. From there, I build outward: visual research, dramaturgical investigation, and tonal sound and visual collages that give my design teams and performers a visceral understanding of how I intend the work to feel before we begin to build it.
                        </p>
                        <DebugSpacer id="Stage_Process_Paragraph_1" defaultMobile={20} defaultDesktop={30} />

                        <p className="m-0">
                            <strong className="font-bold text-brand-ink">I treat transitions as primary narrative events rather than logistical interruptions:</strong> choreographed, cinematic, and designed to carry metaphorical weight. My shows tend to be fluid, and I avoid interruptions of any kind if it’s possible.
                        </p>
                        <DebugSpacer id="Stage_Process_Paragraph_2" defaultMobile={20} defaultDesktop={30} />

                        <p className="m-0">
                            <strong className="font-bold text-brand-ink">I keep my rehearsals and pre-production process open:</strong> I believe deeply that part of my job is to absorb ideas from anyone inspired to put them forward. Designers, crew, actors, the person sweeping up after load-out — the source doesn't change the value of an idea. What matters is whether it serves the project.
                        </p>
                        <DebugSpacer id="Stage_Process_Paragraph_3" defaultMobile={20} defaultDesktop={30} />

                        <p className="m-0">
                            The single most effective moment in any production I've directed wasn't mine. An actress suggested a small, precise change in the timing of a fellow actor's movement in relation to a design element for the final moment of a show. That tiny, subtle change turned the ending from pretty effective to extremely evocative. 
                        </p>
                        <DebugSpacer id="Stage_Process_Paragraph_4" defaultMobile={20} defaultDesktop={30} />

                        <p className="m-0">
                            My background in sound design and performance isn't incidental to how I direct — it's in my structural DNA. It helps me not only understand what serves performers, but how design elements can metaphorically elevate their artistic choices in ways that might otherwise go unexplored.
                        </p>
                    </div>

                    {/* Sidebar Column: Awards (Right on Desktop, Bottom on Mobile) */}
                    <div className="lg:col-span-1 w-full shrink-0 flex flex-col lg:mt-[165px]">
                        <StickyAwards awardsData={STAGE_AWARDS_DATA} containerRef={textContainerRef} />
                    </div>

                </div>
                <DebugSpacer id="Main_Section_Gap_Bottom" defaultMobile={100} defaultDesktop={120} />
            </section>

            <div id="case-studies" />
            <StickyScrollingSection className="" style={{ backgroundColor: BRAND_COLORS.black }}>
                {DATA.map((project, i) => (
                    <StickyProjectCard
                        key={i}
                        index={i}
                        project={project}
                        theme="purple"
                        customBgColor={BRAND_COLORS.stageDeep}
                    />
                ))}
            </StickyScrollingSection>

        </motion.div >
    );
};

export default Stage;
