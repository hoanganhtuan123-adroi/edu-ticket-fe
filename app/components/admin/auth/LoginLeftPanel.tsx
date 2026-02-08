"use client";

import { motion } from "framer-motion";
import "./styles/LoginLeftPanel.css";

export default function LoginLeftPanel() {
  return (
    <div className="gradient-bg text-white p-8 md:p-12 md:w-2/5 flex flex-col justify-between relative overflow-hidden rounded-l-2xl shadow-2xl">
      <div className="relative z-10">
        <motion.div 
          className="flex items-center space-x-3 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div 
            className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center"
            animate={{ 
              y: [0, -10, 0],
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <i className="fas fa-ticket-alt text-2xl"></i>
          </motion.div>
          <h1 className="text-3xl font-bold tracking-tight">
            EventTicket<span className="text-blue-200">.edu</span>
          </h1>
        </motion.div>

        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          <div>
            <h2 className="text-4xl font-bold mb-4 leading-tight">
              Hệ thống quản lý<br />vé sự kiện
            </h2>
            <motion.div 
              className="w-20 h-1 bg-white/30 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: 80 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            />
          </div>

          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
          >
            <p className="text-blue-100 text-lg">
              Dành cho quản trị viên
            </p>
            <motion.div 
              className="flex items-center space-x-4 text-sm text-blue-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
            >
              <motion.div 
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <i className="fas fa-check-circle"></i>
                <span>An toàn & Bảo mật</span>
              </motion.div>
              <motion.div 
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <i className="fas fa-check-circle"></i>
                <span>Dễ sử dụng</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
