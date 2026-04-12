import React from 'react';
import AnimatedDivider from './AnimatedDivider';
import { BRAND_COLORS } from '../utils/theme';

const AwardCard = ({ title, show, awards }) => {
    return (
        <div className="bg-brand-stageDeep border border-transparent rounded-lg p-6 mb-0 w-full shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-outfit font-bold text-xl text-white mb-1.5">
                {title}
            </h3>
            {show && (
                <p className="font-sans text-[14px] text-white/70 italic mb-4">
                    {show}
                </p>
            )}
            <AnimatedDivider width={35} className={`h-[2px] mb-5 ${!show ? 'mt-4' : ''}`} styleContent={{ backgroundColor: BRAND_COLORS.stage }} />

            <div className="space-y-5">
                {awards.map((awardGroup, idx) => (
                    <div key={idx}>
                        <h4 className="font-sans font-semibold text-[15px] text-white mb-2.5">
                            {awardGroup.organization}
                        </h4>
                        <ul className="space-y-2">
                            {awardGroup.items.map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-[15px] text-white/90 font-sans leading-relaxed">
                                    <span className="mt-[2px] text-lg leading-none" style={{ color: BRAND_COLORS.stage }}>•</span>
                                    <span>
                                        {item.split(/(<em>.*?<\/em>|<strong>.*?<\/strong>)/g).map((part, index) => {
                                            if (!part) return null;
                                            if (part.startsWith('<em>') && part.endsWith('</em>')) {
                                                return <em key={index} className="italic text-white/70">{part.slice(4, -5)}</em>;
                                            }
                                            if (part.startsWith('<strong>') && part.endsWith('</strong>')) {
                                                return <strong key={index} className="font-bold text-white tracking-wide">{part.slice(8, -9)}</strong>;
                                            }
                                            return <span key={index}>{part}</span>;
                                        })}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AwardCard;
