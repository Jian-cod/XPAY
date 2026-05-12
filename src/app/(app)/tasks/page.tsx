'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface CpagripOffer {
  id: string
  title: string
  description: string
  payout: number
  offerlink: string
  offerphoto: string
  category: string
}

interface UserTask {
  task_id: string
}

export default function TasksPage() {
  const [offers, setOffers] = useState<CpagripOffer[]>([])
  const [completedTasks, setCompletedTasks] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string>('')

  const router = useRouter()

  useEffect(() => {
    fetchUserAndOffers()
    fetchCompletedTasks()
  }, [])

  const fetchUserAndOffers = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      setLoading(false)
      return
    }
    
    setUserId(user.id)
    await fetchCpagripOffers(user.id)
  }

  const fetchCpagripOffers = async (uid: string) => {
    try {
      const response = await fetch(`/api/offers?userId=${uid}`)
      const data = await response.json()
      
      if (data.offers) {
        setOffers(data.offers)
      }
    } catch (error) {
      console.error('Error fetching offers:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCompletedTasks = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('user_tasks')
      .select('task_id')
      .eq('user_id', user.id)

    if (!error && data) {
      setCompletedTasks(data.map((item: UserTask) => item.task_id))
    }
  }

  const getOfferLink = (offer: CpagripOffer) => {
    const separator = offer.offerlink.includes('?') ? '&' : '?'
    return `${offer.offerlink}${separator}tracking_id=${userId}`
  }

  if (loading) {
    return <div className="p-6">Loading tasks...</div>
  }

  return (
    <div className="p-6">
      <h1 className="mb-6 text-3xl font-bold">Earn Money</h1>
      
      {/* CPX Research Surveys - Main Feature */}
      <div className="mb-8 p-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl text-white">
        <h2 className="text-2xl font-bold mb-2">Paid Surveys</h2>
        <p className="mb-4">The best way to earn! Complete surveys and get paid instantly.</p>
        <Link 
          href="/surveys"
          className="inline-block px-6 py-3 bg-white text-purple-600 font-bold rounded-xl hover:bg-gray-100 transition"
        >
          Go to Surveys →
        </Link>
      </div>

      {/* CPAGrip Special Offers */}
      <h2 className="text-xl font-bold mb-4">Special Offers</h2>
      
      {offers.length === 0 ? (
        <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 text-center">
          <p className="text-gray-500">No special offers available in your region right now.</p>
          <p className="text-sm text-gray-400 mt-2">Check out the surveys above for guaranteed earnings!</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {offers.map((offer) => (
            <div key={offer.id} className="rounded-xl border bg-white p-5 shadow-sm">
              {offer.offerphoto && (
                <img 
                  src={offer.offerphoto} 
                  alt={offer.title}
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
              )}
              
              <h3 className="text-lg font-semibold">{offer.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{offer.description}</p>
              
              <div className="mt-4 space-y-1 text-sm">
                <p>Reward: <strong>KES {Math.round(offer.payout * 130)}</strong></p>
                <p>Category: {offer.category || 'Offer'}</p>
                <p>Provider: CPAGrip</p>
              </div>

              <a
                href={getOfferLink(offer)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 block w-full text-center rounded-lg bg-black px-4 py-3 text-white transition hover:opacity-90"
              >
                Start Offer
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}