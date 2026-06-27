"use client";

import React, { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Shield, Calendar, Edit3 } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const docSnap = await getDoc(doc(db, "users", u.uid));
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="py-20 text-center text-text-muted">Loading profile...</div>;
  }

  if (!user) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-3xl font-black mb-6">Please sign in to view your profile.</h2>
        <Link href="/auth" className="bg-primary text-white px-10 py-4 rounded-full font-bold">Sign In</Link>
      </div>
    );
  }

  return (
    <div className="py-10 flex flex-col gap-10">
      <header>
        <span className="tagline">YOUR ACCOUNT</span>
        <h1 className="text-5xl font-black">Profile Info</h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Profile Card */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 bg-surface border border-border p-10 rounded-[40px] flex flex-col items-center gap-6 shadow-xl"
        >
          <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center text-primary border-4 border-white/10 shadow-inner">
            <User size={64} />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-black">{user.displayName || 'Unnamed Member'}</h2>
            <p className="text-text-muted text-sm">Member since {new Date(user.metadata.creationTime).toLocaleDateString()}</p>
          </div>
          <div className={cn(
            "px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest",
            profile?.kycStatus === 'verified' ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
          )}>
            {profile?.kycStatus || 'pending verify'}
          </div>
          <button className="flex items-center gap-2 text-primary font-bold hover:underline mt-4">
            <Edit3 size={18} /> Edit Profile
          </button>
        </motion.div>

        {/* Details Grid */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <InfoItem icon={Mail} label="Email Address" value={user.email} />
          <InfoItem icon={Phone} label="Mobile Number" value={profile?.mobile || 'Not set'} />
          <InfoItem icon={MapPin} label="Permanent Address" value={profile?.permAddress || 'Not set'} />
          <InfoItem icon={Calendar} label="Last Login" value={new Date(user.metadata.lastSignInTime).toLocaleString()} />
          
          <div className="col-span-full mt-6 bg-primary/5 border border-primary/20 p-8 rounded-[32px] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center">
                <Shield size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">KYC Verification</h3>
                <p className="text-sm text-text-muted">Complete your verification to share items.</p>
              </div>
            </div>
            <Link href="/kyc" className="bg-primary text-white px-6 py-3 rounded-2xl font-bold hover:scale-105 transition-transform">
              Verify Now
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="bg-surface border border-border p-6 rounded-[32px] flex items-center gap-5">
      <div className="text-text-muted">
        <Icon size={24} />
      </div>
      <div>
        <p className="text-[0.7rem] font-bold text-text-muted uppercase tracking-wider mb-1">{label}</p>
        <p className="font-bold text-text-main">{value}</p>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';
