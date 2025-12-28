"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useInView,
} from "framer-motion";
import {
  Brain,
  Zap,
  Target,
  Users,
  BarChart3,
  Sparkles,
  ChevronRight,
  Play,
  CheckCircle2,
  ArrowRight,
  Rocket,
  TrendingUp,
  Cpu,
  Compass,
  Briefcase,
  GraduationCap,
  Building2,
  Gamepad2,
  Star,
  Phone,
  Mail,
  User,
  Clock,
  Award,
  BookOpen,
  ChevronDown,
  Filter,
  Download,
  MessageSquare,
  BarChart2,
  Crown,
  Gift,
  Trophy,
  Flame,
  Video,
  Monitor,
  Lock,
  Puzzle,
  Waypoints,
  Users2,
  Boxes,
  Timer,
  Medal,
  Gem,
  Coins,
  PlayCircle,
  PauseCircle,
  Quote,
  Menu,
  X,
  Activity,
  PartyPopper,
} from "lucide-react";

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Syne:wght@400;500;600;700;800&display=swap');

  :root {
    --yellow: #fbbf24;
    --yellow-dark: #f59e0b;
    --orange: #f97316;
    --black: #000000;
    --white: #ffffff;
  }

  .font-display {
    font-family: 'Syne', sans-serif;
  }

  .font-body {
    font-family: 'Inter', sans-serif;
  }

  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  @keyframes pulse-dot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.2); }
  }

  @keyframes confetti {
    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
    100% { transform: translateY(-100px) rotate(720deg); opacity: 0; }
  }

  @keyframes bounce-in {
    0% { transform: scale(0); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }

  @keyframes diamond-float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    25% { transform: translateY(-5px) rotate(5deg); }
    75% { transform: translateY(5px) rotate(-5deg); }
  }

  .gradient-text {
    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #f97316 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .glass {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }

  .shimmer {
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%);
    background-size: 200% 100%;
    animation: shimmer 2s infinite;
  }

  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-track {
    background: #f3f4f6;
  }

  ::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #fbbf24, #f97316);
    border-radius: 3px;
  }

  ::selection {
    background: rgba(251, 191, 36, 0.3);
    color: #000;
  }
