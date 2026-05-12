import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'guest';
    
    // Fetch from CPAGrip RSS feed
    const cpagripUrl = `https://www.cpagrip.com/common/offer_feed_rss.php?user_id=2526699&key=312f554801f00416c51fbf168eed2e6c&limit=20&tracking_id=${encodeURIComponent(userId)}`;
    
    const response = await fetch(cpagripUrl, {
      headers: {
        'User-Agent': request.headers.get('user-agent') || 'Mozilla/5.0'
      }
    });
    
    const xmlText = await response.text();
    const offers = parseCpagripRSS(xmlText);
    
    // If no offers from CPAGrip, return fallback offers
    if (offers.length === 0) {
      const fallbackOffers = getFallbackOffers(userId);
      return NextResponse.json({ offers: fallbackOffers, source: 'fallback' });
    }
    
    return NextResponse.json({ offers, source: 'cpagrip' });
    
  } catch (error: any) {
    console.error('Offers fetch error:', error);
    // Return fallback on error too
    const fallbackOffers = getFallbackOffers('guest');
    return NextResponse.json({ offers: fallbackOffers, source: 'fallback', error: error.message });
  }
}

function parseCpagripRSS(xml: string) {
  const offers: any[] = [];
  const offerRegex = /<offer>([\s\S]*?)<\/offer>/g;
  let match;
  
  while ((match = offerRegex.exec(xml)) !== null) {
    const offerBlock = match[1];
    const id = extractTag(offerBlock, 'id');
    const title = extractTag(offerBlock, 'title');
    const description = extractTag(offerBlock, 'description');
    const payout = parseFloat(extractTag(offerBlock, 'payout') || '0');
    const offerlink = extractTag(offerBlock, 'offerlink');
    const offerphoto = extractTag(offerBlock, 'offerphoto');
    const category = extractTag(offerBlock, 'category');
    
    if (id && title) {
      offers.push({
        id,
        title,
        description,
        payout,
        offerlink,
        offerphoto,
        category
      });
    }
  }
  
  return offers;
}

function extractTag(xml: string, tag: string): string | null {
  const regex = new RegExp(`<${tag}>([^<]*)</${tag}>`, 'i');
  const match = xml.match(regex);
  return match ? match[1].trim() : null;
}

function getFallbackOffers(userId: string) {
  return [
    {
      id: 'fallback_1',
      title: 'Complete a Quick Survey',
      description: 'Share your opinion and earn rewards. Takes 5-10 minutes.',
      payout: 0.50,
      offerlink: `https://www.cpagrip.com/show.php?u=2526699&id=1234&tracking_id=${userId}`,
      offerphoto: '',
      category: 'Survey'
    },
    {
      id: 'fallback_2',
      title: 'Install Mobile App',
      description: 'Download and install a free app on your phone. Open it once to complete.',
      payout: 1.00,
      offerlink: `https://www.cpagrip.com/show.php?u=2526699&id=1235&tracking_id=${userId}`,
      offerphoto: '',
      category: 'App Install'
    },
    {
      id: 'fallback_3',
      title: 'Register for Free Trial',
      description: 'Sign up for a free trial service. No credit card required.',
      payout: 2.00,
      offerlink: `https://www.cpagrip.com/show.php?u=2526699&id=1236&tracking_id=${userId}`,
      offerphoto: '',
      category: 'Registration'
    },
    {
      id: 'fallback_4',
      title: 'Watch Video Ads',
      description: 'Watch short promotional videos and earn per view.',
      payout: 0.25,
      offerlink: `https://www.cpagrip.com/show.php?u=2526699&id=1237&tracking_id=${userId}`,
      offerphoto: '',
      category: 'Video'
    },
    {
      id: 'fallback_5',
      title: 'Refer 3 Friends',
      description: 'Invite friends to join XPAY. Earn when they complete their first task.',
      payout: 1.50,
      offerlink: `https://xpay-jcya.vercel.app/referrals`,
      offerphoto: '',
      category: 'Referral'
    }
  ];
}