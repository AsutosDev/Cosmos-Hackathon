"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { motion } from 'framer-motion';
import { onAuthStateChanged } from 'firebase/auth';

export default function BookItemPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [item, setItem] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchItem = async () => {
      setLoading(true);
      try {
        const d = await getDoc(doc(db, 'items', id));
        if (d.exists()) setItem({ id: d.id, ...d.data() });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  // Enforce KYC: redirect to /kyc if user not verified
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        router.push('/auth');
        return;
      }
      try {
        const ud = await getDoc(doc(db, 'users', u.uid));
        const status = ud.exists() ? (ud.data() as any).kycStatus : null;
        if (status !== 'verified') {
          router.push('/kyc');
        }
      } catch (err) {
        console.error('Error checking KYC status', err);
      }
    });
    return () => unsub();
  }, [router]);

  if (loading || !item) {
    return (
      <div className="py-20 text-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} className="w-10 h-10 border-4 border-primary border-t-transparent mx-auto" />
      </div>
    );
  }

  // Pre-calculated security deposit (collateral): 3x daily price by default
  const deposit = item.securityDeposit ?? (Number(item.price || 0) * 3);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // In a real app, create booking record, charge deposit, etc.
      await new Promise((r) => setTimeout(r, 1000));
      router.push('/history');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-10">
      <header>
        <h1 className="text-4xl font-black">Book: {item.name}</h1>
        <p className="text-text-muted mt-2">Owner: {item.ownerName || item.owner}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="col-span-2 bg-white border border-border rounded-[24px] p-6">
          <img src={item.imageUrl || '/assets/logo.png'} alt={item.name} className="w-full h-[380px] object-cover rounded-lg" />
          <h2 className="text-2xl font-bold mt-4">Rs. {item.price} / day</h2>
          <p className="text-text-muted mt-2">{item.description}</p>
        </div>

        <aside className="bg-surface border border-border rounded-[24px] p-6">
          <h3 className="font-black text-lg">Booking Summary</h3>
          <div className="mt-4">
            <p className="text-sm text-text-muted">Security Deposit (collateral):</p>
            <p className="text-xl font-black">Rs. {deposit.toLocaleString()}</p>
            <p className="text-xs text-text-muted mt-2">This amount will be held as collateral and released after the item is returned in good condition.</p>
          </div>

          <form onSubmit={handleBook} className="mt-6 flex flex-col gap-3">
            <label className="text-sm font-bold">Pickup Date</label>
            <input type="date" required className="border border-border p-2 rounded" />
            <label className="text-sm font-bold">Return Date</label>
            <input type="date" required className="border border-border p-2 rounded" />

            <button type="submit" disabled={submitting} className="mt-4 bg-primary text-white py-3 rounded-2xl font-bold disabled:opacity-50">
              {submitting ? 'Requesting…' : 'Request Booking'}
            </button>
          </form>
        </aside>
      </div>
    </div>
  );
}
