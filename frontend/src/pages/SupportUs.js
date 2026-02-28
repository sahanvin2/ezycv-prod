import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Check, Copy, Lock, CreditCard, Building2, ShieldCheck, Heart, Star, Megaphone, MessageSquare, Bug, User, Flame, Globe, Package, MailOpen, Shield, Rocket, Coffee, Smartphone, Mail, Lightbulb, HeartHandshake, Target } from 'lucide-react';

// ── Copyable field ──────────────────────────────────────────────────────────
const CopyField = ({ label, value, highlight = false }) => {
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
    <motion.div
      whileHover={{ scale: 1.01 }}
      onClick={handleCopy}
      className={`flex items-center justify-between gap-3 py-3 px-4 rounded-xl border cursor-pointer transition-all select-none
        ${highlight
          ? 'bg-gradient-to-r from-emerald-900/40 to-teal-900/40 border-emerald-500/40 hover:border-emerald-400/70 hover:shadow-lg hover:shadow-emerald-500/10'
          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-purple-400/40'
        }`}
    >
      <div className="min-w-0 flex-1">
        <p className={`text-xs mb-0.5 font-medium ${highlight ? 'text-emerald-400' : 'text-gray-400'}`}>{label}</p>
        <p className={`font-bold text-sm break-all ${highlight ? 'text-emerald-200 text-base' : 'text-white'}`}>{value}</p>
      </div>
      <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all
        ${copied ? 'bg-green-500/30' : highlight ? 'bg-emerald-500/20 hover:bg-emerald-500/40' : 'bg-white/10 hover:bg-purple-500/30'}`}>
        {copied ? (
          <Check className="w-4 h-4 text-green-400" strokeWidth={2.5} />
        ) : (
          <Copy className="w-4 h-4 text-gray-300" />
        )}
      </div>
    </motion.div>
  );
};

// ── Main page ───────────────────────────────────────────────────────────────
const SupportUs = () => {
  const [heartbeat, setHeartbeat] = useState(false);

  useEffect(() => {
    document.title = 'Support Us — Ezy CV';
    const iv = setInterval(() => {
      setHeartbeat(true);
      setTimeout(() => setHeartbeat(false), 300);
    }, 1800);
    return () => clearInterval(iv);
  }, []);

  const bankAccounts = [
    {
      label: 'Account 1 — Savings',
      accountNumber: '001020613595',
      accountHolder: 'Nawarathna Mudiyanselage Sahan Vindula Nawarathne',
      bank: 'Dialog Finance PLC',
      branch: 'Head Office',
    },
    {
      label: 'Account 2 — HNB',
      accountNumber: '066020144508',
      accountHolder: 'N.M.S.V.Nawarathne',
      bank: 'Hatton National Bank (HNB)',
      branch: 'Rambukkana',
    },
  ];

  const stats = [
    { value: '100%', label: 'Free — Always' },
    { value: '0$', label: 'No hidden fees' },
    { value: '∞', label: 'CVs built' },
    { value: '1', label: 'Developer, with love' },
  ];

  const otherWays = [
    { icon: <Star className="w-7 h-7 text-yellow-400" />, title: 'Star on GitHub', desc: 'Give a star to show your love and help others discover us.' },
    { icon: <Megaphone className="w-7 h-7 text-blue-400" />, title: 'Spread the Word', desc: 'Tell a friend who is job hunting. One share can change someone\'s life.' },
    { icon: <MessageSquare className="w-7 h-7 text-green-400" />, title: 'Leave a Review', desc: 'Write how Ezy CV helped you — your words mean everything to us.' },
    { icon: <Bug className="w-7 h-7 text-red-400" />, title: 'Report Bugs', desc: 'Found something broken? Tell us! You help make EzyCV better for everyone.' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-4 pt-20 pb-16 text-center">
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-700/20 rounded-full blur-3xl" />
          <div className="absolute top-60 left-10 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute top-60 right-10 w-64 h-64 bg-pink-600/10 rounded-full blur-3xl" />
        </div>

        {/* Beating heart */}
        <motion.div
          animate={{ scale: heartbeat ? 1.35 : 1 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="inline-block mb-6"
        >
          <Heart className="w-16 h-16 text-red-500" fill="currentColor" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-300 bg-clip-text text-transparent leading-tight"
        >
          Built with love.<br />
          <span className="text-3xl md:text-5xl">Kept alive by people like you.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10"
        >
          Ezy CV is <strong className="text-white">100% free</strong> — no subscriptions, no premium tiers, no ads that
          get in your way. Just one developer who believes every job-seeker deserves a great CV, regardless of budget.
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-6 mb-12"
        >
          {stats.map(s => (
            <div key={s.label} className="text-center px-4">
              <div className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{s.value}</div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#bank-transfer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl text-lg shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all"
          >
            <Building2 className="w-5 h-5" /> Donate via Bank Transfer
          </a>
          <a
            href="#payment-gateway"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white font-bold rounded-2xl text-lg hover:bg-white/20 transition-all"
          >
            <CreditCard className="w-5 h-5" /> Online Payment (Soon)
          </a>
        </motion.div>
      </section>

      {/* ── STORY SECTION ────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-sm relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-lg">Sahan Nawarathne</p>
              <p className="text-purple-300 text-sm">Founder & Solo Developer, Ezy CV</p>
            </div>
          </div>

          <div className="space-y-4 text-gray-300 leading-relaxed text-base md:text-lg">
            <p>
              Hey, I'm Sahan. I built Ezy CV from my bedroom — no funding, no team, just a laptop and
              a dream that <em>everyone</em> deserves a professional CV without paying for it.
            </p>
            <p>
              Every feature you see — the CV builder, the wallpapers, the stock photos — was designed
              and coded by <strong className="text-white">one person</strong>. Evenings, weekends, countless
              cups of tea. All of it, because I genuinely believe your career shouldn't depend on your wallet.
            </p>
            <p>
              But servers cost money. APIs cost money. The domain you type into your browser costs money.
              Right now I pay for all of this out of my own pocket, every single month.
            </p>
            <p className="text-white font-semibold text-lg border-l-4 border-purple-500 pl-4">
              "If Ezy CV helped you land a job, impress a recruiter, or just gave you a beautiful wallpaper
              that made your day — please consider buying me a cup of tea. 🍵"
            </p>
            <p>
              Even the smallest donation means I can keep the lights on, keep it free for the next person
              who needs it, and maybe — just maybe — build more amazing things for you.
            </p>
            <p>
              Thank you for being here. Truly. <HeartHandshake className="w-5 h-5 inline text-purple-400" />
            </p>
          </div>
        </motion.div>
      </section>

      {/* ── WHAT YOUR SUPPORT DOES ───────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 py-8">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-3xl font-bold mb-10"
        >
          Your support keeps this alive <Flame className="w-5 h-5 inline text-amber-400" />
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: <Globe className="w-7 h-7 text-blue-400" />, title: 'Server Costs', desc: 'Hosting the app so thousands can use it 24/7 without interruption.' },
            { icon: <Package className="w-7 h-7 text-orange-400" />, title: 'Storage & CDN', desc: 'Storing thousands of wallpapers and photos and delivering them fast.' },
            { icon: <MailOpen className="w-7 h-7 text-teal-400" />, title: 'Email Service', desc: 'Sending password resets, welcome emails, and support replies.' },
            { icon: <Shield className="w-7 h-7 text-green-400" />, title: 'Security & SSL', desc: 'Keeping your data secure with proper certificates and monitoring.' },
            { icon: <Rocket className="w-7 h-7 text-purple-400" />, title: 'New Features', desc: 'More CV templates, backgrounds, and tools — all completely free.' },
            { icon: <Coffee className="w-7 h-7 text-amber-400" />, title: 'Developer Fuel', desc: 'An occasional cup of tea to keep the code flowing at midnight.' },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-purple-400/30 transition-all"
            >
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="text-white font-semibold mb-1">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── PAYMENT GATEWAY — COMING SOON ───────────────────── */}
      <section id="payment-gateway" className="max-w-2xl mx-auto px-4 py-12 scroll-mt-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl border border-dashed border-blue-400/40 bg-gradient-to-br from-slate-900/80 to-indigo-950/60 p-8 text-center backdrop-blur-sm"
        >
          {/* Ambient glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-blue-600/15 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl" />
          </div>

          {/* Lock badge */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-400/30 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 tracking-wide uppercase">
              <Lock className="w-3.5 h-3.5" />
              Coming Soon
            </div>

            {/* Gateway icons */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25 opacity-70">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
            </div>

            <h2 className="text-2xl font-extrabold text-white mb-3">Online Payment Gateway</h2>
            <p className="text-gray-300 text-base leading-relaxed mb-2 max-w-md mx-auto">
              We're integrating <strong className="text-white">PayHere</strong> — Sri Lanka's most trusted payment gateway —
              so you can donate instantly with your card or mobile wallet.
            </p>
            <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">
              This feature is actively being worked on and will be available very soon.
            </p>

            {/* Progress indicator */}
            <div className="max-w-xs mx-auto mb-6">
              <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                <span>Integration Progress</span>
                <span className="text-blue-400 font-semibold">In Development</span>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '60%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-400 rounded-full"
                />
              </div>
            </div>

            {/* Accepted methods (greyed out) */}
            <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-500">
              {[
                { icon: <CreditCard className="w-3.5 h-3.5" />, label: 'Visa' },
                { icon: <CreditCard className="w-3.5 h-3.5" />, label: 'MasterCard' },
                { icon: <Smartphone className="w-3.5 h-3.5" />, label: 'eZCash' },
                { icon: <Smartphone className="w-3.5 h-3.5" />, label: 'mCash' },
                { icon: <Building2 className="w-3.5 h-3.5" />, label: 'Online Banking' },
              ].map(m => (
                <span key={m.label} className="flex items-center gap-1 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg opacity-60">
                  {m.icon} {m.label}
                </span>
              ))}
            </div>

            <p className="mt-5 text-xs text-gray-500">
              <Mail className="w-4 h-4 inline" /> Want to be notified when it's live?{' '}
              <a href="mailto:support@ezycv.org" className="text-blue-400 hover:text-blue-300 underline underline-offset-2">
                Drop us an email
              </a>
            </p>
          </div>
        </motion.div>
      </section>

      {/* ── BANK TRANSFER ───────────────────────────────────── */}
      <section id="bank-transfer" className="max-w-2xl mx-auto px-4 py-8 scroll-mt-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Section header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse inline-block" />
              Available Now · Instant &amp; Free
            </div>
            <h2 className="text-4xl font-extrabold text-white mb-3 leading-tight">
              Bank Transfer
            </h2>
            <p className="text-gray-400 text-base max-w-sm mx-auto">
              Transfer directly to either account below. Tap any row to instantly copy the details.
            </p>
          </div>

          {/* Tip banner */}
          <div className="flex items-start gap-3 bg-blue-500/10 border border-blue-400/20 rounded-2xl px-5 py-4 mb-8">
            <span className="flex-shrink-0"><Lightbulb className="w-6 h-6 text-blue-300" /></span>
            <p className="text-blue-200 text-sm leading-relaxed">
              <strong>Pro tip:</strong> Tap any field to copy it instantly. After your transfer, 
              send a screenshot to{' '}
              <a href="mailto:support@ezycv.org" className="text-blue-400 underline underline-offset-2 hover:text-blue-300">
                support@ezycv.org
              </a>{' '}
              so we can thank you personally! <HeartHandshake className="w-4 h-4 inline text-purple-400" />
            </p>
          </div>

          {/* Bank account cards */}
          <div className="space-y-8">
            {bankAccounts.map((acc, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.12 }}
                className="relative group"
              >
                {/* Glow border */}
                <div className={`absolute -inset-0.5 rounded-3xl blur opacity-40 group-hover:opacity-70 transition-opacity duration-500
                  ${idx === 0 ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-purple-500 to-indigo-500'}`} />

                <div className="relative bg-slate-900/90 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm">

                  {/* Card header */}
                  <div className={`px-6 py-4 flex items-center justify-between
                    ${idx === 0
                      ? 'bg-gradient-to-r from-emerald-900/60 to-teal-900/40'
                      : 'bg-gradient-to-r from-purple-900/60 to-indigo-900/40'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-white text-lg shadow-lg
                        ${idx === 0 ? 'bg-gradient-to-br from-emerald-500 to-teal-600' : 'bg-gradient-to-br from-purple-500 to-indigo-600'}`}>
                        {idx + 1}
                      </div>
                      <div>
                        <p className="text-white font-bold text-base leading-tight">{acc.bank}</p>
                        <p className={`text-xs font-medium ${idx === 0 ? 'text-emerald-300' : 'text-purple-300'}`}>{acc.label}</p>
                      </div>
                    </div>
                    <div className={`text-xs px-3 py-1 rounded-full font-semibold border
                      ${idx === 0
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : 'bg-purple-500/20 text-purple-300 border-purple-500/30'}`}>
                      ✓ Verified
                    </div>
                  </div>

                  {/* Bank icon row */}
                  <div className="px-6 pt-5 pb-1 flex items-center gap-3 border-b border-white/5 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-gray-300" />
                    </div>
                    <p className="text-gray-400 text-sm">Branch: <span className="text-white font-medium">{acc.branch}</span></p>
                  </div>

                  {/* Copyable fields */}
                  <div className="px-6 pb-6 space-y-2.5">
                    <CopyField label="Account Holder Name" value={acc.accountHolder} />
                    <CopyField label="Account Number" value={acc.accountNumber} highlight />
                    <CopyField label="Bank" value={acc.bank} />
                    <CopyField label="Branch" value={acc.branch} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom note */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-8 text-center"
          >
            <div className="inline-flex items-center gap-2 text-gray-400 text-sm bg-white/5 border border-white/10 px-5 py-3 rounded-2xl">
              <ShieldCheck className="w-4 h-4 text-green-400 flex-shrink-0" />
              Your transfer goes <strong className="text-white mx-1">directly</strong> to the developer — zero platform fees, 100% of your support reaches Ezy CV.
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── OTHER WAYS TO SUPPORT ───────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-3xl font-bold mb-10"
        >
          Can't donate? That's okay! <Heart className="w-5 h-5 inline text-purple-400" />
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {otherWays.map((w, i) => (
            <motion.div
              key={w.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-purple-400/30 transition-all"
            >
              <div className="text-3xl flex-shrink-0">{w.icon}</div>
              <div>
                <h3 className="text-white font-semibold mb-1">{w.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{w.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CLOSING EMOTIONAL SECTION ───────────────────────── */}
      <section className="max-w-2xl mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-3xl blur-2xl" />
          <div className="relative bg-white/5 border border-white/10 rounded-3xl p-10">
            <motion.div
              animate={{ scale: heartbeat ? 1.3 : 1 }}
              transition={{ duration: 0.2 }}
              className="mb-6 inline-block"
            >
              <HeartHandshake className="w-14 h-14 text-purple-400" />
            </motion.div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Every rupee is a vote of confidence
            </h2>
            <p className="text-gray-300 leading-relaxed mb-6">
              When you support Ezy CV — even with the price of a cup of tea — you're telling me that
              this matters. That free tools for job-seekers matter. That people like you make the internet
              a kinder, more equal place. <strong className="text-white">Thank you from the bottom of my heart.</strong>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#bank-transfer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl shadow-lg hover:scale-105 transition-all"
              >
                <Building2 className="w-5 h-5" /> Donate via Bank Transfer
              </a>
              <a
                href="/cv-builder"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white font-bold rounded-2xl hover:bg-white/20 transition-all"
              >
                <Target className="w-5 h-5" /> Go Build Your CV
              </a>
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  );
};

export default SupportUs;
