import React from 'react';

const ProjectsView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-light text-gray-900 dark:text-white">Projects</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your projects and tasks</p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-400">Projects content will be implemented here.</p>
      </div>
    </div>
  );
};

export default ProjectsView;