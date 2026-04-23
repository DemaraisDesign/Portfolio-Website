// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import React from 'react';
import { Mail } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { audio } from '../utils/AudioEngine';

const Footer = () => {
  const location = useLocation();
  // Rolodex pages (Dark bottom, sticky scroll)
  const isRolodexPage = ['/stage', '/sounds', '/explorations', '/experiments'].some(path => location.pathname.includes(path));

  return (
    // Changed text-brand-ink to text-brand-ink
    <footer id="contact" className={`bg-white text-brand-ink relative overflow-visible ${isRolodexPage ? '' : 'border-t border-gray-400'}`}>

      {/* Envelope Divider - Global (Standard Only) */}
      {!isRolodexPage && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center">
          <div className="w-12 h-12 bg-[#16161D] rounded-full flex items-center justify-center shadow-lg">
            <Mail size={20} className="text-white" strokeWidth={1.5} />
          </div>
        </div>
      )}

      <div className="container w-full max-w-[1400px] mx-auto px-9 md:px-12 lg:px-24 py-24 lg:py-32 relative z-10">
        <div className="max-w-2xl">

          {/* Envelope - Rolodex Page Variant (Left Aligned) */}
          {isRolodexPage && (
            <div className="w-12 h-12 bg-[#16161D] rounded-full flex items-center justify-center shadow-lg mb-8">
              <Mail size={20} className="text-white" strokeWidth={1.5} />
            </div>
          )}

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 block font-outfit">Drop me a line.</h2>
          {/* Horizontal divider removed */}
          <p className="text-brand-ink-body text-xl mb-12 mt-0">
            Let's build something fun.
          </p>

          <div className="space-y-8">
            {["Name", "Email address", "Message"].map((label, i) => {
              const handleKeyDown = (e) => {
                if (e.key.length === 1) {
                  audio.playFormInteraction(e.key, 'type');
                } else if (e.key === 'Tab') {
                  audio.playFormInteraction('', 'tab');
                }
              };

              return (
                <div className="group relative" key={i}>
                  <label htmlFor={label.toLowerCase().replace(' ', '-')} className="sr-only">{label}</label>
                  {label === "Message" ?
                    <textarea
                      id={label.toLowerCase().replace(' ', '-')}
                      placeholder={`Your ${label.toLowerCase()}`}
                      rows="3"
                      onKeyDown={handleKeyDown}
                      onClick={() => audio.playFormInteraction('a', 'type')}
                      className="w-full bg-transparent border-b border-gray-300 py-4 text-xl outline-none focus:border-[#16161D] transition-colors resize-none relative z-10 placeholder:text-brand-ink-body focus:placeholder:text-gray-700 text-brand-ink"
                    /> :
                    <input
                      id={label.toLowerCase().replace(' ', '-')}
                      type={label.includes("Email") ? "email" : "text"}
                      placeholder={label}
                      onKeyDown={handleKeyDown}
                      onClick={() => audio.playFormInteraction('a', 'type')}
                      className="w-full bg-transparent border-b border-gray-300 py-4 text-xl outline-none focus:border-[#16161D] transition-colors relative z-10 placeholder:text-brand-ink-body focus:placeholder:text-gray-700 text-brand-ink"
                    />
                  }
                </div>
              );
            })}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                  e.preventDefault();
                  audio.playFormInteraction('', 'submit');
              }}
              className="bg-[#16161D]/50 backdrop-blur-[2px] text-white border border-transparent px-8 py-3 rounded-full font-outfit font-medium uppercase tracking-[0.2em] hover:bg-[#050508] hover:border-white/20 hover:text-white transition-all duration-300 focus:ring-1 focus:ring-offset-1 focus:ring-brand-highlight focus:outline-none"
            >
              Submit
            </motion.button>
          </div>
        </div>
      </div>

      <div className="w-full bg-[#E6E8EA] py-12 relative z-10">
        <div className="container w-full max-w-[1400px] mx-auto px-9 md:px-12 lg:px-24 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Left Column Spacer */}
          <div className="hidden md:block"></div>
          
          {/* Center Column LinkedIn */}
          <div className="flex justify-center">
            <motion.a
              href="#"
              aria-label="LinkedIn"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-4 bg-[#16161D] text-white rounded-full hover:bg-[#0077b5] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#16161D]"
            >
              <svg width="36" height="36" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.943 13.394V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z" />
              </svg>
            </motion.a>
          </div>

          {/* Right Column Credits */}
          <div className="flex flex-col justify-center items-center md:items-end text-sm text-brand-ink/70 font-outfit text-center md:text-right">
            <span>Designed by Joseph Demarais</span>
            <span>Built with Antigravity, Claude, Gemini & Figma</span>
            <span>2026</span>
          </div>
        </div>
      </div>
    </footer >
  );
};

export default Footer;