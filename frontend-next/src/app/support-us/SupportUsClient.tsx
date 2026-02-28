'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Check, Copy } from 'lucide-react';

function CopyField({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success(`${label} copied!`, { icon: '📋', duration: 2000 });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Could not copy. Please select and copy manually.');
    }
  };

  return (
    <motion.div whileHover={{ scale: 1.01 }} onClick={handleCopy} className={`flex items-center justify-between gap-3 py-3 px-4 rounded-xl border cursor-pointer transition-all select-none ${highlight ? 'bg-gradient-to-r from-emerald-900/40 to-teal-900/40 border-emerald-500/40 hover:border-emerald-400/70' : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-purple-400/40'}`}>
      <div className="min-w-0 flex-1">
        <p className={`text-xs mb-0.5 font-medium ${highlight ? 'text-emerald-400' : 'text-gray-400'}`}>{label}</p>
        <p className={`font-bold text-sm break-all ${highlight ? 'text-emerald-200 text-base' : 'text-white'}`}>{value}</p>
      </div>
      <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all ${copied ? 'bg-green-500/30' : highlight ? 'bg-emerald-500/20' : 'bg-white/10'}`}>
        {copied ? (
          <Check className="w-4 h-4 text-green-400" strokeWidth={2.5} />
        ) : (
          <Copy className="w-4 h-4 text-gray-300" />
        )}
      </div>
    </motion.div>
  );
}

const bankAccounts = [
  { label: 'Account 1 — Savings', accountNumber: '001020613595', accountHolder: 'Nawarathna Mudiyanselage Sahan Vindula Nawarathne', bank: 'Dialog Finance PLC', branch: 'Head Office' },
  { label: 'Account 2 — HNB', accountNumber: '066020144508', accountHolder: 'N.M.S.V.Nawarathne', bank: 'Hatton National Bank (HNB)', branch: 'Rambukkana' },
];

const stats = [
  { value: '100%', label: 'Free — Always' },
  { value: '0$', label: 'No hidden fees' },
  { value: '∞', label: 'CVs built' },
  { value: '1', label: 'Developer, with love' },
];

const otherWays = [
  { icon: '🌟', title: 'Star on GitHub', desc: 'Give a star to show your love and help others discover us.' },
  { icon: '📢', title: 'Spread the Word', desc: "Tell a friend who is job hunting. One share can change someone's life." },
  { icon: '💬', title: 'Leave a Review', desc: 'Write how Ezy CV helped you — your words mean everything to us.' },
  { icon: '🐞', title: 'Report Bugs', desc: 'Found something broken? Tell us! You help make EzyCV better for everyone.' },
];

export default function SupportUsClient() {
  const [heartbeat, setHeartbeat] = useState(false);

  useEffect(() => {
    const iv = setInterval(() => { setHeartbeat(true); setTimeout(() => setHeartbeat(false), 300); }, 1800);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-20 pb-16 text-center">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-700/20 rounded-full blur-3xl" />
        </div>
        <motion.div animate={{ scale: heartbeat ? 1.35 : 1 }} transition={{ duration: 0.2 }} className="inline-block mb-6 text-7xl">❤️</motion.div>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-300 bg-clip-text text-transparent leading-tight">
          Built with love.<br /><span className="text-3xl md:text-5xl">Kept alive by people like you.</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-gray-300 text-lg max-w-2xl mx-auto mb-10">
          Ezy CV is <strong className="text-white">100% free</strong> — no subscriptions, no premium tiers. Just one developer who believes every job-seeker deserves a great CV.
        </motion.p>
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          {stats.map(s => (
            <div key={s.label} className="text-center px-4">
              <div className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{s.value}</div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#bank-transfer" className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl text-lg shadow-lg hover:scale-105 transition-all">🏦 Donate via Bank Transfer</a>
          <a href="#payment-gateway" className="px-8 py-4 bg-white/10 border border-white/20 text-white font-bold rounded-2xl text-lg hover:bg-white/20 transition-all">💳 Online Payment (Soon)</a>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl">👨‍💻</div>
            <div><p className="text-white font-bold text-lg">Sahan Nawarathne</p><p className="text-purple-300 text-sm">Founder &amp; Solo Developer</p></div>
          </div>
          <div className="space-y-4 text-gray-300 leading-relaxed">
            <p>Hey, I&apos;m Sahan. I built Ezy CV from my bedroom — no funding, no team, just a laptop and a dream that <em>everyone</em> deserves a professional CV without paying for it.</p>
            <p>Every feature you see was designed and coded by <strong className="text-white">one person</strong>. Evenings, weekends, countless cups of tea.</p>
            <p>But servers cost money. APIs cost money. The domain you type into your browser costs money.</p>
            <p className="text-white font-semibold text-lg border-l-4 border-purple-500 pl-4">&quot;If Ezy CV helped you — please consider buying me a cup of tea. 🍵&quot;</p>
            <p>Thank you for being here. Truly. 🙏</p>
          </div>
        </div>
      </section>

      {/* What your support does */}
      <section className="max-w-5xl mx-auto px-4 py-8">
        <h2 className="text-center text-3xl font-bold mb-10">Your support keeps this alive 🕯️</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: '🌐', title: 'Server Costs', desc: 'Hosting the app so thousands can use it 24/7.' },
            { icon: '📦', title: 'Storage & CDN', desc: 'Storing thousands of wallpapers and delivering them fast.' },
            { icon: '📬', title: 'Email Service', desc: 'Sending password resets and welcome emails.' },
            { icon: '🛡️', title: 'Security & SSL', desc: 'Keeping your data secure with proper certificates.' },
            { icon: '🚀', title: 'New Features', desc: 'More templates, backgrounds, and tools — all free.' },
            { icon: '☕', title: 'Developer Fuel', desc: 'An occasional cup of tea to keep the code flowing.' },
          ].map((item, i) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-purple-400/30 transition-all">
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="text-white font-semibold mb-1">{item.title}</h3>
              <p className="text-gray-400 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Payment Gateway Coming Soon */}
      <section id="payment-gateway" className="max-w-2xl mx-auto px-4 py-12 scroll-mt-24">
        <div className="rounded-3xl border border-dashed border-blue-400/40 bg-gradient-to-br from-slate-900/80 to-indigo-950/60 p-8 text-center backdrop-blur-sm">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-400/30 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 uppercase">Coming Soon</div>
          <h2 className="text-2xl font-extrabold text-white mb-3">Online Payment Gateway</h2>
          <p className="text-gray-300 mb-6">We&apos;re integrating <strong className="text-white">PayHere</strong> — Sri Lanka&apos;s most trusted payment gateway — so you can donate instantly.</p>
          <div className="max-w-xs mx-auto mb-6">
            <div className="flex justify-between text-xs text-gray-400 mb-1.5"><span>Progress</span><span className="text-blue-400 font-semibold">In Development</span></div>
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} whileInView={{ width: '60%' }} transition={{ duration: 1.5, delay: 0.3 }} className="h-full bg-gradient-to-r from-blue-500 to-indigo-400 rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Bank Transfer */}
      <section id="bank-transfer" className="max-w-2xl mx-auto px-4 py-8 scroll-mt-24">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse inline-block" /> Available Now
          </div>
          <h2 className="text-4xl font-extrabold text-white mb-3">Bank Transfer</h2>
          <p className="text-gray-400 max-w-sm mx-auto">Transfer directly to either account. Tap any row to copy.</p>
        </div>

        <div className="space-y-8">
          {bankAccounts.map((acc, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.12 }} className="relative group">
              <div className={`absolute -inset-0.5 rounded-3xl blur opacity-40 group-hover:opacity-70 transition-opacity ${idx === 0 ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-purple-500 to-indigo-500'}`} />
              <div className="relative bg-slate-900/90 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm">
                <div className={`px-6 py-4 flex items-center justify-between ${idx === 0 ? 'bg-gradient-to-r from-emerald-900/60 to-teal-900/40' : 'bg-gradient-to-r from-purple-900/60 to-indigo-900/40'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-white text-lg shadow-lg ${idx === 0 ? 'bg-gradient-to-br from-emerald-500 to-teal-600' : 'bg-gradient-to-br from-purple-500 to-indigo-600'}`}>{idx + 1}</div>
                    <div><p className="text-white font-bold">{acc.bank}</p><p className={`text-xs font-medium ${idx === 0 ? 'text-emerald-300' : 'text-purple-300'}`}>{acc.label}</p></div>
                  </div>
                  <div className={`text-xs px-3 py-1 rounded-full font-semibold border ${idx === 0 ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-purple-500/20 text-purple-300 border-purple-500/30'}`}>✓ Verified</div>
                </div>
                <div className="px-6 pb-6 pt-5 space-y-2.5">
                  <CopyField label="Account Holder Name" value={acc.accountHolder} />
                  <CopyField label="Account Number" value={acc.accountNumber} highlight />
                  <CopyField label="Bank" value={acc.bank} />
                  <CopyField label="Branch" value={acc.branch} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Other Ways */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-center text-3xl font-bold mb-10">Can&apos;t donate? That&apos;s okay! 💜</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          {otherWays.map((w, i) => (
            <motion.div key={w.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-purple-400/30 transition-all">
              <div className="text-3xl flex-shrink-0">{w.icon}</div>
              <div><h3 className="text-white font-semibold mb-1">{w.title}</h3><p className="text-gray-400 text-sm">{w.desc}</p></div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Closing */}
      <section className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-3xl blur-2xl" />
          <div className="relative bg-white/5 border border-white/10 rounded-3xl p-10">
            <motion.div animate={{ scale: heartbeat ? 1.3 : 1 }} transition={{ duration: 0.2 }} className="text-6xl mb-6 inline-block">🙏</motion.div>
            <h2 className="text-3xl font-bold text-white mb-4">Every rupee is a vote of confidence</h2>
            <p className="text-gray-300 leading-relaxed mb-6">When you support Ezy CV — even with the price of a cup of tea — you&apos;re telling me that this matters. <strong className="text-white">Thank you from the bottom of my heart.</strong></p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#bank-transfer" className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl shadow-lg hover:scale-105 transition-all">🏦 Donate via Bank Transfer</a>
              <a href="/cv-builder" className="px-8 py-4 bg-white/10 border border-white/20 text-white font-bold rounded-2xl hover:bg-white/20 transition-all">🎯 Go Build Your CV</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
