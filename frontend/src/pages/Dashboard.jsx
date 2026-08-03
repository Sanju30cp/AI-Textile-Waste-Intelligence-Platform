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
  Title, 
  Tooltip, 
  Legend, 
  Filler 
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Link } from 'react-router-dom';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Dashboard() {
  
  // Mock Metric Data
  const metrics = [
    { 
      name: 'Total Waste Logged', 
      value: '24.8 Tons', 
      change: '+12.4%', 
      isPositive: true, 
      icon: FiTrash2, 
      color: 'bg-emerald-500',
      textColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50' 
    },
    { 
      name: 'Recyclable Waste', 
      value: '18.2 Tons', 
      change: '73.4% Recycled', 
      isPositive: true, 
      icon: FiTrendingUp, 
      color: 'bg-teal-500',
      textColor: 'text-teal-600',
      bgColor: 'bg-teal-50' 
    },
    { 
      name: 'CO₂ Savings', 
      value: '42.5 MT', 
      change: '+3.1 MT saved', 
      isPositive: true, 
      icon: FiWind, 
      color: 'bg-cyan-500',
      textColor: 'text-cyan-600',
      bgColor: 'bg-cyan-50' 
    },
    { 
      name: 'Circularity Score', 
      value: '84 / 100', 
      change: 'Top 10% Industry', 
      isPositive: true, 
      icon: FiActivity, 
      color: 'bg-green-600',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50' 
    },
  ];

  // Mock Recent Uploads
  const recentUploads = [
    { id: 'TX-1002', fabric: 'Polyester Blend', material: '80% Poly / 20% Cotton', quantity: '420 kg', date: '2026-07-29', recyclability: 'Medium', status: 'Pending Review' },
    { id: 'TX-1001', fabric: '100% Cotton Denim', material: '100% Cotton', quantity: '1,250 kg', date: '2026-07-28', recyclability: 'High', status: 'Processed' },
    { id: 'TX-1000', fabric: 'Nylon Activewear', material: '90% Nylon / 10% Spandex', quantity: '180 kg', date: '2026-07-27', recyclability: 'Low', status: 'Sorted' },
    { id: 'TX-0999', fabric: 'Pure Wool Knits', material: '100% Wool', quantity: '310 kg', date: '2026-07-26', recyclability: 'High', status: 'Processed' },
  ];

  // Chart Setup
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        fill: true,
        label: 'Waste Logged (Tons)',
        data: [2.1, 3.4, 2.8, 4.2, 5.1, 4.8, 6.2],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: 'rgb(34, 197, 94)',
      },
      {
        fill: true,
        label: 'Recycled Waste (Tons)',
        data: [1.4, 2.5, 2.0, 3.1, 3.8, 3.7, 4.8],
        borderColor: 'rgb(20, 184, 166)',
        backgroundColor: 'rgba(20, 184, 166, 0.05)',
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: 'rgb(20, 184, 166)',
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          font: {
            family: 'ui-sans-serif, system-ui, sans-serif',
            size: 12
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
    },
    scales: {
      y: {
        grid: {
          color: '#f1f5f9',
        },
        ticks: {
          font: { size: 11, family: 'ui-sans-serif, system-ui, sans-serif' }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: { size: 11, family: 'ui-sans-serif, system-ui, sans-serif' }
        }
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

      {/* Main Content: Chart & Recent Activities */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Statistics Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 text-lg">Waste Processing Trends</h3>
            <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50">
              <FiDownload className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
          <div className="h-72 w-full relative">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Action Quick Links / Mini Stats */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-800 text-lg mb-4">Circular Actions</h3>
            <p className="text-sm text-slate-500 mb-6">
              Classify and analyze new textile logs using AI vision models.
            </p>
          </div>
          <div className="space-y-3">
            <Link 
              to="/upload" 
              className="flex w-full items-center justify-between rounded-xl bg-emerald-600 px-4 py-3.5 text-sm font-semibold text-white shadow-md shadow-emerald-600/10 hover:bg-emerald-700 transition-all duration-150 cursor-pointer"
            >
              <span>Scan / Upload Image</span>
              <FiArrowRight className="h-4 w-4" />
            </Link>
            <Link 
              to="/inventory" 
              className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-all duration-150"
            >
              <span>Manage Logs</span>
              <FiArrowRight className="h-4 w-4 text-slate-400" />
            </Link>
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
