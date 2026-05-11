import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const body = await request.json();

  const { data, error } = await supabase
    .from("test_results")
    .insert({
      user_id: body.user_id,
      score: body.score,
      total_questions: body.total_questions,
      passed: body.passed,
      cheat_detected: body.cheat_detected,
      tab_switches: body.tab_switches,
      time_spent_seconds: body.time_spent_seconds,
      answers: body.answers,
      status: body.cheat_detected ? "cheating_detected" : body.passed ? "passed" : "failed"
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Update user test status if passed
  if (body.passed && !body.cheat_detected) {
    await supabase
      .from("users")
      .update({ test_passed: true, test_attempts: supabase.rpc("increment", { row_id: body.user_id }) })
      .eq("id", body.user_id);
  }

  return NextResponse.json({ result: data });
}
