// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useMemo } from "react";
import { ChevronRight, ChevronLeft, Layers, X, Target, Info } from "lucide-react";
import ImpactList from './ImpactList';

const NOTE_COLORS = ["#F9F871", "#FFE4A3", "#FFC7A8", "#F2A2D7", "#CCF6FF", "#DBECE8", "#61F5B9", "#9BAEBC", "#F16186"];

const ALL_DATA = [
    {
        id: "fixture",
        title: "Games are a long-held fixture in my life.",
        layers: ["interwoven"],
        notes: [
            { id: "fx1", text: "I've been playing games since childhood." },
            { id: "fx2", text: "I've been gaming most of my life." },
            { id: "fx3", text: "The games I play tend to make me feel nostalgic." },
            { id: "fx4", text: "I started playing games in my youth." },
            { id: "fx5", text: "I've been gaming since I was young." },
            { id: "fx6", text: "I've played a lot of video games." },
        ]
    },
    {
        id: "mental-health",
        title: "I use games to improve my mental health.",
        layers: ["interwoven"],
        notes: [
            { id: "mh1", text: "Games help me direct my focus." },
            { id: "mh2", text: "I like to 'gamify' my life." },
            { id: "mh3", text: "Games help me 'turn my brain off' and relax." },
            { id: "mh4", text: "I want to 'zone out' when I'm playing a game on a break." },
            { id: "mh5", text: "The focus required for puzzles lets me 'zone out' and relax." },
            { id: "mh6", text: "My free time...where I don't have to think...is extremely important to me for my mental health." },
        ]
    },
    {
        id: "human-connection",
        title: "Games give me human connection.",
        layers: ["interwoven", "spar"],
        notes: [
            { id: "hc1", text: "I like playing with other people." },
            { id: "hc2", text: "I'm drawn to games that have communities around them." },
            { id: "hc3", text: "I would rather win via teamwork." },
            { id: "hc4", text: "Games are how I maintain a lot of friendships." },
            { id: "hc5", text: "I enjoy multiplayer games." },
            { id: "hc6", text: "I like competing against people I know." },
            { id: "hc7", text: "My son and I bond through video games." },
            { id: "hc8", text: "My kids play with devices." },
        ]
    },
    {
        id: "compete",
        title: "I want to compete",
        layers: ["spar"],
        notes: [
            { id: "co1", text: "I enjoy competing in games." },
            { id: "co2", text: "I want to be able to share my scores on social media." },
            { id: "co3", text: "I like competing against other people." },
            { id: "co4", text: "I am extremely competitive in life. 'I like to win.'" },
            { id: "co5", text: "I like level playing fields in competitions." },
            { id: "co6", text: "I tend to play games that have a competitive aspect." },
            { id: "co7", text: "I like competitive games...and to 'dominate.'" },
            { id: "co8", text: "I like having the highest score." },
        ]
    },
    {
        id: "challenge",
        title: "I want games that challenge me to improve.",
        layers: ["selfworth"],
        notes: [
            { id: "ch1", text: "I like to be motivated to achieve higher levels in games." },
            { id: "ch2", text: "I like games where I can upgrade the things I'm playing with." },
            { id: "ch3", text: "I like games that let me compete with my own previous scores... I like knowing that I'm improving." },
            { id: "ch4", text: "I like games where I'm battling a clock." },
            { id: "ch5", text: "I like strategy and 'stress' games for mobile." },
        ]
    },
    {
        id: "mental-ability",
        title: "I tie games to my sense of mental ability.",
        layers: ["selfworth", "spar"],
        notes: [
            { id: "ma1", text: "I prefer 'intellectual' games." },
            { id: "ma2", text: "I like games that are hard, but not too hard." },
            { id: "ma3", text: "I like feeling smart." },
            { id: "ma4", text: "I see distinctions between games related to numbers and true math games that require mental arithmetic." },
        ]
    },
    {
        id: "grasp-concepts",
        title: "I want to grasp game concepts quickly.",
        layers: ["selfworth", "bandwidth"],
        notes: [
            { id: "gc1", text: "I prefer games with simple frameworks." },
            { id: "gc2", text: "I don't like apps that require a long learning curve." },
            { id: "gc3", text: "I want to understand mobile games quickly." },
            { id: "gc4", text: "I like games where winning and losing is very clear." },
            { id: "gc5", text: "I like games that feel familiar." },
            { id: "gc6", text: "I'm attracted to simple rules that require complex thinking." },
            { id: "gc7", text: "I get bored easily." },
        ]
    },
    {
        id: "short-sessions",
        title: "I prefer short gaming sessions on mobile.",
        layers: ["bandwidth"],
        notes: [
            { id: "ss1", text: "I don't have the space for games that take a long time to play." },
            { id: "ss2", text: "I expect mobile games to not require long gaming sessions." },
            { id: "ss3", text: "I don't want games that take a long time on mobile." },
            { id: "ss4", text: "Modern games take too much time." },
            { id: "ss5", text: "I don't have a lot of time to dedicate to games." },
            { id: "ss6", text: "I like mobile games where the play time is short." },
        ]
    },
    {
        id: "convenience",
        title: "Convenience motivates my spending.",
        layers: ["bandwidth"],
        notes: [
            { id: "cv1", text: "I tend to buy additional content if it makes my life more convenient." },
            { id: "cv2", text: "I'll pay to avoid grinding out repetitive tasks." },
            { id: "cv3", text: "When I make in game purchases, it tends to be for things that save time or hassle." },
            { id: "cv4", text: "I've bought in-app purchases that save me time." },
        ]
    },
    {
        id: "long-form",
        title: "I also play long-form games on consoles/PC.",
        layers: ["random"],
        notes: [
            { id: "lf1", text: "I don't typically get invested in mobile games, and tend to prefer full gaming experiences on consoles." },
            { id: "lf2", text: "I own all the current consoles." },
            { id: "lf3", text: "I own and play a Nintendo Switch." },
            { id: "lf4", text: "I've immersed myself deeply into understanding complex games." },
        ]
    },
    {
        id: "buy-content",
        title: "I'll buy content.",
        layers: ["random"],
        notes: [
            { id: "bc1", text: "I've bought 'more lives' via in game purchases." },
            { id: "bc2", text: "I'd buy a new game variant if I was able to test it first." },
            { id: "bc3", text: "I'll buy things that give me a competitive edge." },
            { id: "bc4", text: "I'll buy features, but not skins." },
        ]
    },
    {
        id: "design-quality",
        title: "I notice the design quality of games.",
        layers: ["random"],
        notes: [
            { id: "dq1", text: "I understand and respect the artistry that goes into creating a deep game." },
            { id: "dq2", text: "I like simple UI." },
            { id: "dq3", text: "A game aesthetic does not have to be complex, but it should be polished." },
            { id: "dq4", text: "I'm turned off by apps that are not aesthetically pleasing." },
            { id: "dq5", text: "I prefer mobile games where the UI was specifically designed for touchscreens." },
        ]
    },
    {
        id: "wary-purchases",
        title: "I'm wary of in-game purchases.",
        layers: ["random"],
        notes: [
            { id: "wp1", text: "I don't want to be asked to buy anything right away." },
            { id: "wp2", text: "I don't like in game purchases." },
            { id: "wp3", text: "I don't like free to play games that force purchases on me to enjoy the base experience." },
            { id: "wp4", text: "I'm wary of in game purchases." },
        ]
    },
    {
        id: "love-puzzles",
        title: "I love solving puzzles.",
        layers: ["random"],
        notes: [
            { id: "lp1", text: "I like solving puzzles." },
            { id: "lp2", text: "I like finding patterns." },
            { id: "lp3", text: "I love mobile puzzle games." },
            { id: "lp4", text: "I like solving puzzles." },
        ]
    },
    {
        id: "enjoy-math",
        title: "I enjoy math.",
        layers: ["random"],
        notes: [
            { id: "em1", text: "Math is a big part of my various professional ventures." },
            { id: "em2", text: "I enjoy math games." },
            { id: "em3", text: "Using math and statistics helps me get sense of control over my life...because numbers are truth." },
            { id: "em4", text: "I like that math has rules." },
            { id: "em5", text: "I find math relaxing." },
        ]
    }
];

