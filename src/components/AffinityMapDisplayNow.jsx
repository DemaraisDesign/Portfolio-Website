// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { ChevronLeft, Layers, X, Target } from "lucide-react";

const PARTICIPANT_COLORS = {
    yellow: "#FFE4A3",
    blue: "#9BAEBC",
    green: "#61F5B9",
    cyan: "#CCF6FF",
    pink: "#F2A2D7"
};

const ALL_DATA = [
    {
        id: "equipment",
        title: "I use a variety of equipment",
        notes: [
            { id: "e1", text: "We use screens vertically", color: "blue" },
            { id: "e2", text: "I have an expensive monitor for presentations", color: "yellow" },
            { id: "e3", text: "I want my sign to be in the window", color: "yellow" },
            { id: "e4", text: "We use computer and player to make signs", color: "blue" },
            { id: "e5", text: "We have a variety of donated monitors", color: "cyan" },
        ]
    },
    {
        id: "automation",
        title: "I need automation",
        notes: [
            { id: "a1", text: "My current software offer more inclusive experience coordinated with lights and sounds", color: "pink" },
            { id: "a2", text: "I need to display different content depending on the time of day", color: "green" },
            { id: "a3", text: "I want to see alerts as they happen", color: "cyan" },
            { id: "a4", text: "Calendar content updates without my Interaction", color: "cyan" },
            { id: "a5", text: "I need to schedule announcements ahead of time", color: "cyan" },
            { id: "a6", text: "I want to have control of the sign from my computer vs dealing with chalkboard", color: "yellow" },
        ]
    },
    {
        id: "design-needs",
        title: "I have heightened design needs",
        notes: [
            { id: "d1", text: "Programs I use very restrictive in formatting content", color: "green" },
            { id: "d2", text: "I use a separate program to design content", color: "green" },
            { id: "d3", text: "I use a variety of different designs", color: "green" },
            { id: "d4", text: "We have someone special making the content", color: "blue" },
            { id: "d5", text: "I want to have design tools builtin the app sign managemnt", color: "yellow" },
        ]
    },
    {
        id: "cost",
        title: "Cost is a concern for me",
        notes: [
            { id: "c1", text: "I want to pay under 10 pounds a month", color: "yellow" },
            { id: "c2", text: "I would like to have bundle discount monthly subscription", color: "blue" },
            { id: "c3", text: "My software is expensive", color: "pink" },
            { id: "c4", text: "I like my current software because it's affordable", color: "pink" },
            { id: "c5", text: "I have to pay extra fee to get support", color: "green" },
            { id: "c6", text: "The signage software I use now is expensive", color: "green" },
        ]
    },
    {
        id: "use-case",
        title: "I'm motivated by a specific use case",
        notes: [
            { id: "u1", text: "We use signs instead of cork board in the lobby", color: "cyan" },
            { id: "u2", text: "We mostly play video", color: "blue" },
            { id: "u3", text: "Lobby uses monitors as a marketing tool", color: "yellow" },
            { id: "u4", text: "I would use the sign as a schedule", color: "yellow" },
            { id: "u5", text: "I use signs to advertise upcoming shows", color: "green" },
            { id: "u6", text: "I want sign to be used as a reception tool", color: "yellow" },
            { id: "u7", text: "I would use a sign as a map of the space so that people can pick a seat", color: "yellow" },
            { id: "u8", text: "I would like the sign to be interactive so ppl can book stuff", color: "yellow" },
            { id: "u9", text: "I would like to see a calendar schedule on the sign", color: "cyan" },
            { id: "u10", text: "qr codes on display to get alerts", color: "cyan" },
        ]
    },
    {
        id: "struggling",
        title: "I'm struggling with my software",
        notes: [
            { id: "s1", text: "There is often not enough time to make a quality presentation", color: "blue" },
            { id: "s2", text: "I have to reload the system every time I make a change to the content", color: "green" },
            { id: "s3", text: "It is stressful when the program gives me complications", color: "green" },
            { id: "s4", text: "I can't just update the content - I have to make a new file and upload it again", color: "green" },
            { id: "s5", text: "Sometimes the system is down and we can't get to the program", color: "green" },
            { id: "s6", text: "Our software won't play videos", color: "green" },
            { id: "s7", text: "It is a pain to update the slides", color: "blue" },
            { id: "s8", text: "To update the content I need to physically be at work", color: "green" },
            { id: "s9", text: "As a user I don't like to see the backend of the slides", color: "cyan" },
        ]
    },
    {
        id: "flexible",
        title: "I want flexible content management",
        notes: [
            { id: "f1", text: "I want to be able to update the slides remotely", color: "blue" },
            { id: "f2", text: "I want to be able to easily switch content", color: "blue" },
            { id: "f3", text: "I want to be able to add content whenever I need to", color: "green" },
            { id: "f4", text: "Signs have more relevant information if you can update it globally", color: "cyan" },
            { id: "f5", text: "I want to have an app on my phone to be able to control the sign", color: "yellow" },
            { id: "f6", text: "My current software does not depend on Internet", color: "pink" },
            { id: "f7", text: "I can access my software remotely", color: "pink" },
            { id: "f8", text: "I would like to have different content on different signs", color: "yellow" },
            { id: "f9", text: "We need multiple displays with the same information", color: "blue" },
        ]
    }
];

