"use client";

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Filter, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function ItemsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    fetchItems();
  }, []);

  const router = useRouter();

  const fetchItems = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "items"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const fetchedItems = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setItems(fetchedItems);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesLocation = item.location.toLowerCase().includes(location.toLowerCase());
    const matchesCategory = category === 'All' || item.category === category;
    return matchesSearch && matchesLocation && matchesCategory;
  });

  return (
    <div className="py-10 flex flex-col gap-10">
      <header className="flex flex-col gap-6">
        <Link href="/" className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors font-bold uppercase tracking-wider text-xs">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <div className="flex justify-between items-end">
          <div>
            <span className="tagline">DISCOVER WHAT'S NEARBY</span>
            <h1 className="text-5xl font-black">All Items</h1>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 bg-surface p-3 px-5 rounded-2xl border border-border shadow-sm">
              <Filter size={18} className="text-primary" />
              <select 
                className="bg-transparent border-none outline-none font-bold text-sm"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="All">All Categories</option>
                {["Camera", "Tools", "Vehicles", "Camping", "Books", "Music", "Electronics", "Bag", "Services", "Cars"].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex gap-4 p-3 bg-surface border border-border rounded-3xl shadow-xl">
          <div className="flex-1 flex items-center gap-3 px-4 border-r border-border">
            <Search className="text-text-muted" size={20} />
            <input 
              type="text" 
              placeholder="Search items..." 
              className="w-full bg-transparent border-none outline-none text-text-main font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex-1 flex items-center gap-3 px-4">
            <MapPin className="text-text-muted" size={20} />
            <input 
              type="text" 
              placeholder="Location..." 
              className="w-full bg-transparent border-none outline-none text-text-main font-medium"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-[300px] bg-element-bg animate-pulse rounded-[32px] border border-border" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((item, i) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -8 }}
              className="bg-surface rounded-[32px] p-6 border border-border flex flex-col gap-4 group cursor-pointer hover:border-primary transition-all shadow-sm hover:shadow-xl"
              onClick={() => router.push(`/items/${item.id}/order`)}
            >
              <div className="h-[180px] bg-element-bg rounded-2xl overflow-hidden flex items-center justify-center p-4">
                <img 
                  src={item.imageUrl || "/assets/logo.png"} 
                  alt={item.name} 
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform" 
                />
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <span className="text-[0.65rem] font-black uppercase tracking-widest text-primary">{item.category}</span>
                  <div className="flex items-center gap-1 text-text-muted text-[0.7rem]">
                    <MapPin size={10} /> {item.location}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-text-main line-clamp-1">{item.name}</h3>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xl font-black text-text-main">
                    Rs. {item.price}<span className="text-sm font-bold text-text-muted">/day</span>
                  </p>
                  <button className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                    <ArrowLeft size={20} className="rotate-180" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          {filteredItems.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <h2 className="text-2xl font-bold text-text-muted">No items found matching your search.</h2>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
