"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, LogOut, User, FileText, ChevronDown, Settings, ScanQrCode } from "lucide-react";
import Link from "next/link";
import { OrganizerNotificationBell } from "../notification/NotificationBell";

export default function OrganizerHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white shadow-md border-b border-gray-100 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18 lg:h-20">
          {/* Logo */}
          <div className="flex items-center group cursor-pointer">
            <div className="relative">
              <img
                src="/logo.png"
                alt="EventTicket.edu"
                className="w-10 h-10 lg:w-12 lg:h-12 object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-br from-green-400 to-emerald-600 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            </div>
            <div className="ml-3 flex flex-col">
              <span className="text-lg lg:text-xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                EventTicket.edu
              </span>
              <span className="text-xs lg:text-sm text-emerald-600 font-semibold tracking-wide">
                Organizer
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link
              href="/organizer/dashboard"
              className="text-gray-900 hover:text-emerald-600 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 hover:bg-emerald-50 relative group"
            >
              Dashboard
              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-emerald-600 transition-all duration-200 group-hover:w-8 group-hover:left-1/2 group-hover:-translate-x-1/2"></span>
            </Link>
            <Link
              href="/organizer/events"
              className="text-gray-600 hover:text-emerald-600 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-emerald-50 relative group"
            >
              Sự kiện
              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-emerald-600 transition-all duration-200 group-hover:w-8 group-hover:left-1/2 group-hover:-translate-x-1/2"></span>
            </Link>
            <Link
              href="/organizer/tickets"
              className="text-gray-600 hover:text-emerald-600 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-emerald-50 relative group"
            >
              Vé
              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-emerald-600 transition-all duration-200 group-hover:w-8 group-hover:left-1/2 group-hover:-translate-x-1/2"></span>
            </Link>
            <Link
              href="/organizer/support"
              className="text-gray-600 hover:text-emerald-600 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-emerald-50 relative group"
            >
              Gửi yêu cầu hỗ trợ
              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-emerald-600 transition-all duration-200 group-hover:w-8 group-hover:left-1/2 group-hover:-translate-x-1/2"></span>
            </Link>
            <Link
              href="/organizer/analytics"
              className="text-gray-600 hover:text-emerald-600 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-emerald-50 relative group"
            >
              Thống kê
              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-emerald-600 transition-all duration-200 group-hover:w-8 group-hover:left-1/2 group-hover:-translate-x-1/2"></span>
            </Link>
            <Link
              href="/organizer/check-in"
              className="text-gray-600 hover:text-emerald-600 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-emerald-50 relative group"
            >
              Check-in
              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-emerald-600 transition-all duration-200 group-hover:w-8 group-hover:left-1/2 group-hover:-translate-x-1/2"></span>
            </Link>
          </nav>

          {/* Right side items */}
          <div className="flex items-center space-x-3 lg:space-x-4">
            {/* Notifications - Desktop */}
            <div className="hidden lg:block">
              <OrganizerNotificationBell />
            </div>

            {/* User menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-3 hover:bg-gray-50 rounded-xl p-2.5 transition-all duration-200 border border-transparent hover:border-gray-200 group"
              >
                <motion.div
                  animate={{ rotate: isUserMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-9 h-9 lg:w-10 lg:h-10 bg-linear-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-200">
                    <span className="text-white text-sm lg:text-base font-bold">O</span>
                  </div>
                </motion.div>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">Organizer</p>
                  <p className="text-xs text-gray-500">organizer@edu.vn</p>
                </div>
                <motion.div
                  animate={{ rotate: isUserMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="hidden lg:block"
                >
                  <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                </motion.div>
              </button>

              {/* Dropdown menu */}
              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-gray-100 py-2 z-50"
                  >
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.05 }}
                    >
                      <Link
                        href="/organizer/profile"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-200 group"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4 mr-3 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                        <span className="font-medium">Thông tin tài khoản</span>
                      </Link>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Link
                        href="/organizer/support/requests"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-200 group"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <FileText className="w-4 h-4 mr-3 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                        <span className="font-medium">Xem yêu cầu đã gửi</span>
                      </Link>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.15 }}
                    >
                      <hr className="my-2 border-gray-100" />
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Link
                        href="/organizer/settings"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-200 group"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4 mr-3 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                        <span className="font-medium">Cài đặt</span>
                      </Link>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.25 }}
                    >
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          // Handle logout logic here
                          console.log('Logout clicked');
                        }}
                        className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 group"
                      >
                        <LogOut className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform duration-200" />
                        <span className="font-medium">Đăng xuất</span>
                      </button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile menu button */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-3 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-200 border border-transparent hover:border-emerald-200"
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="lg:hidden border-t border-gray-100 overflow-hidden bg-gray-50/50 backdrop-blur-sm"
            >
              <div className="py-3 px-4 space-y-1">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 }}
                >
                  <Link
                    href="/organizer/dashboard"
                    className="block px-4 py-3 text-gray-900 hover:text-emerald-600 font-semibold bg-white rounded-lg hover:bg-emerald-50 transition-all duration-200 border border-transparent hover:border-emerald-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Link
                    href="/organizer/events"
                    className="block px-4 py-3 text-gray-700 hover:text-emerald-600 font-medium bg-white rounded-lg hover:bg-emerald-50 transition-all duration-200 border border-transparent hover:border-emerald-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sự kiện
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <Link
                    href="/organizer/tickets"
                    className="block px-4 py-3 text-gray-700 hover:text-emerald-600 font-medium bg-white rounded-lg hover:bg-emerald-50 transition-all duration-200 border border-transparent hover:border-emerald-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Vé
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Link
                    href="/organizer/support"
                    className="block px-4 py-3 text-gray-700 hover:text-emerald-600 font-medium bg-white rounded-lg hover:bg-emerald-50 transition-all duration-200 border border-transparent hover:border-emerald-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Gửi yêu cầu hỗ trợ
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <Link
                    href="/organizer/analytics"
                    className="block px-4 py-3 text-gray-700 hover:text-emerald-600 font-medium bg-white rounded-lg hover:bg-emerald-50 transition-all duration-200 border border-transparent hover:border-emerald-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Thống kê
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Link
                    href="/organizer/check-in"
                    className="block px-4 py-3 text-gray-700 hover:text-emerald-600 font-medium bg-white rounded-lg hover:bg-emerald-50 transition-all duration-200 border border-transparent hover:border-emerald-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Check-in
                  </Link>
                </motion.div>
                
                {/* Mobile notifications */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  <div className="px-4 py-3 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Thông báo</span>
                      <OrganizerNotificationBell />
                    </div>
                  </div>
                </motion.div>
                
                {/* Mobile user menu */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <hr className="my-3 border-gray-200" />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 }}
                >
                  <Link
                    href="/organizer/profile"
                    className="block px-4 py-3 text-gray-700 hover:text-emerald-600 font-medium bg-white rounded-lg hover:bg-emerald-50 transition-all duration-200 border border-transparent hover:border-emerald-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Thông tin tài khoản
                  </Link>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Link
                    href="/organizer/support/requests"
                    className="block px-4 py-3 text-gray-700 hover:text-emerald-600 font-medium bg-white rounded-lg hover:bg-emerald-50 transition-all duration-200 border border-transparent hover:border-emerald-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Xem yêu cầu đã gửi
                  </Link>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.55 }}
                >
                  <Link
                    href="/organizer/settings"
                    className="block px-4 py-3 text-gray-700 hover:text-emerald-600 font-medium bg-white rounded-lg hover:bg-emerald-50 transition-all duration-200 border border-transparent hover:border-emerald-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Cài đặt
                  </Link>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      console.log('Logout clicked');
                    }}
                    className="w-full text-left px-4 py-3 text-red-600 hover:text-red-700 font-semibold bg-white rounded-lg hover:bg-red-50 transition-all duration-200 border border-transparent hover:border-red-200 flex items-center"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Đăng xuất
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
