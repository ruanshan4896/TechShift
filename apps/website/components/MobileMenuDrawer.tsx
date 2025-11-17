'use client';

import Link from 'next/link';
import { X, Search } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface MenuItem {
  label: string;
  href: string;
  submenu?: { label: string; href: string }[];
}

interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
}

export default function MobileMenuDrawer({ isOpen, onClose, menuItems }: MobileMenuDrawerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      onClose();
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-screen w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <span className="text-xl font-bold text-blue-700">Menu</span>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <X size={24} className="text-gray-700" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm..."
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-700"
                >
                  <Search size={20} />
                </button>
              </div>
            </form>

            {/* Menu Items */}
            <nav className="space-y-2">
              {menuItems.map((item, index) => (
                <div key={index}>
                  {item.submenu ? (
                    <>
                      <div className="font-semibold text-gray-900 py-2 px-3 bg-gray-50 rounded-lg">
                        {item.label}
                      </div>
                      <div className="ml-4 mt-1 space-y-1">
                        {item.submenu.map((subItem, subIndex) => (
                          <Link
                            key={subIndex}
                            href={subItem.href}
                            className="block py-2 px-3 text-gray-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition"
                            onClick={onClose}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className="block py-2 px-3 text-gray-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg font-medium transition"
                      onClick={onClose}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}
