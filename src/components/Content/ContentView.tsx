import React, { useState } from 'react';
import { Calendar, Plus, Video, Image, FileText, Users, Clock, Eye, Edit, Trash2, MoreHorizontal, Play, Share, CheckCircle } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import ContentModal from './ContentModal';

const ContentView: React.FC = () => {
  const { contentItems, deleteContentItem, updateContentItem } = useData();
  const [currentView, setCurrentView] = useState<'calendar' | 'content'>('calendar');
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<string | null>(null);
  const [showContentActions, setShowContentActions] = useState<string | null>(null);

  const handleDeleteContent = (contentId: string) => {
    deleteContentItem(contentId);
    setShowContentActions(null);
  };

  const handlePublishContent = (contentId: string) => {
    updateContentItem(contentId, { 
      status: 'Published',
      publishedDate: new Date().toISOString()
    });
    setShowContentActions(null);
  };

  const handleApproveContent = (contentId: string) => {
    updateContentItem(contentId, { status: 'Approved' });
    setShowContentActions(null);
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Video':
        return Video;
      case 'Post':
        return Image;
      case 'Email':
        return FileText;
      default:
        return FileText;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light text-gray-900 dark:text-white">Content Engine</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your content pipeline</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setCurrentView('calendar')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                currentView === 'calendar'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              Calendar
            </button>
            <button
              onClick={() => setCurrentView('content')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                currentView === 'content'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              Content
            </button>
          </div>
          <button 
            onClick={() => {
              setSelectedContent(null);
              setIsContentModalOpen(true);
            }}
            className="flex items-center space-x-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Content</span>
          </button>
        </div>
      </div>

      {currentView === 'calendar' ? (
        /* Calendar View */
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">January 2024</h2>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                &lt;
              </button>
              <button className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                &gt;
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-4 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-4">
            {Array.from({ length: 35 }, (_, i) => {
              const date = i - 6; // Start from last week of previous month
              const isCurrentMonth = date > 0 && date <= 31;
              const hasContent = contentItems.some(item => new Date(item.deadline).getDate() === date);
              
              return (
                <div
                  key={i}
                  className={`aspect-square p-2 border rounded-lg transition-colors ${
                    isCurrentMonth
                      ? 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      : 'bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-400'
                  }`}
                >
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {date > 0 && date <= 31 ? date : ''}
                  </div>
                  {hasContent && (
                    <div className="mt-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Content List View */
        <div className="space-y-4">
          {contentItems.map((item) => {
            const TypeIcon = getTypeIcon(item.type);
            return (
              <div key={item.id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                    <img 
                      src={item.thumbnail} 
                      alt={item.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <TypeIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">{item.type}</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <span>Platforms:</span>
                        <span>{item.platform.join(', ')}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{item.assignee}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(item.deadline).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{item.analytics.views.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    {item.script.content && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                          {item.script.content}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 relative">
                    {item.type === 'Video' && (
                      <button className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                        <Play className="w-4 h-4" />
                      </button>
                    )}
                    <button className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                      <Share className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setShowContentActions(showContentActions === item.id ? null : item.id)}
                      className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    
                    {showContentActions === item.id && (
                      <div className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 min-w-48">
                        <button
                          onClick={() => {
                            setSelectedContent(item.id);
                            setIsContentModalOpen(true);
                            setShowContentActions(null);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        {item.status === 'Review' && (
                          <button
                            onClick={() => handleApproveContent(item.id)}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 text-green-600 dark:text-green-400"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>Approve</span>
                          </button>
                        )}
                        {(item.status === 'Approved' || item.status === 'Draft') && (
                          <button
                            onClick={() => handlePublishContent(item.id)}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 text-blue-600 dark:text-blue-400"
                          >
                            <Calendar className="w-4 h-4" />
                            <span>Publish</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteContent(item.id)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 text-red-600 dark:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Content Modal */}
      <ContentModal
        isOpen={isContentModalOpen}
        onClose={() => {
          setIsContentModalOpen(false);
          setSelectedContent(null);
        }}
        contentId={selectedContent}
      />
    </div>
  );
};

export default ContentView;