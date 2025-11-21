'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Pencil, Trash2, Plus, Eye, Calendar, FileText, CheckCircle } from 'lucide-react';

interface Article {
  id: number;
  title: string;
  slug: string;
  published_at: string;
  view_count: number;
  category_id?: number;
  status: 'DRAFT' | 'PUBLISHED';
}

type TabType = 'drafts' | 'published';

export default function AdminDashboard() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('drafts');
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  useEffect(() => {
    fetchArticles();
    setSelectedIds(new Set()); // Clear selection when switching tabs
  }, [activeTab]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/articles?status=${activeTab === 'drafts' ? 'DRAFT' : 'PUBLISHED'}`);
      const data = await res.json();
      setArticles(data.articles || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa bài viết này?')) return;

    try {
      const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchArticles();
      } else {
        alert('Có lỗi khi xóa bài viết!');
      }
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('Có lỗi khi xóa bài viết!');
    }
  };

  const handlePublish = async (id: number) => {
    if (!confirm('Xuất bản bài viết này?')) return;

    try {
      const res = await fetch(`/api/articles/${id}/publish`, { method: 'POST' });
      if (res.ok) {
        alert('Đã xuất bản bài viết!');
        fetchArticles();
      } else {
        alert('Có lỗi khi xuất bản bài viết!');
      }
    } catch (error) {
      console.error('Error publishing article:', error);
      alert('Có lỗi khi xuất bản bài viết!');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Bulk Actions Handlers
  const toggleSelectAll = () => {
    if (selectedIds.size === displayArticles.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(displayArticles.map(a => a.id)));
    }
  };

  const toggleSelectOne = (id: number) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleBulkPublish = async () => {
    if (selectedIds.size === 0) return;
    
    if (!confirm(`Xuất bản ${selectedIds.size} bài viết đã chọn?`)) return;

    setBulkActionLoading(true);
    try {
      const res = await fetch('/api/articles/bulk-publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selectedIds) }),
      });

      const data = await res.json();
      
      if (res.ok) {
        alert(data.message);
        setSelectedIds(new Set());
        fetchArticles();
      } else {
        alert('Có lỗi khi xuất bản bài viết!');
      }
    } catch (error) {
      console.error('Error bulk publishing:', error);
      alert('Có lỗi khi xuất bản bài viết!');
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    
    if (!confirm(`XÓA VĨNH VIỄN ${selectedIds.size} bài viết đã chọn? Hành động này không thể hoàn tác!`)) return;

    setBulkActionLoading(true);
    try {
      const res = await fetch('/api/articles/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selectedIds) }),
      });

      const data = await res.json();
      
      if (res.ok) {
        alert(data.message);
        setSelectedIds(new Set());
        fetchArticles();
      } else {
        alert('Có lỗi khi xóa bài viết!');
      }
    } catch (error) {
      console.error('Error bulk deleting:', error);
      alert('Có lỗi khi xóa bài viết!');
    } finally {
      setBulkActionLoading(false);
    }
  };

  const drafts = articles.filter(a => a.status === 'DRAFT');
  const published = articles.filter(a => a.status === 'PUBLISHED');
  const displayArticles = activeTab === 'drafts' ? drafts : published;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý Bài viết</h1>
            <p className="text-gray-600 mt-1">
              {drafts.length} bản nháp • {published.length} đã xuất bản
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/rss"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              RSS Manager
            </Link>
            <Link
              href="/editor/new"
              className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 flex items-center gap-2"
            >
              <Plus size={20} />
              Thêm bài viết
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Đăng xuất
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex gap-8">
            <button
              onClick={() => setActiveTab('drafts')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === 'drafts'
                  ? 'border-blue-700 text-blue-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText size={18} />
              Bản nháp ({drafts.length})
            </button>
            <button
              onClick={() => setActiveTab('published')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === 'published'
                  ? 'border-blue-700 text-blue-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <CheckCircle size={18} />
              Đã xuất bản ({published.length})
            </button>
          </nav>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Đang tải...</p>
          </div>
        ) : displayArticles.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 mb-4">
              {activeTab === 'drafts' 
                ? 'Chưa có bản nháp nào. Sử dụng RSS Manager để tạo bài viết tự động.'
                : 'Chưa có bài viết nào được xuất bản.'}
            </p>
            {activeTab === 'drafts' && (
              <Link
                href="/rss"
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Đến RSS Manager
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Floating Action Bar */}
            {selectedIds.size > 0 && (
              <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-4 z-50">
                <span className="font-medium">
                  Đã chọn {selectedIds.size} bài viết
                </span>
                <div className="flex gap-2">
                  {activeTab === 'drafts' && (
                    <button
                      onClick={handleBulkPublish}
                      disabled={bulkActionLoading}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg flex items-center gap-2 disabled:opacity-50"
                    >
                      <CheckCircle size={18} />
                      Xuất bản
                    </button>
                  )}
                  <button
                    onClick={handleBulkDelete}
                    disabled={bulkActionLoading}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg flex items-center gap-2 disabled:opacity-50"
                  >
                    <Trash2 size={18} />
                    Xóa
                  </button>
                  <button
                    onClick={() => setSelectedIds(new Set())}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedIds.size === displayArticles.length && displayArticles.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tiêu đề
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày tạo
                    </th>
                    {activeTab === 'published' && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Lượt xem
                      </th>
                    )}
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayArticles.map((article) => (
                  <tr 
                    key={article.id} 
                    className={`hover:bg-gray-50 ${selectedIds.has(article.id) ? 'bg-blue-50' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(article.id)}
                        onChange={() => toggleSelectOne(article.id)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {article.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        /{article.slug}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar size={16} className="mr-1" />
                        {new Date(article.published_at).toLocaleDateString('vi-VN')}
                      </div>
                    </td>
                    {activeTab === 'published' && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <Eye size={16} className="mr-1" />
                          {article.view_count}
                        </div>
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        {activeTab === 'drafts' && (
                          <button
                            onClick={() => handlePublish(article.id)}
                            className="text-green-600 hover:text-green-900 flex items-center gap-1"
                            title="Xuất bản"
                          >
                            <CheckCircle size={18} />
                          </button>
                        )}
                        {activeTab === 'published' && (
                          <Link
                            href={`/posts/${article.slug}`}
                            target="_blank"
                            className="text-gray-600 hover:text-gray-900"
                            title="Xem"
                          >
                            <Eye size={18} />
                          </Link>
                        )}
                        <Link
                          href={`/editor/${article.id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="Sửa"
                        >
                          <Pencil size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(article.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Xóa"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </>
        )}
      </div>
    </div>
  );
}
