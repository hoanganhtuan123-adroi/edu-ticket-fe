"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function LoginLeftPanel() {
  return (
    <div className="w-full lg:w-2/5 bg-gradient-to-br from-blue-600 to-purple-700 rounded-l-2xl lg:rounded-l-2xl shadow-2xl flex-1 flex flex-col justify-center items-center p-8 sm:p-12 text-white">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center max-w-sm"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
            <i className="fas fa-ticket-alt text-4xl sm:text-5xl"></i>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="text-3xl sm:text-4xl font-bold mb-4"
        >
          Chào mừng!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
          className="text-lg sm:text-xl opacity-90 mb-8"
        >
          Đăng nhập để trải nghiệm hệ thống quản lý sự kiện
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
          className="space-y-4"
        >
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-sm">Quản lý sự kiện dễ dàng</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span className="text-sm">Theo dõi vé bán ra</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            <span className="text-sm">Báo cáo chi tiết</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1, ease: "easeOut" }}
          className="mt-12"
        >
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
          >
            <i className="fas fa-arrow-left"></i>
            <span>Quay lại trang chủ</span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
