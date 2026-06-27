"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, ShieldCheck, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function KYCPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center gap-6">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center shadow-xl shadow-green-500/20"
        >
          <CheckCircle2 size={48} />
        </motion.div>
        <h1 className="text-4xl font-black">KYC Submitted!</h1>
        <p className="text-xl text-text-muted max-w-[500px]">
          Our team will review your information and verify your account within 24-48 hours.
        </p>
        <Link href="/history" className="bg-primary text-white px-10 py-4 rounded-full font-bold mt-6">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="py-10 flex flex-col gap-10">
      <header>
        <span className="tagline">TRUST & SAFETY</span>
        <h1 className="text-5xl font-black">KYC Verification</h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div className="flex flex-col gap-8">
          <div className="bg-yellow-500/10 border border-yellow-500/20 p-8 rounded-[40px] flex gap-6">
             <div className="w-12 h-12 bg-yellow-500 text-white rounded-2xl flex items-center justify-center shrink-0">
               <AlertCircle size={24} />
             </div>
             <p className="text-yellow-700 font-bold leading-relaxed">
               ** DONOT UPLOAD ACTUAL CITIZENSHIP OR ANY SENSITIVE INFORMATION. THIS IS A PROTOTYPE AND IS NOT MEANT FOR ACTUAL USE. **
             </p>
          </div>

          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-black">Why Verify?</h2>
            <div className="grid grid-cols-1 gap-4">
              <Benefit icon={ShieldCheck} text="Build trust with the community" />
              <Benefit icon={FileText} text="Required to list high-value items" />
              <Benefit icon={CheckCircle2} text="Get the 'Verified' badge on your profile" />
            </div>
          </div>
        </div>

        <motion.form 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          onSubmit={handleSubmit}
          className="bg-surface border border-border p-12 rounded-[40px] shadow-2xl flex flex-col gap-8"
        >
          <div className="flex flex-col gap-2">
            <label className="text-[0.8rem] font-black uppercase tracking-widest text-text-muted">Citizenship / ID Card Photo</label>
            <div className="border-4 border-dashed border-border rounded-3xl p-12 flex flex-col items-center justify-center text-center gap-4 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group">
              <Upload size={48} className="text-text-muted group-hover:text-primary transition-colors" />
              <div>
                <p className="font-bold text-lg group-hover:text-primary transition-colors">Click to upload photo</p>
                <p className="text-sm text-text-muted">JPG, PNG or PDF (Max 5MB)</p>
              </div>
              <input type="file" className="hidden" />
            </div>
          </div>

          <div className="flex items-start gap-4">
            <input type="checkbox" required className="mt-1" />
            <p className="text-sm text-text-muted leading-relaxed">
              I hereby declare that the information provided is true and correct to the best of my knowledge. If found to be false, I agree to be liable for any legal consequences.
            </p>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-5 rounded-2xl font-black text-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-xl shadow-primary/20"
          >
            {loading ? "Submitting..." : "Submit for Verification"}
          </button>
        </motion.form>
      </div>
    </div>
  );
}

function Benefit({ icon: Icon, text }: { icon: any, text: string }) {
  return (
    <div className="flex items-center gap-4 bg-surface p-5 rounded-[24px] border border-border">
      <div className="text-primary">
        <Icon size={24} />
      </div>
      <span className="font-bold">{text}</span>
    </div>
  );
}
