// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import React, { useState } from "react";


const PERSONAS = [
    {
        name: "Jenny Bovell",
        tagline: "Los Angeles Artisan Small Business Owner",
        photo: "https://res.cloudinary.com/dqabyzuzf/image/upload/v1774372194/smallbiz_lxskav.png",
        story: {
            text: "Jenny scraped her way to opening a small shop in Highland Park. She was not a business major, and taught herself how to run it as she went. While she's proud of her accomplishments, being an entrepreneur has been more difficult than she could have ever imagined. And she opened her doors two months before Covid lockdowns.",
            bullets: [
                "Former athlete; turned a hobby into a business after a career-ending injury",
                "Needs to control as many of her business functions from home as possible"
            ]
        },
        needs: {
            title: "Needs & Goals",
            items: [
                "Automate as much of her business as possible to concentrate on expanding her customer base",
                "Only wants to deal with software and services that are easy to set up and intuitive to use"
            ]
        },
        challenges: {
            title: "Habits & Challenges",
            text: "Jenny is under a tremendous amount of stress. The struggles of staying afloat over the past couple of years have caused inconsistencies in her organizational systems. She had to convert everything online while maintaining her store lease.",
            bullets: [
                "Covid created a turnover problem, so her employees are often not fully trained",
                "She's not tech savvy, and has zero patience for products with a high learning curve"
            ]
        }
    },
    {
        name: "Rob Matthews",
        tagline: "Chicago Community Theater House Manager",
        photo: "https://res.cloudinary.com/dqabyzuzf/image/upload/a_hflip/v1774372168/charles-braico-cso20230406_043_jxn5bo.jpg",
        story: {
            text: "As the House Manager of a non-profit storefront theater in Chicago, Rob's had a tough year. As his employer struggles to adjust programming to online spaces and outdoor performances, he's constantly worried the theater will shut down permanently. He's now in charge of audience safety during a pandemic.",
            bullets: [
                "Manages audience experiences in a multi-stage theater complex",
                "Overwhelmed with concerns about rapidly changing protocols"
            ]
        },
        needs: {
            title: "Needs & Goals",
            items: [
                "A user-friendly, highly flexible way to display changing content for different theatrical purposes",
                "Aesthetic quality and brand consistency across all digital signage formats"
            ]
        },
        challenges: {
            title: "Habits & Challenges",
            text: "When Rob was hired, he inherited an electronic sign system that was contracted years prior. It's clunky, limited in scope, and often functions incorrectly. As directing audiences is now a matter of safety, the system is a liability.",
            bullets: [
                "Does not like his legacy system, but he at least understands its quirks",
                "Deeply nervous about switching to something unfamiliar, fearful of breaking what barely works"
            ]
        }
    }
];

