"use client";

import { useState } from "react";
import { TrendingUp, AlertTriangle, CheckCircle, Clock, Info } from "lucide-react";

export default function AdvancePage() {
  const [sliderValue, setSliderValue] = useState(50);
  const [step, setStep] = useState<"calculate" | "confirm" | "success">("calculate");

  const earnedBalance = 1250; // points
  const maxAdvance = Math.floor(earnedBalance * 0.5); // 50% of earned
  const advancePoints = Math.floor((sliderValue / 100) * maxAdvance);
  const advanceKSH = Math.floor(advancePoints * 1.3); // 1 point = ~KSH 1.3
  const fee = Math.round(advanceKSH * 0.026); // 2.6%
  const netAmount = advanceKSH - fee;
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 30);

  const eligibility = {
    accountAge: 18,
    minAge: 30,
    tasksCompleted: 47,
    minTasks: 25,
    approvalRate: 82,
    minApproval: 75,
    previousAdvance: false,
  };

  const isEligible = 
    eligibility.accountAge >= eligibility.minAge &&
    eligibility.tasksCompleted >= eligibility.minTasks &&
    eligibility.approvalRate >= eligibility.minApproval &&
    !eligibility.previousAdvance;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Xpay Advance</h2>
        <p className="text-gray-500">Access up to 50% of your earned balance early. No penalties if you can't repay.</p>
      </div>

      {/* Eligibility Check */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Eligibility Check</h3>
        <div className="grid md:grid-cols-2 gap-3">
          <EligibilityRow 
            label="Account Age (30+ days)"
            current={eligibility.accountAge}
            target={eligibility.minAge}
            met={eligibility.accountAge >= eligibility.minAge}
          />
          <EligibilityRow 
            label="Tasks Completed (25+)"
            current={eligibility.tasksCompleted}
            target={eligibility.minTasks}
            met={eligibility.tasksCompleted >= eligibility.minTasks}
          />
          <EligibilityRow 
            label="Approval Rate (75%+)"
            current={eligibility.approvalRate}
            target={eligibility.minApproval}
            met={eligibility.approvalRate >= eligibility.minApproval}
          />
          <EligibilityRow 
            label="No Active Advance"
            current={eligibility.previousAdvance ? 0 : 1}
            target={1}
            met={!eligibility.previousAdvance}
          />
        </div>

        {!isEligible && (
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-700">
              You don't meet all eligibility requirements yet. Keep grinding to unlock Xpay Advance.
            </p>
          </div>
        )}
      </div>

      {isEligible && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          {step === "calculate" && (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-sm text-gray-500">Earned Balance</p>
                <p className="text-3xl font-bold text-gray-900">{earnedBalance.toLocaleString()} pts</p>
                <p className="text-sm text-gray-500">~KSH {(earnedBalance * 1.3).toLocaleString()}</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Advance Amount</span>
                  <span className="text-lg font-bold text-primary-600">KSH {advanceKSH.toLocaleString()}</span>
                </div>
                <input 
                  type="range"
                  min="10"
                  max="100"
                  value={sliderValue}
                  onChange={(e) => setSliderValue(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Min: KSH {Math.floor(maxAdvance * 0.1 * 1.3).toLocaleString()}</span>
                  <span>Max: KSH {Math.floor(maxAdvance * 1.3).toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Advance Amount</span>
                  <span className="font-bold text-gray-900">KSH {advanceKSH.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Processing Fee (2.6%)</span>
                  <span className="font-bold text-danger-600">KSH {fee.toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between">
                  <span className="text-gray-600">You Receive</span>
                  <span className="font-bold text-primary-700">KSH {netAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Due Date</span>
                  <span className="font-bold text-gray-900">{dueDate.toLocaleDateString()}</span>
                </div>
              </div>

              <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 flex items-start gap-3">
                <Info className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-primary-700">No Penalty Repayment</p>
                  <p className="text-xs text-primary-600 mt-1">
                    If you can't repay by the due date, the advance is simply deducted from your future earnings. No interest, no penalties, no credit damage.
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setStep("confirm")}
                className="w-full py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition"
              >
                Request KSH {advanceKSH.toLocaleString()} Advance
              </button>
            </div>
          )}

          {step === "confirm" && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                <TrendingUp className="w-8 h-8 text-primary-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Confirm Xpay Advance</h3>
                <p className="text-gray-500 mt-2">Review the terms before confirming</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-left space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Advance Amount</span>
                  <span className="font-bold">KSH {advanceKSH.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Fee (2.6%)</span>
                  <span className="font-bold text-danger-600">KSH {fee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Net Received</span>
                  <span className="font-bold text-primary-700">KSH {netAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Repayment Due</span>
                  <span className="font-bold">{dueDate.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Repayment Method</span>
                  <span className="font-bold">Auto-deduct from earnings</span>
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left">
                <p className="text-sm text-amber-800">
                  <strong>Terms:</strong> The advance amount will be automatically deducted from your future task earnings. 
                  If your earnings don't cover the full amount by the due date, the remaining balance carries over. 
                  No late fees. No penalties. No impact on your account standing.
                </p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setStep("calculate")}
                  className="flex-1 py-3 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                  Back
                </button>
                <button 
                  onClick={() => setStep("success")}
                  className="flex-1 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition"
                >
                  I Agree — Request Advance
                </button>
              </div>
            </div>
          )}

          {step === "success" && (
            <div className="text-center space-y-6 py-8">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-primary-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Advance Requested!</h3>
                <p className="text-gray-500 mt-2">KSH {netAmount.toLocaleString()} will be sent to your M-Pesa</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-left space-y-2">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary-500" />
                  <span className="text-sm text-gray-700">Request submitted</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-amber-500" />
                  <span className="text-sm text-gray-700">Processing (24-36 hours)</span>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-gray-300" />
                  <span className="text-sm text-gray-400">Repayment auto-starts from next earnings</span>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Payment may take <strong>24-36 working hours</strong> to process.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function EligibilityRow({ label, current, target, met }: { label: string; current: number; target: number; met: boolean }) {
  return (
    <div className={`flex items-center justify-between p-3 rounded-xl ${met ? "bg-primary-50 border border-primary-200" : "bg-gray-50 border border-gray-100"}`}>
      <div className="flex items-center gap-2">
        {met ? (
          <CheckCircle className="w-4 h-4 text-primary-500" />
        ) : (
          <AlertTriangle className="w-4 h-4 text-gray-400" />
        )}
        <span className={`text-sm ${met ? "text-primary-700" : "text-gray-600"}`}>{label}</span>
      </div>
      <span className={`text-sm font-bold ${met ? "text-primary-700" : "text-gray-400"}`}>
        {current >= target ? "✓" : `${current}/${target}`}
      </span>
    </div>
  );
}
