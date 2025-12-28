export const globalStyles = `
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

export const SKILLS_DATA = [
  { name: "Leadership", value: 85, color: "#fbbf24", trend: "+12%" },
  { name: "Communication", value: 90, color: "#10b981", trend: "+8%" },
  { name: "Analytics", value: 75, color: "#3b82f6", trend: "+15%" },
  { name: "Problem Solving", value: 88, color: "#8b5cf6", trend: "+5%" },
  { name: "Digital Fluency", value: 70, color: "#f97316", trend: "+20%" },
  { name: "Collaboration", value: 92, color: "#ec4899", trend: "+3%" },
];

export const LEARNER_DATA = {
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
    {
      action: "Completed",
      item: "Strategic Leadership Module",
      time: "2h ago",
      xp: 150,
    },
    { action: "Earned", item: "Problem Solver Badge", time: "5h ago", xp: 200 },
    {
      action: "Started",
      item: "Data-Driven Decisions",
      time: "1d ago",
      xp: 50,
    },
  ],
  upcomingCourses: [
    { name: "Executive Presence", duration: "45 min", progress: 0 },
    { name: "Stakeholder Management", duration: "30 min", progress: 35 },
    { name: "Change Leadership", duration: "60 min", progress: 0 },
  ],
  weeklyProgress: [65, 78, 82, 71, 89, 45, 38],
};

export const MANAGER_DATA = {
  teamSize: 24,
  avgCompletion: 78,
  avgScore: 82,
  activeToday: 18,
  teamMembers: [
    {
      name: "Alex Kumar",
      role: "Manager",
      score: 92,
      progress: 88,
      status: "active",
    },
    {
      name: "Maria Garcia",
      role: "Sr. Analyst",
      score: 87,
      progress: 76,
      status: "active",
    },
    {
      name: "James Wilson",
      role: "Lead",
      score: 79,
      progress: 65,
      status: "inactive",
    },
    {
      name: "Priya Sharma",
      role: "Manager",
      score: 94,
      progress: 92,
      status: "active",
    },
    {
      name: "Tom Anderson",
      role: "Analyst",
      score: 71,
      progress: 45,
      status: "active",
    },
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

export const AI_COACH_CONVERSATIONS = [
  {
    type: "ai",
    text: "Good morning, Sarah! Ready to continue your leadership journey today?",
  },
  { type: "user", text: "Yes! What should I focus on?" },
  {
    type: "ai",
    text: "Based on your recent assessment, I recommend 'Executive Communication'. You're at 72% - let's push to 85%!",
  },
  {
    type: "ai",
    text: "I've prepared a 15-minute micro-learning session. Want to start now or schedule for later?",
  },
];

export const CAREER_PATH_DATA = [
  { level: "Entry Level", skills: 45, completed: true, current: false },
  { level: "Manager", skills: 68, completed: true, current: false },
  { level: "Senior Manager", skills: 82, completed: false, current: true },
  { level: "Director", skills: 0, completed: false, current: false },
  { level: "VP/CXO", skills: 0, completed: false, current: false },
];

export const TESTIMONIALS = [
  {
    quote:
      "Thinkhall doesn't feel like training—it feels like fun games with real life learning.",
    author: "Rahul Mehta",
    role: "Regional Manager, Retail Chain",
    avatar: "RM",
  },
  {
    quote: "The AI recommendations were surprisingly accurate and actionable.",
    author: "Sneha Patel",
    role: "L&D Head, Tech Startup",
    avatar: "SP",
  },
  {
    quote:
      "Thinkhall covers all the aspects of learning and development for a company or an individual.",
    author: "Vikram Singh",
    role: "HR Director, Manufacturing",
    avatar: "VS",
  },
];
