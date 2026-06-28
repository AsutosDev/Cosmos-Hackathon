"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Clock, 
  Headset, 
  Zap, 
  Shield, 
  Wrench,
  CarFront,
  Car,
  BookOpen,
  Tent,
  Music,
  Camera,
  Laptop,
  Briefcase,
  Star
} from 'lucide-react';
import { rentalItems as sampleRentalItems } from '@/data/sampleItems';
import { motion } from 'framer-motion';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const categories = [
  { icon: Wrench,    name: 'Tools',       href: '/category/tools' },
  { icon: CarFront,  name: 'Vehicles',    href: '/category/vehicles' },
  { icon: Car,       name: 'Cars',        href: '/category/cars' },
  { icon: BookOpen,  name: 'Books',       href: '/category/books' },
  { icon: Tent,      name: 'Camping',     href: '/category/camping' },
  { icon: Music,     name: 'Music',       href: '/category/music' },
  { icon: Camera,    name: 'Camera',      href: '/category/camera' },
  { icon: Laptop,    name: 'Electronics', href: '/category/electronics' },
  { icon: Briefcase, name: 'Services',    href: '/category/services' },
];

const features = [
  { icon: Clock,   title: '24-hour delivery' },
  { icon: Headset, title: 'Fast Support' },
  { icon: Zap,     title: 'Dual Review System' },
  { icon: Shield,  title: 'KYC Secured' },
];

// Real Unsplash photo IDs for common rental items
const rentalItems = sampleRentalItems;

const filterChips = ['All', 'Camera', 'Camping', 'Music', 'Electronics', 'Tools', 'Vehicles', 'Cars'];

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
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

  const filtered = activeFilter === 'All'
    ? rentalItems
    : rentalItems.filter(item => item.category === activeFilter);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary border-t-transparent"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-16">

      {/* Top category tiles removed as requested */}

      {/* Hero */}
      <section className="border-t border-border pt-12 flex items-end justify-between">
        <div>
          <p className="text-xs font-bold text-text-muted uppercase tracking-[3px] mb-3">Community Rentals · Kathmandu & Beyond</p>
          <h1 className="text-[4rem] font-black leading-[1] tracking-tighter text-black">
            RENT ANYTHING<br />FROM ANYONE,<br />ANYTIME.
          </h1>
        </div>
        <p className="max-w-[280px] text-text-muted text-sm leading-relaxed border-l border-border pl-6">
          Browse tools, cameras, vehicles, instruments and more — all from verified owners in your neighbourhood.
        </p>
      </section>

      {/* Items Gallery */}
      <section>
        {/* Filter chips */}
        <div className="flex items-center gap-2 mb-8 border-b border-border pb-4">
          {filterChips.map(chip => (
            <button
              key={chip}
              onClick={() => setActiveFilter(chip)}
              className={cn(
                "px-4 py-1.5 text-sm font-bold border transition-colors",
                activeFilter === chip
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-text-muted border-border hover:border-primary hover:text-black"
              )}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Masonry-style grid */}
        <motion.div
          layout
          className="grid grid-cols-3 gap-[1px] border border-border bg-border"
        >
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white group cursor-pointer hover:bg-primary-light transition-colors"
              onClick={() => router.push(`/items/${item.id}/order`)}
            >
              {/* Photo */}
              <div className="overflow-hidden border-b border-border h-[220px]">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Details */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-[0.7rem] font-bold text-primary uppercase tracking-wider mb-1">{item.category}</p>
                    <h3 className="font-black text-[1rem] text-black">{item.name}</h3>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <p className="text-lg font-black text-black">Rs. {item.price}</p>
                    <p className="text-[0.7rem] text-text-muted">/day</p>
                  </div>
                </div>

                <div className="mt-3 text-sm text-text-muted">
                  <p>Owner: <span className="font-bold text-black">{item.owner || item.ownerName}</span></p>
                  <p>{item.successfulRents ?? Math.max(8, Number(item.reviews || 0) * 4)} successful rentals</p>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-1.5">
                    <Star size={12} className="text-primary fill-primary" />
                    <span className="text-sm font-bold">{item.rating}</span>
                    <span className="text-xs text-text-muted">({item.reviews} reviews)</span>
                  </div>
                  <span className="text-xs text-text-muted">by {item.owner || item.ownerName}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mt-8">
          <button className="border border-border px-10 py-3 font-bold text-sm hover:bg-primary hover:text-white hover:border-primary transition-colors">
            View All Items <ArrowRight size={14} className="inline ml-1" />
          </button>
        </div>
      </section>

      {/* Features section removed as requested */}

    </div>
  );
}
