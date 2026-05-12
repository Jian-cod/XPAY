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
    
    // Parse XML to JSON
    const offers = parseCpagripRSS(xmlText);
    
    return NextResponse.json({ offers });
    
  } catch (error: any) {
    console.error('Offers fetch error:', error);
    return NextResponse.json({ error: error.message, offers: [] }, { status: 500 });
  }
}

function parseCpagripRSS(xml: string) {
  const offers: any[] = [];
  
  // Extract offer blocks using regex
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