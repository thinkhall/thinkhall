"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Phone,
  Mail,
  Gamepad2,
  Brain,
  Waypoints,
  Monitor,
  GraduationCap,
  Briefcase,
  Target,
  Crown,
  Building2,
  Rocket,
  Users,
  MessageSquare,
  BarChart2,
  Puzzle,
  Boxes,
  Timer,
  Users2,
  Cpu,
  Zap,
  Globe,
  Award,
  TrendingUp,
  Heart,
} from "lucide-react";

import { globalStyles } from "@/lib/constants";
import Navigation from "@/components/Navigation";
import InteractiveDashboard from "@/components/InteractiveDashboard";
import {
  GamifiedAssessmentCard,
  RewardsRedemptionCard,
  MicroLearningCard,
} from "@/components/FeatureCards";
import AICoachSection from "@/components/AICoachSection";
import CareerPathSection from "@/components/CareerPathSection";
import HowItWorksSection from "@/components/HowItWorksSection";

function SectionHeader({
  badge,
  title,
  subtitle,
  center = true,
}: {
  badge: string;
  title: React.ReactNode;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={center ? "text-center" : ""}
    >
      <span className="inline-block bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 text-sm font-semibold px-4 py-2 rounded-full mb-4">
        {badge}
      </span>
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">{subtitle}</p>
      )}
    </motion.div>
  );
}

export default function HomePage() {
  // Inject global styles once on mount (fixes the blink issue)
  useEffect(() => {
    const styleId = "global-custom-styles";

    // Check if style already exists
    if (document.getElementById(styleId)) return;

    const style = document.createElement("style");
    style.id = styleId;
    style.innerHTML = globalStyles;
    document.head.appendChild(style);

    return () => {
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
    };
  }, []);

  return (
    <main className="bg-white text-gray-900 overflow-x-hidden font-body">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-24 sm:pt-28 pb-8 sm:pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/50 via-white to-orange-50/30" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-radial from-yellow-100/40 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-8 sm:mb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-black text-white rounded-full px-4 py-2 mb-4 sm:mb-6"
            >
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium">
                AI-Powered SkillTech Platform
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-[1.1] mb-2 sm:mb-1 font-display"
            >
              <span className="gradient-text">Where Skills Meet </span>
              <span className="relative inline-block">
                {/* Top half */}
                <span
                  className="gradient-text block overflow-hidden h-[0.55em]"
                  aria-hidden="true"
                >
                  <motion.span
                    initial={{ x: -20 }}
                    animate={{ x: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="block"
                  >
                    Intelligence
                  </motion.span>
                </span>
                {/* Bottom half */}
                <span
                  className="gradient-text block overflow-hidden h-[0.55em]"
                  aria-hidden="true"
                >
                  <motion.span
                    initial={{ x: 20 }}
                    animate={{ x: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="block -mt-[0.55em]"
                  >
                    Intelligence
                  </motion.span>
                </span>
                {/* Screen reader text */}
                <span className="sr-only">Intelligence</span>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto mb-4"
            >
              Build future-ready skills through AI-powered coaching, real-world
              simulations, and personalized learning journeys.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="flex flex-wrap justify-center gap-3 text-xs sm:text-sm text-gray-500 mb-6"
            >
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-green-500" /> Hire
                Trainers for Classroom Sessions
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-green-500" /> Get
                Customised Online Content
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-3 justify-center"
            >
              <button className="bg-black text-white px-5 sm:px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-xl shadow-black/20 hover:shadow-2xl transition-all text-sm sm:text-base">
                Start Skill Assessment
                <ArrowRight className="w-4 h-4" />
              </button>
              <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-5 sm:px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-yellow-400/30 transition-all text-sm sm:text-base">
                Explore Programs
              </button>
            </motion.div>
          </div>

          <InteractiveDashboard />
        </div>
      </section>

      {/* Tagline Section */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-gray-900 mb-6"
          >
            Learn Smarter. <span className="text-yellow-500">Grow Faster.</span>{" "}
            Lead Better.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-base sm:text-lg text-gray-600 leading-relaxed mb-8"
          >
            Thinkhall Academy is a SkillTech platform designed to assess, coach,
            and elevate professionals at every stage—entry-level, managers,
            senior leaders, and future executives. Powered by our Agentive AI
            Coach{" "}
            <span className="font-semibold text-yellow-600">THINKMATE</span>, we
            don&apos;t just teach skills—we guide decisions, track progress, and
            adapt learning in real time.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {[
              "Assess Skills",
              "Coach Decisions",
              "Track Progress",
              "Adapt Learning",
            ].map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full text-sm text-gray-700 border border-gray-200"
              >
                <CheckCircle2 className="w-4 h-4 text-yellow-500" />
                {item}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader
            badge="Platform Features"
            title={
              <>
                Experience the{" "}
                <span className="gradient-text">Future of Learning</span>
              </>
            }
            subtitle="Interactive and engaging ways to build your skills"
          />

          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 mt-12">
            <GamifiedAssessmentCard />
            <RewardsRedemptionCard />
            <MicroLearningCard />
          </div>
        </div>
      </section>

      <HowItWorksSection />

      <AICoachSection />

      <CareerPathSection />

      {/* About Section */}
      <section className="relative py-24 sm:py-32 bg-[#0a0a0f] text-white overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-yellow-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            {/* Left Column */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-yellow-400/10 backdrop-blur-sm px-4 py-2 rounded-full border border-yellow-400/20 mb-8">
                <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                <span className="text-sm font-medium text-yellow-400">
                  About Thinkhall Academy
                </span>
              </div>

              {/* Heading */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight mb-6">
                Designed for the Skills of{" "}
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  Today—and Tomorrow
                </span>
              </h2>

              {/* Description */}
              <p className="text-lg text-gray-400 leading-relaxed mb-10 max-w-lg">
                Whether you&apos;re stepping into your first role or leading
                large teams, Thinkhall meets you exactly where you are.
              </p>

              {/* Features Grid */}
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
                    transition={{ delay: i * 0.1 }}
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

            {/* Right Column - Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              {/* Glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400/10 to-orange-500/10 rounded-3xl blur-2xl opacity-50" />

              {/* Card */}
              <div className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
                {/* Header */}
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

                {/* Stats Grid */}
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
                        transition={{ delay: 0.3 + i * 0.1 }}
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

                {/* Footer */}
                <div className="px-6 py-4 bg-white/[0.02] border-t border-white/5">
                  <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                      <span>ISO 27001</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                      <span>SOC 2</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                      <span>GDPR</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, type: "spring" }}
                className="absolute -bottom-4 -left-4 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-xl px-4 py-3 shadow-xl shadow-yellow-500/20"
              >
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-gray-900" />
                  <div>
                    <div className="font-bold text-gray-900 text-sm">
                      #1 Platform
                    </div>
                   
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Learning Paths Section */}
      <section className="py-20 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader
            badge="Learning Paths"
            title={
              <>
                For Every <span className="gradient-text">Career Stage</span>
              </>
            }
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-12">
            {[
              {
                level: "Entry-Level",
                icon: GraduationCap,
                color: "#10b981",
                skills: [
                  "Workplace fundamentals",
                  "Communication basics",
                  "Problem-solving",
                  "Digital readiness",
                ],
              },
              {
                level: "Managers",
                icon: Briefcase,
                color: "#3b82f6",
                skills: [
                  "Team leadership",
                  "Performance management",
                  "Data-driven decisions",
                  "Stakeholder communication",
                ],
              },
              {
                level: "Senior Managers",
                icon: Target,
                color: "#8b5cf6",
                skills: [
                  "Strategic thinking",
                  "Cross-functional leadership",
                  "Financial acumen",
                  "Change management",
                ],
              },
              {
                level: "Leadership & CXOs",
                icon: Crown,
                color: "#f59e0b",
                skills: [
                  "Vision & strategy",
                  "Business agility",
                  "People leadership at scale",
                  "Complex decision-making",
                ],
              },
            ].map((path, i) => (
              <motion.div
                key={path.level}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 hover:shadow-xl transition-all group"
              >
                <div
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: `${path.color}20` }}
                >
                  <path.icon
                    className="w-6 h-6 sm:w-7 sm:h-7"
                    style={{ color: path.color }}
                  />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">
                  {path.level}
                </h3>
                <ul className="space-y-2">
                  {path.skills.map((skill) => (
                    <li
                      key={skill}
                      className="flex items-start gap-2 text-xs sm:text-sm text-gray-600"
                    >
                      <CheckCircle2
                        className="w-4 h-4 shrink-0 mt-0.5"
                        style={{ color: path.color }}
                      />
                      {skill}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader
            badge="Core Skills"
            title={
              <>
                Skills That{" "}
                <span className="gradient-text">Actually Matter</span>
              </>
            }
            subtitle="Each skill is assessed, trained, and reinforced through real-world scenarios"
          />

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-12">
            {[
              { name: "Leadership & People Management", icon: Users },
              { name: "Communication & Influence", icon: MessageSquare },
              { name: "Retail & Business Analytics", icon: BarChart2 },
              { name: "Problem Solving & Decision Making", icon: Puzzle },
              { name: "Supply Chain & Operations", icon: Boxes },
              { name: "Digital, AI & Tech Fluency", icon: Cpu },
              { name: "Time & Priority Management", icon: Timer },
              { name: "Collaboration & Stakeholder Handling", icon: Users2 },
            ].map((skill, i) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.02 }}
                className="bg-gray-50 rounded-xl p-4 sm:p-5 hover:bg-gradient-to-br hover:from-yellow-50 hover:to-orange-50 border border-gray-200 hover:border-yellow-300 transition-all group cursor-pointer"
              >
                <skill.icon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 group-hover:text-yellow-500 transition-colors mb-2 sm:mb-3" />
                <p className="font-semibold text-gray-900 text-xs sm:text-sm">
                  {skill.name}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 sm:py-24 bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold font-display text-white mb-4">
              Why Choose Thinkhall Academy?
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              "Agentive AI Coach (not static content)",
              "Personalized, role-based learning",
              "Gamified skill assessments",
              "Industry-relevant simulations",
              "Measurable skill progression",
              "Scalable for individuals & organizations",
              "Customizable content",
              "Hybrid mode with human intervention",
            ].map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white/20 backdrop-blur-sm rounded-xl p-4 flex items-center gap-3"
              >
                <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
                <span className="text-white font-medium text-sm">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Organizations Section */}
      <section className="py-20 sm:py-24 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block bg-yellow-400/20 text-yellow-400 text-sm font-semibold px-4 py-2 rounded-full mb-6">
                For Organizations
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold font-display mb-6">
                Empower Your <span className="text-yellow-400">Workforce</span>
              </h2>
              <p className="text-base sm:text-lg text-gray-400 mb-8">
                Transform your organization&apos;s learning culture with our
                enterprise-grade platform designed for scale, customization, and
                measurable outcomes.
              </p>
              <div className="space-y-4">
                {[
                  {
                    icon: Building2,
                    title: "Enterprise Dashboard",
                    desc: "Track team progress and skill gaps in real-time",
                  },
                  {
                    icon: Rocket,
                    title: "Custom Learning Paths",
                    desc: "Tailored programs aligned with your business goals",
                  },
                  {
                    icon: Users,
                    title: "Team Analytics",
                    desc: "Detailed insights on team performance and growth",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-4 bg-white/5 rounded-xl p-4 border border-white/10"
                  >
                    <div className="w-10 h-10 rounded-lg bg-yellow-400/20 flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">
                        {item.title}
                      </h4>
                      <p className="text-gray-400 text-sm">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-8 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-yellow-400/30 transition-all"
              >
                Schedule a Demo
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-gray-400">
                        Team Skill Progress
                      </span>
                      <span className="text-yellow-400 text-sm font-semibold">
                        +24%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "78%" }}
                        transition={{ duration: 1, delay: 0.5 }}
                        viewport={{ once: true }}
                        className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-yellow-400">
                        156
                      </div>
                      <div className="text-xs text-gray-400">
                        Active Learners
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-green-400">
                        92%
                      </div>
                      <div className="text-xs text-gray-400">
                        Completion Rate
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-sm text-gray-400 mb-2">
                      Top Performing Teams
                    </div>
                    <div className="space-y-2">
                      {["Sales Team", "Marketing", "Operations"].map(
                        (team, i) => (
                          <div key={team} className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-xs font-bold text-white">
                              {i + 1}
                            </div>
                            <span className="text-white text-sm">{team}</span>
                            <div className="ml-auto text-gray-400 text-xs">
                              {95 - i * 3}%
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-radial from-yellow-400/20 to-transparent rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-white mb-6">
              Ready to Transform Your{" "}
              <span className="text-yellow-400">Skills?</span>
            </h2>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals and organizations who are already
              building future-ready skills with Thinkhall Academy.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/signup"
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-yellow-400/30 transition-all text-lg"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/contact"
                className="bg-white/10 text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-2 hover:bg-white/20 transition-all text-lg border border-white/20"
              >
                Contact Sales
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="lg:col-span-1">
              <h3 className="text-2xl font-bold font-display mb-4">
                Thinkhall<span className="text-yellow-400">.</span>
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                AI-powered SkillTech platform designed to assess, coach, and
                elevate professionals at every stage.
              </p>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-yellow-400 hover:text-gray-900 transition-all"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-yellow-400 hover:text-gray-900 transition-all"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-yellow-400 hover:text-gray-900 transition-all"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-3">
                {[
                  "About Us",
                  "Programs",
                  "For Organizations",
                  "Pricing",
                  "Blog",
                ].map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-gray-400 hover:text-yellow-400 transition-colors text-sm"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-3">
                {[
                  "Help Center",
                  "Documentation",
                  "API Reference",
                  "Community",
                  "Careers",
                ].map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-gray-400 hover:text-yellow-400 transition-colors text-sm"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-white mb-4">Contact Us</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="mailto:hello@thinkhall.com"
                    className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition-colors text-sm"
                  >
                    <Mail className="w-4 h-4" />
                    hello@thinkhall.com
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+1234567890"
                    className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition-colors text-sm"
                  >
                    <Phone className="w-4 h-4" />
                    +1 (234) 567-890
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Thinkhall Academy. All rights
              reserved.
            </p>
            <div className="flex gap-6">
              <Link
                href="#"
                className="text-gray-400 hover:text-yellow-400 transition-colors text-sm"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-yellow-400 transition-colors text-sm"
              >
                Terms of Service
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-yellow-400 transition-colors text-sm"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
