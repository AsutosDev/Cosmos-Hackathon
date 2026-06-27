"use client";

import React, { useState } from 'react';
import { X, Upload, ChevronDown, Check } from 'lucide-react';
import { db, auth } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CATEGORIES = [
  "Camera", "Tools", "Vehicles", "Camping", "Books", "Music", "Electronics", "Bag", "Services", "Cars"
];

interface ShareItemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareItemModal({ isOpen, onClose }: ShareItemModalProps) {
  const [loading, setLoading] = useState(false);
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [expiry, setExpiry] = useState('');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return alert('Please select a category');
    
    setLoading(true);
    try {
      const user = auth.currentUser;
      const now = new Date().toISOString();
      
      await addDoc(collection(db, "items"), {
        ownerId: user ? user.uid : "anonymous",
        ownerName: user ? user.displayName : "Guest",
        name: itemName,
        category,
        price: parseFloat(price),
        expiryDate: expiry,
        location,
        email: email || (user ? user.email : ""),
        createdAt: now,
        updatedAt: now,
        available: true
      });

      alert('Item shared successfully! 🎉');
      onClose();
      // Reset form
      setItemName('');
      setCategory('');
      setPrice('');
      setExpiry('');
      setLocation('');
      setEmail('');
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#0f172a]/80 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-[500px] bg-bg border border-border rounded-[32px] overflow-hidden shadow-2xl"
          >
            <div className="p-8 border-b border-border flex justify-between items-center">
              <h3 className="text-2xl font-black text-text-main">Share Your Item</h3>
              <button onClick={onClose} className="p-2 hover:bg-element-bg rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-5 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="flex flex-col gap-1.5">
                <label className="text-[0.75rem] font-bold text-text-muted uppercase tracking-wider">Item Name</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g., Canon DSLR Camera" 
                  className="w-full bg-element-bg border border-border rounded-xl py-3 px-4 outline-none focus:border-primary transition-all text-text-main"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[0.75rem] font-bold text-text-muted uppercase tracking-wider">Category</label>
                <div className="relative">
                  <button 
                    type="button"
                    onClick={() => setIsSelectOpen(!isSelectOpen)}
                    className="w-full bg-element-bg border border-border rounded-xl py-3 px-4 flex items-center justify-between text-text-main"
                  >
                    <span className={cn(!category && "text-text-muted")}>{category || "Select Category"}</span>
                    <ChevronDown size={18} className={cn("transition-transform", isSelectOpen && "rotate-180")} />
                  </button>
                  
                  {isSelectOpen && (
                    <div className="absolute top-full left-0 w-full mt-2 bg-bg border border-border rounded-xl shadow-xl z-20 overflow-hidden">
                      {CATEGORIES.map(cat => (
                        <button 
                          key={cat}
                          type="button"
                          onClick={() => {
                            setCategory(cat);
                            setIsSelectOpen(false);
                          }}
                          className="w-full px-4 py-2.5 text-left text-sm hover:bg-primary hover:text-white transition-colors flex items-center justify-between"
                        >
                          {cat}
                          {category === cat && <Check size={14} />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="text-[0.75rem] font-bold text-text-muted uppercase tracking-wider">Price (Rs./day)</label>
                  <input 
                    required
                    type="number" 
                    placeholder="0" 
                    className="w-full bg-element-bg border border-border rounded-xl py-3 px-4 outline-none focus:border-primary transition-all text-text-main"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="text-[0.75rem] font-bold text-text-muted uppercase tracking-wider">Expiry Date</label>
                  <input 
                    required
                    type="date" 
                    className="w-full bg-element-bg border border-border rounded-xl py-3 px-4 outline-none focus:border-primary transition-all text-text-main"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[0.75rem] font-bold text-text-muted uppercase tracking-wider">Location</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. Kathmandu, NP" 
                  className="w-full bg-element-bg border border-border rounded-xl py-3 px-4 outline-none focus:border-primary transition-all text-text-main"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[0.75rem] font-bold text-text-muted uppercase tracking-wider">Contact Email</label>
                <input 
                  required
                  type="email" 
                  placeholder="user@gmail.com" 
                  className="w-full bg-element-bg border border-border rounded-xl py-3 px-4 outline-none focus:border-primary transition-all text-text-main"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[0.75rem] font-bold text-text-muted uppercase tracking-wider">Item Image</label>
                <div className="border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center gap-3 hover:border-primary transition-colors cursor-pointer group">
                  <Upload size={32} className="text-text-muted group-hover:text-primary transition-colors" />
                  <span className="text-sm font-bold text-text-muted group-hover:text-primary">Click to upload image</span>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none shadow-xl shadow-primary/20"
              >
                {loading ? "Processing..." : "Share Item"}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
