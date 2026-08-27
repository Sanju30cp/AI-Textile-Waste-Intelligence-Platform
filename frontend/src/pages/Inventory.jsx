import React, { useState, useEffect } from 'react';
import { FiSearch, FiTrash2, FiEye, FiFilter, FiDownload } from 'react-icons/fi';
import api from '../services/api';

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const data = await api.get('/inventory');
      data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setInventory(data);
    } catch (err) {
      console.error("Failed to fetch inventory:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(`Are you sure you want to delete this entry?`)) {
      try {
        await api.delete(`/inventory/${id}`);
        setInventory(inventory.filter(item => item.id !== id));
      } catch (err) {
        console.error("Failed to delete item:", err);
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/inventory/${id}`, { status: newStatus });
      setInventory(inventory.map(item => item.id === id ? { ...item, status: newStatus } : item));
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  // Filter Logic
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = 
      (item.batch_id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.fabric_type || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.material_composition || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Search & Filter bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
            <FiSearch className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search by ID, material, fabric..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="relative flex items-center gap-1.5 text-sm text-slate-500 font-semibold border border-slate-200 px-3 py-2 rounded-xl bg-slate-50">
            <FiFilter className="h-4 w-4 text-slate-400" />
            <span>Filter Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent border-0 outline-hidden font-bold text-slate-700 cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Pending Review">Pending Review</option>
              <option value="Sorted">Sorted</option>
              <option value="Processed">Processed</option>
              <option value="Recycled">Recycled</option>
            </select>
          </div>

          <button className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            <FiDownload className="h-4 w-4 text-slate-400" />
            <span className="hidden sm:inline">Export Excel</span>
          </button>
        </div>
      </div>

      {/* Inventory Table Card */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
             <div className="text-center py-12 text-slate-400 space-y-2">
               <p className="font-semibold text-slate-600">Loading Database...</p>
             </div>
          ) : filteredInventory.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-100">
                  <th className="px-6 py-4">Waste ID</th>
                  <th className="px-6 py-4">Fabric Type</th>
                  <th className="px-6 py-4">Material Composition</th>
                  <th className="px-6 py-4">Quantity</th>
                  <th className="px-6 py-4">Date Added</th>
                  <th className="px-6 py-4">Recyclability</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {filteredInventory.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-800">{row.batch_id}</td>
                    <td className="px-6 py-4">{row.fabric_type}</td>
                    <td className="px-6 py-4 text-slate-500">{row.material_composition}</td>
                    <td className="px-6 py-4 font-medium">{row.quantity}</td>
                    <td className="px-6 py-4 text-slate-500">{row.collection_date}</td>
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
                      <select
                        value={row.status}
                        onChange={(e) => handleStatusChange(row.id, e.target.value)}
                        className={`inline-flex items-center rounded-md border-0 px-2 py-0.5 text-xs font-semibold focus:ring-1 focus:ring-emerald-500 cursor-pointer ${
                          row.status === 'Processed'
                            ? 'bg-emerald-100/60 text-emerald-800'
                            : row.status === 'Sorted'
                            ? 'bg-blue-100/60 text-blue-800'
                            : row.status === 'Recycled'
                            ? 'bg-teal-100/60 text-teal-800'
                            : 'bg-amber-100/60 text-amber-800'
                        }`}
                      >
                        <option value="Pending Review">Pending Review</option>
                        <option value="Sorted">Sorted</option>
                        <option value="Processed">Processed</option>
                        <option value="Recycled">Recycled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button 
                          onClick={() => alert(`Reviewing Waste Log ID: ${row.batch_id}\nFabric: ${row.fabric_type}\nComposition: ${row.material_composition}`)}
                          className="text-slate-400 hover:text-emerald-600 transition-colors p-1"
                          title="View Details"
                        >
                          <FiEye className="h-4.5 w-4.5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(row.id)}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                          title="Delete Log"
                        >
                          <FiTrash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <p className="font-semibold text-slate-600">No logs match your filter</p>
              <p className="text-xs">Adjust your search input or status selector option to view other results.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
