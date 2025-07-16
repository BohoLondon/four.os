import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, CreditCard, FileText, AlertCircle } from 'lucide-react';

const FinanceView: React.FC = () => {
  const financialMetrics = [
    {
      label: 'Monthly Revenue',
      value: '$156,000',
      change: '+12%',
      changeType: 'positive',
      icon: DollarSign
    },
    {
      label: 'Outstanding Invoices',
      value: '$42,000',
      change: '-8%',
      changeType: 'negative',
      icon: FileText
    },
    {
      label: 'Average Project Value',
      value: '$18,500',
      change: '+5%',
      changeType: 'positive',
      icon: TrendingUp
    },
    {
      label: 'Monthly Expenses',
      value: '$28,000',
      change: '+3%',
      changeType: 'neutral',
      icon: CreditCard
    }
  ];

  const recentInvoices = [
    {
      id: 'INV-001',
      client: 'Maison Luxe',
      amount: '$25,000',
      status: 'Paid',
      date: '2024-01-15'
    },
    {
      id: 'INV-002',
      client: 'Atelier Modern',
      amount: '$18,500',
      status: 'Pending',
      date: '2024-01-12'
    },
    {
      id: 'INV-003',
      client: 'Studio Noir',
      amount: '$12,000',
      status: 'Overdue',
      date: '2024-01-08'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light text-gray-900 dark:text-white">Finance</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Financial overview and management</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Export Report
          </button>
          <button className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
            New Invoice
          </button>
        </div>
      </div>

      {/* Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {financialMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
                <span className={`text-sm font-medium ${
                  metric.changeType === 'positive' 
                    ? 'text-green-600 dark:text-green-400'
                    : metric.changeType === 'negative'
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {metric.change}
                </span>
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{metric.value}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{metric.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Invoices */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Recent Invoices</h2>
          <div className="space-y-4">
            {recentInvoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{invoice.id}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{invoice.client}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">{invoice.amount}</p>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Chart Placeholder */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Revenue Trend</h2>
          <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400">Chart visualization would go here</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-6">
        <div className="flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          <div>
            <h3 className="font-medium text-yellow-800 dark:text-yellow-200">Payment Reminder</h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              You have 2 overdue invoices totaling $30,000. Consider following up with clients.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceView;