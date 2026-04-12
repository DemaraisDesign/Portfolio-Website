// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useMemo } from "react";
import { ChevronRight, ChevronLeft, Layers, X, Users, MessageSquareQuote, Filter } from "lucide-react";
import ImpactList from './ImpactList';

const PARTICIPANTS = {
    P1: { label: "Participant 1", color: "#F2A2D7" },
    P2: { label: "Participant 2", color: "#61F5B9" },
    P3: { label: "Participant 3", color: "#F9F871" },
    P4: { label: "Participant 4", color: "#CCF6FF" },
    P5: { label: "Participant 5", color: "#DBECE8" },
    P6: { label: "Participant 6", color: "#9BAEBC" },
    P7: { label: "Participant 7", color: "#F16186" },
};

const ALL_DATA = [
    {
        id: "stars-confusion",
        title: "Did not understand use of stars",
        percentage: 71,
        severity: "critical",
        notes: [
            { id: "s1", text: "Didn't understand stars.", participant: "P1" },
            { id: "s2", text: "Didn't understand what the stars were.", participant: "P2" },
            { id: "s3", text: "Wasn't sure what the usefulness of the star system as is.", participant: "P3" },
            { id: "s4", text: "Didn't intuitively understand what the purpose of the stars,", participant: "P4" },
            { id: "s5", text: "Didn't understand the point of the stars.", participant: "P5" },
        ],
    },
    {
        id: "kids-game",
        title: 'Assumed app a "kids game" at home screen',
        percentage: 29,
        severity: "moderate",
        notes: [
            { id: "k1", text: "Thought it looks like a kids game on home screen.", participant: "P6" },
            { id: "k2", text: "Assumed the game was going to be for kids based on aesthetics at startup screen. Did not feel the design was targeted to someone like him.", participant: "P4" },
        ],
    },
    {
        id: "empty-space",
        title: "Critiqued empty space",
        percentage: 57,
        severity: "critical",
        notes: [
            { id: "e1", text: 'Noticed "empty real estate"', participant: "P7" },
            { id: "e2", text: "Thinks there is too much unused space.", participant: "P5" },
            { id: "e3", text: "Noticed a lot of blank space on the home screen.", participant: "P1" },
            { id: "e4", text: "Too much negative space on title screen.", participant: "P2" },
        ],
    },
    {
        id: "tutorial-confusing",
        title: "Found tutorial confusing",
        percentage: 14,
        severity: "critical",
        notes: [
            { id: "tc1", text: "Found the tutorial confusing.", participant: "P6" },
        ],
    },
    {
        id: "written-instructions",
        title: "Confused by written instructions",
        percentage: 57,
        severity: "critical",
        notes: [
            { id: "wi1", text: "Was confused by the written language in the tutorial.", participant: "P1" },
            { id: "wi2", text: "Found the written instructions confusing.", participant: "P4" },
            { id: "wi3", text: "Was confused by the tutorial language", participant: "P5" },
            { id: "wi4", text: "Did not fully understand the point of the game based on the written rules.", participant: "P2" },
        ],
    },
    {
        id: "game-after-tutorial",
        title: "Did not understand game after tutorial",
        percentage: 71,
        severity: "critical",
        notes: [
            { id: "gat1", text: "Did not understand the point of the game after written and interactive tutorial.", participant: "P6" },
            { id: "gat2", text: "Did not fully understand the game at the end of the tutorial.", participant: "P4" },
            { id: "gat3", text: "Didn't understand the point of the game after the tutorial.", participant: "P1" },
            { id: "gat4", text: "Was confused by point of the game after tutorial", participant: "P2" },
            { id: "gat5", text: "Did not immediately understand that you had to use all the numbers.", participant: "P5" },
        ],
    },
    {
        id: "tutorial-helpful",
        title: "Found tutorial helpful",
        percentage: 14,
        severity: "positive",
        notes: [
            { id: "th1", text: "Found the tutorial helpful.", participant: "P3" },
        ],
    },
    {
        id: "voice-reinforcement",
        title: "Liked voice over reinforcement",
        percentage: 43,
        severity: "positive",
        notes: [
            { id: "vr1", text: "Thinks that positive reinforcement in the game can have benefits to kids.", participant: "P3" },
            { id: "vr2", text: 'Laughed at the "gooood" voice.', participant: "P1" },
            { id: "vr3", text: 'Liked the "very good" voice', participant: "P6" },
        ],
    },
    {
        id: "liked-music",
        title: "Liked the music",
        percentage: 43,
        severity: "positive",
        notes: [
            { id: "lm1", text: "Liked the music.", participant: "P1" },
            { id: "lm2", text: "Liked that they could change the music.", participant: "P5" },
            { id: "lm3", text: "Liked that the music matched the stress level of the situation.", participant: "P3" },
        ],
    },
    {
        id: "lightbulb-function",
        title: "Intuitively understood lightbulb function",
        percentage: 71,
        severity: "positive",
        notes: [
            { id: "lb1", text: "Did understand what the lightbulbs were.", participant: "P2" },
            { id: "lb2", text: "Guessed the lightbulbs.", participant: "P5" },
            { id: "lb3", text: "Did not understand the lightbulbs intuitively.", participant: "P4" },
            { id: "lb4", text: "Understood hints.", participant: "P6" },
            { id: "lb5", text: "Guessed what lightbulbs meant.", participant: "P7" },
        ],
    },
    {
        id: "numbers-combining",
        title: "Confused by numbers combining after function",
        percentage: 57,
        severity: "critical",
        notes: [
            { id: "nc1", text: "Confused by UI of numbers becoming new numbers.", participant: "P1" },
            { id: "nc2", text: "Was confused by numbers disappearing after a function.", participant: "P4" },
            { id: "nc3", text: "Wasn't sure what was happening as numbers were combined.", participant: "P5" },
            { id: "nc4", text: "Did not understand the relationship between original numbers and new numbers that appear after a function.", participant: "P6" },
        ],
    },
    {
        id: "more-rewards",
        title: "Requested more rewards",
        percentage: 29,
        severity: "moderate",
        notes: [
            { id: "mr1", text: "Wants more varied sets of goals and rewards.", participant: "P3" },
            { id: "mr2", text: "Wanted to gamify more of the game. (Mini challenges...daily challenges...leader boards...)", participant: "P6" },
        ],
    },
    {
        id: "tutorial-level-1",
        title: "Did not like tutorial was also level 1",
        percentage: 57,
        severity: "critical",
        notes: [
            { id: "tl1", text: "Didn't like that the tutorial was counted as a level.", participant: "P3" },
            { id: "tl2", text: "Went to the tutorial level a second time as opposed to level 2.", participant: "P6" },
            { id: "tl3", text: "Was confused that the first level repeated the tutorial.", participant: "P2" },
            { id: "tl4", text: "Went to the tutorial level a second time as opposed to level 2.", participant: "P7" },
        ],
    },
    {
        id: "requested-history",
        title: "Requested history",
        percentage: 43,
        severity: "moderate",
        notes: [
            { id: "rh1", text: "Wants to see the operations slide up the board to see history of actions.", participant: "P7" },
            { id: "rh2", text: "Wanted to see the history of decisions.", participant: "P1" },
            { id: "rh3", text: "I'd like to see a record of the actions I take while playing.", participant: "P5" },
        ],
    },
    {
        id: "would-not-continue",
        title: "Would not continue using app",
        percentage: 57,
        severity: "critical",
        notes: [
            { id: "wnc1", text: "Does not see themselves playing this for fun.", participant: "P6" },
            { id: "wnc2", text: "Does not see themselves playing the game on their own.", participant: "P2" },
            { id: "wnc3", text: "Does not see herself playing this game.", participant: "P1" },
            { id: "wnc4", text: "Does not see themselves playing a game like this.", participant: "P4" },
        ],
    },
    {
        id: "would-use-app",
        title: "Would use app",
        percentage: 43,
        severity: "positive",
        notes: [
            { id: "wu1", text: "Would play this for fun.", participant: "P7" },
            { id: "wu2", text: "Would play Survival of their own accord.", participant: "P5" },
            { id: "wu3", text: "Would continue playing this game.", participant: "P3" },
        ],
    },
    {
        id: "pay-structure",
        title: "Reacted negatively to pay structure",
        percentage: 29,
        severity: "moderate",
        notes: [
            { id: "ps1", text: "Didn't like the idea of having to complete that many puzzles to advance.", participant: "P4" },
            { id: "ps2", text: "Didn't like microtransaction setup.", participant: "P5" },
        ],
    },
    {
        id: "button-mashing",
        title: "Button mashed instead of playing",
        percentage: 29,
        severity: "moderate",
        notes: [
            { id: "bm1", text: "Randomly pressed buttons to advance when he ran out of hints, which he didn't like.", participant: "P3" },
            { id: "bm2", text: "Randomly chose numbers rather than strategic thought.", participant: "P1" },
        ],
    },
    {
        id: "methods-to-compete",
        title: "Expressed interest in methods to compete",
        percentage: 57,
        severity: "moderate",
        notes: [
            { id: "mc1", text: "Wants leaderboards or other ways to share his score.", participant: "P5" },
            { id: "mc2", text: "Wanted to compete with survival mode.", participant: "P7" },
            { id: "mc3", text: "Intrigued by a multiplayer function, but worried about feeling stupid.", participant: "P3" },
            { id: "mc4", text: "Would consider playing if there were team challenges.", participant: "P2" },
        ],
    },
    {
        id: "game-difficult",
        title: "Verbalized that the game is very difficult",
        percentage: 71,
        severity: "critical",
        notes: [
            { id: "gd1", text: "Was frustrated by not understanding the game and wanted to stop.", participant: "P6" },
            { id: "gd2", text: "Thought the game is very challenging.", participant: "P4" },
            { id: "gd3", text: "Found the game too difficult.", participant: "P1" },
            { id: "gd4", text: "Perceived the game to be intimidatingly difficult.", participant: "P2" },
            { id: "gd5", text: "Felt that the game was difficult right away.", participant: "P3" },
        ],
    },
    {
        id: "liked-concept",
        title: "Liked game concept",
        percentage: 43,
        severity: "positive",
        notes: [
            { id: "lc1", text: "Liked the concept of the game", participant: "P5" },
            { id: "lc2", text: "Liked the concept once he understood and was eager to try.", participant: "P7" },
            { id: "lc3", text: "Has played the game before and likes the concept.", participant: "P3" },
        ],
    },
    {
        id: "preferred-survival",
        title: "Preferred survival",
        percentage: 43,
        severity: "positive",
        notes: [
            { id: "psv1", text: "Enjoyed the survival mode more.", participant: "P3" },
            { id: "psv2", text: "Very much preferred Survival mode.", participant: "P5" },
            { id: "psv3", text: "Preferred survival to the regular version. Found it legitimately fun.", participant: "P7" },
        ],
    },
    {
        id: "disliked-survival",
        title: "Disliked survival",
        percentage: 29,
        severity: "moderate",
        notes: [
            { id: "ds1", text: "'Hated' survival mode", participant: "P6" },
            { id: "ds2", text: "Did not like Survival.", participant: "P1" },
        ],
    },
    {
        id: "potpourri-requests",
        title: "Potpourri requests",
        percentage: null,
        severity: "minor",
        notes: [
            { id: "pr1", text: "Wants to deselect by tapping the same spot twice.", participant: "P5" },
            { id: "pr2", text: "Wanted an undo button. (Survival)", participant: "P5" },
            { id: "pr3", text: "Thought stars and hints could be combined.", participant: "P5" },
            { id: "pr4", text: "Would like a shuffle button to reorder numbers.", participant: "P7" },
            { id: "pr5", text: "Didn't like getting dumped back into menu after losing in survival.", participant: "P5" },
            { id: "pr6", text: "Wanted to know how hard and medium difficulty puzzles felt.", participant: "P5" },
            { id: "pr7", text: "Wants locked puzzle packs to be more visually distinct", participant: "P2" },
            { id: "pr8", text: 'Wanted to have the freedom to make "stupid mistakes"', participant: "P5" },
            { id: "pr9", text: "Wanted more hints.", participant: "P3" },
        ],
    },
    {
        id: "random-insights",
        title: "Random insights",
        percentage: null,
        severity: "minor",
        notes: [
            { id: "ri1", text: "Likes that he's stopped when solution is impossible to reach.", participant: "P3" },
            { id: "ri2", text: "Likes the pop-up functionality for functions.", participant: "P3" },
            { id: "ri3", text: "Liked that there were multiple paths to the solution.", participant: "P7" },
            { id: "ri4", text: 'Doesn\'t like the padding between puzzles in survival....takes him out of "the zone."', participant: "P3" },
            { id: "ri5", text: "Likes that you can play with one hand.", participant: "P5" },
            { id: "ri6", text: "Liked that you couldn't see your progress.", participant: "P3" },
            { id: "ri7", text: "Liked that it moved automatically into the next puzzle. (Survival)", participant: "P5" },
            { id: "ri8", text: "Liked that stars were taken away for using hints.", participant: "P1" },
            { id: "ri9", text: "Did not pay attention to the number of seconds on the clock.", participant: "P4" },
            { id: "ri10", text: 'Was surprised that the hints were so direct...thought they were "too generous."', participant: "P3" },
            { id: "ri11", text: "Liked the vibration tied to hints", participant: "P5" },
            { id: "ri12", text: "Thought the app icon was too busy to be recognizable.", participant: "P1" },
            { id: "ri13", text: "Was turned off by colors in path screen.", participant: "P2" },
        ],
    },
];

