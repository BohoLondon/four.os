import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { DataProvider } from './contexts/DataContext';
import AuthPage from './components/Auth/AuthPage';
import Dashboard from './components/Dashboard/Dashboard';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Skip login for now
  const [currentView, setCurrentView] = useState('dashboard');

  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            {!isAuthenticated ? (
              <AuthPage onAuthenticate={() => setIsAuthenticated(true)} />
            ) : (
              <div className="flex h-screen">
                <Sidebar currentView={currentView} onViewChange={setCurrentView} />
                <div className="flex-1 flex flex-col">
                  <Header />
                  <main className="flex-1 overflow-auto">
                    <Dashboard currentView={currentView} onViewChange={setCurrentView} />
                  </main>
                </div>
              </div>
            )}
          </div>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;