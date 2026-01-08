"use client";

import { motion } from "framer-motion";
import {
  Search,
  Wrench,
  LineChart,
  Compass,
  ChevronRight,
  Gamepad2,
  LayoutDashboard,
  Bot,
  Map,
} from "lucide-react";

import InteractiveDashboard from "@/components/InteractiveDashboard";
import {
  GamifiedAssessmentCard,
  MicroLearningCard,
} from "@/components/FeatureCards";

// --- Components ---

function WhatWeDoSection() {
  const steps = [
    {
      icon: Search,
      title: "Diagnose Skills",
      description: "AI-powered assessments to identify skill gaps",
      color: "from-blue-400 to-cyan-500",
    },
    {
      icon: Wrench,
      title: "Build Skills",
      description: "Personalized learning paths with real-world simulations",
      color: "from-purple-400 to-violet-500",
    },
    {
      icon: LineChart,
      title: "Track Impact",
      description: "Measurable outcomes with detailed analytics",
      color: "from-green-400 to-emerald-500",
    },
    {
      icon: Compass,
      title: "Enable Careers",
      description: "Career progression through continuous development",
      color: "from-yellow-400 to-orange-500",
    },
  ];

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {steps.map((step, i) => (
        <motion.div
          key={step.title}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          className="relative h-full"
        >
          {/* Connector Arrow (Desktop only) */}
          {i < steps.length - 1 && (
            <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 z-10 text-gray-300">
              <ChevronRight className="w-8 h-8" />
            </div>
          )}

          <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all group h-full flex flex-col items-center text-center relative overflow-hidden">
            {/* Number Badge */}
            <div className="absolute top-4 left-4 w-6 h-6 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs font-bold">
              {i + 1}
            </div>

            <div
              className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg`}
            >
              <step.icon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {step.title}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {step.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function HowThinkhallWorksRedesigned() {
  const steps = [
    {
      number: "01",
      icon: Gamepad2,
      title: "Gamified Skill Assessments",
      description:
        "Engage with interactive assessments that make skill evaluation fun, removing the anxiety of traditional testing.",
      color: "from-pink-500 to-rose-500",
      bgSoft: "bg-pink-50",
      border: "border-pink-200",
    },
    {
      number: "02",
      icon: LayoutDashboard,
      title: "Skill Gap Dashboards",
      description:
        "Instantly visualize strengths and weaknesses. Our dashboards provide a clear heatmap of where you stand.",
      color: "from-blue-500 to-cyan-500",
      bgSoft: "bg-blue-50",
      border: "border-blue-200",
    },
    {
      number: "03",
      icon: Bot,
      title: "THINKMATE AI Coaching",
      description:
        "Receive 24/7 personalized guidance. The AI adapts to your learning style, suggesting content that fits your pace.",
      color: "from-purple-500 to-violet-500",
      bgSoft: "bg-purple-50",
      border: "border-purple-200",
    },
    {
      number: "04",
      icon: Map,
      title: "Micro-Learning & Career Mapping",
      description:
        "Consume bite-sized lessons that fit into your workday and follow a clear path to your next promotion.",
      color: "from-amber-500 to-orange-500",
      bgSoft: "bg-amber-50",
      border: "border-amber-200",
    },
  ];

  return (
    <div className="relative mt-12">
      {/* Central Line */}
      <div className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gray-200 via-gray-300 to-gray-200 lg:-translate-x-1/2 rounded-full" />

      <div className="space-y-12 lg:space-y-0">
        {steps.map((step, i) => {
          const isEven = i % 2 === 0;
          return (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`relative flex flex-col lg:flex-row gap-8 lg:gap-0 items-center ${
                !isEven ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Content Side */}
              <div
                className={`w-full lg:w-1/2 pl-12 lg:pl-0 ${
                  isEven ? "lg:pr-16 lg:text-right" : "lg:pl-16 lg:text-left"
                }`}
              >
                <div
                  className={`p-6 bg-white rounded-2xl border ${step.border} shadow-sm hover:shadow-xl transition-all duration-300 group`}
                >
                  {/* Mobile Icon (hidden on desktop to avoid duplication) */}
                  <div
                    className={`lg:hidden w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4 shadow-md text-white`}
                  >
                    <step.icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>

                  <div
                    className={`mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${step.bgSoft} uppercase tracking-wider`}
                  >
                    Step {step.number}
                  </div>
                </div>
              </div>

              {/* Center Marker */}
              <div className="absolute left-4 lg:left-1/2 -translate-x-1/2 flex items-center justify-center">
                <div
                  className={`w-8 h-8 rounded-full bg-white border-4 border-gray-100 shadow-md flex items-center justify-center z-10`}
                >
                  <div
                    className={`w-3 h-3 rounded-full bg-gradient-to-br ${step.color}`}
                  />
                </div>
              </div>

              {/* Icon Side (Desktop Visual) */}
              <div
                className={`hidden lg:flex w-1/2 justify-center ${
                  isEven ? "pl-16" : "pr-16"
                }`}
              >
                <div
                  className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform duration-500`}
                >
                  <step.icon className="w-10 h-10 text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// --- Main Page Component ---

export default function PlatformPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* 1. Header & Full Width Dashboard */}
      {/* Reduced top padding from pt-32 to pt-24 */}
      <section className="pt-24 pb-12 relative overflow-hidden">
        {/* Background blobs for depth */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-yellow-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute top-40 left-0 w-[500px] h-[500px] bg-orange-100/30 rounded-full blur-3xl -translate-x-1/3" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Header */}
          {/* Reduced margin bottom from mb-16 to mb-8 */}
          <div className="text-center mb-8 max-w-4xl mx-auto">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 text-sm font-bold px-4 py-2 rounded-full mb-6 border border-yellow-200"
            >
              Platform Overview
            </motion.span>

            {/* Headline with Gradient */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-7xl font-bold font-display text-gray-900 mb-6 tracking-tight leading-tight"
            >
              A Complete{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500">
                Skill Ecosystem
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto"
            >
              See how all the pieces fit together to drive performance.
            </motion.p>
          </div>

          {/* Full Width Interactive Dashboard - No Frame/Border */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="w-full"
          >
            <InteractiveDashboard />
          </motion.div>
        </div>
      </section>

      {/* 2. What We Do (Grid) */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-display text-gray-900 mb-4">
              Core Capabilities
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to assess, build, and track workforce
              capability.
            </p>
          </div>
          <WhatWeDoSection />
        </div>
      </section>

      {/* 3. How It Works (Redesigned Timeline) */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="text-yellow-600 font-semibold tracking-wider text-sm uppercase">
              The Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-gray-900 mt-2">
              How the Platform <span className="gradient-text">Works</span>
            </h2>
          </div>

          <HowThinkhallWorksRedesigned />
        </div>
      </section>

      {/* 4. Feature Cards */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Feature Header */}
          <div className="text-center mb-16">
            <span className="text-yellow-600 font-semibold tracking-wider text-sm uppercase">
              Platform Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-gray-900 mt-2 mb-4">
              Experience the Future of Learning
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Interactive and engaging ways to build your skills
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <GamifiedAssessmentCard />
            <MicroLearningCard />
          </div>
        </div>
      </section>
    </main>
  );
}
