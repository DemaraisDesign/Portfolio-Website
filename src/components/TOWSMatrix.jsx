import React, { useState } from "react";
import { Target } from "lucide-react";

const TOWS_DATA = {
    environmental: {
        opportunities: [
            "Competitors use a pricing model that is rapidly becoming obsolete",
            "Market demand for tools that stress simplicity over content control",
            "Businesses will pay for managed service over perceived hassle of self-installation",
            "Browser-based distribution eliminates app download friction"
        ],
        threats: [
            "Emerging technology such as AR HMDs could make physical screens less ubiquitous in coming years",
            "Pricing is not friendly to new distribution methods (e.g., mobile signage)",
            "Low barrier to entry — service is not unique or difficult to replicate"
        ]
    },
    internal: {
        strengths: [
            "Competitive subscription price — lower than market average",
            "Groups function allows management of screens across locations (unique at this price point)",
            "Groups function allows service to scale with business growth",
            "Browser-based delivery requires no dedicated hardware"
        ],
        weaknesses: [
            "Cluttered IA makes process unnecessarily complicated",
            "Key differentiators (e.g., Groups) are hidden and poorly explained",
            "No preview function — users can't see results before committing",
            "Features lacking compared to competition",
            "Homepage language falsely implies Windows PC requirement, driving away 87% of visitors",
            "Authentication restricted to Gmail and Microsoft accounts only"
        ]
    },
    strategies: {
        so: {
            title: "Strengths × Opportunities",
            subtitle: "Leverage advantages to capture market",
            items: [
                "Lower subscription price to market-best positioning",
                "Monetize Groups function as a premium tier to capture multi-location businesses",
                "Evolve from per-screen model to SaaS with additional cost for location expansion"
            ]
        },
        st: {
            title: "Strengths × Threats",
            subtitle: "Use strengths to mitigate threats",
            items: [
                "Leverage competitive price and browser delivery to retain users as market alternatives emerge",
                "Build Groups network effects so value increases with adoption, raising switching costs",
                "Position device-agnostic delivery as future-proof against hardware obsolescence"
            ]
        },
        wo: {
            title: "Weaknesses × Opportunities",
            subtitle: "Fix weaknesses to unlock opportunity",
            items: [
                "Stress simplicity and flexibility in UX writing to match market demand",
                "Streamline IA and UI to reflect the product's actual simplicity",
                "Implement thorough onboarding tutorial to lower perceived complexity",
                "Surface Groups function prominently to capture multi-location demand",
                "Remove false hardware requirement to stop driving away prospective users"
            ]
        },
        wt: {
            title: "Weaknesses × Threats",
            subtitle: "Address vulnerabilities before they compound",
            items: [
                "Without a preview function, testing feels cumbersome — too much friction for busy business owners in a market with alternatives",
                "As long as Groups is hidden with cryptic purpose, the service has little to differentiate it from easily replicable competitors",
                "Restricted authentication narrows the addressable market at a time when competitors are lowering barriers"
            ]
        }
    }
};

const QuadrantLabel = ({ children }) => (
    <div className="text-[10px] font-bold tracking-[1.5px] uppercase mb-1 text-gray-900">
        {children}
    </div>
);

const StickyNote = ({ text, color }) => {
    // Generate static random rotation on mount via lazy initializer to safely bypass React purity linters
    const [baseRotation] = useState(() => (Math.random() - 0.5) * 1.2);

    return (
        <div
            className="px-3 py-2.5 text-xs font-medium leading-snug text-gray-900 rounded-lg shadow-sm cursor-default transition-all duration-200"
            style={{
                background: color,
                transform: `rotate(${baseRotation}deg)`,
            }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = "rotate(0deg) scale(1.03)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                e.currentTarget.style.zIndex = 10;
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = `rotate(${baseRotation}deg)`;
                e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)";
                e.currentTarget.style.zIndex = 1;
            }}
        >
            {text}
        </div>
    );
};

const StrategyCell = ({ data, parentAColor, parentBColor }) => (
    <div 
        className="p-5 rounded-2xl min-h-[180px] border border-gray-100/50" 
        style={{ 
            backgroundColor: `color-mix(in srgb, ${parentAColor} 8%, ${parentBColor} 8%)` 
        }}
    >
        <div className="text-[13px] font-bold text-gray-900 mb-0.5">
            {data.title}
        </div>
        <div className="text-[11px] font-medium text-brand-ink-muted mb-3.5 italic">
            {data.subtitle}
        </div>
        <div className="flex flex-col gap-2">
            {data.items.map((item, i) => (
                <div key={i} className="text-xs font-normal leading-relaxed text-gray-700 pl-4 relative">
                    <div
                        className="absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full shrink-0 bg-gray-900"
                    />
                    {item}
                </div>
            ))}
        </div>
    </div>
);

