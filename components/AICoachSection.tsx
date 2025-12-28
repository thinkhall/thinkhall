"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Sparkles,
  Zap,
  Target,
  Clock,
  TrendingUp,
  Send,
  ArrowUpRight,
} from "lucide-react";
import { AI_COACH_CONVERSATIONS } from "@/lib/constants";

export default function AICoachSection() {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const showNextMessage = () => {
      if (currentMessage < AI_COACH_CONVERSATIONS.length - 1) {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          setCurrentMessage((prev) => prev + 1);
        }, 1500);
      } else {
        setTimeout(() => {
          setCurrentMessage(0);
        }, 3000);
      }
    };

    const interval = setInterval(showNextMessage, 3000);
    return () => clearInterval(interval);
  }, [currentMessage]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [currentMessage]);

  const features = [
    {
      icon: Target,
      title: "Personalized Learning",
      description: "Tailored recommendations based on your goals and progress",
    },
    {
      icon: TrendingUp,
      title: "Skill Gap Analysis",
      description: "Real-time insights into areas that need improvement",
    },
    {
      icon: Zap,
      title: "Adaptive Coaching",
      description: "Evolves and adjusts to your unique learning journey",
    },
    {
      icon: Clock,
      title: "Always Available",
      description: "24/7 guidance whenever you need support",
    },
  ];

  return (
    <section className="relative py-24 sm:py-32 bg-[#09090b] overflow-hidden">
      {/* Subtle Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-amber-500/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-500/[0.03] rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-amber-500/10 px-3 py-1.5 rounded-full mb-8">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-body text-xs font-medium text-amber-400 tracking-wide uppercase">
                AI-Powered Coaching
              </span>
            </div>

            {/* Heading */}
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <span className="text-white">Meet </span>
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                THINKMATE
              </span>
            </h2>

            <p className="font-display text-xl sm:text-2xl text-white/90 font-medium mb-4">
              Your Personal Learning Guide
            </p>

            {/* Description */}
            <p className="font-body text-base text-zinc-400 leading-relaxed mb-10 max-w-lg">
              Not just another chatbot.{" "}
              <span className="text-white">THINKMATE</span> is an Agentive AI
              that understands your goals, tracks your progress, and delivers
              personalized recommendations in real-time.
            </p>

            {/* Feature List */}
            <div className="space-y-4 mb-10">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i, duration: 0.4 }}
                  className="group flex items-start gap-4"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-zinc-800/80 flex items-center justify-center border border-zinc-700/50 group-hover:border-amber-500/30 group-hover:bg-amber-500/10 transition-all duration-300">
                    <feature.icon className="w-5 h-5 text-zinc-400 group-hover:text-amber-400 transition-colors" />
                  </div>
                  <div className="pt-0.5">
                    <h4 className="font-display text-white font-semibold text-sm mb-0.5">
                      {feature.title}
                    </h4>
                    <p className="font-body text-xs text-zinc-500 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group inline-flex items-center gap-2 bg-white text-zinc-900 font-display font-semibold px-6 py-3 rounded-full hover:bg-amber-400 transition-colors duration-300"
            >
              Try THINKMATE Free
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </motion.button>
          </motion.div>

          {/* Right Column - Chat Interface */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            {/* Chat Card */}
            <div className="relative">
              {/* Subtle glow */}
              <div className="absolute -inset-px bg-gradient-to-b from-zinc-700/50 to-transparent rounded-2xl" />

              <div className="relative bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
                {/* Chat Header */}
                <div className="px-5 py-4 border-b border-zinc-800 bg-zinc-900/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                          <Brain className="w-5 h-5 text-white" />
                        </div>
                        {/* Online indicator */}
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-zinc-900" />
                      </div>
                      <div>
                        <h3 className="font-display text-white font-bold text-sm flex items-center gap-2">
                          THINKMATE
                          <span className="px-1.5 py-0.5 bg-amber-500/20 rounded text-[10px] font-medium text-amber-400">
                            PRO
                          </span>
                        </h3>
                        <span className="font-body text-emerald-400 text-xs">
                          Active now
                        </span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="hidden sm:flex items-center gap-1.5 bg-zinc-800/50 px-3 py-1.5 rounded-lg">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="font-body text-xs text-zinc-400">
                        <span className="text-white font-medium">98%</span>{" "}
                        accuracy
                      </span>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div
                  ref={chatContainerRef}
                  className="p-5 space-y-4 h-[340px] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent"
                >
                  <AnimatePresence mode="popLayout">
                    {AI_COACH_CONVERSATIONS.slice(0, currentMessage + 1).map(
                      (msg, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 25,
                          }}
                          className={`flex ${
                            msg.type === "user"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`flex items-end gap-2.5 max-w-[80%] ${
                              msg.type === "user" ? "flex-row-reverse" : ""
                            }`}
                          >
                            {/* Avatar */}
                            <div
                              className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center ${
                                msg.type === "user"
                                  ? "bg-violet-500"
                                  : "bg-gradient-to-br from-amber-400 to-orange-500"
                              }`}
                            >
                              {msg.type === "user" ? (
                                <span className="text-white text-xs font-bold font-body">
                                  Y
                                </span>
                              ) : (
                                <Brain className="w-3.5 h-3.5 text-white" />
                              )}
                            </div>

                            {/* Message bubble */}
                            <div
                              className={`rounded-2xl px-4 py-2.5 ${
                                msg.type === "user"
                                  ? "bg-violet-500 text-white rounded-br-sm"
                                  : "bg-zinc-800 text-zinc-100 rounded-bl-sm border border-zinc-700/50"
                              }`}
                            >
                              <p className="font-body text-sm leading-relaxed">
                                {msg.text}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )
                    )}
                  </AnimatePresence>

                  {/* Typing Indicator */}
                  <AnimatePresence>
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-end gap-2.5"
                      >
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                          <Brain className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div className="bg-zinc-800 rounded-2xl rounded-bl-sm px-4 py-3 border border-zinc-700/50">
                          <div className="flex gap-1">
                            {[0, 1, 2].map((i) => (
                              <motion.span
                                key={i}
                                animate={{ opacity: [0.4, 1, 0.4] }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  delay: i * 0.2,
                                }}
                                className="w-1.5 h-1.5 bg-amber-400 rounded-full"
                              />
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-zinc-800 bg-zinc-900/80">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-zinc-800 rounded-xl px-4 py-3 border border-zinc-700/50">
                      <span className="font-body text-zinc-500 text-sm">
                        Ask THINKMATE anything...
                      </span>
                    </div>
                    <button className="w-10 h-10 rounded-xl bg-amber-500 hover:bg-amber-400 flex items-center justify-center transition-colors">
                      <Send className="w-4 h-4 text-zinc-900" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="absolute -left-6 bottom-24 z-10"
            >
              <div className="bg-zinc-800 rounded-xl px-4 py-3 border border-zinc-700/50 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/20 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <div className="font-display text-white font-bold text-sm">
                      10M+
                    </div>
                    <div className="font-body text-zinc-500 text-xs">
                      Interactions
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
