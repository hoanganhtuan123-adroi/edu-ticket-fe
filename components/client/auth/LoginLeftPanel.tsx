"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function LoginLeftPanel() {
  return (
    <div className="w-full lg:w-2/5 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-l-2xl lg:rounded-l-2xl shadow-2xl flex-1 flex flex-col justify-center items-center p-8 sm:p-12 text-white">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center max-w-sm"
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="text-3xl sm:text-4xl font-bold mb-4"
        >
          Chào mừng đến với Edu Ticket!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
          className="text-lg sm:text-xl opacity-90 mb-8"
        >
          Đăng nhập để khám phá và đặt vé cho những sự kiện tuyệt vời.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
          className="space-y-4"
        >
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-300 rounded-full"></div>
            <span className="text-sm">Dễ dàng tìm kiếm sự kiện</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
            <span className="text-sm">Đặt vé nhanh chóng và an toàn</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-pink-300 rounded-full"></div>
            <span className="text-sm">Quản lý vé của bạn mọi lúc, mọi nơi</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
