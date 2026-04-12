import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Maximize2, Minimize2 } from 'lucide-react';
import SectionPreheader from './SectionPreheader';
import { DebugSpacer } from './LayoutDebugger';

const ArchiveMockup = ({ src, title, description, color }) => {
    const [isInteractive, setIsInteractive] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { amount: 0 });

    useEffect(() => {
        if (!isInView && isInteractive) {
            setIsInteractive(false);
        }
    }, [isInView, isInteractive]);

    useEffect(() => {
        if (isFullscreen) {
            document.body.style.overflow = 'hidden';
            setIsInteractive(true); // Auto-interact when fullscreen
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isFullscreen]);

    return (
        <>
            <DebugSpacer id="ArchiveMockup_Top" defaultMobile={60} defaultDesktop={100} />
            <div
                ref={containerRef}
                className="flex flex-col items-center justify-center mb-0 -mx-6 md:-mx-12 lg:-mx-24 w-[calc(100%+3rem)] md:w-[calc(100%+6rem)] lg:w-[calc(100%+12rem)] relative"
            >
                <div className="w-full bg-brand-light p-8 md:p-12 rounded-none lg:rounded-theme-md border-y lg:border border-gray-100/60 shadow-sm relative text-left box-border">
                    <SectionPreheader text="Record" color={color || '#FF8A00'} />

                    {/* Header / Label Block */}
                    <div className="w-full flex flex-col mb-8 md:mb-10 gap-2">
                        <div>
                            {title && <h3 className="text-2xl md:text-3xl font-bold font-outfit text-gray-900 leading-tight mb-2">{title}</h3>}
                            {description && (
                                <p className="text-lg text-brand-ink-body leading-relaxed max-w-3xl">
                                    {description}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Pre-window disclaimer */}
                    <p className="w-full max-w-5xl mx-auto text-left text-xs md:text-sm text-gray-400 font-light font-medium px-1 mb-2">
                        <span className="font-bold text-brand-ink-muted">NOTE:</span> This is a functional snapshot from the Internet Archive. Some visual elements may take a moment to load.
                    </p>

                    {/* Browser Mockup Window */}
                    <div className="w-full max-w-5xl mx-auto aspect-video relative">
                        {/* Backdrop layer for fullscreen */}
                        {isFullscreen && (
                            <div 
                                className="fixed inset-0 z-[90] bg-[#050508]/80 backdrop-blur-md cursor-pointer transition-opacity"
                                onClick={() => setIsFullscreen(false)}
                            />
                        )}
                        <div className={`bg-white border flex flex-col overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                            isFullscreen
                                ? "fixed inset-4 md:inset-12 z-[100] rounded-xl shadow-2xl border-white/20"
                                : "absolute inset-0 w-full h-full rounded-xl shadow-[0_40px_80px_rgba(0,0,0,0.1)] border-gray-200"
                        }`}>
                            {/* Browser Top Bar */}
                            <div
                                className="w-full h-10 bg-gray-100 border-b border-gray-200 flex items-center px-4 gap-2 shrink-0 cursor-default"
                            >
                                <div className="w-3 h-3 rounded-full bg-red-400 hover:bg-red-500 cursor-pointer transition-colors" onClick={() => setIsFullscreen(false)}></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                <div className="w-3 h-3 rounded-full bg-green-400 hover:bg-green-500 cursor-pointer transition-colors" onClick={() => setIsFullscreen(!isFullscreen)}></div>
                                <div className="flex-1 ml-4 bg-white/60 text-gray-400 font-light text-xs py-1 px-3 rounded-md border border-gray-200 flex items-center justify-between">
                                    <span className="truncate">{src}</span>
                                    <button 
                                        onClick={() => setIsFullscreen(!isFullscreen)} 
                                        className="text-gray-400 font-light hover:text-brand-ink-body focus:outline-none transition-colors ml-2 shrink-0"
                                        title="Toggle Fullscreen"
                                    >
                                        {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                                    </button>
                                </div>
                            </div>

                        {/* Browser Content */}
                        <div
                            className="w-full flex-1 relative bg-white group cursor-pointer"
                            onClick={() => !isFullscreen && setIsInteractive(true)}
                        >
                            <iframe
                                className="w-full h-full border-none absolute inset-0"
                                style={{ pointerEvents: (isInteractive || isFullscreen) ? 'auto' : 'none' }}
                                src={src}
                                allowFullScreen
                                loading="lazy"
                            ></iframe>

                            {/* Interaction Overlay */}
                            {(!isInteractive && !isFullscreen) && (
                                <div className="absolute inset-0 z-10 bg-[#04101A]/90 backdrop-blur-[2px] hover:bg-[#04101A]/75 transition-all flex items-center justify-center">
                                    <motion.div
                                        className="flex flex-col items-center gap-1"
                                    >
                                        <div className="px-4 py-1.5 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: '#56C6FF' }}>
                                            <span className="text-brand-ink text-xs font-bold uppercase tracking-wide">Click to interact</span>
                                        </div>
                                    </motion.div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default ArchiveMockup;
