import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const consumerKey =
      process.env.DARAJA_CONSUMER_KEY

    const consumerSecret =
      process.env.DARAJA_CONSUMER_SECRET

    const auth = Buffer.from(
      `${consumerKey}:${consumerSecret}`
    ).toString('base64')

    const response = await fetch(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    )

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        error: 'Failed to generate token',
      },
      {
        status: 500,
      }
    )
  }
}