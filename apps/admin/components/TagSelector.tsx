'use client';

import { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';

interface Tag {
  id: number;
  name: string;
  slug: string;
}

interface TagSelectorProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
}

export default function TagSelector({ selectedTags, onChange }: TagSelectorProps) {
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const res = await fetch('/api/tags');
      const data = await res.json();
      setAllTags(data.tags || []);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const handleAddTag = (tagName: string) => {
    if (!selectedTags.includes(tagName)) {
      onChange([...selectedTags, tagName]);
    }
  };

  const handleRemoveTag = (tagName: string) => {
    onChange(selectedTags.filter(t => t !== tagName));
  };

  const handleCreateNewTag = () => {
    if (newTagName.trim() && !selectedTags.includes(newTagName.trim())) {
      onChange([...selectedTags, newTagName.trim()]);
      setNewTagName('');
      setShowInput(false);
    }
  };

  const availableTags = allTags.filter(tag => !selectedTags.includes(tag.name));

  return (
    <div className="space-y-3">
      {/* Selected Tags */}
      <div className="flex flex-wrap gap-2">
        {selectedTags.map((tagName) => (
          <span
            key={tagName}
            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
          >
            {tagName}
            <button
              type="button"
              onClick={() => handleRemoveTag(tagName)}
              className="hover:text-blue-900"
            >
              <X size={14} />
            </button>
          </span>
        ))}
        {selectedTags.length === 0 && (
          <span className="text-sm text-gray-500">Chưa có tag nào được chọn</span>
        )}
      </div>

      {/* Available Tags */}
      {availableTags.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Tags có sẵn:</p>
          <div className="flex flex-wrap gap-2">
            {availableTags.slice(0, 20).map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => handleAddTag(tag.name)}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200"
              >
                + {tag.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Add New Tag */}
      <div>
        {showInput ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateNewTag()}
              placeholder="Tên tag mới..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              autoFocus
            />
            <button
              type="button"
              onClick={handleCreateNewTag}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              Thêm
            </button>
            <button
              type="button"
              onClick={() => {
                setShowInput(false);
                setNewTagName('');
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
            >
              Hủy
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowInput(true)}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
          >
            <Plus size={16} />
            Tạo tag mới
          </button>
        )}
      </div>
    </div>
  );
}