const layerConfig = {
    interwoven: { label: "Lifestyle", color: "#6AA8F6", bg: "rgba(106,168,246,0.12)", desc: "Games are interwoven into the foundations of my life." },
    spar: { label: "Competition", color: "#56C976", bg: "rgba(86,201,118,0.12)", desc: "Games help me safely spar." },
    selfworth: { label: "Self-Perception", color: "#F79965", bg: "rgba(247,153,101,0.12)", desc: "I tie games to my sense of self-worth." },
    bandwidth: { label: "Convenience", color: "#CF9EFA", bg: "rgba(207,158,250,0.12)", desc: "I don't have a lot of extra bandwidth." },
    random: { label: "General", color: "#9BAEBC", bg: "rgba(155,174,188,0.12)", desc: "Potpourri requests and stray observations from the research." }
};

const LayerCard = ({ layerKey, cfg, clustersCount, notesCount, onClick, index }) => {
    return (
        <motion.button layout="position" onClick={onClick}
            initial={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
            transition={{ delay: index * 0.05, duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
            whileHover={{ y: -4, boxShadow: `0 12px 40px rgba(13,18,22,0.08), 0 0 0 1px ${cfg.color}40` }}
            whileTap={{ scale: 0.985 }}
            className="group relative w-full text-left overflow-hidden transition-all bg-white rounded-xl shadow-sm border border-gray-100 hover:border-gray-300">
            <div style={{ height: 6, background: cfg.color }} />
            <div className="p-6 md:p-8 flex flex-col h-full items-start">
                <div className="flex flex-col mb-6">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full uppercase"
                        style={{ background: cfg.bg, color: "#111827", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em" }}>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: cfg.color, display: "inline-block" }} />
                        {cfg.label}
                    </span>
                </div>
                <h3 className="text-[20px] font-bold text-gray-900 leading-snug mb-3">
                    {cfg.desc}
                </h3>
                <div className="mt-8 flex items-center justify-between w-full border-t border-gray-100 pt-5">
                    <div className="flex items-center gap-3">
                        <span className="text-[13px] font-bold text-gray-900">{clustersCount} Clusters</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span className="text-[13px] font-medium text-brand-ink-muted">{notesCount} Notes</span>
                    </div>
                    <div className="flex items-center gap-1 text-[13px] font-bold text-gray-400 font-light group-hover:text-gray-900 transition-colors">
                        View <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </div>
        </motion.button>
    );
};

const StickyNote = ({ note, index }) => {
    // Generate a consistent color based on string hash for more random but stable distribution
    const hash = note.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const bgColor = NOTE_COLORS[hash % NOTE_COLORS.length];
    return (
        <motion.div layout
            initial={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
            transition={{ delay: index * 0.03, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{
                scale: 1.04, y: -4, zIndex: 20,
                boxShadow: "0 10px 25px rgba(13,18,22,0.1)"
            }}
            className="relative cursor-default select-none group" style={{ zIndex: index }}>
            <div className="flex flex-col justify-between transition-colors shadow-sm"
                style={{
                    width: 176, minHeight: 120, padding: "14px 16px", backgroundColor: bgColor,
                    borderRadius: 4, border: "1px solid rgba(0,0,0,0.05)"
                }}>
                <p className="text-[13px] leading-snug font-medium text-gray-900">{note.text}</p>
            </div>
        </motion.div>
    );
};

const GroupCard = ({ group, onClick, index, activeLayerId }) => {
    const sev = layerConfig[activeLayerId];
    return (
        <motion.button layout="position" onClick={onClick}
            initial={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
            transition={{ delay: index * 0.05, duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
            whileHover={{ y: -4, boxShadow: `0 12px 40px rgba(13,18,22,0.10), 0 0 0 1px ${sev.color}33` }}
            whileTap={{ scale: 0.985 }}
            className="group relative w-full text-left overflow-hidden transition-all bg-white rounded-xl shadow-sm border border-gray-100 hover:border-gray-300">
            <div style={{ height: 4, background: sev.color }} />
            <div className="p-5 flex flex-col h-full">
                <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full uppercase"
                                style={{ background: sev.bg, color: "#111827", fontSize: 10, fontWeight: 700, letterSpacing: "0.06em" }}>
                                <span style={{ width: 6, height: 6, borderRadius: "50%", background: sev.color, display: "inline-block" }} />
                                {sev.label} Cluster
                            </span>
                        </div>
                        <h3 className="text-[16px] font-semibold text-gray-900 leading-snug">{group.title}</h3>
                    </div>
                </div>

                <div className="mt-auto">
                    <div className="flex gap-1 mb-4 flex-wrap">
                        {group.notes.map((note) => {
                            const hash = note.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                            const bgColor = NOTE_COLORS[hash % NOTE_COLORS.length];
                            return (
                                <div key={note.id} className="flex-shrink-0"
                                    style={{
                                        width: 24, height: 24, borderRadius: 4, backgroundColor: bgColor,
                                        boxShadow: "0 1px 3px rgba(13,18,22,0.08)"
                                    }} />
                            );
                        })}
                    </div>
                    <div className="flex items-center gap-1.5 text-[12px] font-medium text-brand-ink-muted transition-colors group-hover:opacity-100" style={{ color: "var(--hover-color, #6B7280)" }}
                        onMouseEnter={(e) => e.currentTarget.style.setProperty('--hover-color', sev.color)}
                        onMouseLeave={(e) => e.currentTarget.style.removeProperty('--hover-color')}
                    >
                        <span>{group.notes.length} Insights</span>
                        <span className="opacity-40 ml-1 mr-1">•</span>
                        <span>View Cluster</span>
                        <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                </div>
            </div>
        </motion.button>
    );
};

const ExpandedView = ({ group, activeLayerId, onClose }) => {
    const sev = layerConfig[activeLayerId];
    return (
        <motion.div initial={{ opacity: 0, filter: "blur(8px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} exit={{ opacity: 0, filter: "blur(8px)" }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 md:p-8"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95, filter: "blur(12px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.95, filter: "blur(12px)" }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-4xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
                    <div className="flex items-center gap-4">
                        <motion.button onClick={onClose}
                            whileHover={{ scale: 1.05, backgroundColor: "#f3f4f6" }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center justify-center rounded-full transition-colors w-10 h-10 border border-gray-200 text-gray-700 bg-white shadow-sm">
                            <ChevronLeft size={18} />
                        </motion.button>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full uppercase"
                                    style={{ background: sev.bg, color: "#111827", fontSize: 10, fontWeight: 700, letterSpacing: "0.06em" }}>
                                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: sev.color, display: "inline-block" }} />
                                    {sev.label}
                                </span>
                                <span className="text-brand-ink-body text-xs font-medium">
                                    {group.notes.length} notes
                                </span>
                            </div>
                            <h2 className="text-[18px] md:text-[20px] font-bold text-gray-900">{group.title}</h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-5">
                        <motion.button onClick={onClose}
                            whileHover={{ scale: 1.05, backgroundColor: "#f3f4f6" }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center justify-center rounded-full transition-colors w-10 h-10 border border-gray-200 text-brand-ink-body bg-white shadow-sm">
                            <X size={16} />
                        </motion.button>
                    </div>
                </div>
                <div className="flex-1 overflow-auto px-6 py-10 bg-gray-50 aspect-video md:aspect-auto">
                    <div className="flex flex-wrap gap-6 justify-center max-w-4xl mx-auto">
                        {group.notes.map((note, i) => (
                            <StickyNote key={note.id} note={note} index={i} />
                        ))}
                    </div>
                </div>
                <div className="px-6 py-4 flex flex-col md:flex-row items-center border-t border-gray-100 bg-white gap-4">
                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-md border border-gray-100">
                            <Target size={14} className="text-gray-400 font-light" />
                            <span className="text-xs font-semibold text-brand-ink-muted">Deconstructing Gamer Archetypes</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default function AffinityMap2({ color }) {
    const data = ALL_DATA;
    const [expandedId, setExpandedId] = useState(null);
    const [activeLayer, setActiveLayer] = useState(null);

    const layerStats = useMemo(() => {
        const stats = {
            interwoven: { clusters: 0, notes: 0 },
            spar: { clusters: 0, notes: 0 },
            selfworth: { clusters: 0, notes: 0 },
            bandwidth: { clusters: 0, notes: 0 },
            random: { clusters: 0, notes: 0 }
        };
        data.forEach(g => {
            g.layers.forEach(l => {
                if (stats[l]) {
                    stats[l].clusters++;
                    stats[l].notes += g.notes.length;
                }
            });
        });
        return stats;
    }, [data]);

    const activeData = activeLayer ? data.filter(g => g.layers.includes(activeLayer)) : [];
    const expandedGroup = data.find(g => g.id === expandedId);
    const totalNotes = data.reduce((sum, g) => sum + g.notes.length, 0);

    return (
        <div className="w-full font-sans" style={{ fontFamily: '"Outfit", "Inter", sans-serif' }}>
            <div className="relative w-full overflow-hidden bg-white border border-gray-200 rounded-2xl shadow-lg"
                style={{ minHeight: 600 }}>

                <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                    style={{ backgroundImage: "radial-gradient(circle, #0D1216 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

                <div className="relative z-20 flex flex-col px-6 md:px-8 pt-6 pb-8" style={{ backgroundColor: '#1b262f' }}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center shrink-0 w-12 h-12 rounded-full bg-brand-blue shadow-sm border border-transparent text-brand-ink">
                                <Layers size={22} />
                            </div>
                            <div>
                                <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">The Gamer Mindset</h1>
                                <p className="text-sm font-medium text-white/70 mt-0.5">Display Now</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-white/90 bg-white/10 px-3 py-1.5 rounded-lg border border-white/20">
                            <span>{data.length} clusters</span>
                            <span className="opacity-40">•</span>
                            <span>{totalNotes} notes</span>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 flex items-center px-6 md:px-8 py-4 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200" style={{ minHeight: '64px' }}>
                    <AnimatePresence mode="wait">
                        {!activeLayer ? (
                            <motion.div key="overview" initial={{ opacity: 0, filter: "blur(4px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} exit={{ opacity: 0, filter: "blur(4px)" }} className="flex items-center gap-2 text-[13px] font-bold text-brand-ink-muted uppercase tracking-wider">
                                <Layers size={16} /> All Categorized Findings
                            </motion.div>
                        ) : (
                            <motion.div key="drilldown" initial={{ opacity: 0, filter: "blur(4px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} exit={{ opacity: 0, filter: "blur(4px)" }} className="flex items-center gap-2 text-[14px] font-semibold text-gray-900">
                                <button onClick={() => setActiveLayer(null)} className="flex items-center gap-1.5 hover:text-brand-blue transition-colors px-3 py-1.5 -ml-3 rounded-md hover:bg-gray-50 text-brand-ink-muted">
                                    <ChevronLeft size={16} /> Overview
                                </button>
                                <span className="text-gray-300">/</span>
                                <span className="text-gray-900">{layerConfig[activeLayer]?.label}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="relative z-10 p-6 md:p-8 grid gap-5 bg-gray-50/50"
                    style={{ gridTemplateColumns: activeLayer ? "repeat(auto-fill, minmax(280px, 1fr))" : "repeat(auto-fill, minmax(340px, 1fr))" }}>
                    <AnimatePresence mode="wait">
                        {!activeLayer ? (
                            Object.entries(layerConfig).map(([key, cfg], i) => {
                                if (layerStats[key].clusters === 0) return null;
                                return (
                                    <LayerCard
                                        key={key}
                                        layerKey={key}
                                        cfg={cfg}
                                        clustersCount={layerStats[key].clusters}
                                        notesCount={layerStats[key].notes}
                                        index={i}
                                        onClick={() => setActiveLayer(key)}
                                    />
                                );
                            })
                        ) : (
                            activeData.map((group, i) => (
                                <GroupCard key={group.id} group={group} index={i}
                                    activeLayerId={activeLayer}
                                    onClick={() => setExpandedId(group.id)} />
                            ))
                        )}
                    </AnimatePresence>
                </div>

                <AnimatePresence>
                    {expandedGroup && (
                        <ExpandedView key={expandedGroup.id} group={expandedGroup}
                            activeLayerId={activeLayer || expandedGroup.layers[0]}
                            onClose={() => setExpandedId(null)} />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
