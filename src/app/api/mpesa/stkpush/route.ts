import { NextRequest, NextResponse } from 'next/server'

function generateTimestamp() {
  const date = new Date()

  const year = date.getFullYear()

  const month = String(
    date.getMonth() + 1
  ).padStart(2, '0')

  const day = String(
    date.getDate()
  ).padStart(2, '0')

  const hours = String(
    date.getHours()
  ).padStart(2, '0')

  const minutes = String(
    date.getMinutes()
  ).padStart(2, '0')

  const seconds = String(
    date.getSeconds()
  ).padStart(2, '0')

  return `${year}${month}${day}${hours}${minutes}${seconds}`
}

export async function POST(
  request: NextRequest
) {
  try {
    const body = await request.json()

    const { phone, amount } = body

    const consumerKey =
      process.env.DARAJA_CONSUMER_KEY

    const consumerSecret =
      process.env.DARAJA_CONSUMER_SECRET

    const shortcode = '174379'

    const passkey =
      'YOUR_DARAJA_PASSKEY'

    const callbackUrl =
      'https://yourdomain.com/api/mpesa/callback'

    const auth = Buffer.from(
      `${consumerKey}:${consumerSecret}`
    ).toString('base64')

    // GET ACCESS TOKEN
    const tokenResponse = await fetch(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    )

    const tokenData =
      await tokenResponse.json()

    const accessToken =
      tokenData.access_token

    // GENERATE PASSWORD
    const timestamp =
      generateTimestamp()

    const password = Buffer.from(
      shortcode + passkey + timestamp
    ).toString('base64')

    // STK PUSH REQUEST
    const stkResponse = await fetch(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        method: 'POST',

        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type':
            'application/json',
        },

        body: JSON.stringify({
          BusinessShortCode:
            shortcode,

          Password: password,

          Timestamp: timestamp,

          TransactionType:
            'CustomerPayBillOnline',

          Amount: amount,

          PartyA: phone,

          PartyB: shortcode,

          PhoneNumber: phone,

          CallBackURL: callbackUrl,

          AccountReference:
            'XPAY',

          TransactionDesc:
            'XPAY Payment',
        }),
      }
    )

    const stkData =
      await stkResponse.json()

    return NextResponse.json(
      stkData
    )
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        error:
          'STK Push failed',
      },
      {
        status: 500,
      }
    )
  }
}