`;

const SKILLS_DATA = [
  { name: "Leadership", value: 85, color: "#fbbf24", trend: "+12%" },
  { name: "Communication", value: 90, color: "#10b981", trend: "+8%" },
  { name: "Analytics", value: 75, color: "#3b82f6", trend: "+15%" },
  { name: "Problem Solving", value: 88, color: "#8b5cf6", trend: "+5%" },
  { name: "Digital Fluency", value: 70, color: "#f97316", trend: "+20%" },
  { name: "Collaboration", value: 92, color: "#ec4899", trend: "+3%" },
];

const LEARNER_DATA = {
  name: "Sarah Chen",
  role: "Senior Manager",
  level: 12,
  xp: 8450,
  xpToNext: 10000,
  streak: 15,
  badges: 24,
  completedCourses: 18,
  hoursLearned: 47,
  rank: 23,
  recentActivity: [
    { action: "Completed", item: "Strategic Leadership Module", time: "2h ago", xp: 150 },
    { action: "Earned", item: "Problem Solver Badge", time: "5h ago", xp: 200 },
    { action: "Started", item: "Data-Driven Decisions", time: "1d ago", xp: 50 },
  ],
  upcomingCourses: [
    { name: "Executive Presence", duration: "45 min", progress: 0 },
    { name: "Stakeholder Management", duration: "30 min", progress: 35 },
    { name: "Change Leadership", duration: "60 min", progress: 0 },
  ],
  weeklyProgress: [65, 78, 82, 71, 89, 45, 38],
};

const MANAGER_DATA = {
  teamSize: 24,
  avgCompletion: 78,
  avgScore: 82,
  activeToday: 18,
  teamMembers: [
    { name: "Alex Kumar", role: "Manager", score: 92, progress: 88, status: "active" },
    { name: "Maria Garcia", role: "Sr. Analyst", score: 87, progress: 76, status: "active" },
    { name: "James Wilson", role: "Lead", score: 79, progress: 65, status: "inactive" },
    { name: "Priya Sharma", role: "Manager", score: 94, progress: 92, status: "active" },
    { name: "Tom Anderson", role: "Analyst", score: 71, progress: 45, status: "active" },
  ],
  skillGaps: [
    { skill: "Data Analytics", gap: 35, priority: "high" },
    { skill: "Strategic Thinking", gap: 22, priority: "medium" },
    { skill: "Communication", gap: 15, priority: "low" },
  ],
  departmentScores: [
    { dept: "Sales", score: 85 },
    { dept: "Marketing", score: 78 },
    { dept: "Operations", score: 82 },
    { dept: "HR", score: 91 },
  ],
};

const AI_COACH_CONVERSATIONS = [
  { type: "ai", text: "Good morning, Sarah! Ready to continue your leadership journey today?" },
  { type: "user", text: "Yes! What should I focus on?" },
  { type: "ai", text: "Based on your recent assessment, I recommend 'Executive Communication'. You're at 72% - let's push to 85%!" },
  { type: "ai", text: "I've prepared a 15-minute micro-learning session. Want to start now or schedule for later?" },
];

const CAREER_PATH_DATA = [
  { level: "Entry Level", skills: 45, completed: true, current: false },
  { level: "Manager", skills: 68, completed: true, current: false },
  { level: "Senior Manager", skills: 82, completed: false, current: true },
  { level: "Director", skills: 0, completed: false, current: false },
  { level: "VP/CXO", skills: 0, completed: false, current: false },
];

const TESTIMONIALS = [
  { quote: "Thinkhall doesn't feel like training—it feels like fun games with real life learning.", author: "Rahul Mehta", role: "Regional Manager, Retail Chain", avatar: "RM" },
  { quote: "The AI recommendations were surprisingly accurate and actionable.", author: "Sneha Patel", role: "L&D Head, Tech Startup", avatar: "SP" },
  { quote: "Thinkhall covers all the aspects of learning and development for a company or an individual.", author: "Vikram Singh", role: "HR Director, Manufacturing", avatar: "VS" },
];

function InteractiveDashboard() {
  const [activeView, setActiveView] = useState<"learner" | "manager">("learner");
  const [selectedMember, setSelectedMember] = useState<number | null>(null);
  const [isLive, setIsLive] = useState(true);

  const renderLearnerDashboard = () => (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white text-lg sm:text-xl font-bold">
              SC
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
              <span className="text-white text-[10px] sm:text-xs font-bold">{LEARNER_DATA.level}</span>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-base sm:text-lg">{LEARNER_DATA.name}</h3>
            <p className="text-gray-500 text-sm">{LEARNER_DATA.role}</p>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center gap-1 text-orange-500">
                <Flame className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm font-semibold">{LEARNER_DATA.streak} day streak</span>
              </div>
            </div>
          </div>
        </div>
        <div className="text-left sm:text-right">
          <div className="flex items-center gap-2 justify-start sm:justify-end mb-1">
            <Gem className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
            <span className="text-xl sm:text-2xl font-bold text-gray-900">{LEARNER_DATA.xp.toLocaleString()}</span>
            <span className="text-gray-400 text-sm">XP</span>
          </div>
          <div className="w-full sm:w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(LEARNER_DATA.xp / LEARNER_DATA.xpToNext) * 100}%` }}
              transition={{ duration: 1 }}
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">{LEARNER_DATA.xpToNext - LEARNER_DATA.xp} XP to Level {LEARNER_DATA.level + 1}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {[
          { icon: BookOpen, label: "Courses", value: LEARNER_DATA.completedCourses, color: "blue" },
          { icon: Clock, label: "Hours", value: LEARNER_DATA.hoursLearned, color: "green" },
          { icon: Medal, label: "Badges", value: LEARNER_DATA.badges, color: "purple" },
          { icon: Target, label: "Avg Score", value: "87%", color: "orange" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-gray-50 rounded-xl p-3 sm:p-4 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 text-${stat.color}-500 mb-2`} />
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-xs sm:text-sm text-gray-500">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
          <h4 className="font-bold text-gray-900 mb-4 text-sm sm:text-base">Skill Progress</h4>
          <div className="space-y-3">
            {SKILLS_DATA.slice(0, 4).map((skill, i) => (
              <div key={skill.name} className="group">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs sm:text-sm font-medium text-gray-700">{skill.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold" style={{ color: skill.color }}>{skill.value}%</span>
                    <span className="text-xs text-green-500">{skill.trend}</span>
                  </div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.value}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className="h-full rounded-full transition-all group-hover:brightness-110"
                    style={{ backgroundColor: skill.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
          <h4 className="font-bold text-gray-900 mb-4 text-sm sm:text-base">Recent Activity</h4>
          <div className="space-y-3">
            {LEARNER_DATA.recentActivity.map((activity, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center ${activity.action === "Completed" ? "bg-green-100" : activity.action === "Earned" ? "bg-purple-100" : "bg-blue-100"}`}>
                    {activity.action === "Completed" ? (
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                    ) : activity.action === "Earned" ? (
                      <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                    ) : (
                      <Play className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-1">{activity.action} {activity.item}</p>
                    <p className="text-[10px] sm:text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-yellow-600">
                  <Gem className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm font-bold">+{activity.xp}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderManagerDashboard = () => (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {[
          { icon: Users, label: "Team Size", value: MANAGER_DATA.teamSize, color: "blue", suffix: "" },
          { icon: TrendingUp, label: "Avg Completion", value: MANAGER_DATA.avgCompletion, color: "green", suffix: "%" },
          { icon: Target, label: "Avg Score", value: MANAGER_DATA.avgScore, color: "purple", suffix: "%" },
          { icon: Activity, label: "Active Today", value: MANAGER_DATA.activeToday, color: "orange", suffix: "" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 hover:shadow-lg transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-${stat.color}-100 flex items-center justify-center`}>
                <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 text-${stat.color}-600`} />
              </div>
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}{stat.suffix}</div>
            <div className="text-xs sm:text-sm text-gray-500">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-gray-900 text-sm sm:text-base">Team Performance</h4>
            <div className="flex items-center gap-2">
              <button className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Filter className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
              </button>
              <button className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Download className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
              </button>
            </div>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {MANAGER_DATA.teamMembers.slice(0, 4).map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setSelectedMember(selectedMember === i ? null : i)}
                className={`p-3 sm:p-4 rounded-xl border-2 transition-all cursor-pointer ${selectedMember === i ? "border-yellow-400 bg-yellow-50" : "border-gray-100 hover:border-gray-200"}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white text-xs sm:text-sm font-bold">
                      {member.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">{member.name}</p>
                      <p className="text-xs sm:text-sm text-gray-500">{member.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-bold text-gray-900">{member.score}%</p>
                      <p className="text-xs text-gray-500">Score</p>
                    </div>
                    <div className="w-16 sm:w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${member.progress >= 80 ? "bg-green-500" : member.progress >= 60 ? "bg-yellow-500" : "bg-red-500"}`}
                        style={{ width: `${member.progress}%` }}
                      />
                    </div>
                    <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${member.status === "active" ? "bg-green-500" : "bg-gray-300"}`} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
          <h4 className="font-bold text-gray-900 mb-4 text-sm sm:text-base">Skill Gaps</h4>
          <div className="space-y-4">
            {MANAGER_DATA.skillGaps.map((gap, i) => (
              <div key={gap.skill} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-medium text-gray-700">{gap.skill}</span>
                  <span className={`text-[10px] sm:text-xs font-bold px-2 py-1 rounded-full ${gap.priority === "high" ? "bg-red-100 text-red-700" : gap.priority === "medium" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>
                    {gap.gap}% gap
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${100 - gap.gap}%` }}
                    transition={{ duration: 1, delay: i * 0.2 }}
                    className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative"
    >
      <div className="bg-gray-100 rounded-t-2xl px-3 sm:px-4 py-2 sm:py-3 flex items-center gap-2 sm:gap-3 border-b border-gray-200">
        <div className="flex gap-1.5 sm:gap-2">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-400 hover:bg-red-500 transition-colors cursor-pointer" />
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-400 hover:bg-yellow-500 transition-colors cursor-pointer" />
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-400 hover:bg-green-500 transition-colors cursor-pointer" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="bg-white rounded-lg px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm text-gray-500 flex items-center gap-2 w-48 sm:w-80 border border-gray-200">
            <Lock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-600" />
            <span className="truncate">app.thinkhall.ai/dashboard</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-b-2xl shadow-2xl shadow-black/10 border border-gray-200 border-t-0 overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-400/30">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm sm:text-base">Interactive Platform Demo</h3>
                <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Experience the learning dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsLive(!isLive)}
                className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${isLive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}
              >
                <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${isLive ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
                <span className="hidden sm:inline">{isLive ? "Live Demo" : "Paused"}</span>
              </button>
            </div>
          </div>

          <div className="flex gap-2 mt-3 sm:mt-4">
            {[
              { id: "learner", label: "Learner View", icon: User },
              { id: "manager", label: "Manager View", icon: Users },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id as typeof activeView)}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${activeView === tab.id ? "bg-black text-white shadow-lg" : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"}`}
              >
                <tab.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeView === "learner" && renderLearnerDashboard()}
            {activeView === "manager" && renderManagerDashboard()}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function GamifiedAssessmentCard() {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [showPowerUp, setShowPowerUp] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setScore((prev) => {
        const newScore = prev + Math.floor(Math.random() * 50) + 10;
        if (newScore > 500) {
          setLevel((l) => Math.min(l + 1, 5));
          setShowPowerUp(true);
          setTimeout(() => setShowPowerUp(false), 1500);
          return 0;
        }
        return newScore;
      });
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 rounded-3xl p-6 sm:p-8 overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-400/20 rounded-full"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ y: [0, -20, 0], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}
      </div>

      <AnimatePresence>
        {showPowerUp && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 2, opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center z-20"
          >
            <div className="bg-yellow-400 text-black font-bold px-6 py-3 rounded-full text-lg flex items-center gap-2">
              <Zap className="w-6 h-6" />
              LEVEL UP!
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-purple-300 text-sm font-medium">LEADERSHIP QUEST</span>
            <h3 className="text-white text-xl sm:text-2xl font-bold">Decision Making Challenge</h3>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
            <Crown className="w-5 h-5 text-yellow-400" />
            <span className="text-white font-bold">Level {level}</span>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 mb-6">
          <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-4">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={i < (score / 60) ? { backgroundColor: ['rgba(139, 92, 246, 0.5)', 'rgba(234, 179, 8, 0.8)', 'rgba(139, 92, 246, 0.5)'] } : {}}
                transition={{ duration: 0.5 }}
                className={`aspect-square rounded-xl flex items-center justify-center cursor-pointer ${i < (score / 60) ? "bg-gradient-to-br from-yellow-400/80 to-orange-500/80" : "bg-white/5 hover:bg-white/10"}`}
              >
                {i < (score / 60) && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-white">
                    <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
                  </motion.div>
                )}
                {i >= (score / 60) && <span className="text-purple-300 text-lg sm:text-xl font-bold">?</span>}
              </motion.div>
            ))}
          </div>

          <div className="relative h-4 bg-white/10 rounded-full overflow-hidden">
            <motion.div animate={{ width: `${(score / 500) * 100}%` }} className="absolute inset-y-0 left-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 rounded-full" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-xs font-bold">{score}/500 XP</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {[
            { icon: Target, value: "85%", label: "Accuracy" },
            { icon: Zap, value: `${Math.floor(score / 10)}`, label: "Streak" },
            { icon: Trophy, value: "#12", label: "Rank" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 mb-2">
                <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
              </div>
              <div className="text-white font-bold text-lg sm:text-xl">{stat.value}</div>
              <div className="text-purple-300 text-xs sm:text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function RewardsRedemptionCard() {
  const [phase, setPhase] = useState<"playing" | "winning" | "redeeming">("playing");
  const [diamonds, setDiamonds] = useState(0);

  useEffect(() => {
    const cycle = () => {
      setPhase("playing");
      setDiamonds(0);

      setTimeout(() => {
        setPhase("winning");
        let count = 0;
        const countInterval = setInterval(() => {
          count += 10;
          setDiamonds(count);
          if (count >= 100) {
            clearInterval(countInterval);
            setTimeout(() => setPhase("redeeming"), 1000);
          }
        }, 50);
      }, 2000);
    };

    cycle();
    const mainInterval = setInterval(cycle, 8000);
    return () => clearInterval(mainInterval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl p-6 sm:p-8 overflow-hidden"
    >
      {phase === "winning" && (
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: "100%", x: `${Math.random() * 100}%`, rotate: 0, opacity: 0 }}
              animate={{ y: "-100%", rotate: 360, opacity: [0, 1, 1, 0] }}
              transition={{ duration: 2, delay: i * 0.1, ease: "easeOut" }}
              className="absolute"
            >
              <Gem className="w-6 h-6 text-yellow-300" />
            </motion.div>
          ))}
        </div>
      )}

      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {phase === "playing" && (
            <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <Gamepad2 className="w-5 h-5 text-white" />
                <span className="text-white font-medium">Game in Progress...</span>
              </div>

              <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5, delay: i * 0.2, repeat: Infinity }}
                    className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-xl flex items-center justify-center"
                  >
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                      <Star className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-300" />
                    </motion.div>
                  </motion.div>
                ))}
              </div>

              <p className="text-white/80">Completing assessment...</p>
            </motion.div>
          )}

          {phase === "winning" && (
            <motion.div key="winning" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 0.5, repeat: Infinity }} className="inline-block mb-4">
                <PartyPopper className="w-16 h-16 text-yellow-300" />
              </motion.div>

              <h3 className="text-white text-2xl sm:text-3xl font-bold mb-2">🎉 Congratulations!</h3>

              <div className="flex items-center justify-center gap-3 mb-4">
                <motion.div animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }} transition={{ duration: 0.5 }}>
                  <Gem className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-300" />
                </motion.div>
                <motion.span className="text-4xl sm:text-5xl font-bold text-white">+{diamonds}</motion.span>
                <span className="text-white/80 text-lg">Diamonds!</span>
              </div>
            </motion.div>
          )}

          {phase === "redeeming" && (
            <motion.div key="redeeming" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center">
              <h3 className="text-white text-xl sm:text-2xl font-bold mb-2">Redeem Your Rewards</h3>
              <p className="text-white/80 mb-6">100 Diamonds = Amazing Rewards!</p>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { name: "Amazon", emoji: "🛒", diamonds: 100 },
                  { name: "Swiggy", emoji: "🍔", diamonds: 80 },
                  { name: "Myntra", emoji: "👔", diamonds: 90 },
                ].map((reward, i) => (
                  <motion.div
                    key={reward.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white rounded-xl p-3 sm:p-4 cursor-pointer shadow-lg"
                  >
                    <div className="text-3xl sm:text-4xl mb-2">{reward.emoji}</div>
                    <p className="font-bold text-gray-900 text-sm">{reward.name}</p>
                    <div className="flex items-center justify-center gap-1 text-teal-600">
                      <Gem className="w-3 h-3" />
                      <span className="text-xs font-medium">{reward.diamonds}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function MicroLearningCard() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 2;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  useEffect(() => {
    const autoPlay = setInterval(() => {
      setIsPlaying(true);
    }, 5000);
    return () => clearInterval(autoPlay);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative bg-gradient-to-br from-orange-500 via-rose-500 to-pink-500 rounded-3xl p-6 sm:p-8 overflow-hidden"
    >
      <div className="relative z-10">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <Video className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-white text-xl sm:text-2xl font-bold mb-1">Don't Like Long Videos?</h3>
            <p className="text-white/80 text-sm sm:text-base">Master skills in just 2 minutes! Bite-sized learning with instant assessments.</p>
          </div>
        </div>

        <div className="relative bg-black/30 rounded-2xl overflow-hidden mb-6 aspect-video">
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.button
              onClick={() => setIsPlaying(!isPlaying)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all ${isPlaying ? "bg-white/20" : "bg-white"}`}
            >
              {isPlaying ? (
                <PauseCircle className={`w-10 h-10 sm:w-12 sm:h-12 ${isPlaying ? "text-white" : "text-rose-500"}`} />
              ) : (
                <PlayCircle className="w-10 h-10 sm:w-12 sm:h-12 text-rose-500" />
              )}
            </motion.button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <motion.div animate={{ width: `${progress}%` }} className="h-full bg-white rounded-full" />
          </div>

          <div className="absolute bottom-3 right-3 bg-black/60 px-2 py-1 rounded text-white text-xs">
            {Math.floor((progress / 100) * 120)}s / 2:00
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {[
            { icon: Clock, text: "2 Min Videos" },
            { icon: Target, text: "Quick Quiz" },
            { icon: TrendingUp, text: "Track Growth" },
          ].map((item, i) => (
            <div key={i} className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
              <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white mx-auto mb-1" />
              <span className="text-white text-xs sm:text-sm font-medium">{item.text}</span>
            </div>
          ))}
        </div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-center text-white/90 mt-4 text-sm sm:text-base font-medium">
          🚀 Reach greater heights with micro-learning + assessments
        </motion.p>
      </div>
    </motion.div>
  );
}

function AICoachSection() {
  const [currentMessage, setCurrentMessage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % AI_COACH_CONVERSATIONS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 sm:py-24 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <span className="inline-block bg-yellow-400/20 text-yellow-400 text-sm font-semibold px-4 py-2 rounded-full mb-6">Meet Your AI Coach</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-white mb-6">
              <span className="text-yellow-400">THINKMATE</span>
              <br />
              Your Personal Learning Guide
            </h2>
            <p className="text-lg text-gray-300 mb-8">Not just another chatbot. THINKMATE is an Agentive AI that understands your goals, tracks your progress, and provides personalized recommendations in real-time.</p>
            <div className="space-y-4">
              {["Personalized learning recommendations", "Real-time skill gap analysis", "Adaptive coaching based on progress", "24/7 available for guidance"].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-black" />
                  </div>
                  <span className="text-gray-300">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden">
              <div className="p-4 border-b border-white/10 flex items-center gap-4">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/30"
                >
                  <Brain className="w-7 h-7 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-white font-bold text-lg">THINKMATE</h3>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-green-400 text-sm">Online & Ready</span>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4 min-h-[280px]">
                <AnimatePresence mode="wait">
                  {AI_COACH_CONVERSATIONS.slice(0, currentMessage + 1).map((msg, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${msg.type === "user" ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white" : "bg-white/10 text-white"}`}>
                        <p className="text-sm sm:text-base leading-relaxed">{msg.text}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {currentMessage < AI_COACH_CONVERSATIONS.length - 1 && (
                  <div className="flex gap-1 p-2">
                    {[0, 1, 2].map((i) => (
                      <motion.div key={i} animate={{ y: [0, -6, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.15 }} className="w-2 h-2 bg-yellow-400 rounded-full" />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function CareerPathSection() {
  return (
    <section className="py-20 sm:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <span className="inline-block bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 text-sm font-semibold px-4 py-2 rounded-full mb-4">Career Progression</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display mb-4">
            Your Journey to <span className="gradient-text">Leadership</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Track your career progression from entry-level to executive leadership</p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-green-500 via-yellow-500 to-gray-300 -translate-x-1/2 hidden md:block" />

          <div className="space-y-6 sm:space-y-8">
            {CAREER_PATH_DATA.map((level, i) => (
              <motion.div
                key={level.level}
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className={`flex flex-col md:flex-row items-center gap-4 md:gap-8 ${i % 2 === 0 ? "" : "md:flex-row-reverse"}`}
              >
                <div className={`flex-1 w-full md:w-auto ${i % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`inline-block p-5 sm:p-6 rounded-2xl w-full md:w-auto ${
                      level.current ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-xl shadow-yellow-400/30" : level.completed ? "bg-green-50 border-2 border-green-200" : "bg-gray-100 border-2 border-gray-200"
                    }`}
                  >
                    <h4 className={`font-bold text-lg mb-2 ${level.current ? "text-white" : "text-gray-900"}`}>{level.level}</h4>
                    {level.skills > 0 && (
                      <div className="space-y-2">
                        <div className={`w-full h-2 rounded-full overflow-hidden ${level.current ? "bg-white/30" : "bg-gray-200"}`}>
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${level.skills}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: i * 0.2 }}
                            className={`h-full rounded-full ${level.current ? "bg-white" : "bg-green-500"}`}
                          />
                        </div>
                        <span className={`text-sm font-medium ${level.current ? "text-white" : "text-gray-600"}`}>{level.skills}% Complete</span>
                      </div>
                    )}
                    {level.completed && !level.current && (
                      <div className="flex items-center gap-1 text-green-600 mt-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-sm font-medium">Completed</span>
                      </div>
                    )}
                    {!level.completed && !level.current && (
                      <div className="flex items-center gap-1 text-gray-400 mt-2">
                        <Lock className="w-4 h-4" />
                        <span className="text-sm font-medium">Locked</span>
                      </div>
                    )}
                  </motion.div>
                </div>

                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`relative z-10 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shrink-0 ${
                    level.current ? "bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg shadow-yellow-400/50" : level.completed ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  {level.completed && !level.current ? (
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  ) : level.current ? (
                    <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                      <Star className="w-6 h-6 text-white" />
                    </motion.div>
                  ) : (
                    <Lock className="w-5 h-5 text-white" />
                  )}
                </motion.div>

                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorksRoadmap() {
  return (
    <section className="py-20 sm:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="inline-block bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 text-sm font-semibold px-4 py-2 rounded-full mb-4">How It Works</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display mb-4">
            A Smarter Way to <span className="gradient-text">Build Skills</span>
          </h2>
        </motion.div>

        <div className="relative">
          <svg className="absolute inset-0 w-full h-full hidden lg:block" viewBox="0 0 1200 400" fill="none" preserveAspectRatio="xMidYMid meet">
            <motion.path
              d="M 100 200 Q 300 50 500 200 Q 700 350 900 200 Q 1100 50 1100 200"
              stroke="url(#roadGradient)"
              strokeWidth="4"
              strokeDasharray="10 5"
              fill="none"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
            <defs>
              <linearGradient id="roadGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="33%" stopColor="#8b5cf6" />
                <stop offset="66%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#22c55e" />
              </linearGradient>
            </defs>
          </svg>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {[
              { step: "01", title: "Assess", desc: "Play short, engaging, gamified assessments designed around real workplace challenges.", icon: Gamepad2, color: "from-blue-500 to-cyan-500", position: "lg:translate-y-0" },
              { step: "02", title: "Analyze", desc: "Our AI Coach evaluates your performance across technical, behavioral, and leadership skills.", icon: BarChart3, color: "from-purple-500 to-pink-500", position: "lg:translate-y-20" },
              { step: "03", title: "Personalize", desc: "Receive a tailored learning journey based on your role, experience, and career goals.", icon: Compass, color: "from-orange-500 to-red-500", position: "lg:translate-y-0" },
              { step: "04", title: "Advance", desc: "Practice, apply, and grow—while your AI Coach continuously refines your path.", icon: Rocket, color: "from-green-500 to-emerald-500", position: "lg:-translate-y-20" },
            ].map((item, i) => (
              <motion.div key={item.step} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }} className={`relative ${item.position}`}>
                <motion.div whileHover={{ scale: 1.05, y: -10 }} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-2xl transition-all h-full">
                  <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }} className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 mx-auto shadow-lg`}>
                    <item.icon className="w-8 h-8 text-white" />
                  </motion.div>

                  <div className="text-center">
                    <span className="inline-block bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full mb-3">Step {item.step}</span>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </div>
                </motion.div>

                {i < 3 && (
                  <div className="flex justify-center my-4 lg:hidden">
                    <ChevronDown className="w-6 h-6 text-gray-300" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "py-2" : "py-4"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className={`flex items-center justify-between px-4 sm:px-6 py-3 rounded-2xl transition-all duration-500 ${scrolled ? "bg-white/95 backdrop-blur-xl shadow-lg border border-gray-200/50" : "bg-transparent"}`}>
          <Link href="/" className="flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-400/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="font-display font-bold text-lg sm:text-xl text-gray-900">Thinkhall</div>
          </Link>

          <div className="hidden lg:flex items-center gap-1 bg-gray-100 rounded-xl p-1">
            {["Platform", "Programs", "AI Coach", "For Organizations", "Pricing"].map((item) => (
              <Link key={item} href={`#${item.toLowerCase().replace(" ", "-")}`} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-all">
                {item}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login" className="text-gray-600 hover:text-black transition-colors text-sm font-medium hidden sm:block">
              Sign In
            </Link>
            <button className="bg-black text-white px-4 sm:px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-gray-800 transition-all shadow-lg shadow-black/20">
              <span className="hidden sm:inline">Get Started</span>
              <span className="sm:hidden">Start</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button className="lg:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="lg:hidden bg-white mx-4 mt-2 rounded-2xl overflow-hidden shadow-xl border border-gray-200">
            <div className="p-4 space-y-1">
              {["Platform", "Programs", "AI Coach", "For Organizations", "Pricing", "Sign In"].map((item) => (
                <Link key={item} href={`#${item.toLowerCase().replace(" ", "-")}`} className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-all font-medium" onClick={() => setMobileMenuOpen(false)}>
                  {item}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

function SectionHeader({ badge, title, subtitle, center = true }: { badge: string; title: React.ReactNode; subtitle?: string; center?: boolean }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={center ? "text-center" : ""}>
      <span className="inline-block bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 text-sm font-semibold px-4 py-2 rounded-full mb-4">{badge}</span>
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display mb-4">{title}</h2>
      {subtitle && <p className="text-lg text-gray-600 max-w-3xl mx-auto">{subtitle}</p>}
    </motion.div>
  );
}

export default function HomePage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="bg-white text-gray-900 overflow-x-hidden font-body">
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
      <Navigation />

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
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-[1.1] mb-4 sm:mb-6 font-display"
            >
              <span className="gradient-text">
                Where Skills Meet Intelligence
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

      <section className="py-16 sm:py-20 bg-gray-50 border-y border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display mb-4 sm:mb-6"
          >
            Learn Smarter. <span className="gradient-text">Grow Faster.</span>{" "}
            Lead Better.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto"
          >
            Thinkhall Academy is a SkillTech platform designed to assess, coach,
            and elevate professionals at every stage—entry-level, managers,
            senior leaders, and future executives. Powered by our Agentive AI
            Coach <span className="font-bold text-yellow-600">"THINKMATE"</span>
            , we don't just teach skills—we guide decisions, track progress, and
            adapt learning in real time.
          </motion.p>
        </div>
      </section>

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

      <HowItWorksRoadmap />

      <AICoachSection />

      <CareerPathSection />

      <section className="py-20 sm:py-24 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block bg-yellow-400/20 text-yellow-400 text-sm font-semibold px-4 py-2 rounded-full mb-6">
                About Thinkhall Academy
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold font-display mb-6">
                Designed for the Skills of{" "}
                <span className="text-yellow-400">Today—and Tomorrow</span>
              </h2>
              <p className="text-base sm:text-lg text-gray-400 mb-8">
                Whether you're stepping into your first role or leading large
                teams, Thinkhall meets you exactly where you are.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
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
                    className="flex items-center gap-3 bg-white/5 rounded-xl p-4 border border-white/10"
                  >
                    <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 shrink-0" />
                    <span className="text-white text-sm sm:text-base">
                      {item.text}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-3xl p-6 sm:p-8 border border-white/10">
                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                  {[
                    { value: "500+", label: "Organizations" },
                    { value: "2.4M", label: "Learners" },
                    { value: "98%", label: "Satisfaction" },
                    { value: "50+", label: "Industries" },
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      viewport={{ once: true }}
                      className="text-center"
                    >
                      <div className="text-3xl sm:text-4xl font-bold text-yellow-400 mb-1">
                        {stat.value}
                      </div>
                      <div className="text-gray-400 text-sm sm:text-base">
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

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
                Build <span className="text-yellow-400">Future-Ready</span>{" "}
                Teams
              </h2>
              <p className="text-base sm:text-lg text-gray-400 mb-8">
                Enterprise-grade platform for workforce development. Perfect for
                Retail brands, Mid-large Enterprises, Startups, and Training
                partners.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  "Assess workforce skill gaps",
                  "Develop leadership pipelines",
                  "Upskill teams at scale",
                  "Track skill readiness with real data",
                  "Customize content for your industry",
                  "Personalize learning paths",
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-yellow-400 shrink-0" />
                    <span className="text-gray-300 text-sm sm:text-base">
                      {item}
                    </span>
                  </motion.div>
                ))}
              </div>
              <button className="bg-yellow-400 text-black px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg flex items-center gap-2 hover:bg-yellow-300 transition-all shadow-lg shadow-yellow-400/30">
                Talk to Us
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-3 sm:gap-4"
            >
              {[
                { icon: Building2, label: "Retail Brands", count: "150+" },
                { icon: Briefcase, label: "Enterprises", count: "200+" },
                { icon: Rocket, label: "Startups", count: "300+" },
                {
                  icon: GraduationCap,
                  label: "Training Partners",
                  count: "50+",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.03 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 sm:p-6 text-center hover:bg-white/10 hover:border-yellow-400/30 transition-all cursor-pointer"
                >
                  <item.icon className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400 mx-auto mb-3" />
                  <div className="text-xl sm:text-2xl font-bold text-white mb-1">
                    {item.count}
                  </div>
                  <span className="text-gray-400 text-sm">{item.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <SectionHeader
            badge="Testimonials"
            title={
              <>
                What Our <span className="gradient-text">Learners Say</span>
              </>
            }
          />

          <div className="mt-12 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-lg text-center"
              >
                <Quote className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-400 mx-auto mb-4 sm:mb-6" />
                <p className="text-lg sm:text-xl text-gray-800 mb-6 italic">
                  "{TESTIMONIALS[currentTestimonial].quote}"
                </p>
                <div className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm sm:text-base">
                    {TESTIMONIALS[currentTestimonial].avatar}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">
                      {TESTIMONIALS[currentTestimonial].author}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {TESTIMONIALS[currentTestimonial].role}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center gap-2 mt-6">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentTestimonial(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === currentTestimonial
                      ? "w-8 bg-yellow-400"
                      : "w-2 bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-32 bg-black relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] bg-gradient-radial from-yellow-500/20 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white font-display mb-6"
          >
            Your Skills Decide Your Future.
            <span className="block text-yellow-400 mt-2">
              Let's Build Them Right.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-base sm:text-lg text-gray-400 mb-8 sm:mb-10"
          >
            Start your journey with Thinkhall Academy today.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-3 sm:gap-4 justify-center mb-10 sm:mb-12"
          >
            <button className="bg-yellow-400 text-black px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg flex items-center gap-2 hover:bg-yellow-300 transition-all shadow-lg shadow-yellow-400/30">
              Start Skill Assessment
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="border-2 border-white/20 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-white/10 transition-all">
              Request a Demo
            </button>
          </motion.div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-gray-400">
            <a
              href="mailto:info@thinkhallacademy.com"
              className="flex items-center gap-2 hover:text-yellow-400 transition-colors text-sm sm:text-base"
            >
              <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
              info@thinkhallacademy.com
            </a>
            <a
              href="https://wa.me/919900600195"
              className="flex items-center gap-2 hover:text-yellow-400 transition-colors text-sm sm:text-base"
            >
              <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
              +91 99006 00195
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12 sm:py-16 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-10 sm:mb-12">
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="font-display font-bold text-lg sm:text-xl">
                  Thinkhall
                </div>
              </Link>
              <p className="text-gray-400 mb-6 max-w-sm text-sm sm:text-base">
                Where Skills Meet Intelligence. Building future-ready
                professionals through AI-powered learning.
              </p>
            </div>

            {[
              {
                title: "Platform",
                links: ["Programs", "AI Coach", "Assessments", "Pricing"],
              },
              {
                title: "Solutions",
                links: [
                  "For Enterprise",
                  "For Startups",
                  "For Training Partners",
                  "Custom Content",
                ],
              },
              {
                title: "Resources",
                links: ["Blog", "Case Studies", "Webinars", "Help Center"],
              },
              {
                title: "Company",
                links: ["About Us", "Careers", "Contact", "Partners"],
              },
            ].map((column) => (
              <div key={column.title}>
                <h4 className="font-semibold mb-4 text-sm sm:text-base">
                  {column.title}
                </h4>
                <ul className="space-y-2 sm:space-y-3">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-xs sm:text-sm">
              © 2024 Thinkhall Academy. All rights reserved.
            </p>
            <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Terms
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Security
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}