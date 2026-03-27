import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const featureConfig = {
  "call-detection": {
    name: "Call Detection & SMS",
    desc: "Analyze and verify call transcripts and SMS messages for authenticity",
    color: "#00a8e0",
    path: "calldetection-sms-contentdetection"
  },
  "camera-tampering": {
    name: "Camera Tampering Detection",
    desc: "Detect manipulated or tampered video and image content",
    color: "#f5a623",
    path: "camara-temper"
  },
  "deepscan": {
    name: "DeepScan v2",
    desc: "Advanced content analysis with deep learning models",
    color: "#76b900",
    path: "deepscan-v2-complete (1)"
  },
  "media-vault": {
    name: "MediaVault",
    desc: "Secure media storage and verification",
    color: "#a855f7",
    path: "mediavault 2"
  },
  "truthlens": {
    name: "TruthLens Complete",
    desc: "Comprehensive truth verification and fact-checking",
    color: "#e53935",
    path: "truthlens-complete-project 2"
  },
  "truthlens-ext": {
    name: "TruthLens Extension",
    desc: "Browser extension for real-time content verification",
    color: "#e53935",
    path: "truthlens-complete-project 2/extension"
  },
  "truthlence": {
    name: "TruthLence",
    desc: "Multi-media content analysis and verification",
    color: "#00a8e0",
    path: "truthlence"
  }
};

const FeatureEmbed = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const featureData = featureConfig[id as keyof typeof featureConfig];
  const [availablePort, setAvailablePort] = useState(5176);

  useEffect(() => {
    if (!featureData) return;
    
    // Try to detect which port the feature is on by making requests
    const checkPort = async (port: number) => {
      try {
        const response = await fetch(`http://localhost:${port}/`, { 
          method: 'HEAD',
          mode: 'no-cors'
        });
        setAvailablePort(port);
        return true;
      } catch {
        // Try next port
        if (port < 5200) {
          setTimeout(() => checkPort(port + 1), 100);
        }
        return false;
      }
    };
    
    checkPort(5176);
  }, [featureData]);

  if (!featureData) {
    return (
      <div style={{ minHeight: "100vh", background: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 48, fontWeight: 800, color: "#e53935", marginBottom: 16 }}>404</div>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 12, color: "#a0a0a0", marginBottom: 24 }}>FEATURE NOT FOUND</div>
        <button onClick={() => navigate("/")} style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, fontWeight: 800, color: "#000", background: "#76b900", border: "none", padding: "12px 28px", cursor: "pointer", letterSpacing: 1, textTransform: "uppercase" }}>← BACK HOME</button>
      </div>
    );
  }

  const featureUrl = `http://localhost:${availablePort}`;

  return (
    <div style={{ minHeight: "100vh", background: "#000", display: "flex", flexDirection: "column" }}>
      {/* Feature Header */}
      <div style={{ background: "#0a0a0a", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "24px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", gap: 16, justifyContent: "space-between" }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <button onClick={() => navigate("/")} style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 14, color: "#76b900", background: "transparent", border: "none", cursor: "pointer" }}>← HOME</button>
              <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.15)" }} />
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 24, fontWeight: 800, color: featureData.color, textTransform: "uppercase", letterSpacing: ".5px" }}>{featureData.name}</div>
            </div>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 12, color: "#a0a0a0" }}>{featureData.desc}</div>
          </div>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <a href={featureUrl} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, fontWeight: 700, color: "#000", background: featureData.color, border: "none", padding: "10px 20px", cursor: "pointer", letterSpacing: 1, textTransform: "uppercase", textDecoration: "none", whiteSpace: "nowrap" }}>LAUNCH IN NEW TAB ↗</a>
          </div>
        </div>
      </div>

      {/* Feature Content - Redirect Message */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", padding: "40px 20px", textAlign: "center" }}>
        <div style={{ maxWidth: 600, background: "#0a0a0a", border: `1px solid ${featureData.color}40`, padding: "40px", borderRadius: 0, borderLeft: `3px solid ${featureData.color}` }}>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 48, fontWeight: 800, color: featureData.color, marginBottom: 16 }}>◉</div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 28, fontWeight: 800, color: "#fff", marginBottom: 10, textTransform: "uppercase" }}>{featureData.name}</div>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 12, color: "#a0a0a0", marginBottom: 28, lineHeight: 1.8 }}>
            // Project Path<br />
            {featureData.path}
          </div>
          <div style={{ fontSize: 14, color: "#a0a0a0", lineHeight: 1.8, marginBottom: 32 }}>
            <p style={{ marginBottom: 12 }}>This tool is running locally on your machine.</p>
            <p style={{ marginBottom: 12 }}>Click the button below to access it in a new browser tab.</p>
            <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 12, color: "#76b900" }}>Detected on: {featureUrl}</p>
          </div>
          <a href={featureUrl} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", fontFamily: "'Barlow Condensed', sans-serif", fontSize: 15, fontWeight: 800, color: "#000", background: featureData.color, border: "none", padding: "14px 40px", cursor: "pointer", letterSpacing: 1, textTransform: "uppercase", textDecoration: "none", marginBottom: 12 }}>OPEN FEATURE →</a>
          
          <div style={{ marginTop: 20, paddingTop: 20, borderTop: `1px solid ${featureData.color}20`, fontSize: 12, color: "#555" }}>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", marginBottom: 10 }}>// Quick Navigation</div>
            <button onClick={() => navigate("/")} style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: "#76b900", background: "transparent", border: "1px solid #76b900", padding: "8px 16px", cursor: "pointer", marginRight: 8 }}>← Back to Dashboard</button>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div style={{ background: "#0a0a0a", borderTop: "1px solid rgba(255,255,255,0.08)", padding: "16px 32px", textAlign: "center", fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: "#555" }}>
        Make sure the feature is running locally before accessing. Check the terminal or run: npm run dev
      </div>
    </div>
  );
};

export default FeatureEmbed;
