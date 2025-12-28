"use client";

import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Zap,
  Target,
  Trophy,
  Crown,
  Gem,
  Gamepad2,
  Star,
  TrendingUp,
  Video,
  PlayCircle,
  PauseCircle,
  Lock,
  Gift,
  Award,
  Sparkles,
  Brain,
  Flame,
  Medal,
  BookOpen,
  Rocket,
  GraduationCap,
  Briefcase,
  Building2,
  Timer,
  PartyPopper,
  Package,
} from "lucide-react";

// Bento Grid Container Component
export function FeaturesBentoGrid() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
      <div className="lg:col-span-2">
        <GamifiedAssessmentCard />
      </div>

      <div className="lg:col-span-1 flex flex-col gap-3">
        <RewardsRedemptionCard />
        <MicroLearningCard />
      </div>

      <div className="lg:col-span-2">
        <LevelProgressionCard />
      </div>

      <div className="lg:col-span-1">
        <ManagerBadgesCard />
      </div>
    </div>
  );
}

// Level Progression Card
function LevelProgressionCard() {
  const [currentLevel] = useState(3);

  const levelUnlocks = [
    {
      level: 1,
      name: "Beginner",
      unlock: "Basic Courses",
      icon: BookOpen,
      unlocked: true,
    },
    {
      level: 2,
      name: "Learner",
      unlock: "Skill Quizzes",
      icon: Brain,
      unlocked: true,
    },
    {
      level: 3,
      name: "Achiever",
      unlock: "Certificates",
      icon: Award,
      unlocked: true,
    },
    {
      level: 4,
      name: "Expert",
      unlock: "Advanced Courses",
      icon: Rocket,
      unlocked: false,
    },
    {
      level: 5,
      name: "Manager",
      unlock: "Leadership Track",
      icon: Briefcase,
      unlocked: false,
    },
    {
      level: 6,
      name: "Leader",
      unlock: "Executive Suite",
      icon: Building2,
      unlocked: false,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 rounded-2xl p-4 relative overflow-hidden"
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-white" />
            <h3 className="text-white font-bold text-sm">Level Up & Unlock</h3>
          </div>
          <div className="bg-white px-2.5 py-0.5 rounded-full">
            <span className="text-orange-500 font-bold text-xs">
              Level {currentLevel}
            </span>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {levelUnlocks.map((item) => (
            <motion.div
              key={item.level}
              whileHover={{ scale: item.unlocked ? 1.02 : 1 }}
              className={`flex-shrink-0 w-24 rounded-xl p-2 text-center ${
                item.unlocked ? "bg-white shadow-md" : "bg-white/20"
              }`}
            >
              <div
                className={`w-8 h-8 mx-auto rounded-lg flex items-center justify-center mb-1 ${
                  item.unlocked
                    ? "bg-gradient-to-br from-amber-400 to-orange-500"
                    : "bg-white/30"
                }`}
              >
                {item.unlocked ? (
                  <item.icon className="w-4 h-4 text-white" />
                ) : (
                  <Lock className="w-3 h-3 text-white/70" />
                )}
              </div>
              <div
                className={`text-[10px] font-bold ${
                  item.unlocked ? "text-gray-800" : "text-white"
                }`}
              >
                Lv.{item.level} {item.name}
              </div>
              <div
                className={`text-[9px] ${
                  item.unlocked ? "text-green-600" : "text-white/70"
                }`}
              >
                {item.unlocked ? `✓ ${item.unlock}` : item.unlock}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Manager Badges Card
function ManagerBadgesCard() {
  const [hoveredBadge, setHoveredBadge] = useState<number | null>(null);

  const managerBadges = [
    {
      icon: Briefcase,
      name: "Team Lead",
      level: 5,
      color: "from-blue-400 to-blue-500",
    },
    {
      icon: Building2,
      name: "Manager",
      level: 7,
      color: "from-purple-400 to-purple-500",
    },
    {
      icon: Crown,
      name: "Director",
      level: 10,
      color: "from-amber-400 to-orange-500",
    },
    {
      icon: Trophy,
      name: "Executive",
      level: 15,
      color: "from-yellow-400 to-amber-500",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
          <GraduationCap className="w-3.5 h-3.5 text-white" />
        </div>
        <h3 className="text-gray-800 font-bold text-sm">Manager Badges</h3>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {managerBadges.map((badge, i) => (
          <motion.div
            key={badge.name}
            onHoverStart={() => setHoveredBadge(i)}
            onHoverEnd={() => setHoveredBadge(null)}
            whileHover={{ scale: 1.05 }}
            className="relative bg-gray-50 rounded-xl p-2 text-center cursor-pointer"
          >
            <div
              className={`w-8 h-8 mx-auto rounded-full bg-gradient-to-br ${badge.color} opacity-30 flex items-center justify-center mb-1`}
            >
              <Lock className="w-3 h-3 text-white" />
            </div>
            <div className="text-gray-500 text-[9px] font-medium">
              {badge.name}
            </div>
            <div className="text-amber-500 text-[8px] font-semibold">
              Lv.{badge.level}
            </div>

            <AnimatePresence>
              {hoveredBadge === i && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[8px] px-2 py-1 rounded whitespace-nowrap z-10"
                >
                  🔒 Level {badge.level} required
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// Stages defined outside component
const STAGES = [
  {
    name: "Rookie",
    icon: BookOpen,
    minXp: 0,
    maxXp: 500,
    color: "from-emerald-400 to-green-500",
    badges: 1,
  },
  {
    name: "Explorer",
    icon: Target,
    minXp: 500,
    maxXp: 1000,
    color: "from-blue-400 to-cyan-500",
    badges: 3,
  },
  {
    name: "Pro",
    icon: Brain,
    minXp: 1000,
    maxXp: 1500,
    color: "from-purple-400 to-violet-500",
    badges: 5,
  },
  {
    name: "Expert",
    icon: Crown,
    minXp: 1500,
    maxXp: 2000,
    color: "from-amber-400 to-yellow-500",
    badges: 8,
  },
  {
    name: "Master",
    icon: Trophy,
    minXp: 2000,
    maxXp: 2500,
    color: "from-orange-400 to-red-500",
    badges: 12,
  },
];

// Helper to get level from XP
function getLevelFromXp(currentXp: number): number {
  for (let i = STAGES.length - 1; i >= 0; i--) {
    if (currentXp >= STAGES[i].minXp) return i + 1;
  }
  return 1;
}

// Gamified Assessment Card - Refactored to avoid setState in effects
export function GamifiedAssessmentCard() {
  const [xp, setXp] = useState(0);
  const [targetXp, setTargetXp] = useState(0);
  const [combo, setCombo] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showRestart, setShowRestart] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  const [journeyCount, setJourneyCount] = useState(1);
  const [notification, setNotification] = useState<{
    message: string;
    type: string;
  } | null>(null);

  const prevLevelRef = useRef(1);
  const isRestartingRef = useRef(false);
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  // Derived values
  const level = getLevelFromXp(xp);
  const badges = STAGES[Math.min(level - 1, 4)].badges;
  const currentStage = STAGES[Math.min(level - 1, 4)];
  const progressInLevel =
    ((xp - currentStage.minXp) / (currentStage.maxXp - currentStage.minXp)) *
    100;

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  // Handle level up animation
  const triggerLevelUp = useCallback((newLevel: number) => {
    setShowLevelUp(true);
    setNotification({
      message: `🎉 Level ${newLevel} Unlocked!`,
      type: "levelup",
    });

    const hideTimer = setTimeout(() => {
      setShowLevelUp(false);
      setNotification(null);
    }, 2000);
    timersRef.current.push(hideTimer);
  }, []);

  // Handle master completion and restart
  const triggerRestart = useCallback(() => {
    isRestartingRef.current = true;
    setShowRestart(true);
    setNotification({
      message: "🏆 Master Complete!",
      type: "restart",
    });

    const restartTimer = setTimeout(() => {
      setXp(0);
      setTargetXp(0);
      setCombo(0);
      setShowLevelUp(false);
      setShowRestart(false);
      setIsAnswering(false);
      setJourneyCount((prev) => prev + 1);
      prevLevelRef.current = 1;
      isRestartingRef.current = false;

      setNotification({
        message: "🚀 New Journey Begins!",
        type: "newjourney",
      });

      const clearTimer = setTimeout(() => setNotification(null), 2000);
      timersRef.current.push(clearTimer);
    }, 3000);
    timersRef.current.push(restartTimer);
  }, []);

  // Smooth XP animation
  useEffect(() => {
    if (xp < targetXp && !isRestartingRef.current) {
      const diff = targetXp - xp;
      const increment = Math.max(1, Math.floor(diff / 20));
      const timer = setTimeout(() => {
        setXp((prev) => Math.min(prev + increment, targetXp));
      }, 30);
      timersRef.current.push(timer);
      return () => clearTimeout(timer);
    }
  }, [xp, targetXp]);

  // Check for level changes and master completion
  useEffect(() => {
    if (isRestartingRef.current || showRestart) return;

    const prevLevel = prevLevelRef.current;

    // Level up detection
    if (level > prevLevel && prevLevel < 5) {
      prevLevelRef.current = level;
      // Defer to avoid sync setState in effect
      const timer = setTimeout(() => {
        triggerLevelUp(level);
      }, 0);
      timersRef.current.push(timer);
    }

    // Master completion
    if (xp >= 2500 && level === 5 && !isRestartingRef.current) {
      prevLevelRef.current = level;
      const timer = setTimeout(() => {
        triggerRestart();
      }, 0);
      timersRef.current.push(timer);
    }
  }, [xp, level, showRestart, triggerLevelUp, triggerRestart]);

  // Auto earn XP simulation
  useEffect(() => {
    const interval = setInterval(() => {
      if (showRestart || isRestartingRef.current) return;

      setIsAnswering(true);

      const earnTimeout = setTimeout(() => {
        if (isRestartingRef.current) return;

        const earnedXP = Math.floor(Math.random() * 30) + 20;

        setTargetXp((prev) => {
          if (isRestartingRef.current) return prev;
          return Math.min(prev + earnedXP, 2550);
        });
        setCombo((prev) => Math.min(prev + 1, 15));
        setIsAnswering(false);

        if (!showRestart && !isRestartingRef.current) {
          setNotification({ message: `+${earnedXP} XP`, type: "earned" });
          const clearTimer = setTimeout(() => {
            if (!isRestartingRef.current) {
              setNotification(null);
            }
          }, 1000);
          timersRef.current.push(clearTimer);
        }
      }, 800);
      timersRef.current.push(earnTimeout);
    }, 2500);

    return () => clearInterval(interval);
  }, [showRestart]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-2xl p-4 overflow-hidden border border-orange-100"
    >
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -15, 0], opacity: [0.2, 0.5, 0.2] }}
            transition={{
              duration: 2 + i * 0.3,
              repeat: Infinity,
              delay: i * 0.2,
            }}
            className="absolute"
            style={{ left: `${15 + i * 15}%`, top: `${30 + (i % 2) * 20}%` }}
          >
            <Sparkles className="w-3 h-3 text-amber-400/40" />
          </motion.div>
        ))}
      </div>

      {/* XP Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.8 }}
            className={`absolute top-3 right-3 px-3 py-1.5 rounded-full text-white text-xs font-bold z-40 flex items-center gap-1.5 ${
              notification.type === "levelup"
                ? "bg-gradient-to-r from-yellow-400 to-orange-500"
                : notification.type === "restart" ||
                  notification.type === "newjourney"
                ? "bg-gradient-to-r from-purple-500 to-pink-500"
                : "bg-gradient-to-r from-green-400 to-emerald-500"
            }`}
          >
            <Zap className="w-3 h-3" />
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Level Up Overlay */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-2xl"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }}
              className="text-center"
            >
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{
                    scale: [0, 1, 0],
                    x: Math.cos((i * 45 * Math.PI) / 180) * 60,
                    y: Math.sin((i * 45 * Math.PI) / 180) * 60,
                  }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className="absolute top-1/2 left-1/2"
                >
                  <Star className="w-4 h-4 text-yellow-400" />
                </motion.div>
              ))}

              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className={`w-16 h-16 rounded-full bg-gradient-to-r ${currentStage.color} p-0.5 mx-auto mb-2`}
              >
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <currentStage.icon className="w-8 h-8 text-orange-500" />
                </div>
              </motion.div>
              <div className="text-yellow-400 font-bold text-lg">LEVEL UP!</div>
              <div className="text-white font-bold">{currentStage.name}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Restart/Master Complete Overlay */}
      <AnimatePresence>
        {showRestart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-2xl"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="text-center relative"
            >
              {/* Confetti explosion */}
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ y: 0, opacity: 1, scale: 1 }}
                  animate={{
                    y: [-100 - i * 5],
                    x: [(i % 2 === 0 ? 1 : -1) * (20 + i * 8)],
                    opacity: [1, 1, 0],
                    rotate: [0, 720],
                    scale: [1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.05,
                    ease: "easeOut",
                  }}
                  className="absolute top-1/2 left-1/2"
                >
                  <span className="text-lg">
                    {["🎉", "⭐", "🏆", "✨", "🎊", "💎", "🌟", "🎯"][i % 8]}
                  </span>
                </motion.div>
              ))}

              {/* Trophy with glow effect */}
              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                  filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"],
                }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="relative"
              >
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="text-6xl mb-3"
                >
                  🏆
                </motion.div>
                {/* Glow ring */}
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="absolute inset-0 rounded-full bg-yellow-400/30 blur-xl"
                />
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-yellow-400 font-bold text-xl mb-1">
                  🎊 MASTER ACHIEVED! 🎊
                </div>
                <div className="text-white/90 text-sm mb-2">
                  Journey #{journeyCount} Complete!
                </div>
                <div className="text-white/70 text-xs mb-3">
                  Starting fresh adventure...
                </div>
              </motion.div>

              {/* Progress dots instead of spinner */}
              <div className="flex justify-center gap-1.5">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: [1, 1.5, 1],
                      backgroundColor: ["#fbbf24", "#f97316", "#fbbf24"],
                    }}
                    transition={{
                      duration: 0.6,
                      delay: i * 0.2,
                      repeat: Infinity,
                    }}
                    className="w-2 h-2 rounded-full bg-yellow-400"
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-md">
              <Gamepad2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-gray-800 font-bold text-sm">
                Gamified Assessment
              </h3>
              <p className="text-gray-500 text-[10px]">
                Play, Learn & Upgrade Yourself
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Journey counter */}
            {journeyCount > 1 && (
              <div className="flex items-center gap-1 bg-blue-100 px-2 py-1 rounded-full">
                <Rocket className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-blue-600 font-bold text-xs">
                  #{journeyCount}
                </span>
              </div>
            )}

            <motion.div
              key={badges}
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1 bg-purple-100 px-2 py-1 rounded-full"
            >
              <Medal className="w-3.5 h-3.5 text-purple-500" />
              <span className="text-purple-600 font-bold text-xs">
                {badges}
              </span>
            </motion.div>

            <motion.div
              animate={combo > 5 ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.3, repeat: combo > 5 ? Infinity : 0 }}
              className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                combo > 5
                  ? "bg-gradient-to-r from-orange-400 to-red-400 text-white"
                  : "bg-orange-100 text-orange-600"
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span className="font-bold text-xs">{combo}x</span>
            </motion.div>
          </div>
        </div>

        {/* XP Progress Section */}
        <div className="bg-white rounded-xl p-3 mb-3 shadow-sm border border-orange-50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <motion.div
                animate={isAnswering ? { rotate: [0, 10, -10, 0] } : {}}
                transition={{ duration: 0.3 }}
                className={`w-8 h-8 rounded-lg bg-gradient-to-br ${currentStage.color} flex items-center justify-center`}
              >
                <currentStage.icon className="w-4 h-4 text-white" />
              </motion.div>
              <div>
                <span className="text-gray-800 font-bold text-sm">
                  {currentStage.name}
                </span>
                <span className="text-gray-400 text-[10px] ml-1">
                  Lv.{level}
                </span>
              </div>
            </div>

            <div className="text-right">
              <motion.div
                key={xp}
                className="text-xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent"
              >
                {xp.toLocaleString()}
              </motion.div>
              <div className="text-gray-400 text-[10px]">
                / {currentStage.maxXp.toLocaleString()} XP
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              animate={{
                width: `${Math.min(Math.max(progressInLevel, 0), 100)}%`,
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className={`absolute inset-y-0 left-0 bg-gradient-to-r ${currentStage.color} rounded-full`}
            />
            <motion.div
              animate={{ x: ["-100%", "300%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="absolute inset-y-0 w-1/4 bg-gradient-to-r from-transparent via-white/50 to-transparent"
            />
          </div>

          <div className="flex justify-between mt-1">
            <span className="text-[9px] text-gray-400">
              {currentStage.minXp} XP
            </span>
            <span className="text-[9px] text-orange-500 font-medium">
              {Math.max(0, currentStage.maxXp - xp)} XP to next level
            </span>
            <span className="text-[9px] text-gray-400">
              {currentStage.maxXp} XP
            </span>
          </div>
        </div>

        {/* Stages Grid */}
        <div className="grid grid-cols-5 gap-1.5 mb-3">
          {STAGES.map((stage, i) => {
            const isUnlocked = i < level;
            const isCurrent = i === level - 1;

            return (
              <motion.div
                key={stage.name}
                whileHover={{ scale: isUnlocked ? 1.05 : 1 }}
                className={`relative rounded-lg p-1.5 text-center ${
                  isCurrent
                    ? `bg-gradient-to-br ${stage.color} shadow-md`
                    : isUnlocked
                    ? "bg-white border border-gray-100 shadow-sm"
                    : "bg-gray-100"
                }`}
              >
                <div
                  className={`w-7 h-7 mx-auto rounded-md flex items-center justify-center mb-0.5 ${
                    isCurrent
                      ? "bg-white/30"
                      : isUnlocked
                      ? `bg-gradient-to-br ${stage.color}`
                      : "bg-gray-200"
                  }`}
                >
                  {isUnlocked ? (
                    <stage.icon className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <Lock className="w-3 h-3 text-gray-400" />
                  )}
                </div>
                <div
                  className={`text-[8px] font-semibold ${
                    isCurrent
                      ? "text-white"
                      : isUnlocked
                      ? "text-gray-700"
                      : "text-gray-400"
                  }`}
                >
                  {stage.name}
                </div>

                {isUnlocked && (
                  <div
                    className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[7px] font-bold ${
                      isCurrent
                        ? "bg-white text-orange-500"
                        : "bg-orange-400 text-white"
                    }`}
                  >
                    {stage.badges}
                  </div>
                )}

                {isUnlocked && !isCurrent && (
                  <CheckCircle2 className="absolute -top-0.5 -left-0.5 w-3 h-3 text-green-500 bg-white rounded-full" />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-1.5">
          {[
            {
              icon: Target,
              value: "92%",
              label: "Accuracy",
              color: "from-green-400 to-emerald-500",
              bg: "bg-green-50",
            },
            {
              icon: Zap,
              value: xp.toLocaleString(),
              label: "XP",
              color: "from-yellow-400 to-amber-500",
              bg: "bg-amber-50",
            },
            {
              icon: Trophy,
              value: "#12",
              label: "Rank",
              color: "from-orange-400 to-red-500",
              bg: "bg-orange-50",
            },
            {
              icon: Medal,
              value: badges.toString(),
              label: "Badges",
              color: "from-purple-400 to-violet-500",
              bg: "bg-purple-50",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`${stat.bg} rounded-lg p-2 text-center`}
            >
              <div
                className={`w-6 h-6 mx-auto rounded-md bg-gradient-to-br ${stat.color} flex items-center justify-center mb-0.5`}
              >
                <stat.icon className="w-3 h-3 text-white" />
              </div>
              <div className="text-gray-800 font-bold text-xs">
                {stat.value}
              </div>
              <div className="text-gray-500 text-[8px]">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Pre-computed random values for animations (outside component to avoid re-computation)
const RIBBON_ANIMATIONS = Array.from({ length: 20 }, (_, i) => ({
  initialX: (i - 10) * 15,
  animateX: (i % 2 === 0 ? 1 : -1) * (30 + i * 3),
  color: [
    "bg-red-400",
    "bg-yellow-400",
    "bg-green-400",
    "bg-blue-400",
    "bg-purple-400",
    "bg-pink-400",
  ][i % 6],
}));

const CONFETTI_ANIMATIONS = Array.from({ length: 15 }, (_, i) => ({
  x: Math.cos((i * 24 * Math.PI) / 180) * 100,
  y: Math.sin((i * 24 * Math.PI) / 180) * 100,
  emoji: ["🎊", "✨", "⭐", "🌟", "💫"][i % 5],
}));

// Rewards Card - Enhanced with box opening animation
export function RewardsRedemptionCard() {
  const [diamonds, setDiamonds] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [earnedReward, setEarnedReward] = useState<{
    name: string;
    emoji: string;
  } | null>(null);
  const [sparkle, setSparkle] = useState(false);
  const [boxOpening, setBoxOpening] = useState(false);

  const rewards = useMemo(
    () => [
      { name: "Amazon", emoji: "🛒", diamonds: 100 },
      { name: "Swiggy", emoji: "🍔", diamonds: 80 },
      { name: "Spotify", emoji: "🎵", diamonds: 120 },
      { name: "Uber", emoji: "🚗", diamonds: 90 },
    ],
    []
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setDiamonds((prev) => {
        const next = prev + Math.floor(Math.random() * 5) + 3;
        if (next >= 100 && prev < 100) {
          setSparkle(true);
          setTimeout(() => setSparkle(false), 1000);
        }
        if (next > 150) {
          const randomReward =
            rewards[Math.floor(Math.random() * rewards.length)];
          setEarnedReward(randomReward);
          setBoxOpening(true);

          // Box opening animation sequence
          setTimeout(() => {
            setBoxOpening(false);
            setShowReward(true);
          }, 1500);

          setTimeout(() => {
            setShowReward(false);
            setEarnedReward(null);
          }, 4000);

          return 0;
        }
        return next;
      });
    }, 150);
    return () => clearInterval(interval);
  }, [rewards]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-gradient-to-br from-amber-400 via-orange-400 to-yellow-400 rounded-2xl p-4 relative overflow-hidden shadow-lg"
    >
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [-5, -60],
              x: [0, i % 2 === 0 ? 10 : -10],
              opacity: [0, 1, 0],
              rotate: [0, 360],
              scale: [0.5, 1, 0.5],
            }}
            transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
            className="absolute"
            style={{ left: `${10 + i * 12}%`, bottom: -5 }}
          >
            <Gem className="w-3 h-3 text-white/60" />
          </motion.div>
        ))}
      </div>

      {/* Box Opening Animation Overlay */}
      <AnimatePresence>
        {boxOpening && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-2xl"
          >
            <motion.div className="text-center relative">
              {/* Gift box */}
              <motion.div
                initial={{ scale: 0.5, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                className="relative"
              >
                {/* Box lid flying off */}
                <motion.div
                  initial={{ y: 0, rotate: 0 }}
                  animate={{
                    y: [-10, -80],
                    rotate: [0, -30],
                    opacity: [1, 0],
                  }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="absolute -top-2 left-1/2 -translate-x-1/2"
                >
                  <Package className="w-12 h-12 text-yellow-200" />
                </motion.div>

                {/* Main box shaking then opening */}
                <motion.div
                  animate={{
                    rotate: [0, -5, 5, -5, 5, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ duration: 0.5 }}
                  className="text-6xl"
                >
                  🎁
                </motion.div>

                {/* Sparkles bursting out */}
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, x: 0, y: 0 }}
                    animate={{
                      scale: [0, 1, 0],
                      x: Math.cos((i * 30 * Math.PI) / 180) * 80,
                      y: Math.sin((i * 30 * Math.PI) / 180) * 80 - 40,
                      opacity: [0, 1, 0],
                    }}
                    transition={{ duration: 1, delay: 0.6 + i * 0.05 }}
                    className="absolute top-1/2 left-1/2"
                  >
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-white font-bold text-lg mt-4"
              >
                Opening...
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reward Revealed Overlay */}
      <AnimatePresence>
        {showReward && earnedReward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-2xl overflow-hidden"
          >
            {/* Ribbons falling - using pre-computed values */}
            {RIBBON_ANIMATIONS.map((ribbon, i) => (
              <motion.div
                key={i}
                initial={{
                  y: -20,
                  x: ribbon.initialX,
                  opacity: 0,
                  rotate: 0,
                }}
                animate={{
                  y: [0, 300],
                  x: [ribbon.initialX, ribbon.initialX + ribbon.animateX],
                  opacity: [0, 1, 1, 0],
                  rotate: [0, 360 * (i % 2 === 0 ? 1 : -1)],
                }}
                transition={{
                  duration: 2.5,
                  delay: i * 0.1,
                  ease: "easeOut",
                }}
                className="absolute top-0"
                style={{ left: `${5 + i * 5}%` }}
              >
                <div className={`w-2 h-8 rounded-full ${ribbon.color}`} />
              </motion.div>
            ))}

            {/* Confetti explosion - using pre-computed values */}
            {CONFETTI_ANIMATIONS.map((confetti, i) => (
              <motion.div
                key={`confetti-${i}`}
                initial={{ scale: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  x: confetti.x,
                  y: confetti.y,
                  rotate: [0, 360],
                }}
                transition={{ duration: 1.5, delay: 0.2 }}
                className="absolute top-1/2 left-1/2"
              >
                <span className="text-xl">{confetti.emoji}</span>
              </motion.div>
            ))}

            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", damping: 10 }}
              className="text-center relative z-10"
            >
              {/* Glow effect */}
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="absolute inset-0 bg-yellow-400 rounded-full blur-3xl"
              />

              <motion.div
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: 3 }}
                className="relative"
              >
                <div className="text-5xl mb-2">{earnedReward.emoji}</div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.3, repeat: Infinity }}
                  className="absolute -top-2 -right-2"
                >
                  <PartyPopper className="w-6 h-6 text-yellow-300" />
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-white font-bold text-lg">
                  🎉 Reward Unlocked! 🎉
                </div>
                <div className="text-yellow-200 text-base font-semibold">
                  {earnedReward.name} Voucher
                </div>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="text-white/80 text-xs mt-1"
                >
                  Added to your rewards! 🎁
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <motion.div
              animate={
                sparkle ? { rotate: [0, 20, -20, 0], scale: [1, 1.2, 1] } : {}
              }
              className="w-8 h-8 rounded-lg bg-white/30 flex items-center justify-center"
            >
              <Gift className="w-4 h-4 text-white" />
            </motion.div>
            <div>
              <span className="text-white font-bold text-base">
                Learn & Earn
              </span>
              <p className="text-white/90 text-[10px]">
                Upgrade yourself & earn rewards
              </p>
            </div>
          </div>

          <motion.div
            animate={
              sparkle
                ? { scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }
                : { scale: [1, 1.02, 1] }
            }
            transition={{
              duration: sparkle ? 0.5 : 1,
              repeat: sparkle ? 3 : Infinity,
            }}
            className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-full shadow-lg"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Gem className="w-4 h-4 text-amber-500" />
            </motion.div>
            <span className="text-amber-600 font-bold text-base">
              {diamonds}
            </span>
            {diamonds >= 80 && (
              <motion.span
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-green-500 text-xs"
              >
                🔥
              </motion.span>
            )}
          </motion.div>
        </div>

        {/* Message */}
        <div className="bg-white/25 backdrop-blur-sm rounded-xl p-3 mb-3 border border-white/40">
          <p className="text-white text-xs leading-relaxed text-center">
            <span className="font-bold text-sm">
              💎 Collect gems for every milestone
            </span>
            <br />
            <span className="text-white/95">
              and unlock exciting rewards! The more you grow, the more you earn.
            </span>
          </p>
        </div>

        {/* Progress */}
        <div className="bg-white/20 rounded-full h-2 mb-3 overflow-hidden">
          <motion.div
            animate={{ width: `${Math.min((diamonds / 100) * 100, 100)}%` }}
            className="h-full bg-white rounded-full"
          />
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {rewards.map((reward, i) => (
            <motion.div
              key={reward.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.08, y: -3 }}
              className={`bg-white rounded-xl p-2 text-center cursor-pointer shadow-md relative ${
                diamonds >= reward.diamonds ? "ring-2 ring-yellow-300" : ""
              }`}
            >
              {diamonds >= reward.diamonds && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center"
                >
                  <CheckCircle2 className="w-3 h-3 text-white" />
                </motion.div>
              )}
              <div className="text-xl mb-0.5">{reward.emoji}</div>
              <div className="text-gray-800 font-bold text-[10px]">
                {reward.name}
              </div>
              <div className="flex items-center justify-center gap-0.5">
                <Gem className="w-3 h-3 text-amber-500" />
                <span className="text-amber-600 text-[10px] font-bold">
                  {reward.diamonds}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Micro Learning Card - Enhanced with more descriptive text
export function MicroLearningCard() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [secondsWatched, setSecondsWatched] = useState(0);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 0.8;
        });
        setSecondsWatched((prev) => Math.min(prev + 1, 120));
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  useEffect(() => {
    const autoPlay = setInterval(() => {
      setIsPlaying(true);
      setSecondsWatched(0);
    }, 8000);
    return () => clearInterval(autoPlay);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl p-4 relative overflow-hidden border border-gray-100 shadow-sm"
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <motion.div
              animate={isPlaying ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center shadow-md"
            >
              <Video className="w-4 h-4 text-white" />
            </motion.div>
            <h3 className="text-gray-800 font-bold text-base">
              Micro Learning
            </h3>
          </div>

          {/* Enhanced 2 min badge with more context */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-1.5 bg-gradient-to-r from-orange-100 to-amber-100 px-3 py-1.5 rounded-full border border-orange-200"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <Timer className="w-3.5 h-3.5 text-orange-500" />
            </motion.div>
            <div className="flex flex-col items-start">
              <span className="text-orange-600 font-bold text-xs leading-none">
                2 min
              </span>
              <span className="text-orange-500/80 text-[8px] leading-none">
                Quick Learn
              </span>
            </div>
          </motion.div>
        </div>

        {/* Enhanced Message with Upgrade Yourself */}
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-3 mb-3 border border-orange-100">
          <div className="flex items-start gap-2.5">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-xl flex-shrink-0"
            >
              ⏱️
            </motion.div>
            <div>
              <p className="text-gray-800 text-sm font-bold leading-relaxed mb-1">
                Trade 120 seconds for real skills.
              </p>
              <p className="text-gray-600 text-xs leading-relaxed mb-2">
                No pressure. Just progress. Our bite-sized lessons fit your busy
                schedule — learn anywhere, anytime.
              </p>
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="flex items-center gap-1 bg-gradient-to-r from-orange-400 to-amber-400 text-white text-[10px] font-bold px-2 py-1 rounded-full"
                >
                  <Rocket className="w-3 h-3" />
                  Upgrade Yourself
                </motion.div>
                <span className="text-gray-400 text-[10px]">•</span>
                <span className="text-gray-500 text-[10px]">
                  Skill up daily
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mini Player */}
        <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-3 mb-3">
          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => setIsPlaying(!isPlaying)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center shadow-lg"
            >
              {isPlaying ? (
                <PauseCircle className="w-5 h-5 text-white" />
              ) : (
                <PlayCircle className="w-5 h-5 text-white" />
              )}
            </motion.button>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-white text-xs font-medium">
                  Leadership Essentials
                </span>
                <span className="text-gray-400 text-[10px]">
                  {Math.floor(secondsWatched / 60)}:
                  {(secondsWatched % 60).toString().padStart(2, "0")} / 2:00
                </span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-gradient-to-r from-orange-400 to-pink-500 rounded-full"
                />
              </div>
            </div>
          </div>

          {isPlaying && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute top-1.5 right-1.5 flex items-center gap-1 bg-red-500 px-2 py-0.5 rounded text-[9px] text-white font-bold"
            >
              <span className="w-1.5 h-1.5 bg-white rounded-full" />
              LIVE
            </motion.div>
          )}

          {/* 2 min indicator on player */}
          <div className="absolute bottom-1.5 right-1.5 flex items-center gap-1 bg-white/10 px-1.5 py-0.5 rounded text-[8px] text-white/70">
            <Timer className="w-2.5 h-2.5" />
            <span>2 min lesson</span>
          </div>
        </div>

        {/* Topics with Upgrade badge */}
        <div className="flex gap-2 flex-wrap items-center">
          {["Leadership", "Communication", "Decision Making"].map(
            (topic, i) => (
              <motion.span
                key={topic}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="bg-gradient-to-r from-orange-100 to-amber-100 text-orange-600 text-[10px] px-2.5 py-1 rounded-full font-semibold"
              >
                {topic}
              </motion.span>
            )
          )}
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-600 text-[10px] px-2.5 py-1 rounded-full font-semibold flex items-center gap-1"
          >
            <TrendingUp className="w-3 h-3" />
            +15% Growth
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
}
