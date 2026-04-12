import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import './UsabilitySummary.css';

const UsabilitySummary = ({ data }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="usability-wrapper flex flex-col w-full relative z-10">
            <header className="report-header" role="banner">
                <div className="report-container">
                    <p className="header-eyebrow flex items-center gap-3" aria-hidden="true">
                        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-brand-blue text-brand-ink">
                            <Search size={14} strokeWidth={2.5} />
                        </span>
                        {data?.preheader || "Usability Testing Report"}
                    </p>
                    <h1 className="header-title">{data?.title || "Usability Testing Summary"}</h1>
                    <p className="header-subtitle">Prototype evaluation with digital signage administrators, small business owners, and users of comparable software.</p>
                    <dl className="header-meta" aria-label="Study details">
                        <div className="meta-item">
                            <dt className="meta-label">Participants</dt>
                            <dd className="meta-value">8</dd>
                        </div>
                        <div className="meta-item">
                            <dt className="meta-label">Method</dt>
                            <dd className="meta-value">Moderated Remote</dd>
                        </div>
                        <div className="meta-item">
                            <dt className="meta-label">Platform</dt>
                            <dd className="meta-value">Zoom (Screen Share)</dd>
                        </div>
                        <div className="meta-item">
                            <dt className="meta-label">Age Range</dt>
                            <dd className="meta-value">Mid-20s – Early 60s</dd>
                        </div>
                    </dl>
                </div>
            </header>

            <main id="main-content">
                <section aria-labelledby="exec-heading" className="exec-summary-section">
                    <div className="report-container">
                        <h2 id="exec-heading" className="section-label">Executive Summary</h2>
                        <p className="exec-callout">
                            Results were uniformly negative. <strong>No participant completed both assigned tasks.</strong> Users were blocked by confusing language, false platform requirements, and an information architecture that obscured core functionality. Seven of eight participants indicated they would have abandoned the site immediately under normal conditions.
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
                                            <p className="stat-label-sm">Task Completion</p>
                                            <p className="stat-number critical" aria-label="0 percent">0%</p>
                                            <p className="stat-desc">No participant successfully completed all assigned tasks</p>
                                        </div>
                                        <div className="stat-card" role="listitem">
                                            <p className="stat-label-sm">Account Creation</p>
                                            <p className="stat-number critical" aria-label="25 percent">25%</p>
                                            <p className="stat-desc">Only 2 of 8 participants managed to create an account</p>
                                        </div>
                                        <div className="stat-card" role="listitem">
                                            <p className="stat-label-sm">IA Confusion</p>
                                            <p className="stat-number critical" aria-label="100 percent">100%</p>
                                            <p className="stat-desc">Every participant expressed confusion with information architecture</p>
                                        </div>
                                        <div className="stat-card" role="listitem">
                                            <p className="stat-label-sm">False Affordances</p>
                                            <p className="stat-number critical" aria-label="100 percent">100%</p>
                                            <p className="stat-desc">All participants clicked elements that were not interactive</p>
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
                                            <p>Eight individuals recruited from two segments: business owners interested in digital signage (5) and people who interact with comparable software in their work (3). Ages ranged from mid-20s to early 60s. Testing was conducted remotely via Zoom while participants shared their screens.</p>
                                        </div>
                                        <div className="method-block">
                                            <h3>Tasks</h3>
                                            <ul className="method-list">
                                                <li>Register an account on the platform</li>
                                                <li>Create a test sign using the product</li>
                                            </ul>
                                            <h3 style={{ marginTop: '20px' }}>Observation Criteria</h3>
                                            <ul className="method-list">
                                                <li>Ease of use and aesthetic clarity</li>
                                                <li>Ability to quickly test the product</li>
                                                <li>Perceived utility for participant's use cases</li>
                                                <li>Landing page content and appearance</li>
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
                                                <th scope="row">Register an Account</th>
                                                <td>
                                                    <div className="rate-bar-container">
                                                        <div className="rate-bar" role="img" aria-label="25 percent bar"><div className="rate-bar-fill fail" style={{ width: '25%' }}></div></div>
                                                        <span className="rate-value fail">25%</span>
                                                    </div>
                                                </td>
                                                <td>Site language implied Windows PC requirement; unclear CTAs drove abandonment before attempt</td>
                                                <td><span className="severity-badge" style={{ background: 'var(--severity-critical-bg)', color: 'var(--severity-critical)' }}>Catastrophe</span></td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Create a Test Sign</th>
                                                <td>
                                                    <div className="rate-bar-container">
                                                        <div className="rate-bar" role="img" aria-label="0 percent bar"><div className="rate-bar-fill fail" style={{ width: '0%' }}></div></div>
                                                        <span className="rate-value fail">0%</span>
                                                    </div>
                                                </td>
                                                <td>Users unable to locate product functionality; navigation created loops and dead ends</td>
                                                <td><span className="severity-badge" style={{ background: 'var(--severity-critical-bg)', color: 'var(--severity-critical)' }}>Catastrophe</span></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </section>

                            <section aria-labelledby="quotes-heading">
                                <div className="report-container">
                                    <h2 id="quotes-heading" className="section-label">Participant Quotes</h2>
                                    <div className="quotes-grid">
                                        <div className="quote-card">
                                            <p className="quote-text">"I'm thinking I don't want to buy a f***ing PC to use this."</p>
                                            <p className="quote-author">— Deidre</p>
                                        </div>
                                        <div className="quote-card">
                                            <p className="quote-text">"No offense, but who designed this? It's pretty rough."</p>
                                            <p className="quote-author">— Robert</p>
                                        </div>
                                        <div className="quote-card">
                                            <p className="quote-text">"I have no idea what I'm supposed to do."</p>
                                            <p className="quote-author">— Stanton</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section aria-labelledby="findings-heading">
                                <div className="report-container">
                                    <h2 id="findings-heading" className="section-label">Findings</h2>
                                    <p className="findings-intro">
                                        Issues categorized using Nielsen's severity rating scale (0–4) and prioritized by frequency and impact on task completion. Each finding includes observed evidence and an actionable recommendation.
                                    </p>

                                    <div className="severity-legend" role="list" aria-label="Severity scale legend">
                                        <div className="legend-item" role="listitem"><span className="legend-dot s4" aria-hidden="true"></span> 4 — Usability Catastrophe</div>
                                        <div className="legend-item" role="listitem"><span className="legend-dot s3" aria-hidden="true"></span> 3 — Major Problem</div>
                                    </div>

                                    <article className="finding-card severity-4" aria-labelledby="finding-1-title">
                                        <div className="finding-header">
                                            <div>
                                                <p className="finding-category">Copywriting / Language</p>
                                                <h3 id="finding-1-title" className="finding-title">Site language creates false impression that a Windows PC is required</h3>
                                            </div>
                                            <span className="severity-badge" aria-label="Severity 4, usability catastrophe">Severity 4</span>
                                        </div>
                                        <p className="finding-body">
                                            The platform does not require Windows. However, seven of eight participants said they would have left the site immediately because the landing page copy implied otherwise. This created a barrier before users even attempted the first task, disproportionately affecting Mac and mobile users. The one participant who pushed past the language confusion still could not complete the task.
                                        </p>
                                        <div className="finding-evidence">
                                            <span className="evidence-label">Frequency</span>
                                            <span>8 of 8 expressed negative feelings (100%) · 7 of 8 would have abandoned (88%)</span>
                                        </div>
                                        <div className="finding-recommendation">
                                            <p className="rec-label">Recommendation</p>
                                            <p className="rec-text">Audit all copy for platform-specific language. Replace with device-agnostic terminology. Add a clear compatibility statement on the landing page above the fold.</p>
                                        </div>
                                    </article>

                                    <article className="finding-card severity-4" aria-labelledby="finding-2-title">
                                        <div className="finding-header">
                                            <div>
                                                <p className="finding-category">Information Architecture</p>
                                                <h3 id="finding-2-title" className="finding-title">Users cannot identify calls to action or locate core functionality</h3>
                                            </div>
                                            <span className="severity-badge" aria-label="Severity 4, usability catastrophe">Severity 4</span>
                                        </div>
                                        <p className="finding-body">
                                            All participants expressed confusion with the site's information architecture. Users experienced numerous pain points: not being able to identify calls to action, not being able to find simple functions, and an overall confusion about the nature of how the product works. Navigation created loops and dead ends rather than guiding users toward task completion.
                                        </p>
                                        <div className="finding-evidence">
                                            <span className="evidence-label">Frequency</span>
                                            <span>8 of 8 participants (100%)</span>
                                        </div>
                                        <div className="finding-recommendation">
                                            <p className="rec-label">Recommendation</p>
                                            <p className="rec-text">Restructure navigation around the tasks users are actually trying to do. Eliminate redundant screens and decision loops. Redesign CTAs with high-contrast buttons, clear action-oriented labels, and visual hierarchy that distinguishes interactive from static elements.</p>
                                        </div>
                                    </article>

                                    <article className="finding-card severity-4" aria-labelledby="finding-3-title">
                                        <div className="finding-header">
                                            <div>
                                                <p className="finding-category">Interaction Design</p>
                                                <h3 id="finding-3-title" className="finding-title">Non-interactive elements perceived as clickable</h3>
                                            </div>
                                            <span className="severity-badge" aria-label="Severity 4, usability catastrophe">Severity 4</span>
                                        </div>
                                        <p className="finding-body">
                                            Every participant attempted to click elements that were not interactive, indicating a fundamental disconnect between the visual affordances of the UI and actual functionality. This compounded navigational confusion and eroded trust in the interface — users could not reliably distinguish what was actionable from what was static.
                                        </p>
                                        <div className="finding-evidence">
                                            <span className="evidence-label">Frequency</span>
                                            <span>8 of 8 participants (100%)</span>
                                        </div>
                                        <div className="finding-recommendation">
                                            <p className="rec-label">Recommendation</p>
                                            <p className="rec-text">Audit the full UI for false affordances. Apply consistent visual language: interactive elements should use color, hover states, and cursor changes. Static content must be visually distinct from clickable controls.</p>
                                        </div>
                                    </article>

                                    <article className="finding-card severity-4" aria-labelledby="finding-5-title">
                                        <div className="finding-header">
                                            <div>
                                                <p className="finding-category">Onboarding</p>
                                                <h3 id="finding-5-title" className="finding-title">Account creation flow has a 75% failure rate</h3>
                                            </div>
                                            <span className="severity-badge" aria-label="Severity 4, usability catastrophe">Severity 4</span>
                                        </div>
                                        <p className="finding-body">
                                            Only 2 of 8 participants successfully created an account. Failures stemmed from a combination of the Windows language barrier, unclear CTAs, and confusing copy that prevented users from even attempting the sign-up process. The sign-up flow created friction before the user had seen anything worth signing up for.
                                        </p>
                                        <div className="finding-evidence">
                                            <span className="evidence-label">Frequency</span>
                                            <span>6 of 8 participants failed (75%)</span>
                                        </div>
                                        <div className="finding-recommendation">
                                            <p className="rec-label">Recommendation</p>
                                            <p className="rec-text">Simplify account creation to a single, prominent CTA. Reduce form fields to minimum required. Consider a "Try without account" option to lower the barrier to product exploration.</p>
                                        </div>
                                    </article>

                                    <article className="finding-card severity-3" aria-labelledby="finding-4-title">
                                        <div className="finding-header">
                                            <div>
                                                <p className="finding-category">Visual Design</p>
                                                <h3 id="finding-4-title" className="finding-title">Negative reception to site aesthetic and landing page</h3>
                                            </div>
                                            <span className="severity-badge" aria-label="Severity 3, major problem">Severity 3</span>
                                        </div>
                                        <p className="finding-body">
                                            Half of participants made unsolicited negative comments about the visual design of the landing page. Feedback centered on the site appearing unfinished and unprofessional, directly undermining confidence in the product's credibility before users engaged with any functionality.
                                        </p>
                                        <div className="finding-evidence">
                                            <span className="evidence-label">Frequency</span>
                                            <span>4 of 8 participants (50%)</span>
                                        </div>
                                        <div className="finding-recommendation">
                                            <p className="rec-label">Recommendation</p>
                                            <p className="rec-text">Redesign the landing page with emphasis on visual polish, clear value proposition above the fold, and alignment with competitor standards in the digital signage space.</p>
                                        </div>
                                    </article>

                                </div>
                            </section>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default UsabilitySummary;
