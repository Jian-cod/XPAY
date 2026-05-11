"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

import {
  Shield,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

const QUESTION_BANK = [
  {
    id: 1,
    question:
      "If a task pays 150 points and Xpay takes 30%, how many points do you earn?",
    options: [
      "45 pts",
      "105 pts",
      "150 pts",
      "195 pts",
    ],
    correct: 1,
  },

  {
    id: 2,
    question:
      "Your streak is 13 days. You miss today. What happens?",
    options: [
      "Streak becomes 14",
      "Streak resets to 0",
      "Streak stays at 13",
      "You lose 1 day only",
    ],
    correct: 1,
  },

  {
    id: 3,
    question:
      "Minimum withdrawal for Free tier is:",
    options: [
      "KSH 100",
      "KSH 1,000",
      "KSH 3,250",
      "KSH 6,500",
    ],
    correct: 3,
  },

  {
    id: 4,
    question:
      "A survey disqualifies you. What percentage of attempts typically fail?",
    options: [
      "10-25%",
      "30-50%",
      "75-92%",
      "100%",
    ],
    correct: 2,
  },

  {
    id: 5,
    question:
      "You need 3 rejections to get banned for how many days?",
    options: [
      "1 day",
      "3 days",
      "7 days",
      "30 days",
    ],
    correct: 2,
  },

  {
    id: 6,
    question:
      "Pro tier costs KSH ___ per month and gives you ___ tasks/day.",
    options: [
      "325 / 1",
      "650 / 3",
      "1,300 / 5",
      "100 / unlimited",
    ],
    correct: 1,
  },

  {
    id: 7,
    question:
      "What is the withdrawal fee approximately?",
    options: [
      "0%",
      "5.1%",
      "11.1%",
      "30%",
    ],
    correct: 2,
  },

  {
    id: 8,
    question:
      "If you withdraw KSH 9,000, what fee do you pay first?",
    options: [
      "KSH 100",
      "KSH 500",
      "KSH 1,000",
      "KSH 9,000",
    ],
    correct: 2,
  },

  {
    id: 9,
    question:
      "Elite tier requires a ___ day streak.",
    options: [
      "7",
      "14",
      "21",
      "30",
    ],
    correct: 1,
  },

  {
    id: 10,
    question:
      "Xpay Advance lets you withdraw early with a fee of:",
    options: [
      "0.5%",
      "2.6%",
      "5%",
      "11.1%",
    ],
    correct: 1,
  },
];

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];

  for (
    let i = shuffled.length - 1;
    i > 0;
    i--
  ) {
    const j = Math.floor(
      Math.random() * (i + 1)
    );

    [shuffled[i], shuffled[j]] = [
      shuffled[j],
      shuffled[i],
    ];
  }

  return shuffled;
}

