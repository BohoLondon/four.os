import React, { useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal, Mail, Phone, MapPin, Edit, Trash2, Eye, Clock, Globe, MessageSquare, AlertTriangle, CheckCircle, User, FileText, DollarSign, X } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import ClientModal from './ClientModal';
import ClientDetailModal from './ClientDetailModal';

const ClientsView: React.FC = () => {
  const { clients, deleteClient, projects, invoices } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'New Lead' | 'In Progress' | 'Active' | 'Archived'>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showContactModal, setShowContactModal] = useState<string | null>(null);

  // Filter clients based on search and status
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.notes.brandKeywords.some(keyword => 
                           keyword.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    const matchesStatus = filterStatus === 'All' || client.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleDeleteClient = (clientId: string) => {
    deleteClient(clientId);
    setShowDeleteConfirm(null);
  };

  const handleContactClient = (client: any) => {
    setShowContactModal(client.id);
  };

  const getClientStats = (clientId: string) => {
    const clientProjects = projects.filter(p => p.clientId === clientId);
    const clientInvoices = invoices.filter(i => i.clientId === clientId);
    const totalRevenue = clientInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
    const activeProjects = clientProjects.filter(p => p.status !== 'Archived' && p.status !== 'Live').length;
    
    return {
      projects: clientProjects.length,
      activeProjects,
      revenue: totalRevenue,
      lastProject: clientProjects[clientProjects.length - 1]?.name || 'None',
      overdueInvoices: clientInvoices.filter(i => i.status === 'Overdue').length
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'New Lead':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getOnboardingStageColor = (stage: string) => {
    switch (stage) {
      case 'Complete':
        return 'text-green-600 dark:text-green-400';
      case 'Project Started':
        return 'text-blue-600 dark:text-blue-400';
      case 'Contract Signed':
        return 'text-purple-600 dark:text-purple-400';
      case 'Proposal Sent':
        return 'text-yellow-600 dark:text-yellow-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getCommunicationIcon = (method: string) => {
    switch (method) {
      case 'Email':
        return Mail;
      case 'Phone':
        return Phone;
      case 'Slack':
        return MessageSquare;
      case 'Teams':
        return MessageSquare;
      default:
        return Mail;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light text-gray-900 dark:text-white">Clients</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage relationships and client intelligence</p>
        </div>
        <button 
          onClick={() => {
            setSelectedClient(null);
            setIsModalOpen(true);
          }}
          className="flex items-center space-x-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Client</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-gray-500 dark:text-gray-400">Total Clients</span>
          </div>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">{clients.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm text-gray-500 dark:text-gray-400">Active</span>
          </div>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
            {clients.filter(c => c.status === 'Active').length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-gray-500 dark:text-gray-400">New Leads</span>
          </div>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
            {clients.filter(c => c.status === 'New Lead').length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-green-500" />
            <span className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</span>
          </div>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
            ${clients.reduce((sum, client) => sum + getClientStats(client.id).revenue, 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search clients, industries, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white/20 transition-all duration-200"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white/20"
        >
          <option value="All">All Status</option>
          <option value="New Lead">New Lead</option>
          <option value="In Progress">In Progress</option>
          <option value="Active">Active</option>
          <option value="Archived">Archived</option>
        </select>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => {
          const stats = getClientStats(client.id);
          const CommunicationIcon = getCommunicationIcon(client.contactInfo.preferredCommunication);
          
          return (
            <div key={client.id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={client.avatar}
                    alt={client.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{client.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{client.industry}</p>
                  </div>
                </div>
                <div className="relative">
                  <button 
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    onClick={() => setShowDeleteConfirm(showDeleteConfirm === client.id ? null : client.id)}
                  >
                    <MoreHorizontal className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </button>
                  
                  {showDeleteConfirm === client.id && (
                    <div className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 min-w-48">
                      <button
                        onClick={() => {
                          setSelectedClient(client.id);
                          setIsDetailModalOpen(true);
                          setShowDeleteConfirm(null);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Details</span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedClient(client.id);
                          setIsModalOpen(true);
                          setShowDeleteConfirm(null);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteClient(client.id)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 text-red-600 dark:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Status and Onboarding */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Status</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(client.status)}`}>
                    {client.status}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Onboarding</span>
                  <span className={`text-xs font-medium ${getOnboardingStageColor(client.onboardingStage)}`}>
                    {client.onboardingStage}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{stats.activeProjects}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Active Projects</p>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    ${(stats.revenue / 1000).toFixed(0)}K
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Revenue</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-sm">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-300">{client.contactInfo.timezone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <CommunicationIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-300">{client.contactInfo.preferredCommunication}</span>
                </div>
              </div>

              {/* Brand Keywords */}
              {client.notes.brandKeywords.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Brand Keywords</p>
                  <div className="flex flex-wrap gap-1">
                    {client.notes.brandKeywords.slice(0, 3).map((keyword, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 text-xs rounded-full">
                        {keyword}
                      </span>
                    ))}
                    {client.notes.brandKeywords.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                        +{client.notes.brandKeywords.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Alerts */}
              {stats.overdueInvoices > 0 && (
                <div className="mb-4 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                    <span className="text-xs text-red-700 dark:text-red-300">
                      {stats.overdueInvoices} overdue invoice{stats.overdueInvoices > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handleContactClient(client)}
                  className="flex-1 flex items-center justify-center space-x-2 py-2 bg-white dark:bg-white text-gray-900 dark:text-gray-900 border border-gray-200 dark:border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-100 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">Contact</span>
                </button>
                <button 
                  onClick={() => {
                    setSelectedClient(client.id);
                    setIsDetailModalOpen(true);
                  }}
                  className="flex-1 flex items-center justify-center space-x-2 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span className="text-sm">Details</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No clients found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first client'}
          </p>
          <button 
            onClick={() => {
              setSelectedClient(null);
              setIsModalOpen(true);
            }}
            className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            Add Client
          </button>
        </div>
      )}

      {/* Modals */}
      <ClientModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedClient(null);
        }}
        clientId={selectedClient}
      />

      <ClientDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedClient(null);
        }}
        clientId={selectedClient}
      />

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
            {(() => {
              const client = clients.find(c => c.id === showContactModal);
              if (!client) return null;
              
              return (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <img
                        src={client.avatar}
                        alt={client.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{client.name}</h2>
                        <p className="text-gray-500 dark:text-gray-400">{client.industry}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowContactModal(null)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <div className="flex items-center space-x-3 mb-3">
                        <Mail className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Email</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{client.contactInfo.email}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <a
                          href={`mailto:${client.contactInfo.email}`}
                          className="flex-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-center text-sm"
                        >
                          Send Email
                        </a>
                        <button
                          onClick={() => navigator.clipboard.writeText(client.contactInfo.email)}
                          className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors text-sm"
                        >
                          Copy
                        </button>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <div className="flex items-center space-x-3 mb-3">
                        <Phone className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Phone</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{client.contactInfo.phone}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <a
                          href={`tel:${client.contactInfo.phone}`}
                          className="flex-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-center text-sm"
                        >
                          Call Now
                        </a>
                        <button
                          onClick={() => navigator.clipboard.writeText(client.contactInfo.phone)}
                          className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors text-sm"
                        >
                          Copy
                        </button>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <div className="flex items-center space-x-3 mb-3">
                        <MapPin className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Address</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{client.contactInfo.address}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => navigator.clipboard.writeText(client.contactInfo.address)}
                        className="w-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors text-sm"
                      >
                        Copy Address
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
                        <Globe className="w-5 h-5 text-gray-500 dark:text-gray-400 mx-auto mb-1" />
                        <p className="text-xs text-gray-500 dark:text-gray-400">Timezone</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{client.contactInfo.timezone}</p>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
                        <MessageSquare className="w-5 h-5 text-gray-500 dark:text-gray-400 mx-auto mb-1" />
                        <p className="text-xs text-gray-500 dark:text-gray-400">Preferred</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{client.contactInfo.preferredCommunication}</p>
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsView;