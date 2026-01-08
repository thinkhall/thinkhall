"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Zap,
  Target,
  Trophy,
  Crown,
  Gamepad2,
  Star,
  TrendingUp,
  Video,
  PlayCircle,
  PauseCircle,
  Lock,
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
  LucideIcon,
} from "lucide-react";

// Constants
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

const LEVEL_UNLOCKS = [
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

const MANAGER_BADGES = [
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

const getLevelFromXp = (xp: number) =>
  STAGES.findIndex((s, i) => xp < s.maxXp || i === STAGES.length - 1) + 1;
const arr = (n: number) => [...Array(n)];

// Reusable Components
const IconBox = ({
  icon: Icon,
  className,
  iconClass = "w-4 h-4 text-white",
}: {
  icon: LucideIcon;
  className: string;
  iconClass?: string;
}) => (
  <div className={`flex items-center justify-center ${className}`}>
    <Icon className={iconClass} />
  </div>
);

const Card = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className={className}
  >
    {children}
  </motion.div>
);

// Main Grid
export function FeaturesBentoGrid() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
      <div className="lg:col-span-2">
        <GamifiedAssessmentCard />
      </div>
      <div className="lg:col-span-1">
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
  return (
    <Card className="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 rounded-2xl p-4 relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-white" />
            <h3 className="text-white font-bold text-sm">Level Up & Unlock</h3>
          </div>
          <div className="bg-white px-2.5 py-0.5 rounded-full">
            <span className="text-orange-500 font-bold text-xs">Level 3</span>
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {LEVEL_UNLOCKS.map((item) => (
            <motion.div
              key={item.level}
              whileHover={{ scale: item.unlocked ? 1.02 : 1 }}
              className={`flex-shrink-0 w-24 rounded-xl p-2 text-center ${
                item.unlocked ? "bg-white shadow-md" : "bg-white/20"
              }`}
            >
              <IconBox
                icon={item.unlocked ? item.icon : Lock}
                className={`w-8 h-8 mx-auto rounded-lg mb-1 ${
                  item.unlocked
                    ? "bg-gradient-to-br from-amber-400 to-orange-500"
                    : "bg-white/30"
                }`}
                iconClass={
                  item.unlocked ? "w-4 h-4 text-white" : "w-3 h-3 text-white/70"
                }
              />
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
    </Card>
  );
}

// Manager Badges Card
function ManagerBadgesCard() {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <Card className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <IconBox
          icon={GraduationCap}
          className="w-7 h-7 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500"
          iconClass="w-3.5 h-3.5 text-white"
        />
        <h3 className="text-gray-800 font-bold text-sm">Manager Badges</h3>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {MANAGER_BADGES.map((badge, i) => (
          <motion.div
            key={badge.name}
            onHoverStart={() => setHovered(i)}
            onHoverEnd={() => setHovered(null)}
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
              {hovered === i && (
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
    </Card>
  );
}

// Gamified Assessment Card
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

  const level = getLevelFromXp(xp);
  const stage = STAGES[Math.min(level - 1, 4)];
  const progress = ((xp - stage.minXp) / (stage.maxXp - stage.minXp)) * 100;

  const showNotif = useCallback(
    (message: string, type: string, duration = 2000) => {
      setNotification({ message, type });
      setTimeout(() => setNotification(null), duration);
    },
    []
  );

  const triggerLevelUp = useCallback(
    (lvl: number) => {
      setShowLevelUp(true);
      showNotif(`🎉 Level ${lvl} Unlocked!`, "levelup");
      setTimeout(() => setShowLevelUp(false), 2000);
    },
    [showNotif]
  );

  const triggerRestart = useCallback(() => {
    isRestartingRef.current = true;
    setShowRestart(true);
    showNotif("🏆 Master Complete!", "restart");
    setTimeout(() => {
      setXp(0);
      setTargetXp(0);
      setCombo(0);
      setShowLevelUp(false);
      setShowRestart(false);
      setIsAnswering(false);
      setJourneyCount((p) => p + 1);
      prevLevelRef.current = 1;
      isRestartingRef.current = false;
      showNotif("🚀 New Journey Begins!", "newjourney");
    }, 3000);
  }, [showNotif]);

  useEffect(() => {
    if (xp < targetXp && !isRestartingRef.current) {
      const t = setTimeout(
        () =>
          setXp((p) =>
            Math.min(
              p + Math.max(1, Math.floor((targetXp - xp) / 20)),
              targetXp
            )
          ),
        30
      );
      return () => clearTimeout(t);
    }
  }, [xp, targetXp]);

  useEffect(() => {
    if (isRestartingRef.current || showRestart) return;
    if (level > prevLevelRef.current && prevLevelRef.current < 5) {
      prevLevelRef.current = level;
      const t = setTimeout(() => triggerLevelUp(level), 0);
      return () => clearTimeout(t);
    }
    if (xp >= 2500 && level === 5 && !isRestartingRef.current) {
      prevLevelRef.current = level;
      const t = setTimeout(() => triggerRestart(), 0);
      return () => clearTimeout(t);
    }
  }, [xp, level, showRestart, triggerLevelUp, triggerRestart]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (showRestart || isRestartingRef.current) return;
      setIsAnswering(true);
      setTimeout(() => {
        if (isRestartingRef.current) return;
        const earned = Math.floor(Math.random() * 30) + 20;
        setTargetXp((p) =>
          isRestartingRef.current ? p : Math.min(p + earned, 2550)
        );
        setCombo((p) => Math.min(p + 1, 15));
        setIsAnswering(false);
        if (!showRestart && !isRestartingRef.current)
          showNotif(`+${earned} XP`, "earned", 1000);
      }, 800);
    }, 2500);
    return () => clearInterval(interval);
  }, [showRestart, showNotif]);

  const stats = [
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
      value: stage.badges.toString(),
      label: "Badges",
      color: "from-purple-400 to-violet-500",
      bg: "bg-purple-50",
    },
  ];

  return (
    <Card className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-2xl p-4 overflow-hidden border border-orange-100">
      {/* Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {arr(6).map((_, i) => (
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

      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.8 }}
            className={`absolute top-3 right-3 px-3 py-1.5 rounded-full text-white text-xs font-bold z-40 flex items-center gap-1.5 bg-gradient-to-r ${
              notification.type === "levelup"
                ? "from-yellow-400 to-orange-500"
                : ["restart", "newjourney"].includes(notification.type)
                ? "from-purple-500 to-pink-500"
                : "from-green-400 to-emerald-500"
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
              {arr(8).map((_, i) => (
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
                className={`w-16 h-16 rounded-full bg-gradient-to-r ${stage.color} p-0.5 mx-auto mb-2`}
              >
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <stage.icon className="w-8 h-8 text-orange-500" />
                </div>
              </motion.div>
              <div className="text-yellow-400 font-bold text-lg">LEVEL UP!</div>
              <div className="text-white font-bold">{stage.name}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Restart Overlay */}
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
              {arr(20).map((_, i) => (
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
                  transition={{ duration: 2, delay: i * 0.05, ease: "easeOut" }}
                  className="absolute top-1/2 left-1/2"
                >
                  <span className="text-lg">
                    {["🎉", "⭐", "🏆", "✨", "🎊", "💎", "🌟", "🎯"][i % 8]}
                  </span>
                </motion.div>
              ))}
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="text-6xl mb-3"
                >
                  🏆
                </motion.div>
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
              <div className="flex justify-center gap-1.5">
                {arr(3).map((_, i) => (
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
            <IconBox
              icon={Gamepad2}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 shadow-md"
              iconClass="w-5 h-5 text-white"
            />
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
            {journeyCount > 1 && (
              <div className="flex items-center gap-1 bg-blue-100 px-2 py-1 rounded-full">
                <Rocket className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-blue-600 font-bold text-xs">
                  #{journeyCount}
                </span>
              </div>
            )}
            <motion.div
              key={stage.badges}
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1 bg-purple-100 px-2 py-1 rounded-full"
            >
              <Medal className="w-3.5 h-3.5 text-purple-500" />
              <span className="text-purple-600 font-bold text-xs">
                {stage.badges}
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

        {/* XP Progress */}
        <div className="bg-white rounded-xl p-3 mb-3 shadow-sm border border-orange-50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <motion.div
                animate={isAnswering ? { rotate: [0, 10, -10, 0] } : {}}
                transition={{ duration: 0.3 }}
                className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stage.color} flex items-center justify-center`}
              >
                <stage.icon className="w-4 h-4 text-white" />
              </motion.div>
              <div>
                <span className="text-gray-800 font-bold text-sm">
                  {stage.name}
                </span>
                <span className="text-gray-400 text-[10px] ml-1">
                  Lv.{level}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                {xp.toLocaleString()}
              </div>
              <div className="text-gray-400 text-[10px]">
                / {stage.maxXp.toLocaleString()} XP
              </div>
            </div>
          </div>
          <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
              transition={{ duration: 0.5 }}
              className={`absolute inset-y-0 left-0 bg-gradient-to-r ${stage.color} rounded-full`}
            />
            <motion.div
              animate={{ x: ["-100%", "300%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="absolute inset-y-0 w-1/4 bg-gradient-to-r from-transparent via-white/50 to-transparent"
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[9px] text-gray-400">{stage.minXp} XP</span>
            <span className="text-[9px] text-orange-500 font-medium">
              {Math.max(0, stage.maxXp - xp)} XP to next level
            </span>
            <span className="text-[9px] text-gray-400">{stage.maxXp} XP</span>
          </div>
        </div>

        {/* Stages Grid */}
        <div className="grid grid-cols-5 gap-1.5 mb-3">
          {STAGES.map((s, i) => {
            const unlocked = i < level,
              current = i === level - 1;
            return (
              <motion.div
                key={s.name}
                whileHover={{ scale: unlocked ? 1.05 : 1 }}
                className={`relative rounded-lg p-1.5 text-center ${
                  current
                    ? `bg-gradient-to-br ${s.color} shadow-md`
                    : unlocked
                    ? "bg-white border border-gray-100 shadow-sm"
                    : "bg-gray-100"
                }`}
              >
                <div
                  className={`w-7 h-7 mx-auto rounded-md flex items-center justify-center mb-0.5 ${
                    current
                      ? "bg-white/30"
                      : unlocked
                      ? `bg-gradient-to-br ${s.color}`
                      : "bg-gray-200"
                  }`}
                >
                  {unlocked ? (
                    <s.icon className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <Lock className="w-3 h-3 text-gray-400" />
                  )}
                </div>
                <div
                  className={`text-[8px] font-semibold ${
                    current
                      ? "text-white"
                      : unlocked
                      ? "text-gray-700"
                      : "text-gray-400"
                  }`}
                >
                  {s.name}
                </div>
                {unlocked && (
                  <div
                    className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[7px] font-bold ${
                      current
                        ? "bg-white text-orange-500"
                        : "bg-orange-400 text-white"
                    }`}
                  >
                    {s.badges}
                  </div>
                )}
                {unlocked && !current && (
                  <CheckCircle2 className="absolute -top-0.5 -left-0.5 w-3 h-3 text-green-500 bg-white rounded-full" />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-1.5">
          {stats.map((s) => (
            <div key={s.label} className={`${s.bg} rounded-lg p-2 text-center`}>
              <IconBox
                icon={s.icon}
                className={`w-6 h-6 mx-auto rounded-md bg-gradient-to-br ${s.color} mb-0.5`}
                iconClass="w-3 h-3 text-white"
              />
              <div className="text-gray-800 font-bold text-xs">{s.value}</div>
              <div className="text-gray-500 text-[8px]">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

// Micro Learning Card
export function MicroLearningCard() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          setIsPlaying(false);
          return 0;
        }
        return p + 0.8;
      });
      setSeconds((p) => Math.min(p + 1, 120));
    }, 50);
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsPlaying(true);
      setSeconds(0);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const topics = ["Leadership", "Communication", "Decision Making"];

  return (
    <Card className="bg-white rounded-2xl p-4 relative overflow-hidden border border-gray-100 shadow-sm">
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
                  {Math.floor(seconds / 60)}:
                  {(seconds % 60).toString().padStart(2, "0")} / 2:00
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
          <div className="absolute bottom-1.5 right-1.5 flex items-center gap-1 bg-white/10 px-1.5 py-0.5 rounded text-[8px] text-white/70">
            <Timer className="w-2.5 h-2.5" />
            <span>2 min lesson</span>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap items-center">
          {topics.map((t, i) => (
            <motion.span
              key={t}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-gradient-to-r from-orange-100 to-amber-100 text-orange-600 text-[10px] px-2.5 py-1 rounded-full font-semibold"
            >
              {t}
            </motion.span>
          ))}
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
    </Card>
  );
}
