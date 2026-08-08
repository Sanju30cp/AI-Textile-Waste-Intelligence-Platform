import React, { useState, useRef, useEffect } from 'react';
import { FiUploadCloud, FiFile, FiCheckCircle, FiLoader, FiCamera, FiAlertCircle } from 'react-icons/fi';

export default function Upload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [loadingText, setLoadingText] = useState('Uploading...');
  const fileInputRef = useRef(null);

  useEffect(() => {
    let interval;
    if (analyzing) {
      const steps = ['Uploading...', 'Analyzing...', 'Predicting...', 'Generating Recommendation...'];
      let idx = 0;
      setLoadingText(steps[idx]);
      interval = setInterval(() => {
        idx = Math.min(idx + 1, steps.length - 1);
        setLoadingText(steps[idx]);
      }, 700);
    }
    return () => clearInterval(interval);
  }, [analyzing]);

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

  const runAnalysis = async () => {
    if (!selectedFile) return;

    setAnalyzing(true);
    setResult(null);

    try {
      // 1. Upload the image
      const formData = new FormData();
      formData.append("file", selectedFile);
      
      let uploadRes;
      try {
        uploadRes = await fetch("http://localhost:8000/upload", {
          method: "POST",
          body: formData,
        });
      } catch (err) {
        throw new Error("Server down. Could not connect to API.");
      }
      
      if (uploadRes.status === 413) throw new Error("Image too large. Maximum size is 5MB.");
      if (uploadRes.status === 400) throw new Error("Unsupported format. Use JPG, PNG, WEBP.");
      if (!uploadRes.ok) throw new Error("Upload failed due to server error.");
      const uploadData = await uploadRes.json();
      
      // 2. Call predict endpoint
      let predictRes;
      try {
        predictRes = await fetch(`http://localhost:8000/predict?filename=${uploadData.filename}`, {
          method: "POST"
        });
      } catch (err) {
        throw new Error("Server down during prediction.");
      }
      
      if (predictRes.status === 422 || predictRes.status === 500) throw new Error("No prediction could be made. AI Model failed.");
      if (predictRes.status === 503) throw new Error("Database unavailable.");
      if (!predictRes.ok) throw new Error("Prediction failed.");
      const prediction = await predictRes.json();
      
      // Map to UI expectations
      setResult({
        success: true,
        product_type: prediction.product_type || 'Unknown',
        confidence: prediction.confidence || 0,
        waste_category: prediction.waste_category || 'Unknown',
        recyclability: prediction.recyclability || 'Unknown',
        recommendation: prediction.recommendation || 'No recommendation available',
        sustainability_score: prediction.sustainability_score || 0
      });

    } catch (error) {
      console.error("Error analyzing image:", error);
      setResult({
        success: false,
        errorMessage: error.message || 'An unknown error occurred.',
      });
    } finally {
      setAnalyzing(false);
    }
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
                <p className="text-xs text-slate-400">PNG, JPG, or WEBP (Max 5MB)</p>
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
                  <span>{loadingText}</span>
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
                <p className="text-sm font-semibold text-slate-700">{loadingText}</p>
                <p className="text-xs text-slate-400">Please wait while we process the textile image.</p>
              </div>
            </div>
          ) : result ? (
            <div className="flex-1 flex flex-col justify-center h-full">
              {result.success ? (
                <div className="space-y-6">
                  <div className="space-y-4">
                    {/* Result Headline */}
                    <div className="flex items-center gap-2.5 text-emerald-600">
                      <FiCheckCircle className="h-6 w-6 shrink-0" />
                      <span className="font-bold text-slate-800 text-lg">Analysis Complete</span>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-2 gap-4 border-y border-slate-100 py-4">
                      <div>
                        <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold">Prediction</span>
                        <span className="text-base font-bold text-slate-800">{result.product_type}</span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold">Confidence</span>
                        <span className="text-base font-bold text-slate-800">{result.confidence}%</span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold">Waste Category</span>
                        <span className="text-base font-bold text-slate-800">{result.waste_category}</span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold">Sustainability Score</span>
                        <span className="text-base font-bold text-emerald-600">{result.sustainability_score}%</span>
                      </div>
                    </div>

                    {/* Recyclability score */}
                    <div>
                      <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold mb-1">Recyclability</span>
                      <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${result.recyclability === 'High' ? 'text-emerald-700 bg-emerald-100/60 border-emerald-200' : 'text-amber-600 bg-amber-50 border-amber-100'}`}>
                        {result.recyclability}
                      </span>
                    </div>

                    {/* Actionable recommendation */}
                    <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
                      <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold mb-1.5">Recommendation</span>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        {result.recommendation}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 space-y-4 text-center">
                  <div className="h-16 w-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
                    <FiAlertCircle className="h-8 w-8" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-800 mb-1">Processing Failed</h4>
                    <p className="text-sm text-slate-600 max-w-xs">{result.errorMessage}</p>
                  </div>
                </div>
              )}
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