const FactorColumn = ({ title, items, noteColor }) => (
    <div>
        <QuadrantLabel>{title}</QuadrantLabel>
        <div className="flex flex-wrap gap-2 mt-2">
            {items.map((item, i) => (
                <StickyNote key={i} text={item} color={noteColor} />
            ))}
        </div>
    </div>
);

export default function TOWSMatrix({ color = "#56C6FF" }) {
    const d = TOWS_DATA;

    return (
        <div className="w-full font-sans max-w-none">
            <div className="relative w-full overflow-hidden bg-white border border-gray-200 rounded-2xl shadow-lg">

                <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                    style={{ backgroundImage: "radial-gradient(circle, #0D1216 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

                {/* Header matching AffinityMapDisplayNow */}
                <div className="relative z-20 flex flex-col px-6 md:px-8 py-6" style={{ backgroundColor: '#0D1216' }}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center shrink-0 w-12 h-12 rounded-full shadow-sm border border-transparent text-[#04101A]" style={{ backgroundColor: color }}>
                                <Target size={22} />
                            </div>
                            <div>
                                <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">TOWS Strategic Matrix</h1>
                                <p className="text-sm font-medium text-white/70 mt-0.5">Display Now</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Matrix Body */}
                <div className="relative z-10 p-6 md:p-8 bg-gray-50/50">

                    {/* Environmental Factors Header */}
                    <div className="mb-5 flex items-center gap-3">
                        <div className="px-3 py-1 rounded-full border" style={{ backgroundColor: `${color}1A`, borderColor: `${color}33` }}>
                            <span className="text-[10px] font-bold tracking-[1.5px] uppercase text-gray-900">
                                Environmental Factors
                            </span>
                        </div>
                        <div className="flex-1 h-px" style={{ backgroundColor: `${color}1A` }} />
                    </div>

                    {/* Opportunities & Threats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-7">
                        <div className="rounded-2xl p-5 border bg-[#e6f9f6] border-[#00C2A3]/20">
                            <FactorColumn
                                title="Opportunities"
                                items={d.environmental.opportunities}
                                noteColor="#b6e8c8"
                            />
                        </div>
                        <div className="rounded-2xl p-5 border bg-[#fff0ea] border-[#FF6B3D]/20">
                            <FactorColumn
                                title="Threats"
                                items={d.environmental.threats}
                                noteColor="#ffd4b8"
                            />
                        </div>
                    </div>

                    {/* Own Specific Factors Header */}
                    <div className="mb-5 flex items-center gap-3">
                        <div className="px-3 py-1 rounded-full border" style={{ backgroundColor: `${color}1A`, borderColor: `${color}33` }}>
                            <span className="text-[10px] font-bold tracking-[1.5px] uppercase text-gray-900">
                                Own Specific Factors
                            </span>
                        </div>
                        <div className="flex-1 h-px" style={{ backgroundColor: `${color}1A` }} />
                    </div>

                    {/* Strengths & Weaknesses Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-7">
                        <div className="rounded-2xl p-5 border bg-[#eefaff] border-[#56C6FF]/20">
                            <FactorColumn
                                title="Strengths"
                                items={d.internal.strengths}
                                noteColor="#fef9c3"
                            />
                        </div>
                        <div className="rounded-2xl p-5 border bg-[#fff8ed] border-[#FFB648]/20">
                            <FactorColumn
                                title="Weaknesses"
                                items={d.internal.weaknesses}
                                noteColor="#ffe0a8"
                            />
                        </div>
                    </div>

                    {/* Strategy Divider */}
                    <div className="mb-6 flex items-center gap-3">
                        <div className="px-3 py-1 rounded-full border" style={{ backgroundColor: `${color}1A`, borderColor: `${color}33` }}>
                            <span className="text-[10px] font-bold tracking-[1.5px] uppercase text-gray-900">
                                Strategic Intersections
                            </span>
                        </div>
                        <div className="flex-1 h-px" style={{ backgroundColor: `${color}1A` }} />
                    </div>

                    {/* Strategy Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <StrategyCell
                            data={d.strategies.so}
                            parentAColor="#56C6FF" // Strengths
                            parentBColor="#00C2A3" // Opportunities
                        />
                        <StrategyCell
                            data={d.strategies.st}
                            parentAColor="#56C6FF" // Strengths
                            parentBColor="#FF6B3D" // Threats
                        />
                        <StrategyCell
                            data={d.strategies.wo}
                            parentAColor="#FFB648" // Weaknesses
                            parentBColor="#00C2A3" // Opportunities
                        />
                        <StrategyCell
                            data={d.strategies.wt}
                            parentAColor="#FFB648" // Weaknesses
                            parentBColor="#FF6B3D" // Threats
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="relative z-10 px-6 md:px-8 py-4 bg-white/90 backdrop-blur-md shadow-sm border-t border-gray-200 flex justify-center items-center">
                    <span className="text-[11px] font-medium text-gray-400 font-light">
                        Analysis informed by user interviews, comparative audits, & usability reports
                    </span>
                </div>
            </div>
        </div>
    );
}
