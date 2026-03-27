import React, { useState } from "react";
import { ArrowRight, Shield, Video, Database, Zap, Lock, Globe } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  link: string;
}

const Hub = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const projects: Project[] = [
    {
      id: "calldetection",
      title: "Call Detection & SMS",
      description: "Detect fraudulent calls and harmful SMS content with AI-powered analysis",
      icon: <Shield className="w-8 h-8" />,
      color: "from-red-600 to-pink-600",
      link: "http://localhost:5182",
    },
    {
      id: "camera",
      title: "Camera Temper Detection",
      description: "Real-time detection of camera tampering and unauthorized access",
      icon: <Video className="w-8 h-8" />,
      color: "from-blue-600 to-cyan-600",
      link: "http://localhost:5183",
    },
    {
      id: "mediavault",
      title: "MediaVault",
      description: "Secure storage and management of digital media with encryption",
      icon: <Database className="w-8 h-8" />,
      color: "from-purple-600 to-indigo-600",
      link: "http://localhost:5184",
    },
    {
      id: "truthlence",
      title: "TruthLence",
      description: "Fact-checking and content verification platform powered by AI",
      icon: <Zap className="w-8 h-8" />,
      color: "from-yellow-600 to-orange-600",
      link: "https://tar-buddy-connect.lovable.app/",
    },
    {
      id: "truthlens",
      title: "TruthLens Extension",
      description: "Browser extension for real-time fact-checking and source verification",
      icon: <Lock className="w-8 h-8" />,
      color: "from-green-600 to-emerald-600",
      link: "https://tar-buddy-connect.lovable.app/",
    },
    {
      id: "integration",
      title: "Dashboard",
      description: "Access the main VeritAI dashboard with all integrated features",
      icon: <Globe className="w-8 h-8" />,
      color: "from-slate-600 to-gray-600",
      link: "/dashboard",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-slate-800/50 backdrop-blur-xl bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                TruthGuard Hub
              </h1>
              <p className="text-slate-400 mt-2 text-lg">Unified Security & Verification Platform</p>
            </div>
            <div className="hidden md:block text-right">
              <div className="text-sm text-slate-500">Powered by Advanced AI</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-20">
          {/* Introduction Section */}
          <section className="mb-20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6">
                  Enterprise-Grade{" "}
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    Security & Verification
                  </span>
                </h2>
                <p className="text-slate-300 text-lg leading-relaxed mb-4">
                  Our comprehensive suite of security solutions protects you from fraud, tampering, and misinformation. Built with enterprise-grade infrastructure and cutting-edge AI technology.
                </p>
                <p className="text-slate-400 text-lg">
                  Access all tools from one unified platform. Get started by selecting a module below.
                </p>
              </div>
              <div className="hidden md:block relative h-64">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl"></div>
                <div className="absolute inset-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/30"></div>
              </div>
            </div>
          </section>

          {/* Projects Grid */}
          <section className="mb-20">
            <h3 className="text-2xl font-bold mb-12 text-slate-100">Available Modules</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  onMouseEnter={() => setHoveredCard(project.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className="group relative"
                >
                  {/* Card Background Glow */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${project.color} rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl`}
                  ></div>

                  {/* Card */}
                  <a
                    href={project.link}
                    target={project.link.startsWith('http') ? "_blank" : undefined}
                    rel={project.link.startsWith('http') ? "noopener noreferrer" : undefined}
                    className="relative block h-full p-6 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-slate-700 transition-all duration-300 hover:bg-slate-900/80 cursor-pointer"
                  >
                    {/* Icon Container */}
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${project.color} mb-4 text-white group-hover:scale-110 transition-transform duration-300`}
                    >
                      {project.icon}
                    </div>

                    {/* Content */}
                    <h4 className="text-xl font-bold mb-2 text-slate-50 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-blue-400 group-hover:bg-clip-text transition-all duration-300">
                      {project.title}
                    </h4>
                    <p className="text-slate-400 text-sm mb-4 leading-relaxed h-12">
                      {project.description}
                    </p>

                    {/* Button */}
                    <div className="flex items-center text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300">
                      <span className="text-sm font-semibold">Access Module</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </section>

          {/* Features Section */}
          <section className="border-t border-slate-800/50 pt-20">
            <h3 className="text-2xl font-bold mb-12 text-slate-100">Why Choose TruthGuard?</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 bg-slate-900/30 border border-slate-800 rounded-xl hover:bg-slate-900/50 transition-colors">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg mb-4"></div>
                <h4 className="font-bold mb-2">Advanced AI</h4>
                <p className="text-slate-400 text-sm">Machine learning models trained on millions of samples for accurate detection</p>
              </div>
              <div className="p-6 bg-slate-900/30 border border-slate-800 rounded-xl hover:bg-slate-900/50 transition-colors">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg mb-4"></div>
                <h4 className="font-bold mb-2">Real-time Processing</h4>
                <p className="text-slate-400 text-sm">Instant analysis and threat detection across all modules and services</p>
              </div>
              <div className="p-6 bg-slate-900/30 border border-slate-800 rounded-xl hover:bg-slate-900/50 transition-colors">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg mb-4"></div>
                <h4 className="font-bold mb-2">Enterprise Security</h4>
                <p className="text-slate-400 text-sm">Bank-grade encryption and compliance with industry standards and regulations</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/50 backdrop-blur-xl bg-slate-950/50 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between text-slate-400 text-sm">
            <p>&copy; 2026 TruthGuard. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-slate-200 transition-colors">
                Documentation
              </a>
              <a href="#" className="hover:text-slate-200 transition-colors">
                Support
              </a>
              <a href="#" className="hover:text-slate-200 transition-colors">
                Terms
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Hub;