const PersonaCard = ({ persona, index, accentColor }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
            className={`bg-[#04101A] rounded-[16px] relative group ${expanded ? 'shadow-sm' : ''}`}
            style={{
                border: "1px solid rgba(0,0,0,0.08)",
                backgroundClip: "padding-box",
                transition: "all 0.3s ease"
            }}
        >
            {/* Visual Header */}
            <div className="p-3 pb-0 z-10 relative rounded-t-2xl">
                <div className="relative aspect-[4/3] rounded-[10px] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] mb-6 cursor-pointer" onClick={() => setExpanded(!expanded)}>
                    <img
                        src={persona.photo}
                        alt={persona.name}
                        className="w-full h-full object-cover object-[center_30%] transition-transform duration-1000 ease-out group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 rounded-[10px] pointer-events-none" />
                </div>
                <div className="px-5 pb-8 relative cursor-pointer" onClick={() => setExpanded(!expanded)}>
                    <h3 className="text-3xl lg:text-4xl font-outfit font-light text-white tracking-tight">
                        {persona.name}
                    </h3>
                    <p className="text-[11px] font-sans font-bold text-white/60 uppercase tracking-widest mt-2 leading-relaxed">
                        {persona.tagline}
                    </p>
                </div>

                {/* Split Seam Button */}
                <button
                    onClick={() => setExpanded(!expanded)}
                    aria-expanded={expanded}
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm border border-[#d6dbe0] hover:border-[#56C6FF] hover:shadow-[0_4px_16px_rgba(86,198,255,0.12)] transition-all ease-in-out duration-200 z-20"
                >
                    <motion.svg
                        aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="#16161D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        animate={{ rotate: expanded ? 180 : 0 }}
                        className="w-4 h-4"
                    >
                        <polyline points="4 6 8 10 12 6" />
                    </motion.svg>
                </button>
            </div>

            {/* Expanded Grey Section */}
            <motion.div
                initial={false}
                animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
                transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
                className={`bg-[#F5F7F8] rounded-b-[15px] relative ${!expanded ? "overflow-hidden" : ""}`}
            >
                {/* Curve extending down into the grey */}
                <div className="absolute top-0 left-0 w-full leading-none z-0 pointer-events-none">
                    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-8 sm:h-12 text-[#04101A]">
                        <path d="M 0 0 L 1200 0 Q 600 100 0 0 Z" fill="currentColor" />
                    </svg>
                </div>

                <div className="px-8 pt-14 sm:pt-16 pb-8 relative z-10">

                    {/* Story */}
                    <div className="mb-8">
                        <p className="text-[15px] sm:text-[16px] text-brand-ink leading-[1.7] font-light mb-5">
                            {persona.story.text}
                        </p>
                        <ul className="space-y-3.5">
                            {persona.story.bullets.map((bullet, i) => (
                                <li key={i} className="flex items-start gap-3.5">
                                    <span className="w-1.5 h-1.5 rounded-full mt-[9px] shrink-0 opacity-100" style={{ backgroundColor: accentColor }} />
                                    <span className="text-[14px] text-gray-700 leading-relaxed">{bullet}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Subsections: Needs & Challenges */}
                    <div className="flex flex-col gap-8 mt-auto pt-8 border-t border-black/5">
                        {/* Needs */}
                        <div>
                            <h4 className="text-[11px] font-bold uppercase tracking-widest text-brand-ink mb-4">
                                {persona.needs.title}
                            </h4>
                            <ul className="space-y-3.5">
                                {persona.needs.items.map((item, i) => (
                                    <li key={i} className="flex items-start gap-3.5">
                                        <span className="w-1.5 h-1.5 rounded-full mt-[9px] shrink-0 opacity-100" style={{ backgroundColor: accentColor }} />
                                        <span className="text-[14px] text-gray-700 leading-relaxed">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Challenges */}
                        <div>
                            <h4 className="text-[11px] font-bold uppercase tracking-widest text-brand-ink mb-4">
                                {persona.challenges.title}
                            </h4>
                            <p className="text-[14px] text-gray-700 leading-relaxed mb-4 font-light">
                                {persona.challenges.text}
                            </p>
                            <ul className="space-y-3.5">
                                {persona.challenges.bullets.map((bullet, i) => (
                                    <li key={i} className="flex items-start gap-3.5">
                                        <span className="w-1.5 h-1.5 rounded-full mt-[9px] shrink-0 opacity-100" style={{ backgroundColor: accentColor }} />
                                        <span className="text-[14px] text-gray-700 leading-relaxed">{bullet}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

const PersonaCards = ({ accentColor }) => {
    return (
        <div className="w-full relative z-20">
            {/* Section Label */}
            <div className="flex items-center gap-4 mb-8">
                <div
                    className="w-16 h-16 rounded-full flex items-center justify-center shadow-md ring-[6px] ring-white shrink-0"
                    style={{ backgroundColor: '#04101A' }}
                >
                    <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor" style={{ color: accentColor }}>
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-xl lg:text-2xl font-bold font-outfit text-brand-ink tracking-tight">
                        Personas
                    </h3>
                    <p className="text-[11px] text-[#6e8291] font-bold uppercase tracking-widest mt-1">
                        Display Now
                    </p>
                </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
                {PERSONAS.map((persona, i) => (
                    <PersonaCard
                        key={persona.name}
                        persona={persona}
                        index={i}
                        accentColor={accentColor}
                    />
                ))}
            </div>
        </div>
    );
};

export default PersonaCards;
