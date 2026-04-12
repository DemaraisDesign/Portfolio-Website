import React from 'react';
import './QuoteGrid.css';
import { DebugSpacer } from './LayoutDebugger';

const QuoteGrid = ({ quotes, activeColor }) => {
    if (!quotes || quotes.length === 0) return null;

    return (
        <>
            <DebugSpacer id="QuoteGrid_Top" defaultMobile={75} defaultDesktop={100} />
            <div className="quote-box-container mb-0 relative z-10">
                {/* Top Left Icon Badge */}
                <div
                    className="absolute -top-6 -left-4 md:-left-6 w-16 h-16 rounded-full flex items-center justify-center shadow-lg z-20 ring-[6px] ring-[#FFFFFF]"
                    style={{ backgroundColor: '#04101A' }}
                >
                    <style>
                        {`
                        @import url('https://fonts.googleapis.com/css2?family=Prata&display=swap');
                        .quote-mark-icon {
                            font-family: 'Prata', serif;
                            font-weight: 400;
                            font-size: 72px;
                            line-height: 1;
                            color: ${activeColor};
                            transform: translate(-2px, 28px);
                        }
                    `}
                    </style>
                    <span className="quote-mark-icon">“</span>
                </div>

                <div className="quote-box" role="list">
                    {quotes.map((quote, index) => (
                        <React.Fragment key={index}>
                            <div className={`quote-item px-8 md:px-12 ${index === 0 ? 'pt-16 pb-10' : 'py-10'}`} role="listitem">
                                <p className="quote-text">{quote.content}</p>
                                <div className="mt-4">
                                    <span className="quote-author text-[#04101A]">• {quote.attribution}</span>
                                    {quote.title && (
                                        <span className="block text-[11px] font-sans text-[#6e8291] mt-1.5 uppercase tracking-widest pl-3">{quote.title}</span>
                                    )}
                                </div>
                            </div>
                            {/* Elegant Divider between quotes */}
                            {index < quotes.length - 1 && (
                                <div className="px-8 md:px-12 w-full">
                                    <div className="w-full h-px bg-black/10 rounded-full" />
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </>
    );
};

export default QuoteGrid;
