"use client";

import React from 'react';
import { ShieldCheck, Lock, Eye, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const securityFeatures = [
  {
    icon: ShieldCheck,
    title: "KYC Verified Users",
    desc: "Every member undergoes a verification process to ensure a safe and trusted community environment."
  },
  {
    icon: Lock,
    title: "Secure Messaging",
    desc: "Your conversations and personal details are encrypted and only accessible to the relevant parties."
  },
  {
    icon: Eye,
    title: "Transparent Reviews",
    desc: "Our dual-review system means both lenders and borrowers are held accountable for their actions."
  }
];

export default function SecurityPage() {
  return (
    <div className="py-20 flex flex-col gap-20">
      <header className="text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-20 h-20 bg-green-500/10 text-green-500 rounded-2xl flex items-center justify-center mx-auto mb-8"
        >
          <ShieldCheck size={40} />
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-black mb-6"
        >
          Your Safety is Our <span className="text-green-500">Priority.</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-text-muted max-w-[700px] mx-auto"
        >
          We use state-of-the-art security measures to ensure that every transaction on Bhada Maa is safe, secure, and reliable.
        </motion.p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {securityFeatures.map((f, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
            className="p-10 bg-surface/50 border border-border rounded-[40px] flex flex-col gap-6"
          >
            <div className="text-primary">
              <f.icon size={32} />
            </div>
            <h3 className="text-2xl font-bold">{f.title}</h3>
            <p className="text-text-muted leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </section>

      <section className="p-12 bg-red-500/5 border border-red-500/20 rounded-[40px] flex flex-col md:flex-row items-center gap-10">
        <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center shrink-0">
          <AlertTriangle size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">Notice to Users</h2>
          <p className="text-text-muted">
            Bhada Maa is a prototype platform. Please do not share any sensitive personal information or financial data. We are continuously improving our security protocols to protect our community members.
          </p>
        </div>
      </section>
    </div>
  );
}
