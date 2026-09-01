import React, { useEffect, useState } from 'react';
import { FiActivity, FiDroplet, FiRepeat, FiTrendingDown, FiAlertCircle } from 'react-icons/fi';
import { Bar, Doughnut } from 'react-chartjs-2';
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip } from 'chart.js';
import api from '../services/api';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const colors = ['#0f766e', '#10b981', '#f59e0b', '#0ea5e9', '#ef4444', '#64748b'];

export default function SustainabilityDashboard() {
  const [data, setData] = useState(null);
  const [material, setMaterial] = useState({ labels: [], quantities: [] });
  const [waste, setWaste] = useState({ labels: [], quantities: [] });
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState('');

  useEffect(() => {
    const params = dateRange ? { params: { date_range: dateRange } } : {};
    Promise.all([
      api.get('/sustainability/summary', params),
      api.get('/sustainability/material-distribution', params),
      api.get('/sustainability/waste-distribution', params),
    ]).then(([summary, materials, wasteDistribution]) => {
      setData(summary);
      setMaterial(materials);
      setWaste(wasteDistribution);
    }).catch((requestError) => setError(requestError.message || 'Unable to load sustainability data.'));
  }, [dateRange]);

  if (error) return <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700"><FiAlertCircle className="mb-2 h-6 w-6" /><p className="font-semibold">Dashboard unavailable</p><p className="text-sm">{error}</p></div>;
  if (!data) return <div className="py-16 text-center text-slate-500">Loading sustainability intelligence...</div>;
  const impact = data.environmental_impact;
  const cards = [
    ['Total Textile Waste', `${data.total_textile_waste} kg`, FiActivity],
    ['Recyclable Waste', `${data.total_recyclable_waste} kg`, FiRepeat],
    ['Reused Waste', `${data.total_reused_quantity} kg`, FiRepeat],
    ['Recycled Waste', `${data.total_recycled_quantity} kg`, FiTrendingDown],
    ['Waste Diversion Rate', `${data.waste_diversion_rate}%`, FiTrendingDown],
    ['Average Circularity', `${data.average_circularity_score}/100`, FiActivity],
    ['Estimated CO2 Savings', `${impact.estimated_co2_savings} kg`, FiTrendingDown],
    ['Estimated Water Savings', `${impact.estimated_water_savings} L`, FiDroplet],
  ];
  const chart = (labels, values, title) => ({ labels: labels.length ? labels : ['No data'], datasets: [{ label: title, data: values.length ? values : [0], backgroundColor: colors, borderWidth: 0 }] });

  return <div className="space-y-8 animate-fade-in">
    {/* Header Section */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-emerald-900 to-teal-800 p-8 rounded-3xl text-white shadow-lg">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="bg-emerald-500/20 text-emerald-200 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase border border-emerald-500/30">Milestone 3</span>
          <span className="text-teal-200 text-sm font-medium">Executive Overview</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Sustainability Intelligence</h1>
        <p className="mt-2 text-emerald-100/80 max-w-xl">Real-time analytical estimates calculated directly from the PostgreSQL inventory metrics.</p>
      </div>
      <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-3 rounded-2xl shadow-sm">
        <span className="text-sm font-medium text-emerald-100">Timeframe:</span>
        <select 
          value={dateRange} 
          onChange={(e) => setDateRange(e.target.value)}
          className="text-sm font-bold text-white bg-transparent border-none focus:ring-0 cursor-pointer outline-hidden"
        >
          <option value="" className="text-slate-900">All Time</option>
          <option value="today" className="text-slate-900">Today</option>
          <option value="last_7_days" className="text-slate-900">Last 7 Days</option>
          <option value="last_30_days" className="text-slate-900">Last 30 Days</option>
          <option value="last_6_months" className="text-slate-900">Last 6 Months</option>
        </select>
      </div>
    </div>

    {/* KPI Grid */}
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(([label, value, Icon], idx) => (
        <div key={label} className="group relative rounded-3xl border border-slate-100 bg-white p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
            <Icon className="h-24 w-24 text-emerald-600 transform group-hover:scale-110 transition-transform duration-500" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-50 rounded-2xl">
                <Icon className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
            <p className="text-sm font-bold tracking-wide text-slate-500 uppercase">{label}</p>
            <p className="mt-2 text-3xl font-extrabold text-slate-900">{value}</p>
          </div>
        </div>
      ))}
    </div>

    {/* Charts Section */}
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-3xl border border-slate-100 bg-white p-8 shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-slate-800">Material Distribution</h2>
          <span className="p-2 bg-slate-50 rounded-lg text-slate-400"><FiActivity className="w-5 h-5" /></span>
        </div>
        <div className="h-80">
          <Bar data={chart(material.labels, material.quantities, 'Quantity (kg)')} options={{ responsive: true, maintainAspectRatio: false, borderRadius: 8, plugins: { legend: { display: false } }, scales: { y: { border: { dash: [4, 4] }, grid: { color: '#f1f5f9' } }, x: { grid: { display: false } } } }} />
        </div>
      </section>
      <section className="rounded-3xl border border-slate-100 bg-white p-8 shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-slate-800">Waste Category Distribution</h2>
          <span className="p-2 bg-slate-50 rounded-lg text-slate-400"><FiRepeat className="w-5 h-5" /></span>
        </div>
        <div className="h-80 flex justify-center">
          <Doughnut data={chart(waste.labels, waste.quantities, 'Quantity (kg)')} options={{ responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } } } }} />
        </div>
      </section>
    </div>

    {/* Bottom Details Section */}
    <div className="grid gap-6 lg:grid-cols-3">
      <section className="lg:col-span-1 rounded-3xl border border-slate-100 bg-white p-8 shadow-md flex flex-col justify-between relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-5">
          <FiActivity className="w-64 h-64 text-emerald-600" />
        </div>
        <div className="relative z-10">
          <h2 className="text-lg font-bold text-slate-800 mb-2">Circularity Potential</h2>
          <p className="text-sm text-slate-500 mb-6">Weighted composite score based on: recyclability (35%), condition (20%), reuse (20%), environmental benefit (15%), feasibility (10%).</p>
          <div className="flex items-end gap-3 mb-8">
            <span className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">{data.average_circularity_score}</span>
            <span className="text-xl font-bold text-slate-300 mb-2">/ 100</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(data.circularity_distribution || {}).map(([name, count]) => (
              <span key={name} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                {name}: {count}
              </span>
            ))}
          </div>
        </div>
      </section>
      
      <section className="lg:col-span-2 rounded-3xl border border-slate-100 bg-white p-8 shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-slate-800">Recovery Distribution Pipeline</h2>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">By Action</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(data.recovery_distribution || {}).map(([name, quantity]) => (
            <div key={name} className="relative p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/50 transition-colors duration-300">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                <FiTrendingDown className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">{name}</p>
              <p className="text-2xl font-extrabold text-slate-800">{Number(quantity).toFixed(2)} <span className="text-sm font-medium text-slate-400">kg</span></p>
            </div>
          ))}
        </div>
        <div className="mt-8 pt-6 border-t border-slate-100">
           <p className="text-xs text-slate-400 flex items-center gap-2">
             <FiAlertCircle className="w-4 h-4" /> Environmental figures are analytical estimates based on standard factors and system configurations.
           </p>
        </div>
      </section>
    </div>
  </div>;
}
