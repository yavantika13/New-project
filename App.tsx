
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Monitor from './components/Monitor';
import Storage from './components/Storage';
import ThreatDetailsModal from './components/ThreatDetailsModal';
import { DetectionEvent, DashboardStats, RiskLevel, SoundType } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'monitor' | 'storage'>('dashboard');
  const [events, setEvents] = useState<DetectionEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<DetectionEvent | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalDetections: 482,
    activeThreats: 0,
    wildlifeActivityIndex: 78,
    forestSafetyStatus: 'Secure'
  });
  const [showAlert, setShowAlert] = useState<DetectionEvent | null>(null);

  const handleNewEvent = (event: DetectionEvent) => {
    setEvents(prev => [event, ...prev]);
    
    // Update stats based on event
    if (event.riskLevel === RiskLevel.HIGH || event.riskLevel === RiskLevel.CRITICAL) {
      setStats(prev => ({
        ...prev,
        activeThreats: prev.activeThreats + 1,
        forestSafetyStatus: 'Under Threat'
      }));
      setShowAlert(event);
      setTimeout(() => setShowAlert(null), 5000);
    } else if (event.riskLevel === RiskLevel.MEDIUM) {
      setStats(prev => ({
        ...prev,
        forestSafetyStatus: prev.forestSafetyStatus === 'Under Threat' ? 'Under Threat' : 'Caution'
      }));
    }
  };

  return (
    <div className="flex h-screen bg-[#0b0f19] overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 overflow-y-auto p-8 relative">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              <span className="text-emerald-500">ECHO-GUARD</span>
              <span className="text-sm font-normal bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded border border-emerald-500/20">v2.0 AI-Core</span>
            </h1>
            <p className="text-gray-400 mt-1">Intelligent Forest Acoustic Monitoring System</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-white">Region: Amazon Basin</p>
              <p className="text-xs text-gray-500">Sector 4-B | Real-time</p>
            </div>
            <img src="https://picsum.photos/40/40" className="w-10 h-10 rounded-full border-2 border-emerald-500" alt="Avatar" />
          </div>
        </header>

        {activeTab === 'dashboard' && <Dashboard stats={stats} events={events} onSelectEvent={setSelectedEvent} />}
        {activeTab === 'monitor' && <Monitor onNewEvent={handleNewEvent} />}
        {activeTab === 'storage' && <Storage events={events} onSelectEvent={setSelectedEvent} />}

        {/* Real-time Toast Alert */}
        {showAlert && (
          <div 
            className="fixed bottom-10 right-10 z-[60] cursor-pointer transform hover:scale-105 transition-all"
            onClick={() => {
              setSelectedEvent(showAlert);
              setShowAlert(null);
            }}
          >
            <div className="bg-red-600 text-white p-6 rounded-2xl shadow-2xl border border-red-500 flex items-center gap-4 max-w-md animate-bounce">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-lg uppercase tracking-wider">Security Threat!</h4>
                <p className="text-red-100 font-medium">{showAlert.type}: {showAlert.detectedSound}</p>
                <p className="text-[10px] text-white/60 mt-1">Click to view intelligence report</p>
              </div>
            </div>
          </div>
        )}

        {/* Detailed Modal */}
        {selectedEvent && (
          <ThreatDetailsModal 
            event={selectedEvent} 
            onClose={() => setSelectedEvent(null)} 
          />
        )}
      </main>
    </div>
  );
};

export default App;
