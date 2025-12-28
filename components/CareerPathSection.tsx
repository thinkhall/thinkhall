"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Lock, Star, Trophy, TrendingUp } from "lucide-react";

const CAREER_PATH_DATA = [
  { level: "Entry Level", skills: 100, completed: true, current: false },
  { level: "Junior", skills: 100, completed: true, current: false },
  { level: "Mid-Level", skills: 65, completed: false, current: true },
  { level: "Senior", skills: 0, completed: false, current: false },
  { level: "Lead", skills: 0, completed: false, current: false },
  { level: "Executive", skills: 0, completed: false, current: false },
];

export default function CareerPathSection() {
  const completedCount = CAREER_PATH_DATA.filter((l) => l.completed).length;
  const currentIndex = CAREER_PATH_DATA.findIndex((l) => l.current);

  return (
    <section className="relative py-20 sm:py-28 overflow-hidden bg-white">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-100/50 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-100/50 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring" }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 text-sm font-semibold px-4 py-2 rounded-full mb-5 border border-orange-200/50 font-body"
          >
            <TrendingUp className="w-4 h-4" />
            Career Progression
          </motion.span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display mb-4 text-gray-900">
            Your Journey to{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                Leadership
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
                  stroke="url(#leadershipUnderline)"
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
                    id="leadershipUnderline"
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
            Track your progression from entry-level to executive leadership
          </p>

          {/* Progress summary */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-6 inline-flex items-center gap-3 bg-gray-50 rounded-full px-5 py-2.5 border border-gray-100"
          >
            <div className="flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-semibold text-gray-900 font-display">
                {completedCount} of {CAREER_PATH_DATA.length}
              </span>
            </div>
            <div className="w-px h-4 bg-gray-200" />
            <span className="text-sm text-gray-500 font-body">
              levels completed
            </span>
          </motion.div>
        </motion.div>

        {/* Career Path */}
        <div className="relative max-w-4xl mx-auto">
          {/* Desktop: Horizontal Layout */}
          <div className="hidden lg:block">
            {/* Progress Track */}
            <div className="relative h-2 bg-gray-100 rounded-full mb-12 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{
                  width: `${
                    ((currentIndex + 0.5) / CAREER_PATH_DATA.length) * 100
                  }%`,
                }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-400 via-yellow-400 to-orange-500 rounded-full"
              />
            </div>

            {/* Level Cards */}
            <div className="grid grid-cols-6 gap-3">
              {CAREER_PATH_DATA.map((level, i) => (
                <motion.div
                  key={level.level}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative"
                >
                  {/* Connector dot */}
                  <div
                    className={`absolute -top-[52px] left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-4 border-white shadow-sm ${
                      level.completed
                        ? "bg-green-500"
                        : level.current
                        ? "bg-orange-500"
                        : "bg-gray-200"
                    }`}
                  />

                  {/* Card */}
                  <motion.div
                    whileHover={{ y: -4 }}
                    className={`relative p-4 rounded-xl text-center transition-all duration-300 ${
                      level.current
                        ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-lg shadow-orange-200"
                        : level.completed
                        ? "bg-green-50 border-2 border-green-200"
                        : "bg-gray-50 border-2 border-gray-100"
                    }`}
                  >
                    {/* Icon */}
                    <div
                      className={`w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center ${
                        level.current
                          ? "bg-white/20"
                          : level.completed
                          ? "bg-green-100"
                          : "bg-gray-100"
                      }`}
                    >
                      {level.completed && !level.current ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : level.current ? (
                        <motion.div
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Star className="w-5 h-5 text-white" />
                        </motion.div>
                      ) : (
                        <Lock className="w-4 h-4 text-gray-400" />
                      )}
                    </div>

                    {/* Level name */}
                    <h4
                      className={`text-sm font-bold font-display mb-2 ${
                        level.current ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {level.level}
                    </h4>

                    {/* Progress or status */}
                    {level.skills > 0 ? (
                      <div className="space-y-1.5">
                        <div
                          className={`w-full h-1.5 rounded-full overflow-hidden ${
                            level.current ? "bg-white/30" : "bg-gray-200"
                          }`}
                        >
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${level.skills}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                            className={`h-full rounded-full ${
                              level.current ? "bg-white" : "bg-green-500"
                            }`}
                          />
                        </div>
                        <span
                          className={`text-xs font-medium font-body ${
                            level.current ? "text-white/80" : "text-gray-500"
                          }`}
                        >
                          {level.skills}%
                        </span>
                      </div>
                    ) : (
                      <span
                        className={`text-xs font-medium font-body ${
                          level.completed ? "text-green-600" : "text-gray-400"
                        }`}
                      >
                        {level.completed ? "Done" : "Locked"}
                      </span>
                    )}

                    {/* Current indicator */}
                    {level.current && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute -top-2 left-1/2 -translate-x-1/2 bg-white text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm font-display"
                      >
                        YOU
                      </motion.div>
                    )}
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile/Tablet: Vertical Layout */}
          <div className="lg:hidden">
            {/* Vertical progress line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-100 rounded-full">
              <motion.div
                initial={{ height: 0 }}
                whileInView={{
                  height: `${
                    ((currentIndex + 0.5) / CAREER_PATH_DATA.length) * 100
                  }%`,
                }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute inset-x-0 top-0 bg-gradient-to-b from-green-400 via-yellow-400 to-orange-500 rounded-full"
              />
            </div>

            <div className="space-y-4">
              {CAREER_PATH_DATA.map((level, i) => (
                <motion.div
                  key={level.level}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative flex items-center gap-4 pl-12"
                >
                  {/* Node */}
                  <div
                    className={`absolute left-4 w-5 h-5 rounded-full border-4 border-white shadow-sm -translate-x-1/2 ${
                      level.completed
                        ? "bg-green-500"
                        : level.current
                        ? "bg-orange-500"
                        : "bg-gray-200"
                    }`}
                  >
                    {level.current && (
                      <motion.div
                        className="absolute inset-0 rounded-full bg-orange-400"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </div>

                  {/* Card */}
                  <div
                    className={`flex-1 p-4 rounded-xl transition-all ${
                      level.current
                        ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg"
                        : level.completed
                        ? "bg-green-50 border border-green-200"
                        : "bg-gray-50 border border-gray-100"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            level.current
                              ? "bg-white/20"
                              : level.completed
                              ? "bg-green-100"
                              : "bg-gray-100"
                          }`}
                        >
                          {level.completed && !level.current ? (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          ) : level.current ? (
                            <Star className="w-4 h-4 text-white" />
                          ) : (
                            <Lock className="w-3.5 h-3.5 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <h4
                            className={`text-sm font-bold font-display ${
                              level.current ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {level.level}
                          </h4>
                          {level.current && (
                            <span className="text-xs text-white/70 font-body">
                              Current level
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Progress */}
                      {level.skills > 0 && (
                        <div className="text-right">
                          <span
                            className={`text-lg font-bold font-display ${
                              level.current ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {level.skills}%
                          </span>
                          <div
                            className={`w-16 h-1.5 rounded-full mt-1 overflow-hidden ${
                              level.current ? "bg-white/30" : "bg-gray-200"
                            }`}
                          >
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${level.skills}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                              className={`h-full rounded-full ${
                                level.current ? "bg-white" : "bg-green-500"
                              }`}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-shadow font-display"
          >
            <TrendingUp className="w-4 h-4" />
            Continue Your Journey
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}


