'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, ChevronDown, Upload, LogOut, Menu, X } from 'lucide-react';

const navigation = [
  { name: 'Free CV Builder', href: '/cv-builder' },
  { name: 'Wallpapers', href: '/wallpapers' },
  { name: 'Stock Images', href: '/stock-photos' },
  { name: 'Blog', href: '/blog' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text hidden sm:block">Ezy CV</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2"
                    >
                      <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setShowUserMenu(false)}>
                        Dashboard
                      </Link>
                      <Link href="/upload" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setShowUserMenu(false)}>
                        <Upload className="w-4 h-4" />
                        Upload Content
                      </Link>
                      <div className="border-t border-gray-100 my-1" />
                      <button
                        onClick={() => { logout(); setShowUserMenu(false); }}
                        className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link href="/login" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                  Login
                </Link>
                <Link href="/register" className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-lg text-gray-600 hover:bg-gray-50">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-white border-t">
            <div className="px-4 py-3 space-y-2">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href} onClick={() => setIsOpen(false)} className={`block px-4 py-3 rounded-lg text-sm font-medium ${isActive(item.href) ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                  {item.name}
                </Link>
              ))}

              {!isAuthenticated ? (
                <div className="pt-3 border-t space-y-2">
                  <Link href="/login" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-center rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">Login</Link>
                  <Link href="/register" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-center rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700">Get Started</Link>
                </div>
              ) : (
                <div className="pt-3 border-t space-y-2">
                  <Link href="/dashboard" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">Dashboard</Link>
                  <Link href="/upload" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">
                    <Upload className="w-4 h-4" />
                    Upload Content
                  </Link>
                  <button onClick={() => { logout(); setIsOpen(false); }} className="w-full flex items-center gap-2 px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg">
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
