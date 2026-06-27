"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Upload, FileText, User, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';

const provinces = [
  'Province No. 1', 'Province No. 2', 'Bagmati', 'Gandaki', 'Lumbini', 'Karnali', 'Sudurpaschim'
];

export default function KYCPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Personal info
  const [fullName, setFullName] = useState('');
  const [dobAd, setDobAd] = useState('');
  const [dobBs, setDobBs] = useState('');
  const [gender, setGender] = useState('');
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [municipality, setMunicipality] = useState('');
  const [ward, setWard] = useState('');
  const [street, setStreet] = useState('');

  // Documents
  const [idFile, setIdFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);

  const next = () => setStep((s) => Math.min(3, s + 1));
  const prev = () => setStep((s) => Math.max(1, s - 1));

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    // simulate upload / submission
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    setSubmitted(true);
    setTimeout(() => router.push('/history'), 1200);
  };

  if (submitted) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center gap-6">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center shadow-xl shadow-green-500/20">
          <CheckCircle2 size={48} />
        </motion.div>
        <h1 className="text-3xl font-black">KYC Submitted</h1>
        <p className="text-text-muted max-w-md">Thanks — your documents have been received. We will review and verify your account shortly.</p>
      </div>
    );
  }

  return (
    <div className="py-10">
      <div className="max-w-[900px] mx-auto bg-white border border-border rounded-[20px] p-8 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xs font-bold text-text-muted uppercase tracking-[3px]">साझा Share</h2>
            <h1 className="text-2xl font-black">KYC Verification</h1>
            <p className="text-text-muted mt-1">Complete verification to start renting</p>
          </div>
          <div className="rounded-md bg-surface border border-border p-2">
            <Calendar size={18} />
          </div>
        </div>

        {/* Stepper */}
        <div className="flex items-center gap-6 mb-8">
          {[1,2,3].map((n) => (
            <div key={n} className="flex-1">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 flex items-center justify-center rounded-full ${step===n ? 'bg-primary text-white' : 'bg-gray-100 text-text-muted'}`}>{n}</div>
                <div className="text-sm font-bold text-text-muted">{n===1 ? 'Personal Info' : n===2 ? 'Documents' : 'Verification'}</div>
              </div>
              {n < 3 && <div className="h-1 bg-border mt-3" />}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="">
          {step === 1 && (
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-bold text-text-muted mb-2">Full Name (as per document)</label>
                <input value={fullName} onChange={e => setFullName(e.target.value)} className="w-full border border-border p-3 rounded" placeholder="E.g., Ram Bahadur Thapa" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-text-muted mb-2">Date of Birth (AD)</label>
                  <input type="date" value={dobAd} onChange={e => setDobAd(e.target.value)} className="w-full border border-border p-3 rounded" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text-muted mb-2">Date of Birth (BS)</label>
                  <input value={dobBs} onChange={e => setDobBs(e.target.value)} className="w-full border border-border p-3 rounded" placeholder="E.g., 2055-05-15" required />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-text-muted mb-2">Gender</label>
                  <select value={gender} onChange={e => setGender(e.target.value)} className="w-full border border-border p-3 rounded" required>
                    <option value="">Select...</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-text-muted mb-2">Province</label>
                  <select value={province} onChange={e => setProvince(e.target.value)} className="w-full border border-border p-3 rounded" required>
                    <option value="">Select...</option>
                    {provinces.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-text-muted mb-2">District</label>
                  <input value={district} onChange={e => setDistrict(e.target.value)} className="w-full border border-border p-3 rounded" placeholder="E.g., Kathmandu" required />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <input value={municipality} onChange={e => setMunicipality(e.target.value)} className="border border-border p-3 rounded" placeholder="Municipality" required />
                <input value={ward} onChange={e => setWard(e.target.value)} className="border border-border p-3 rounded" placeholder="Ward No." required />
                <input value={street} onChange={e => setStreet(e.target.value)} className="border border-border p-3 rounded" placeholder="Tole / Street" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-bold text-text-muted mb-2">Upload ID Document</label>
                <label className="border border-dashed border-border rounded-3xl p-6 flex items-center gap-4 cursor-pointer">
                  <Upload />
                  <input type="file" className="hidden" onChange={e => setIdFile(e.target.files?.[0] ?? null)} />
                  <div>
                    <div className="font-bold">Click to upload</div>
                    <div className="text-sm text-text-muted">JPG, PNG or PDF (Max 5MB)</div>
                  </div>
                  {idFile && <div className="ml-auto text-sm text-primary">{idFile.name}</div>}
                </label>
              </div>

              <div>
                <label className="block text-sm font-bold text-text-muted mb-2">Upload Selfie with Document</label>
                <label className="border border-dashed border-border rounded-3xl p-6 flex items-center gap-4 cursor-pointer">
                  <FileText />
                  <input type="file" className="hidden" onChange={e => setSelfieFile(e.target.files?.[0] ?? null)} />
                  <div>
                    <div className="font-bold">Click to upload selfie</div>
                    <div className="text-sm text-text-muted">Hold your ID next to your face.</div>
                  </div>
                  {selfieFile && <div className="ml-auto text-sm text-primary">{selfieFile.name}</div>}
                </label>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 className="text-lg font-black mb-3">Verification</h3>
              <p className="text-text-muted mb-4">Please review your details before submitting. Our team will verify and approve your account.</p>

              <div className="bg-surface border border-border rounded p-4 mb-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm text-text-muted">Full Name</div>
                  <div className="font-bold">{fullName || '-'}</div>
                  <div className="text-sm text-text-muted">DOB (AD)</div>
                  <div className="font-bold">{dobAd || '-'}</div>
                  <div className="text-sm text-text-muted">Province / District</div>
                  <div className="font-bold">{province} / {district}</div>
                  <div className="text-sm text-text-muted">Document</div>
                  <div className="font-bold">{idFile ? idFile.name : '-'}</div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between mt-6">
            <div>
              {step > 1 && (
                <button type="button" onClick={prev} className="border border-border px-6 py-2 rounded">Back</button>
              )}
            </div>
            <div className="flex items-center gap-3">
              {step < 3 && (
                <button type="button" onClick={next} className="bg-primary text-white px-6 py-3 rounded-2xl font-bold">Next</button>
              )}
              {step === 3 && (
                <button type="submit" disabled={loading} className="bg-primary text-white px-6 py-3 rounded-2xl font-bold">{loading ? 'Submitting…' : 'Submit for Verification'}</button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
