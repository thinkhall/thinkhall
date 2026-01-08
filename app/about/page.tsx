"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Gamepad2,
  Brain,
  Waypoints,
  Monitor,
  TrendingUp,
  Building2,
  Users,
  Heart,
  Globe,
  CheckCircle2,
  Award,
  Zap,
  Activity,
  UserCheck,
  Star,
  ArrowRight,
} from "lucide-react";

// Trust & Proof Section (Adapted for Dark Theme)
function TrustProofSection() {
  const metrics = [
    {
      value: "47%",
      label: "Skill Uplift",
      description: "Average improvement in targeted skills",
      icon: TrendingUp,
      color: "from-green-400 to-emerald-500",
    },
    {
      value: "89%",
      label: "Engagement Rate",
      description: "Learners actively using the platform weekly",
      icon: Activity,
      color: "from-blue-400 to-cyan-500",
    },
    {
      value: "3.2x",
      label: "Productivity Gain",
      description: "Improvement in on-the-job performance",
      icon: Zap,
      color: "from-purple-400 to-violet-500",
    },
    {
      value: "94%",
      label: "Completion Rate",
      description: "Learners completing their programs",
      icon: UserCheck,
      color: "from-amber-400 to-orange-500",
    },
  ];

  const useCases = [
    {
      company: "Fortune 500 Retailer",
      result: "Trained 10,000+ store managers in 6 months",
      industry: "Retail",
    },
    {
      company: "Global Bank",
      result: "45% improvement in customer service scores",
      industry: "Banking",
    },
    {
      company: "Tech Unicorn",
      result: "Reduced onboarding time by 60%",
      industry: "Technology",
    },
  ];

  return (
    <section className="py-20 sm:py-24 bg-[#0a0a0f] relative overflow-hidden border-t border-white/5">
      {/* Background gradient for depth */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 text-sm font-semibold px-4 py-2 rounded-full mb-4">
            Trust & Proof
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-white mb-4">
            Results That{" "}
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Speak
            </span>
          </h2>
          <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto">
            Real outcomes from real organizations
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {metrics.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              // Dark mode styling for cards
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10 hover:bg-white/10 hover:border-yellow-400/30 transition-all group"
            >
              <div
                className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${metric.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}
              >
                <metric.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-4xl font-bold text-white mb-1">
                {metric.value}
              </div>
              <div className="text-sm font-semibold text-gray-300 mb-1">
                {metric.label}
              </div>
              <div className="text-xs text-gray-500">{metric.description}</div>
            </motion.div>
          ))}
        </div>

        {/* Use Cases - Dark Mode container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-3xl p-8 sm:p-12 border border-white/10"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-white">Success Stories</h3>
            <Link
              href="/case-studies"
              className="text-yellow-400 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {useCases.map((useCase, i) => (
              <motion.div
                key={useCase.company}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-yellow-400/30 transition-all"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-yellow-400/20 text-yellow-400 text-xs font-semibold px-2 py-1 rounded">
                    {useCase.industry}
                  </span>
                </div>
                <h4 className="text-white font-semibold mb-2">
                  {useCase.company}
                </h4>
                <p className="text-gray-400 text-sm">{useCase.result}</p>
                <div className="mt-4 flex items-center gap-1 text-yellow-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <main className="bg-[#0a0a0f] min-h-screen text-white">
      {/* Hero / About Intro Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-yellow-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-yellow-400/10 backdrop-blur-sm px-4 py-2 rounded-full border border-yellow-400/20 mb-8">
                <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                <span className="text-sm font-medium text-yellow-400">
                  About Thinkhall Academy
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6">
                Designed for the Skills of{" "}
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  Today—and Tomorrow
                </span>
              </h1>
              <p className="text-lg text-gray-400 leading-relaxed mb-10 max-w-lg">
                Whether you&apos;re stepping into your first role or leading
                large teams, Thinkhall meets you exactly where you are. We
                combine human expertise with Agentive AI to create learning
                experiences that stick.
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { icon: Gamepad2, text: "Gamified skill assessments" },
                  { icon: Brain, text: "AI-driven coaching" },
                  { icon: Waypoints, text: "Role-based learning paths" },
                  { icon: Monitor, text: "Industry-relevant simulations" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="group flex items-center gap-3 bg-white/[0.03] hover:bg-white/[0.06] rounded-xl p-4 border border-white/[0.06] hover:border-yellow-400/20 transition-all duration-300"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400/20 to-orange-500/10 flex items-center justify-center border border-yellow-400/10 group-hover:border-yellow-400/30 transition-all">
                      <item.icon className="w-5 h-5 text-yellow-400" />
                    </div>
                    <span className="text-white text-sm font-medium">
                      {item.text}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400/10 to-orange-500/10 rounded-3xl blur-2xl opacity-50" />
              <div className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-white">
                      Impact Metrics
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs text-gray-400">Live</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-6">
                    {[
                      {
                        value: "500+",
                        label: "Organizations",
                        icon: Building2,
                      },
                      { value: "2.4M", label: "Learners", icon: Users },
                      { value: "98%", label: "Satisfaction", icon: Heart },
                      { value: "50+", label: "Industries", icon: Globe },
                    ].map((stat, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                        viewport={{ once: true }}
                        className="text-center p-4 rounded-xl bg-white/[0.02] border border-white/5"
                      >
                        <stat.icon className="w-5 h-5 text-gray-500 mx-auto mb-3" />
                        <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent mb-1">
                          {stat.value}
                        </div>
                        <div className="text-sm text-gray-500">
                          {stat.label}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div className="px-6 py-4 bg-white/[0.02] border-t border-white/5">
                  <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                    {["ISO 27001", "SOC 2", "GDPR"].map((cert) => (
                      <div key={cert} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                        <span>{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="absolute -bottom-4 -left-4 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-xl px-4 py-3 shadow-xl shadow-yellow-500/20"
              >
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-gray-900" />
                  <div className="font-bold text-gray-900 text-sm">
                    #1 Platform
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust & Proof Section Added Here (Restyled for Dark Theme) */}
      <TrustProofSection />
    </main>
  );
}
