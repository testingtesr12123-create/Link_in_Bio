import { useState } from 'react';
import { Link } from '../lib/supabase';
import { linkService } from '../services/linkService';
import { Plus, Trash2, GripVertical, Eye, EyeOff, Edit2, X, Check } from 'lucide-react';
import * as Icons from 'lucide-react';

interface LinkManagerProps {
  profileId: string;
  links: Link[];
  onLinksUpdate: (links: Link[]) => void;
}

export default function LinkManager({ profileId, links, onLinksUpdate }: LinkManagerProps) {
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    icon: 'Link'
  });

  const iconOptions = ['Link', 'Instagram', 'Twitter', 'Facebook', 'Youtube', 'Github', 'Linkedin', 'Mail', 'Phone', 'Globe', 'Music', 'Video', 'ShoppingCart', 'Coffee'];

  const handleAddLink = async () => {
    if (!formData.title || !formData.url) return;

    try {
      const newLink = await linkService.createLink({
        user_id: profileId,
        title: formData.title,
        url: formData.url,
        icon: formData.icon,
        order_index: links.length,
        is_active: true
      });

      onLinksUpdate([...links, newLink]);
      setFormData({ title: '', url: '', icon: 'Link' });
      setIsAdding(false);
    } catch (error) {
      console.error('Error adding link:', error);
    }
  };

  const handleUpdateLink = async () => {
    if (!editingLink) return;

    try {
      const updated = await linkService.updateLink(editingLink.id, {
        title: editingLink.title,
        url: editingLink.url,
        icon: editingLink.icon
      });

      onLinksUpdate(links.map(l => l.id === updated.id ? updated : l));
      setEditingLink(null);
    } catch (error) {
      console.error('Error updating link:', error);
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return;

    try {
      await linkService.deleteLink(linkId);
      const updatedLinks = links.filter(l => l.id !== linkId);
      await reorderAfterDelete(updatedLinks);
      onLinksUpdate(updatedLinks);
    } catch (error) {
      console.error('Error deleting link:', error);
    }
  };

  const handleToggleActive = async (link: Link) => {
    try {
      const updated = await linkService.updateLink(link.id, {
        is_active: !link.is_active
      });
      onLinksUpdate(links.map(l => l.id === updated.id ? updated : l));
    } catch (error) {
      console.error('Error toggling link:', error);
    }
  };

  const reorderAfterDelete = async (updatedLinks: Link[]) => {
    const reordered = updatedLinks.map((link, index) => ({
      id: link.id,
      order_index: index
    }));
    await linkService.reorderLinks(reordered);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newLinks = [...links];
    const draggedLink = newLinks[draggedIndex];
    newLinks.splice(draggedIndex, 1);
    newLinks.splice(index, 0, draggedLink);

    setDraggedIndex(index);
    onLinksUpdate(newLinks);
  };

  const handleDragEnd = async () => {
    if (draggedIndex === null) return;

    const reordered = links.map((link, index) => ({
      id: link.id,
      order_index: index
    }));

    try {
      await linkService.reorderLinks(reordered);
    } catch (error) {
      console.error('Error reordering links:', error);
    }

    setDraggedIndex(null);
  };

  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName] || Icons.Link;
    return IconComponent;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Manage Links</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Link
        </button>
      </div>

      {isAdding && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="My Website"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
              <select
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {iconOptions.map(icon => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddLink}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setFormData({ title: '', url: '', icon: 'Link' });
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {links.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-600">No links yet. Add your first link to get started!</p>
          </div>
        ) : (
          links.map((link, index) => {
            const Icon = getIcon(link.icon);
            const isEditing = editingLink?.id === link.id;

            return (
              <div
                key={link.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`bg-white border border-gray-200 rounded-lg p-4 transition-all ${
                  draggedIndex === index ? 'opacity-50' : ''
                } ${!link.is_active ? 'opacity-60' : ''}`}
              >
                {isEditing ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editingLink.title}
                      onChange={(e) => setEditingLink({ ...editingLink, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="url"
                      value={editingLink.url}
                      onChange={(e) => setEditingLink({ ...editingLink, url: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <select
                      value={editingLink.icon}
                      onChange={(e) => setEditingLink({ ...editingLink, icon: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {iconOptions.map(icon => (
                        <option key={icon} value={icon}>{icon}</option>
                      ))}
                    </select>
                    <div className="flex gap-2">
                      <button
                        onClick={handleUpdateLink}
                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Check className="w-4 h-4" />
                        Save
                      </button>
                      <button
                        onClick={() => setEditingLink(null)}
                        className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <button className="cursor-move text-gray-400 hover:text-gray-600">
                      <GripVertical className="w-5 h-5" />
                    </button>
                    <Icon className="w-5 h-5 text-gray-600" />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{link.title}</h3>
                      <p className="text-sm text-gray-500 truncate">{link.url}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">{link.click_count} clicks</span>
                      <button
                        onClick={() => handleToggleActive(link)}
                        className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                        title={link.is_active ? 'Hide link' : 'Show link'}
                      >
                        {link.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => setEditingLink(link)}
                        className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteLink(link.id)}
                        className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
