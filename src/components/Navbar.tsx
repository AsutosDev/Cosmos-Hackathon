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
              className="w-10 h-10 bg-white border border-white/40 flex items-center justify-center hover:bg-white/90 transition-all"
            >
              <Settings size={20} className="text-primary" />
            </button>
            
            {isSettingsOpen && (
              <div className="absolute top-[60px] right-0 w-[260px] bg-white border border-border shadow-lg overflow-hidden z-50 text-text-main">
                <div className="p-4 border-b border-border">
                  <h3 className="font-bold text-sm uppercase tracking-wider">Settings</h3>
                </div>
                
                <div className="p-3 flex flex-col">
                  <div className="flex items-center justify-between p-2 hover:bg-element-bg">
                    <div className="flex items-center gap-3">
                      {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
                      <span className="text-[0.9rem]">Dark Mode</span>
                    </div>
                    <button 
                      onClick={toggleTheme}
                      className={cn(
                        "w-10 h-5 transition-colors relative border border-border",
                        theme === 'dark' ? "bg-primary" : "bg-gray-200"
                      )}
                    >
                      <div className={cn(
                        "absolute top-0.5 w-4 h-4 bg-white border border-border transition-all",
                        theme === 'dark' ? "left-5" : "left-0.5"
                      )} />
                    </button>
                  </div>

                  <div className="flex flex-col">
                    <Link href="/profile" className="flex items-center gap-3 p-3 hover:bg-element-bg text-[0.9rem] transition-colors border-t border-border">
                      <User size={16} /> Account
                    </Link>
                    <Link href="/kyc" className="flex items-center gap-3 p-3 hover:bg-element-bg text-[0.9rem] transition-colors border-t border-border">
                      <CreditCard size={16} /> KYC
                    </Link>
                    <Link href="/how-it-works" className="flex items-center gap-3 p-3 hover:bg-element-bg text-[0.9rem] transition-colors border-t border-border">
                      <HelpCircle size={16} /> Help
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-3 p-3 hover:bg-red-50 text-red-500 text-[0.9rem] transition-colors text-left border-t border-border"
                    >
                      <LogOut size={16} /> Log Out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link 
            href="/history" 
            className="w-10 h-10 bg-white border border-white/40 flex items-center justify-center hover:bg-white/90 transition-all"
            title="Dashboard"
          >
            <LayoutDashboard size={20} className="text-primary" />
          </Link>

          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="w-10 h-10 bg-white border border-white/40 flex items-center justify-center hover:bg-white/90 transition-all relative"
            >
              <Bell size={20} className="text-primary" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500" />
            </button>
          </div>

          <button 
            onClick={() => router.push('/profile')}
            className="w-10 h-10 bg-white border border-white/40 flex items-center justify-center hover:bg-white/90 transition-all"
          >
            <User size={20} className="text-primary" />
          </button>
        </div>
      </div>
    </nav>
  );
}
