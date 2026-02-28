'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Mail, MapPin, Clock } from 'lucide-react';

const contactInfo = [
  {
    icon: <Mail className="w-6 h-6" />,
    title: 'Email',
    value: 'ezycv22@gmail.com',
    link: 'mailto:ezycv22@gmail.com',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: <MapPin className="w-6 h-6" />,
    title: 'Location',
    value: 'Rambukkana, Sri Lanka 🇱🇰',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: 'Response Time',
    value: 'Within 24-48 hours',
    color: 'from-orange-500 to-red-500',
  },
];

const faqs = [
  { question: 'Is Ezy CV really free?', answer: 'Yes! Our CV builder is completely free to use. You can create, edit, and download your CV without any charges.' },
  { question: 'Can I edit my CV after creating it?', answer: 'Absolutely! Your CV data is saved locally, and you can come back anytime to make changes.' },
  { question: 'What format can I download my CV in?', answer: 'Currently, you can download your CV as a high-quality PDF file, perfect for job applications.' },
  { question: 'Are the wallpapers free to use commercially?', answer: 'Most of our wallpapers are free for personal use. Please check individual image licenses for commercial use.' },
];

export default function ContactClient() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Message sent! We'll get back to you soon. 💜", { duration: 5000, icon: '✉️' });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        toast.error(data.error || 'Failed to send message. Please try again.');
      }
    } catch {
      toast.error('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Get in Touch</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">Have questions? We&apos;d love to hear from you.</p>
          </motion.div>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-12 -mt-10 relative z-10">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-3 gap-6">
          {contactInfo.map((info, i) => (
            <motion.div key={info.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white rounded-2xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow">
              <div className={`w-14 h-14 bg-gradient-to-br ${info.color} rounded-xl flex items-center justify-center text-white mx-auto mb-4`}>{info.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-1">{info.title}</h3>
              {info.link ? (
                <a href={info.link} className="text-purple-600 hover:text-purple-700 font-medium">{info.value}</a>
              ) : (
                <p className="text-gray-600">{info.value}</p>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Form & FAQ */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12">
          {/* Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" placeholder="your@email.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input type="text" required value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" placeholder="How can we help?" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea required rows={5} value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none" placeholder="Tell us more..." />
              </div>
              <button type="submit" disabled={loading} className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </motion.div>

          {/* FAQ */}
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-start gap-2"><span className="text-purple-600">Q:</span>{faq.question}</h3>
                  <p className="text-gray-600 pl-6">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
