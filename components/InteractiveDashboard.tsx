"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Lock,
  User,
  Users,
  Flame,
  Gem,
  BookOpen,
  Clock,
  Medal,
  Target,
  CheckCircle2,
  Trophy,
  Play,
  TrendingUp,
  Activity,
  Filter,
  Download,
  Bell,
  Settings,
  Search,
  ChevronRight,
  Zap,
  BarChart3,
  MessageSquare,
  ArrowUpRight,
  MoreHorizontal,
  Plus,
  X,
  Star,
  Award,
  Crown,
  Shield,
  Rocket,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";
import { SKILLS_DATA, LEARNER_DATA, MANAGER_DATA } from "@/lib/constants";

// Skill Gap Data for Team Members
const TEAM_SKILL_GAPS = [
  {
    skill: "Leadership",
    lacking: [
      { name: "Emma Wilson", level: 45, gap: 55 },
      { name: "James Chen", level: 52, gap: 48 },
    ],
    color: "#ef4444",
  },
  {
    skill: "Data Analysis",
    lacking: [
      { name: "Sarah Miller", level: 38, gap: 62 },
      { name: "Mike Johnson", level: 41, gap: 59 },
      { name: "Lisa Park", level: 48, gap: 52 },
    ],
    color: "#f97316",
  },
  {
    skill: "Communication",
    lacking: [{ name: "David Brown", level: 55, gap: 45 }],
    color: "#eab308",
  },
  {
    skill: "Technical Skills",
    lacking: [
      { name: "Anna Lee", level: 42, gap: 58 },
      { name: "Tom Harris", level: 50, gap: 50 },
    ],
    color: "#8b5cf6",
  },
  {
    skill: "Problem Solving",
    lacking: [{ name: "Chris Davis", level: 47, gap: 53 }],
    color: "#3b82f6",
  },
];

// Compact Radar/Spider Chart Component for Skills
const SkillRadarChart = ({
  skills,
  size = 200,
}: {
  skills: typeof SKILLS_DATA;
  size?: number;
}) => {
  const center = size / 2;
  const maxRadius = size / 2 - 30;
  const levels = 4;
  const angleStep = (2 * Math.PI) / skills.length;

  const getPoint = (index: number, value: number) => {
    const angle = angleStep * index - Math.PI / 2;
    const radius = (value / 100) * maxRadius;
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  };

  const polygonPoints = skills
    .map((skill, i) => {
      const point = getPoint(i, skill.value);
      return `${point.x},${point.y}`;
    })
    .join(" ");

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="overflow-visible">
        {[...Array(levels)].map((_, i) => (
          <circle
            key={i}
            cx={center}
            cy={center}
            r={(maxRadius / levels) * (i + 1)}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
        ))}

        {skills.map((_, i) => {
          const angle = angleStep * i - Math.PI / 2;
          const endX = center + maxRadius * Math.cos(angle);
          const endY = center + maxRadius * Math.sin(angle);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={endX}
              y2={endY}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          );
        })}

        <motion.polygon
          points={polygonPoints}
          fill="url(#skillGradient)"
          fillOpacity="0.3"
          stroke="url(#skillStroke)"
          strokeWidth="2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />

        <defs>
          <linearGradient
            id="skillGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
          <linearGradient id="skillStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>
        </defs>

        {skills.map((skill, i) => {
          const point = getPoint(i, skill.value);
          return (
            <motion.circle
              key={skill.name}
              cx={point.x}
              cy={point.y}
              r="4"
              fill={skill.color}
              stroke="white"
              strokeWidth="2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
            />
          );
        })}

        {skills.map((skill, i) => {
          const angle = angleStep * i - Math.PI / 2;
          const labelRadius = maxRadius + 18;
          const x = center + labelRadius * Math.cos(angle);
          const y = center + labelRadius * Math.sin(angle);
          return (
            <text
              key={`label-${skill.name}`}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-[10px] font-medium fill-gray-600"
            >
              {skill.value}%
            </text>
          );
        })}
      </svg>
    </div>
  );
};

