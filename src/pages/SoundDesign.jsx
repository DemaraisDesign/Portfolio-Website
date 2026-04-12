import { motion } from 'framer-motion';
import React from 'react';

import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const SoundDesign = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-32 pb-20 min-h-screen bg-white"
    >
      <div className="container mx-auto px-6">
        <Link to="/" className="flex items-center gap-2 text-brand-ink-muted hover:text-brand-ink transition-colors mb-8 font-medium">
          <ArrowLeft size={20} /> Back to Home
        </Link>

        <h1 className="text-5xl font-bold mb-12 text-brand-ink">Sound Design</h1>

        <div className="p-12 border-2 border-dashed border-gray-200 rounded-theme-md text-center text-gray-400 font-light">
          <p>Content for Sound Design goes here.</p>
        </div>

      </div>
    </motion.div>
  );
};

export default SoundDesign;