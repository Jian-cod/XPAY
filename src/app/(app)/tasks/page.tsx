'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
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
      // Fetch from CPAGrip RSS feed through our API
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
    // Append tracking_id to CPAGrip offer link
    const separator = offer.offerlink.includes('?') ? '&' : '?'
    return `${offer.offerlink}${separator}tracking_id=${userId}`
  }

  if (loading) {
    return <div className="p-6">Loading real offers...</div>
  }

  return (
    <div className="p-6">
      <h1 className="mb-6 text-3xl font-bold">Available Offers</h1>
      
      <div className="mb-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
        <p className="text-sm text-blue-800">
          Complete these offers to earn real money. Rewards are credited automatically upon completion.
        </p>
      </div>

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
            
            <h2 className="text-xl font-semibold">{offer.title}</h2>
            <p className="mt-2 text-sm text-gray-600">{offer.description}</p>
            
            <div className="mt-4 space-y-1 text-sm">
              <p>Reward: <strong>KES {Math.round(offer.payout * 130)}</strong></p>
              <p>Category: {offer.category || 'Offer'}</p>
              <p>Provider: CPAGrip</p>
            </div>

            <div className="mt-5 space-y-3">
              <a
                href={getOfferLink(offer)}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center rounded-lg bg-black px-4 py-3 text-white transition hover:opacity-90"
              >
                Start Offer
              </a>
            </div>
          </div>
        ))}
      </div>

      {offers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No offers available for your region right now.</p>
          <p className="text-sm text-gray-400 mt-2">Check back later for new offers.</p>
        </div>
      )}
    </div>
  )
}