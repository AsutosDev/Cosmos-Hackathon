"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Settings, 
  LayoutDashboard, 
  Bell, 
  User, 
  HelpCircle, 
  Shield, 
  LogOut, 
  ChevronRight,
  Moon,
  Sun,
  Search,
  MapPin,
  X,
  CreditCard
} from 'lucide-react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Navbar() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [theme, setTheme] = useState('dark');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.body.setAttribute('data-theme', savedTheme);

    return () => unsubscribe();
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.body.setAttribute('data-theme', newTheme);
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/auth');
  };

  return (
    <nav className="fixed top-0 left-0 w-full h-[80px] bg-primary z-[1000] text-white shadow-lg">
      <div className="max-w-[1200px] h-full mx-auto px-8 flex items-center justify-between gap-10">
        <Link href="/" className="flex items-center relative z-10">
          <span className="text-3xl font-extrabold tracking-tighter text-white drop-shadow-sm">Bhada Maa</span>
        </Link>

        {/* Nepalese Graphics Header Shadow */}
        <div className="absolute inset-0 flex justify-center items-end overflow-hidden pointer-events-none opacity-20 transform translate-y-2">
          <svg width="1000" height="80" viewBox="0 0 1000 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[800px] h-auto text-white fill-current">
            {/* Himalayas */}
            <path d="M0 80 L150 40 L250 60 L400 20 L550 50 L700 10 L850 60 L1000 80 H0Z" />
            
            {/* Pagoda / Temple Silhouette */}
            <g transform="translate(450, 10) scale(0.8)">
              <path d="M20 70 H80 L75 55 H25 L20 70Z" />
              <path d="M30 55 H70 L65 40 H35 L30 55Z" />
              <path d="M40 40 H60 L55 25 H45 L40 40Z" />
              <rect x="47" y="15" width="6" height="10" />
              <circle cx="50" cy="12" r="3" />
            </g>
          </svg>
        </div>

        {/* Right side Actions */}
        <div className="flex items-center gap-[15px]">
          {/* Settings */}
          <div className="relative">
            <button 
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="w-10 h-10 bg-white/20 border border-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all hover:-translate-y-0.5 shadow-sm"
            >
              <Settings size={20} className="text-white" />
            </button>
            
            {isSettingsOpen && (
              <div className="absolute top-[60px] right-0 w-[280px] bg-white border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 text-text-main">
                <div className="p-4 border-b border-border bg-surface/50">
                  <h3 className="font-bold">Settings</h3>
                </div>
                
                <div className="p-4 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                      <span className="text-[0.9rem]">Dark Mode</span>
                    </div>
                    <button 
                      onClick={toggleTheme}
                      className={cn(
                        "w-12 h-6 rounded-full transition-colors relative",
                        theme === 'dark' ? "bg-primary" : "bg-gray-300"
                      )}
                    >
                      <div className={cn(
                        "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                        theme === 'dark' ? "left-7" : "left-1"
                      )} />
                    </button>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Link href="/profile" className="flex items-center gap-3 p-2 rounded-lg hover:bg-element-bg text-[0.9rem] transition-colors">
                      <User size={18} /> Account
                    </Link>
                    <Link href="/kyc" className="flex items-center gap-3 p-2 rounded-lg hover:bg-element-bg text-[0.9rem] transition-colors">
                      <CreditCard size={18} /> KYC
                    </Link>
                    <Link href="/how-it-works" className="flex items-center gap-3 p-2 rounded-lg hover:bg-element-bg text-[0.9rem] transition-colors">
                      <HelpCircle size={18} /> Help
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-red-500/10 text-red-500 text-[0.9rem] transition-colors text-left"
                    >
                      <LogOut size={18} /> Log Out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link 
            href="/history" 
            className="w-10 h-10 bg-white/20 border border-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all hover:-translate-y-0.5 shadow-sm"
            title="Dashboard"
          >
            <LayoutDashboard size={20} className="text-white" />
          </Link>

          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="w-10 h-10 bg-white/20 border border-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all hover:-translate-y-0.5 relative shadow-sm"
            >
              <Bell size={20} className="text-white" />
              <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-primary rounded-full" />
            </button>
          </div>

          <button 
            onClick={() => router.push('/profile')}
            className="w-10 h-10 bg-white/20 border border-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all hover:-translate-y-0.5 shadow-sm"
          >
            <User size={20} className="text-white" />
          </button>
        </div>
      </div>
    </nav>
  );
}