// Reverting to the brighter brand colors per user request (these are pure visual indicators, no text contrast needed)
const severityConfig = {
    critical: { label: "Critical", color: "#CE4D35", bg: "rgba(206,77,53,0.12)", desc: "Major usability blockers and steep learning curves." }, // brand: orange
    moderate: { label: "Moderate", color: "#56C6FF", bg: "rgba(86,198,255,0.12)", desc: "Friction points, missing features, and structural feedback." }, // brand: blue
    positive: { label: "Positive", color: "#00C2A3", bg: "rgba(0,194,163,0.12)", desc: "Successful mechanics, visual praise, and bright spots." },  // brand: teal
    minor: { label: "Minor", color: "#A88EFF", bg: "rgba(168,142,255,0.12)", desc: "Small UI tweaks, 'potpourri' requests, and stray observations." },    // brand: purple
};

const SeverityCard = ({ severityKey, cfg, clustersCount, notesCount, onClick, index }) => {
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
                        {cfg.label} Findings
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

const PercentRing = ({ value, color, size = 56 }) => {
    if (value == null) return null;
    const r = (size - 6) / 2;
    const circ = 2 * Math.PI * r;
    const offset = circ - (value / 100) * circ;
    return (
        <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
            <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-ink, #16161D)" strokeOpacity="0.06" strokeWidth="4" />
                <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="4"
                    strokeLinecap="round" strokeDasharray={circ}
                    initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.3 }} />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center font-bold"
                style={{ color: "#111827", fontSize: size < 52 ? 11 : 13 }}>{value}%</span>
        </div>
    );
};

