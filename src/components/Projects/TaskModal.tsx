import React, { useState } from 'react';
import { X, Plus, Check, Trash2, Clock } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string | null;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, projectId }) => {
  const { projects, addTask, updateTask, deleteTask } = useData();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');

  const project = projectId ? projects.find(p => p.id === projectId) : null;

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId || !newTaskTitle.trim()) return;

    addTask(projectId, {
      title: newTaskTitle,
      completed: false,
      assignee: newTaskAssignee || 'Unassigned',
      dueDate: newTaskDueDate || new Date().toISOString().split('T')[0]
    });

    setNewTaskTitle('');
    setNewTaskAssignee('');
    setNewTaskDueDate('');
  };

  const handleToggleTask = (taskId: string, completed: boolean) => {
    if (!projectId) return;
    updateTask(projectId, taskId, { completed });
  };

  const handleDeleteTask = (taskId: string) => {
    if (!projectId) return;
    deleteTask(projectId, taskId);
  };

  if (!isOpen || !project) return null;

  const completedTasks = project.tasks.filter(t => t.completed).length;
  const totalTasks = project.tasks.length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Tasks for {project.name}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {completedTasks}/{totalTasks} completed ({completionPercentage}%)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${project.color}`} 
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Add New Task */}
        <form onSubmit={handleAddTask} className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
          <h3 className="font-medium text-gray-900 dark:text-white mb-3">Add New Task</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Task title"
              className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white/20"
              required
            />
            <input
              type="text"
              value={newTaskAssignee}
              onChange={(e) => setNewTaskAssignee(e.target.value)}
              placeholder="Assignee"
              className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white/20"
            />
            <input
              type="date"
              value={newTaskDueDate}
              onChange={(e) => setNewTaskDueDate(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white/20"
            />
          </div>
          <button
            type="submit"
            className="flex items-center space-x-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </form>

        {/* Tasks List */}
        <div className="space-y-3">
          {project.tasks.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No tasks yet. Add your first task above.</p>
            </div>
          ) : (
            project.tasks.map((task) => (
              <div key={task.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <button
                  onClick={() => handleToggleTask(task.id, !task.completed)}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    task.completed
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-gray-300 dark:border-gray-600 hover:border-green-500'
                  }`}
                >
                  {task.completed && <Check className="w-3 h-3" />}
                </button>
                
                <div className="flex-1">
                  <p className={`text-sm font-medium ${
                    task.completed 
                      ? 'line-through text-gray-500 dark:text-gray-400' 
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {task.title}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>Assigned to: {task.assignee}</span>
                    <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;