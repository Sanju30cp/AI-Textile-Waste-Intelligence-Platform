import React, { useState, useEffect } from 'react';
import { FiDownload, FiFileText, FiBarChart2, FiPieChart, FiAlertCircle, FiLoader, FiCheckCircle } from 'react-icons/fi';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import api from '../services/api';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const colors = ['#0f766e', '#10b981', '#f59e0b', '#0ea5e9', '#ef4444', '#64748b', '#8b5cf6', '#ec4899'];

export default function Reports() {
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const [downloadingExcel, setDownloadingExcel] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [data, setData] = useState(null);
  const [material, setMaterial] = useState({ labels: [], quantities: [] });
  const [waste, setWaste] = useState({ labels: [], quantities: [] });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [summaryRes, materialRes, wasteRes] = await Promise.all([
        api.get('/sustainability/summary'),
        api.get('/sustainability/material-distribution'),
        api.get('/sustainability/waste-distribution')
      ]);
      setData(summaryRes);
      setMaterial(materialRes);
      setWaste(wasteRes);
    } catch (err) {
      console.error("Failed to fetch reports data:", err);
      setError("Unable to load data.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!data) return;
    setDownloadingPDF(true);
    try {
      const doc = new jsPDF();

      // Header
      doc.setFontSize(22);
      doc.setTextColor(15, 118, 110);
      doc.text('Comprehensive Sustainability Report', 14, 22);
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

      let currentY = 40;

      const tableOptions = {
        theme: 'striped',
        headStyles: { fillColor: [16, 185, 129] },
        margin: { left: 14, right: 14 }
      };

      // 1. Waste Classification
      doc.setFontSize(16);
      doc.setTextColor(30);
      doc.text('1. Waste Classification', 14, currentY);
      const wasteTable = autoTable(doc, {
        ...tableOptions,
        startY: currentY + 5,
        head: [['Category', 'Quantity (kg)']],
        body: waste.labels.map((label, idx) => [label, waste.quantities[idx] ?? 0]),
      });
      currentY = wasteTable.finalY + 15;

      // 2. Recycling
      doc.setFontSize(16);
      doc.setTextColor(30);
      doc.text('2. Recycling & Recovery', 14, currentY);
      const recyclingTable = autoTable(doc, {
        ...tableOptions,
        startY: currentY + 5,
        head: [['Metric', 'Value (kg)']],
        body: [
          ['Total Recyclable Waste', data.total_recyclable_waste ?? 0],
          ['Total Recycled Quantity', data.total_recycled_quantity ?? 0],
          ['Total Reused Quantity', data.total_reused_quantity ?? 0]
        ]
      });
      currentY = recyclingTable.finalY + 15;

      // 3. Sustainability & 4. Environmental Impact
      doc.setFontSize(16);
      doc.setTextColor(30);
      doc.text('3. Environmental Impact & KPIs', 14, currentY);
      const impactTable = autoTable(doc, {
        ...tableOptions,
        startY: currentY + 5,
        head: [['KPI', 'Value']],
        body: [
          ['Waste Diversion Rate', `${data.waste_diversion_rate ?? 0}%`],
          ['Recovery Rate', `${data.recovery_rate ?? 0}%`],
          ['Estimated CO2 Savings', `${data.environmental_impact?.estimated_co2_savings ?? 0} kg`],
          ['Estimated Water Savings', `${data.environmental_impact?.estimated_water_savings ?? 0} L`]
        ]
      });
      currentY = impactTable.finalY + 15;

      // 5. Circular Economy
      if (currentY > 230) {
        doc.addPage();
        currentY = 20;
      }

      doc.setFontSize(16);
      doc.setTextColor(30);
      doc.text('4. Circular Economy', 14, currentY);
      const circularityBody = Object.entries(data.circularity_distribution || {}).map(([k, v]) => [k, v]);
      circularityBody.unshift(['Average Circularity Score', `${data.average_circularity_score ?? 0} / 100`]);
      autoTable(doc, {
        ...tableOptions,
        startY: currentY + 5,
        head: [['Metric / Category', 'Score / Count']],
        body: circularityBody,
      });

      doc.save('Comprehensive_Sustainability_Report.pdf');
    } catch (err) {
      console.error('PDF generation failed', err);
      alert('Failed to generate PDF.');
    } finally {
      setDownloadingPDF(false);
    }
  };

  const handleDownloadExcel = async () => {
    if (!data) return;
    setDownloadingExcel(true);
    try {
      // Fetch raw inventory data for details
      const inventoryRes = await api.get('/inventory');
      
      const wb = XLSX.utils.book_new();

      // Sheet 1: Summary KPIs
      const summaryData = [
        ['Metric', 'Value'],
        ['Total Textile Waste (kg)', data.total_textile_waste],
        ['Recyclable Waste (kg)', data.total_recyclable_waste],
        ['Reused Waste (kg)', data.total_reused_quantity],
        ['Recycled Waste (kg)', data.total_recycled_quantity],
        ['Waste Diversion Rate (%)', data.waste_diversion_rate],
        ['Estimated CO2 Savings (kg)', data.environmental_impact?.estimated_co2_savings || 0],
        ['Estimated Water Savings (L)', data.environmental_impact?.estimated_water_savings || 0],
        ['Average Circularity Score', data.average_circularity_score]
      ];
      const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, wsSummary, "Sustainability Summary");

      // Sheet 2: Material Distribution
      const materialData = [['Fabric Type', 'Quantity (kg)']];
      material.labels.forEach((label, idx) => {
        materialData.push([label, material.quantities[idx]]);
      });
      const wsMaterial = XLSX.utils.aoa_to_sheet(materialData);
      XLSX.utils.book_append_sheet(wb, wsMaterial, "Materials");

      // Sheet 3: Waste Categories
      const wasteData = [['Waste Category', 'Quantity (kg)']];
      waste.labels.forEach((label, idx) => {
        wasteData.push([label, waste.quantities[idx]]);
      });
      const wsWaste = XLSX.utils.aoa_to_sheet(wasteData);
      XLSX.utils.book_append_sheet(wb, wsWaste, "Waste Categories");

      // Sheet 4: Raw Inventory
      if (inventoryRes && inventoryRes.length > 0) {
        const inventoryRows = inventoryRes.map(item => ({
          'ID': item.id,
          'Batch ID': item.batch_id,
          'Fabric Type': item.fabric_type,
          'Material': item.material_composition,
          'Quantity (kg)': item.quantity,
          'Condition': item.condition,
          'Recyclability': item.recyclability,
          'Waste Category': item.waste_category,
          'Status': item.status,
          'Date': item.collection_date
        }));
        const wsInventory = XLSX.utils.json_to_sheet(inventoryRows);
        XLSX.utils.book_append_sheet(wb, wsInventory, "Raw Inventory");
      }

      XLSX.writeFile(wb, 'Comprehensive_Project_Data.xlsx');
    } catch (err) {
      console.error("Excel generation failed", err);
      alert("Failed to export Excel.");
    } finally {
      setDownloadingExcel(false);
    }
  };

  if (loading) return <div className="py-16 text-center text-slate-500">Compiling analytical reports...</div>;
  if (error) return <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700">Error loading data.</div>;

  const chartData = (labels, values, title) => ({ 
    labels: labels.length ? labels : ['No data'], 
    datasets: [{ label: title, data: values.length ? values : [0], backgroundColor: colors, borderRadius: title.includes('Quantity') ? 6 : 0, borderWidth: title.includes('Quantity') ? 0 : 2 }] 
  });

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header & Export Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Project Reports & Visualization</h1>
          <p className="mt-1 text-sm text-slate-500">Comprehensive overview covering Waste, Recycling, Sustainability, Impact, and Circularity.</p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={handleDownloadPDF}
            disabled={downloadingPDF}
            className="flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
          >
            {downloadingPDF ? <FiLoader className="h-4 w-4 animate-spin" /> : <FiFileText className="h-4 w-4 text-rose-500" />}
            <span>Export PDF</span>
          </button>
          
          <button
            onClick={handleDownloadExcel}
            disabled={downloadingExcel}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {downloadingExcel ? <FiLoader className="h-4 w-4 animate-spin" /> : <FiDownload className="h-4 w-4" />}
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* Grid for the 5 Specification Areas */}
      <div className="grid gap-6 lg:grid-cols-2">
        
        {/* 1. Waste Classification */}
        <section className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="p-2 bg-rose-50 text-rose-600 rounded-lg"><FiPieChart /></span>
            <h2 className="text-lg font-bold text-slate-800">1. Waste Classification</h2>
          </div>
          <div className="h-64">
            <Doughnut data={chartData(waste.labels, waste.quantities, 'Waste')} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </section>

        {/* 2. Recycling */}
        <section className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><FiBarChart2 /></span>
            <h2 className="text-lg font-bold text-slate-800">2. Recycling Overview</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
             <div className="p-4 bg-slate-50 rounded-2xl"><p className="text-xs text-slate-500 font-bold uppercase">Recyclable</p><p className="text-2xl font-extrabold text-slate-800">{data.total_recyclable_waste} kg</p></div>
             <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl"><p className="text-xs text-emerald-600 font-bold uppercase">Actually Recycled</p><p className="text-2xl font-extrabold text-emerald-800">{data.total_recycled_quantity} kg</p></div>
          </div>
          <div className="h-40">
            <Bar data={chartData(material.labels, material.quantities, 'Quantity (kg)')} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { display: false } } }} />
          </div>
        </section>

        {/* 3. Sustainability */}
        <section className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="p-2 bg-teal-50 text-teal-600 rounded-lg"><FiCheckCircle /></span>
            <h2 className="text-lg font-bold text-slate-800">3. Sustainability KPIs</h2>
          </div>
          <div className="space-y-4">
             <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl"><span className="font-bold text-slate-600">Waste Diversion Rate</span><span className="text-xl font-extrabold text-teal-600">{data.waste_diversion_rate}%</span></div>
             <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl"><span className="font-bold text-slate-600">Total Diversion Quantity</span><span className="text-xl font-extrabold text-teal-600">{data.landfill_diverted_quantity} kg</span></div>
             <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl"><span className="font-bold text-slate-600">Material Recovery Rate</span><span className="text-xl font-extrabold text-teal-600">{data.recovery_rate}%</span></div>
          </div>
        </section>

        {/* 4. Environmental Impact */}
        <section className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 opacity-5">
             <FiCheckCircle className="w-48 h-48 text-emerald-600" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="p-2 bg-sky-50 text-sky-600 rounded-lg"><FiCheckCircle /></span>
              <h2 className="text-lg font-bold text-slate-800">4. Environmental Impact</h2>
            </div>
            <div className="grid gap-4">
               <div className="p-5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl text-white shadow-md">
                 <p className="text-emerald-50 text-sm font-bold uppercase tracking-wider">Estimated CO2 Savings</p>
                 <p className="text-4xl font-extrabold mt-1">{data.environmental_impact.estimated_co2_savings} <span className="text-lg font-medium">kg</span></p>
               </div>
               <div className="p-5 bg-gradient-to-r from-sky-500 to-blue-500 rounded-2xl text-white shadow-md">
                 <p className="text-sky-50 text-sm font-bold uppercase tracking-wider">Estimated Water Savings</p>
                 <p className="text-4xl font-extrabold mt-1">{data.environmental_impact.estimated_water_savings} <span className="text-lg font-medium">L</span></p>
               </div>
            </div>
          </div>
        </section>

        {/* 5. Circular Economy */}
        <section className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-purple-50 text-purple-600 rounded-lg"><FiPieChart /></span>
              <h2 className="text-lg font-bold text-slate-800">5. Circular Economy Focus</h2>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Composite Score</p>
              <p className="text-3xl font-extrabold text-purple-600">{data.average_circularity_score}/100</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
             {Object.entries(data.circularity_distribution || {}).map(([category, count]) => (
                <div key={category} className="p-4 border border-slate-100 rounded-2xl bg-slate-50 flex flex-col items-center text-center">
                   <span className="text-2xl font-extrabold text-slate-800 mb-1">{count}</span>
                   <span className="text-xs font-bold text-slate-500 uppercase">{category}</span>
                </div>
             ))}
          </div>
        </section>

      </div>
    </div>
  );
}
