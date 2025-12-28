"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { TypeAnimation } from "react-type-animation";
import {
  Brain,
  Zap,
  Target,
  Users,
  BarChart3,
  Sparkles,
  ChevronRight,
  Play,
  CheckCircle2,
  ArrowRight,
  Rocket,
  Shield,
  Globe,
  Award,
  TrendingUp,
  Cpu,
  Hexagon,
  Triangle,
  Circle,
  Square,
  Activity,
  Layers,
  Database,
  Network,
  Atom,
} from "lucide-react";

// ============ FUTURISTIC STYLES ============
const globalStyles = `
  @keyframes scan-line {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  }
  
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 20px rgba(0, 0, 0, 0.1), inset 0 0 20px rgba(251, 191, 36, 0.05); }
    50% { box-shadow: 0 0 40px rgba(251, 191, 36, 0.3), inset 0 0 30px rgba(251, 191, 36, 0.1); }
  }
  
  @keyframes data-stream {
    0% { background-position: 0% 0%; }
    100% { background-position: 0% 100%; }
  }
  
  @keyframes rotate-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  @keyframes float-subtle {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    33% { transform: translateY(-10px) rotate(1deg); }
    66% { transform: translateY(5px) rotate(-1deg); }
  }
  
  @keyframes border-flow {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  
  @keyframes morph {
    0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
    50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
  }
  
  .scan-line {
    animation: scan-line 8s linear infinite;
  }
  
  .pulse-glow {
    animation: pulse-glow 3s ease-in-out infinite;
  }
  
  .rotate-slow {
    animation: rotate-slow 20s linear infinite;
  }
  
  .float-subtle {
    animation: float-subtle 8s ease-in-out infinite;
  }
  
  .border-flow {
    background: linear-gradient(90deg, transparent, #fbbf24, transparent);
    background-size: 200% 100%;
    animation: border-flow 3s linear infinite;
  }
  
  .shimmer {
    background: linear-gradient(90deg, transparent 0%, rgba(251, 191, 36, 0.1) 50%, transparent 100%);
    background-size: 200% 100%;
    animation: shimmer 2s infinite;
  }
  
  .morph {
    animation: morph 8s ease-in-out infinite;
  }
  
  .glass-light {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(0, 0, 0, 0.05);
  }
  
  .glass-dark {
    background: rgba(0, 0, 0, 0.03);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(0, 0, 0, 0.08);
  }
  
  .text-gradient-dark {
    background: linear-gradient(135deg, #000000 0%, #333333 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .text-gradient-yellow {
    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .hexagon-grid {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23fbbf24' fill-opacity='0.03'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.31h-.01L17 42.15V49h-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }
  
  .dot-grid {
    background-image: radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px);
    background-size: 24px 24px;
  }
  
  .line-grid {
    background-image: 
      linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px);
    background-size: 50px 50px;
  }

  /* Custom scrollbar for light theme */
  ::-webkit-scrollbar {
    width: 6px;
  }
  
  ::-webkit-scrollbar-track {
    background: #f3f4f6;
  }
  
  ::-webkit-scrollbar-thumb {
    background: #fbbf24;
    border-radius: 3px;
  }
  
  .perspective-1000 {
    perspective: 1000px;
  }
  
  .preserve-3d {
    transform-style: preserve-3d;
  }
`;

// ============ PARTICLES CONFIG (Light theme) ============
const particlesConfig = {
  particles: {
    number: { value: 30, density: { enable: true, area: 1000 } },
    color: { value: "#000000" },
    shape: { type: "circle" },
    opacity: { value: 0.1, random: true },
    size: { value: 2, random: true },
    move: {
      enable: true,
      speed: 0.5,
      direction: "none" as const,
      random: true,
      straight: false,
      outModes: { default: "out" as const },
    },
    links: {
      enable: true,
      distance: 200,
      color: "#fbbf24",
      opacity: 0.1,
      width: 1,
    },
  },
};

