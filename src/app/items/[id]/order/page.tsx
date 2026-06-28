"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';
import { rentalItems as sampleItems } from '@/data/sampleItems';

export default function OrderDetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [item, setItem] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');

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
        console.error('Error loading item', err);
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

  const handleContinue = () => {
    if (!pickupDate || !returnDate) {
      alert('Please select pickup and return dates.');
      return;
    }
    router.push(`/items/${id}/book/success?pickup=${encodeURIComponent(pickupDate)}&return=${encodeURIComponent(returnDate)}&location=${encodeURIComponent(pickupLocation)}`);
  };

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

  const deposit = item.securityDeposit ?? (Number(item.price || 0) * 3);

  return (
    <div className="py-10">
      <div className="max-w-[900px] mx-auto bg-white border border-border rounded-[24px] p-8 shadow-lg">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <p className="text-xs font-bold text-text-muted uppercase tracking-[3px]">Order Details</p>
            <h1 className="text-3xl font-black">Choose how you want your order</h1>
          </div>
          <div className="text-right text-text-muted">
            <p>Rs. {item.price} / day</p>
            <p className="text-sm">Security deposit: Rs. {deposit.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-surface border border-border rounded-[24px] p-6">
            <img src={item.imageUrl || '/assets/logo.png'} alt={item.name} className="w-full h-[320px] object-cover rounded-3xl mb-6" />
            <h2 className="text-2xl font-bold mb-2">{item.name}</h2>
            <p className="text-text-muted mb-4">{item.description}</p>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-bold text-text-muted mb-2">Pickup Date</label>
                <input type="date" value={pickupDate} onChange={e => setPickupDate(e.target.value)} className="w-full border border-border rounded-xl p-3" />
              </div>
              <div>
                <label className="block text-sm font-bold text-text-muted mb-2">Return Date</label>
                <input type="date" value={returnDate} onChange={e => setReturnDate(e.target.value)} className="w-full border border-border rounded-xl p-3" />
              </div>
              <div>
                <label className="block text-sm font-bold text-text-muted mb-2">Pickup Location</label>
                <div className="flex items-center gap-3 border border-border rounded-xl p-3">
                  <MapPin size={16} className="text-primary" />
                  <input
                    type="text"
                    value={pickupLocation}
                    onChange={e => setPickupLocation(e.target.value)}
                    placeholder="Enter pickup location"
                    className="w-full border-none outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <aside className="bg-white border border-border rounded-[24px] p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-text-muted">Total days</p>
                <p className="text-2xl font-black">{pickupDate && returnDate ? Math.max(1, Math.ceil((new Date(returnDate).getTime() - new Date(pickupDate).getTime()) / (1000 * 60 * 60 * 24))) : '-'}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-text-muted">Deposit</p>
                <p className="text-lg font-black">Rs. {deposit.toLocaleString()}</p>
              </div>
            </div>
            <button onClick={handleContinue} className="w-full bg-primary text-white py-4 rounded-2xl font-bold hover:bg-primary-hover transition">
              Continue to Booking <ArrowRight size={18} />
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}
