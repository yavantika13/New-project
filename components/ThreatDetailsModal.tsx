
import React from 'react';
import { DetectionEvent, RiskLevel } from '../types';

interface ThreatDetailsModalProps {
  event: DetectionEvent;
  onClose: () => void;
}

const ThreatDetailsModal: React.FC<ThreatDetailsModalProps> = ({ event, onClose }) => {
  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.CRITICAL: return 'text-red-600 bg-red-600/10 border-red-600/30';
      case RiskLevel.HIGH: return 'text-red-500 bg-red-500/10 border-red-500/30';
      case RiskLevel.MEDIUM: return 'text-amber-500 bg-amber-500/10 border-amber-500/30';
      default: return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-[#111827] border border-gray-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-800 flex justify-between items-start">
          <div>
            <div className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border mb-2 ${getRiskColor(event.riskLevel)}`}>
              {event.riskLevel} Alert
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Intelligence Report</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <DetailItem label="Threat Type" value={event.type} />
            <DetailItem label="Detected Sound" value={event.detectedSound} highlight />
            <DetailItem label="Confidence" value={`${(event.confidence * 100).toFixed(1)}%`} />
            <DetailItem label="Status" value={event.status} />
            <DetailItem label="Time" value={new Date(event.timestamp).toLocaleTimeString()} />
            <DetailItem label="Location" value="Sector 4-B (Amazon Basin)" />
          </div>

          <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2 tracking-widest">AI Explanation</p>
            <p className="text-sm text-gray-300 leading-relaxed italic">
              "{event.explanation}"
            </p>
          </div>

          {event.audioBlobUrl && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Acoustic Proof</p>
              <audio controls src={event.audioBlobUrl} className="w-full h-10" />
            </div>
          )}
        </div>

        <div className="p-6 bg-gray-900/30 border-t border-gray-800 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl transition-all">
            Dismiss
          </button>
          {(event.riskLevel === RiskLevel.HIGH || event.riskLevel === RiskLevel.CRITICAL) && (
            <button className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg shadow-red-600/20 transition-all">
              Dispatch Rangers
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const DetailItem: React.FC<{ label: string; value: string; highlight?: boolean }> = ({ label, value, highlight }) => (
  <div>
    <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-1">{label}</p>
    <p className={`text-base font-bold ${highlight ? 'text-emerald-400' : 'text-white'}`}>{value}</p>
  </div>
);

export default ThreatDetailsModal;
