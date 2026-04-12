import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './UsabilitySummary.css';
import AffinityMap from './AffinityMap';

const Solve24UsabilitySummary = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="usability-wrapper flex flex-col w-full relative z-10">
            <header className="report-header" role="banner">
                <div className="report-container">
                    <p className="header-eyebrow" aria-hidden="true">Usability Testing Report</p>
                    <h1 className="header-title">Solve 24<br />Usability Testing <em>Summary</em></h1>
                    <p className="header-subtitle">Prototype evaluation with mobile gamers, math enthusiasts, and individuals with shared interests in gaming and mathematics.</p>
                    <dl className="header-meta" aria-label="Study details">
                        <div className="meta-item">
                            <dt className="meta-label">Participants</dt>
                            <dd className="meta-value">7</dd>
                        </div>
                        <div className="meta-item">
                            <dt className="meta-label">Method</dt>
                            <dd className="meta-value">Moderated Remote & In-Person</dd>
                        </div>
                        <div className="meta-item">
                            <dt className="meta-label">Platform</dt>
                            <dd className="meta-value">Zoom / In-Person</dd>
                        </div>
                        <div className="meta-item">
                            <dt className="meta-label">Age Range</dt>
                            <dd className="meta-value">Mid-20s – Mid-50s</dd>
                        </div>
                    </dl>
                </div>
            </header>

            <main id="main-content">
                <section aria-labelledby="exec-heading">
                    <div className="report-container">
                        <h2 id="exec-heading" className="section-label">Executive Summary</h2>
                        <p className="exec-callout">
                            Testing revealed a fundamental design mismatch. <strong>The game's target audience may not be the users its current design was built to attract.</strong> Adults — including some who worked with complex math — found the game extremely challenging. The tutorial failed to teach the core mechanic, the UI confused most participants, and the difficulty curve deterred continued use. However, self-proclaimed "math geeks" relished the experience, particularly survival mode, pointing toward a viable but narrower audience.
                        </p>
                    </div>
                </section>

                <div className="expand-container">
                    <button
                        className="expand-btn"
                        aria-expanded={isOpen}
                        aria-controls="report-details"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <span className="expand-label">{isOpen ? "Collapse Report" : "View Full Report"}</span>
                        <motion.svg
                            aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            className="w-4 h-4"
                        >
                            <polyline points="4 6 8 10 12 6" />
                        </motion.svg>
                    </button>
                </div>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            id="report-details"
                            className="report-details"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            role="region"
                            aria-labelledby="expand-toggle"
                        >
                            <section aria-labelledby="metrics-heading">
                                <div className="report-container">
                                    <h2 id="metrics-heading" className="section-label">Key Metrics</h2>
                                    <div className="stat-grid" role="list" aria-label="Key performance metrics">
                                        <div className="stat-card" role="listitem">
                                            <p className="stat-label-sm">Tutorial Frustration</p>
                                            <p className="stat-number critical" aria-label="86 percent">86%</p>
                                            <p className="stat-desc">6 of 7 participants expressed frustration with the tutorial</p>
                                        </div>
                                        <div className="stat-card" role="listitem">
                                            <p className="stat-label-sm">Comprehension<br />Rate</p>
                                            <p className="stat-number critical" aria-label="29 percent">29%</p>
                                            <p className="stat-desc">Only 2 of 7 understood the game after completing the tutorial</p>
                                        </div>
                                        <div className="stat-card" role="listitem">
                                            <p className="stat-label-sm">Mechanic Confusion</p>
                                            <p className="stat-number critical" aria-label="86 percent">86%</p>
                                            <p className="stat-desc">6 of 7 confused by how numbers combine after a function</p>
                                        </div>
                                        <div className="stat-card" role="listitem">
                                            <p className="stat-label-sm">Would Not Continue</p>
                                            <p className="stat-number critical" aria-label="57 percent">57%</p>
                                            <p className="stat-desc">4 of 7 said they would not continuously use the app</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section aria-labelledby="method-heading">
                                <div className="report-container">
                                    <h2 id="method-heading" className="section-label">Methodology</h2>
                                    <div className="method-grid">
                                        <div className="method-block">
                                            <h3>Participants</h3>
                                            <p>Seven individuals with shared interests in mobile gaming, math, or both. Ages ranged from mid-20s to mid-50s. Each session lasted approximately 90 minutes, combining usability testing on the current build with a semi-structured interview. Six sessions were conducted remotely via Zoom with screen sharing; one was in person.</p>
                                        </div>
                                        <div className="method-block">
                                            <h3>Tasks</h3>
                                            <ul className="method-list">
                                                <li>Complete the in-game tutorial</li>
                                                <li>Play the game and attempt to solve puzzles</li>
                                            </ul>
                                            <h3 style={{ marginTop: '20px' }}>Observation Criteria</h3>
                                            <ul className="method-list">
                                                <li>Enjoyment and engagement with the game</li>
                                                <li>Ability to navigate the interface and comprehend rules</li>
                                                <li>Perceived difficulty and willingness to continue</li>
                                                <li>Reactions to visual design, audio, and game modes</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section aria-labelledby="task-heading">
                                <div className="report-container">
                                    <h2 id="task-heading" className="section-label">Task Performance</h2>
                                    <table className="task-table">
                                        <caption className="sr-only">Task completion rates with primary blockers and severity ratings</caption>
                                        <thead>
                                            <tr>
                                                <th scope="col">Task</th>
                                                <th scope="col">Completion Rate</th>
                                                <th scope="col">Primary Blocker</th>
                                                <th scope="col">Severity</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <th scope="row">Complete the Tutorial</th>
                                                <td>
                                                    <div className="rate-bar-container">
                                                        <div className="rate-bar" role="img" aria-label="29 percent bar"><div className="rate-bar-fill fail" style={{ width: '29%' }}></div></div>
                                                        <span className="rate-value fail">29%</span>
                                                    </div>
                                                </td>
                                                <td>Written instructions confused 57% of users; single-level tutorial insufficient</td>
                                                <td><span className="severity-badge" style={{ background: 'var(--severity-critical-bg)', color: 'var(--severity-critical)' }}>Catastrophe</span></td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Solve Puzzles Effectively</th>
                                                <td>
                                                    <div className="rate-bar-container">
                                                        <div className="rate-bar" role="img" aria-label="14 percent bar"><div className="rate-bar-fill fail" style={{ width: '14%' }}></div></div>
                                                        <span className="rate-value fail">14%</span>
                                                    </div>
                                                </td>
                                                <td>86% confused by number-combining mechanic; 28% resorted to button-mashing</td>
                                                <td><span className="severity-badge" style={{ background: 'var(--severity-critical-bg)', color: 'var(--severity-critical)' }}>Catastrophe</span></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </section>

                            <section aria-labelledby="affinity-map-title">
                                <div className="report-container">
                                    <h2 id="affinity-map-title" className="section-label">Affinity Map: Interactive Visualization</h2>
                                    <div style={{ opacity: 1, backgroundColor: 'transparent' }}>
                                        <AffinityMap isEmbedded={true} />
                                    </div>
                                </div>
                            </section>

                            <section aria-labelledby="quotes-heading">
                                <div className="report-container">
                                    <h2 id="quotes-heading" className="section-label">Participant Quotes</h2>
                                    <div className="quotes-grid">
                                        <div className="quote-card" style={{ 
                                            backgroundColor: 'rgba(76, 175, 124, 0.1)', 
                                            borderColor: 'rgba(76, 175, 124, 0.2)',
                                            '--quote-text-color': 'var(--ink)',
                                            '--quote-author-color': 'var(--ink-secondary)'
                                        }}>
                                            <p className="quote-text">"[This would attract] a very small subset of the population... The kind of people you find in dark basements of physics labs and things like that."</p>
                                            <p className="quote-author">— Rick</p>
                                        </div>
                                        <div className="quote-card" style={{ 
                                            backgroundColor: 'rgba(255, 222, 33, 0.1)', 
                                            borderColor: 'rgba(255, 222, 33, 0.2)',
                                            '--quote-text-color': 'var(--ink)',
                                            '--quote-author-color': 'var(--ink-secondary)'
                                        }}>
                                            <p className="quote-text">"I don't find it relaxing. But that's a personality thing. I can see how someone like my dad would actually find it relaxing and enjoy it quite a lot."</p>
                                            <p className="quote-author">— Roni</p>
                                        </div>
                                        <div className="quote-card">
                                            <p className="quote-text">"I feel bad... honestly [the game is too difficult for me.]"</p>
                                            <p className="quote-author">— Brent</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section aria-labelledby="findings-heading">
                                <div className="report-container">
                                    <h2 id="findings-heading" className="section-label">Findings</h2>
                                    <p className="findings-intro">
                                        Issues categorized using Nielsen's severity rating scale (0–4) and prioritized by frequency and impact on comprehension, engagement, and retention. Each finding includes observed evidence and an actionable recommendation.
                                    </p>

                                    <div className="severity-legend" role="list" aria-label="Severity scale legend">
                                        <div className="legend-item" role="listitem"><span className="legend-dot s4" aria-hidden="true"></span> 4 — Usability Catastrophe</div>
                                        <div className="legend-item" role="listitem"><span className="legend-dot s3" aria-hidden="true"></span> 3 — Major Problem</div>
                                    </div>

                                    <article className="finding-card severity-4" aria-labelledby="finding-1-title">
                                        <div className="finding-header">
                                            <div>
                                                <p className="finding-category">Onboarding</p>
                                                <h3 id="finding-1-title" className="finding-title">Tutorial fails to teach the core game mechanic</h3>
                                            </div>
                                            <span className="severity-badge" aria-label="Severity 4, usability catastrophe">Severity 4</span>
                                        </div>
                                        <p className="finding-body">
                                            86% of participants expressed frustration with the tutorial. It consisted of only a single level, which was insufficient to convey the game's rules and objectives. 57% were confused by the written instructions, and 71% did not understand how to play the game after completing it. The tutorial created a negative first impression that colored the rest of the session.
                                        </p>
                                        <div className="finding-evidence">
                                            <span className="evidence-label">Frequency</span>
                                            <span>6 of 7 frustrated (86%) · 5 of 7 did not understand game afterward (71%)</span>
                                        </div>
                                        <div className="finding-recommendation">
                                            <p className="rec-label">Recommendation</p>
                                            <p className="rec-text">Expand the tutorial to a progressive, multi-level sequence that introduces one concept at a time. Replace written instructions with interactive demonstrations. Add a persistent hints system at harder puzzles, as requested by 28% of participants.</p>
                                        </div>
                                    </article>

                                    <article className="finding-card severity-4" aria-labelledby="finding-2-title">
                                        <div className="finding-header">
                                            <div>
                                                <p className="finding-category">Game Mechanics</p>
                                                <h3 id="finding-2-title" className="finding-title">Number-combining behavior after function application is unintuitive</h3>
                                            </div>
                                            <span className="severity-badge" aria-label="Severity 4, usability catastrophe">Severity 4</span>
                                        </div>
                                        <p className="finding-body">
                                            86% of participants were confused by how numbers combined after a function was applied. While 71% could grasp the high-level concept of a function, the resulting transformation of values on screen was opaque. This disconnect between expectation and outcome led 28% of participants to abandon strategic play entirely and resort to button-mashing.
                                        </p>
                                        <div className="finding-evidence">
                                            <span className="evidence-label">Frequency</span>
                                            <span>6 of 7 confused by combining mechanic (86%) · 2 of 7 button-mashed (28%)</span>
                                        </div>
                                        <div className="finding-recommendation">
                                            <p className="rec-label">Recommendation</p>
                                            <p className="rec-text">Implement animations that visually illustrate the impact of functions on numbers. Make the cause-and-effect relationship between input, operation, and output explicit. Consider showing a real-time computation preview before the player commits to a move.</p>
                                        </div>
                                    </article>

                                    <article className="finding-card severity-4" aria-labelledby="finding-3-title">
                                        <div className="finding-header">
                                            <div>
                                                <p className="finding-category">Audience / Retention</p>
                                                <h3 id="finding-3-title" className="finding-title">Design-audience mismatch threatens retention</h3>
                                            </div>
                                            <span className="severity-badge" aria-label="Severity 4, usability catastrophe">Severity 4</span>
                                        </div>
                                        <p className="finding-body">
                                            The game's playful UI and whimsical sound effects were tailored to a younger audience, but the difficulty level demands adult mathematical reasoning. 71% of participants noted the game is very difficult, and 57% said they would not continuously use the app. Meanwhile, the participants who engaged most deeply were self-described 'math geeks' — suggesting the core audience is narrower and more specialized than the visual design implies.
                                        </p>
                                        <div className="finding-evidence">
                                            <span className="evidence-label">Frequency</span>
                                            <span>4 of 7 would not continue (57%) · 5 of 7 found game very difficult (71%)</span>
                                        </div>
                                        <div className="finding-recommendation">
                                            <p className="rec-label">Recommendation</p>
                                            <p className="rec-text">Rebrand the game UI for the appropriate audience. Embrace the difficulty as a selling point and market accordingly. Focus on survival mode as the core experience, with other modes positioned as practice. Develop a dynamic scoring system based on solve time and error count.</p>
                                        </div>
                                    </article>

                                    <article className="finding-card severity-3" aria-labelledby="finding-4-title">
                                        <div className="finding-header">
                                            <div>
                                                <p className="finding-category">Visual Design / UI</p>
                                                <h3 id="finding-4-title" className="finding-title">Color usage and UI elements lack semantic clarity</h3>
                                            </div>
                                            <span className="severity-badge" aria-label="Severity 3, major problem">Severity 3</span>
                                        </div>
                                        <p className="finding-body">
                                            71% of participants did not understand the purpose of colors in the interface, and 57% were confused by UI elements. An additional 57% critiqued empty space in the layout. While 100% of participants liked the visual art direction itself, the aesthetic failed to communicate function — colors were decorative rather than informational, and interactive affordances were unclear.
                                        </p>
                                        <div className="finding-evidence">
                                            <span className="evidence-label">Frequency</span>
                                            <span>5 of 7 confused by color usage (71%) · 4 of 7 confused by UI elements (57%)</span>
                                        </div>
                                        <div className="finding-recommendation">
                                            <p className="rec-label">Recommendation</p>
                                            <p className="rec-text">Establish a consistent color language where hues map to specific game states or operations. Audit the UI for elements that lack clear affordances. Use the empty space purposefully — for computation previews, hints, or progress feedback.</p>
                                        </div>
                                    </article>

                                    <article className="finding-card severity-3" aria-labelledby="finding-5-title">
                                        <div className="finding-header">
                                            <div>
                                                <p className="finding-category">Scoring / Feedback</p>
                                                <h3 id="finding-5-title" className="finding-title">Rating system is opaque and rewards are insufficient</h3>
                                            </div>
                                            <span className="severity-badge" aria-label="Severity 3, major problem">Severity 3</span>
                                        </div>
                                        <p className="finding-body">
                                            71% of participants did not understand the game's rating system, leaving them without a clear sense of progress or achievement. Additionally, 85% requested a function history feature and 28% requested more rewards — indicating a desire for feedback loops that the current design does not provide. Without legible scoring, the competitive drive that interviews revealed as a core motivator goes unaddressed.
                                        </p>
                                        <div className="finding-evidence">
                                            <span className="evidence-label">Frequency</span>
                                            <span>5 of 7 did not understand rating system (71%) · 6 of 7 requested history (85%)</span>
                                        </div>
                                        <div className="finding-recommendation">
                                            <p className="rec-label">Recommendation</p>
                                            <p className="rec-text">Eliminate the star system in favor of a transparent scoring mechanic. Introduce function history so players can review their approach. Establish leaderboards and achievement paths to tap into the competitive motivation identified in interviews.</p>
                                        </div>
                                    </article>

                                </div>
                            </section>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div >
    );
};

export default Solve24UsabilitySummary;
