"use client";

import React from 'react';
import { Search, Users, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const steps = [
  {
    icon: Search,
    title: "1. Find",
    desc: "Search for the items you need in your local community. From power tools to camping gear, find it all nearby."
  },
  {
    icon: Users,
    title: "2. Connect",
    desc: "Chat securely with the lender, agree on a time, and arrange the pickup. Our platform keeps your data safe."
  },
  {
    icon: CheckCircle2,
    title: "3. Enjoy & Return",
    desc: "Use the item for your project or trip, then return it in the same condition. Build your reputation score!"
  }
];

export default function HowItWorks() {
  return (
    <div className="py-20 flex flex-col gap-20">
      <header className="text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-black mb-6"
        >
          Simple. Secure. <span className="text-primary italic">Sustainable.</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-text-muted"
        >
          Join the borrowing revolution in 3 easy steps.
        </motion.p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
            className="bg-surface/50 p-10 rounded-[40px] border border-border flex flex-col items-center text-center group hover:bg-surface transition-all"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:scale-110 group-hover:rotate-6 transition-transform">
              <step.icon size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
            <p className="text-text-muted leading-relaxed">{step.desc}</p>
          </motion.div>
        ))}
      </section>

      <section className="bg-primary p-12 rounded-[40px] text-white flex flex-col items-center text-center gap-8 relative overflow-hidden">
        <h2 className="text-3xl font-black z-10">Ready to start?</h2>
        <Link href="/auth" className="bg-white text-primary px-10 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform z-10 shadow-xl">
          Join Community
        </Link>
        <div className="absolute top-[-50%] right-[-10%] w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-50%] left-[-10%] w-[300px] h-[300px] bg-secondary/20 rounded-full blur-3xl" />
      </section>
    </div>
  );
}
