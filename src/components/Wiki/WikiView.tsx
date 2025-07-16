import React, { useState } from 'react';
import { Search, Plus, BookOpen, Users, Shield, FileText, Palette, Settings } from 'lucide-react';

const WikiView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const wikiSections = [
    {
      id: 1,
      title: 'Brand Guidelines',
      description: 'FOUR visual identity, logo usage, color palette, typography',
      icon: Palette,
      lastUpdated: '2024-01-15',
      articles: 8
    },
    {
      id: 2,
      title: 'Client Onboarding',
      description: 'Standard procedures for new client intake and project setup',
      icon: Users,
      lastUpdated: '2024-01-12',
      articles: 12
    },
    {
      id: 3,
      title: 'Project Workflows',
      description: 'Step-by-step processes for different types of creative projects',
      icon: Settings,
      lastUpdated: '2024-01-10',
      articles: 15
    },
    {
      id: 4,
      title: 'Legal & Contracts',
      description: 'NDAs, contracts, IP rights, and legal documentation',
      icon: Shield,
      lastUpdated: '2024-01-08',
      articles: 6
    },
    {
      id: 5,
      title: 'Rate Cards',
      description: 'Pricing structures for different services and project types',
      icon: FileText,
      lastUpdated: '2024-01-05',
      articles: 4
    },
    {
      id: 6,
      title: 'Philosophy & Values',
      description: 'FOUR culture, values, tone of voice, and creative philosophy',
      icon: BookOpen,
      lastUpdated: '2024-01-03',
      articles: 10
    }
  ];

  const recentArticles = [
    {
      title: 'Logo Usage Guidelines',
      section: 'Brand Guidelines',
      lastUpdated: '2024-01-15',
      author: 'Sarah Chen'
    },
    {
      title: 'Client Brief Template',
      section: 'Client Onboarding',
      lastUpdated: '2024-01-12',
      author: 'Alex Morgan'
    },
    {
      title: 'Photography Workflow',
      section: 'Project Workflows',
      lastUpdated: '2024-01-10',
      author: 'Jordan Kim'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light text-gray-900 dark:text-white">Playbook</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Internal knowledge base and procedures</p>
        </div>
        <button className="flex items-center space-x-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
          <Plus className="w-4 h-4" />
          <span>New Article</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search playbook..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white/20 transition-all duration-200"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Sections */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Knowledge Sections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {wikiSections.map((section) => {
              const Icon = section.icon;
              return (
                <div key={section.id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{section.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{section.articles} articles</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{section.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Updated {new Date(section.lastUpdated).toLocaleDateString()}
                    </span>
                    <button className="text-xs text-gray-900 dark:text-white hover:underline">
                      Browse →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Updates</h2>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="space-y-4">
              {recentArticles.map((article, index) => (
                <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">{article.title}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{article.section}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      by {article.author}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(article.lastUpdated).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                Create New Article
              </button>
              <button className="w-full text-left px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                Upload Document
              </button>
              <button className="w-full text-left px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                Manage Permissions
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WikiView;