// ============ DATA ============
const FEATURES = [
  {
    icon: Brain,
    title: "Neural Learning Engine",
    description:
      "Self-evolving AI that maps cognitive patterns and creates synaptic learning pathways unique to each mind.",
    metric: "3.2x",
    metricLabel: "Faster Learning",
  },
  {
    icon: Network,
    title: "Quantum Skill Mapping",
    description:
      "Multi-dimensional skill visualization that predicts future competency trajectories with 97% accuracy.",
    metric: "97%",
    metricLabel: "Prediction Accuracy",
  },
  {
    icon: Atom,
    title: "Molecular Feedback",
    description:
      "Real-time performance atoms that combine to form complete competency molecules.",
    metric: "∞",
    metricLabel: "Data Points",
  },
  {
    icon: Layers,
    title: "Dimensional Analytics",
    description:
      "See beyond surface metrics. Analyze learning across temporal, spatial, and cognitive dimensions.",
    metric: "12D",
    metricLabel: "Analysis Depth",
  },
  {
    icon: Database,
    title: "Knowledge Synthesis",
    description:
      "Cross-pollinate skills across domains. AI finds unexpected connections that accelerate mastery.",
    metric: "847",
    metricLabel: "Skill Connections",
  },
  {
    icon: Shield,
    title: "Cognitive Firewall",
    description:
      "Enterprise-grade security with neural encryption. Your learning data stays quantum-secured.",
    metric: "256",
    metricLabel: "Bit Encryption",
  },
];

const STATS = [
  { value: 500, suffix: "+", label: "Neural Networks", icon: Network },
  { value: 2.4, suffix: "M", label: "Minds Connected", icon: Brain },
  { value: 99.7, suffix: "%", label: "Uptime Core", icon: Activity },
  { value: 847, suffix: "TB", label: "Knowledge Base", icon: Database },
];

const PRICING = [
  {
    name: "Core",
    price: 29,
    description: "Essential neural pathways",
    features: [
      "100 Learners",
      "Basic AI Coach",
      "5 Skill Dimensions",
      "Standard Analytics",
      "Email Support",
    ],
    icon: Circle,
  },
  {
    name: "Nexus",
    price: 79,
    description: "Full cognitive suite",
    features: [
      "1000 Learners",
      "Advanced Neural AI",
      "Unlimited Dimensions",
      "Quantum Analytics",
      "Priority Support",
      "Custom Branding",
      "API Access",
    ],
    icon: Hexagon,
    popular: true,
  },
  {
    name: "Infinite",
    price: null,
    description: "Boundless potential",
    features: [
      "Unlimited Learners",
      "Enterprise Neural AI",
      "Custom Development",
      "Dedicated Success Pod",
      "On-premise Deploy",
      "White-label Option",
      "SLA Guarantee",
    ],
    icon: Triangle,
  },
];

// ============ COMPONENTS ============