export default function IntelligenceTestPage() {
  const [questions, setQuestions] =
    useState<typeof QUESTION_BANK>([]);

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [selectedAnswer, setSelectedAnswer] =
    useState<number | null>(null);

  const [score, setScore] = useState(0);

  const [tabSwitches, setTabSwitches] =
    useState(0);

  const [timeLeft, setTimeLeft] =
    useState(120);

  const [isFinished, setIsFinished] =
    useState(false);

  const [isCheating, setIsCheating] =
    useState(false);

  const [copyAttempts, setCopyAttempts] =
    useState(0);

  const [rightClicks, setRightClicks] =
    useState(0);

  const [showResults, setShowResults] =
    useState(false);

  const router = useRouter();

  const { user } = useAuth();

  // SHUFFLE QUESTIONS
  useEffect(() => {
    const shuffled = shuffleArray(
      QUESTION_BANK
    ).slice(0, 7);

    setQuestions(shuffled);
  }, []);

  // TIMER
  useEffect(() => {
    if (
      isFinished ||
      questions.length === 0
    )
      return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleNext();
          return 120;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [
    currentIndex,
    isFinished,
    questions.length,
  ]);

  // TAB SWITCH DETECTION
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitches((prev) => prev + 1);

        if (tabSwitches >= 2) {
          setIsCheating(true);
        }
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () =>
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
  }, [tabSwitches]);

  // COPY/RIGHT CLICK BLOCKING
  useEffect(() => {
    const handleCopy = (
      e: ClipboardEvent
    ) => {
      e.preventDefault();

      setCopyAttempts((prev) => prev + 1);

      if (copyAttempts >= 2) {
        setIsCheating(true);
      }
    };

    const handleContextMenu = (
      e: MouseEvent
    ) => {
      e.preventDefault();

      setRightClicks((prev) => prev + 1);

      if (rightClicks >= 3) {
        setIsCheating(true);
      }
    };

    document.addEventListener(
      "copy",
      handleCopy
    );

    document.addEventListener(
      "cut",
      handleCopy
    );

    document.addEventListener(
      "contextmenu",
      handleContextMenu
    );

    return () => {
      document.removeEventListener(
        "copy",
        handleCopy
      );

      document.removeEventListener(
        "cut",
        handleCopy
      );

      document.removeEventListener(
        "contextmenu",
        handleContextMenu
      );
    };
  }, [copyAttempts, rightClicks]);

  const handleAnswer = (
    index: number
  ) => {
    setSelectedAnswer(index);
  };

  const handleNext = useCallback(() => {
    if (
      selectedAnswer !== null &&
      selectedAnswer ===
        questions[currentIndex]?.correct
    ) {
      setScore((prev) => prev + 1);
    }

    setSelectedAnswer(null);

    setTimeLeft(120);

    if (
      currentIndex >=
      questions.length - 1
    ) {
      setIsFinished(true);
      setShowResults(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [
    selectedAnswer,
    currentIndex,
    questions,
  ]);

  // FINISH TEST
  const handleFinish = async () => {
    const passed =
      score >= 5 &&
      !isCheating &&
      tabSwitches < 3;

    if (!user) {
      router.push("/login");
      return;
    }

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          has_passed_test: passed,
          intelligence_score: score,
        })
        .eq("id", user.id);

      if (error) {
        console.error(error.message);
      }

      if (passed) {
        router.push("/dashboard");
      } else {
        setShowResults(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatTime = (
    seconds: number
  ) => {
    const mins = Math.floor(seconds / 60);

    const secs = seconds % 60;

    return `${mins}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // CHEATING SCREEN
  if (isCheating) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-xl">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />

          <h2 className="text-2xl font-bold text-red-600 mb-2">
            Test Failed — Cheating Detected
          </h2>

          <p className="text-gray-600 mb-4">
            Suspicious activity detected.
          </p>

          <Link
            href="/"
            className="inline-block px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  // RESULTS
  if (showResults) {
    const passed =
      score >= 5 &&
      !isCheating &&
      tabSwitches < 3;

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-xl">
          {passed ? (
            <>
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />

              <h2 className="text-2xl font-bold text-green-600 mb-2">
                Test Passed!
              </h2>

              <p className="text-gray-600 mb-4">
                You scored {score}/
                {questions.length}
              </p>

              <button
                onClick={handleFinish}
                className="w-full py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition"
              >
                Go to Dashboard →
              </button>
            </>
          ) : (
            <>
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />

              <h2 className="text-2xl font-bold text-red-600 mb-2">
                Test Failed
              </h2>

              <p className="text-gray-600 mb-4">
                You scored {score}/
                {questions.length}
              </p>

              <Link
                href="/"
                className="inline-block px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium"
              >
                Return Home
              </Link>
            </>
          )}
        </div>
      </div>
    );
  }

  const currentQuestion =
    questions[currentIndex];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* HEADER */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-green-600" />

              <h1 className="text-xl font-bold text-gray-900">
                Intelligence Test
              </h1>
            </div>

            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-100 text-gray-700">
              <Clock className="w-4 h-4" />

              <span className="text-sm font-mono font-bold">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all"
              style={{
                width: `${
                  ((currentIndex + 1) /
                    questions.length) *
                  100
                }%`,
              }}
            />
          </div>
        </div>

        {/* QUESTION */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            {currentQuestion.question}
          </h2>

          <div className="space-y-3">
            {currentQuestion.options.map(
              (option, index) => (
                <button
                  key={index}
                  onClick={() =>
                    handleAnswer(index)
                  }
                  className={`w-full p-4 rounded-xl border-2 text-left transition ${
                    selectedAnswer === index
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className="font-medium text-gray-900">
                    {option}
                  </span>
                </button>
              )
            )}
          </div>

          <button
            onClick={handleNext}
            disabled={selectedAnswer === null}
            className="w-full mt-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition disabled:opacity-50"
          >
            {currentIndex ===
            questions.length - 1
              ? "Finish Test"
              : "Next Question →"}
          </button>
        </div>

        {/* FOOTER */}
        <div className="mt-6 flex items-center justify-between text-xs text-gray-500">
          <span>
            Tab switches: {tabSwitches}
          </span>

          <span>
            Current score: {score}
          </span>
        </div>
      </div>
    </div>
  );
}