import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 flex flex-col gap-[60px] pb-10">
      <div className="bg-primary text-white rounded-[40px] p-[60px] flex justify-between items-center shadow-lg">
        <div className="cta-left">
          <h2 className="text-[2.5rem] font-black mb-[10px] tracking-tight">Rent with Bhada Maa Today</h2>
          <p className="font-bold opacity-90">Start renting stuff now!</p>
        </div>
        <Link href="/items" className="bg-white text-primary px-10 py-5 rounded-2xl font-black hover:scale-105 transition-transform shadow-md">
          Browse Items
        </Link>
      </div>

      <div className="flex justify-between items-end">
        <div className="flex gap-4 text-text-muted text-sm font-bold uppercase tracking-widest">
          <Link href="/terms" className="hover:text-primary-hover transition-colors">Terms</Link>
          <Link href="/privacy" className="hover:text-primary-hover transition-colors">Privacy</Link>
        </div>

        <div className="flex gap-6 text-text-main font-bold">
          <Link href="/about" className="hover:text-primary-hover transition-colors">About Us</Link>
          <Link href="/features" className="hover:text-primary-hover transition-colors">Features</Link>
          <Link href="/help" className="hover:text-primary-hover transition-colors">Help</Link>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[0.7rem] font-black text-text-muted uppercase tracking-widest ml-2">Subscribe to News</label>
          <div className="flex items-center gap-2 bg-element-bg p-1.5 rounded-2xl border border-border">
            <input 
              type="email" 
              placeholder="Your e-mail" 
              className="bg-transparent border-none outline-none px-4 text-sm w-[200px]"
            />
            <button className="w-10 h-10 rounded-xl bg-primary text-text-main flex items-center justify-center hover:scale-110 transition-transform shadow-sm">
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <div>
           <span className="text-2xl font-black tracking-tighter text-text-main opacity-20">Bhada Maa</span>
        </div>
      </div>
    </footer>
  );
}
