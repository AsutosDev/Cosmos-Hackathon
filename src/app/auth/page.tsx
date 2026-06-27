"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  auth, 
  db 
} from '@/lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile 
} from 'firebase/auth';
import { 
  doc, 
  setDoc 
} from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, 
  Shield, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  MapPin, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');
  const [permAddress, setPermAddress] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        router.push('/');
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await updateProfile(user, {
          displayName: `${firstName} ${lastName}`
        });

        await setDoc(doc(db, "users", user.uid), {
          firstName,
          lastName,
          mobile,
          permAddress,
          email,
          createdAt: new Date().toISOString(),
          kycStatus: 'pending'
        });

        router.push('/');
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-[1100px] w-full bg-white rounded-[48px] overflow-hidden flex flex-col lg:flex-row shadow-[0_32px_64px_-16px_rgba(250,204,21,0.15)] border border-primary/10"
      >
        {/* Visual Side */}
        <div className="lg:flex-1 bg-primary-light p-12 flex flex-col justify-between relative overflow-hidden min-h-[300px]">
          <div className="z-10">
            <Link href="/" className="mb-12 block">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg border border-white/40">
                <Sparkles className="text-white" size={24} />
              </div>
              <span className="text-3xl font-black tracking-tighter text-text-main">Bhada Maa</span>
            </div>
            </Link>
            
            <h2 className="text-5xl font-black text-text-main mb-8 leading-tight tracking-tighter">
              {isLogin ? "Welcome back to your happy place." : "A warmer way to share stuff."}
            </h2>
            <p className="text-text-muted text-xl max-w-[400px] leading-relaxed">
              {isLogin 
                ? "Sign in to see what's new in your neighborhood today." 
                : "Join our community and start borrowing things you need, from people you trust."}
            </p>
          </div>

          <div className="z-10 flex flex-col gap-4 mt-12">
            <div className="flex p-4 bg-white/60 backdrop-blur-md rounded-3xl border border-white/40 shadow-sm gap-4">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shrink-0">
                <Shield size={24} />
              </div>
              <div>
                <h4 className="font-bold text-text-main">Safe & Secure</h4>
                <p className="text-sm text-text-muted">KYC verified community</p>
              </div>
            </div>
          </div>

          {/* Abstract Decorations */}
          <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-primary/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-20%] left-[-20%] w-[350px] h-[350px] bg-white rounded-full blur-[80px]" />
        </div>

        {/* Content Side */}
        <div className="lg:flex-[1.2] p-12 lg:p-20 bg-white relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? 'login' : 'signup'}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-[450px] mx-auto"
            >
              <div className="mb-10">
                <h3 className="text-3xl font-black text-text-main mb-3 tracking-tight">
                  {isLogin ? "Sign In" : "Get Started"}
                </h3>
                <p className="text-text-muted text-lg">
                  {isLogin ? "Good to see you again!" : "Create your account in seconds."}
                </p>
              </div>

              <form onSubmit={handleAuth} className="flex flex-col gap-5">
                {!isLogin && (
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-bold text-text-muted mb-2 ml-1">First Name</label>
                      <input 
                        required
                        type="text" 
                        placeholder="John" 
                        className="w-full bg-[#fcfcfc] border border-border rounded-2xl py-4 px-6 outline-none focus:border-primary focus:bg-white transition-all text-text-main"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-bold text-text-muted mb-2 ml-1">Last Name</label>
                      <input 
                        required
                        type="text" 
                        placeholder="Doe" 
                        className="w-full bg-[#fcfcfc] border border-border rounded-2xl py-4 px-6 outline-none focus:border-primary focus:bg-white transition-all text-text-main"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-bold text-text-muted mb-2 ml-1">Email Address</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input 
                      required
                      type="email" 
                      placeholder="name@email.com" 
                      className="w-full bg-[#fcfcfc] border border-border rounded-2xl py-4 pl-14 pr-6 outline-none focus:border-primary focus:bg-white transition-all text-text-main"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-text-muted mb-2 ml-1">Password</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input 
                      required
                      type="password" 
                      placeholder="••••••••" 
                      className="w-full bg-[#fcfcfc] border border-border rounded-2xl py-4 pl-14 pr-6 outline-none focus:border-primary focus:bg-white transition-all text-text-main"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-primary text-white h-[64px] rounded-2xl font-black text-lg hover:bg-primary-hover shadow-[0_12px_24px_-8px_rgba(245,158,11,0.3)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 mt-4 outline-none"
                >
                  {loading ? "Please wait..." : (isLogin ? "Sign In" : "Join the Community")}
                  {!loading && <ArrowRight size={20} />}
                </button>

                <div className="text-center mt-8">
                  <p className="text-text-muted font-medium">
                    {isLogin ? "New here?" : "Already have an account?"} 
                    <button 
                      type="button"
                      onClick={() => setIsLogin(!isLogin)}
                      className="text-primary-hover font-black ml-2 hover:underline"
                    >
                      {isLogin ? "Create account" : "Log in"}
                    </button>
                  </p>
                </div>
              </form>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
