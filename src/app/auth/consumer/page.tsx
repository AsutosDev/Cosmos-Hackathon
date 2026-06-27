"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, ArrowLeft, ShoppingBag, User, Phone, MapPin, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function ConsumerAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        router.push('/');
      } else {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName: `${firstName} ${lastName}` });
        await setDoc(doc(db, 'users', cred.user.uid), {
          firstName, lastName, mobile, address, email,
          role: 'consumer',
          createdAt: new Date().toISOString(),
          kycStatus: 'pending',
          rating: 0,
          totalReviews: 0,
        });
        router.push('/');
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-6 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[900px] border border-border flex overflow-hidden"
      >
        {/* Left panel — black */}
        <div className="w-[340px] shrink-0 bg-black p-10 flex flex-col justify-between">
          <div>
            <Link href="/auth" className="flex items-center gap-2 text-white/40 text-sm mb-10 hover:text-white transition-colors">
              <ArrowLeft size={14} /> Back
            </Link>
            <div className="w-12 h-12 bg-white/10 border border-white/20 flex items-center justify-center mb-6">
              <ShoppingBag size={24} className="text-white" />
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight mb-3">Borrower<br />Portal</h2>
            <p className="text-white/50 text-sm leading-relaxed">
              Browse thousands of items for rent near you. Only pay for what you need, when you need it.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {['Browse 100+ categories', 'Pay per day, week or month', 'Rate & review owners', 'Request any item'].map(f => (
              <div key={f} className="flex items-center gap-3 text-white/60 text-sm">
                <CheckCircle size={14} className="text-primary shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* Right panel — white */}
        <div className="flex-1 p-10 bg-white">
          {/* Tab toggle */}
          <div className="flex border border-border mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 text-sm font-bold transition-colors ${isLogin ? 'bg-black text-white' : 'bg-white text-text-muted hover:bg-element-bg'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 text-sm font-bold transition-colors border-l border-border ${!isLogin ? 'bg-black text-white' : 'bg-white text-text-muted hover:bg-element-bg'}`}
            >
              Create Account
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={isLogin ? 'login' : 'register'}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleAuth}
              className="flex flex-col gap-4"
            >
              {!isLogin && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[0.7rem] font-bold text-text-muted uppercase tracking-wider mb-1.5">First Name</label>
                      <div className="relative">
                        <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                        <input required type="text" placeholder="John" value={firstName} onChange={e => setFirstName(e.target.value)}
                          className="w-full border border-border py-2.5 pl-9 pr-3 text-sm outline-none focus:border-black transition-colors" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[0.7rem] font-bold text-text-muted uppercase tracking-wider mb-1.5">Last Name</label>
                      <input required type="text" placeholder="Doe" value={lastName} onChange={e => setLastName(e.target.value)}
                        className="w-full border border-border py-2.5 px-3 text-sm outline-none focus:border-black transition-colors" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[0.7rem] font-bold text-text-muted uppercase tracking-wider mb-1.5">Phone Number</label>
                    <div className="relative">
                      <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                      <input required type="tel" placeholder="+977 98XXXXXXXX" value={mobile} onChange={e => setMobile(e.target.value)}
                        className="w-full border border-border py-2.5 pl-9 pr-3 text-sm outline-none focus:border-black transition-colors" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[0.7rem] font-bold text-text-muted uppercase tracking-wider mb-1.5">Your Location</label>
                    <div className="relative">
                      <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                      <input required type="text" placeholder="Kathmandu, Bagmati" value={address} onChange={e => setAddress(e.target.value)}
                        className="w-full border border-border py-2.5 pl-9 pr-3 text-sm outline-none focus:border-black transition-colors" />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-[0.7rem] font-bold text-text-muted uppercase tracking-wider mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input required type="email" placeholder="name@email.com" value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full border border-border py-2.5 pl-9 pr-3 text-sm outline-none focus:border-black transition-colors" />
                </div>
              </div>

              <div>
                <label className="block text-[0.7rem] font-bold text-text-muted uppercase tracking-wider mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input required type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)}
                    className="w-full border border-border py-2.5 pl-9 pr-3 text-sm outline-none focus:border-black transition-colors" />
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full bg-black text-white py-3 font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary transition-colors disabled:opacity-50 mt-2">
                {loading ? 'Please wait…' : isLogin ? 'Sign In as Borrower' : 'Create Borrower Account'}
                {!loading && <ArrowRight size={15} />}
              </button>
            </motion.form>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
