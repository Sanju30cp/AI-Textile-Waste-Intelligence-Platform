import React from 'react';
import { 
  FiTrendingUp, 
  FiTrash2, 
  FiWind, 
  FiActivity, 
  FiArrowRight, 
  FiDownload 
} from 'react-icons/fi';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  ArcElement,
  Title, 
  Tooltip, 
  Legend, 
  Filler 
} from 'chart.js';
import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2';
import { Link } from 'react-router-dom';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Dashboard() {
  
  // Mock Metric Data
  const metrics = [
    { 
      name: 'Total Predictions', 
      value: '142', 
      change: '+12% this week', 
      isPositive: true, 
      icon: FiActivity, 
      color: 'bg-indigo-500',
      textColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50' 
    },
    { 
      name: 'Recyclable Items', 
      value: '84', 
      change: '59% of total', 
      isPositive: true, 
      icon: FiTrash2, 
      color: 'bg-emerald-500',
      textColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50' 
    },
    { 
      name: 'Reusable Items', 
      value: '45', 
      change: '32% of total', 
      isPositive: true, 
      icon: FiTrendingUp, 
      color: 'bg-teal-500',
      textColor: 'text-teal-600',
      bgColor: 'bg-teal-50' 
    },
    { 
      name: 'Average Sustainability Score', 
      value: '82%', 
      change: '+4% vs last month', 
      isPositive: true, 
      icon: FiWind, 
      color: 'bg-cyan-500',
      textColor: 'text-cyan-600',
      bgColor: 'bg-cyan-50' 
    },
  ];

  // Mock Recent Uploads
  const recentUploads = [
    { id: 'TX-1002', fabric: 'Polyester Blend', material: '80% Poly / 20% Cotton', quantity: '420 kg', date: '2026-07-29', recyclability: 'Medium', status: 'Pending Review' },
    { id: 'TX-1001', fabric: '100% Cotton Denim', material: '100% Cotton', quantity: '1,250 kg', date: '2026-07-28', recyclability: 'High', status: 'Processed' },
    { id: 'TX-1000', fabric: 'Nylon Activewear', material: '90% Nylon / 10% Spandex', quantity: '180 kg', date: '2026-07-27', recyclability: 'Low', status: 'Sorted' },
    { id: 'TX-0999', fabric: 'Pure Wool Knits', material: '100% Wool', quantity: '310 kg', date: '2026-07-26', recyclability: 'High', status: 'Processed' },
  ];

  // 1. Product Distribution (Pie)
  const productDistributionData = {
    labels: ['Denim', 'Dress', 'Jacket', 'Mixed'],
    datasets: [
      {
        data: [45, 25, 20, 10],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(168, 85, 247, 0.8)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // 2. Waste Distribution (Doughnut)
  const wasteDistributionData = {
    labels: ['Recyclable', 'Reusable', 'Repairable', 'Upcyclable'],
    datasets: [
      {
        data: [59, 25, 10, 6],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(14, 165, 233, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(217, 70, 239, 0.8)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // 3. Monthly Prediction Count (Bar)
  const monthlyPredictionData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Predictions',
        data: [65, 78, 60, 92, 115, 105, 142],
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderRadius: 4,
      },
    ],
  };

  // 4. Sustainability Score (Line)
  const sustainabilityScoreData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        fill: true,
        label: 'Average Score (%)',
        data: [72, 74, 73, 76, 79, 81, 82],
        borderColor: 'rgb(20, 184, 166)',
        backgroundColor: 'rgba(20, 184, 166, 0.1)',
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: 'rgb(20, 184, 166)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          font: {
            family: 'ui-sans-serif, system-ui, sans-serif',
            size: 11
          }
        }
      },
      tooltip: {
        backgroundColor: '#1f2937',
        titleFont: { size: 13, weight: 'semibold' },
        bodyFont: { size: 12 },
        padding: 12,
        cornerRadius: 8,
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Metric Cards Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, i) => {
          const Icon = metric.icon;
          return (
            <div key={i} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex items-center justify-between">
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{metric.name}</span>
                <h3 className="text-2xl font-bold text-slate-800">{metric.value}</h3>
                <span className={`inline-flex items-center text-xs font-medium ${metric.textColor}`}>
                  {metric.change}
                </span>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${metric.bgColor} ${metric.textColor}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* 4 Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Prediction Count */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 text-lg">Monthly Prediction Count</h3>
          </div>
          <div className="h-64 w-full relative">
            <Bar data={monthlyPredictionData} options={chartOptions} />
          </div>
        </div>

        {/* Sustainability Score */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 text-lg">Sustainability Score Trend</h3>
          </div>
          <div className="h-64 w-full relative">
            <Line data={sustainabilityScoreData} options={chartOptions} />
          </div>
        </div>

        {/* Product Distribution */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 text-lg">Product Distribution</h3>
          </div>
          <div className="h-64 w-full relative">
            <Pie data={productDistributionData} options={chartOptions} />
          </div>
        </div>

        {/* Waste Distribution */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 text-lg">Waste Distribution</h3>
          </div>
          <div className="h-64 w-full relative">
            <Doughnut data={wasteDistributionData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Recent Uploads Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <h3 className="font-bold text-slate-800 text-lg">Recent Waste Entries</h3>
          <Link 
            to="/inventory" 
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            <span>View all inventory</span>
            <FiArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-100">
                <th className="px-6 py-4">Waste ID</th>
                <th className="px-6 py-4">Fabric Type</th>
                <th className="px-6 py-4">Material Composition</th>
                <th className="px-6 py-4">Quantity</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Recyclability</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {recentUploads.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-800">{row.id}</td>
                  <td className="px-6 py-4">{row.fabric}</td>
                  <td className="px-6 py-4 text-slate-500">{row.material}</td>
                  <td className="px-6 py-4">{row.quantity}</td>
                  <td className="px-6 py-4 text-slate-500">{row.date}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      row.recyclability === 'High' 
                        ? 'bg-emerald-50 text-emerald-700' 
                        : row.recyclability === 'Medium' 
                        ? 'bg-amber-50 text-amber-700' 
                        : 'bg-rose-50 text-rose-700'
                    }`}>
                      {row.recyclability}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${
                      row.status === 'Processed'
                        ? 'bg-emerald-100/60 text-emerald-800'
                        : row.status === 'Sorted'
                        ? 'bg-blue-100/60 text-blue-800'
                        : 'bg-amber-100/60 text-amber-800'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
