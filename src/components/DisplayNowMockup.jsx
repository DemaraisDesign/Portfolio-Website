import React from 'react';
import { DebugSpacer } from './LayoutDebugger';

const DisplayNowMockup = ({ color = "#56C6FF" }) => {
    return (
        <>
            <DebugSpacer id="DisplayNowMockup_Top" defaultMobile={25} defaultDesktop={50} />

            {/* Interactive Header & Instructions Container (Full Width Bleed) */}
            <div className="-mx-6 md:-mx-12 lg:-mx-24 w-[calc(100%+3rem)] md:w-[calc(100%+6rem)] lg:w-[calc(100%+12rem)]">

                {/* Title Header matches PersonaCards styling */}
                <div className="flex items-center gap-4">
                    <div
                        className="w-16 h-16 rounded-full flex items-center justify-center shadow-md ring-[6px] ring-white shrink-0 bg-[#04101A]"
                    >
                        {/* Interactive gesture icon */}
                        <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor" style={{ color: color }}>
                            <path d="M9 11.24V7.5C9 6.12 10.12 5 11.5 5S14 6.12 14 7.5v3.74c1.21-.81 2-2.18 2-3.74C16 5.01 13.99 3 11.5 3S7 5.01 7 7.5c0 1.56.79 2.93 2 3.74zm9.84 4.63l-4.54-2.26c-.17-.07-.35-.11-.54-.11H13v-6c0-.83-.67-1.5-1.5-1.5S10 6.67 10 7.5v10.74l-3.43-.72c-.08-.01-.15-.03-.24-.03-.31 0-.59.13-.79.33l-.79.8 4.94 4.94c.27.27.65.44 1.04.44h6.79c.75 0 1.33-.55 1.44-1.28l.75-5.27c.01-.07.02-.14.02-.2 0-.62-.38-1.16-.91-1.38z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-xl lg:text-2xl font-bold font-outfit text-brand-ink tracking-tight">
                            Prototype
                        </h3>
                        <p className="text-[11px] text-[#6e8291] font-bold uppercase tracking-widest mt-1">
                            Interactive Experience
                        </p>
                    </div>
                </div>

                <DebugSpacer id="DisplayNowMockup_HeaderGap" defaultMobile={20} defaultDesktop={40} />

                {/* Introductory Paragraph */}
                <div className="w-full text-[16px] text-brand-ink leading-[1.7] font-light flex flex-col gap-4">
                    <p>
                        The redesigned Display Now prototype delivered a simplified sign-up flow, a consistent brand voice, a prominent Groups feature, a preview function, and a first-use tutorial all built on a refreshed visual identity that matched the friendly, approachable tone we'd written throughout.
                    </p>
                    <p>
                        <strong className="font-bold">My roles:</strong> I led <strong className="font-bold">user research</strong> (8 usability tests, 6 interviews), <strong className="font-bold">information architecture</strong>, <strong className="font-bold">layout restructuring</strong>, and all <strong className="font-bold">UX writing</strong> including the homepage, onboarding tutorial, and product voice. The prototype below reflects the full team's work.
                    </p>
                </div>

                <DebugSpacer id="DisplayNowMockup_IntroGap" defaultMobile={40} defaultDesktop={50} />

            </div>

            <DebugSpacer id="DisplayNowMockup_InstructionGap" defaultMobile={0} defaultDesktop={0} />

            <div className="flex flex-col items-center justify-center mb-0 -mx-6 md:-mx-12 lg:-mx-24 w-[calc(100%+3rem)] md:w-[calc(100%+6rem)] lg:w-[calc(100%+12rem)] relative">

                <DebugSpacer id="DisplayNowMockup_InnerTop" defaultMobile={40} defaultDesktop={25} />

                {/* Unified Fused Block */}
                <div className="w-full rounded-xl shadow-[0_40px_80px_rgba(0,0,0,0.1)] border border-gray-200 overflow-hidden flex flex-col">

                    {/* Top half: Instructions */}
                    <div className="w-full bg-white p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-start relative border-b border-gray-200/80">
                        <div className="flex-1">
                            <h4 className="text-[13px] font-bold uppercase tracking-widest text-brand-ink mb-3">
                                Prototype Scenario
                            </h4>
                            <p className="text-[15px] sm:text-[16px] text-gray-700 leading-[1.7] font-light mb-4">
                                You're new to this website. Explore what it has to offer, then sign up for an account with an email. See if you can create a playlist using the <code className="text-[13px] bg-black/5 rounded px-1.5 py-0.5 font-mono text-gray-800">Open.png</code> image file and preview it.
                            </p>
                            <p className="text-[13px] text-brand-ink-muted font-medium flex items-center gap-2">
                                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className="opacity-70">
                                    <path d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z" />
                                </svg>
                                Best experienced on a laptop or desktop screen.
                            </p>
                        </div>
                    </div>

                    {/* Bottom half: Figma Prototype */}
                    <div className="w-full aspect-video bg-[#F2F2F2] relative">
                        <iframe
                            className="w-full h-full border-none absolute inset-0"
                            src="https://embed.figma.com/proto/U3FHzR2KtcQGSPbS5GbNWO/Display-Now-for-Portfolio?page-id=335%3A2558&node-id=335-2559&p=f&viewport=1924%2C61%2C0.21&scaling=scale-down&content-scaling=fixed&starting-point-node-id=335%3A2559&embed-host=share"
                            allowFullScreen
                            title="Display Now Figma Prototype"
                        ></iframe>
                    </div>
                </div>

                <DebugSpacer id="DisplayNowMockup_InnerBottom" defaultMobile={20} defaultDesktop={50} />
            </div>
        </>
    );
};

export default DisplayNowMockup;
