import React from 'react';
import { FiArchive, FiImage, FiGrid, FiTrendingUp, FiRepeat, FiFileText } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function ManufacturerDashboard() {
  const modules = [
    { 
      name: 'Production Waste', 
      desc: 'Register and manage waste batches generated from production lines.', 
      icon: FiArchive, 
      path: '/coming-soon',
      features: ['Register waste', 'Manage waste batches', 'Track waste source', 'Monitor inventory']
    },
    { 
      name: 'Textile Image Upload', 
      desc: 'Upload images of textile waste for AI analysis and categorization.', 
      icon: FiImage, 
      path: '/upload',
      features: ['Upload single image', 'Batch upload', 'Camera capture']
    },
    { 
      name: 'Material Analysis', 
      desc: 'View AI-powered fabric detection and material composition results.', 
      icon: FiGrid, 
      path: '/history',
      features: ['Fabric detection', 'Material recognition', 'Texture & Color analysis', 'Damage & Contamination detection']
    },
    { 
      name: 'Waste Classification', 
      desc: 'Review recyclability, reusability, and hazardous waste assessments.', 
      icon: FiTrendingUp, 
      path: '/history',
      features: ['Fabric type & Fiber composition', 'Blend identification', 'Recyclable / Reusable / Upcyclable', 'Compostable / Hazardous']
    },
    { 
      name: 'Recovery Insights', 
      desc: 'Discover material recovery opportunities and sustainability performance.', 
      icon: FiRepeat, 
      path: '/coming-soon',
      features: ['Production Waste Analysis', 'Circular Economy Insights', 'Sustainability Performance']
    },
    { 
      name: 'Reports & Export', 
      desc: 'Download comprehensive production waste and recovery PDF reports.', 
      icon: FiFileText, 
      path: '/reports',
      features: ['Material Recovery Reports', 'PDF / Excel Export']
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8 border-b border-slate-100 pb-6">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Manufacturer Dashboard</h1>
        <p className="text-slate-500 mt-2 text-lg">Manage and analyze textile waste generated from production facilities.</p>
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
