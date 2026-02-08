"use client";

import { useAuth } from "@/hooks/useAuth";
import PasswordInput from "./PasswordInput"
import { motion } from "framer-motion";

export default function LoginForm() {
  const { email, password, setEmail, setPassword, submit, isLoading } =
    useAuth();

  return (
    <div className="bg-white p-6 sm:p-8 lg:p-12 lg:w-3/5 rounded-r-2xl lg:rounded-r-2xl shadow-2xl flex-1">
      <div className="max-w-md mx-auto w-full">
        <motion.div 
          className="text-center mb-6 sm:mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div 
            className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-linear-to-br from-green-500 to-teal-600 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 shadow-lg"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            <i className="fas fa-calendar-alt text-white text-lg sm:text-2xl"></i>
          </motion.div>
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            Đăng nhập tài khoản
          </h3>
          <p className="text-gray-600 text-sm sm:text-base px-2">
            Chào mừng nhà tổ chức! Vui lòng đăng nhập để quản lý sự kiện
          </p>
        </motion.div>

        <motion.form 
          onSubmit={submit} 
          className="space-y-4 sm:space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          >
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                <i className="fas fa-user text-gray-400 text-sm sm:text-base"></i>
              </div>
              <motion.input
                id="email"
                type="email"
                className="w-full pl-9 sm:pl-12 pr-4 py-3 sm:py-4 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:border-green-500 focus:outline-none transition-all duration-300 hover:border-gray-300 text-sm sm:text-base"
                placeholder="Nhập email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              />
            </div>
          </motion.div>

          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          >
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Mật khẩu
            </label>
            <PasswordInput value={password} onChange={setPassword} />
          </motion.div>

          <motion.div 
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
          >
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                Ghi nhớ đăng nhập
              </label>
            </div>
            <motion.a 
              href="#" 
              className="text-sm text-green-600 hover:text-green-500 transition-colors text-center sm:text-left"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              Quên mật khẩu?
            </motion.a>
          </motion.div>

          <motion.button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 sm:py-4 rounded-xl text-white font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 bg-linear-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
          >
            <span className="flex items-center justify-center space-x-2">
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-sm sm:text-base">Đang đăng nhập...</span>
                </>
              ) : (
                <>
                  <span className="text-sm sm:text-base">Đăng nhập</span>
                  <motion.i 
                    className="fas fa-arrow-right"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  />
                </>
              )}
            </span>
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
}
