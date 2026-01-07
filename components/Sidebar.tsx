
import React, { useState, useEffect } from 'react';

interface SidebarProps {
  activeTab: 'dashboard' | 'monitor' | 'storage';
  setActiveTab: (tab: 'dashboard' | 'monitor' | 'storage') => void;
}

type HealthStatus = 'healthy' | 'caution' | 'error';

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const [health, setHealth] = useState<HealthStatus>('healthy');
  const [statusMessage, setStatusMessage] = useState('All Nodes Operational');

  useEffect(() => {
    const healthInterval = setInterval(() => {
      const rand = Math.random();
      if (rand > 0.85) {
        setHealth('error');
        setStatusMessage('Node-042 Disconnected');
      } else if (rand > 0.65) {
        setHealth('caution');
        setStatusMessage('High Latency - Sector 4');
      } else {
        setHealth('healthy');
        setStatusMessage('All Nodes Operational');
      }
    }, 5000);

    return () => clearInterval(healthInterval);
  }, []);

  const getHealthStyles = () => {
    switch (health) {
      case 'healthy': return { dot: 'bg-emerald-500', text: 'text-emerald-400' };
      case 'caution': return { dot: 'bg-amber-500', text: 'text-amber-400' };
      case 'error': return { dot: 'bg-red-500', text: 'text-red-400' };
      default: return { dot: 'bg-gray-500', text: 'text-gray-400' };
    }
  };

  const healthStyles = getHealthStyles();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    )},
    { id: 'monitor', label: 'Live Monitor', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )},
    { id: 'storage', label: 'Log Vault', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
      </svg>
    )},
  ];

  return (
    <aside className="w-64 bg-[#111827] border-r border-gray-800 flex flex-col h-full">
      <div className="p-8 flex items-center gap-2">
        <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-600/20">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
          </svg>
        </div>
        <span className="text-xl font-bold tracking-tighter text-white">ECHO-GUARD</span>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as any)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === item.id 
                ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 shadow-inner' 
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-6">
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">System Status</p>
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-2 h-2 rounded-full animate-pulse transition-colors duration-500 ${healthStyles.dot}`}></div>
            <p className={`text-xs font-medium transition-colors duration-500 ${healthStyles.text}`}>
              {statusMessage}
            </p>
          </div>
          <button 
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-md transition-all shadow-lg active:scale-95"
            onClick={() => {
              setHealth('healthy');
              setStatusMessage('Running Diagnostics...');
              setTimeout(() => setStatusMessage('All Nodes Operational'), 1500);
            }}
          >
            Run System Check
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
