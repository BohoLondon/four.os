import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, CreditCard, FileText, AlertCircle, Plus, Download, Eye, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import InvoiceModal from './InvoiceModal';
import { useState } from 'react';

const FinanceView: React.FC = () => {
  const { invoices, expenses, deleteInvoice, updateInvoice } = useData();
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const [showInvoiceActions, setShowInvoiceActions] = useState<string | null>(null);

  // Calculate metrics from real data
  const paidInvoices = invoices.filter(i => i.status === 'Paid');
  const monthlyRevenue = paidInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const outstandingInvoices = invoices.filter(i => i.status === 'Sent' || i.status === 'Overdue');
  const outstandingAmount = outstandingInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const averageProjectValue = invoices.length > 0 ? invoices.reduce((sum, invoice) => sum + invoice.amount, 0) / invoices.length : 0;
  const monthlyExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const financialMetrics = [
    {
      label: 'Monthly Revenue',
      value: `$${(monthlyRevenue / 1000).toFixed(0)}K`,
      change: '+12%',
      changeType: 'positive',
      icon: DollarSign
    },
    {
      label: 'Outstanding Invoices',
      value: `$${(outstandingAmount / 1000).toFixed(0)}K`,
      change: '-8%',
      changeType: 'negative',
      icon: FileText
    },
    {
      label: 'Average Project Value',
      value: `$${(averageProjectValue / 1000).toFixed(1)}K`,
      change: '+5%',
      changeType: 'positive',
      icon: TrendingUp
    },
    {
      label: 'Monthly Expenses',
      value: `$${(monthlyExpenses / 1000).toFixed(0)}K`,
      change: '+3%',
      changeType: 'neutral',
      icon: CreditCard
    }
  ];

  const recentInvoices = invoices.slice(0, 5);
  const overdueInvoices = invoices.filter(i => i.status === 'Overdue');

  const handleDeleteInvoice = (invoiceId: string) => {
    deleteInvoice(invoiceId);
    setShowInvoiceActions(null);
  };

  const handleMarkAsPaid = (invoiceId: string) => {
    updateInvoice(invoiceId, { 
      status: 'Paid',
      paidDate: new Date().toISOString().split('T')[0]
    });
    setShowInvoiceActions(null);
  };

  const handleSendInvoice = (invoiceId: string) => {
    updateInvoice(invoiceId, { status: 'Sent' });
    setShowInvoiceActions(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Sent':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'Draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      case 'Cancelled':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
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
            <Download className="w-4 h-4 inline mr-2" />
            Export Report
          </button>
          <button 
            onClick={() => {
              setSelectedInvoice(null);
              setIsInvoiceModalOpen(true);
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            <Plus className="w-4 h-4" />
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
          <div className="space-y-3">
            {recentInvoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{invoice.id}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{invoice.client}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Due: {new Date(invoice.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    ${invoice.amount.toLocaleString()}
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setShowInvoiceActions(showInvoiceActions === invoice.id ? null : invoice.id)}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    <MoreHorizontal className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </button>
                  
                  {showInvoiceActions === invoice.id && (
                    <div className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 min-w-48">
                      <button className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2">
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedInvoice(invoice.id);
                          setIsInvoiceModalOpen(true);
                          setShowInvoiceActions(null);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      {invoice.status === 'Draft' && (
                        <button
                          onClick={() => handleSendInvoice(invoice.id)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2"
                        >
                          <FileText className="w-4 h-4" />
                          <span>Send</span>
                        </button>
                      )}
                      {(invoice.status === 'Sent' || invoice.status === 'Overdue') && (
                        <button
                          onClick={() => handleMarkAsPaid(invoice.id)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 text-green-600 dark:text-green-400"
                        >
                          <DollarSign className="w-4 h-4" />
                          <span>Mark as Paid</span>
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteInvoice(invoice.id)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 text-red-600 dark:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
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
      {overdueInvoices.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <div>
              <h3 className="font-medium text-red-800 dark:text-red-200">Overdue Invoices</h3>
              <p className="text-sm text-red-700 dark:text-red-300">
                You have {overdueInvoices.length} overdue invoice{overdueInvoices.length > 1 ? 's' : ''} totaling ${overdueInvoices.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}. Consider following up with clients.
              </p>
              <div className="mt-2 space-y-1">
                {overdueInvoices.map(invoice => (
                  <p key={invoice.id} className="text-xs text-red-600 dark:text-red-400">
                    {invoice.id} - {invoice.client} - ${invoice.amount.toLocaleString()}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      <InvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => {
          setIsInvoiceModalOpen(false);
          setSelectedInvoice(null);
        }}
        invoiceId={selectedInvoice}
      />
      </div>
  );
};

export default FinanceView;