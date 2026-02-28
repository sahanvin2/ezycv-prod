import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FilePlus, LayoutGrid, ImageIcon, Camera, FileText, Download, Plus, ChevronRight, User, Settings, LogOut, CheckCircle, BarChart3, Zap, Lightbulb } from 'lucide-react';
import { useAuthStore, useCVStore, useStatsStore } from '../store/store';
import { NativeBannerAd, LargeBannerAd } from '../components/Ads/AdComponents';

const Dashboard = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { savedCVs } = useCVStore();
  const { userStats } = useStatsStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const quickActions = [
    {
      title: 'Create New CV',
      description: 'Build your perfect CV in minutes',
      icon: <FilePlus className="w-7 h-7" />,
      link: '/cv-builder',
      color: 'from-blue-500 to-blue-600',
      badge: 'Popular'
    },
    {
      title: 'Browse Templates',
      description: '10+ professional designs',
      icon: <LayoutGrid className="w-7 h-7" />,
      link: '/cv-templates',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'HD Wallpapers',
      description: 'Download stunning wallpapers',
      icon: <ImageIcon className="w-7 h-7" />,
      link: '/wallpapers',
      color: 'from-pink-500 to-rose-600'
    },
    {
      title: 'Stock Photos',
      description: 'Free high-quality images',
      icon: <Camera className="w-7 h-7" />,
      link: '/stock-photos',
      color: 'from-cyan-500 to-teal-600'
    }
  ];

  const stats = [
    { 
      label: 'CVs Created', 
      value: userStats?.cvsCreated || 0, 
      icon: <FileText className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-600'
    },
    { 
      label: 'Total Downloads', 
      value: userStats?.totalDownloads || 0, 
      icon: <Download className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-600'
    },
    { 
      label: 'Templates Used', 
      value: Array.isArray(userStats?.templatesUsed) ? userStats.templatesUsed.length : 0, 
      icon: <LayoutGrid className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Enhanced Header with Gradient */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white py-16 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
          >
            <div className="flex items-center gap-4">
              {/* Enhanced Avatar */}
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-20 h-20 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white text-3xl font-bold border-2 border-white/30 shadow-xl"
              >
                {user?.name?.charAt(0).toUpperCase()}
              </motion.div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-1 flex items-center gap-3">
                  Welcome back, {user?.name?.split(' ')[0]}! 
                  <span className="text-3xl">👋</span>
                </h1>
                <p className="text-blue-100 text-lg">
                  {user?.email}
                </p>
              </div>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/cv-builder"
                className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl flex items-center gap-3 group"
              >
                <Plus className="w-6 h-6 transform group-hover:rotate-90 transition-transform" />
                Create New CV
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Ad Banner */}
      <div className="bg-white py-4 border-b">
        <div className="max-w-7xl mx-auto px-4 flex justify-center">
          <LargeBannerAd />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, shadow: "xl" }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:border-blue-200 transition-all group"
                >
                  <div className={`w-14 h-14 mx-auto mb-4 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                    {stat.icon}
                  </div>
                  <motion.div 
                    key={stat.value}
                    initial={{ scale: 1.2, color: '#2563eb' }}
                    animate={{ scale: 1, color: '#111827' }}
                    transition={{ duration: 0.3 }}
                    className="text-4xl font-bold text-center"
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-sm text-gray-600 mt-2 text-center font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Detailed Stats */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" /> Download Breakdown
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{userStats?.cvsDownloaded || 0}</div>
                  <div className="text-xs text-blue-600">CV Downloads</div>
                </div>
                <div className="text-center p-3 bg-pink-50 rounded-lg">
                  <div className="text-2xl font-bold text-pink-600">{userStats?.wallpapersDownloaded || 0}</div>
                  <div className="text-xs text-pink-600">Wallpapers</div>
                </div>
                <div className="text-center p-3 bg-cyan-50 rounded-lg">
                  <div className="text-2xl font-bold text-cyan-600">{userStats?.photosDownloaded || 0}</div>
                  <div className="text-xs text-cyan-600">Stock Photos</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{Array.isArray(userStats?.templatesUsed) ? userStats.templatesUsed.length : 0}</div>
                  <div className="text-xs text-purple-600">Templates Used</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Zap className="w-6 h-6" /> Quick Actions
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.title}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      to={action.link}
                      className="relative block bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 hover:border-blue-200 group overflow-hidden"
                    >
                      {/* Background Gradient on Hover */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
                      
                      <div className="relative z-10 flex items-start gap-4">
                        <div className={`w-14 h-14 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform flex-shrink-0`}>
                          {action.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-gray-900 text-lg">{action.title}</h3>
                            {action.badge && (
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs font-semibold rounded-full">
                                {action.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{action.description}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Recent CVs */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Your CVs</h2>
              {savedCVs && savedCVs.length > 0 ? (
                <div className="space-y-4">
                  {savedCVs.map((cv, index) => (
                    <div
                      key={cv._id || index}
                      className="bg-white rounded-xl p-6 shadow-sm flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {cv.personalInfo?.fullName || 'Untitled CV'}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Template: {cv.template} • Last updated: {new Date(cv.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          to={`/cv-builder?id=${cv._id}`}
                          className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                        >
                          Edit
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl p-12 shadow-sm text-center">
                  <div className="mb-4 flex justify-center"><FileText className="w-16 h-16 text-gray-400" /></div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No CVs yet</h3>
                  <p className="text-gray-500 mb-6">Create your first professional CV today!</p>
                  <Link
                    to="/cv-builder"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    Create Your First CV
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            {/* Modern Profile Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-white to-blue-50/50 rounded-2xl p-6 shadow-lg border border-blue-100"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{user?.name}</h3>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                  <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                    <CheckCircle className="w-3 h-3" />
                    Active
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Link to="/edit-profile" className="w-full py-3 px-4 text-left rounded-xl hover:bg-blue-100/50 transition-all flex items-center gap-3 text-gray-700 font-medium group">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <span>Edit Profile</span>
                  <ChevronRight className="w-4 h-4 ml-auto text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </Link>
                
                <Link to="/settings" className="w-full py-3 px-4 text-left rounded-xl hover:bg-purple-100/50 transition-all flex items-center gap-3 text-gray-700 font-medium group">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <Settings className="w-5 h-5 text-purple-600" />
                  </div>
                  <span>Settings</span>
                  <ChevronRight className="w-4 h-4 ml-auto text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                </Link>
                
                <div className="my-3 border-t border-gray-200"></div>
                
                <button 
                  onClick={logout}
                  className="w-full py-3 px-4 text-left rounded-xl hover:bg-red-50 transition-all flex items-center gap-3 text-red-600 font-medium group"
                >
                  <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                    <LogOut className="w-5 h-5 text-red-600" />
                  </div>
                  <span>Logout</span>
                </button>
              </div>
            </motion.div>

            {/* Native Ad */}
            <NativeBannerAd />

            {/* Modern Tips Card */}
            <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-xl overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Lightbulb className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg">Pro CV Tips</h3>
                </div>
                <ul className="space-y-3 text-sm text-white/90">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                    <span>Keep your CV concise (1-2 pages maximum)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                    <span>Use strong action verbs to describe achievements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                    <span>Quantify your accomplishments with numbers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                    <span>Customize your CV for each job application</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
