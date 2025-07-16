import React, { useState } from 'react';
import { Plus, Search, Filter, Calendar, Users, Clock, CheckCircle2, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import ProjectModal from './ProjectModal';
import TaskModal from './TaskModal';

const ProjectsView: React.FC = () => {
  const { projects, deleteProject, clients } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Planning' | 'In Progress' | 'Review' | 'Complete' | 'On Hold'>('All');
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  // Filter projects
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || project.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleDeleteProject = (projectId: string) => {
    deleteProject(projectId);
    setShowDeleteConfirm(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Review':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Planning':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      case 'Complete':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'On Hold':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light text-gray-900 dark:text-white">Projects</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Track and manage your creative projects</p>
        </div>
        <button 
          onClick={() => {
            setSelectedProject(null);
            setIsProjectModalOpen(true);
          }}
          className="flex items-center space-x-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search projects..."
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
          <option value="Planning">Planning</option>
          <option value="In Progress">In Progress</option>
          <option value="Review">Review</option>
          <option value="Complete">Complete</option>
          <option value="On Hold">On Hold</option>
        </select>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => {
          const daysUntilDeadline = getDaysUntilDeadline(project.deadline);
          const isExpanded = expandedProject === project.id;
          
          return (
            <div key={project.id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-4 h-4 rounded-full ${project.color}`}></div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                  <div className="relative">
                    <button 
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                      onClick={() => setShowDeleteConfirm(showDeleteConfirm === project.id ? null : project.id)}
                    >
                      <MoreHorizontal className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </button>
                    
                    {showDeleteConfirm === project.id && (
                      <div className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 min-w-48">
                        <button
                          onClick={() => {
                            setSelectedProject(project.id);
                            setIsProjectModalOpen(true);
                            setShowDeleteConfirm(null);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
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

              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{project.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{project.client}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Progress</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${project.color}`} 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(project.deadline).toLocaleDateString()}
                    </span>
                    {daysUntilDeadline <= 7 && daysUntilDeadline > 0 && (
                      <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                        ({daysUntilDeadline}d left)
                      </span>
                    )}
                    {daysUntilDeadline <= 0 && (
                      <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                        (Overdue)
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">{project.team}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Budget</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {typeof project.budget === 'object' ? `$${project.budget.estimated?.toLocaleString() || '0'}` : project.budget}
                  </span>
                </div>

                {/* Tasks Preview */}
                {project.tasks.length > 0 && (
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => setExpandedProject(isExpanded ? null : project.id)}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 flex items-center space-x-1"
                    >
                      <span>{project.tasks.filter(t => t.completed).length}/{project.tasks.length} tasks completed</span>
                      <span>{isExpanded ? '▼' : '▶'}</span>
                    </button>
                    
                    {isExpanded && (
                      <div className="mt-2 space-y-1">
                        {project.tasks.slice(0, 3).map(task => (
                          <div key={task.id} className="flex items-center space-x-2 text-xs">
                            <input
                              type="checkbox"
                              checked={task.completed}
                              readOnly
                              className="w-3 h-3"
                            />
                            <span className={task.completed ? 'line-through text-gray-400' : 'text-gray-600 dark:text-gray-300'}>
                              {task.title}
                            </span>
                          </div>
                        ))}
                        {project.tasks.length > 3 && (
                          <p className="text-xs text-gray-400">+{project.tasks.length - 3} more tasks</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2 mt-4">
                <button 
                  onClick={() => {
                    setSelectedProject(project.id);
                    setIsTaskModalOpen(true);
                  }}
                  className="flex-1 flex items-center justify-center space-x-2 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Tasks</span>
                </button>
                <button className="flex-1 flex items-center justify-center space-x-2 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-sm">Update</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <FolderOpen className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No projects found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first project'}
          </p>
          <button 
            onClick={() => {
              setSelectedProject(null);
              setIsProjectModalOpen(true);
            }}
            className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            New Project
          </button>
        </div>
      )}

      {/* Modals */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => {
          setIsProjectModalOpen(false);
          setSelectedProject(null);
        }}
        projectId={selectedProject}
      />

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setSelectedProject(null);
        }}
        projectId={selectedProject}
      />
    </div>
  );
};

export default ProjectsView;