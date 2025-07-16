import React, { useState } from 'react';
import { Search, Filter, Grid, List, Heart, Eye, Download, Tag, Plus, Upload, Folder, MoreHorizontal, Edit, Trash2, Share, FolderPlus } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import FileUploadModal from './FileUploadModal';
import CreateFolderModal from './CreateFolderModal';

const ArchiveView: React.FC = () => {
  const { archiveItems, deleteArchiveItem, likeArchiveItem } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterType, setFilterType] = useState<'All' | 'Campaign' | 'Moodboard' | 'Deck' | 'Asset' | 'Prompt' | 'Code' | 'Sketch' | 'Inspiration'>('All');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [folders, setFolders] = useState<string[]>(['General', 'Campaigns', 'Branding', 'Web Design']);
  const [currentFolder, setCurrentFolder] = useState('All');

  // Filter items based on search, type, and folder
  const filteredItems = archiveItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'All' || item.type === filterType;
    const matchesFolder = currentFolder === 'All' || item.folder === currentFolder;
    return matchesSearch && matchesType && matchesFolder;
  });

  const handleCreateFolder = (folderName: string) => {
    if (!folders.includes(folderName)) {
      setFolders(prev => [...prev, folderName]);
    }
  };

  const handleDeleteItem = (itemId: string) => {
    deleteArchiveItem(itemId);
    setSelectedItem(null);
  };

  const handleLikeItem = (itemId: string) => {
    likeArchiveItem(itemId);
  };

  const handleDownload = (item: any) => {
    // In a real app, this would trigger a download
    const link = document.createElement('a');
    link.href = item.fileUrl;
    link.download = item.title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light text-gray-900 dark:text-white">Archive</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Your creative asset library</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsCreateFolderModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <FolderPlus className="w-4 h-4" />
            <span>New Folder</span>
          </button>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center space-x-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Upload</span>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid' 
                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list' 
                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Folder Navigation */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        <button
          onClick={() => setCurrentFolder('All')}
          className={`px-3 py-1 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${
            currentFolder === 'All'
              ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
          }`}
        >
          All Files
        </button>
        {folders.map(folder => (
          <button
            key={folder}
            onClick={() => setCurrentFolder(folder)}
            className={`px-3 py-1 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${
              currentFolder === folder
                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
            }`}
          >
            <Folder className="w-3 h-3 inline mr-1" />
            {folder}
          </button>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search archive..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white/20 transition-all duration-200"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
          className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white/20"
        >
          <option value="All">All Types</option>
          <option value="Campaign">Campaign</option>
          <option value="Moodboard">Moodboard</option>
          <option value="Deck">Deck</option>
          <option value="Asset">Asset</option>
          <option value="Prompt">Prompt</option>
          <option value="Code">Code</option>
          <option value="Sketch">Sketch</option>
          <option value="Inspiration">Inspiration</option>
        </select>
      </div>

      {/* Archive Grid */}
      <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
        {filteredItems.map((item) => (
          <div key={item.id} className={`bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 overflow-hidden ${viewMode === 'list' ? 'flex' : ''}`}>
            <div className={`${viewMode === 'list' ? 'w-48' : 'w-full'}`}>
              <div className={`${viewMode === 'list' ? 'h-32' : 'aspect-square'} bg-gray-100 dark:bg-gray-700 overflow-hidden`}>
                <img 
                  src={item.thumbnail} 
                  alt={item.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
            
            <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  {item.type}
                </span>
                  {item.isIP && (
                    <span className="px-1 py-0.5 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300 text-xs rounded">
                      IP
                    </span>
                  )}
                  {item.watermarked && (
                    <span className="px-1 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 text-xs rounded">
                      WM
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(item.date).toLocaleDateString()}
                </span>
              </div>
              
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">{item.title}</h3>
              
              {item.description && (
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                  {item.description}
                </p>
              )}
              
              <div className="flex flex-wrap gap-1 mb-3">
                {item.tags.map((tag, index) => (
                  <span key={index} className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-400 rounded-full">
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {item.folder}
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{item.views}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleLikeItem(item.id)}
                      className="flex items-center space-x-1 hover:text-red-500 transition-colors"
                    >
                      <Heart className="w-4 h-4" />
                    <span>{item.likes}</span>
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleDownload(item)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="Download"
                  >
                    <Download className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </button>
                  <button
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="Share"
                  >
                    <Share className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </button>
                  <div className="relative">
                    <button
                      onClick={() => setSelectedItem(selectedItem === item.id ? null : item.id)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <MoreHorizontal className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </button>
                    
                    {selectedItem === item.id && (
                      <div className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 min-w-48">
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2">
                          <Edit className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
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
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No files found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {searchTerm ? 'Try adjusting your search terms' : 'Get started by uploading your first file'}
          </p>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            Upload Files
          </button>
        </div>
      )}

      {/* Modals */}
      <FileUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />

      <CreateFolderModal
        isOpen={isCreateFolderModalOpen}
        onClose={() => setIsCreateFolderModalOpen(false)}
        onCreateFolder={handleCreateFolder}
      />
    </div>
  );
};

export default ArchiveView;