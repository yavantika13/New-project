
import React from 'react';
import { DetectionEvent, RiskLevel } from '../types';

interface StorageProps {
  events: DetectionEvent[];
  onSelectEvent: (event: DetectionEvent) => void;
}

const Storage: React.FC<StorageProps> = ({ events, onSelectEvent }) => {
  const getRiskBadge = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.LOW: return <span className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs">Low</span>;
      case RiskLevel.MEDIUM: return <span className="px-2 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs">Medium</span>;
      case RiskLevel.HIGH: return <span className="px-2 py-1 rounded-md bg-red-500/10 text-red-400 border border-red-500/20 text-xs">High</span>;
      case RiskLevel.CRITICAL: return <span className="px-2 py-1 rounded-md bg-red-600 text-white text-xs font-bold animate-pulse">Critical</span>;
    }
  };

  return (
    <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
      <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
        <div>
          <h2 className="text-xl font-bold text-white">Azure Blob Storage | Log Vault</h2>
          <p className="text-sm text-gray-500 mt-1">Immutable encrypted audit logs of all detected forest events. Click row for intel.</p>
        </div>
        <div className="flex gap-2">
           <button className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm rounded-md transition-colors border border-gray-700">Export CSV</button>
           <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-md transition-colors shadow-lg">Refresh Sync</button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-800/50 text-gray-400 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">Timestamp</th>
              <th className="px-6 py-4 font-semibold">Classification</th>
              <th className="px-6 py-4 font-semibold">Sound Profile</th>
              <th className="px-6 py-4 font-semibold">Confidence</th>
              <th className="px-6 py-4 font-semibold">Risk Level</th>
              <th className="px-6 py-4 font-semibold">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {events.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500 italic">No events recorded in current cycle.</td>
              </tr>
            ) : (
              events.map((event) => (
                <tr 
                  key={event.id} 
                  onClick={() => onSelectEvent(event)}
                  className="hover:bg-gray-800/50 transition-colors group cursor-pointer"
                >
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {new Date(event.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-white">{event.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-emerald-400 font-medium">{event.detectedSound}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 transition-all duration-500" 
                          style={{ width: `${event.confidence * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-emerald-400">{(event.confidence * 100).toFixed(0)}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getRiskBadge(event.riskLevel)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400 max-w-xs truncate italic">
                    {event.details}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Storage;
