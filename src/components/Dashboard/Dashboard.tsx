import React from 'react';
import DashboardOverview from './DashboardOverview';
import ClientsView from '../Clients/ClientsView';
import ProjectsView from '../Projects/ProjectsView';
import ArchiveView from '../Archive/ArchiveView';
import FinanceView from '../Finance/FinanceView';
import ContentView from '../Content/ContentView';
import WikiView from '../Wiki/WikiView';
import AIView from '../AI/AIView';
import SettingsView from '../Settings/SettingsView';

interface DashboardProps {
  currentView: string;
}

const Dashboard: React.FC<DashboardProps> = ({ currentView }) => {
  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'clients':
        return <ClientsView />;
      case 'projects':
        return <ProjectsView />;
      case 'archive':
        return <ArchiveView />;
      case 'finance':
        return <FinanceView />;
      case 'content':
        return <ContentView />;
      case 'wiki':
        return <WikiView />;
      case 'ai':
        return <AIView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="p-6">
      {renderView()}
    </div>
  );
};

export default Dashboard;