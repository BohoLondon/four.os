import React from 'react';
import { TrendingUp, Users, FolderOpen, DollarSign, Calendar, Activity, ArrowRight } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

const DashboardOverview: React.FC = () => {
  const { clients, projects, invoices, contentItems } = useData();

  // Calculate stats
  const activeProjects = projects.filter(p => p.status === 'In Progress' || p.status === 'Review').length;
  const totalClients = clients.length;
  const paidInvoices = invoices.filter(i => i.status === 'Paid');
  const monthlyRevenue = paidInvoices.reduce((sum, invoice) => {
    return sum + invoice.amount;
  }, 0);
  const thisMonthContent = contentItems.filter(item => {
    const itemDate = new Date(item.deadline);
    const now = new Date();
    return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
  }).length;

  const stats = [
    { label: 'Active Projects', value: activeProjects.toString(), icon: FolderOpen, change: '+2' },
    { label: 'Total Clients', value: totalClients.toString(), icon: Users, change: '+5' },
    { label: 'Monthly Revenue', value: `$${(monthlyRevenue / 1000).toFixed(0)}K`, icon: DollarSign, change: '+12%' },
    { label: 'This Month', value: thisMonthContent.toString(), icon: Calendar, change: '+3' },
  ];

  // Recent activity based on real data
  const recentActivity = [
    { action: 'Project updated', client: projects[0]?.client || 'Unknown', time: '2 hours ago', type: 'project' },
    { action: 'Invoice paid', client: paidInvoices[0]?.client || 'Unknown', time: '4 hours ago', type: 'payment' },
    { action: 'New client added', client: clients[clients.length - 1]?.name || 'Unknown', time: '6 hours ago', type: 'client' },
    { action: 'Content published', client: contentItems.find(c => c.status === 'Published')?.title || 'Unknown', time: '1 day ago', type: 'content' },
  ];

  const todayQuote = "Design is not just what it looks like and feels like. Design is how it works.";

  // Get urgent items
  const urgentProjects = projects.filter(p => {
    const deadline = new Date(p.deadline);
    const now = new Date();
    const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilDeadline <= 7 && p.status !== 'Complete';
  });

  const overdueInvoices = invoices.filter(i => i.status === 'Overdue');

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
              <div key={project.id} className="flex items-center justify-between">
                <span className="text-sm text-red-700 dark:text-red-300">
                  Project "{project.name}" deadline approaching
                </span>
                <span className="text-xs text-red-600 dark:text-red-400">
                  Due: {new Date(project.deadline).toLocaleDateString()}
                </span>
              </div>
            ))}
            {overdueInvoices.map(invoice => (
              <div key={invoice.id} className="flex items-center justify-between">
                <span className="text-sm text-red-700 dark:text-red-300">
                  Invoice {invoice.id} is overdue
                </span>
                <span className="text-xs text-red-600 dark:text-red-400">
                  {invoice.amount}
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
            <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
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
            <button className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center space-x-1">
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer">
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
          </div>
        </div>

        {/* Daily Inspiration & Quick Stats */}
        <div className="space-y-6">
          {/* Daily Inspiration */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2 mb-6">
              <TrendingUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Daily Inspiration</h2>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <p className="text-sm text-gray-600 dark:text-gray-300 italic">"{todayQuote}"</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">— Steve Jobs</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg flex items-center justify-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Inspiration</span>
                </div>
                <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded-lg flex items-center justify-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Mood</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-sm">
                Create New Project
              </button>
              <button className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-sm">
                Add Client
              </button>
              <button className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-sm">
                Generate Invoice
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;