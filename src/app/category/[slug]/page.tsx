"use client";

import React, { useState, useEffect, use } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategoryItems();
  }, [slug]);

  const fetchCategoryItems = async () => {
    setLoading(true);
    try {
      // Capitalize slug for matching category in DB
      const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);
      const q = query(
        collection(db, "items"), 
        where("category", "==", categoryName),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const fetchedItems = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setItems(fetchedItems);
    } catch (error) {
      console.error("Error fetching category items:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-10 flex flex-col gap-10">
      <header className="flex flex-col gap-6">
        <Link href="/" className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors font-bold uppercase tracking-wider text-xs">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <div>
          <span className="tagline">CATEGORY BROWSE</span>
          <h1 className="text-5xl font-black capitalize">{slug}</h1>
        </div>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-[300px] bg-element-bg animate-pulse rounded-[32px] border border-border" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item, i) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -8 }}
              className="bg-surface rounded-[32px] p-6 border border-border flex flex-col gap-4 group cursor-pointer hover:border-primary transition-all shadow-sm hover:shadow-xl"
            >
              <div className="h-[180px] bg-element-bg rounded-2xl overflow-hidden flex items-center justify-center p-4">
                <img 
                  src={item.imageUrl || "/assets/logo.png"} 
                  alt={item.name} 
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform" 
                />
              </div>
              <div className="flex flex-col gap-1">
                 <div className="flex justify-between items-center text-text-muted text-[0.75rem]">
                    <span className="font-bold uppercase tracking-widest text-primary">{item.category}</span>
                    <div className="flex items-center gap-1">
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
          {items.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <h2 className="text-2xl font-bold text-text-muted">No items found in this category.</h2>
              <Link href="/items" className="text-primary font-bold mt-4 block hover:underline">Browse all items Instead</Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
