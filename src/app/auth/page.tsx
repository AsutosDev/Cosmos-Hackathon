"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Package, ShoppingBag, ArrowRight, Star, Shield, Zap } from 'lucide-react';
import Link from 'next/link';

export default function AuthLanding() {
  const router = useRouter();

  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center p-6 bg-white">
      {/* Brand */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-14 text-center"
      >
        <h1 className="text-5xl font-black tracking-tighter text-black mb-3">
          How do you want<br />to continue?
        </h1>
        <p className="text-text-muted text-base max-w-sm mx-auto">
          Choose your role to get started — you can always switch later.
        </p>
      </motion.div>

      {/* Role Cards */}
      <div className="grid grid-cols-2 gap-px border border-border bg-border w-full max-w-[820px]">
        {/* Renter / Owner Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => router.push('/auth/renter')}
          className="bg-white p-10 cursor-pointer group hover:bg-primary transition-colors duration-200"
        >
          <div className="w-14 h-14 border border-border group-hover:border-white/30 flex items-center justify-center mb-8 group-hover:bg-white/20 transition-colors">
            <Package size={28} className="text-primary group-hover:text-white" />
          </div>

          <p className="text-xs font-bold text-text-muted group-hover:text-white/70 uppercase tracking-widest mb-2 transition-colors">For Owners</p>
          <h2 className="text-3xl font-black text-black group-hover:text-white tracking-tight mb-4 transition-colors">
            I want to<br />list items
          </h2>
          <p className="text-text-muted group-hover:text-white/80 text-sm leading-relaxed mb-8 transition-colors">
            List your tools, vehicles, gear, or equipment and earn money when you're not using them.
          </p>

          <ul className="flex flex-col gap-2 mb-10">
            {['Set your own price', 'Manage bookings easily', 'KYC verified renters only'].map(f => (
              <li key={f} className="flex items-center gap-2 text-sm text-text-muted group-hover:text-white/80 transition-colors">
                <span className="w-1.5 h-1.5 bg-primary group-hover:bg-white" />
                {f}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2 font-bold text-black group-hover:text-white transition-colors">
            Continue as Owner <ArrowRight size={16} />
          </div>
        </motion.div>

        {/* Consumer / Borrower Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          onClick={() => router.push('/auth/consumer')}
          className="bg-white p-10 cursor-pointer group hover:bg-black transition-colors duration-200"
        >
          <div className="w-14 h-14 border border-border group-hover:border-white/20 flex items-center justify-center mb-8 group-hover:bg-white/10 transition-colors">
            <ShoppingBag size={28} className="text-primary group-hover:text-white" />
          </div>

          <p className="text-xs font-bold text-text-muted group-hover:text-white/60 uppercase tracking-widest mb-2 transition-colors">For Borrowers</p>
          <h2 className="text-3xl font-black text-black group-hover:text-white tracking-tight mb-4 transition-colors">
            I want to<br />rent items
          </h2>
          <p className="text-text-muted group-hover:text-white/70 text-sm leading-relaxed mb-8 transition-colors">
            Find and rent items in your neighbourhood — from cameras to cars, for any budget.
          </p>

          <ul className="flex flex-col gap-2 mb-10">
            {['Browse 100+ categories', 'Pay only for what you need', 'Rate & review owners'].map(f => (
              <li key={f} className="flex items-center gap-2 text-sm text-text-muted group-hover:text-white/70 transition-colors">
                <span className="w-1.5 h-1.5 bg-primary group-hover:bg-white" />
                {f}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2 font-bold text-black group-hover:text-white transition-colors">
            Continue as Borrower <ArrowRight size={16} />
          </div>
        </motion.div>
      </div>

      {/* Trust badges */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-8 mt-10 text-text-muted text-xs"
      >
        <div className="flex items-center gap-2">
          <Shield size={14} /> KYC Verified
        </div>
        <div className="w-px h-4 bg-border" />
        <div className="flex items-center gap-2">
          <Zap size={14} /> Instant Booking
        </div>
        <div className="w-px h-4 bg-border" />
        <div className="flex items-center gap-2">
          <Star size={14} /> Rated 4.9/5
        </div>
      </motion.div>
    </div>
  );
}
