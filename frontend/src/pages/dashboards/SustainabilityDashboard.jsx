import React from 'react';
import { FiTrendingDown, FiWind, FiPieChart, FiGlobe, FiTarget, FiFileText, FiBarChart2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function SustainabilityDashboard() {
  const modules = [
    { 
      name: 'Sustainability Metrics', 
      desc: 'Overall sustainability benchmarking and platform metrics.', 
      icon: FiBarChart2, 
      path: '/coming-soon',
      features: ['Sustainability Benchmarking', 'Circular Economy Analysis']
    },
    { 
      name: 'Carbon Reduction', 
      desc: 'Track CO₂ savings and footprint reduction analysis.', 
      icon: FiWind, 
      path: '/coming-soon',
      features: ['Carbon Reduction Analysis', 'CO₂ savings tracking']
    },
    { 
      name: 'Waste Diversion', 
      desc: 'Monitor landfill diversion rates and resource conservation.', 
      icon: FiTrendingDown, 
      path: '/coming-soon',
      features: ['Waste Diversion Analytics', 'Landfill reduction', 'Resource conservation']
    },
    { 
      name: 'ESG Analytics', 
      desc: 'Comprehensive data for ESG reporting and compliance.', 
      icon: FiPieChart, 
      path: '/coming-soon',
      features: ['ESG Reporting', 'Compliance tracking', 'Governance metrics']
    },
    { 
      name: 'Environmental Impact', 
      desc: 'Assess total water savings and land pollution reduction.', 
      icon: FiGlobe, 
      path: '/coming-soon',
      features: ['Environmental Impact Assessment', 'Water savings', 'Land pollution reduction']
    },
    { 
      name: 'Circularity Score', 
      desc: 'Review calculated recyclability, reuse, and material recovery scores.', 
      icon: FiTarget, 
      path: '/coming-soon',
      features: ['Recyclability score', 'Reuse score', 'Material recovery score', 'Overall circularity score']
    },
    { 
      name: 'Reports & Export', 
      desc: 'Export complete sustainability and environmental impact PDFs.', 
      icon: FiFileText, 
      path: '/reports',
      features: ['Sustainability Reports', 'PDF / Excel Export']
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8 border-b border-slate-100 pb-6">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Sustainability Manager Dashboard</h1>
        <p className="text-slate-500 mt-2 text-lg">Analyze the environmental and sustainability impact of textile recycling activities.</p>
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
