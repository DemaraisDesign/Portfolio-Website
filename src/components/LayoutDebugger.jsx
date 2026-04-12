import React, { createContext, useContext, useState, useEffect } from 'react';

const LayoutDebuggerContext = createContext();

export const LayoutDebuggerProvider = ({ children }) => {
    const [isDebugMode, setIsDebugMode] = useState(false);
    const [spacingConfig, setSpacingConfig] = useState({});

    const appliedOverridesRef = React.useRef(null);

    // Expose a method for CaseStudyTemplate to inject its local layout JSON on route change
    const applyOverrides = React.useCallback((overrides) => {
        if (!overrides) return;

        const overridesString = JSON.stringify(overrides);
        if (appliedOverridesRef.current === overridesString) return; // Prevent overwriting live manual inputs

        appliedOverridesRef.current = overridesString;

        setSpacingConfig(prev => ({
            ...prev,
            ...overrides
        }));
    }, []);

    // Check URL for ?debug=layout or localStorage
    useEffect(() => {
        const checkDebugMode = () => {
            const isDebug = window.location.search.includes('debug=layout') || localStorage.getItem('layout_debug') === 'true';
            setIsDebugMode(isDebug);
        };

        checkDebugMode();

        // Listen to custom toggle event
        const handleToggle = () => {
            setIsDebugMode(prev => {
                const next = !prev;
                if (next) localStorage.setItem('layout_debug', 'true');
                else localStorage.removeItem('layout_debug');
                return next;
            });
        };

        const handleKeyDown = (e) => {
            // Use e.code to ignore CapsLock and allow Ctrl, Cmd, or Alt as modifiers to be safe on Mac vs PC
            if ((e.ctrlKey || e.metaKey || e.altKey) && (e.code === 'KeyD' || e.key.toLowerCase() === 'd')) {
                // Ignore if they are actively typing in an input inside the debugger UI
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

                e.preventDefault();
                handleToggle();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const updateSpacing = (id, device, value) => {
        setSpacingConfig(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                [device]: parseInt(value) || 0
            }
        }));
    };

    const registerDefault = (id, defaultMobile, defaultDesktop) => {
        setSpacingConfig(prev => {
            if (prev[id]) return prev;
            return {
                ...prev,
                [id]: { mobile: defaultMobile, desktop: defaultDesktop }
            };
        });
    };

    return (
        <LayoutDebuggerContext.Provider value={{ isDebugMode, spacingConfig, updateSpacing, registerDefault, applyOverrides }}>
            {children}
            {isDebugMode && <LayoutDebuggerUI config={spacingConfig} updateSpacing={updateSpacing} />}
        </LayoutDebuggerContext.Provider>
    );
};

export const useLayoutDebugger = () => useContext(LayoutDebuggerContext);

// The Standalone Element
export const DebugSpacer = ({ id, defaultMobile = 50, defaultDesktop = 100 }) => {
    const { isDebugMode, spacingConfig, registerDefault, updateSpacing } = useLayoutDebugger();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

    useEffect(() => {
        registerDefault(id, defaultMobile, defaultDesktop);
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [id, defaultMobile, defaultDesktop, registerDefault]);

    const activeSpacing = spacingConfig[id] || { mobile: defaultMobile, desktop: defaultDesktop };
    const currentHeight = isMobile ? activeSpacing.mobile : activeSpacing.desktop;

    if (!isDebugMode) {
        return <div style={{ height: `${currentHeight}px`, width: '100%', flexShrink: 0 }} aria-hidden="true" />;
    }

    return (
        <div
            className="w-full relative group transition-colors flex items-center justify-center border-y border-dashed my-[-1px]"
            style={{
                height: `${currentHeight}px`,
                backgroundColor: 'rgba(59, 130, 246, 0.15)', // Blue-500 @ 15%
                borderColor: 'rgba(59, 130, 246, 0.5)',
                zIndex: 50,
                flexShrink: 0
            }}
            title={`Spacer: ${id}`}
        >
            {/* Inline controls appearing on hover */}
            <div className="absolute opacity-0 group-hover:opacity-100 bg-white shadow-xl rounded-lg p-3 flex gap-4 text-xs font-sans text-brand-ink transition-opacity border border-gray-100 items-center">
                <div className="font-bold pr-4 truncate max-w-[150px]">{id}</div>
                <label className="flex items-center gap-2 font-medium">
                    Mobile: <input type="number" value={activeSpacing.mobile} onChange={(e) => updateSpacing(id, 'mobile', e.target.value)} className="w-14 border rounded px-1.5 py-1 text-center bg-gray-50 border-gray-200" />
                </label>
                <div className="w-px h-6 bg-gray-200 mx-1"></div>
                <label className="flex items-center gap-2 font-medium">
                    Desktop: <input type="number" value={activeSpacing.desktop} onChange={(e) => updateSpacing(id, 'desktop', e.target.value)} className="w-14 border rounded px-1.5 py-1 text-center bg-gray-50 border-gray-200" />
                </label>
            </div>
        </div>
    );
};

// Intelligently wraps children and injects a DebugSpacer between each valid block.
export const DebugFlexCol = ({ as: Component = 'div', idPrefix = "Gap", defaultMobile = 64, defaultDesktop = 96, children, className, ...props }) => {
    // Filter out null/false/undefined children so we don't accidentally render extra spacers
    const validChildren = React.Children.toArray(children).filter(Boolean);

    return (
        <Component className={className} {...props}>
            {validChildren.map((child, index) => (
                <React.Fragment key={child.key || `debug-col-${index}`}>
                    {index > 0 && (
                        <DebugSpacer
                            id={`${idPrefix}_${index}`}
                            defaultMobile={defaultMobile}
                            defaultDesktop={defaultDesktop}
                        />
                    )}
                    {child}
                </React.Fragment>
            ))}
        </Component>
    );
};

// Corner UI
const LayoutDebuggerUI = ({ config, updateSpacing }) => {
    const [isMinimized, setIsMinimized] = useState(false);
    const exportConfig = () => {
        // Build a readable CSS output
        let output = `/* Layout Extracted from Debugger */\n\n`;
        Object.entries(config).forEach(([id, vals]) => {
            output += `// --- ${id} ---\n`;
            output += `Mobile Margin: mt-[${vals.mobile}px]\n`;
            output += `Desktop Margin: lg:mt-[${vals.desktop}px]\n\n`;
        });

        navigator.clipboard.writeText(output);
        alert('Copied specific layout settings to clipboard! Paste these to the AI assistant to permanently encode them.');
    };

    if (isMinimized) {
        return (
            <button
                onClick={() => setIsMinimized(false)}
                className="fixed bottom-6 right-6 bg-brand-dark text-white shadow-xl rounded-full px-5 py-3 z-[9999] text-sm font-bold flex items-center gap-3 hover:bg-gray-900 transition-colors border border-white/10"
            >
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
                Open Debugger
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 bg-white shadow-2xl rounded-2xl p-5 z-[9999] w-[340px] max-h-[85vh] flex flex-col border border-border font-sans">
            <div className="flex justify-between items-center mb-5 border-b border-gray-100 pb-3">
                <h3 className="font-bold text-sm text-brand-ink flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 inline-block animate-pulse"></span>
                    Layout Debugger
                </h3>
                <button
                    onClick={() => setIsMinimized(true)}
                    className="p-1.5 hover:bg-gray-100 rounded-md text-gray-400 font-light hover:text-brand-ink-body transition-colors"
                    title="Minimize Menu"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                </button>
            </div>

            <div className="overflow-y-auto flex-1 flex flex-col gap-3 pr-2 mb-4">
                {Object.entries(config).map(([id, vals]) => (
                    <div key={id} className="flex flex-col gap-2 border border-border/50 p-3 rounded-xl bg-brand-light/50">
                        <span className="text-[11px] font-bold text-gray-700 truncate tracking-wide">{id}</span>
                        <div className="flex justify-between gap-3">
                            <label className="text-[11px] text-brand-ink-muted font-medium flex items-center gap-2 flex-1">
                                Mob <input type="number" value={vals.mobile} onChange={(e) => updateSpacing(id, 'mobile', e.target.value)} className="w-full px-2 py-1.5 border border-border rounded text-center bg-white" />
                            </label>
                            <label className="text-[11px] text-brand-ink-muted font-medium flex items-center gap-2 flex-1">
                                Desk <input type="number" value={vals.desktop} onChange={(e) => updateSpacing(id, 'desktop', e.target.value)} className="w-full px-2 py-1.5 border border-border rounded text-center bg-white" />
                            </label>
                        </div>
                    </div>
                ))}
            </div>

            <button onClick={exportConfig} className="w-full mb-3 text-sm bg-brand-blue hover:bg-[#4AC0F9] text-brand-ink px-4 py-3 rounded-xl font-bold transition-all shadow-sm active:scale-[0.98]">
                Export Layout Config
            </button>
            <div className="text-[10px] text-center text-gray-400 font-light font-medium uppercase tracking-widest pt-1">
                Hit <kbd className="bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded text-brand-ink-body font-mono shadow-sm mx-1">CMD/CTRL + D</kbd> to hide
            </div>
        </div>
    );
};
