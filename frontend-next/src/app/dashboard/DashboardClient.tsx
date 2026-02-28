'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore, useStatsStore } from '@/lib/store';
import { Plus, FileText } from 'lucide-react';

const quickActions = [
  { title: 'Create New CV', description: 'Build your perfect CV in minutes', link: '/cv-builder', color: 'from-blue-500 to-blue-600', badge: 'Popular' },
  { title: 'Browse Templates', description: '10+ professional designs', link: '/cv-templates', color: 'from-purple-500 to-purple-600' },
  { title: 'HD Wallpapers', description: 'Download stunning wallpapers', link: '/wallpapers', color: 'from-pink-500 to-rose-600' },
  { title: 'Stock Photos', description: 'Free high-quality images', link: '/stock-photos', color: 'from-cyan-500 to-teal-600' },
];

export default function DashboardClient() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { userStats } = useStatsStore();

  useEffect(() => {
    if (!isAuthenticated) router.replace('/login');
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const stats = [
    { label: 'CVs Created', value: userStats?.cvsCreated || 0, color: 'from-blue-500 to-blue-600' },
    { label: 'Total Downloads', value: userStats?.totalDownloads || 0, color: 'from-green-500 to-emerald-600' },
    { label: 'Templates Used', value: Array.isArray(userStats?.templatesUsed) ? userStats.templatesUsed.length : 0, color: 'from-purple-500 to-pink-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Header */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse" />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-4">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }} className="w-20 h-20 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white text-3xl font-bold border-2 border-white/30 shadow-xl">
                {user?.name?.charAt(0).toUpperCase()}
              </motion.div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-1 flex items-center gap-3">Welcome back, {user?.name?.split(' ')[0]}! <span className="text-3xl">👋</span></h1>
                <p className="text-blue-100 text-lg">{user?.email}</p>
              </div>
            </div>
            <Link href="/cv-builder" className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-xl flex items-center gap-3">
              <Plus className="w-6 h-6" />
              Create New CV
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Stats */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-3 gap-6 mb-8">
              {stats.map((stat, i) => (
                <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:border-blue-200 transition-all text-center">
                  <div className={`w-14 h-14 mx-auto mb-4 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="text-4xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600 mt-2 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {quickActions.map((action, i) => (
                <motion.div key={action.title} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                  <Link href={action.link} className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all group">
                    <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 flex items-center gap-2">{action.title} {action.badge && <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">{action.badge}</span>}</div>
                      <div className="text-sm text-gray-500">{action.description}</div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
