import React, { useState } from 'react';
import { FiDownload, FiFileText, FiBarChart2, FiPieChart, FiAlertCircle, FiLoader } from 'react-icons/fi';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement 
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

// Register ChartJS elements
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement
);

export default function Reports() {
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const [downloadingExcel, setDownloadingExcel] = useState(false);
  const [reportType, setReportType] = useState('monthly');
  const [timePeriod, setTimePeriod] = useState('2026-07');

  const handleDownloadPDF = () => {
    setDownloadingPDF(true);
    setTimeout(() => {
      setDownloadingPDF(false);
      alert('Mock PDF report download started successfully.');
    }, 1500);
  };

  const handleDownloadExcel = () => {
    setDownloadingExcel(true);
    setTimeout(() => {
      setDownloadingExcel(false);
      alert('Mock Excel sheet compilation & download started successfully.');
    }, 1500);
  };

  // Mock circular statistics
  const stats = [
    { label: 'Circularity Rate', value: '73.4%', description: 'Target: 80% by Q4' },
    { label: 'Total Saved CO₂', value: '42.5 Tons', description: 'Equivalent to 240 trees' },
    { label: 'Unrecyclable Waste', value: '3.1 Tons', description: 'Reduced by 18% MoM' },
    { label: 'Average Processing Time', value: '1.2 Days', description: 'AI triage sorting speed' }
  ];

  // Doughnut Chart: Textile Category Distribution
  const doughnutData = {
    labels: ['Pure Cotton', 'Polyester Blends', 'Nylon / Spandex', 'Wool & Knits', 'Other Synthetics'],
    datasets: [
      {
        data: [45, 28, 12, 10, 5],
        backgroundColor: [
          '#10B981', // emerald
          '#14B8A6', // teal
          '#F59E0B', // amber
          '#06B6D4', // cyan
          '#EF4444'  // red
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      }
    ]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          font: {
            family: 'ui-sans-serif, system-ui, sans-serif',
            size: 11
          }
        }
      }
    }
  };

  // Bar Chart: Material recovery volume by category (kg)
  const barData = {
    labels: ['Cotton', 'Polyester', 'Nylon', 'Wool', 'Acrylic'],
    datasets: [
      {
        label: 'Recovered Fibers (kg)',
        data: [4200, 2900, 1100, 950, 420],
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        hoverBackgroundColor: 'rgba(16, 185, 129, 1)',
        borderRadius: 6,
      }
    ]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        grid: { color: '#f1f5f9' },
        ticks: { font: { size: 10 } }
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 10 } }
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Configuration Header Card */}
      <div className="grid gap-6 md:grid-cols-3 bg-white border border-slate-200 p-6 rounded-2xl shadow-xs">
        
        {/* Report selection dropdowns */}
        <div className="space-y-1 md:col-span-2">
          <h3 className="font-bold text-slate-800 text-base">Generate Sustainability Summary</h3>
          <p className="text-xs text-slate-400">Select the report type and desired date range to compile performance metrics.</p>
          
          <div className="flex flex-wrap gap-4 pt-3">
            <div className="flex flex-col">
              <label className="text-[11px] font-bold text-slate-500 uppercase mb-1">Report Type</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 bg-white outline-hidden focus:border-emerald-500"
              >
                <option value="weekly">Weekly Circularity Audit</option>
                <option value="monthly">Monthly Waste Log Digest</option>
                <option value="annual">Annual Carbon Offset Ledger</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-[11px] font-bold text-slate-500 uppercase mb-1">Time Period</label>
              <input
                type="month"
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value)}
                className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 bg-white outline-hidden focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Downloads */}
        <div className="flex flex-col justify-end gap-2.5">
          <button
            onClick={handleDownloadPDF}
            disabled={downloadingPDF || downloadingExcel}
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-emerald-600/10 hover:bg-emerald-700 transition-all duration-150 disabled:bg-slate-300 cursor-pointer"
          >
            {downloadingPDF ? (
              <FiLoader className="h-4 w-4 animate-spin" />
            ) : (
              <FiFileText className="h-4 w-4" />
            )}
            <span>Download PDF Report</span>
          </button>
          
          <button
            onClick={handleDownloadExcel}
            disabled={downloadingPDF || downloadingExcel}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-all duration-150 disabled:bg-slate-300"
          >
            {downloadingExcel ? (
              <FiLoader className="h-4 w-4 animate-spin" />
            ) : (
              <FiDownload className="h-4 w-4" />
            )}
            <span>Export Raw Excel Sheet</span>
          </button>
        </div>
      </div>

      {/* Stats Quick Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <span className="text-xs text-slate-400 font-semibold uppercase block">{stat.label}</span>
            <h4 className="text-xl font-bold text-slate-800 mt-1">{stat.value}</h4>
            <p className="text-[11px] font-medium text-slate-400 mt-1">{stat.description}</p>
          </div>
        ))}
      </div>

      {/* Visual Analytics */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Doughnut Chart: Waste Distribution */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <FiPieChart className="h-5 w-5 text-emerald-600" />
            <h3 className="font-bold text-slate-800 text-base">Waste Type Distribution</h3>
          </div>
          <div className="h-64 w-full relative flex items-center justify-center">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>

        {/* Bar Chart: Quantity metrics */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <FiBarChart2 className="h-5 w-5 text-emerald-600" />
            <h3 className="font-bold text-slate-800 text-base">Fiber Recovery Volume</h3>
          </div>
          <div className="h-64 w-full relative">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      </div>

    </div>
  );
}
