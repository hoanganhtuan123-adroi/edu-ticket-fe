"use client";

import { motion } from "framer-motion";

export default function LoginLeftPanel() {
  return (
    <div 
      className="text-white p-6 sm:p-8 lg:p-12 lg:w-2/5 flex flex-col justify-between relative overflow-hidden rounded-l-2xl lg:rounded-l-2xl shadow-2xl flex-1 lg:flex-initial"
      style={{
        background: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
        position: 'relative'
      }}
    >
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />
      <div className="relative z-10">
        <motion.div 
          className="flex items-center space-x-2 sm:space-x-3 mb-6 sm:mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div 
            className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center overflow-hidden"
            animate={{ 
              y: [0, -10, 0],
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <img 
              src="/logo.png" 
              alt="EventTicket.edu" 
              className="w-full h-full object-contain p-2"
            />
          </motion.div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            EventTicket<span className="text-green-200">.edu</span>
          </h1>
        </motion.div>

        <motion.div 
          className="space-y-4 sm:space-y-6"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 leading-tight">
              Tổ chức sự kiện<br />chuyên nghiệp
            </h2>
            <motion.div 
              className="w-16 sm:w-20 h-1 bg-white/30 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: 64 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            />
          </div>

          <motion.div 
            className="space-y-3 sm:space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
          >
            <p className="text-green-100 text-base sm:text-lg">
              Dành cho nhà tổ chức sự kiện
            </p>
            <motion.div 
              className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-green-200 space-y-2 sm:space-y-0"
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
                <span className="text-xs sm:text-sm">Quản lý vé dễ dàng</span>
              </motion.div>
              <motion.div 
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <i className="fas fa-check-circle"></i>
                <span className="text-xs sm:text-sm">Theo dõi doanh thu</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