// Neural Core Visualization (replaces chat)
function NeuralCoreVisualization() {
  const [activeNode, setActiveNode] = useState(0);
  const nodes = [
    { label: "Learning", value: 94, color: "#fbbf24" },
    { label: "Skills", value: 87, color: "#000000" },
    { label: "Progress", value: 76, color: "#fbbf24" },
    { label: "Goals", value: 92, color: "#000000" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveNode((prev) => (prev + 1) % nodes.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Main Core Container */}
      <div className="relative aspect-square">
        {/* Outer Ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-dashed border-black/10"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />

        {/* Middle Ring */}
        <motion.div
          className="absolute inset-8 rounded-full border border-yellow-400/50"
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        />

        {/* Inner Ring */}
        <div className="absolute inset-16 rounded-full bg-gradient-to-br from-yellow-400/10 to-transparent" />

        {/* Core Center */}
        <div className="absolute inset-24 rounded-full glass-light pulse-glow flex items-center justify-center">
          <motion.div
            className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center shadow-2xl shadow-yellow-400/30"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Brain className="w-10 h-10 text-black" />
          </motion.div>
        </div>

        {/* Orbiting Nodes */}
        {nodes.map((node, index) => {
          const angle = (index * 90 - 45) * (Math.PI / 180);
          const radius = 42;
          const x = 50 + radius * Math.cos(angle);
          const y = 50 + radius * Math.sin(angle);

          return (
            <motion.div
              key={index}
              className="absolute"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: "translate(-50%, -50%)",
              }}
              animate={{
                scale: activeNode === index ? 1.2 : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              <div
                className={`relative ${activeNode === index ? "z-10" : "z-0"}`}
              >
                {/* Connection Line */}
                <svg
                  className="absolute top-1/2 left-1/2 w-32 h-32 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  style={{
                    transform: `translate(-50%, -50%) rotate(${
                      index * 90 + 45
                    }deg)`,
                  }}
                >
                  <motion.line
                    x1="64"
                    y1="64"
                    x2="64"
                    y2="20"
                    stroke={activeNode === index ? "#fbbf24" : "#00000020"}
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1 }}
                  />
                </svg>

                {/* Node Card */}
                <motion.div
                  className={`glass-light rounded-xl p-3 min-w-[100px] shadow-lg ${
                    activeNode === index ? "shadow-yellow-400/20" : ""
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-xs text-gray-500 mb-1">{node.label}</div>
                  <div className="flex items-end gap-1">
                    <span
                      className="text-2xl font-bold"
                      style={{ color: node.color }}
                    >
                      {node.value}
                    </span>
                    <span className="text-xs text-gray-400 mb-1">%</span>
                  </div>
                  {/* Mini Progress Bar */}
                  <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: node.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${node.value}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          );
        })}

        {/* Floating Data Points */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-yellow-400"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 1, 0.3],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      {/* Bottom Metrics Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 glass-light rounded-2xl p-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm font-medium text-gray-700">
            Neural Core Active
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs text-gray-500">Processing</div>
            <div className="text-sm font-bold text-black">2.4M ops/s</div>
          </div>
          <div className="h-8 w-px bg-gray-200" />
          <div className="text-right">
            <div className="text-xs text-gray-500">Latency</div>
            <div className="text-sm font-bold text-yellow-500">12ms</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Animated Counter with Futuristic Style
function FuturisticCounter({
  value,
  suffix = "",
  label,
  icon: Icon,
}: {
  value: number;
  suffix?: string;
  label: string;
  icon: any;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current * 10) / 10);
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isVisible, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative group"
    >
      <div className="glass-light rounded-2xl p-6 hover:shadow-xl hover:shadow-yellow-400/10 transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <Icon className="w-6 h-6 text-yellow-500" />
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        </div>
        <div className="text-4xl font-bold text-black mb-1">
          {count}
          {suffix}
        </div>
        <div className="text-sm text-gray-500">{label}</div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-b-2xl" />
      </div>
    </motion.div>
  );
}

// Feature Card with Futuristic Design
function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof FEATURES)[0];
  index: number;
}) {
  const Icon = feature.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group relative"
    >
      <div className="glass-light rounded-3xl p-8 h-full hover:shadow-2xl hover:shadow-yellow-400/10 transition-all duration-500 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 hexagon-grid opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Icon Container */}
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center shadow-lg shadow-yellow-400/25 group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-8 h-8 text-black" />
          </div>
          {/* Decorative ring */}
          <motion.div
            className="absolute -inset-2 rounded-3xl border border-yellow-400/30"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 + 0.2 }}
          />
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold text-black mb-3 group-hover:text-yellow-600 transition-colors">
          {feature.title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-6">
          {feature.description}
        </p>

        {/* Metric */}
        <div className="flex items-end justify-between pt-4 border-t border-gray-100">
          <div>
            <div className="text-3xl font-bold text-gradient-yellow">
              {feature.metric}
            </div>
            <div className="text-xs text-gray-500">{feature.metricLabel}</div>
          </div>
          <ArrowRight className="w-5 h-5 text-yellow-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </motion.div>
  );
}

// Pricing Card
function PricingCard({
  plan,
  index,
}: {
  plan: (typeof PRICING)[0];
  index: number;
}) {
  const Icon = plan.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className={`relative ${plan.popular ? "z-10 scale-105" : ""}`}
    >
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-yellow-400 text-xs font-bold px-4 py-2 rounded-full shadow-lg">
          MOST POPULAR
        </div>
      )}

      <div
        className={`h-full rounded-3xl p-8 ${
          plan.popular
            ? "bg-black text-white shadow-2xl shadow-yellow-400/20"
            : "glass-light"
        }`}
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              plan.popular
                ? "bg-yellow-400"
                : "bg-gradient-to-br from-yellow-400 to-yellow-500"
            }`}
          >
            <Icon className="w-6 h-6 text-black" />
          </div>
          <div>
            <h3
              className={`text-xl font-bold ${
                plan.popular ? "text-white" : "text-black"
              }`}
            >
              {plan.name}
            </h3>
            <p
              className={`text-sm ${
                plan.popular ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {plan.description}
            </p>
          </div>
        </div>

        {/* Price */}
        <div className="mb-8">
          {plan.price ? (
            <div className="flex items-baseline gap-1">
              <span
                className={`text-5xl font-bold ${
                  plan.popular ? "text-yellow-400" : "text-black"
                }`}
              >
                ${plan.price}
              </span>
              <span
                className={plan.popular ? "text-gray-400" : "text-gray-500"}
              >
                /mo
              </span>
            </div>
          ) : (
            <span
              className={`text-4xl font-bold ${
                plan.popular ? "text-yellow-400" : "text-black"
              }`}
            >
              Custom
            </span>
          )}
        </div>

        {/* Features */}
        <ul className="space-y-4 mb-8">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-center gap-3">
              <CheckCircle2
                className={`w-5 h-5 shrink-0 ${
                  plan.popular ? "text-yellow-400" : "text-yellow-500"
                }`}
              />
              <span
                className={`text-sm ${
                  plan.popular ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {feature}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <button
          className={`w-full py-4 rounded-xl font-semibold transition-all ${
            plan.popular
              ? "bg-yellow-400 text-black hover:bg-yellow-300 hover:shadow-lg hover:shadow-yellow-400/25"
              : "bg-black text-white hover:bg-gray-900"
          }`}
        >
          {plan.price ? "Start Free Trial" : "Contact Sales"}
        </button>
      </div>
    </motion.div>
  );
}

// Geometric Background
function GeometricBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient Orbs */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(251, 191, 36, 0.1) 0%, transparent 70%)",
          top: "-20%",
          right: "-10%",
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(0, 0, 0, 0.05) 0%, transparent 70%)",
          bottom: "-10%",
          left: "-5%",
        }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      {/* Floating Shapes */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-4 h-4 border-2 border-yellow-400/20"
          style={{
            left: `${10 + i * 20}%`,
            top: `${20 + (i % 3) * 30}%`,
            borderRadius: i % 2 === 0 ? "4px" : "50%",
            transform: `rotate(${i * 15}deg)`,
          }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 180, 360],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 5 + i,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        />
      ))}

      {/* Grid */}
      <div className="absolute inset-0 line-grid" />
    </div>
  );
}

