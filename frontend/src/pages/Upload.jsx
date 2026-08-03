import React, { useState, useRef } from 'react';
import { FiUploadCloud, FiFile, FiCheckCircle, FiLoader, FiCamera } from 'react-icons/fi';

export default function Upload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const mockPredictions = [
    {
      fabric: 'Cotton Polyester Blend',
      material: '65% Cotton, 35% Polyester',
      recyclability: 'High (82%)',
      recyclabilityColor: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      recommendation: 'Ideal for mechanical fiber recovery. Sort and shred for yarn spinning or use in premium upholstery fillings.'
    },
    {
      fabric: 'Pure Cotton Denim',
      material: '100% Cotton',
      recyclability: 'Optimal (95%)',
      recyclabilityColor: 'text-emerald-700 bg-emerald-100/60 border-emerald-200',
      recommendation: 'Shred and spin back into recycled denim yarns. Perfect for closed-loop clothing manufacture.'
    },
    {
      fabric: 'Synthetic Sportswear',
      material: '88% Polyester, 12% Spandex',
      recyclability: 'Medium (55%)',
      recyclabilityColor: 'text-amber-600 bg-amber-50 border-amber-100',
      recommendation: 'Difficult to recycle mechanically. Suitable for chemical depolymerization or composite reinforcement fabrics.'
    },
    {
      fabric: 'Heavy Wool Blend',
      material: '80% Wool, 20% Nylon',
      recyclability: 'High (78%)',
      recyclabilityColor: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      recommendation: 'Shred to recover wool fibers. Recommended for thermo-acoustic insulation panels or industrial felt.'
    }
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const runAnalysis = () => {
    if (!selectedFile) return;

    setAnalyzing(true);
    setResult(null);

    // Simulate FastAPI deep learning image analysis
    setTimeout(() => {
      setAnalyzing(false);
      // Pick a random mock result based on the filename/random index
      const randomIndex = Math.floor(Math.random() * mockPredictions.length);
      const prediction = mockPredictions[randomIndex];
      setResult(prediction);

      // Save to mock inventory logs
      const savedLogs = JSON.parse(localStorage.getItem('textileInventory') || '[]');
      const newLog = {
        id: `TX-${1000 + savedLogs.length + 3}`,
        fabric: prediction.fabric,
        material: prediction.material,
        quantity: `${Math.floor(Math.random() * 800) + 100} kg`,
        date: new Date().toISOString().split('T')[0],
        recyclability: prediction.recyclability.includes('High') || prediction.recyclability.includes('Optimal') ? 'High' : 'Medium',
        status: 'Sorted',
        imageUrl: previewUrl
      };
      savedLogs.unshift(newLog);
      localStorage.setItem('textileInventory', JSON.stringify(savedLogs));

    }, 2200);
  };

  const clearUpload = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Upload Container */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col">
          <h3 className="font-bold text-slate-800 text-lg mb-4">Analyze Fabric Sample</h3>
          
          {/* Drag & Drop Area */}
          <div 
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={!previewUrl ? handleUploadClick : undefined}
            className={`flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 transition-colors ${
              previewUrl 
                ? 'border-slate-200 bg-slate-50/50' 
                : 'border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/10 cursor-pointer'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            {previewUrl ? (
              <div className="w-full space-y-4">
                <img 
                  src={previewUrl} 
                  alt="Textile preview" 
                  className="mx-auto max-h-64 rounded-lg object-cover shadow-sm border border-slate-200" 
                />
                <div className="flex items-center justify-between text-xs text-slate-500 bg-white border border-slate-100 p-2 rounded-lg">
                  <span className="truncate max-w-[200px] font-medium">{selectedFile.name}</span>
                  <button 
                    onClick={clearUpload} 
                    className="font-semibold text-rose-600 hover:text-rose-700 cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-3">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <FiUploadCloud className="h-7 w-7" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">Click to upload</span>
                  <span className="text-sm text-slate-500"> or drag and drop</span>
                </div>
                <p className="text-xs text-slate-400">PNG, JPG, or WEBP (Max 10MB)</p>
              </div>
            )}
          </div>

          {/* Action Trigger */}
          {previewUrl && (
            <button
              onClick={runAnalysis}
              disabled={analyzing}
              className="mt-5 w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white shadow-md shadow-emerald-600/10 hover:bg-emerald-700 active:scale-98 transition-all duration-150 disabled:bg-slate-300 disabled:scale-100 flex justify-center items-center gap-2.5 cursor-pointer"
            >
              {analyzing ? (
                <>
                  <FiLoader className="h-5 w-5 animate-spin" />
                  <span>Running AI Classification...</span>
                </>
              ) : (
                <>
                  <FiCamera className="h-5 w-5" />
                  <span>Analyze Textile Composition</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Prediction Results Display */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col">
          <h3 className="font-bold text-slate-800 text-lg mb-4">Classification Results</h3>
          
          {analyzing ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4">
              <div className="relative flex items-center justify-center h-16 w-16">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-20"></span>
                <div className="rounded-full bg-emerald-50 p-4 text-emerald-600">
                  <FiLoader className="h-7 w-7 animate-spin" />
                </div>
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm font-semibold text-slate-700">Extracting Fabric Patterns...</p>
                <p className="text-xs text-slate-400">Comparing with synthetic & natural weave libraries.</p>
              </div>
            </div>
          ) : result ? (
            <div className="flex-1 flex flex-col justify-between space-y-6">
              
              <div className="space-y-4">
                {/* Result Headline */}
                <div className="flex items-center gap-2.5 text-emerald-600">
                  <FiCheckCircle className="h-6 w-6 shrink-0" />
                  <span className="font-bold text-slate-800 text-lg">Analysis Complete</span>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 gap-4 border-y border-slate-100 py-4">
                  <div>
                    <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold">Fabric Type</span>
                    <span className="text-base font-bold text-slate-800">{result.fabric}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold">Material Composition</span>
                    <span className="text-base font-bold text-slate-800">{result.material}</span>
                  </div>
                </div>

                {/* Recyclability score */}
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold mb-1">Recyclability Score</span>
                  <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${result.recyclabilityColor}`}>
                    {result.recyclability}
                  </span>
                </div>

                {/* Actionable recommendation */}
                <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
                  <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold mb-1.5">Recycling Recommendation</span>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {result.recommendation}
                  </p>
                </div>
              </div>

              <div className="text-xs text-slate-400 text-center font-medium bg-slate-50 border border-slate-100 py-2 rounded-lg">
                Log saved successfully to inventory list.
              </div>

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-2">
              <FiFile className="h-12 w-12 text-slate-300" />
              <p className="text-sm font-semibold">No active analysis</p>
              <p className="text-xs max-w-[220px]">Upload a textile image and run the prediction classifier to view composition results.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