const StickyNote = ({ note, index, participants }) => {
    const p = participants[note.participant];
    const bgColor = p?.color || "#D6F0FF";
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
                <div className="flex items-center justify-between mt-3 opacity-60">
                    <div className="flex items-center gap-1.5">
                        <MessageSquareQuote size={12} className="text-gray-800" />
                        <span className="text-[9px] font-bold tracking-wider text-gray-800 uppercase">{note.participant}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const GroupCard = ({ group, onClick, index, participants }) => {
    const sev = severityConfig[group.severity] || severityConfig.moderate;
    const uniqueP = [...new Set(group.notes.map(n => n.participant))];
    return (
        <motion.button layout="position" onClick={onClick}
            initial={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
            transition={{ delay: index * 0.05, duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
            whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(13,18,22,0.10), 0 0 0 1px rgba(86,198,255,0.2)" }}
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
                                {sev.label}
                            </span>
                            <span className="flex items-center gap-1.5 text-brand-ink-body text-[11px] font-medium">
                                <Users size={12} />{uniqueP.length}/{group.notes.length}
                            </span>
                        </div>
                        <h3 className="text-[16px] font-semibold text-gray-900 leading-snug">{group.title}</h3>
                    </div>
                    {group.percentage != null && <PercentRing value={group.percentage} color={sev.color} />}
                </div>

                <div className="mt-auto">
                    <div className="flex gap-1 mb-4 flex-wrap">
                        {uniqueP.map((pId) => (
                            <div key={pId} className="flex-shrink-0"
                                style={{
                                    width: 24, height: 24, borderRadius: 4, backgroundColor: participants[pId]?.color || "#D6F0FF",
                                    boxShadow: "0 1px 3px rgba(13,18,22,0.08)"
                                }} />
                        ))}
                    </div>
                    <div className="flex items-center gap-1.5 text-[12px] font-medium text-brand-ink-muted transition-colors group-hover:opacity-100" style={{ color: "var(--hover-color, #6B7280)" }}
                        onMouseEnter={(e) => e.currentTarget.style.setProperty('--hover-color', sev.color)}
                        onMouseLeave={(e) => e.currentTarget.style.removeProperty('--hover-color')}
                    >
                        <span>Expand cluster</span>
                        <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                </div>
            </div>
        </motion.button>
    );
};

const ExpandedView = ({ group, onClose, participants }) => {
    const sev = severityConfig[group.severity] || severityConfig.moderate;
    const uniqueP = [...new Set(group.notes.map(n => n.participant))];
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
                                    {uniqueP.length} participants · {group.notes.length} notes
                                </span>
                            </div>
                            <h2 className="text-[18px] md:text-[20px] font-bold text-gray-900">{group.title}</h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-5">
                        {group.percentage != null && <PercentRing value={group.percentage} color={sev.color} size={48} />}
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
                            <StickyNote key={note.id} note={note} index={i} participants={participants} />
                        ))}
                    </div>
                </div>
                <div className="px-6 py-4 flex flex-col md:flex-row items-center border-t border-gray-100 bg-white gap-4">
                    <div className="flex items-center gap-3 flex-wrap">
                        {uniqueP.map(pId => (
                            <div key={pId} className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                                <div style={{ width: 10, height: 10, borderRadius: 2, background: participants[pId]?.color || "#D6F0FF" }} />
                                <span className="text-xs font-semibold text-brand-ink-muted uppercase">{pId}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};



export default function AffinityMap({ impactData, color, isEmbedded }) {
    const data = ALL_DATA;
    const participants = PARTICIPANTS;
    const [expandedId, setExpandedId] = useState(null);
    const [activeSeverityLayer, setActiveSeverityLayer] = useState(null);

    const severityStats = useMemo(() => {
        const stats = {
            critical: { clusters: 0, notes: 0 },
            moderate: { clusters: 0, notes: 0 },
            minor: { clusters: 0, notes: 0 },
            positive: { clusters: 0, notes: 0 }
        };
        data.forEach(g => {
            if (stats[g.severity]) {
                stats[g.severity].clusters++;
                stats[g.severity].notes += g.notes.length;
            }
        });
        return stats;
    }, [data]);

    const activeData = activeSeverityLayer ? data.filter(g => g.severity === activeSeverityLayer) : [];
    const sorted = [...activeData].sort((a, b) => (b.percentage ?? -1) - (a.percentage ?? -1));
    const expandedGroup = data.find(g => g.id === expandedId);
    const totalNotes = data.reduce((sum, g) => sum + g.notes.length, 0);

    return (
        <div className={`w-full font-sans ${isEmbedded ? 'mt-8' : 'mb-16 mt-12'}`} style={{ fontFamily: '"Outfit", "Inter", sans-serif' }}>
            <div className={`relative w-full overflow-hidden ${isEmbedded ? '' : 'bg-white border border-gray-200 rounded-2xl shadow-lg'}`}
                style={{ minHeight: isEmbedded ? 400 : 600 }}>

                {/* Subtle dot pattern background */}
                {!isEmbedded && (
                    <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                        style={{ backgroundImage: "radial-gradient(circle, #0D1216 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
                )}

                {/* Top Section */}
                {!isEmbedded && (
                    <div className="relative z-20 flex flex-col px-6 md:px-8 pt-6 pb-8" style={{ backgroundColor: '#1b262f' }}>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center justify-center shrink-0 w-12 h-12 rounded-full bg-brand-blue shadow-sm border border-transparent text-brand-ink">
                                    <Layers size={22} />
                                </div>
                                <div>
                                    <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">Usability Test Findings</h1>
                                    <p className="text-sm font-medium text-white/70 mt-0.5">Interactive Visualization</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-white/90 bg-white/10 px-3 py-1.5 rounded-lg border border-white/20">
                                <span>{data.length} clusters</span>
                                <span className="opacity-40">•</span>
                                <span>{totalNotes} notes</span>
                                <span className="opacity-40">•</span>
                                <span>7 users</span>
                            </div>
                        </div>

                        {/* Render ImpactList metrics straight into the header area if provided */}
                        {impactData && (
                            <div className="mt-8 pt-6 border-t border-white/10 -mx-2 md:mx-0">
                                <ImpactList items={impactData} color="#56C6FF" theme="dark" />
                            </div>
                        )}
                    </div>
                )}

                {/* Layer Navigation */}
                {(!isEmbedded || activeSeverityLayer) && (
                    <div className="relative z-10 flex items-center px-6 md:px-8 py-4 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200" style={{ minHeight: '64px' }}>
                        <AnimatePresence mode="wait">
                            {!activeSeverityLayer ? (
                                <motion.div key="overview" initial={{ opacity: 0, filter: "blur(4px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} exit={{ opacity: 0, filter: "blur(4px)" }} className="flex items-center gap-2 text-[13px] font-bold text-brand-ink-muted uppercase tracking-wider">
                                    <Layers size={16} /> All Discovery Insights
                                </motion.div>
                            ) : (
                                <motion.div key="drilldown" initial={{ opacity: 0, filter: "blur(4px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} exit={{ opacity: 0, filter: "blur(4px)" }} className="flex items-center gap-2 text-[14px] font-semibold text-gray-900">
                                    <button onClick={() => setActiveSeverityLayer(null)} className="flex items-center gap-1.5 hover:text-brand-blue transition-colors px-3 py-1.5 -ml-3 rounded-md hover:bg-gray-50 text-brand-ink-muted">
                                        <ChevronLeft size={16} /> Overview
                                    </button>
                                    <span className="text-gray-300">/</span>
                                    <span className="text-gray-900">{severityConfig[activeSeverityLayer]?.label} Findings</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}

                <div className="relative z-10 p-6 md:p-8 grid gap-5 bg-gray-50/50"
                    style={{ gridTemplateColumns: activeSeverityLayer ? "repeat(auto-fill, minmax(280px, 1fr))" : "repeat(auto-fill, minmax(340px, 1fr))" }}>
                    <AnimatePresence mode="wait">
                        {!activeSeverityLayer ? (
                            Object.entries(severityConfig).map(([key, cfg], i) => {
                                if (severityStats[key].clusters === 0) return null;
                                return (
                                    <SeverityCard
                                        key={key}
                                        severityKey={key}
                                        cfg={cfg}
                                        clustersCount={severityStats[key].clusters}
                                        notesCount={severityStats[key].notes}
                                        index={i}
                                        onClick={() => setActiveSeverityLayer(key)}
                                    />
                                );
                            })
                        ) : (
                            sorted.map((group, i) => (
                                <GroupCard key={group.id} group={group} index={i}
                                    participants={participants}
                                    onClick={() => setExpandedId(group.id)} />
                            ))
                        )}
                    </AnimatePresence>
                </div>

                <AnimatePresence>
                    {expandedGroup && (
                        <ExpandedView key={expandedGroup.id} group={expandedGroup}
                            participants={participants}
                            onClose={() => setExpandedId(null)} />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
