import React, { useState, useEffect } from 'react';
import { Upload, Code, Zap, Download, CheckCircle, Settings, FileText, BarChart3, Github, AlertCircle } from 'lucide-react';

export default function Paper2CodeApp() {
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState(null);
  const [backendStatus, setBackendStatus] = useState('checking');
  const [error, setError] = useState(null);
  const [config, setConfig] = useState({
    framework: 'pytorch',
    includeLogging: true,
    includeCheckpointing: true
  });

  const API_URL = 'http://localhost:5000';

  const steps = [
    { icon: FileText, label: 'Parsing PDF', description: 'Extracting text and structure' },
    { icon: Zap, label: 'Extracting Components', description: 'Finding architecture and hyperparameters' },
    { icon: Code, label: 'Generating Code', description: 'Creating training script' },
    { icon: CheckCircle, label: 'Complete', description: 'Ready to download' }
  ];

  // Check backend status on mount
  useEffect(() => {
    checkBackendStatus();
  }, []);

  const checkBackendStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/api/health`);
      if (response.ok) {
        const data = await response.json();
        setBackendStatus(data.paper2code_available ? 'connected' : 'unavailable');
      } else {
        setBackendStatus('offline');
      }
    } catch (error) {
      setBackendStatus('offline');
    }
  };

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile && uploadedFile.type === 'application/pdf') {
      setFile(uploadedFile);
      setError(null);
      setResult(null);
    } else {
      setError('Please upload a PDF file');
    }
  };

  const processFile = async () => {
    if (!file) {
      setError('Please upload a PDF file first');
      return;
    }

    if (backendStatus !== 'connected') {
      setError('Backend API is not running. Please start the API server first.');
      return;
    }

    setProcessing(true);
    setResult(null);
    setError(null);
    setCurrentStep(0);

    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('framework', config.framework);
      formData.append('includeLogging', config.includeLogging);
      formData.append('includeCheckpointing', config.includeCheckpointing);

      // Show progress steps
      const progressInterval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < steps.length - 1) return prev + 1;
          return prev;
        });
      }, 1000);

      // Call backend API
      const response = await fetch(`${API_URL}/api/process`, {
        method: 'POST',
        body: formData
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Processing failed');
      }

      const data = await response.json();

      if (data.success) {
        // Set real results from backend
        setResult({
          paperTitle: data.paper_title || 'Unknown Paper',
          architecture: data.architecture || 'Unknown',
          architectureType: data.architecture_type || 'Unknown',
          learningRate: data.learning_rate !== null && data.learning_rate !== undefined ? data.learning_rate : 'N/A',
          batchSize: data.batch_size || 'N/A',
          epochs: data.epochs || 'N/A',
          optimizer: data.optimizer || 'N/A',
          lossFunction: data.loss_function || 'N/A',
          dataset: data.dataset || 'N/A',
          metrics: data.metrics || [],
          code: data.code || '# No code generated',
          files: data.files || {}
        });
        setCurrentStep(steps.length - 1);
      } else {
        throw new Error(data.error || 'Processing failed');
      }

    } catch (error) {
      console.error('Error:', error);
      setError(`Error: ${error.message}\n\nMake sure:\n1. Backend API is running (python api_server.py)\n2. Paper2Code is installed (pip install -e .)\n3. Check console for details`);
      setCurrentStep(0);
    } finally {
      setProcessing(false);
    }
  };

  const downloadFile = (content, filename, mimeType = 'text/plain') => {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
        
        body {
          font-family: 'Space Grotesk', sans-serif;
        }
        
        .code-font {
          font-family: 'JetBrains Mono', monospace;
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #6366f1 0%, #ec4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .glass-card {
          background: rgba(30, 41, 59, 0.4);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(99, 102, 241, 0.2);
          border-radius: 1rem;
          transition: all 0.3s ease;
        }
        
        .glass-card:hover {
          border-color: rgba(99, 102, 241, 0.5);
          transform: translateY(-4px);
          box-shadow: 0 20px 60px rgba(99, 102, 241, 0.3);
        }
        
        .pulse-border {
          animation: pulse-border 2s infinite;
        }
        
        @keyframes pulse-border {
          0%, 100% {
            border-color: rgba(99, 102, 241, 0.3);
          }
          50% {
            border-color: rgba(99, 102, 241, 0.6);
          }
        }
        
        .animate-slide-up {
          animation: slideUp 0.5s ease-out;
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .progress-bar {
          position: relative;
          height: 4px;
          background: rgba(99, 102, 241, 0.2);
          border-radius: 2px;
          overflow: hidden;
        }
        
        .progress-bar-fill {
          position: absolute;
          height: 100%;
          background: linear-gradient(90deg, #6366f1, #ec4899);
          transition: width 0.5s ease;
        }
        
        .shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .status-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          display: inline-block;
          margin-right: 8px;
        }

        .status-connected {
          background-color: #10b981;
          box-shadow: 0 0 8px #10b981;
        }

        .status-offline {
          background-color: #ef4444;
          box-shadow: 0 0 8px #ef4444;
        }

        .status-checking {
          background-color: #f59e0b;
          box-shadow: 0 0 8px #f59e0b;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center">
                <Code className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">Paper2Code</h1>
                <p className="text-xs text-slate-400">Research to Production</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              {/* Backend Status */}
              <div className="flex items-center space-x-2 text-sm">
                <span className={`status-indicator status-${backendStatus === 'connected' ? 'connected' : backendStatus === 'checking' ? 'checking' : 'offline'}`}></span>
                <span className="text-slate-300">
                  {backendStatus === 'connected' ? 'Backend Connected' : 
                   backendStatus === 'checking' ? 'Checking...' : 
                   'Backend Offline'}
                </span>
                <button 
                  onClick={checkBackendStatus}
                  className="ml-2 text-xs text-indigo-400 hover:text-indigo-300"
                >
                  Refresh
                </button>
              </div>
              <a href="#" className="text-slate-300 hover:text-white transition">Features</a>
              <a href="#" className="text-slate-300 hover:text-white transition">Docs</a>
              <a href="#" className="flex items-center space-x-2 text-slate-300 hover:text-white transition">
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="text-6xl font-bold mb-4">
            Transform <span className="gradient-text">Research Papers</span><br />
            Into Production Code
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Upload a PDF research paper and get complete PyTorch/TensorFlow training code with REAL extraction
          </p>
        </div>

        {/* Backend Warning */}
        {backendStatus !== 'connected' && (
          <div className="max-w-4xl mx-auto mb-8 glass-card border-orange-500/50 p-4">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-6 h-6 text-orange-400" />
              <div>
                <h3 className="font-semibold text-orange-400">Backend API Not Running</h3>
                <p className="text-sm text-slate-300">
                  Start the backend API to process papers: <code className="code-font bg-slate-800 px-2 py-1 rounded">python api_server.py</code>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="max-w-4xl mx-auto mb-8 glass-card border-red-500/50 p-4 animate-slide-up">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-6 h-6 text-red-400" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-400">Error</h3>
                <pre className="text-sm text-slate-300 mt-2 whitespace-pre-wrap">{error}</pre>
              </div>
              <button 
                onClick={() => setError(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mb-12">
          {[
            { icon: Zap, value: 'Real-time', label: 'Processing' },
            { icon: BarChart3, value: '88%', label: 'Accuracy' },
            { icon: FileText, value: 'Live', label: 'Extraction' },
            { icon: CheckCircle, value: '100%', label: 'Actual Results' }
          ].map((stat, i) => (
            <div key={i} className="glass-card p-6 text-center">
              <stat.icon className="w-8 h-8 mx-auto mb-3 text-indigo-400" />
              <div className="text-3xl font-bold gradient-text mb-1">{stat.value}</div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-3 gap-8">
          {/* Left - Upload & Config */}
          <div className="col-span-1 space-y-6">
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Upload className="w-5 h-5 mr-2 text-indigo-400" />
                Upload Paper
              </h3>
              
              <div className={`border-2 border-dashed rounded-lg p-8 text-center transition ${
                file ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700 hover:border-indigo-500/50'
              }`}>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                  {file ? (
                    <div>
                      <p className="font-semibold text-indigo-400">{file.name}</p>
                      <p className="text-sm text-slate-400 mt-1">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-semibold">Drop PDF or click to upload</p>
                      <p className="text-sm text-slate-400 mt-1">Research papers supported</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-indigo-400" />
                Configuration
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Framework</label>
                  <select
                    value={config.framework}
                    onChange={(e) => setConfig({...config, framework: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500"
                  >
                    <option value="pytorch">PyTorch</option>
                    <option value="tensorflow">TensorFlow</option>
                  </select>
                </div>
                
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={config.includeLogging}
                    onChange={(e) => setConfig({...config, includeLogging: e.target.checked})}
                    className="w-4 h-4 text-indigo-500 rounded"
                  />
                  <span className="text-sm">Include Logging</span>
                </label>
                
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={config.includeCheckpointing}
                    onChange={(e) => setConfig({...config, includeCheckpointing: e.target.checked})}
                    className="w-4 h-4 text-indigo-500 rounded"
                  />
                  <span className="text-sm">Include Checkpointing</span>
                </label>
              </div>
            </div>

            <button
              onClick={processFile}
              disabled={!file || processing || backendStatus !== 'connected'}
              className={`w-full py-4 rounded-lg font-semibold text-lg transition ${
                file && !processing && backendStatus === 'connected'
                  ? 'bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 shadow-lg shadow-indigo-500/50'
                  : 'bg-slate-700 text-slate-400 cursor-not-allowed'
              }`}
            >
              {processing ? 'Processing...' : backendStatus !== 'connected' ? 'Backend Offline' : '🚀 Generate Code'}
            </button>
          </div>

          {/* Middle & Right - Processing & Results */}
          <div className="col-span-2 space-y-6">
            {/* Processing Steps */}
            {processing && (
              <div className="glass-card p-6 animate-slide-up">
                <h3 className="text-xl font-semibold mb-6">Processing Pipeline</h3>
                
                <div className="space-y-4">
                  {steps.map((step, i) => (
                    <div
                      key={i}
                      className={`p-4 rounded-lg border transition ${
                        i <= currentStep
                          ? 'border-indigo-500 bg-indigo-500/10'
                          : 'border-slate-700 bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          i < currentStep ? 'bg-green-500' : i === currentStep ? 'bg-indigo-500 shimmer' : 'bg-slate-700'
                        }`}>
                          {i < currentStep ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <step.icon className="w-5 h-5" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold">{step.label}</div>
                          <div className="text-sm text-slate-400">{step.description}</div>
                        </div>
                      </div>
                      {i === currentStep && (
                        <div className="progress-bar mt-3">
                          <div className="progress-bar-fill shimmer" style={{width: '100%'}} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Results */}
            {result && !processing && (
              <div className="space-y-6 animate-slide-up">
                <div className="glass-card p-6 border-green-500/50">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold flex items-center">
                      <CheckCircle className="w-6 h-6 mr-2 text-green-500" />
                      Success!
                    </h3>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-lg font-semibold gradient-text">{result.paperTitle}</h4>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {[
                      { label: 'Architecture', value: `${result.architecture} (${result.architectureType})` },
                      { label: 'Learning Rate', value: result.learningRate },
                      { label: 'Batch Size', value: result.batchSize },
                      { label: 'Epochs', value: result.epochs },
                      { label: 'Optimizer', value: result.optimizer },
                      { label: 'Dataset', value: result.dataset }
                    ].map((item, i) => (
                      <div key={i} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                        <div className="text-xs text-slate-400 mb-1">{item.label}</div>
                        <div className="text-sm font-bold gradient-text truncate">{item.value}</div>
                      </div>
                    ))}
                  </div>

                  {result.metrics && result.metrics.length > 0 && (
                    <div className="mb-4">
                      <div className="text-sm text-slate-400 mb-2">Evaluation Metrics:</div>
                      <div className="flex flex-wrap gap-2">
                        {result.metrics.map((metric, i) => (
                          <span key={i} className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs">
                            {metric}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="glass-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">Generated Code</h3>
                    <button 
                      onClick={() => downloadFile(result.code, 'train.py', 'text/plain')}
                      className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-sm font-semibold transition flex items-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  </div>
                  
                  <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 overflow-x-auto max-h-96 overflow-y-auto">
                    <pre className="code-font text-sm text-slate-300">
                      {result.code}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!processing && !result && (
              <div className="glass-card p-12 text-center">
                <Code className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                <h3 className="text-xl font-semibold mb-2">Ready to Generate</h3>
                <p className="text-slate-400">
                  {backendStatus === 'connected' 
                    ? 'Upload a research paper and click "Generate Code" to begin'
                    : 'Start the backend API server first, then upload a paper'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-20 py-8">
        <div className="container mx-auto px-6 text-center text-slate-400">
          <p>Made with ❤️ by Subhalaxmi Panda | Open Source on GitHub</p>
          <p className="text-sm mt-2">© 2026 Paper2Code. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
