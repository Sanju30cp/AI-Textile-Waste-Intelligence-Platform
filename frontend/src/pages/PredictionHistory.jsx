import React, { useState } from 'react';
import { FiSearch, FiFilter, FiDownload, FiImage, FiCalendar, FiBox, FiList } from 'react-icons/fi';

export default function PredictionHistory() {
  const [searchProduct, setSearchProduct] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  // Dummy data representing PostgreSQL prediction_history table
  const mockHistory = [
    { id: 1, image_name: 'denim_jacket_1.jpg', product_type: 'Denim', confidence: 96.5, waste_category: 'Recyclable', recommendation: 'Fiber Recycling', date: '2026-08-01' },
    { id: 2, image_name: 'cotton_dress_2.jpg', product_type: 'Dress', confidence: 88.2, waste_category: 'Reusable', recommendation: 'Donation', date: '2026-08-02' },
    { id: 3, image_name: 'leather_jacket_3.jpg', product_type: 'Jacket', confidence: 91.0, waste_category: 'Repairable', recommendation: 'Repair and Reuse', date: '2026-08-03' },
    { id: 4, image_name: 'mixed_fabric_4.jpg', product_type: 'Mixed', confidence: 75.4, waste_category: 'Upcyclable', recommendation: 'Upcycle to accessories', date: '2026-08-04' },
    { id: 5, image_name: 'denim_jeans_5.jpg', product_type: 'Denim', confidence: 98.1, waste_category: 'Recyclable', recommendation: 'Fiber Recycling', date: '2026-08-05' },
  ];

  const filters = ['All', 'Reusable', 'Recyclable', 'Repairable', 'Upcyclable'];

  const filteredHistory = mockHistory.filter(item => {
    // Filter logic
    if (activeFilter !== 'All' && item.waste_category !== activeFilter) return false;
    
    // Search logic
    if (searchProduct && !item.product_type.toLowerCase().includes(searchProduct.toLowerCase())) return false;
    if (searchCategory && !item.waste_category.toLowerCase().includes(searchCategory.toLowerCase())) return false;
    if (searchDate && item.date !== searchDate) return false;

    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Page Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Prediction History</h2>
          <p className="text-sm text-slate-500">View and manage past AI classifications.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors shadow-sm">
            <FiDownload className="h-4 w-4" />
            Export CSV
          </button>
          <button className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-600/20">
            <FiDownload className="h-4 w-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-5">
        {/* Search Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <FiBox className="h-5 w-5" />
            </div>
            <input 
              type="text" 
              placeholder="Search Product Type..." 
              value={searchProduct}
              onChange={(e) => setSearchProduct(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-slate-50 focus:bg-white"
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <FiList className="h-5 w-5" />
            </div>
            <input 
              type="text" 
              placeholder="Search Waste Category..." 
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-slate-50 focus:bg-white"
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <FiCalendar className="h-5 w-5" />
            </div>
            <input 
              type="date" 
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-slate-50 focus:bg-white text-slate-600"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-sm font-semibold text-slate-500 mr-2 flex items-center gap-1.5">
            <FiFilter className="h-4 w-4" /> Filters:
          </span>
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${
                activeFilter === filter 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-100">
                <th className="px-6 py-4">Image</th>
                <th className="px-6 py-4">Prediction</th>
                <th className="px-6 py-4">Confidence</th>
                <th className="px-6 py-4">Waste Category</th>
                <th className="px-6 py-4">Recommendation</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {filteredHistory.length > 0 ? (
                filteredHistory.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-400 border border-slate-200 overflow-hidden">
                        <FiImage className="h-5 w-5" />
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800">{row.product_type}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                        {row.confidence}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        row.waste_category === 'Recyclable' ? 'bg-emerald-50 text-emerald-700' :
                        row.waste_category === 'Reusable' ? 'bg-blue-50 text-blue-700' :
                        row.waste_category === 'Repairable' ? 'bg-amber-50 text-amber-700' :
                        'bg-purple-50 text-purple-700'
                      }`}>
                        {row.waste_category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 max-w-[200px] truncate" title={row.recommendation}>
                      {row.recommendation}
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-medium">{row.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FiSearch className="h-8 w-8 text-slate-300" />
                      <p>No predictions found matching your criteria.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
