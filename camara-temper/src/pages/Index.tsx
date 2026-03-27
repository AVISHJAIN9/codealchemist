import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, RotateCcw, Zap } from 'lucide-react';
import FileUploadZone from '@/components/FileUploadZone';
import MetadataPanel from '@/components/MetadataPanel';
import AuthenticityGauge from '@/components/AuthenticityGauge';
import GpsMap from '@/components/GpsMap';
import FilePreview from '@/components/FilePreview';
import { analyzeFile, type FileMetadata } from '@/lib/fileAnalyzer';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<FileMetadata | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileSelect = useCallback(async (selectedFile: File) => {
    setFile(selectedFile);
    setMetadata(null);
    setIsAnalyzing(true);

    // Small delay for UX
    await new Promise(r => setTimeout(r, 1500));

    const result = await analyzeFile(selectedFile);
    setMetadata(result);
    setIsAnalyzing(false);
  }, []);

  const handleReset = () => {
    setFile(null);
    setMetadata(null);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-background grid-bg">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 border border-primary/30 rounded-lg flex items-center justify-center nvidia-glow">
              <Cpu className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-lg sm:text-xl font-bold text-foreground tracking-wider">
                DEEP<span className="text-primary">SCAN</span>
              </h1>
              <p className="text-[10px] text-muted-foreground font-display tracking-[0.3em]">
                FORENSIC FILE ANALYZER
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {metadata && (
              <Button variant="outline" size="sm" onClick={handleReset} className="gap-2 font-display text-xs tracking-wider">
                <RotateCcw className="w-3 h-3" />
                NEW SCAN
              </Button>
            )}
            <div className="flex items-center gap-1.5 text-primary text-xs font-display">
              <Zap className="w-3 h-3" />
              <span className="hidden sm:inline tracking-wider">POWERED BY NVIDIA</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <AnimatePresence mode="wait">
          {!metadata && !isAnalyzing ? (
            <motion.div key="upload" exit={{ opacity: 0, y: -20 }}>
              {/* Hero */}
              <div className="text-center mb-12 mt-8">
                <motion.h2
                  className="font-display text-3xl sm:text-5xl font-bold text-foreground mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  REVERSE ENGINEER{' '}
                  <span className="text-primary nvidia-text-glow">ANY FILE</span>
                </motion.h2>
                <motion.p
                  className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Extract hidden metadata, identify camera origins, recover GPS locations,
                  and detect manipulation with AI-powered forensic analysis.
                </motion.p>
              </div>

              <div className="max-w-2xl mx-auto">
                <FileUploadZone onFileSelect={handleFileSelect} isAnalyzing={false} />
              </div>

              {/* Feature cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 max-w-3xl mx-auto">
                {[
                  { icon: '📷', title: 'Camera ID', desc: 'Identify make, model, lens & settings' },
                  { icon: '📍', title: 'GPS Recovery', desc: 'Extract embedded geolocation data' },
                  { icon: '🔍', title: 'Tamper Detection', desc: 'Detect editing software & manipulation' },
                ].map((f, i) => (
                  <motion.div
                    key={f.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="bg-card border border-border rounded-lg p-5 text-center hover:border-primary/30 transition-colors"
                  >
                    <span className="text-2xl">{f.icon}</span>
                    <h3 className="font-display text-sm text-foreground mt-2 tracking-wider">{f.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{f.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : !metadata && isAnalyzing ? (
            <motion.div key="scanning" className="max-w-2xl mx-auto mt-16">
              <FileUploadZone onFileSelect={handleFileSelect} isAnalyzing={true} />
            </motion.div>
          ) : metadata ? (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Left column */}
              <div className="lg:col-span-2 space-y-6">
                {file && <FilePreview file={file} />}
                {metadata.latitude !== undefined && metadata.longitude !== undefined && (
                  <GpsMap
                    latitude={metadata.latitude}
                    longitude={metadata.longitude}
                    altitude={metadata.altitude}
                  />
                )}
                <MetadataPanel metadata={metadata} />
              </div>

              {/* Right column */}
              <div className="space-y-6">
                <AuthenticityGauge score={metadata.authenticityScore} flags={metadata.flags} />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-6 text-center">
        <p className="text-xs text-muted-foreground font-display tracking-widest">
          DEEPSCAN v1.0 • CLIENT-SIDE FORENSIC ENGINE • NO DATA LEAVES YOUR DEVICE
        </p>
      </footer>
    </div>
  );
};

export default Index;
