"use client";

import React, { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { motion } from 'framer-motion';
import { Trash2, Edit2, Plus, ArrowRight, LayoutDashboard, History as HistoryIcon, Package } from 'lucide-react';
import Link from 'next/link';

export default function HistoryPage() {
  const [user, setUser] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        fetchUserItems(u.uid);
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchUserItems = async (uid: string) => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "items"), 
        where("ownerId", "==", uid),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      setItems(querySnapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error("Error fetching user items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (itemId: string) => {
    if (confirm('Are you sure you want to remove this item?')) {
      try {
        await deleteDoc(doc(db, "items", itemId));
        setItems(items.filter(i => i.id !== itemId));
      } catch (error) {
        alert('Error deleting item');
      }
    }
  };

  if (!user && !loading) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-3xl font-black mb-6">Please sign in to view your dashboard.</h2>
        <Link href="/auth" className="bg-primary text-white px-10 py-4 rounded-full font-bold">Sign In</Link>
      </div>
    );
  }

  return (
    <div className="py-10 flex flex-col gap-10">
      <header>
        <span className="tagline">YOUR DASHBOARD</span>
        <h1 className="text-5xl font-black">User History</h1>
      </header>

      <div className="flex gap-4">
        <button className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-bold shadow-lg">
          <LayoutDashboard size={20} /> My Shared Items
        </button>
        <button className="flex items-center gap-2 bg-surface text-text-main px-6 py-3 rounded-2xl font-bold border border-border">
          <HistoryIcon size={20} /> Rental History
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-[200px] bg-element-bg animate-pulse rounded-[32px] border border-border" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Package className="text-primary" /> Active Listings ({items.length})
            </h2>
            <Link href="/items" className="text-primary font-bold flex items-center gap-1 hover:underline">
              View Marketplace <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, i) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-surface border border-border p-6 rounded-[32px] flex gap-6 relative group"
              >
                <div className="w-24 h-24 bg-element-bg rounded-2xl flex items-center justify-center p-2 shrink-0">
                  <img src={item.imageUrl || "/assets/logo.png"} alt="" className="w-full h-full object-contain" />
                </div>
                <div className="flex flex-col justify-between py-1">
                  <div>
                    <h3 className="font-bold text-lg line-clamp-1">{item.name}</h3>
                    <p className="text-text-muted text-sm">{item.category}</p>
                  </div>
                  <p className="text-xl font-black">Rs. {item.price}</p>
                </div>
                
                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="w-8 h-8 bg-surface border border-border text-text-main rounded-full flex items-center justify-center hover:bg-element-bg transition-colors">
                    <Edit2 size={14} />
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
            
            <button className="border-4 border-dashed border-border rounded-[32px] p-6 flex flex-col items-center justify-center gap-4 text-text-muted hover:border-primary hover:text-primary transition-all group min-h-[160px]">
              <div className="w-12 h-12 bg-element-bg rounded-full flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <Plus size={24} />
              </div>
              <span className="font-bold">Add New Item</span>
            </button>
          </div>

          {items.length === 0 && (
            <div className="py-20 text-center bg-surface rounded-[40px] border border-border border-dashed">
              <h2 className="text-xl font-bold text-text-muted mb-4">You haven't shared any items yet.</h2>
              <p className="text-text-muted mb-8">Start earning by sharing your tools, electronics, or books.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