// Skill Gap Chart Component - Shows who's lacking where
const SkillGapChart = () => {
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      {TEAM_SKILL_GAPS.map((skillGap, i) => (
        <motion.div
          key={skillGap.skill}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08 }}
          className="bg-gray-50 rounded-lg overflow-hidden"
        >
          <button
            onClick={() =>
              setExpandedSkill(
                expandedSkill === skillGap.skill ? null : skillGap.skill
              )
            }
            className="w-full p-2.5 flex items-center justify-between hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: skillGap.color }}
              />
              <span className="text-xs font-medium text-gray-700">
                {skillGap.skill}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-red-50 text-red-600 px-1.5 py-0.5 rounded text-[10px] font-medium">
                <AlertTriangle className="w-3 h-3" />
                {skillGap.lacking.length}
              </div>
              <ChevronDown
                className={`w-3 h-3 text-gray-400 transition-transform ${
                  expandedSkill === skillGap.skill ? "rotate-180" : ""
                }`}
              />
            </div>
          </button>

          <AnimatePresence>
            {expandedSkill === skillGap.skill && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-2.5 pb-2.5 space-y-1.5">
                  {skillGap.lacking.map((member, j) => (
                    <div
                      key={member.name}
                      className="flex items-center gap-2 p-2 bg-white rounded-md border border-gray-100"
                    >
                      <div className="w-6 h-6 rounded-md bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center text-white text-[9px] font-bold">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-medium text-gray-700 truncate">
                          {member.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ backgroundColor: skillGap.color }}
                              initial={{ width: 0 }}
                              animate={{ width: `${member.level}%` }}
                              transition={{ duration: 0.5, delay: j * 0.1 }}
                            />
                          </div>
                          <span className="text-[9px] font-medium text-gray-500">
                            {member.level}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
};

// Compact Badge Component - Smaller version
const BadgeCardCompact = ({
  icon: Icon,
  name,
  earned,
  color,
}: {
  icon: React.ElementType;
  name: string;
  earned: boolean;
  color: string;
}) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
      earned
        ? "border-gray-200 bg-white hover:shadow-sm"
        : "border-dashed border-gray-200 bg-gray-50 opacity-40"
    }`}
  >
    <div className="flex items-center gap-1.5">
      <div
        className={`w-6 h-6 rounded-md flex items-center justify-center ${
          earned ? `bg-${color}-100` : "bg-gray-100"
        }`}
      >
        <Icon
          className={`w-3 h-3 ${
            earned ? `text-${color}-600` : "text-gray-400"
          }`}
        />
      </div>
      <span
        className={`text-[9px] font-medium truncate ${
          earned ? "text-gray-700" : "text-gray-400"
        }`}
      >
        {name}
      </span>
    </div>
  </motion.div>
);

// Compact Progress Ring
const ProgressRing = ({
  value,
  size = 70,
  strokeWidth = 6,
  color = "#f59e0b",
  label,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#f3f4f6"
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-gray-900">{value}%</span>
        </div>
      </div>
      {label && (
        <span className="text-[10px] text-gray-500 mt-1.5">{label}</span>
      )}
    </div>
  );
};

export default function InteractiveDashboard() {
  const [activeView, setActiveView] = useState<"learner" | "manager">(
    "learner"
  );
  const [selectedMember, setSelectedMember] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");

  const badges = [
    { icon: Flame, name: "Streak Master", earned: true, color: "orange" },
    { icon: Star, name: "Quick Learner", earned: true, color: "yellow" },
    { icon: Trophy, name: "Top Performer", earned: true, color: "purple" },
    { icon: Award, name: "First Steps", earned: true, color: "blue" },
    { icon: Crown, name: "Champion", earned: false, color: "yellow" },
    { icon: Rocket, name: "Fast Track", earned: true, color: "red" },
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const renderLearnerDashboard = () => (
    <div className="p-4 sm:p-5">
      <div className="grid grid-cols-12 gap-4">
        {/* Left Main Content */}
        <div className="col-span-12 lg:col-span-9 space-y-4">
          {/* Greeting + Quick Stats */}
          <div className="grid grid-cols-12 gap-4">
            {/* Greeting */}
            <div className="col-span-12 sm:col-span-5 bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white text-base font-bold shadow-lg shadow-yellow-400/20">
                  {LEARNER_DATA.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">
                    {getGreeting()}, {LEARNER_DATA.name.split(" ")[0]}!
                  </h2>
                  <p className="text-sm text-gray-500">
                    Level {LEARNER_DATA.level} Learner
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="col-span-12 sm:col-span-7 grid grid-cols-4 gap-3">
              <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-3 text-white">
                <Flame className="w-4 h-4 mb-1.5" />
                <p className="text-xl font-bold">{LEARNER_DATA.streak}</p>
                <p className="text-[11px] opacity-80">Streak</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl p-3 text-white">
                <Gem className="w-4 h-4 mb-1.5" />
                <p className="text-xl font-bold">
                  {(LEARNER_DATA.xp / 1000).toFixed(1)}k
                </p>
                <p className="text-[11px] opacity-80">XP</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-3 text-white">
                <Medal className="w-4 h-4 mb-1.5" />
                <p className="text-xl font-bold">{LEARNER_DATA.badges}</p>
                <p className="text-[11px] opacity-80">Badges</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-3 text-white">
                <BookOpen className="w-4 h-4 mb-1.5" />
                <p className="text-xl font-bold">
                  {LEARNER_DATA.completedCourses}
                </p>
                <p className="text-[11px] opacity-80">Courses</p>
              </div>
            </div>
          </div>

          {/* Skill Radar & Progress Overview */}
          <div className="grid grid-cols-12 gap-4">
            {/* Skill Radar */}
            <div className="col-span-12 sm:col-span-6 bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-900">
                  Skills Overview
                </h3>
                <button className="text-[11px] text-yellow-600 font-medium hover:underline">
                  View All
                </button>
              </div>
              <div className="flex justify-center">
                <SkillRadarChart skills={SKILLS_DATA} size={200} />
              </div>
            </div>

            {/* Progress Overview */}
            <div className="col-span-12 sm:col-span-6 bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-900">
                  Progress Overview
                </h3>
                <button className="text-[11px] text-yellow-600 font-medium hover:underline">
                  Details
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="flex justify-center">
                  <ProgressRing value={87} color="#10b981" label="Overall" />
                </div>
                <div className="flex justify-center">
                  <ProgressRing value={92} color="#8b5cf6" label="Quiz Avg" />
                </div>
                <div className="flex justify-center">
                  <ProgressRing value={78} color="#f59e0b" label="Weekly" />
                </div>
                <div className="flex justify-center">
                  <ProgressRing value={95} color="#3b82f6" label="Engagement" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Badges Collection + Recent Activity */}
        <div className="col-span-12 lg:col-span-3 space-y-3">
          {/* Badges Collection - Compact with scroll */}
          <div className="bg-white rounded-xl border border-gray-200 p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-yellow-600" />
                <h3 className="text-xs font-bold text-gray-900">Badges</h3>
              </div>
              <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">
                {badges.filter((b) => b.earned).length}/{badges.length}
              </span>
            </div>
            <div className="max-h-[100px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
              <div className="grid grid-cols-2 gap-1.5">
                {badges.map((badge) => (
                  <BadgeCardCompact key={badge.name} {...badge} />
                ))}
              </div>
            </div>
            <button className="w-full mt-2 py-1.5 text-[10px] text-yellow-600 hover:text-yellow-700 font-medium flex items-center justify-center gap-1 hover:bg-yellow-50 rounded-lg transition-colors">
              View All Badges <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-gray-200 p-3">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-gray-600" />
                <h3 className="text-xs font-bold text-gray-900">
                  Recent Activity
                </h3>
              </div>
            </div>
            <div className="space-y-2">
              {LEARNER_DATA.recentActivity.slice(0, 5).map((activity, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${
                      activity.action === "Completed"
                        ? "bg-green-100"
                        : activity.action === "Earned"
                        ? "bg-purple-100"
                        : "bg-blue-100"
                    }`}
                  >
                    {activity.action === "Completed" ? (
                      <CheckCircle2 className="w-3 h-3 text-green-600" />
                    ) : activity.action === "Earned" ? (
                      <Trophy className="w-3 h-3 text-purple-600" />
                    ) : (
                      <Play className="w-3 h-3 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-medium text-gray-900 truncate">
                      {activity.item}
                    </p>
                    <p className="text-[9px] text-gray-500">{activity.time}</p>
                  </div>
                  <div className="flex items-center gap-0.5 text-yellow-600 bg-yellow-50 px-1 py-0.5 rounded text-[9px] font-bold flex-shrink-0">
                    <Gem className="w-2.5 h-2.5" />+{activity.xp}
                  </div>
                </motion.div>
              ))}
            </div>
            <button className="w-full mt-2 py-1.5 text-[10px] text-gray-500 hover:text-gray-700 font-medium flex items-center justify-center gap-1 hover:bg-gray-50 rounded-lg transition-colors">
              View All <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderManagerDashboard = () => (
    <div className="p-4 sm:p-5">
      <div className="grid grid-cols-12 gap-4">
        {/* Left Main Content */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-white rounded-xl border border-gray-200 p-3.5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              <p className="text-xl font-bold text-gray-900">
                {MANAGER_DATA.teamSize}
              </p>
              <p className="text-[11px] text-gray-500">Team Size</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-3.5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
              </div>
              <p className="text-xl font-bold text-gray-900">
                {MANAGER_DATA.avgCompletion}%
              </p>
              <p className="text-[11px] text-gray-500">Completion</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-3.5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Target className="w-4 h-4 text-purple-600" />
                </div>
              </div>
              <p className="text-xl font-bold text-gray-900">
                {MANAGER_DATA.avgScore}%
              </p>
              <p className="text-[11px] text-gray-500">Avg Score</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-3.5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-orange-600" />
                </div>
              </div>
              <p className="text-xl font-bold text-gray-900">
                {MANAGER_DATA.activeToday}
              </p>
              <p className="text-[11px] text-gray-500">Active Today</p>
            </div>
          </div>

          {/* Team Performance */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900">
                Team Performance
              </h3>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400/50 w-32"
                  />
                </div>
                <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                  <Filter className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                  <Download className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
            <div className="space-y-2">
              {MANAGER_DATA.teamMembers
                .filter((m) =>
                  m.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .slice(0, 5)
                .map((member, i) => (
                  <motion.div
                    key={member.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() =>
                      setSelectedMember(selectedMember === i ? null : i)
                    }
                    className={`p-3 rounded-xl border-2 transition-all cursor-pointer ${
                      selectedMember === i
                        ? "border-yellow-400 bg-yellow-50"
                        : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white text-xs font-bold">
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div
                            className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${
                              member.status === "active"
                                ? "bg-green-500"
                                : "bg-gray-300"
                            }`}
                          />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {member.name}
                          </p>
                          <p className="text-[11px] text-gray-500">
                            {member.role}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-base font-bold text-gray-900">
                            {member.score}%
                          </p>
                          <p className="text-[10px] text-gray-500">Score</p>
                        </div>
                        <div className="w-20">
                          <div className="flex items-center justify-between text-[10px] mb-1">
                            <span className="text-gray-500">Progress</span>
                            <span className="font-medium">
                              {member.progress}%
                            </span>
                          </div>
                          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full rounded-full ${
                                member.progress >= 80
                                  ? "bg-green-500"
                                  : member.progress >= 60
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                              initial={{ width: 0 }}
                              animate={{ width: `${member.progress}%` }}
                              transition={{ duration: 0.5 }}
                            />
                          </div>
                        </div>
                        <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreHorizontal className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                    <AnimatePresence>
                      {selectedMember === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="mt-3 pt-3 border-t border-gray-200 overflow-hidden"
                        >
                          <div className="grid grid-cols-4 gap-4 text-center">
                            <div>
                              <p className="text-base font-bold text-gray-900">
                                12
                              </p>
                              <p className="text-[10px] text-gray-500">
                                Courses
                              </p>
                            </div>
                            <div>
                              <p className="text-base font-bold text-gray-900">
                                45h
                              </p>
                              <p className="text-[10px] text-gray-500">Time</p>
                            </div>
                            <div>
                              <p className="text-base font-bold text-gray-900">
                                8
                              </p>
                              <p className="text-[10px] text-gray-500">
                                Badges
                              </p>
                            </div>
                            <div>
                              <p className="text-base font-bold text-gray-900">
                                15
                              </p>
                              <p className="text-[10px] text-gray-500">
                                Streak
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <button className="flex-1 py-2 bg-gray-900 text-white rounded-lg text-xs font-medium hover:bg-gray-800 transition-colors">
                              View Profile
                            </button>
                            <button className="flex-1 py-2 border border-gray-200 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors">
                              Message
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Skill Gaps Chart */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          {/* Skill Gaps - Who's Lacking Where */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-gray-600" />
                <h3 className="text-sm font-bold text-gray-900">Skill Gaps</h3>
              </div>
              <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                {TEAM_SKILL_GAPS.reduce((acc, s) => acc + s.lacking.length, 0)}{" "}
                needs attention
              </span>
            </div>
            <SkillGapChart />
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-yellow-600" />
              <h4 className="text-sm font-bold text-gray-900">Quick Actions</h4>
            </div>
            <div className="space-y-2">
              {[
                { label: "Assign Training", icon: Plus },
                { label: "Send Reminder", icon: Bell },
                { label: "Export Report", icon: Download },
              ].map((action, i) => (
                <button
                  key={i}
                  className="w-full flex items-center gap-2.5 p-2.5 bg-white/70 rounded-lg hover:bg-white transition-colors text-xs font-medium text-gray-700 border border-yellow-100 hover:border-yellow-200"
                >
                  <action.icon className="w-3.5 h-3.5 text-yellow-600" />
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <h4 className="text-sm font-bold text-gray-900">AI Insights</h4>
            </div>
            <div className="space-y-2">
              {[
                "3 members need Data Analysis training",
                "Leadership gap identified in 2 members",
                "Schedule team review by Friday",
              ].map((insight, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 p-2 bg-purple-50 rounded-lg text-[11px] text-purple-800"
                >
                  <div className="w-1 h-1 rounded-full bg-purple-500 mt-1.5 flex-shrink-0" />
                  {insight}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative w-full">
      {/* Browser Chrome */}
      <div className="bg-gray-100 rounded-t-xl px-4 py-2.5 flex items-center gap-3 border-b border-gray-200">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="bg-white rounded-lg px-4 py-1.5 text-xs text-gray-500 flex items-center gap-2 w-72 border border-gray-200">
            <Lock className="w-3 h-3 text-green-600" />
            <span>thinkhall.com/dashboard</span>
          </div>
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="bg-white rounded-b-xl shadow-xl border border-gray-200 border-t-0 overflow-hidden relative">
        {/* Header */}
        <div className="bg-gray-50 border-b border-gray-200 px-5 py-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-400/20">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  ThinkHall Dashboard
                </h3>
                <p className="text-[11px] text-gray-500">
                  {currentTime.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors relative">
                <Bell className="w-4 h-4 text-gray-600" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                <Settings className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex gap-2 mt-3">
            {[
              { id: "learner", label: "Learner View", icon: User },
              { id: "manager", label: "Manager View", icon: Users },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id as typeof activeView)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeView === tab.id
                    ? "bg-gray-900 text-white shadow-lg"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="min-h-[480px] max-h-[520px] overflow-hidden bg-gray-50 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeView === "learner" && renderLearnerDashboard()}
              {activeView === "manager" && renderManagerDashboard()}
            </motion.div>
          </AnimatePresence>

          {/* Bottom Fade Effect */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
