import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

// ── Copyable field ──────────────────────────────────────────────────────────
const CopyField = ({ label, value }) => {
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
    <div className="flex items-center justify-between gap-3 py-2.5 px-4 bg-white/5 rounded-xl border border-white/10 group hover:border-purple-400/40 transition-all">
      <div className="min-w-0">
        <p className="text-xs text-gray-400 mb-0.5">{label}</p>
        <p className="text-white font-semibold text-sm break-all select-all">{value}</p>
      </div>
      <button
        onClick={handleCopy}
        className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center bg-white/10 hover:bg-purple-500/30 transition-all"
        title="Copy"
      >
        {copied ? (
          <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )}
      </button>
    </div>
  );
};

// ── PayHere dummy modal ─────────────────────────────────────────────────────
const PayHereModal = ({ onClose }) => {
  const [amount, setAmount] = useState('');
  const preset = [200, 500, 1000, 2500];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-8 border border-white/10"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        onClick={e => e.stopPropagation()}
      >
        {/* PayHere logo area */}
        <div className="flex items-center justify-center mb-6 gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-tight">PayHere</p>
            <p className="text-gray-400 text-xs">Online Payment Gateway</p>
          </div>
        </div>

        <h3 className="text-white text-center font-bold text-lg mb-2">Support Ezy CV 💙</h3>
        <p className="text-gray-400 text-center text-sm mb-6">Choose or enter an amount (LKR)</p>

        {/* Preset amounts */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {preset.map(p => (
            <button
              key={p}
              onClick={() => setAmount(String(p))}
              className={`py-2 rounded-xl text-sm font-semibold transition-all border ${
                amount === String(p)
                  ? 'bg-blue-600 text-white border-blue-500'
                  : 'bg-white/10 text-gray-300 border-white/10 hover:bg-white/20'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="Enter custom amount"
          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm mb-6"
        />

        <button
          onClick={() => {
            onClose();
            toast('PayHere integration coming soon! For now, please use bank transfer. 🙏', {
              icon: '💙',
              duration: 5000,
              style: { background: '#1e293b', color: '#fff', borderRadius: '12px' }
            });
          }}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-base hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25"
        >
          Donate {amount ? `LKR ${amount}` : 'Now'} via PayHere
        </button>

        <p className="text-center text-xs text-gray-500 mt-4">
          🔒 Secured by PayHere · Visa · MasterCard · Amex · eZCash
        </p>

        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </motion.div>
    </motion.div>
  );
};

// ── Main page ───────────────────────────────────────────────────────────────
const SupportUs = () => {
  const [showPayHere, setShowPayHere] = useState(false);
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
    { icon: '🌟', title: 'Star on GitHub', desc: 'Give a star to show your love and help others discover us.' },
    { icon: '📢', title: 'Spread the Word', desc: 'Tell a friend who is job hunting. One share can change someone\'s life.' },
    { icon: '💬', title: 'Leave a Review', desc: 'Write how Ezy CV helped you — your words mean everything to us.' },
    { icon: '🐞', title: 'Report Bugs', desc: 'Found something broken? Tell us! You help make EzyCV better for everyone.' },
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
          className="inline-block mb-6 text-7xl"
        >
          ❤️
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
          <button
            onClick={() => setShowPayHere(true)}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl text-lg shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all"
          >
            💳 Donate via PayHere
          </button>
          <a
            href="#bank-transfer"
            className="px-8 py-4 bg-white/10 border border-white/20 text-white font-bold rounded-2xl text-lg hover:bg-white/20 transition-all"
          >
            🏦 Bank Transfer
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
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl flex-shrink-0">
              👨‍💻
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
              Thank you for being here. Truly. 🙏
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
          Your support keeps this alive 🕯️
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: '🌐', title: 'Server Costs', desc: 'Hosting the app so thousands can use it 24/7 without interruption.' },
            { icon: '📦', title: 'Storage & CDN', desc: 'Storing thousands of wallpapers and photos and delivering them fast.' },
            { icon: '📬', title: 'Email Service', desc: 'Sending password resets, welcome emails, and support replies.' },
            { icon: '🛡️', title: 'Security & SSL', desc: 'Keeping your data secure with proper certificates and monitoring.' },
            { icon: '🚀', title: 'New Features', desc: 'More CV templates, backgrounds, and tools — all completely free.' },
            { icon: '☕', title: 'Developer Fuel', desc: 'An occasional cup of tea to keep the code flowing at midnight.' },
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

      {/* ── PAYHERE ─────────────────────────────────────────── */}
      <section className="max-w-2xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/30 rounded-3xl p-8 text-center shadow-lg shadow-blue-500/10"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-5 shadow-lg">
            <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Online Payment</h2>
          <p className="text-gray-300 mb-2">
            We plan to integrate <strong className="text-white">PayHere</strong> — Sri Lanka's leading payment gateway — 
            so you can donate  with your credit/debit card or mobile wallet in seconds.
          </p>
          <p className="text-yellow-300 text-sm mb-6">⚡ Integration coming very soon!</p>

          <button
            onClick={() => setShowPayHere(true)}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 hover:scale-105 transition-all text-lg"
          >
            💳 Try PayHere Donation
          </button>

          <div className="mt-5 flex flex-wrap justify-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">🔒 SSL Secured</span>
            <span className="flex items-center gap-1">💳 Visa / MasterCard</span>
            <span className="flex items-center gap-1">📱 eZCash / mCash</span>
            <span className="flex items-center gap-1">🏦 Online Banking</span>
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
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-300 px-4 py-2 rounded-full text-sm font-medium mb-4 border border-green-500/30">
              ✅ Available Now
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Direct Bank Transfer</h2>
            <p className="text-gray-400">Transfer directly to the accounts below. Click any field to copy it instantly.</p>
          </div>

          <div className="space-y-6">
            {bankAccounts.map((acc, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6 space-y-3"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-sm font-bold text-white">
                    {idx + 1}
                  </div>
                  <span className="text-white font-semibold">{acc.label}</span>
                </div>

                <CopyField label="Bank" value={acc.bank} />
                <CopyField label="Branch" value={acc.branch} />
                <CopyField label="Account Holder Name" value={acc.accountHolder} />
                <CopyField label="Account Number" value={acc.accountNumber} />

                <p className="text-xs text-gray-500 pt-1 text-center">
                  💌 Please send a screenshot to <span className="text-purple-400">support@ezycv.org</span> after transferring so we can thank you personally.
                </p>
              </motion.div>
            ))}
          </div>
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
          Can't donate? That's okay! 💜
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
              className="text-6xl mb-6 inline-block"
            >
              🙏
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
              <button
                onClick={() => setShowPayHere(true)}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl shadow-lg hover:scale-105 transition-all"
              >
                💙 Support Now
              </button>
              <a
                href="/cv-builder"
                className="px-8 py-4 bg-white/10 border border-white/20 text-white font-bold rounded-2xl hover:bg-white/20 transition-all"
              >
                🎯 Go Build Your CV
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      {/* PayHere modal */}
      <AnimatePresence>
        {showPayHere && (
          <PayHereModal onClose={() => setShowPayHere(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SupportUs;
