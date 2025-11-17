import Link from 'next/link';
import { Facebook, Twitter, Youtube, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Tech News</h3>
            <p className="text-sm leading-relaxed">
              Website tin tức công nghệ hàng đầu Việt Nam. Cập nhật tin tức mới nhất về AI, 
              Mobile, PC & Hardware và nhiều hơn nữa. Nội dung được tạo tự động bởi AI.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Liên kết hữu ích</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/category/ai" className="hover:text-white transition">
                  AI & Machine Learning
                </Link>
              </li>
              <li>
                <Link href="/category/mobile" className="hover:text-white transition">
                  Mobile & Smartphone
                </Link>
              </li>
              <li>
                <Link href="/category/pc-hardware" className="hover:text-white transition">
                  PC & Hardware
                </Link>
              </li>
              <li>
                <Link href="/category/internet" className="hover:text-white transition">
                  Internet & Cloud
                </Link>
              </li>
              <li>
                <Link href="/admin/rss" className="hover:text-white transition">
                  Quản trị
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Theo dõi chúng tôi</h3>
            <div className="flex space-x-4 mb-4">
              <a 
                href="#" 
                className="hover:text-white transition"
                aria-label="Facebook"
              >
                <Facebook size={24} />
              </a>
              <a 
                href="#" 
                className="hover:text-white transition"
                aria-label="Twitter"
              >
                <Twitter size={24} />
              </a>
              <a 
                href="#" 
                className="hover:text-white transition"
                aria-label="Youtube"
              >
                <Youtube size={24} />
              </a>
              <a 
                href="#" 
                className="hover:text-white transition"
                aria-label="Email"
              >
                <Mail size={24} />
              </a>
            </div>
            <p className="text-sm">
              Email: contact@technews.vn
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {currentYear} Tech News. All rights reserved.</p>
          <p className="mt-2 text-gray-500">
            Powered by Next.js, Gemini AI & Neon Database
          </p>
        </div>
      </div>
    </footer>
  );
}
