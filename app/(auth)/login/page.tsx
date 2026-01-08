// app/(auth)/login/page.tsx

"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Loader2,
  Mail,
  Lock,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Brain,
  TrendingUp,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

// Role-based dashboard routes
const DASHBOARD_ROUTES = {
  super_admin: "/super-admin/dashboard",
  org_admin: "/admin/dashboard",
  manager: "/manager/dashboard",
  team_lead: "/team-lead/dashboard",
  employee: "/employee/dashboard",
};

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const callbackUrl = searchParams.get("callbackUrl");
  const error = searchParams.get("error");
  const message = searchParams.get("message");

  // Redirect if already authenticated
  useEffect(() => {
    if (status === "authenticated" && session?.user?.role) {
      const dashboardRoute =
        DASHBOARD_ROUTES[session.user.role as keyof typeof DASHBOARD_ROUTES];
      router.push(callbackUrl || dashboardRoute || "/dashboard");
    }
  }, [status, session, router, callbackUrl]);

  // Handle URL Errors
  useEffect(() => {
    if (error) {
      const errorMessages: Record<string, string> = {
        CredentialsSignin: "Invalid email or password",
        Default: "An error occurred. Please try again.",
      };
      toast.error(errorMessages[error] || errorMessages.Default);
    }
  }, [error]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const result = await signIn("credentials", {
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setErrors({ form: "Invalid credentials. Please try again." });
        toast.error("Login failed");
      } else if (result?.ok) {
        toast.success("Welcome back!", {
          description: "Redirecting to your dashboard...",
        });
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      setErrors({ form: "An unexpected error occurred." });
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex w-full bg-white text-gray-900 font-sans">
      {/* LEFT SIDE - LOGIN FORM */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm mx-auto"
        >
          {/* Logo Area */}
          <div className="mb-10">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4 fill-white" />
              </div>
              <span className="text-xl font-bold font-display tracking-tight text-gray-900">
                Thinkhall<span className="text-yellow-500">.</span>
              </span>
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2 font-display">
              Sign in to THINKHALL
            </h1>
            <p className="text-gray-500 text-sm">
              Access your learning and skill dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 ml-1">
                Email
              </label>
              <div className="relative group">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className={`
                                w-full px-4 py-3 rounded-xl bg-gray-50 border 
                                transition-all duration-200 outline-none
                                placeholder:text-gray-400 text-gray-900
                                focus:bg-white focus:ring-4 
                                ${
                                  errors.email
                                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                                    : "border-gray-200 focus:border-yellow-400 focus:ring-yellow-100 hover:border-gray-300"
                                }
                            `}
                  placeholder="name@company.com"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                  <Mail className="h-4 w-4" />
                </div>
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs ml-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-gray-500 hover:text-yellow-600 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  className={`
                                w-full px-4 py-3 rounded-xl bg-gray-50 border 
                                transition-all duration-200 outline-none
                                placeholder:text-gray-400 text-gray-900
                                focus:bg-white focus:ring-4 
                                ${
                                  errors.password
                                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                                    : "border-gray-200 focus:border-yellow-400 focus:ring-yellow-100 hover:border-gray-300"
                                }
                            `}
                  placeholder="••••••••"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                  <Lock className="h-4 w-4" />
                </div>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs ml-1">{errors.password}</p>
              )}
            </div>

            {/* Global Error */}
            {errors.form && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-100 flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                {errors.form}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="
                        w-full py-3.5 px-4 rounded-xl
                        bg-gradient-to-r from-yellow-400 to-orange-500
                        text-white font-semibold text-sm
                        shadow-lg shadow-yellow-500/20
                        hover:shadow-xl hover:shadow-yellow-500/30 hover:scale-[1.01]
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500
                        disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100
                        transition-all duration-200
                        flex items-center justify-center gap-2
                    "
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

         
        </motion.div>

        <div className="absolute bottom-6 left-6 text-xs text-gray-400 flex gap-4">
          <span>© Thinkhall Academy</span>
          <Link href="/privacy" className="hover:text-gray-600">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-gray-600">
            Terms
          </Link>
        </div>
      </div>

      {/* RIGHT SIDE - VISUAL SHOWCASE */}
      <div className="hidden lg:flex flex-1 relative bg-gray-900 overflow-hidden items-center justify-center">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-gradient-radial from-yellow-500/20 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-gradient-radial from-orange-500/20 to-transparent rounded-full blur-3xl" />
          
        </div>

        {/* Floating Content Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 max-w-md"
        >
          <div className="relative">
            {/* Decorative Elements around card */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-12 -right-12 bg-gray-800/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <div className="text-xs text-gray-400">Skill Growth</div>
                  <div className="text-sm font-bold text-white">
                    +47% Uplift
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute -bottom-8 -left-8 bg-gray-800/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <div className="text-xs text-gray-400">AI Coach</div>
                  <div className="text-sm font-bold text-white">Active Now</div>
                </div>
              </div>
            </motion.div>

            {/* Main Card */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Enterprise Grade
                  </h3>
                  <p className="text-white/60 text-sm">
                    Secure, scalable, and personalized.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "75%" }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
                  />
                </div>
                <div className="flex justify-between text-sm text-white/50">
                  <span>System Status</span>
                  <span className="text-green-400">Operational</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-white/80 italic text-sm leading-relaxed">
                  &quot;Thinkhall transformed how our managers lead. The AI
                  coaching is indistinguishable from human mentorship.&quot;
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-700 border border-white/20" />
                  <div>
                    <div className="text-xs font-bold text-white">
                      Director of L&D
                    </div>
                    <div className="text-[10px] text-white/50">
                      Fortune 500 Retailer
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
