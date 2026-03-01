"use client";

import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { CheckCircle2, MessageSquare, Phone, Send, Smartphone, User, XCircle } from "lucide-react";

export default function Home() {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [loadingQr, setLoadingQr] = useState<boolean>(true);

  const [university, setUniversity] = useState("generic");
  const [phone, setPhone] = useState("");
  const [sending, setSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const universities = [
    { id: "generic", name: "Generic / All Universities" },
    { id: "nust", name: "NUST" },
    { id: "fast", name: "FAST" },
    { id: "giki", name: "GIKI" },
    { id: "pieas", name: "PIEAS" },
    { id: "comsats", name: "COMSATS" },
    { id: "uet", name: "UET" },
    { id: "mehran", name: "Mehran" },
  ];

  const templates: Record<string, string> = {
    generic: `🎯 Preparing for NUST, FAST, GIKI, PIEAS, COMSATS, UET, NED or Mehran?

Try Examora – Pakistan’s smartest entry test prep platform.

✔ Real University-Specific Mock Tests  
✔ Full Exam Simulation  
✔ AI Progress Tracking  
✔ FREE Trial Available  

💰 Invite friends & earn 15% commision on each sale too!

👉 Start Free Trial: www.examora.io`,

    nust: `Preparing for NUST NET? 🇵🇰

Don’t practice random MCQs.
Prepare with Examora’s NUST-specific mocks & past paper simulations.

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

Get ready with Examora’s university-specific mock tests.

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

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  // Poll for QR code / connection status
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    let isSubscribed = true;

    const fetchStatus = async () => {
      try {
        const res = await fetch(`${API_URL}/api/qr`);
        if (!res.ok) throw new Error("Backend unavailable");
        const data = await res.json();

        if (!isSubscribed) return;

        setConnected(prev => {
          if (prev !== data.connected) return data.connected;
          return prev;
        });

        if (data.qr) {
          setQrCode(prev => prev !== data.qr ? data.qr : prev);
        } else if (data.connected) {
          setQrCode(null);
        }

      } catch (err) {
        // console.error("Failed to fetch WhatsApp status", err);
      } finally {
        if (isSubscribed) setLoadingQr(false);
      }
    };

    // Initial fetch
    fetchStatus();

    // Poll every 5 seconds if not connected
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
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ university, phone }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSendStatus({ success: true, message: "Template message sent successfully!" });
        setPhone("");
      } else {
        setSendStatus({ success: false, message: data.error || "Failed to send message." });
      }
    } catch (err) {
      setSendStatus({ success: false, message: "Network error occurred." });
    } finally {
      setSending(false);
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <main className="min-h-screen relative overflow-hidden flex flex-col items-center p-6 sm:p-12 space-y-12">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#fd5900]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#4285F4]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 z-10">

        {/* Left Column: Branding & Status */}
        <div className="flex flex-col space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              Examora <span className="text-[#fd5900]">WhatsApp</span>
            </h1>
            <p className="text-lg opacity-80 max-w-md font-rubik leading-relaxed">
              Targeted university prep delivered directly via WhatsApp. Connect and start dispatching.
            </p>
          </div>

          <div className="glass-card rounded-3xl p-8 relative overflow-hidden group hover:shadow-lg transition-all duration-500">
            <div className="absolute top-0 left-0 w-2 h-full bg-[#fd5900]" />

            <div className="flex items-center space-x-4 mb-8">
              <div className={`p-3 rounded-2xl ${connected ? 'bg-[#7DD9A5]/20 text-[#7DD9A5]' : 'bg-[#fd5900]/10 text-[#fd5900]'}`}>
                <Smartphone size={28} strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-xl font-bold">Device Connection</h2>
                <div className="flex items-center space-x-2 mt-1">
                  <div className={`w-2.5 h-2.5 rounded-full ${connected ? 'bg-[#7DD9A5] animate-pulse' : 'bg-[#FC951E]'}`} />
                  <span className="text-sm font-medium opacity-70">
                    {connected ? "Session Active" : "Waiting for QR Scan..."}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center min-h-[280px] bg-black/5 dark:bg-white/5 rounded-2xl p-6">
              {loadingQr ? (
                <div className="flex flex-col items-center space-y-4 animate-pulse">
                  <div className="w-48 h-48 bg-black/10 dark:bg-white/10 rounded-xl" />
                  <p className="text-sm font-medium opacity-60">Initializing connection...</p>
                </div>
              ) : connected ? (
                <div className="flex flex-col items-center space-y-4 text-center">
                  <div className="w-24 h-24 bg-[#7DD9A5]/20 rounded-full flex items-center justify-center text-[#7DD9A5] mb-2">
                    <CheckCircle2 size={48} strokeWidth={2.5} />
                  </div>
                  <h3 className="text-2xl font-bold text-[#7DD9A5]">Connected!</h3>
                  <p className="text-sm opacity-70 max-w-xs">
                    Your WhatsApp account is successfully linked. You can now send university-specific messages.
                  </p>
                </div>
              ) : qrCode ? (
                <div className="flex flex-col items-center space-y-6">
                  {qrCode.length > 2000 ? (
                    <div className="text-center p-4 bg-red-500/10 text-red-500 rounded-xl">
                      <p className="text-sm font-bold">QR Data Error</p>
                      <p className="text-xs opacity-70">The received QR data is too large to render. Please restart the backend.</p>
                    </div>
                  ) : (
                    <div className="p-4 bg-white rounded-2xl shadow-sm border border-black/5">
                      <QRCode value={qrCode} size={200} fgColor="#0A0A0A" />
                    </div>
                  )}
                  <p className="text-sm font-medium opacity-60 text-center">
                    Open WhatsApp &gt; Linked Devices &gt; Link a Device
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#FC951E]/20 text-[#FC951E] flex items-center justify-center mb-2">
                    <MessageSquare size={32} />
                  </div>
                  <p className="text-sm font-medium opacity-60">Generating QR Code...</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Send Message Form */}
        <div className="flex flex-col">
          <div className={`glass-card rounded-3xl p-8 h-full transition-all duration-500 ${!connected ? 'opacity-50 grayscale pointer-events-none' : ''}`}>

            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-2xl font-bold mb-2">Campaign Dispatch</h2>
                <p className="text-sm opacity-70 font-rubik">Deliver university-specific notifications.</p>
              </div>
              <div className="p-3 bg-[#4285F4]/10 text-[#4285F4] rounded-2xl">
                <Send size={24} strokeWidth={2} />
              </div>
            </div>

            <form onSubmit={handleSendMessage} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold ml-1">Target University</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-black/40 dark:text-white/40 group-focus-within:text-[#fd5900] transition-colors">
                    <Smartphone size={18} />
                  </div>
                  <select
                    required
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    className="w-full bg-black/5 dark:bg-white/5 border border-transparent focus:border-[#fd5900]/30 focus:bg-transparent rounded-2xl py-4 pl-12 pr-4 text-sm font-medium outline-none transition-all appearance-none cursor-pointer"
                  >
                    {universities.map((u) => (
                      <option key={u.id} value={u.id} className="bg-white dark:bg-[#121212]">
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold ml-1">Phone Number</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-black/40 dark:text-white/40 group-focus-within:text-[#fd5900] transition-colors">
                    <Phone size={18} />
                  </div>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-black/5 dark:bg-white/5 border border-transparent focus:border-[#fd5900]/30 focus:bg-transparent rounded-2xl py-4 pl-12 pr-4 text-sm font-medium outline-none transition-all placeholder:text-black/30 dark:placeholder:text-white/30"
                    placeholder="923001234567"
                  />
                </div>
                <p className="text-xs opacity-50 ml-1 mt-1">Include country code without '+', e.g., 923001234567</p>
              </div>

              {/* Readonly Template Preview */}
              <div className="p-5 bg-black/5 dark:bg-white/5 rounded-2xl border border-dashed border-black/10 dark:border-white/10 mt-6 relative">
                <div className="absolute -top-3 left-4 bg-[var(--background)] px-2 text-xs font-bold opacity-70">Message Preview</div>
                <p className="text-[11px] leading-relaxed font-rubik opacity-90 whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {templates[university as keyof typeof templates]}
                </p>
              </div>

              <button
                type="submit"
                disabled={sending || !connected}
                className="w-full mt-6 bg-[#fd5900] hover:bg-[#E04F00] text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 transition-all hover:shadow-lg hover:shadow-[#fd5900]/20 active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
              >
                {sending ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Dispatch Message</span>
                    <Send size={18} className="translate-x-0 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              {/* Status Messages */}
              {sendStatus && (
                <div className={`p-4 rounded-2xl flex items-start space-x-3 text-sm font-medium animate-in fade-in slide-in-from-bottom-2 ${sendStatus.success ? 'bg-[#7DD9A5]/10 text-[#7DD9A5]' : 'bg-[#E33C49]/10 text-[#E33C49]'
                  }`}>
                  {sendStatus.success ? <CheckCircle2 size={20} className="shrink-0" /> : <XCircle size={20} className="shrink-0" />}
                  <p>{sendStatus.message}</p>
                </div>
              )}

            </form>
          </div>
        </div>
      </div>

      {/* Template Library Section */}
      <div className="w-full max-w-5xl z-10">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">Template Library</h2>
            <p className="opacity-70 mt-1">Quickly browse and copy existing university campaign content.</p>
          </div>
          <div className="bg-[#fd5900]/10 text-[#fd5900] px-4 py-2 rounded-full text-sm font-bold">
            {universities.length} Templates
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {universities.map((uni) => (
            <div key={uni.id} className="glass-card rounded-2xl p-6 relative overflow-hidden group">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg uppercase tracking-wider">{uni.name}</h3>
                <button
                  onClick={() => copyToClipboard(uni.id, templates[uni.id])}
                  className={`p-2 rounded-xl transition-all ${copiedId === uni.id ? 'bg-[#7DD9A5] text-white' : 'bg-black/5 dark:bg-white/10 hover:bg-[#fd5900] hover:text-white'}`}
                >
                  {copiedId === uni.id ? <CheckCircle2 size={18} /> : <User size={18} />}
                </button>
              </div>
              <div className="bg-black/5 dark:bg-black/20 rounded-xl p-4 max-h-40 overflow-y-auto">
                <p className="text-xs leading-relaxed opacity-70 whitespace-pre-wrap">
                  {templates[uni.id]}
                </p>
              </div>
              {copiedId === uni.id && (
                <div className="absolute top-0 right-0 p-2 text-[10px] font-bold text-[#7DD9A5] animate-bounce">
                  COPIED!
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
