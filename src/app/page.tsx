"use client";

import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Smartphone, 
  Clock, 
  Headset, 
  Zap, 
  Shield, 
  Box, 
  User, 
  Sparkles,
  Wrench,
  CarFront,
  Car,
  BookOpen,
  Tent,
  Music,
  Camera,
  Laptop,
  Briefcase
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const categories = [
  { icon: Wrench, name: 'Tools', href: '/category/tools' },
  { icon: CarFront, name: 'Vehicles', href: '/category/vehicles' },
  { icon: Car, name: 'Cars', href: '/category/cars' },
  { icon: BookOpen, name: 'Books', href: '/category/books' },
  { icon: Tent, name: 'Camping', href: '/category/camping' },
  { icon: Music, name: 'Music', href: '/category/music' },
  { icon: Camera, name: 'Camera', href: '/category/camera' },
  { icon: Laptop, name: 'Electronics', href: '/category/electronics' },
  { icon: Briefcase, name: 'Services', href: '/category/services' },
];

const features = [
  { icon: Clock, title: '24-hour car delivery' },
  { icon: Headset, title: 'Fast delivery' },
  { icon: Zap, title: 'Dual Review System' },
  { icon: Shield, title: 'Absolute confidentiality, KYC Secured.' },
];

const team = [
  { name: 'Aashutosh Kafle', role: '---------' },
  { name: 'Pallav Pandey', role: '-------' },
  { name: 'Prasanna Neupane', role: '----------' },
  { name: 'Shreedesh Tiwari', role: '--------' },
];

export default function Home() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/auth');
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-20">
      {/* Category Nav */}
      <section className="flex justify-center gap-4 flex-wrap mt-10">
        {categories.map((cat, i) => (
          <motion.a
            key={cat.name}
            href={cat.href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex flex-col items-center justify-center gap-2.5 w-[100px] h-[100px] bg-surface border border-border rounded-2xl hover:bg-primary-light transition-all group"
          >
            <cat.icon className="w-7 h-7 group-hover:scale-110 transition-transform text-primary" />
            <span className="text-[0.85rem] font-bold">{cat.name}</span>
          </motion.a>
        ))}
      </section>

      {/* Hero Section */}
      <section className="flex relative min-h-[500px]">
        <div className="flex-1 flex flex-col justify-center z-10">
          <motion.h1 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-[4.5rem] font-black leading-[0.95] mb-[30px] tracking-tight"
          >
            RENT<br />
            WHAT YOU NEED<br />
            ANYTIME
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-[300px] text-text-muted text-[0.95rem] leading-relaxed mb-[50px]"
          >
            Rent everyday items from people around you. Affordable, flexible, and convenient for short or long-term needs.
          </motion.p>

          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2 bg-surface p-2 px-4 rounded-xl shadow-lg border border-border">
              <Box className="w-5 h-5 text-primary" />
              <span className="font-bold text-[0.9rem]">Popular Items</span>
            </div>
            <button className="w-10 h-10 rounded-full bg-element-bg flex items-center justify-center hover:scale-110 transition-transform">
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex-1 relative flex justify-center items-center"
        >
          <img 
            src="/assets/hero_car.png" 
            alt="Hero Car" 
            className="w-[120%] max-w-[900px] -mr-[100px] z-10 grayscale brightness-110 contrast-125" 
          />
          <div className="absolute inset-0 bg-[radial-gradient(var(--primary-light)_1px,transparent_1px)] bg-[length:20px_20px] opacity-40" />
        </motion.div>
      </section>

      {/* Modern App Section */}
      <section className="flex items-center gap-[60px]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex-1"
        >
          <span className="tagline">SIMPLE & SMART RENTING</span>
          <h2 className="section-title">Modern Platform</h2>
          <p className="section-desc">
            Browse items, manage rentals, communicate with owners, and track availability from one place.
          </p>
          <button className="bg-primary text-text-main px-7 py-3 rounded-full font-bold flex items-center gap-2 hover:translate-y-[-2px] hover:shadow-lg transition-all">
            <Smartphone size={18} />
            Browse items
          </button>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, rotateY: 20 }}
          whileInView={{ opacity: 1, rotateY: 0 }}
          viewport={{ once: true }}
          className="flex-1 flex justify-center h-[500px]"
        >
          <img src="/assets/app_mockup.png" alt="App Mockup" className="max-w-[400px] object-contain drop-shadow-2xl grayscale" />
        </motion.div>
      </section>

      {/* Items Section */}
      <section>
        <div className="flex justify-between items-end mb-10">
          <div>
            <span className="tagline">mostly used Items</span>
            <h2 className="section-title">Items</h2>
          </div>
          <div className="flex gap-2.5">
            {['Bag', 'Bat', 'ball', 'skirt', 'Cap', 'Gloves', 'Cars'].map(chip => (
              <button key={chip} className="bg-element-bg text-text-main px-5 py-2 rounded-full font-medium hover:bg-primary-light transition-colors">
                {chip}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-5">
          <ItemCard title="Porsche 911" price="450" img="/assets/porsche_911.png" large />
          <ItemCard title="Ferrari 488" price="600" img="/assets/ferrari_488.png" large />
          <ItemCard title="Lamborghini Huracan" price="700" img="/assets/lamborghini_huracan.png" large />
        </div>
      </section>

      {/* Features Section */}
      <section>
        <span className="tagline">TAKING CARE OF EVERY CLIENT</span>
        <h2 className="section-title">Key Features</h2>
        <div className="grid grid-cols-4 gap-[30px] mt-10">
          {features.map((f, i) => (
            <motion.div 
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-surface p-[30px] rounded-[24px] border border-border hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <div className="w-[50px] h-[50px] bg-primary/10 rounded-full flex items-center justify-center text-primary mb-5">
                <f.icon />
              </div>
              <h3 className="text-[1.1rem] font-semibold leading-relaxed">{f.title}</h3>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="text-center">
        <h2 className="text-2xl font-bold mb-10">Brought to you by:</h2>
        <div className="grid grid-cols-4 gap-8">
          {team.map((m, i) => (
            <motion.div 
              key={m.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center"
            >
              <div className="w-20 h-20 bg-element-bg rounded-full flex items-center justify-center text-text-muted mb-4 border border-border">
                <User size={32} />
              </div>
              <h3 className="font-bold text-[1.1rem]">{m.name}</h3>
              <p className="text-text-muted text-sm">{m.role}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ItemCard({ title, price, img, large }: { title: string, price: string, img: string, large?: boolean }) {
  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className={cn(
        "bg-surface rounded-3xl p-5 border border-border flex flex-col justify-between group cursor-pointer hover:border-primary transition-all",
        large ? "h-[300px]" : "h-[200px]"
      )}
    >
      <img src={img} alt={title} className="w-full h-auto object-contain max-h-[180px] group-hover:scale-105 transition-transform grayscale hover:grayscale-0" />
      <div className={cn("mt-4", large ? "" : "sr-only")}>
        <h3 className="text-[1.1rem] font-bold">{title}</h3>
        <p className="text-text-muted text-[0.9rem]">Rs. {price}/day</p>
      </div>
    </motion.div>
  );
}
