import React from 'react';
import { FiFeather, FiCpu, FiDatabase, FiUsers, FiTarget, FiCode } from 'react-icons/fi';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
          <FiFeather className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800">Textile Waste Intelligence Platform</h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg">
          An AI-powered system driving circular economy initiatives by automating the classification, sorting, and lifecycle tracking of textile waste.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Objectives */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg"><FiTarget className="h-5 w-5" /></div>
            <h2 className="text-lg font-bold text-slate-800">Project Objectives</h2>
          </div>
          <ul className="space-y-2.5 text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400"></span>
              Automate the sorting process of post-consumer textile waste using computer vision.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400"></span>
              Provide actionable insights for recycling, downcycling, and repair streams.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400"></span>
              Calculate sustainability scores to track environmental impact and circularity metrics.
            </li>
          </ul>
        </div>

        {/* Tech Stack */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg"><FiCode className="h-5 w-5" /></div>
            <h2 className="text-lg font-bold text-slate-800">Technology Stack</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Frontend</span>
              <ul className="text-slate-600 font-medium space-y-1">
                <li>React.js (Vite)</li>
                <li>Tailwind CSS</li>
                <li>Chart.js</li>
              </ul>
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Backend</span>
              <ul className="text-slate-600 font-medium space-y-1">
                <li>FastAPI (Python)</li>
                <li>PostgreSQL</li>
                <li>SQLAlchemy</li>
              </ul>
            </div>
          </div>
        </div>

        {/* AI Model */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg"><FiCpu className="h-5 w-5" /></div>
            <h2 className="text-lg font-bold text-slate-800">AI Architecture</h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            The core computer vision model utilizes <strong className="text-slate-800">EfficientNet-B0</strong> implemented in PyTorch. 
            It has been fine-tuned using transfer learning to classify complex weave patterns, material blends, and garment structures.
            The model achieves high accuracy with minimal inference latency, making it ideal for real-time edge sorting facilities.
          </p>
        </div>

        {/* Dataset */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg"><FiDatabase className="h-5 w-5" /></div>
            <h2 className="text-lg font-bold text-slate-800">Dataset Overview</h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed mb-3">
            Trained on a comprehensive dataset of over 12,000 annotated images of post-consumer garments and textile swatches across multiple classes (Denim, Wool, Synthetic, Cotton Blends).
          </p>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-slate-100 rounded text-xs font-semibold text-slate-600 border border-slate-200">12,278 Images</span>
            <span className="px-2.5 py-1 bg-slate-100 rounded text-xs font-semibold text-slate-600 border border-slate-200">Kaggle Source</span>
          </div>
        </div>

      </div>

      {/* Developers */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg"><FiUsers className="h-5 w-5" /></div>
          <h2 className="text-lg font-bold text-slate-800">Development Team</h2>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">
          This platform was developed as a specialized solution for the Infosys Project initiative, bringing together expertise in deep learning, modern web development, and sustainable systems architecture.
        </p>
        <div className="flex items-center gap-3 mt-4">
          <div className="h-10 w-10 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center font-bold text-slate-500">
            S
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">Sanju B</h4>
            <p className="text-xs text-slate-500">Lead Developer</p>
          </div>
        </div>
      </div>

    </div>
  );
}
