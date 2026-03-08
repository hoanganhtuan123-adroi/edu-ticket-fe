import React from 'react';
import { Facebook, Instagram, Twitter, Youtube, Send } from 'lucide-react';
import Link from 'next/link';

const DashboardFooter = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-purple-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">ET</span>
              </div>
              <span className="font-bold text-xl">Edu Ticket</span>
            </div>
            <p className="text-gray-400 text-sm">Nền tảng sự kiện hàng đầu.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="#" className="hover:text-white transition-colors">Sự kiện nổi bật</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Sự kiện sắp diễn ra</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Sự kiện miễn phí</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Tạo sự kiện</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Hỗ trợ</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="#" className="hover:text-white transition-colors">Trung tâm trợ giúp</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Câu hỏi thường gặp</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Liên hệ với chúng tôi</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Chính sách hoàn tiền</Link></li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="font-semibold mb-4">Theo dõi chúng tôi</h3>
            <div className="flex space-x-3 mb-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
            <div className="flex">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="bg-gray-800 text-white px-4 py-2 rounded-l-lg flex-1 focus:outline-none focus:bg-gray-700"
              />
              <button className="bg-purple-700 px-4 py-2 rounded-r-lg hover:bg-purple-800 transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>© 2023 Edu Ticket. Tất cả các quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
};

export default DashboardFooter;
