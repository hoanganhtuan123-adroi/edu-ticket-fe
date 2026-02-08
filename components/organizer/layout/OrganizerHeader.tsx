"use client";

import { useState } from 'react';
import { Menu, X, Bell, LogOut } from 'lucide-react';

export default function OrganizerHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src="/logo.png" 
              alt="EventTicket.edu" 
              className="w-8 h-8 object-contain"
            />
            <span className="ml-2 text-xl font-bold text-gray-900">EventTicket.edu</span>
            <span className="ml-1 text-sm text-green-600 font-medium">Organizer</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/organizer/dashboard" className="text-gray-900 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Dashboard
            </a>
            <a href="/organizer/events" className="text-gray-600 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Sự kiện
            </a>
            <a href="/organizer/tickets" className="text-gray-600 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Vé
            </a>
            <a href="/organizer/analytics" className="text-gray-600 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Thống kê
            </a>
          </nav>

          {/* Right side items */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-green-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User menu */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">O</span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">Organizer</p>
                <p className="text-xs text-gray-500">organizer@edu.vn</p>
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-green-600 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-2">
            <a href="/organizer/dashboard" className="block px-3 py-2 text-gray-900 hover:text-green-600 font-medium transition-colors">
              Dashboard
            </a>
            <a href="/organizer/events" className="block px-3 py-2 text-gray-600 hover:text-green-600 font-medium transition-colors">
              Sự kiện
            </a>
            <a href="/organizer/tickets" className="block px-3 py-2 text-gray-600 hover:text-green-600 font-medium transition-colors">
              Vé
            </a>
            <a href="/organizer/analytics" className="block px-3 py-2 text-gray-600 hover:text-green-600 font-medium transition-colors">
              Thống kê
            </a>
            <a href="/organizer/logout" className="block px-3 py-2 text-red-600 hover:text-red-700 font-medium transition-colors flex items-center">
              <LogOut className="w-4 h-4 mr-2" />
              Đăng xuất
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
