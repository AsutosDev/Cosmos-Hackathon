"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { rentalItems as sampleItems } from '@/data/sampleItems';

export default function BookingSuccessPage() {
  const params = useParams();
  const id = params?.id as string;
  const searchParams = useSearchParams();
  const [item, setItem] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const pickupDate = searchParams?.get('pickup') || 'N/A';
  const returnDate = searchParams?.get('return') || 'N/A';
  const pickupLocation = searchParams?.get('location') || 'N/A';

  useEffect(() => {
    if (!id) return;

    const fetchItem = async () => {
      setLoading(true);
      try {
        const snapshot = await getDoc(doc(db, 'items', id));
        if (snapshot.exists()) {
          setItem({ id: snapshot.id, ...snapshot.data() });
        } else {
          const sample = sampleItems.find((sampleItem) => sampleItem.id.toString() === id);
          if (sample) {
            setItem({ ...sample, id });
          }
        }
      } catch (err) {
        console.error('Error loading success item', err);
        const sample = sampleItems.find((sampleItem) => sampleItem.id.toString() === id);
        if (sample) {
          setItem({ ...sample, id });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} className="w-10 h-10 border-4 border-primary border-t-transparent mx-auto" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="py-20 text-center text-red-600">
        <p className="text-xl font-bold">Item not found.</p>
        <p className="text-text-muted mt-2">Please go back and choose another item.</p>
      </div>
    );
  }

  return (
    <div className="py-10">
      <div className="max-w-3xl mx-auto bg-white border border-border rounded-[24px] p-8 shadow-lg">
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="mx-auto mb-5 w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center"
          >
            <CheckCircle2 size={42} className="drop-shadow-lg" />
          </motion.div>
          <p className="text-primary uppercase tracking-[3px] text-sm font-bold">Booking Confirmed</p>
          <h1 className="text-4xl font-black mt-4">Successfully booked</h1>
          <p className="text-text-muted mt-4 text-lg">
            Our team is on the way to the owner's location to get you the item wrapped.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 mb-6">
          <div className="rounded-3xl border border-border p-6">
            <p className="text-xs uppercase tracking-[2px] text-text-muted font-bold mb-3">Owner</p>
            <p className="text-2xl font-black">{item.owner || item.ownerName}</p>
            <p className="text-sm text-text-muted mt-2">{item.location || 'Owner location not available'}</p>
          </div>

          <div className="rounded-3xl border border-border p-6">
            <p className="text-xs uppercase tracking-[2px] text-text-muted font-bold mb-3">Contact</p>
            <p className="text-lg font-bold">{item.ownerPhone || '+977-9800000000'}</p>
            <p className="text-sm text-text-muted mt-2">{item.ownerEmail || 'support@bhada-maa.com'}</p>
          </div>
        </div>

        <div className="rounded-3xl bg-surface border border-border p-6">
          <p className="text-sm uppercase tracking-[2px] text-text-muted font-bold mb-3">Order summary</p>
          <div className="space-y-3 text-sm text-text-muted">
            <p><span className="font-bold text-black">Item:</span> {item.name}</p>
            <p><span className="font-bold text-black">Pickup Date:</span> {pickupDate}</p>
            <p><span className="font-bold text-black">Return Date:</span> {returnDate}</p>
            <p><span className="font-bold text-black">Pickup Location:</span> {pickupLocation}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
