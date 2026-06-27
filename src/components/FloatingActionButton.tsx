"use client";

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import ShareItemModal from './ShareItemModal';
import { motion, AnimatePresence } from 'framer-motion';

export default function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.button 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-10 right-10 w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl z-[1500] group"
      >
        <Plus size={32} className="group-hover:rotate-90 transition-transform" />
        <div className="absolute right-full mr-4 bg-bg border border-border px-4 py-2 rounded-xl text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl">
          Share Your Item
        </div>
      </motion.button>

      <ShareItemModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
