import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 flex flex-col gap-[60px] pb-10">
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

        <div>
           <span className="text-2xl font-black tracking-tighter text-text-main opacity-20">Bhada Maa</span>
        </div>
      </div>
    </footer>
  );
}
