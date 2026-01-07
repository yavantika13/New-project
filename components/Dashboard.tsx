
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { DashboardStats, DetectionEvent, SoundType } from '../types';

interface DashboardProps {
  stats: DashboardStats;
  events: DetectionEvent[];
}

const Dashboard: React.FC<DashboardProps> = ({ stats, events }) => {
  // Mock trend data
  const trendData = [
    { name: '00:00', activity: 40 },
    { name: '04:00', activity: 30 },
    { name: '08:00', activity: 75 },
    { name: '12:00', activity: 50 },
    { name: '16:00', activity: 90 },
    { name: '20:00', activity: 65 },
  ];

  const typeDistribution = [
    { name: 'Wildlife', count: events.filter(e => e.type === SoundType.WILDLIFE).length + 24 },
    { name: 'Logging', count: events.filter(e => e.type === SoundType.LOGGING).length + 3 },
    { name: 'Poaching', count: events.filter(e => e.type === SoundType.POACHING).length + 1 },
    { name: 'Fire', count: events.filter(e => e.type === SoundType.FIRE).length },
  ];

  const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#f97316'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Detections" value={stats.totalDetections + events.length} subValue="+12% from last week" />
        <StatCard title="Active Threats" value={stats.activeThreats} subValue="Last 24 hours" color="text-red-500" />
        <StatCard title="Wildlife Activity" value={`${stats.wildlifeActivityIndex}%`} subValue="Peak: Dawn/Dusk" color="text-emerald-400" />
        <StatCard title="Safety Status" value={stats.forestSafetyStatus} subValue="Real-time monitoring" color={stats.forestSafetyStatus === 'Secure' ? 'text-emerald-500' : 'text-amber-500'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#111827] border border-gray-800 rounded-xl p-6 shadow-xl">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Wildlife Activity Trend
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorAct" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#10b981' }}
                />
                <Area type="monotone" dataKey="activity" stroke="#10b981" fillOpacity={1} fill="url(#colorAct)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#111827] border border-gray-800 rounded-xl p-6 shadow-xl">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            Sound Classification Dist.
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={typeDistribution} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#6b7280" fontSize={12} width={80} tickLine={false} axisLine={false} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {typeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string | number; subValue: string; color?: string }> = ({ title, value, subValue, color = "text-white" }) => (
  <div className="bg-[#111827] border border-gray-800 p-5 rounded-xl shadow-lg">
    <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">{title}</p>
    <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
    <p className="text-gray-500 text-xs mt-2">{subValue}</p>
  </div>
);

export default Dashboard;
