'use client';

import { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import {
  CheckCircle2,
  Loader2,
  AlertCircle,
  Copy,
  Check,
  Smartphone,
  Send,
  MessageSquare
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30 font-sans antialiased">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 space-y-4 text-center lg:text-left">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl">
            Examora <span className="text-primary">WhatsApp</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Deliver targeted university prep directly via WhatsApp. Connect instantly and dispatch your campaigns.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid gap-8 lg:grid-cols-2 mb-20">
          {/* Left Column: Connection Status */}
          <div className="space-y-6">
            <Card className="border-border bg-card/50 p-8 shadow-2xl">
              <div className="mb-8 flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-2xl">Device Connection</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${connected ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]'}`} />
                    <span className="text-sm font-medium text-muted-foreground">
                      {connected ? 'Session Active' : 'Waiting for QR Scan...'}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-md border border-border ${connected ? 'text-green-500 bg-green-500/5' : 'text-primary bg-primary/5'}`}>
                  <Smartphone className="h-6 w-6" />
                </div>
              </div>

              <div className="flex min-h-[320px] flex-col items-center justify-center rounded-md border border-border bg-black p-8 relative overflow-hidden group">
                {/* Subtle Grid Background */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

                {loadingQr ? (
                  <div className="flex flex-col items-center gap-6 z-10">
                    <div className="h-48 w-48 animate-pulse rounded-md bg-muted border border-border" />
                    <p className="text-sm text-muted-foreground font-medium">Initializing connection...</p>
                  </div>
                ) : connected ? (
                  <div className="flex flex-col items-center gap-6 text-center z-10">
                    <div className="rounded-full bg-green-500/10 border border-green-500/20 p-6 animate-in zoom-in-50 duration-500">
                      <CheckCircle2 className="h-16 w-16 text-green-500" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold">Connected!</h3>
                      <p className="max-w-xs text-sm text-muted-foreground font-medium">
                        Your WhatsApp account is ready. You can now send campaigns.
                      </p>
                    </div>
                  </div>
                ) : qrCode ? (
                  <div className="flex flex-col items-center gap-6 z-10">
                    {qrCode.length > 2000 ? (
                      <Alert variant="destructive" className="bg-destructive/5 border-destructive/20 max-w-xs">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="font-bold">
                          QR data too large. Restart backend.
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <>
                        <div className="rounded-md bg-white p-6 shadow-2xl border border-white/10 group-hover:scale-[1.02] transition-transform duration-500">
                          <QRCode value={qrCode} size={220} />
                        </div>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">
                          Scan with WhatsApp
                        </p>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-6 text-center z-10">
                    <div className="rounded-full bg-primary/10 border border-primary/20 p-6">
                      <MessageSquare className="h-8 w-8 text-primary" />
                    </div>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.3em]">Generating QR...</p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Right Column: Send Form */}
          <div className="space-y-6">
            <Card className={`border-border transition-all duration-700 bg-card p-8 shadow-2xl ${connected ? 'ring-1 ring-primary/10' : 'opacity-50'}`}>
              <div className="mb-8 flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-2xl">Campaign Dispatch</CardTitle>
                  <CardDescription>Deploy university-specific content</CardDescription>
                </div>
                <div className="p-3 rounded-md border border-border text-primary bg-primary/5">
                  <Send className="h-6 w-6" />
                </div>
              </div>

              <form onSubmit={handleSendMessage} className="space-y-8">
                <div className="space-y-3">
                  <Label htmlFor="university" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">
                    Target University
                  </Label>
                  <Select value={university} onValueChange={setUniversity} disabled={!connected}>
                    <SelectTrigger className="h-12 border-border bg-background/50 text-base font-medium">
                      <SelectValue placeholder="Select University" />
                    </SelectTrigger>
                    <SelectContent>
                      {universities.map((u) => (
                        <SelectItem key={u.id} value={u.id}>
                          {u.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="phone" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="923001234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={!connected}
                    className="h-12 border-border bg-background/50 text-base focus-visible:ring-primary/20 font-medium"
                    required
                  />
                  <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-tight px-1">Format: Country code + Number</p>
                </div>

                {/* Template Preview */}
                <div className="rounded-md border border-border bg-black/40 p-5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 h-1 w-20 bg-primary/20 rounded-bl-md" />
                  <p className="mb-3 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Message Preview</p>
                  <p className="text-xs leading-relaxed text-zinc-300 font-medium whitespace-pre-wrap line-clamp-[8]">
                    {templates[university as keyof typeof templates]}
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={sending || !connected}
                  size="lg"
                  className="w-full h-14 text-sm font-bold uppercase tracking-widest transition-all duration-300 active:scale-[0.98] shadow-lg shadow-primary/20"
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
                </Button>

                {sendStatus && (
                  <Alert variant={sendStatus.success ? 'default' : 'destructive'} className={sendStatus.success ? 'bg-green-500/5 border-green-500/20 text-green-500' : ''}>
                    {sendStatus.success ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <AlertCircle className="h-5 w-5" />
                    )}
                    <AlertDescription className="font-bold text-sm">
                      {sendStatus.message}
                    </AlertDescription>
                  </Alert>
                )}
              </form>
            </Card>
          </div>
        </div>

        {/* Template Library */}
        <div className="space-y-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-border pb-12">
            <div className="space-y-1">
              <h2 className="text-4xl font-bold">Template Library</h2>
              <p className="text-muted-foreground uppercase tracking-[0.2em] text-[10px] font-black">University Campaign Directory</p>
            </div>
            <Badge variant="secondary" className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest">
              {universities.length} Templates
            </Badge>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {universities.map((uni) => (
              <Card key={uni.id} className="bg-card/30 border-border p-6 hover:border-muted-foreground/30 transition-all duration-500 group relative shadow-lg">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex flex-col">
                    <h3 className="font-black uppercase tracking-tight text-sm">{uni.name}</h3>
                    <div className="h-0.5 w-8 bg-primary/30 group-hover:w-full transition-all duration-700" />
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(uni.id, templates[uni.id])}
                    className={`h-9 w-9 border-border transition-all duration-300 ${copiedId === uni.id ? 'bg-green-600 border-green-600 text-white' : 'bg-black/50 hover:border-muted-foreground'}`}
                  >
                    {copiedId === uni.id ? (
                      <Check className="h-4 w-4 animate-in zoom-in-50" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <div className="max-h-40 overflow-y-auto rounded-md bg-black border border-border p-4 scrollbar-hide shadow-inner">
                  <p className="text-xs leading-[1.8] text-zinc-400 font-medium whitespace-pre-wrap">
                    {templates[uni.id]}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
