import React, { useState } from 'react';
import { TrendingUp, Users, FolderOpen, DollarSign, Calendar, Activity, ArrowRight, Edit, Save, X, Plus, Upload } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

interface DashboardOverviewProps {
  onNavigate?: (view: string) => void;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onNavigate }) => {
  const { clients, projects, invoices, contentItems, addClient, addProject } = useData();
  const [isEditingQuote, setIsEditingQuote] = useState(false);
  const [isEditingImages, setIsEditingImages] = useState(false);
  const [quote, setQuote] = useState("Design is not just what it looks like and feels like. Design is how it works.");
  const [quoteAuthor, setQuoteAuthor] = useState("Steve Jobs");
  const [inspirationImage, setInspirationImage] = useState("https://images.pexels.com/photos/1337380/pexels-photo-1337380.jpeg?auto=compress&cs=tinysrgb&w=400");
  const [moodImage, setMoodImage] = useState("https://images.pexels.com/photos/1667071/pexels-photo-1667071.jpeg?auto=compress&cs=tinysrgb&w=400");
  const [tempQuote, setTempQuote] = useState(quote);
  const [tempAuthor, setTempAuthor] = useState(quoteAuthor);
  const [tempInspirationImage, setTempInspirationImage] = useState(inspirationImage);
  const [tempMoodImage, setTempMoodImage] = useState(moodImage);
  const [showAllActivity, setShowAllActivity] = useState(false);

  // Calculate stats
  const activeProjects = projects.filter(p => p.status === 'Production' || p.status === 'Design').length;
  const totalClients = clients.length;
  const paidInvoices = invoices.filter(i => i.status === 'Paid');
  const monthlyRevenue = paidInvoices.reduce((sum, invoice) => {
    return sum + invoice.amount;
  }, 0);
  const thisMonthContent = contentItems.filter(item => {
    const itemDate = new Date(item.deadline || item.scheduledDate || new Date());
    const now = new Date();
    return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
  }).length;

  const stats = [
    { label: 'Active Projects', value: activeProjects.toString(), icon: FolderOpen, change: '+2', view: 'projects' },
    { label: 'Total Clients', value: totalClients.toString(), icon: Users, change: '+5', view: 'clients' },
    { label: 'Monthly Revenue', value: `$${(monthlyRevenue / 1000).toFixed(0)}K`, icon: DollarSign, change: '+12%', view: 'finance' },
    { label: 'This Month', value: thisMonthContent.toString(), icon: Calendar, change: '+3', view: 'content' },
  ];

  // Generate recent activity based on real data
  const generateRecentActivity = () => {
    const activities = [];
    
    // Add project activities
    projects.slice(0, 2).forEach(project => {
      activities.push({
        id: `project-${project.id}`,
        action: 'Project updated',
        client: project.client,
        time: '2 hours ago',
        type: 'project',
        targetId: project.id,
        targetView: 'projects'
      });
    });

    // Add invoice activities
    paidInvoices.slice(0, 1).forEach(invoice => {
      activities.push({
        id: `invoice-${invoice.id}`,
        action: 'Invoice paid',
        client: invoice.client,
        time: '4 hours ago',
        type: 'payment',
        targetId: invoice.id,
        targetView: 'finance'
      });
    });

    // Add client activities
    if (clients.length > 0) {
      activities.push({
        id: `client-${clients[clients.length - 1].id}`,
        action: 'New client added',
        client: clients[clients.length - 1].name,
        time: '6 hours ago',
        type: 'client',
        targetId: clients[clients.length - 1].id,
        targetView: 'clients'
      });
    }

    // Add content activities
    const publishedContent = contentItems.find(c => c.status === 'Published');
    if (publishedContent) {
      activities.push({
        id: `content-${publishedContent.id}`,
        action: 'Content published',
        client: publishedContent.title,
        time: '1 day ago',
        type: 'content',
        targetId: publishedContent.id,
        targetView: 'content'
      });
    }

    return activities.slice(0, showAllActivity ? 10 : 4);
  };

  const recentActivity = generateRecentActivity();

  // Get urgent items
  const urgentProjects = projects.filter(p => {
    const deadline = new Date(p.dueDate);
    const now = new Date();
    const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilDeadline <= 7 && p.status !== 'Live' && p.status !== 'Archived';
  });

  const overdueInvoices = invoices.filter(i => i.status === 'Overdue');

  const handleActivityClick = (activity: any) => {
    if (onNavigate) {
      onNavigate(activity.targetView);
    }
  };

  const handleStatClick = (view: string) => {
    if (onNavigate) {
      onNavigate(view);
    }
  };

  const handleSaveQuote = () => {
    setQuote(tempQuote);
    setQuoteAuthor(tempAuthor);
    setIsEditingQuote(false);
  };

  const handleCancelQuoteEdit = () => {
    setTempQuote(quote);
    setTempAuthor(quoteAuthor);
    setIsEditingQuote(false);
  };

  const handleSaveImages = () => {
    setInspirationImage(tempInspirationImage);
    setMoodImage(tempMoodImage);
    setIsEditingImages(false);
  };

  const handleCancelImageEdit = () => {
    setTempInspirationImage(inspirationImage);
    setTempMoodImage(moodImage);
    setIsEditingImages(false);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'project':
        if (onNavigate) {
          onNavigate('projects');
          // In a real implementation, you might also trigger a modal or specific action
        }
        break;
      case 'client':
        if (onNavigate) {
          onNavigate('clients');
        }
        break;
      case 'invoice':
        if (onNavigate) {
          onNavigate('finance');
        }
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light text-gray-900 dark:text-white">The Chamber</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Central intelligence overview</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 dark:text-gray-400">Today</p>
          <p className="text-lg font-medium text-gray-900 dark:text-white">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>

      {/* Urgent Alerts */}
      {(urgentProjects.length > 0 || overdueInvoices.length > 0) && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4">
          <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">Urgent Attention Required</h3>
          <div className="space-y-2">
            {urgentProjects.map(project => (
              <div 
                key={project.id} 
                className="flex items-center justify-between cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/30 p-2 rounded"
                onClick={() => handleStatClick('projects')}
              >
                <span className="text-sm text-red-700 dark:text-red-300">
                  Project "{project.name}" deadline approaching
                </span>
                <span className="text-xs text-red-600 dark:text-red-400">
                  Due: {new Date(project.dueDate).toLocaleDateString()}
                </span>
              </div>
            ))}
            {overdueInvoices.map(invoice => (
              <div 
                key={invoice.id} 
                className="flex items-center justify-between cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/30 p-2 rounded"
                onClick={() => handleStatClick('finance')}
              >
                <span className="text-sm text-red-700 dark:text-red-300">
                  Invoice {invoice.id} is overdue
                </span>
                <span className="text-xs text-red-600 dark:text-red-400">
                  ${invoice.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index} 
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => handleStatClick(stat.view)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
            </div>
            <button 
              onClick={() => setShowAllActivity(!showAllActivity)}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center space-x-1 transition-colors"
            >
              <span>{showAllActivity ? 'Show Less' : 'View All'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div 
                key={activity.id} 
                className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                onClick={() => handleActivityClick(activity)}
              >
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'project' ? 'bg-blue-500' :
                  activity.type === 'payment' ? 'bg-green-500' :
                  activity.type === 'client' ? 'bg-purple-500' :
                  'bg-orange-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.action}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{activity.client}</p>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</span>
              </div>
            ))}
            {recentActivity.length === 0 && (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No recent activity</p>
              </div>
            )}
          </div>
        </div>

        {/* Daily Inspiration & Quick Stats */}
        <div className="space-y-6">
          {/* Daily Inspiration */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Daily Inspiration</h2>
              </div>
              <button
                onClick={() => setIsEditingQuote(!isEditingQuote)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Edit className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                {isEditingQuote ? (
                  <div className="space-y-3">
                    <textarea
                      value={tempQuote}
                      onChange={(e) => setTempQuote(e.target.value)}
                      className="w-full p-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-gray-900 dark:text-white resize-none"
                      rows={3}
                      placeholder="Enter your daily quote..."
                    />
                    <input
                      type="text"
                      value={tempAuthor}
                      onChange={(e) => setTempAuthor(e.target.value)}
                      className="w-full p-2 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-gray-900 dark:text-white"
                      placeholder="Author name"
                    />
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleSaveQuote}
                        className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors"
                      >
                        <Save className="w-3 h-3" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={handleCancelQuoteEdit}
                        className="flex items-center space-x-1 px-3 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700 transition-colors"
                      >
                        <X className="w-3 h-3" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-gray-600 dark:text-gray-300 italic">"{quote}"</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">— {quoteAuthor}</p>
                  </>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative group">
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg overflow-hidden">
                    <img 
                      src={inspirationImage} 
                      alt="Inspiration" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                    <button
                      onClick={() => setIsEditingImages(true)}
                      className="opacity-0 group-hover:opacity-100 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-all duration-200"
                    >
                      <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>
                  <span className="absolute bottom-2 left-2 text-xs text-white bg-black bg-opacity-50 px-2 py-1 rounded">Inspiration</span>
                </div>
                <div className="relative group">
                  <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded-lg overflow-hidden">
                    <img 
                      src={moodImage} 
                      alt="Mood" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                    <button
                      onClick={() => setIsEditingImages(true)}
                      className="opacity-0 group-hover:opacity-100 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-all duration-200"
                    >
                      <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>
                  <span className="absolute bottom-2 left-2 text-xs text-white bg-black bg-opacity-50 px-2 py-1 rounded">Mood</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button 
                onClick={() => handleQuickAction('project')}
                className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-sm flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Project</span>
              </button>
              <button 
                onClick={() => handleQuickAction('client')}
                className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-sm flex items-center space-x-2"
              >
                <Users className="w-4 h-4" />
                <span>Add Client</span>
              </button>
              <button 
                onClick={() => handleQuickAction('invoice')}
                className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-sm flex items-center space-x-2"
              >
                <DollarSign className="w-4 h-4" />
                <span>Generate Invoice</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Image Edit Modal */}
      {isEditingImages && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Images</h3>
              <button
                onClick={handleCancelImageEdit}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Inspiration Image URL
                </label>
                <input
                  type="url"
                  value={tempInspirationImage}
                  onChange={(e) => setTempInspirationImage(e.target.value)}
                  className="w-full p-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-gray-900 dark:text-white"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mood Image URL
                </label>
                <input
                  type="url"
                  value={tempMoodImage}
                  onChange={(e) => setTempMoodImage(e.target.value)}
                  className="w-full p-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-gray-900 dark:text-white"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="flex items-center space-x-2 pt-4">
                <button
                  onClick={handleSaveImages}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </button>
                <button
                  onClick={handleCancelImageEdit}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardOverview;