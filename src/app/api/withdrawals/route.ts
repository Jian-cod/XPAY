import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const body = await request.json();

  const fee = Math.ceil(body.amount / 9);

  const { data, error } = await supabase
    .from("withdrawal_requests")
    .insert({
      user_id: body.user_id,
      amount: body.amount,
      currency: body.currency || "ksh",
      fee_amount: fee,
      net_amount: body.amount,
      status: "pending_fee"
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ withdrawal: data, fee });
}
