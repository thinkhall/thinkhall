"use client";

import { motion } from "framer-motion";
import { Brain, Target, TrendingUp, Zap } from "lucide-react";

import AICoachSection from "@/components/AICoachSection";

export default function AICoachPage() {
  const features = [
    {
      title: "Assess Skills",
      icon: Target,
      color: "text-blue-500",
      bg: "bg-blue-50",
      desc: "Identify gaps with precision.",
    },
    {
      title: "Coach Decisions",
      icon: Brain,
      color: "text-purple-500",
      bg: "bg-purple-50",
      desc: "Real-time AI guidance.",
    },
    {
      title: "Track Progress",
      icon: TrendingUp,
      color: "text-green-500",
      bg: "bg-green-50",
      desc: "Measurable growth metrics.",
    },
    {
      title: "Adapt Learning",
      icon: Zap,
      color: "text-yellow-500",
      bg: "bg-yellow-50",
      desc: "Dynamic content adjustment.",
    },
  ];

  return (
    <main className="bg-white min-h-screen">
      <section className="pt-32 pb-20 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-yellow-100/40 to-orange-100/40 rounded-full blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block bg-yellow-100 text-yellow-800 text-sm font-semibold px-4 py-2 rounded-full mb-6">
              Powered by THINKMATE
            </span>

            {/* Updated Headline: All in one line, Grow Faster highlighted */}
            <h1 className="text-3xl sm:text-3xl lg:text-6xl font-bold font-display mb-6 text-gray-900 tracking-tight">
              Learn Smarter.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-600">
                Grow Faster.
              </span>{" "}
              Lead Better.
            </h1>

            {/* Updated Description: THINKMATE highlighted with yellow gradient */}
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
              Thinkhall Academy is a SkillTech platform designed to assess,
              coach, and elevate professionals at every stage—entry-level,
              managers, senior leaders, and future executives. Powered by our
              Agentive AI Coach{" "}
              <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                THINKMATE
              </span>
              , we don&apos;t just teach skills—we guide decisions, track
              progress, and adapt learning in real time.
            </p>

            {/* 4 Pillars Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {features.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-xl hover:scale-105 transition-all cursor-default"
                >
                  <div
                    className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center mx-auto mb-4`}
                  >
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Existing Component */}
      <AICoachSection />
    </main>
  );
}
