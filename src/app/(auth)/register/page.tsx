"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

import {
  Wallet,
  Eye,
  EyeOff,
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  Shield,
  Zap,
} from "lucide-react";

type Step =
  | "info"
  | "payment"
  | "success";

export default function RegisterPage() {
  const [step, setStep] =
    useState<Step>("info");

  const [name, setName] = useState("");
  const [email, setEmail] =
    useState("");
  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(false);

  const [agreed, setAgreed] =
    useState(false);

  const { register } = useAuth();
  const router = useRouter();

  const handleInfoSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError(
        "Passwords do not match"
      );
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must be at least 8 characters"
      );
      return;
    }

    if (!agreed) {
      setError(
        "You must agree to the terms"
      );
      return;
    }

    setStep("payment");
  };

  const handlePayment =
    async () => {
      if (isLoading) return;

      setIsLoading(true);
      setError("");

      try {
        await new Promise((resolve) =>
          setTimeout(resolve, 2000)
        );

        const success =
          await register(
            name.trim(),
            email.trim(),
            password
          );

        if (success) {
          setStep("success");
        } else {
          setError(
            "This email is already registered or invalid."
          );
        }
      } catch (error) {
        console.error(error);

        setError(
          "Registration failed. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

  const handleSuccess = () => {
    router.push("/intelligence-test");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-md mx-auto flex items-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />

            <span className="text-sm font-medium">
              Back to Home
            </span>
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-green-600 flex items-center justify-center mx-auto mb-4">
              <Wallet className="w-8 h-8 text-white" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900">
              Create Account
            </h1>

            <p className="text-gray-500 mt-1">
              Start your earning journey
            </p>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2 mb-8">
            <div
              className={`flex-1 h-2 rounded-full ${
                step === "info"
                  ? "bg-green-600"
                  : "bg-green-200"
              }`}
            />

            <div
              className={`flex-1 h-2 rounded-full ${
                step === "payment" ||
                step === "success"
                  ? "bg-green-600"
                  : "bg-gray-200"
              }`}
            />

            <div
              className={`flex-1 h-2 rounded-full ${
                step === "success"
                  ? "bg-green-600"
                  : "bg-gray-200"
              }`}
            />
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />

              <p className="text-sm text-red-700">
                {error}
              </p>
            </div>
          )}

          {/* INFO STEP */}
          {step === "info" && (
            <form
              onSubmit={handleInfoSubmit}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(e) =>
                      setPassword(
                        e.target.value
                      )
                    }
                    required
                    minLength={8}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition pr-12"
                    placeholder="Min 8 characters"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
                  placeholder="Repeat password"
                />
              </div>

              <label className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) =>
                    setAgreed(
                      e.target.checked
                    )
                  }
                  className="mt-1"
                />

                <div>
                  <p className="text-sm text-amber-800 font-medium">
                    I understand this is NOT easy money
                  </p>

                  <p className="text-xs text-amber-600 mt-1">
                    I agree that Xpay
                    requires real effort.
                  </p>
                </div>
              </label>

              <button
                type="submit"
                className="w-full py-3.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition"
              >
                Continue to Payment — KSH 100
              </button>
            </form>
          )}

          {/* PAYMENT STEP */}
          {step === "payment" && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                <Zap className="w-8 h-8 text-green-600 mx-auto mb-2" />

                <h3 className="text-lg font-bold text-gray-900">
                  Registration Fee:
                  KSH 100
                </h3>

                <p className="text-sm text-gray-600 mt-1">
                  One-time payment.
                </p>
              </div>

              <button
                onClick={handlePayment}
                disabled={isLoading}
                className="w-full py-4 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition disabled:opacity-50"
              >
                {isLoading
                  ? "Processing..."
                  : "Pay with M-Pesa"}
              </button>

              <button
                onClick={() =>
                  setStep("info")
                }
                disabled={isLoading}
                className="w-full py-3 text-sm text-gray-500 hover:text-gray-700 transition"
              >
                ← Go Back
              </button>
            </div>
          )}

          {/* SUCCESS */}
          {step === "success" && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Payment Successful!
                </h3>

                <p className="text-gray-600 mt-2">
                  Your account has been
                  created.
                </p>
              </div>

              <button
                onClick={handleSuccess}
                className="w-full py-3.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition"
              >
                Take Intelligence Test →
              </button>
            </div>
          )}

          {step !== "success" && (
            <p className="text-center mt-6 text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-green-600 hover:text-green-700"
              >
                Sign In
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}