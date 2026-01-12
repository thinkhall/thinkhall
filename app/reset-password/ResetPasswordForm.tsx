// app/reset-password/ResetPasswordForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  validateResetToken,
  resetPasswordWithToken,
} from "@/app/actions/password-reset";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, CheckCircle, XCircle, Loader2 } from "lucide-react";

interface TokenData {
  tokenId: string;
  userId: string;
  userName: string;
  userEmail: string;
  isNewUser: boolean;
}

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [error, setError] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Password validation
  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const isPasswordValid =
    Object.values(passwordChecks).filter(Boolean).length >= 4;
  const passwordsMatch = password === confirmPassword && password.length > 0;

  useEffect(() => {
    async function validate() {
      if (!token) {
        setIsValidating(false);
        setError("No reset token provided");
        return;
      }

      const result = await validateResetToken(token);
      setIsValidating(false);

      if (result.success && result.data) {
        setIsValid(true);
        setTokenData(result.data);
      } else {
        setError(result.error || "Invalid or expired token");
      }
    }

    validate();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPasswordValid) {
      toast.error("Password does not meet requirements");
      return;
    }

    if (!passwordsMatch) {
      toast.error("Passwords do not match");
      return;
    }

    if (!token) return;

    setIsSubmitting(true);
    const result = await resetPasswordWithToken(token, password);
    setIsSubmitting(false);

    if (result.success) {
      setIsSuccess(true);
      toast.success("Password set successfully!");
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } else {
      toast.error(result.error || "Failed to reset password");
    }
  };

  // Loading state
  if (isValidating) {
    return (
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-800">
          Validating your link...
        </h2>
        <p className="text-gray-500 mt-2">Please wait a moment</p>
      </div>
    );
  }

  // Invalid token state
  if (!isValid) {
    return (
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <XCircle className="h-8 w-8 text-red-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Invalid or Expired Link
        </h2>
        <p className="text-gray-500 mb-6">{error}</p>
        <a
          href="/login"
          className="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Go to Login
        </a>
      </div>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Password Set Successfully!
        </h2>
        <p className="text-gray-500 mb-6">Redirecting you to login...</p>
        <Loader2 className="h-6 w-6 text-blue-600 animate-spin mx-auto" />
      </div>
    );
  }

  // Password form
  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="h-8 w-8 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          {tokenData?.isNewUser ? "Set Your Password" : "Reset Your Password"}
        </h1>
        <p className="text-gray-500 mt-2">
          {tokenData?.isNewUser
            ? `Welcome, ${tokenData.userName}! Create a password to access your account.`
            : `Enter a new password for ${tokenData?.userEmail}`}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Password Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all pr-12"
              placeholder="Enter your new password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Password Requirements */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <p className="text-xs font-medium text-gray-600 mb-2">
            Password must have at least 4 of:
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <RequirementCheck
              met={passwordChecks.length}
              text="8+ characters"
            />
            <RequirementCheck
              met={passwordChecks.uppercase}
              text="Uppercase letter"
            />
            <RequirementCheck
              met={passwordChecks.lowercase}
              text="Lowercase letter"
            />
            <RequirementCheck met={passwordChecks.number} text="Number" />
            <RequirementCheck
              met={passwordChecks.special}
              text="Special character"
            />
          </div>
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all pr-12 ${
                confirmPassword && !passwordsMatch
                  ? "border-red-300"
                  : "border-gray-300"
              }`}
              placeholder="Confirm your new password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {confirmPassword && !passwordsMatch && (
            <p className="text-xs text-red-500">Passwords do not match</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !isPasswordValid || !passwordsMatch}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Setting Password...
            </>
          ) : (
            "Set Password"
          )}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Remember your password?{" "}
        <a href="/login" className="text-blue-600 hover:underline font-medium">
          Sign in
        </a>
      </p>
    </div>
  );
}

function RequirementCheck({ met, text }: { met: boolean; text: string }) {
  return (
    <div
      className={`flex items-center gap-1.5 ${
        met ? "text-green-600" : "text-gray-400"
      }`}
    >
      {met ? (
        <CheckCircle className="h-3.5 w-3.5" />
      ) : (
        <div className="h-3.5 w-3.5 rounded-full border border-current" />
      )}
      <span>{text}</span>
    </div>
  );
}
