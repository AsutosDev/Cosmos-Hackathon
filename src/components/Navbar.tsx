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
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const router = useRouter();
  const noUser = !user;

  const notifications: Array<{
    id: number;
    title: string;
    message: string;
    time: string;
    unread: boolean;
  }> = [];
  const isDark = theme === 'dark';
  const iconButtonClasses = isDark
    ? 'bg-[#111827] border-[#374151] text-white hover:bg-[#1f2937]'
    : 'bg-primary border border-primary text-white hover:bg-primary-hover';
  const panelClasses = isDark
    ? 'bg-[#111827] border-[#374151] text-white'
    : 'bg-white border border-border text-text-main';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.body.setAttribute('data-theme', savedTheme);

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-notification-root]')) {
        setIsNotifOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      unsubscribe();
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.body.setAttribute('data-theme', newTheme);
  };

  const handleLogout = async () => {
    await signOut(auth);
    setIsLogoutConfirmOpen(false);
    router.push('/auth');
  };

  return (
    <>
    <nav className={cn("fixed top-0 left-0 w-full h-[80px] z-[1000] shadow-lg", isDark ? 'bg-[#0f172a] text-white' : 'bg-primary text-white')}>
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
          <button
            type="button"
            onClick={toggleTheme}
            className={cn("w-10 h-10 flex items-center justify-center transition-all cursor-pointer", iconButtonClasses)}
            aria-label="Toggle theme"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun size={20} className="text-white" /> : <Moon size={20} className="text-white" />}
          </button>

          {!noUser && (
            <>
              {/* Settings */}
              <div className="relative">
                <button 
                  type="button"
                  onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                  className={cn("w-10 h-10 flex items-center justify-center transition-all cursor-pointer", iconButtonClasses)}
                >
                  <Settings size={20} className={isDark ? 'text-white' : 'text-primary'} />
                </button>
                
                {isSettingsOpen && (
                  <div className={cn("absolute top-[60px] right-0 w-[260px] shadow-lg overflow-hidden z-50", panelClasses)}>
                    <div className={cn("p-4 border-b", isDark ? 'border-[#374151]' : 'border-border')}>
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
                        <Link href="/profile" className={cn("flex items-center gap-3 p-3 text-[0.9rem] transition-colors border-t", isDark ? 'hover:bg-[#1f2937] border-[#374151]' : 'hover:bg-element-bg border-border')}>
                          <User size={16} /> Account
                        </Link>
                        <Link href="/kyc" className={cn("flex items-center gap-3 p-3 text-[0.9rem] transition-colors border-t", isDark ? 'hover:bg-[#1f2937] border-[#374151]' : 'hover:bg-element-bg border-border')}>
                          <CreditCard size={16} /> KYC
                        </Link>
                        <Link href="/how-it-works" className={cn("flex items-center gap-3 p-3 text-[0.9rem] transition-colors border-t", isDark ? 'hover:bg-[#1f2937] border-[#374151]' : 'hover:bg-element-bg border-border')}>
                          <HelpCircle size={16} /> Help
                        </Link>
                        <button 
                          onClick={() => {
                            setIsSettingsOpen(false);
                            setIsLogoutConfirmOpen(true);
                          }}
                          className={cn("flex items-center gap-3 p-3 text-[0.9rem] transition-colors text-left border-t cursor-pointer", isDark ? 'hover:bg-red-950/40 text-red-400 border-[#374151]' : 'hover:bg-red-50 text-red-500 border-border')}
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
                className={cn("w-10 h-10 flex items-center justify-center transition-all cursor-pointer", iconButtonClasses)}
                title="Dashboard"
              >
                <LayoutDashboard size={20} className={isDark ? 'text-white' : 'text-primary'} />
              </Link>

              {/* Notifications */}
              <div className="relative" data-notification-root>
                <button 
                  type="button"
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className={cn("w-10 h-10 flex items-center justify-center transition-all relative cursor-pointer", iconButtonClasses)}
                  aria-label="Notifications"
                  title="Notifications"
                >
                  <Bell size={20} className={isDark ? 'text-white' : 'text-primary'} />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                </button>

                {isNotifOpen && (
                  <div className={cn("absolute top-[60px] right-0 w-[290px] shadow-lg z-50", panelClasses)}>
                    <div className={cn("p-4 border-b", isDark ? 'border-[#374151]' : 'border-border')}>
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-sm uppercase tracking-wider">Notifications</h3>
                        <span className={cn("text-xs", isDark ? 'text-slate-400' : 'text-text-muted')}>Live updates</span>
                      </div>
                    </div>

                    <div className="max-h-[280px] overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className={cn("p-4 text-sm", isDark ? 'text-slate-400' : 'text-text-muted')}>
                          No new notifications from other users yet.
                        </div>
                      ) : (
                        notifications.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            className={cn("w-full text-left p-3 border-b last:border-b-0 transition-colors cursor-pointer", isDark ? 'border-[#374151] hover:bg-[#1f2937]' : 'border-border hover:bg-element-bg')}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="text-sm font-semibold">{item.title}</p>
                                <p className={cn("text-xs mt-1", isDark ? 'text-slate-400' : 'text-text-muted')}>{item.message}</p>
                              </div>
                              {item.unread && <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary flex-shrink-0" />}
                            </div>
                            <p className={cn("text-[11px] mt-2", isDark ? 'text-slate-500' : 'text-text-muted')}>{item.time}</p>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <button 
                type="button"
                onClick={() => router.push('/profile')}
                className={cn("w-10 h-10 flex items-center justify-center transition-all cursor-pointer", iconButtonClasses)}
              >
                <User size={20} className={isDark ? 'text-white' : 'text-primary'} />
              </button>
            </>
          )}
        </div>
      </div>
    </nav>

    {isLogoutConfirmOpen && (
      <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 px-4" onClick={() => setIsLogoutConfirmOpen(false)}>
        <div className={cn("w-full max-w-[360px] rounded-lg border p-5 shadow-2xl", panelClasses)} onClick={(e) => e.stopPropagation()}>
          <h3 className="text-lg font-semibold">Log out of your account?</h3>
          <p className={cn("mt-2 text-sm", isDark ? 'text-slate-400' : 'text-text-muted')}>
            Are you sure you want to log out? You can always sign back in anytime.
          </p>
          <div className="mt-5 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsLogoutConfirmOpen(false)}
              className={cn("px-3 py-2 text-sm transition-colors cursor-pointer", isDark ? 'bg-[#1f2937] hover:bg-[#374151]' : 'bg-gray-100 hover:bg-gray-200')}
            >
              Stay signed in
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-2 bg-red-500 text-white text-sm transition-colors hover:bg-red-600 cursor-pointer"
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
