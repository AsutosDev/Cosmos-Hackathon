"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, getDocs, orderBy, limit, addDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Star, Clock, Package, Plus, TrendingUp,
  User, ShieldCheck, BarChart3, Layers, CalendarDays
} from 'lucide-react';

const categories = [
  'Tools', 'Vehicles', 'Cars', 'Books', 'Camping',
  'Music', 'Camera', 'Electronics', 'Services',
];

export default function OwnerDashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [pageLoading, setPageLoading] = useState(true);

  // Profile data
  const [displayName, setDisplayName] = useState('Owner');
  const [rating, setRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [memberSince, setMemberSince] = useState('');
  const [kycStatus, setKycStatus] = useState('pending');

  // Items
  const [ownerItems, setOwnerItems] = useState<any[]>([]);
  const [totalEarnings, setTotalEarnings] = useState(0);

  // Draft cache
  const [drafts, setDrafts] = useState<any[]>([]);
  const [draftLoading, setDraftLoading] = useState(false);

  // Form
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/auth');
      } else {
        setCurrentUser(user);
        setDisplayName(user.displayName || 'Owner');
        fetchOwnerData(user.uid);
      }
    });
    return () => unsub();
  }, [router]);

  const fetchOwnerData = async (uid: string) => {
    try {
      // User profile
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const d = userDoc.data();
        setRating(d.rating ?? 0);
        setTotalReviews(d.totalReviews ?? 0);
        setKycStatus(d.kycStatus ?? 'pending');
        if (d.createdAt) {
          setMemberSince(new Date(d.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
        }
      }

      // Owner's items
      const q = query(
        collection(db, 'items'),
        where('ownerId', '==', uid),
        orderBy('createdAt', 'desc'),
        limit(10)
      );
      const snap = await getDocs(q);
      const items: any[] = [];
      let earnings = 0;
      snap.forEach((d) => {
        const data = { id: d.id, ...d.data() };
        items.push(data);
        earnings += (data as any).price || 0;
      });
      setOwnerItems(items);
      setTotalEarnings(earnings);
    } catch (err) {
      console.error('Error fetching owner data:', err);
    } finally {
      setPageLoading(false);
    }
  };

  const loadDrafts = () => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem('ownerListingDrafts');
    if (!stored) return;
    try {
      setDrafts(JSON.parse(stored));
    } catch (err) {
      console.error('Error parsing saved drafts:', err);
    }
  };

  const saveDrafts = (updatedDrafts: any[]) => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('ownerListingDrafts', JSON.stringify(updatedDrafts));
    setDrafts(updatedDrafts);
  };

  useEffect(() => {
    loadDrafts();
  }, []);

  const handleSaveDraft = () => {
    const draft = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      name,
      category,
      price: Number(price),
      description,
      imageUrl,
      ownerId: currentUser?.uid || 'draft-owner',
      ownerName: currentUser?.displayName || 'Owner',
      createdAt: new Date().toISOString(),
    };

    if (!draft.name || !draft.price || !draft.description) {
      alert('Please fill in name, price, and description to save a draft.');
      return;
    }

    const updated = [...drafts, draft];
    saveDrafts(updated);
    setSuccessMsg('Draft saved locally.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleDeleteDraft = (id: string) => {
    const updated = drafts.filter((draft) => draft.id !== id);
    saveDrafts(updated);
  };

  const handlePublishDraft = async (draft: any) => {
    if (!currentUser) return router.push('/auth');
    setDraftLoading(true);
    try {
      await addDoc(collection(db, 'items'), {
        name: draft.name,
        category: draft.category,
        price: Number(draft.price),
        description: draft.description,
        imageUrl: draft.imageUrl,
        ownerId: currentUser.uid,
        ownerName: currentUser.displayName || 'Owner',
        createdAt: serverTimestamp(),
      });
      handleDeleteDraft(draft.id);
      setSuccessMsg('Draft published successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
      fetchOwnerData(currentUser.uid);
    } catch (err: any) {
      alert('Error publishing draft: ' + err.message);
    } finally {
      setDraftLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setFormLoading(true);
    try {
      await addDoc(collection(db, 'items'), {
        name, category,
        price: Number(price),
        description, imageUrl,
        ownerId: currentUser.uid,
        ownerName: currentUser.displayName || 'Owner',
        createdAt: serverTimestamp(),
      });
      setSuccessMsg('Item listed successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
      setName(''); setCategory(categories[0]); setPrice('');
      setDescription(''); setImageUrl('');
      setShowForm(false);
      fetchOwnerData(currentUser.uid);
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setFormLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const stats = [
    { icon: Layers,       label: 'Active Listings', value: ownerItems.length },
    { icon: Star,         label: 'Your Rating',     value: rating > 0 ? rating.toFixed(1) : '—' },
    { icon: TrendingUp,   label: 'Total Value (Rs)', value: totalEarnings.toLocaleString() },
    { icon: BarChart3,    label: 'Reviews',          value: totalReviews },
  ];

  return (
    <div className="min-h-[90vh] bg-white">
      {/* ── Success Toast ── */}
      <AnimatePresence>
        {successMsg && (
          <motion.div initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -40, opacity: 0 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-black text-white px-6 py-3 text-sm font-bold border border-primary">
            {successMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1100px] mx-auto px-6 py-10">

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-10 border-b border-border pb-8">
          <div>
            <p className="text-xs font-bold text-text-muted uppercase tracking-[3px] mb-2">Owner Dashboard</p>
            <h1 className="text-[2.5rem] font-black tracking-tight text-black leading-tight">
              Welcome back,<br />{displayName}.
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="flex items-center gap-1 justify-end">
                <ShieldCheck size={14} className={kycStatus === 'verified' ? 'text-green-600' : 'text-text-muted'} />
                <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  KYC {kycStatus}
                </span>
              </div>
              {memberSince && (
                <p className="text-xs text-text-muted mt-1 flex items-center gap-1 justify-end">
                  <CalendarDays size={12} /> Member since {memberSince}
                </p>
              )}
            </div>
            <div className="w-14 h-14 bg-primary text-white flex items-center justify-center font-black text-xl border border-primary">
              {displayName.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-4 border border-border mb-10">
          {stats.map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`p-6 bg-white hover:bg-primary-light transition-colors ${i < 3 ? 'border-r border-border' : ''}`}
            >
              <div className="w-10 h-10 bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-3">
                <s.icon size={18} />
              </div>
              <p className="text-2xl font-black text-black">{s.value}</p>
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* ── Add Item Button / Form ── */}
        <div className="mb-10">
          {!showForm ? (
            <motion.button
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              onClick={() => setShowForm(true)}
              className="w-full border-2 border-dashed border-border py-6 flex items-center justify-center gap-3 text-text-muted font-bold text-sm hover:border-primary hover:text-primary transition-colors"
            >
              <Plus size={18} /> Add New Listing
            </motion.button>
          ) : (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              className="border border-border bg-white overflow-hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-border bg-black text-white">
                <h3 className="font-bold text-sm flex items-center gap-2"><Package size={16} /> New Listing</h3>
                <button onClick={() => setShowForm(false)} className="text-white/50 hover:text-white text-sm font-bold">Cancel</button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[0.7rem] font-bold text-text-muted uppercase tracking-wider mb-1.5">Item Name</label>
                    <input required type="text" placeholder="e.g. DSLR Camera" value={name} onChange={e => setName(e.target.value)}
                      className="w-full border border-border py-2.5 px-3 text-sm outline-none focus:border-black transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[0.7rem] font-bold text-text-muted uppercase tracking-wider mb-1.5">Category</label>
                    <select value={category} onChange={e => setCategory(e.target.value)}
                      className="w-full border border-border py-2.5 px-3 text-sm outline-none focus:border-black transition-colors">
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[0.7rem] font-bold text-text-muted uppercase tracking-wider mb-1.5">Price (Rs. / day)</label>
                    <input required type="number" placeholder="500" value={price} onChange={e => setPrice(e.target.value)}
                      className="w-full border border-border py-2.5 px-3 text-sm outline-none focus:border-black transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[0.7rem] font-bold text-text-muted uppercase tracking-wider mb-1.5">Image URL</label>
                    <input type="url" placeholder="https://…" value={imageUrl} onChange={e => setImageUrl(e.target.value)}
                      className="w-full border border-border py-2.5 px-3 text-sm outline-none focus:border-black transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-[0.7rem] font-bold text-text-muted uppercase tracking-wider mb-1.5">Description</label>
                  <textarea required rows={2} placeholder="Brief description…" value={description} onChange={e => setDescription(e.target.value)}
                    className="w-full border border-border py-2.5 px-3 text-sm outline-none focus:border-black transition-colors" />
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <button type="submit" disabled={formLoading}
                    className="w-full sm:w-auto bg-primary text-white py-3 font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary-hover transition-colors disabled:opacity-50">
                    {formLoading ? 'Saving…' : 'Publish Listing'} {!formLoading && <ArrowRight size={15} />}
                  </button>
                  <button type="button" onClick={handleSaveDraft} disabled={draftLoading}
                    className="w-full sm:w-auto border border-border text-black py-3 font-bold text-sm hover:border-black hover:text-black transition-colors disabled:opacity-50">
                    Save Draft Locally
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </div>

        {drafts.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-black tracking-tight text-black">Draft Listings</h2>
              <span className="text-xs font-bold text-text-muted uppercase tracking-wider">{drafts.length} draft{drafts.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {drafts.map((draft, i) => (
                <motion.div key={draft.id}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="border border-border bg-white p-5"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-[0.65rem] font-bold text-primary uppercase tracking-wider">{draft.category}</p>
                      <h3 className="font-black text-sm text-black">{draft.name}</h3>
                      <p className="text-lg font-black text-black mt-1">Rs. {draft.price}<span className="text-xs text-text-muted font-normal">/day</span></p>
                      <p className="text-sm text-text-muted mt-2 line-clamp-2">{draft.description}</p>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <button type="button" onClick={() => handlePublishDraft(draft)} disabled={draftLoading}
                        className="bg-primary text-white py-2 px-4 font-bold text-xs uppercase tracking-[1px] hover:bg-primary-hover transition-colors disabled:opacity-50">
                        Publish Draft
                      </button>
                      <button type="button" onClick={() => handleDeleteDraft(draft.id)}
                        className="border border-border text-black py-2 px-4 font-bold text-xs uppercase tracking-[1px] hover:border-black hover:text-black transition-colors">
                        Remove Draft
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ── Your Listings ── */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-black tracking-tight text-black">Your Listings</h2>
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">{ownerItems.length} item{ownerItems.length !== 1 ? 's' : ''}</span>
          </div>

          {ownerItems.length === 0 ? (
            <div className="border border-border p-12 text-center">
              <Package size={32} className="mx-auto text-text-muted mb-3" />
              <p className="text-text-muted font-bold text-sm">No listings yet</p>
              <p className="text-text-muted text-xs mt-1">Click "Add New Listing" above to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-[1px] border border-border bg-border">
              {ownerItems.map((item, i) => (
                <motion.div key={item.id}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white p-5 hover:bg-primary-light transition-colors group"
                >
                  <div className="flex gap-4">
                    {item.imageUrl ? (
                      <div className="w-20 h-20 shrink-0 border border-border overflow-hidden">
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </div>
                    ) : (
                      <div className="w-20 h-20 shrink-0 border border-border bg-element-bg flex items-center justify-center">
                        <Package size={20} className="text-text-muted" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-[0.65rem] font-bold text-primary uppercase tracking-wider">{item.category}</p>
                      <h3 className="font-black text-sm text-black truncate">{item.name}</h3>
                      <p className="text-lg font-black text-black mt-1">Rs. {item.price}<span className="text-xs text-text-muted font-normal">/day</span></p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
