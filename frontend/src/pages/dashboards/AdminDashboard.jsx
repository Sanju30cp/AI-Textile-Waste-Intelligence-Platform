import React from 'react';
import { FiUsers, FiBox, FiCpu, FiPieChart, FiMonitor, FiFileText } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const modules = [
    { 
      name: 'User Management', 
      desc: 'Create, update, and manage user roles across the platform.', 
      icon: FiUsers, 
      path: '/coming-soon',
      features: ['View users', 'Manage users', 'Manage roles']
    },
    { 
      name: 'Textile Waste Inventory', 
      desc: 'Manage platform-wide textile inventory and batches.', 
      icon: FiBox, 
      path: '/inventory',
      features: ['View inventory', 'Add waste batches', 'Update waste information', 'Delete waste records']
    },
    { 
      name: 'AI Analysis', 
      desc: 'Monitor material classification and image analysis engines.', 
      icon: FiCpu, 
      path: '/history',
      features: ['Textile image analysis', 'Material classification', 'Waste classification', 'Recyclability assessment']
    },
    { 
      name: 'Platform Analytics', 
      desc: 'View high-level usage, adoption, and performance metrics.', 
      icon: FiPieChart, 
      path: '/coming-soon',
      features: ['Usage trends', 'Adoption tracking', 'Performance metrics']
    },
    { 
      name: 'System Monitoring', 
      desc: 'Check system health, API status, and view alert logs.', 
      icon: FiMonitor, 
      path: '/coming-soon',
      features: ['Platform Announcements', 'Alerts & Notifications', 'API Status']
    },
    { 
      name: 'Report Management', 
      desc: 'Generate, view, and export system-wide PDF/Excel reports.', 
      icon: FiFileText, 
      path: '/reports',
      features: ['PDF/Excel Export', 'Global System Reports', 'Scheduled Reporting']
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8 border-b border-slate-100 pb-6">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Administrator Dashboard</h1>
        <p className="text-slate-500 mt-2 text-lg">Manage and monitor the entire Textile Waste Intelligence platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {modules.map((mod, idx) => {
          const Icon = mod.icon;
          return (
            <Link key={idx} to={mod.path} className="group flex flex-col p-6 bg-white border border-slate-200/70 rounded-2xl shadow-xs hover:shadow-xl hover:shadow-emerald-500/5 hover:border-emerald-300 transition-all duration-300 active:scale-[0.98]">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300 shadow-xs shadow-emerald-500/10">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">{mod.name}</h3>
              </div>
              <p className="text-sm text-slate-500 mb-5 leading-relaxed">{mod.desc}</p>
              
              <div className="mt-auto border-t border-slate-100 pt-4">
                <ul className="space-y-2">
                  {mod.features.map((feature, i) => (
                    <li key={i} className="text-sm text-slate-600 flex items-center gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
