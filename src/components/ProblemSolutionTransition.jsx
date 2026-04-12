import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionPreheader from './SectionPreheader';
import { BRAND_COLORS } from '../utils/theme';
import { DebugSpacer } from './LayoutDebugger';

export default function ProblemSolutionTransition({ color = "#56C6FF" }) {
    const [activeTab, setActiveTab] = useState('problem'); // 'problem' or 'solution'

    const content = {
        problem: {
            title: "Problem",
            text: (
                <>
                    Small business owners and venue managers need a simple, flexible way to manage digital signage across locations, but Display Now's confusing language, restrictive sign-in, and buried features prevent them from even trying the product. <span className="font-bold">Zero of eight test users completed the core task. The platform is losing customers before they can experience its value.</span>
                </>
            ),
            bgColor: BRAND_COLORS.experiments, // #CE4D35 (Red)
            textColor: "#FFFFFF"
        },
        solution: {
            title: "Solution",
            text: (
                <>
                    By clarifying the platform's language, simplifying the information architecture, surfacing the Groups feature as a key differentiator, and introducing a guided onboarding experience, <span className="font-bold">Display Now can remove the barriers between interested users and the product's actual value.</span>
                </>
            ),
            bgColor: BRAND_COLORS.screensDeep, // #04101A (Dark Blue)
            textColor: "#FFFFFF"
        }
    };

    const current = content[activeTab];

    return (
        <section className="w-full relative">
            <div className="w-full flex flex-col relative z-10">

                {/* Section Header (Moved inside the card below) */}
                <DebugSpacer id="ProblemSolution_PreHeaderGap" defaultMobile={2} defaultDesktop={2} />
                <DebugSpacer id="ProblemSolution_HeadlineGap" defaultMobile={20} defaultDesktop={40} />

                {/* Interactive Card */}
                <motion.div
                    layout
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="rounded-[32px] p-8 md:p-12 lg:p-16 shadow-[0_8px_32px_rgba(0,0,0,0.06)] relative overflow-hidden flex flex-col gap-8 md:gap-12"
                    animate={{ backgroundColor: current.bgColor }}
                >
                    {/* Top Bar: Title on left, Switch on right */}
                    <div className="flex flex-col md:flex-row justify-between md:items-start gap-6 relative z-20">
                        {/* Integrated Title text */}
                        <div className="flex flex-col mt-2">
                            <div className="opacity-90"> {/* Slightly reduce opacity to match previous look if desired */}
                                <SectionPreheader text="Core Insights" color={color} textColor="#FFFFFF" align="left" />
                            </div>
                            <h2 className="text-3xl md:text-4xl lg:text-[40px] font-bold font-outfit text-white mb-0 tracking-tight -mt-1">
                                The Pivot
                            </h2>
                        </div>

                        {/* Segmented Control Right-Aligned */}
                        <div className="bg-black/20 p-1.5 rounded-full inline-flex self-start sm:self-auto shadow-inner border border-white/10 shrink-0">
                        <button
                            onClick={() => setActiveTab('problem')}
                            className={`relative px-6 py-2 rounded-full text-sm font-bold tracking-wide transition-colors ${activeTab === 'problem' ? 'text-brand-ink' : 'text-white hover:text-white/80'}`}
                        >
                            {activeTab === 'problem' && (
                                <motion.div
                                    layoutId="activeTabBg"
                                    className="absolute inset-0 bg-white rounded-full shadow-sm"
                                    initial={false}
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10">Problem</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('solution')}
                            className={`relative px-6 py-2 rounded-full text-sm font-bold tracking-wide transition-colors ${activeTab === 'solution' ? 'text-brand-ink' : 'text-white hover:text-white/80'}`}
                        >
                            {activeTab === 'solution' && (
                                <motion.div
                                    layoutId="activeTabBg"
                                    className="absolute inset-0 bg-white rounded-full shadow-sm"
                                    initial={false}
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10">Solution</span>
                        </button>
                    </div>
                    </div>
                    {/* Content Area */}
                    <div className="relative w-full">
                        {/* mode="popLayout" is Framer's native solution for smooth cross-fades of different heights. 
                            It forces the exiting element to become absolute, pulling it out of the flow so the container perfectly molds to the incoming element. */}
                        <AnimatePresence mode="popLayout" initial={false}>
                            {activeTab === 'problem' && (
                                <motion.div
                                    key="problem"
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -15 }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                    className="w-full"
                                >
                                    <div className="text-xl md:text-3xl lg:text-[34px] leading-[1.6] md:leading-[1.5] font-light tracking-tight w-full" style={{ color: content.problem.textColor }}>
                                        <span className="font-bold text-white tracking-widest uppercase text-sm block mb-0 opacity-80">{content.problem.title} Statement</span>
                                        <DebugSpacer id="ProblemSolution_StatementGap" defaultMobile={24} defaultDesktop={24} />
                                        <p>{content.problem.text}</p>
                                    </div>
                                </motion.div>
                            )}
                            {activeTab === 'solution' && (
                                <motion.div
                                    key="solution"
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -15 }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                    className="w-full"
                                >
                                    <div className="text-xl md:text-3xl lg:text-[34px] leading-[1.6] md:leading-[1.5] font-light tracking-tight w-full" style={{ color: content.solution.textColor }}>
                                        <span className="font-bold text-white tracking-widest uppercase text-sm block mb-0 opacity-80">{content.solution.title} Statement</span>
                                        <DebugSpacer id="ProblemSolution_StatementGap" defaultMobile={24} defaultDesktop={24} />
                                        <p>{content.solution.text}</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                </motion.div>

            </div>
        </section>
    );
}
