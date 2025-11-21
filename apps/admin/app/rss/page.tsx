'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface RssSource {
  id: number;
  name: string;
  rss_url: string;
  is_active: boolean;
}

export default function RssAdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sources, setSources] = useState<RssSource[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', rss_url: '', is_active: true });

  useEffect(() => {
    if (isAuthenticated) {
      fetchSources();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        setIsAuthenticated(true);
      } else {
        alert('Mật khẩu không đúng!');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Lỗi đăng nhập. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSources = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/rss-sources');
      const data = await res.json();
      setSources(data.sources || []);
    } catch (error) {
      console.error('Error fetching sources:', error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingId ? `/api/rss-sources/${editingId}` : '/api/rss-sources';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormData({ name: '', rss_url: '', is_active: true });
        setEditingId(null);
        fetchSources();
      } else {
        alert('Có lỗi xảy ra!');
      }
    } catch (error) {
      console.error('Error saving source:', error);
      alert('Có lỗi xảy ra!');
    }
    setLoading(false);
  };

  const handleEdit = (source: RssSource) => {
    setEditingId(source.id);
    setFormData({
      name: source.name,
      rss_url: source.rss_url,
      is_active: source.is_active,
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa nguồn RSS này?')) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/rss-sources/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchSources();
      }
    } catch (error) {
      console.error('Error deleting source:', error);
    }
    setLoading(false);
  };

  const handleTestFetch = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/fetch-rss', {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET || 'test-secret'}`,
        },
      });
      const data = await res.json();
      alert(`Đã fetch: ${data.totalNew} bài viết mới từ ${data.sources?.length || 0} nguồn`);
    } catch (error) {
      alert('Có lỗi khi fetch RSS!');
    }
    setLoading(false);
  };

  const handleTestProcess = async () => {
    if (!confirm('Xử lý bài viết với AI sẽ tốn API credits. Bạn có chắc?')) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/process-articles', {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET || 'test-secret'}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        const successCount = data.results?.filter((r: any) => r.status === 'success').length || 0;
        const failedCount = data.results?.filter((r: any) => r.status === 'failed').length || 0;
        alert(
          `✓ Hoàn thành!\n\n` +
          `Thành công: ${successCount} bài\n` +
          `Thất bại: ${failedCount} bài\n\n` +
          `Xem bài viết mới tại trang chủ hoặc Admin Dashboard.`
        );
      } else {
        alert(`Lỗi: ${data.error}`);
      }
    } catch (error) {
      alert('Có lỗi khi xử lý bài viết!');
    }
    setLoading(false);
  };

  const handleFetchAndProcess = async (sourceId: number) => {
    if (!confirm('Fetch và xử lý 10 bài viết mới nhất từ nguồn này với AI?\n\nLưu ý: Sẽ tốn API credits.')) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/process-rss/${sourceId}`, {
        method: 'POST',
      });
      const data = await res.json();
      
      if (data.success) {
        alert(
          `✓ ${data.message}\n\n` +
          `Tổng số: ${data.totalFetched} bài\n` +
          `Đã xử lý: ${data.processed} bài\n` +
          `Bỏ qua: ${data.skipped} bài\n` +
          `Lỗi: ${data.errors} bài\n\n` +
          `Các bài viết mới đã được lưu dưới dạng bản nháp.\n` +
          `Vào Dashboard để xem và xuất bản.`
        );
      } else {
        alert(`Lỗi: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Có lỗi khi xử lý RSS!');
    }
    setLoading(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Đăng nhập Admin</h1>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
            />
            <button
              type="submit"
              className="w-full bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800"
            >
              Đăng nhập
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Quản lý RSS Sources</h1>
            <Link href="/" className="text-blue-700 hover:text-blue-900 font-semibold">
              ← Về trang chủ
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingId ? 'Sửa nguồn RSS' : 'Thêm nguồn RSS mới'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">
                  Tên nguồn
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">
                  RSS URL
                </label>
                <input
                  type="url"
                  value={formData.rss_url}
                  onChange={(e) => setFormData({ ...formData, rss_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="mr-2"
                />
                <label className="text-sm font-medium text-gray-800">Kích hoạt</label>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800 disabled:opacity-50"
                >
                  {editingId ? 'Cập nhật' : 'Thêm mới'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setFormData({ name: '', rss_url: '', is_active: true });
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                )}
              </div>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
              <button
                onClick={handleTestFetch}
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 font-semibold"
              >
                🔄 Fetch RSS Now
              </button>
              <button
                onClick={handleTestProcess}
                disabled={loading}
                className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 font-semibold"
              >
                🤖 Process with AI
              </button>
              <Link
                href="/dashboard"
                className="block w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 text-center font-semibold"
              >
                📝 Manage Articles
              </Link>
            </div>
          </div>

          {/* List */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Danh sách nguồn ({sources.length})
            </h2>
            {loading && <p className="text-gray-700">Đang tải...</p>}
            <div className="space-y-3">
              {sources.map((source) => (
                <div
                  key={source.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{source.name}</h3>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        source.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {source.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-3 break-all">{source.rss_url}</p>
                  <div className="flex gap-2 flex-wrap">
                    {source.is_active && (
                      <button
                        onClick={() => handleFetchAndProcess(source.id)}
                        disabled={loading}
                        className="text-sm bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 disabled:opacity-50 font-medium"
                      >
                        🤖 Fetch & Process
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(source)}
                      className="text-sm text-blue-700 hover:text-blue-900 font-medium"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(source.id)}
                      className="text-sm text-red-600 hover:text-red-800 font-medium"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
