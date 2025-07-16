import React, { useState } from 'react';
import { Bot, Send, Lightbulb, FileText, MessageSquare, Sparkles, Copy, RefreshCw } from 'lucide-react';

const AIView: React.FC = () => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const aiTools = [
    {
      id: 1,
      title: 'Proposal Generator',
      description: 'Generate client proposals based on brief and requirements',
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      id: 2,
      title: 'Creative Brief Assistant',
      description: 'Help structure and refine creative briefs',
      icon: Lightbulb,
      color: 'bg-green-500'
    },
    {
      id: 3,
      title: 'Content Writer',
      description: 'Create copy that matches FOUR tone and style',
      icon: MessageSquare,
      color: 'bg-purple-500'
    },
    {
      id: 4,
      title: 'Invoice Creator',
      description: 'Generate professional invoices with branding',
      icon: FileText,
      color: 'bg-orange-500'
    }
  ];

  const chatHistory = [
    {
      role: 'user',
      message: 'Generate a proposal for a luxury fashion brand rebrand project'
    },
    {
      role: 'ai',
      message: 'I\'ll help you create a comprehensive proposal for a luxury fashion brand rebrand. Based on FOUR\'s expertise and positioning, here\'s a structured proposal:\n\n**Project Overview:**\nLuxury Fashion Brand Identity Transformation\n\n**Scope of Work:**\n• Brand strategy and positioning\n• Visual identity development\n• Brand guidelines creation\n• Digital asset development\n\n**Timeline:** 8-12 weeks\n**Investment:** $45,000 - $65,000\n\nWould you like me to elaborate on any specific section?'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setMessage('');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light text-gray-900 dark:text-white">AI Lab</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Your intelligent creative assistant</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 rounded-full text-sm font-medium">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>AI Online</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Tools */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">AI Tools</h2>
          <div className="space-y-3">
            {aiTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <div key={tool.id} className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`p-2 ${tool.color} rounded-lg`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{tool.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{tool.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col h-96">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <Bot className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">FOUR AI Assistant</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Trained on your brand and processes</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatHistory.map((chat, index) => (
              <div key={index} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  chat.role === 'user' 
                    ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' 
                    : 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{chat.message}</p>
                  {chat.role === 'ai' && (
                    <div className="flex items-center space-x-2 mt-2">
                      <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors">
                        <Copy className="w-3 h-3" />
                      </button>
                      <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors">
                        <RefreshCw className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask me about proposals, briefs, copy, or anything else..."
                  className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white/20 transition-all duration-200"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Sparkles className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              <button
                type="submit"
                disabled={!message.trim() || isLoading}
                className="p-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIView;