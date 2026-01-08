"use client";

import { useEffect, useState, useRef } from "react";
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
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  TrendingUp,
  Heart,
  Globe,
  Award,
  Search,
  Wrench,
  LineChart,
  Compass,
  ChevronRight,
  LayoutDashboard,
  Bot,
  Map,
  UserCircle,
  UsersRound,
  Zap,
  Lightbulb,
  BadgeCheck,
  Building,
  Handshake,
  Layers,
  Shield,
  Star,
  Quote,
  ArrowUpRight,
  Percent,
  Activity,
  UserCheck,
  Settings,
  ChevronDown,
} from "lucide-react";

import { globalStyles } from "@/lib/constants";
import InteractiveDashboard from "@/components/InteractiveDashboard";
import {
  GamifiedAssessmentCard,
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
      transition={{ duration: 0.6 }}
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

// Video Section Component
function VideoShowcase() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="relative"
    >
      <div className="absolute -top-20 -right-6 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full blur-2xl" />
      <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-gradient-to-tr from-orange-400/15 to-yellow-500/15 rounded-full blur-2xl" />

      <motion.div
        animate={{ y: [5, -5, 5] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-3 -right-3 bg-white rounded-xl shadow-lg p-3 border border-gray-100 z-20"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-900">
              10x Faster
            </div>
            <div className="text-[10px] text-gray-500">Skill Growth</div>
          </div>
        </div>
      </motion.div>

      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
        <div className="flex items-center justify-between px-4 py-3 bg-black/30 backdrop-blur-sm border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <div className="flex items-center gap-1 text-white/60 text-xs">
            <Sparkles className="w-3 h-3" />
            <span>Thinkhall Academy</span>
          </div>
        </div>

        <div className="relative aspect-video bg-black">
          <video
            ref={videoRef}
            src="/hero_video.mp4"
            className="w-full h-full object-cover"
            muted={isMuted}
            loop
            playsInline
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />

          {!isPlaying && (
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-orange-500/10">
              <div className="absolute inset-0 opacity-10">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                    backgroundSize: "32px 32px",
                  }}
                />
              </div>

              <div className="absolute inset-0 flex items-center justify-center">
                <motion.button
                  onClick={handlePlayPause}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative"
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 animate-ping opacity-20" />
                  <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-yellow-400/20 to-orange-500/20 blur-xl" />
                  <div className="relative w-20 h-20 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center shadow-xl shadow-yellow-500/30 group-hover:shadow-2xl group-hover:shadow-yellow-500/40 transition-all">
                    <Play className="w-8 h-8 text-white ml-1" fill="white" />
                  </div>
                </motion.button>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex items-center gap-2 text-yellow-400 text-sm font-medium mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span>Discover Thinkhall</span>
                </div>
                <h3 className="text-white font-bold text-lg">
                  See How We Transform Skills Into Success
                </h3>
              </div>
            </div>
          )}

          {isPlaying && (
            <div
              className="absolute inset-0 group cursor-pointer"
              onClick={handlePlayPause}
            >
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayPause();
                      }}
                      className="text-white hover:text-yellow-400 transition-colors"
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMuteToggle();
                      }}
                      className="text-white hover:text-yellow-400 transition-colors"
                    >
                      {isMuted ? (
                        <VolumeX className="w-5 h-5" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFullscreen();
                    }}
                    className="text-white hover:text-yellow-400 transition-colors"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-4 py-3 bg-black/30 backdrop-blur-sm border-t border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 border-2 border-gray-800 flex items-center justify-center"
                  >
                    <span className="text-[8px] text-white">👤</span>
                  </div>
                ))}
              </div>
              <span className="text-white/60 text-xs">
                2.4M+ learners watched
              </span>
            </div>
            <div className="flex items-center gap-1 text-yellow-400 text-xs">
              <span>★★★★★</span>
              <span className="text-white/60">4.9</span>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-6 text-center"
      >
        <button
          onClick={handlePlayPause}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-900 to-gray-800 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:shadow-lg transition-all group border border-white/10"
        >
          <Play className="w-4 h-4 text-yellow-400 group-hover:scale-110 transition-transform" />
          <span>Watch how THINKMATE transforms learning</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>
    </motion.div>
  );
}

// What We Do Section
// function WhatWeDoSection() {
//   const steps = [
//     {
//       icon: Search,
//       title: "Diagnose Skills",
//       description: "AI-powered assessments to identify skill gaps",
//       color: "from-blue-400 to-cyan-500",
//     },
//     {
//       icon: Wrench,
//       title: "Build Skills",
//       description: "Personalized learning paths with real-world simulations",
//       color: "from-purple-400 to-violet-500",
//     },
//     {
//       icon: LineChart,
//       title: "Track Impact",
//       description: "Measurable outcomes with detailed analytics",
//       color: "from-green-400 to-emerald-500",
//     },
//     {
//       icon: Compass,
//       title: "Enable Careers",
//       description: "Career progression through continuous development",
//       color: "from-yellow-400 to-orange-500",
//     },
//   ];

//   return (
//     <section className="py-16 sm:py-20 bg-white">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6 }}
//           className="text-center mb-12"
//         >
//           <span className="inline-block bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 text-sm font-semibold px-4 py-2 rounded-full mb-4">
//             Skill-Tech Platform
//           </span>
//           <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-gray-900 mb-4">
//             What We <span className="gradient-text">Do</span>
//           </h2>
//           <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
//             A complete skill development ecosystem powered by AI
//           </p>
//         </motion.div>

//         <div className="relative">
//           <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-purple-200 via-green-200 to-yellow-200 -translate-y-1/2 mx-24" />
//           <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
//             {steps.map((step, i) => (
//               <motion.div
//                 key={step.title}
//                 initial={{ opacity: 0, y: 30 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ duration: 0.5, delay: i * 0.1 }}
//                 className="relative"
//               >
//                 {i < steps.length - 1 && (
//                   <div className="hidden sm:flex lg:hidden absolute -right-3 top-1/2 -translate-y-1/2 z-10">
//                     <ChevronRight className="w-6 h-6 text-gray-300" />
//                   </div>
//                 )}
//                 <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all group h-full">
//                   <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-bold shadow-lg">
//                     {i + 1}
//                   </div>
//                   <div
//                     className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}
//                   >
//                     <step.icon className="w-7 h-7 text-white" />
//                   </div>
//                   <h3 className="text-lg font-bold text-gray-900 mb-2">
//                     {step.title}
//                   </h3>
//                   <p className="text-sm text-gray-600">{step.description}</p>
//                   {i < steps.length - 1 && (
//                     <div className="hidden lg:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10">
//                       <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-md">
//                         <ChevronRight className="w-4 h-4 text-gray-400" />
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </div>

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.5, delay: 0.4 }}
//           className="text-center mt-12"
//         >
//           <Link
//             href="/demo"
//             className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-yellow-400/30 transition-all text-base sm:text-lg"
//           >
//             Book a Demo <ArrowRight className="w-5 h-5" />
//           </Link>
//         </motion.div>
//       </div>
//     </section>
//   );
// }

// How Thinkhall Works Section
function HowThinkhallWorksSection() {
  const steps = [
    {
      number: "01",
      icon: Gamepad2,
      title: "Gamified Skill Assessments",
      description:
        "Engage with interactive assessments that make skill evaluation fun and accurate",
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-pink-50",
    },
    {
      number: "02",
      icon: LayoutDashboard,
      title: "Skill Gap Dashboards",
      description:
        "Visualize your strengths and areas for improvement with intuitive dashboards",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
    },
    {
      number: "03",
      icon: Bot,
      title: "THINKMATE AI Coaching",
      description:
        "Get personalized guidance from our AI coach that adapts to your learning style",
      color: "from-purple-500 to-violet-500",
      bgColor: "bg-purple-50",
    },
    {
      number: "04",
      icon: Map,
      title: "Micro-Learning & Career Mapping",
      description:
        "Bite-sized lessons and clear career paths to achieve your professional goals",
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-50",
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 text-sm font-semibold px-4 py-2 rounded-full mb-4">
            Platform
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-gray-900 mb-4">
            How Thinkhall <span className="gradient-text">Works</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            A simple 4-step journey to transform your skills
          </p>
        </motion.div>

        <div className="relative">
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-pink-300 via-blue-300 via-purple-300 to-amber-300 -translate-x-1/2" />
          <div className="space-y-8 lg:space-y-0">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative lg:grid lg:grid-cols-2 lg:gap-8 ${
                  i % 2 === 0 ? "" : "lg:direction-rtl"
                }`}
              >
                <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                  <div
                    className={`w-12 h-12 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg border-4 border-white`}
                  >
                    <span className="text-white font-bold text-sm">
                      {step.number}
                    </span>
                  </div>
                </div>
                <div
                  className={`${
                    i % 2 === 0
                      ? "lg:pr-16 lg:text-right"
                      : "lg:col-start-2 lg:pl-16"
                  }`}
                >
                  <div
                    className={`${step.bgColor} rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all group`}
                  >
                    <div
                      className={`flex items-start gap-4 ${
                        i % 2 === 0 ? "lg:flex-row-reverse" : ""
                      }`}
                    >
                      <div
                        className={`lg:hidden w-10 h-10 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-md flex-shrink-0`}
                      >
                        <span className="text-white font-bold text-xs">
                          {step.number}
                        </span>
                      </div>
                      <div
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform flex-shrink-0`}
                      >
                        <step.icon className="w-7 h-7 text-white" />
                      </div>
                      <div className={`flex-1 ${i % 2 === 0 ? "lg:pr-4" : ""}`}>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          {step.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {i % 2 === 0 && <div className="hidden lg:block" />}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Who It's For Section
function WhoItsForSection() {
  const audiences = [
    {
      icon: Building2,
      title: "Enterprises",
      description:
        "Scale skill development across your organization with enterprise-grade tools",
      features: ["Custom learning paths", "Team analytics", "SSO integration"],
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      icon: UsersRound,
      title: "L&D Teams",
      description:
        "Empower your learning & development initiatives with AI-driven insights",
      features: ["Content management", "Progress tracking", "ROI measurement"],
      color: "from-purple-500 to-violet-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    {
      icon: Briefcase,
      title: "Managers",
      description:
        "Develop leadership skills and coach your teams more effectively",
      features: ["Team dashboards", "Skill gap analysis", "Coaching tools"],
      color: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
    },
    {
      icon: UserCircle,
      title: "Employees / Learners",
      description:
        "Take charge of your career growth with personalized learning experiences",
      features: ["Self-paced learning", "Career mapping", "Certifications"],
      color: "from-amber-500 to-orange-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 text-sm font-semibold px-4 py-2 rounded-full mb-4">
            Audiences
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-gray-900 mb-4">
            Who It&apos;s <span className="gradient-text">For</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Tailored solutions for every stakeholder in your organization
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {audiences.map((audience, i) => (
            <motion.div
              key={audience.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`${audience.bgColor} rounded-2xl p-6 border ${audience.borderColor} hover:shadow-xl transition-all group relative overflow-hidden`}
            >
              <div
                className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${audience.color} opacity-10 group-hover:opacity-20 transition-opacity`}
              />
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${audience.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform relative z-10`}
              >
                <audience.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 relative z-10">
                {audience.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4 relative z-10">
                {audience.description}
              </p>
              <ul className="space-y-2 relative z-10">
                {audience.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-xs text-gray-700"
                  >
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Why Thinkhall (Differentiators) Section
function WhyThinkhallSection() {
  const differentiators = [
    {
      icon: Puzzle,
      title: "Real Business Simulations",
      description:
        "Learn through immersive simulations, not boring MCQs. Practice real-world scenarios in a safe environment.",
      highlight: "Not MCQs",
    },
    {
      icon: Brain,
      title: "AI-Driven Personalized Learning",
      description:
        "THINKMATE adapts to your learning style, pace, and goals for a truly personalized experience.",
      highlight: "Adaptive AI",
    },
    {
      icon: Zap,
      title: "Behaviour Nudges & Habit Formation",
      description:
        "Smart nudges and micro-interventions that help you build lasting learning habits.",
      highlight: "Habit Tech",
    },
    {
      icon: TrendingUp,
      title: "Skills Linked to Career Progression",
      description:
        "Every skill you build is mapped to real career outcomes and growth opportunities.",
      highlight: "Career Impact",
    },
    {
      icon: Target,
      title: "Aligned to Company Goals",
      description:
        "Learning programs that directly support your organization's strategic objectives.",
      highlight: "Goal Aligned",
    },
    {
      icon: Layers,
      title: "First Hybrid Mode Platform",
      description:
        "Seamlessly blend AI coaching with human trainers for the best of both worlds.",
      highlight: "Hybrid Learning",
    },
  ];

  return (
    <section className="py-20 sm:py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          {/* <span className="inline-block bg-yellow-400/20 text-yellow-400 text-sm font-semibold px-4 py-2 rounded-full mb-4 border border-yellow-400/30">
            Differentiators
          </span> */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-white mb-4">
            Why{" "}
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Thinkhall
            </span>
          </h2>
          <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto">
            What makes us different from traditional learning platforms
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {differentiators.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-yellow-400/30 hover:bg-white/10 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400/20 to-orange-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <item.icon className="w-6 h-6 text-yellow-400" />
                </div>
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 text-xs font-bold px-3 py-1 rounded-full">
                  {item.highlight}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-gray-400">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Enterprise Solutions Preview Section
function EnterpriseSolutionsSection() {
  const solutions = [
    {
      icon: Settings,
      title: "Custom Programs",
      description:
        "Tailored learning experiences designed specifically for your industry, roles, and business challenges.",
      features: [
        "Industry-specific content",
        "Role-based curricula",
        "Brand customization",
      ],
      color: "from-blue-500 to-indigo-600",
    },
    {
      icon: Users,
      title: "Trainers on Hire",
      description:
        "Access our network of expert trainers for classroom sessions, workshops, and hands-on training.",
      features: [
        "Certified experts",
        "On-site & virtual",
        "Flexible scheduling",
      ],
      color: "from-emerald-500 to-teal-600",
    },
    {
      icon: BarChart2,
      title: "Org-wide Skill Intelligence",
      description:
        "Get complete visibility into your workforce's capabilities with advanced analytics and insights.",
      features: ["Skill heat maps", "Gap analysis", "Predictive insights"],
      color: "from-purple-500 to-violet-600",
    },
  ];

  return (
    <section className="py-20 sm:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 text-sm font-semibold px-4 py-2 rounded-full mb-4">
            Enterprise Solutions
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-gray-900 mb-4">
            Built for <span className="gradient-text">Scale</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Enterprise-grade solutions for large-scale skill transformation
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {solutions.map((solution, i) => (
            <motion.div
              key={solution.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-2xl transition-all group relative overflow-hidden"
            >
              <div
                className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${solution.color} opacity-5 rounded-full -translate-y-1/2 translate-x-1/2`}
              />

              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${solution.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}
              >
                <solution.icon className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {solution.title}
              </h3>
              <p className="text-gray-600 mb-6">{solution.description}</p>

              <ul className="space-y-3">
                {solution.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-sm text-gray-700"
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href="/enterprise"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-900 group-hover:text-yellow-600 transition-colors"
              >
                Learn more <ArrowUpRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link
            href="/enterprise"
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-all"
          >
            Explore Enterprise Solutions <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// Trust & Proof Section
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
    <section className="py-20 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 text-sm font-semibold px-4 py-2 rounded-full mb-4">
            Trust & Proof
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-gray-900 mb-4">
            Results That <span className="gradient-text">Speak</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
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
              className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all group"
            >
              <div
                className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${metric.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}
              >
                <metric.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-1">
                {metric.value}
              </div>
              <div className="text-sm font-semibold text-gray-700 mb-1">
                {metric.label}
              </div>
              <div className="text-xs text-gray-500">{metric.description}</div>
            </motion.div>
          ))}
        </div>

        {/* Use Cases */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 sm:p-12"
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
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-yellow-400/30 transition-all"
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

// Final CTA Section
function FinalCTASection() {
  return (
    <section className="py-24 sm:py-32 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/10 rounded-full blur-3xl" />
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
          >
            <Rocket className="w-10 h-10 text-white" />
          </motion.div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold font-display text-white mb-6">
            Build Skills That{" "}
            <span className="underline decoration-4 decoration-white/50">
              Perform
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Join 500+ organizations transforming their workforce with AI-powered
            skill development
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/demo"
              className="bg-white text-gray-900 px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:shadow-2xl hover:scale-105 transition-all text-lg group"
            >
              <MessageSquare className="w-5 h-5" />
              Talk to Thinkhall
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
           
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/80">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-white" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-white" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-white" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function HomePage() {
  useEffect(() => {
    const styleId = "global-custom-styles";
    if (document.getElementById(styleId)) return;
    const style = document.createElement("style");
    style.id = styleId;
    style.innerHTML = globalStyles;
    document.head.appendChild(style);
    return () => {
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) document.head.removeChild(existingStyle);
    };
  }, []);

  return (
    <main className="bg-white text-gray-900 overflow-x-hidden font-body">
      {/* 1. Hero Section */}
      <section className="relative pt-8 sm:pt-10 lg:pt-12 pb-12 sm:pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/50 via-white to-orange-50/30" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-radial from-yellow-100/40 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 bg-stone-100 text-stone-700 rounded-full px-4 py-2 mb-4 sm:mb-6 border border-stone-200"
              >
                <Sparkles className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium">
                  AI-Powered SkillTech Platform
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-[1.1] mb-4 font-display"
              >
                <span className="gradient-text">Where Skills Meet </span>
                <span className="gradient-text">Intelligence</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0 mb-4"
              >
                Build future-ready skills through AI-powered coaching,
                real-world simulations, and personalized learning journeys.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="flex flex-wrap justify-center lg:justify-start gap-3 text-xs sm:text-sm text-gray-500 mb-6"
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
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap gap-3 justify-center lg:justify-start"
              >
                <Link
                  href="/demo"
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 sm:px-8 py-3.5 rounded-xl font-semibold flex items-center gap-2 hover:shadow-xl hover:shadow-yellow-400/30 transition-all text-sm sm:text-base group"
                >
                  <Building2 className="w-4 h-4" /> Book a Demo{" "}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap justify-center lg:justify-start gap-4 mt-8 pt-6 border-t border-gray-100"
              >
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 border-2 border-white flex items-center justify-center"
                      >
                        <span className="text-[10px] text-white font-bold">
                          {String.fromCharCode(64 + i)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <span>
                    <strong className="text-gray-900">500+</strong> companies
                    trust us
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400">★★★★★</span>
                  <span className="text-sm text-gray-500">
                    <strong className="text-gray-900">4.9</strong> (2.4k
                    reviews)
                  </span>
                </div>
              </motion.div>
            </div>

            <VideoShowcase />
          </div>
        </div>
      </section>

      {/* 2. What We Do - Skill-Tech Platform */}
      {/* <WhatWeDoSection /> */}

      {/* 3. How Thinkhall Works - 4-Step Flow */}
      {/* <HowThinkhallWorksSection /> */}

      {/* 4. Who It's For */}
      {/* <WhoItsForSection /> */}

      {/* 6. Enterprise Solutions Preview */}
      {/* <EnterpriseSolutionsSection /> */}

      {/* 7. Trust & Proof */}
      {/* <TrustProofSection /> */}

      {/* 8. Interactive Dashboard Preview */}
      {/* <section className="py-12 sm:py-16 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <InteractiveDashboard />
        </div>
      </section> */}

      {/* 9. Platform Features */}
      {/* <section className="py-20 sm:py-24">
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
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 mt-12">
            <GamifiedAssessmentCard />
            <MicroLearningCard />
          </div>
        </div>
      </section> */}

      <HowItWorksSection />

      {/* <AICoachSection /> */}

      <CareerPathSection />

      {/* About Section */}
      {/* <section className="relative py-24 sm:py-32 bg-[#0a0a0f] text-white overflow-hidden">
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
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight mb-6">
                Designed for the Skills of{" "}
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  Today—and Tomorrow
                </span>
              </h2>
              <p className="text-lg text-gray-400 leading-relaxed mb-10 max-w-lg">
                Whether you&apos;re stepping into your first role or leading
                large teams, Thinkhall meets you exactly where you are.
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
      </section> */}

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
                transition={{ duration: 0.5, delay: i * 0.1 }}
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
                transition={{ duration: 0.4, delay: i * 0.05 }}
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
      {/* 5. Why Thinkhall - Differentiators */}
      <WhyThinkhallSection />
      {/* Final CTA Section */}
      <FinalCTASection />

      {/* Footer */}
    </main>
  );
}