// Navigation
function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-light shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="absolute -inset-1 rounded-xl border border-yellow-400/30 animate-pulse" />
          </div>
          <span className="text-xl font-bold text-black">Thinkhall</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {["Platform", "Solutions", "Pricing", "Resources"].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase()}`}
              className="text-gray-600 hover:text-black transition-colors text-sm font-medium relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-gray-600 hover:text-black transition-colors text-sm font-medium hidden sm:block"
          >
            Sign In
          </Link>
          <Link
            href="/demo"
            className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-900 transition-all flex items-center gap-2 group"
          >
            Get Started
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}

// ============ MAIN COMPONENT ============
export default function HomePage() {
  const [particlesInit, setParticlesInit] = useState(false);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setParticlesInit(true));
  }, []);

  return (
    <main className="bg-gradient-to-b from-white via-gray-50 to-white text-black overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />

      <Navigation />

      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        <GeometricBackground />

        {/* Particles */}
        {particlesInit && (
          <Particles className="absolute inset-0" options={particlesConfig} />
        )}

        <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-20 items-center relative z-10">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-black text-white rounded-full px-4 py-2 mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              <span className="text-sm font-medium">
                Next-Gen Learning Platform
              </span>
              <ChevronRight className="w-4 h-4" />
            </motion.div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] mb-8">
              <span className="text-black">The Future of</span>
              <br />
              <span className="text-gradient-yellow">Workforce</span>
              <br />
              <TypeAnimation
                sequence={[
                  "Intelligence",
                  2500,
                  "Evolution",
                  2500,
                  "Potential",
                  2500,
                ]}
                wrapper="span"
                speed={50}
                className="text-black"
                repeat={Infinity}
              />
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-600 max-w-lg mb-10 leading-relaxed">
              Harness neural AI to unlock unprecedented learning velocity.
              Transform your organization with cognitive technology trusted by
              500+ enterprises.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mb-12">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="bg-black text-white px-8 py-4 rounded-full font-semibold text-lg flex items-center gap-3 shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-black/30 transition-all"
              >
                Launch Demo
                <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 text-black" />
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="glass-light px-8 py-4 rounded-full font-semibold text-lg flex items-center gap-2 hover:bg-white transition-colors"
              >
                <Play className="w-5 h-5 text-yellow-500" />
                Watch Video
              </motion.button>
            </div>

            {/* Metrics Row */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 border-2 border-white flex items-center justify-center text-xs font-bold text-black"
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <div className="font-semibold text-black">2.4M+</div>
                  <div className="text-gray-500">Active Learners</div>
                </div>
              </div>
              <div className="h-10 w-px bg-gray-200" />
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm font-semibold text-black">4.9/5</span>
              </div>
            </div>
          </motion.div>

          {/* Right - Neural Core Visualization */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="float-subtle"
          >
            <NeuralCoreVisualization />
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-xs text-gray-400 uppercase tracking-widest">
              Scroll
            </span>
            <div className="w-5 h-8 rounded-full border-2 border-gray-300 flex justify-center pt-2">
              <motion.div
                animate={{ y: [0, 8, 0], opacity: [1, 0, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1 h-2 bg-yellow-400 rounded-full"
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ================= STATS SECTION ================= */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat, index) => (
              <FuturisticCounter
                key={index}
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
                icon={stat.icon}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEATURES SECTION ================= */}
      <section className="py-24 relative">
        <GeometricBackground />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="inline-block bg-yellow-400/10 text-yellow-600 text-sm font-semibold tracking-wider uppercase px-4 py-2 rounded-full mb-6">
              Capabilities
            </span>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Beyond Traditional{" "}
              <span className="text-gradient-yellow">Learning</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Our neural architecture processes billions of learning signals to
              deliver unprecedented personalization at enterprise scale.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ================= VISUAL BREAK SECTION ================= */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0 hexagon-grid opacity-20" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block bg-yellow-400/20 text-yellow-400 text-sm font-semibold tracking-wider uppercase px-4 py-2 rounded-full mb-6">
                Neural Engine
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Powered by <span className="text-yellow-400">Cognitive AI</span>
              </h2>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Our proprietary neural engine processes 2.4 million learning
                signals per second, creating truly personalized pathways that
                adapt in real-time to each learner's cognitive patterns.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "2.4M", label: "Signals/sec" },
                  { value: "12ms", label: "Response Time" },
                  { value: "99.9%", label: "Accuracy" },
                  { value: "∞", label: "Scalability" },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white/5 rounded-xl p-4 border border-white/10"
                  >
                    <div className="text-2xl font-bold text-yellow-400">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right - Visual */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative aspect-square">
                {/* Central Core */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 60,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <div className="w-64 h-64 rounded-full border border-yellow-400/20" />
                </motion.div>
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{ rotate: -360 }}
                  transition={{
                    duration: 40,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <div className="w-48 h-48 rounded-full border border-yellow-400/30" />
                </motion.div>
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <div className="w-32 h-32 rounded-full border-2 border-yellow-400/50" />
                </motion.div>

                {/* Core */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-20 h-20 rounded-full bg-yellow-400 flex items-center justify-center shadow-2xl shadow-yellow-400/50"
                  >
                    <Cpu className="w-10 h-10 text-black" />
                  </motion.div>
                </div>

                {/* Orbiting Elements */}
                {[Brain, Target, Zap, Award].map((Icon, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
                    style={{
                      top: "50%",
                      left: "50%",
                    }}
                    animate={{
                      x: [0, Math.cos((i * Math.PI) / 2) * 120],
                      y: [0, Math.sin((i * Math.PI) / 2) * 120],
                    }}
                    transition={{
                      duration: 0,
                    }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 10 + i * 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      style={{
                        position: "absolute",
                        transform: `translate(${
                          Math.cos((i * Math.PI) / 2 + Math.PI / 4) * 100
                        }px, ${
                          Math.sin((i * Math.PI) / 2 + Math.PI / 4) * 100
                        }px)`,
                      }}
                    >
                      <div className="w-10 h-10 rounded-xl bg-yellow-400/20 flex items-center justify-center border border-yellow-400/30">
                        <Icon className="w-5 h-5 text-yellow-400" />
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= PRICING SECTION ================= */}
      <section className="py-24 relative">
        <GeometricBackground />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="inline-block bg-yellow-400/10 text-yellow-600 text-sm font-semibold tracking-wider uppercase px-4 py-2 rounded-full mb-6">
              Investment
            </span>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Scale Without <span className="text-gradient-yellow">Limits</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Flexible plans designed to grow with your organization. Start
              free, scale infinitely.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 items-start">
            {PRICING.map((plan, index) => (
              <PricingCard key={index} plan={plan} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA SECTION ================= */}
      <section className="py-24 relative">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-[3rem] bg-black p-16 text-center"
          >
            {/* Background Elements */}
            <div className="absolute inset-0 hexagon-grid opacity-10" />
            <motion.div
              className="absolute top-0 right-0 w-96 h-96 rounded-full bg-yellow-400/10 blur-3xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 5, repeat: Infinity }}
            />

            <div className="relative z-10">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 bg-yellow-400/20 text-yellow-400 rounded-full px-4 py-2 mb-8"
              >
                <Rocket className="w-4 h-4" />
                <span className="text-sm font-medium">Ready to Launch?</span>
              </motion.div>

              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Transform Your{" "}
                <span className="text-yellow-400">Organization</span>
              </h2>
              <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
                Join 500+ enterprises already leveraging neural AI to build the
                workforce of tomorrow. Start your journey today.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-yellow-400 text-black px-10 py-5 rounded-full font-bold text-lg flex items-center gap-3 shadow-xl shadow-yellow-400/25 hover:shadow-2xl hover:shadow-yellow-400/40 transition-all"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="border border-white/20 text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-white/10 transition-colors"
                >
                  Schedule Demo
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-gray-200 py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-6 gap-12 mb-16">
            {/* Logo & Description */}
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                </div>
                <span className="text-xl font-bold text-black">Thinkhall</span>
              </Link>
              <p className="text-gray-600 mb-6 max-w-sm">
                The neural learning platform that transforms how organizations
                develop their most valuable asset—their people.
              </p>
              <div className="flex gap-3">
                {["X", "Li", "YT", "GH"].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-all text-gray-600 text-sm font-bold"
                  >
                    {social}
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            {[
              {
                title: "Product",
                links: ["Features", "Integrations", "Pricing", "Changelog"],
              },
              {
                title: "Company",
                links: ["About", "Careers", "Press", "Partners"],
              },
              {
                title: "Resources",
                links: ["Blog", "Documentation", "Community", "Events"],
              },
              {
                title: "Legal",
                links: ["Privacy", "Terms", "Security", "Cookies"],
              },
            ].map((column) => (
              <div key={column.title}>
                <h4 className="font-semibold text-black mb-4">
                  {column.title}
                </h4>
                <ul className="space-y-3">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-gray-600 hover:text-black transition-colors text-sm"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © 2024 Thinkhall. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              All systems operational
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
