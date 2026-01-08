"use client";

import { motion } from "framer-motion";
import {
  Settings,
  Users,
  BarChart2,
  CheckCircle2,
  ArrowUpRight,
  Building2,
  UsersRound,
  Briefcase,
  UserCircle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";


// Copied EnterpriseSolutionsSection Logic
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
        </motion.div>
      ))}
    </div>
  );
}

// Copied WhoItsFor Logic
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
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
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
  );
}

export default function EnterprisePage() {
  return (
    <main className="bg-white min-h-screen">


      <section className="pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <span className="inline-block bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-sm font-semibold px-4 py-2 rounded-full mb-4">
            For Organizations
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display text-gray-900 mb-6">
            Enterprise Solutions for{" "}
            <span className="gradient-text">Scale</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transform your workforce with AI-driven skill development tailored
            for large organizations, L&D teams, and managers.
          </p>
          <div className="mt-8">
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-all"
            >
              Talk to Sales <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          <EnterpriseSolutionsSection />
          <WhoItsForSection />
        </div>
      </section>


    </main>
  );
}
