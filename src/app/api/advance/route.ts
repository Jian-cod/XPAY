import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const body = await request.json();

  const fee = Math.round(body.amount * 0.026);
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 30);

  const { data, error } = await supabase
    .from("advance_requests")
    .insert({
      user_id: body.user_id,
      amount: body.amount,
      fee_amount: fee,
      total_repayment: body.amount,
      due_date: dueDate.toISOString().split("T")[0],
      status: "pending"
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ advance: data, fee });
}
