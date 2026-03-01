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
    <main className="min-h-screen bg-black text-white selection:bg-orange-500/30 font-sans antialiased">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 space-y-4 text-center lg:text-left">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl text-white">
            Examora <span className="text-orange-600">WhatsApp</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl">
            Deliver targeted university prep directly via WhatsApp. Connect instantly and dispatch your campaigns.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid gap-8 lg:grid-cols-2 mb-20">
          {/* Left Column: Connection Status */}
          <div className="space-y-6">
            <div className="bg-zinc-950 border border-zinc-800 p-8 rounded shadow-2xl">
              <div className="mb-8 flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold">Device Connection</h2>
                  <div className="flex items-center gap-2">
                    <div className={`h-2.5 w-2.5 rounded-full ${connected ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]'}`} />
                    <span className="text-sm font-medium text-zinc-400">
                      {connected ? 'Session Active' : 'Waiting for QR Scan...'}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded border border-zinc-800 ${connected ? 'text-green-500 bg-green-500/5' : 'text-orange-600 bg-orange-600/5'}`}>
                  <Smartphone className="h-6 w-6" />
                </div>
              </div>

              <div className="flex min-h-[320px] flex-col items-center justify-center rounded border border-zinc-800 bg-black p-8 relative overflow-hidden group">
                {/* Subtle Grid Background */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

                {loadingQr ? (
                  <div className="flex flex-col items-center gap-6 z-10">
                    <div className="h-48 w-48 animate-pulse rounded bg-zinc-900 border border-zinc-800" />
                    <p className="text-sm text-zinc-500 font-medium">Initializing connection...</p>
                  </div>
                ) : connected ? (
                  <div className="flex flex-col items-center gap-6 text-center z-10">
                    <div className="rounded-full bg-green-500/10 border border-green-500/20 p-6 animate-in zoom-in-50 duration-500">
                      <CheckCircle2 className="h-16 w-16 text-green-500" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-white">Connected!</h3>
                      <p className="max-w-xs text-sm text-zinc-400 font-medium">
                        Your WhatsApp account is ready. You can now send campaigns.
                      </p>
                    </div>
                  </div>
                ) : qrCode ? (
                  <div className="flex flex-col items-center gap-6 z-10">
                    {qrCode.length > 2000 ? (
                      <div className="bg-red-500/5 border border-red-500/20 p-4 rounded text-red-500 flex items-center gap-3">
                        <AlertCircle className="h-5 w-5" />
                        <p className="text-sm font-bold">QR data too large. Restart backend.</p>
                      </div>
                    ) : (
                      <>
                        <div className="rounded bg-white p-6 shadow-[0_0_50px_rgba(255,255,255,0.05)] border border-white/10 group-hover:scale-[1.02] transition-transform duration-500">
                          <QRCode value={qrCode} size={220} />
                        </div>
                        <p className="text-xs text-zinc-500 font-medium tracking-wide uppercase">
                          Scan with WhatsApp on your phone
                        </p>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-6 text-center z-10">
                    <div className="rounded-full bg-orange-600/10 border border-orange-600/20 p-6">
                      <MessageSquare className="h-8 w-8 text-orange-600" />
                    </div>
                    <p className="text-sm text-zinc-500 font-medium uppercase tracking-widest">Generating QR code...</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Send Form */}
          <div className="space-y-6">
            <div className={`bg-zinc-950 border transition-all duration-700 rounded shadow-2xl p-8 ${connected ? 'border-zinc-800 ring-1 ring-orange-600/10' : 'border-zinc-900 opacity-50'}`}>
              <div className="mb-8 flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold">Campaign Dispatch</h2>
                  <p className="text-sm text-zinc-400 font-medium">Deploy university-specific content</p>
                </div>
                <div className="p-3 rounded border border-zinc-800 text-orange-600 bg-orange-600/5">
                  <Send className="h-6 w-6" />
                </div>
              </div>

              <form onSubmit={handleSendMessage} className="space-y-8">
                <div className="space-y-3">
                  <label htmlFor="university" className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">
                    Target University
                  </label>
                  <div className="relative group">
                    <select
                      id="university"
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                      disabled={!connected}
                      className="w-full bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 rounded p-4 text-base appearance-none focus:outline-none focus:border-orange-600/50 focus:ring-1 focus:ring-orange-600/20 transition-all font-medium text-white"
                    >
                      {universities.map((u) => (
                        <option key={u.id} value={u.id} className="bg-zinc-950 text-white">
                          {u.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500 pointer-events-none group-focus-within:text-orange-600 transition-colors" />
                  </div>
                </div>

                <div className="space-y-3">
                  <label htmlFor="phone" className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="923001234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={!connected}
                    className="w-full bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 rounded p-4 text-base focus:outline-none focus:border-orange-600/50 focus:ring-1 focus:ring-orange-600/20 transition-all placeholder:text-zinc-700 font-sans font-medium text-white"
                    required
                  />
                  <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-tight px-1">Format: Country code + Number</p>
                </div>

                {/* Template Preview */}
                <div className="rounded border border-zinc-800 bg-black p-5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 h-1 w-20 bg-orange-600/20 rounded-bl" />
                  <p className="mb-3 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Message Preview</p>
                  <p className="text-xs leading-relaxed text-zinc-300 font-medium whitespace-pre-wrap line-clamp-[8]">
                    {templates[university as keyof typeof templates]}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={sending || !connected}
                  className="w-full h-14 text-sm font-bold uppercase tracking-widest bg-orange-600 hover:bg-orange-700 text-white rounded flex items-center justify-center transition-all duration-300 active:scale-[0.98] disabled:opacity-30 disabled:hover:bg-orange-600 disabled:cursor-not-allowed shadow-[0_10px_30px_rgba(234,88,12,0.15)]"
                >
                  {sending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Dispatching...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Dispatch Campaign
                    </>
                  )}
                </button>

                {sendStatus && (
                  <div className={`p-4 rounded border flex items-center gap-4 animate-in slide-in-from-top-2 duration-300 ${sendStatus.success ? 'bg-green-500/5 border-green-500/20 text-green-500' : 'bg-red-500/5 border-red-500/20 text-red-500'}`}>
                    {sendStatus.success ? (
                      <CheckCircle2 className="h-5 w-5 shrink-0" />
                    ) : (
                      <AlertCircle className="h-5 w-5 shrink-0" />
                    )}
                    <p className="text-sm font-bold">{sendStatus.message}</p>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Template Library */}
        <div className="space-y-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-zinc-900 pb-10">
            <div className="space-y-1">
              <h2 className="text-4xl font-bold">Template Library</h2>
              <p className="text-zinc-500 uppercase tracking-tighter text-sm font-bold">University Campaign Directory</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 text-white px-4 py-1.5 rounded text-xs font-bold uppercase tracking-widest">
              {universities.length} Templates
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {universities.map((uni) => (
              <div key={uni.id} className="bg-zinc-950 border border-zinc-900 p-6 rounded hover:border-zinc-700 transition-all duration-500 group relative">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex flex-col">
                    <h3 className="font-black uppercase tracking-tight text-white mb-1">{uni.name}</h3>
                    <div className="h-0.5 w-8 bg-orange-600/30 group-hover:w-full transition-all duration-700" />
                  </div>
                  <button
                    onClick={() => copyToClipboard(uni.id, templates[uni.id])}
                    className={`p-2 rounded flex items-center justify-center transition-all duration-300 border ${copiedId === uni.id ? 'bg-green-600 border-green-600 text-white' : 'border-zinc-800 text-zinc-500 hover:border-zinc-500 hover:text-white bg-black'}`}
                  >
                    {copiedId === uni.id ? (
                      <Check className="h-4 w-4 animate-in zoom-in-50" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <div className="max-h-40 overflow-y-auto rounded bg-black border border-zinc-900 p-4 scrollbar-hide">
                  <p className="text-xs leading-[1.8] text-zinc-400 font-medium whitespace-pre-wrap">
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