const StickyNote = ({ note, index }) => {
    const bgColor = PARTICIPANT_COLORS[note.color] || PARTICIPANT_COLORS["yellow"];
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

const GroupCard = ({ group, onClick, index, color }) => {
    return (
        <motion.button layout="position" onClick={onClick}
            initial={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
            transition={{ delay: index * 0.05, duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
            whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(13,18,22,0.10)" }}
            whileTap={{ scale: 0.985 }}
            className="group relative w-full text-left overflow-hidden transition-all bg-white rounded-xl shadow-sm border border-gray-100 hover:border-gray-300">
            <div style={{ height: 4, background: color || "#111827" }} />
            <div className="p-5 flex flex-col h-full">
                <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-[16px] font-semibold text-gray-900 leading-snug">{group.title}</h3>
                    </div>
                </div>

                <div className="mt-auto">
                    <div className="flex flex-wrap gap-1 mb-4">
                        {group.notes.map((note) => {
                            const bgColor = PARTICIPANT_COLORS[note.color] || PARTICIPANT_COLORS["yellow"];
                            return (
                                <div key={note.id} className="flex-shrink-0"
                                    style={{
                                        width: 24, height: 24, borderRadius: 4, backgroundColor: bgColor,
                                        boxShadow: "0 1px 3px rgba(13,18,22,0.08)"
                                    }} />
                            );
                        })}
                    </div>
                    <div className="flex items-center gap-1.5 text-[12px] font-medium text-brand-ink-muted transition-colors group-hover:text-gray-900">
                        <span>{group.notes.length} Insights</span>
                        <span className="opacity-40 ml-1 mr-1">•</span>
                        <span>View Cluster</span>
                    </div>
                </div>
            </div>
        </motion.button>
    );
};

const ExpandedView = ({ group, onClose, color }) => {
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
                            <span className="text-xs font-semibold text-brand-ink-muted">Display Now Research Themes</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default function AffinityMapDisplayNow({ color }) {
    const data = ALL_DATA;
    const [expandedId, setExpandedId] = useState(null);

    const expandedGroup = data.find(g => g.id === expandedId);
    const totalNotes = data.reduce((sum, g) => sum + g.notes.length, 0);

    return (
        <div className="w-full font-sans" style={{ fontFamily: '"Outfit", "Inter", sans-serif' }}>
            <div className="relative w-full overflow-hidden bg-white border border-gray-200 rounded-2xl shadow-lg"
                style={{ minHeight: 600 }}>

                <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                    style={{ backgroundImage: "radial-gradient(circle, #0D1216 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

                <div className="relative z-20 flex flex-col px-6 md:px-8 pt-6 pb-8" style={{ backgroundColor: '#0D1216' }}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center shrink-0 w-12 h-12 rounded-full shadow-sm border border-transparent text-[#04101A]" style={{ backgroundColor: color }}>
                                <Layers size={22} />
                            </div>
                            <div>
                                <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">Affinity Map</h1>
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
                    <div className="flex items-center gap-2 text-[13px] font-bold text-brand-ink-muted uppercase tracking-wider">
                        <Layers size={16} /> Foundational Themes
                    </div>
                </div>

                <div className="relative z-10 p-6 md:p-8 grid gap-5 bg-gray-50/50"
                    style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
                    <AnimatePresence mode="wait">
                        {data.map((group, i) => (
                            <GroupCard key={group.id} group={group} index={i} color={color}
                                onClick={() => setExpandedId(group.id)} />
                        ))}
                    </AnimatePresence>
                </div>

                <AnimatePresence>
                    {expandedGroup && (
                        <ExpandedView key={expandedGroup.id} group={expandedGroup} color={color}
                            onClose={() => setExpandedId(null)} />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
