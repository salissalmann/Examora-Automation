'use client';

import { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { CheckCircle2, Loader2, AlertCircle, Copy, Check, Smartphone, Send, MessageSquare, ChevronDown } from 'lucide-react';

const universities = [
  { id: 'generic', name: 'Generic / All Universities' },
  { id: 'nust', name: 'NUST' },
  { id: 'fast', name: 'FAST' },
  { id: 'giki', name: 'GIKI' },
  { id: 'pieas', name: 'PIEAS' },
  { id: 'comsats', name: 'COMSATS' },
  { id: 'uet', name: 'UET' },
  { id: 'mehran', name: 'Mehran' },
];

const templates: Record<string, string> = {
  generic: `🎯 Preparing for NUST, FAST, GIKI, PIEAS, COMSATS, UET, NED or Mehran?

Try Examora – Pakistan's smartest entry test prep platform.

✔ Real University-Specific Mock Tests  
✔ Full Exam Simulation  
✔ AI Progress Tracking  
✔ FREE Trial Available  

💰 Invite friends & earn 15% commision on each sale too!

👉 Start Free Trial: www.examora.io`,

  nust: `Preparing for NUST NET? 🇵🇰

Don't practice random MCQs.
Prepare with Examora's NUST-specific mocks & past paper simulations.

✔ Real NUST Pattern Tests  
✔ Topic-wise Practice  
✔ FREE Trial  

💰 Invite friends & earn 15% commision on each sale too!

Start now → www.examora.io`,

  fast: `FAST entry test is all about speed + accuracy.

Practice FAST-style math & IQ tests on Examora.

✔ FAST Pattern Mocks  
✔ Real Exam Simulation  
✔ FREE Trial  

💰 Invite friends & earn 15% commision on each sale too!

Try now → www.examora.io`,

  giki: `Targeting GIKI this year?

Prepare with GIKI-style conceptual MCQs on Examora.

✔ Real Past Paper Simulation  
✔ Topic-wise Practice  
✔ FREE Trial  

💰 Invite friends & earn 15% commision on each sale too!

Start → www.examora.io`,

  pieas: `PIEAS entry test needs strong concepts.

Examora helps you prepare with real PIEAS-level questions.

✔ Exam Simulation Mode  
✔ Weak Area Analytics  
✔ FREE Trial  

💰 Invite friends & earn 15% commision on each sale too!

Join → www.examora.io`,

  comsats: `Preparing for COMSATS? 🎯

Get ready with Examora's university-specific mock tests.

✔ Real Exam Simulation  
✔ Topic-wise Practice  
✔ FREE Trial Available  

💰 Invite friends & earn 15% commision on each sale too!

Start here → www.examora.io`,

  uet: `Targeting UET ECAT? 🇵🇰

Practice with UET-specific mocks and simulations on Examora.

✔ Real Pattern Tests  
✔ AI Progress Tracking  
✔ FREE Trial  

💰 Invite friends & earn 15% commision on each sale too!

Try now → www.examora.io`,

  mehran: `Preparing for Mehran University? 🎯

Practice with university-level MCQs on Examora.

✔ Real Exam Simulation  
✔ Weak Area Analysis  
✔ FREE Trial  

💰 Invite friends & earn 15% commision on each sale too!

Join → www.examora.io`
};

export default function Home() {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [loadingQr, setLoadingQr] = useState(true);
  const [university, setUniversity] = useState('generic');
  const [phone, setPhone] = useState('');
  const [sending, setSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    let isSubscribed = true;

    const fetchStatus = async () => {
      try {
        const res = await fetch(`${API_URL}/api/qr`);
        if (!res.ok) throw new Error('Backend unavailable');
        const data = await res.json();

        if (!isSubscribed) return;

        setConnected(data.connected);
        if (data.qr) {
          setQrCode(data.qr);
        } else if (data.connected) {
          setQrCode(null);
        }
      } catch (err) {
        // Silent error handling
      } finally {
        if (isSubscribed) setLoadingQr(false);
      }
    };

    fetchStatus();
    if (!connected) {
      interval = setInterval(fetchStatus, 5000);
    }

    return () => {
      isSubscribed = false;
      if (interval) clearInterval(interval);
    };
  }, [connected, API_URL]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!university || !phone) return;

    setSending(true);
    setSendStatus(null);

    try {
      const res = await fetch(`${API_URL}/api/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ university, phone }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSendStatus({ success: true, message: 'Message sent successfully!' });
        setPhone('');
      } else {
        setSendStatus({ success: false, message: data.error || 'Failed to send message.' });
      }
    } catch (err) {
      setSendStatus({ success: false, message: 'Network error occurred.' });
    } finally {
      setSending(false);
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 font-sans">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 space-y-2">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Examora <span className="text-orange-600">WhatsApp</span>
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400">
            Send targeted university prep messages via WhatsApp. Connect your device and dispatch campaigns instantly.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid gap-8 lg:grid-cols-2 mb-12">
          {/* Left Column: Connection Status */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 border-2 border-orange-600/20 p-6 rounded shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold">Device Connection</h2>
                  <div className="flex items-center gap-2">
                    <div className={`h-2.5 w-2.5 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-orange-500'}`} />
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {connected ? 'Session Active' : 'Waiting for QR Scan...'}
                    </span>
                  </div>
                </div>
                <Smartphone className={`h-6 w-6 ${connected ? 'text-green-500' : 'text-orange-600'}`} />
              </div>

              <div className="flex min-h-[280px] flex-col items-center justify-center rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-6">
                {loadingQr ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-48 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                    <p className="text-sm text-slate-500 dark:text-slate-400">Initializing connection...</p>
                  </div>
                ) : connected ? (
                  <div className="flex flex-col items-center gap-4 text-center">
                    <div className="rounded-full bg-green-100 p-4 dark:bg-green-950">
                      <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-xl font-bold text-green-600 dark:text-green-400">Connected!</h3>
                    <p className="max-w-xs text-sm text-slate-500 dark:text-slate-400">
                      Your WhatsApp account is ready. You can now send campaigns.
                    </p>
                  </div>
                ) : qrCode ? (
                  <div className="flex flex-col items-center gap-4">
                    {qrCode.length > 2000 ? (
                      <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 p-4 rounded text-red-600 dark:text-red-400 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        <p className="text-sm">QR code data too large. Please restart the backend.</p>
                      </div>
                    ) : (
                      <>
                        <div className="rounded bg-white p-4 shadow-lg dark:bg-slate-800">
                          <QRCode value={qrCode} size={200} />
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                          Open WhatsApp → Linked Devices → Link a Device
                        </p>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4 text-center">
                    <div className="rounded-full bg-orange-100 dark:bg-orange-950/30 p-4">
                      <MessageSquare className="h-8 w-8 text-orange-600" />
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Generating QR code...</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Send Form */}
          <div className="space-y-6">
            <div className={`bg-white dark:bg-slate-900 border-2 transition-all rounded shadow-sm ${connected ? 'border-orange-600/20 p-6' : 'border-slate-200 dark:border-slate-800 p-6 opacity-50'}`}>
              <div className="mb-6 flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold">Campaign Dispatch</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Send university-specific messages</p>
                </div>
                <Send className="h-6 w-6 text-orange-600" />
              </div>

              <form onSubmit={handleSendMessage} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="university" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Target University
                  </label>
                  <div className="relative">
                    <select
                      id="university"
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                      disabled={!connected}
                      className="w-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded p-2.5 text-base appearance-none focus:outline-none focus:border-orange-600/50"
                    >
                      {universities.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="923001234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={!connected}
                    className="w-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded p-2.5 text-base focus:outline-none focus:border-orange-600/50"
                    required
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400">Format: country code + number (e.g., 923001234567)</p>
                </div>

                {/* Template Preview */}
                <div className="rounded border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4">
                  <p className="mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400">MESSAGE PREVIEW</p>
                  <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap line-clamp-6">
                    {templates[university as keyof typeof templates]}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={sending || !connected}
                  className="w-full h-12 text-base font-semibold bg-orange-600 hover:bg-orange-700 text-white rounded flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Dispatch Message
                    </>
                  )}
                </button>

                {sendStatus && (
                  <div className={`p-4 rounded border flex items-center gap-3 ${sendStatus.success ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800 text-green-800 dark:text-green-200' : 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800 text-red-800 dark:text-red-200'}`}>
                    {sendStatus.success ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                    ) : (
                      <AlertCircle className="h-4 w-4 shrink-0" />
                    )}
                    <p className="text-sm">{sendStatus.message}</p>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Template Library */}
        <div className="space-y-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl font-bold">Template Library</h2>
              <p className="mt-1 text-slate-500 dark:text-slate-400">Browse and copy university campaign messages</p>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-3 py-1 rounded text-sm font-medium w-fit">
              {universities.length} Templates
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {universities.map((uni) => (
              <div key={uni.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded hover:border-orange-600/30 transition-colors shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-bold uppercase tracking-wider text-sm">{uni.name}</h3>
                  <button
                    onClick={() => copyToClipboard(uni.id, templates[uni.id])}
                    className={`px-3 py-1 rounded flex items-center gap-1.5 transition-all text-xs font-medium border ${copiedId === uni.id ? 'bg-green-600 border-green-600 text-white' : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                  >
                    {copiedId === uni.id ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <div className="max-h-32 overflow-y-auto rounded bg-slate-50 dark:bg-slate-950 p-3 border border-slate-100 dark:border-slate-800">
                  <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                    {templates[uni.id]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
