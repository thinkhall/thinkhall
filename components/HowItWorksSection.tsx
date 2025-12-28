"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Gamepad2,
  BarChart3,
  Compass,
  Rocket,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Assess",
    desc: "Play gamified assessments designed around real workplace challenges.",
    icon: Gamepad2,
  },
  {
    step: "02",
    title: "Analyze",
    desc: "AI Coach evaluates your technical, behavioral, and leadership skills.",
    icon: BarChart3,
  },
  {
    step: "03",
    title: "Personalize",
    desc: "Get a tailored learning journey based on your role and goals.",
    icon: Compass,
  },
  {
    step: "04",
    title: "Advance",
    desc: "Practice and grow while AI continuously refines your path.",
    icon: Rocket,
  },
];

function StepCard({
  item,
  index,
  isActive,
  onHover,
}: {
  item: (typeof steps)[0];
  index: number;
  isActive: boolean;
  onHover: (index: number | null) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
      className="relative group"
    >
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className={`relative bg-white rounded-2xl p-5 border-2 transition-all duration-300 shadow-sm hover:shadow-lg ${
          isActive ? "border-orange-300 shadow-lg" : "border-gray-100"
        }`}
      >
        {/* Header row */}
        <div className="flex items-center gap-4 mb-3">
          {/* Icon */}
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center flex-shrink-0">
            <item.icon className="w-5 h-5 text-white" />
          </div>

          {/* Title and step */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-gray-900 font-display">
                {item.title}
              </h3>
              <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full font-body">
                {item.step}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed font-body">
          {item.desc}
        </p>

        {/* Bottom accent line */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-b-2xl"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isActive ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </motion.div>
  );
}

function CurvedRoadmap() {
  return (
    <svg
      className="absolute top-1/2 left-0 w-full -translate-y-1/2 hidden lg:block pointer-events-none"
      viewBox="0 0 1200 120"
      fill="none"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="roadGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#facc15" />
          <stop offset="50%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
      </defs>

      {/* Road shadow */}
      <motion.path
        d="M 0 60 Q 150 20, 300 60 Q 450 100, 600 60 Q 750 20, 900 60 Q 1050 100, 1200 60"
        stroke="#fef3c7"
        strokeWidth="30"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />

      {/* Main road */}
      <motion.path
        d="M 0 60 Q 150 20, 300 60 Q 450 100, 600 60 Q 750 20, 900 60 Q 1050 100, 1200 60"
        stroke="url(#roadGradient)"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
      />

      {/* Dashed line */}
      <motion.path
        d="M 0 60 Q 150 20, 300 60 Q 450 100, 600 60 Q 750 20, 900 60 Q 1050 100, 1200 60"
        stroke="white"
        strokeWidth="2"
        strokeDasharray="8 6"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
      />

      {/* Node points */}
      {[150, 450, 750, 1050].map((x, i) => (
        <motion.g key={i}>
          <motion.circle
            cx={x}
            cy={i % 2 === 0 ? 40 : 80}
            r="12"
            fill="white"
            stroke="url(#roadGradient)"
            strokeWidth="3"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 + i * 0.1, type: "spring" }}
          />
          <motion.circle
            cx={x}
            cy={i % 2 === 0 ? 40 : 80}
            r="5"
            fill="url(#roadGradient)"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 + i * 0.1, type: "spring" }}
          />
        </motion.g>
      ))}
    </svg>
  );
}

export default function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  return (
    <section className="relative py-20 sm:py-24 overflow-hidden bg-gradient-to-b from-orange-50/30 via-white to-white">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-yellow-100/40 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-orange-100/40 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 text-sm font-semibold px-4 py-2 rounded-full mb-5 border border-orange-200/50 font-body"
          >
            <Sparkles className="w-4 h-4" />
            How It Works
          </motion.div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display mb-4 tracking-tight text-gray-900">
            A Smarter Way to{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-yellow-500 via-orange-500 to-orange-600 bg-clip-text text-transparent">
                Build Skills
              </span>
              <motion.svg
                className="absolute -bottom-1 left-0 w-full h-2"
                viewBox="0 0 200 8"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                <motion.path
                  d="M 0 5 Q 50 1, 100 5 Q 150 9, 200 5"
                  stroke="url(#underlineGrad)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                />
                <defs>
                  <linearGradient
                    id="underlineGrad"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#facc15" />
                    <stop offset="100%" stopColor="#f97316" />
                  </linearGradient>
                </defs>
              </motion.svg>
            </span>
          </h2>

          <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto font-body">
            Four simple steps to transform your career
          </p>
        </motion.div>

        {/* Steps container */}
        <div className="relative">
          {/* Curved roadmap - Desktop */}
          <CurvedRoadmap />

          {/* Vertical line - Mobile */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-full lg:hidden" />

          {/* Cards grid */}
          <div className="grid lg:grid-cols-4 gap-4 lg:gap-6 relative z-10 pl-12 lg:pl-0">
            {steps.map((item, i) => (
              <div
                key={item.step}
                className={`relative ${
                  i % 2 === 0 ? "lg:pt-0 lg:pb-20" : "lg:pt-20 lg:pb-0"
                }`}
              >
                {/* Mobile dot */}
                <div className="absolute left-[-30px] top-6 w-3 h-3 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 border-2 border-white shadow lg:hidden" />

                <StepCard
                  item={item}
                  index={i}
                  isActive={activeStep === i}
                  onHover={setActiveStep}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 p-2 bg-white rounded-full shadow-lg border border-gray-100">
            <div className="flex -space-x-2 px-3">
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + i * 0.05 }}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-100 to-orange-100 border-2 border-white flex items-center justify-center text-xs"
                >
                  {["👩‍💻", "👨‍🎓", "👩‍🔬", "👨‍💼"][i]}
                </motion.div>
              ))}
            </div>
            <div className="text-left px-2">
              <p className="text-sm font-semibold text-gray-900 font-display">
                Join 10,000+ learners
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="px-5 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm font-semibold rounded-full shadow hover:shadow-md transition-all font-display group flex items-center gap-2"
            >
              Start Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
