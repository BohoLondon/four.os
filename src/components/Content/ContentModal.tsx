import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, Users, Image, Video, FileText, MessageSquare } from 'lucide-react';
import { useData, ContentItem } from '../../contexts/DataContext';

interface ContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentId: string | null;
}

const ContentModal: React.FC<ContentModalProps> = ({ isOpen, onClose, contentId }) => {
  const { contentItems, projects, addContentItem, updateContentItem } = useData();
  const [formData, setFormData] = useState({
    title: '',
    type: 'Post' as 'Campaign' | 'Post' | 'Video' | 'Story' | 'Ad' | 'Email',
    status: 'Idea' as 'Idea' | 'Draft' | 'Review' | 'Approved' | 'Published' | 'Archived',
    scheduledDate: '',
    platform: [] as string[],
    script: {
      content: '',
      versions: []
    },
    visual: {
      thumbnail: 'https://images.pexels.com/photos/1667071/pexels-photo-1667071.jpeg?auto=compress&cs=tinysrgb&w=400',
      assets: [] as string[]
    },
    cta: '',
    assignee: '',
    projectId: '',
    deadline: ''
  });

  const isEditing = contentId !== null;
  const content = isEditing ? contentItems.find(c => c.id === contentId) : null;

  const platforms = ['Instagram', 'TikTok', 'Facebook', 'Twitter', 'LinkedIn', 'YouTube', 'Email', 'Website'];
  const contentTypes = [
    { id: 'Campaign', label: 'Campaign', icon: Image },
    { id: 'Post', label: 'Social Post', icon: MessageSquare },
    { id: 'Video', label: 'Video', icon: Video },
    { id: 'Story', label: 'Story', icon: Image },
    { id: 'Ad', label: 'Advertisement', icon: Image },
    { id: 'Email', label: 'Email', icon: FileText }
  ];

  useEffect(() => {
    if (isEditing && content) {
      setFormData({
        title: content.title,
        type: content.type,
        status: content.status,
        scheduledDate: content.scheduledDate || '',
        platform: content.platform,
        script: content.script,
        visual: content.visual,
        cta: content.cta,
        assignee: content.assignee,
        projectId: content.projectId || '',
        deadline: content.deadline || ''
      });
    } else {
      setFormData({
        title: '',
        type: 'Post',
        status: 'Idea',
        scheduledDate: '',
        platform: [],
        script: {
          content: '',
          versions: []
        },
        visual: {
          thumbnail: 'https://images.pexels.com/photos/1667071/pexels-photo-1667071.jpeg?auto=compress&cs=tinysrgb&w=400',
          assets: []
        },
        cta: '',
        assignee: '',
        projectId: '',
        deadline: ''
      });
    }
  }, [isEditing, content]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const contentData = {
      ...formData,
      deadline: formData.deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    if (isEditing && contentId) {
      updateContentItem(contentId, contentData);
    } else {
      addContentItem(contentData);
    }
    
    onClose();
  };

  const togglePlatform = (platform: string) => {
    setFormData(prev => ({
      ...prev,
      platform: prev.platform.includes(platform)
        ? prev.platform.filter(p => p !== platform)
        : [...prev.platform, platform]
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Approved':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Review':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Draft':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'Idea':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      case 'Archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {isEditing ? 'Edit Content' : 'Create Content'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white/20"
                placeholder="Content title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white/20"
              >
                {contentTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white/20"
              >
                <option value="Idea">Idea</option>
                <option value="Draft">Draft</option>
                <option value="Review">Review</option>
                <option value="Approved">Approved</option>
                <option value="Published">Published</option>
                <option value="Archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Assignee
              </label>
              <input
                type="text"
                value={formData.assignee}
                onChange={(e) => setFormData(prev => ({ ...prev, assignee: e.target.value }))}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white/20"
                placeholder="Assigned team member"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Project (Optional)
              </label>
              <select
                value={formData.projectId}
                onChange={(e) => setFormData(prev => ({ ...prev, projectId: e.target.value }))}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white/20"
              >
                <option value="">No project</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>{project.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Deadline
              </label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white/20"
              />
            </div>
          </div>

          {/* Platforms */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Platforms
            </label>
            <div className="flex flex-wrap gap-2">
              {platforms.map(platform => (
                <button
                  key={platform}
                  type="button"
                  onClick={() => togglePlatform(platform)}
                  className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                    formData.platform.includes(platform)
                      ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                  }`}
                >
                  {platform}
                </button>
              ))}
            </div>
          </div>

          {/* Content Script */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Content Script
            </label>
            <textarea
              value={formData.script.content}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                script: { ...prev.script, content: e.target.value }
              }))}
              rows={4}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white/20"
              placeholder="Write your content script here..."
            />
          </div>

          {/* CTA and Scheduling */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Call to Action
              </label>
              <input
                type="text"
                value={formData.cta}
                onChange={(e) => setFormData(prev => ({ ...prev, cta: e.target.value }))}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white/20"
                placeholder="e.g., Shop Now, Learn More"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Scheduled Date (Optional)
              </label>
              <input
                type="datetime-local"
                value={formData.scheduledDate}
                onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white/20"
              />
            </div>
          </div>

          {/* Visual Thumbnail */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Thumbnail URL
            </label>
            <input
              type="url"
              value={formData.visual.thumbnail}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                visual: { ...prev.visual, thumbnail: e.target.value }
              }))}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white/20"
              placeholder="https://example.com/image.jpg"
            />
            {formData.visual.thumbnail && (
              <div className="mt-2">
                <img
                  src={formData.visual.thumbnail}
                  alt="Thumbnail preview"
                  className="w-32 h-32 object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Update Content' : 'Create Content'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContentModal;