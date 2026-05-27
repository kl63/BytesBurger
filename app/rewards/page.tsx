'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Gift, Trophy, History, ArrowLeft, Star, CheckCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { 
  redeemReward,
  type RewardsTier,
  type Reward,
  type RewardsRedemption,
  type PointsTransaction
} from '@/lib/supabase/rewards'

export default function RewardsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [userRewards, setUserRewards] = useState<{ rewards_points: number; rewards_tier: string } | null>(null)
  const [tiers, setTiers] = useState<RewardsTier[]>([])
  const [catalog, setCatalog] = useState<Reward[]>([])
  const [redemptions, setRedemptions] = useState<RewardsRedemption[]>([])
  const [pointsHistory, setPointsHistory] = useState<PointsTransaction[]>([])
  const [redeeming, setRedeeming] = useState<string | null>(null)

  const loadRewardsData = useCallback(async () => {
    if (!user?.id) {
      console.log('⚠️ No user ID, skipping rewards load')
      return
    }
    
    console.log('🎁 Loading rewards data for user:', user.id)
    setLoading(true)
    try {
      const response = await fetch(`/api/rewards?userId=${user.id}`)
      
      if (!response.ok) {
        console.error('❌ API request failed:', response.status)
        throw new Error(`API returned ${response.status}`)
      }
      
      const data = await response.json()
      
      const [rewards, tiersData, catalogData, redemptionsData, historyData] = [
        data.userRewards || { rewards_points: 0, rewards_tier: 'bronze' },
        data.tiers || [],
        data.catalog || [],
        data.redemptions || [],
        data.pointsHistory || []
      ]
      
      console.log('✅ Rewards data loaded successfully')
      
      setUserRewards(rewards)
      setTiers(tiersData)
      setCatalog(catalogData)
      setRedemptions(redemptionsData)
      setPointsHistory(historyData)
    } catch (error) {
      console.error('❌ Error loading rewards data:', error)
      // Set default values on error
      setUserRewards({ rewards_points: 0, rewards_tier: 'bronze' })
      setTiers([])
      setCatalog([])
      setRedemptions([])
      setPointsHistory([])
    } finally {
      setLoading(false)
    }
  }, [user])

  const handleRedeem = async (rewardId: string) => {
    if (!user?.id) return
    
    setRedeeming(rewardId)
    try {
      const result = await redeemReward(user.id, rewardId)
      
      if (result.success && result.discountCode) {
        alert(
          `🎉 Reward Redeemed Successfully!\n\n` +
          `Points Used: ${result.pointsUsed}\n\n` +
          `Your Discount Code:\n${result.discountCode}\n\n` +
          `Use this code at checkout to apply your reward!`
        )
        // Reload data to show updated points
        await loadRewardsData()
      } else {
        alert(result.message || 'Failed to redeem reward')
      }
    } catch (error) {
      console.error('Error redeeming reward:', error)
      alert('Failed to redeem reward. Please try again.')
    } finally {
      setRedeeming(null)
    }
  }

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    // eslint-disable-next-line
    void loadRewardsData()
  }, [user, router, loadRewardsData])

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'from-amber-600 to-amber-800'
      case 'silver': return 'from-gray-400 to-gray-600'
      case 'gold': return 'from-yellow-400 to-yellow-600'
      case 'platinum': return 'from-slate-300 to-slate-500'
      default: return 'from-gray-500 to-gray-700'
    }
  }

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'bronze': return '🥉'
      case 'silver': return '🥈'
      case 'gold': return '🥇'
      case 'platinum': return '💎'
      default: return '⭐'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading rewards...</div>
      </div>
    )
  }

  if (!userRewards) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-900 flex items-center justify-center">
        <div className="text-white text-2xl">Unable to load rewards data</div>
      </div>
    )
  }

  const currentTier = tiers.find(t => t.name === userRewards.rewards_tier)
  const nextTier = tiers.find(t => t.min_points > userRewards.rewards_points)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-gray-300 hover:text-white mb-6"
          >
            <ArrowLeft className="mr-2 w-5 h-5" />
            Back
          </Button>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-black mb-4">
            <span className="bg-gradient-to-r from-orange-400 via-red-500 to-orange-500 bg-clip-text text-transparent">
              Rewards
            </span>
          </h1>
          <p className="text-xl text-gray-300">
            Earn points, unlock rewards, and enjoy exclusive benefits!
          </p>
        </motion.div>

        {/* Points & Tier Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className={`bg-gradient-to-r ${getTierColor(userRewards.rewards_tier)} rounded-3xl p-8 shadow-2xl`}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-6xl">{getTierIcon(userRewards.rewards_tier)}</span>
                  <h2 className="text-4xl font-black text-white capitalize">
                    {userRewards.rewards_tier} Member
                  </h2>
                </div>
                <p className="text-white/80 text-lg">
                  {currentTier?.benefits.join(' • ')}
                </p>
              </div>
              
              <div className="text-center">
                <p className="text-white/80 text-lg mb-2">Your Points</p>
                <p className="text-6xl font-black text-white">
                  {userRewards.rewards_points.toLocaleString()}
                </p>
                {nextTier && (
                  <p className="text-white/70 text-sm mt-2">
                    {nextTier.min_points - userRewards.rewards_points} points to {nextTier.name}
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tier Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <div className="bg-gray-800/50 border-2 border-orange-500/20 rounded-2xl p-6">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-orange-500" />
              Tier Progress
            </h3>
            <div className="space-y-4">
              {tiers.map((tier) => (
                <div
                  key={tier.id}
                  className={`flex items-center gap-4 p-4 rounded-xl ${
                    tier.name === userRewards.rewards_tier
                      ? 'bg-orange-500/20 border-2 border-orange-500'
                      : 'bg-gray-700/30'
                  }`}
                >
                  <span className="text-3xl">{getTierIcon(tier.name)}</span>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-white capitalize">{tier.name}</span>
                      <span className="text-gray-300">{tier.min_points} points</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-orange-500 to-red-600 h-2 rounded-full transition-all"
                        style={{
                          width: `${Math.min(100, (userRewards.rewards_points / tier.min_points) * 100)}%`
                        }}
                      />
                    </div>
                  </div>
                  {tier.name === userRewards.rewards_tier && (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Rewards Catalog */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <div className="bg-gray-800/50 border-2 border-orange-500/20 rounded-2xl p-6">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Gift className="w-6 h-6 text-orange-500" />
              Available Rewards
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {catalog.map((reward) => (
                <div
                  key={reward.id}
                  className="bg-gray-900/50 border border-gray-700 rounded-xl p-4 hover:border-orange-500/50 transition-all"
                >
                  <h4 className="font-bold text-white text-lg mb-2">{reward.name}</h4>
                  <p className="text-gray-400 text-sm mb-4">{reward.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-orange-500 font-bold">
                      {reward.points_cost} pts
                    </span>
                    <Button
                      onClick={() => handleRedeem(reward.id)}
                      disabled={userRewards.rewards_points < reward.points_cost || redeeming === reward.id}
                      className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold px-4 py-2 text-sm disabled:opacity-50"
                    >
                      {redeeming === reward.id ? (
                        'Redeeming...'
                      ) : userRewards.rewards_points < reward.points_cost ? (
                        'Not enough points'
                      ) : (
                        'Redeem'
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Points History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-8"
        >
          <div className="bg-gray-800/50 border-2 border-orange-500/20 rounded-2xl p-6">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <History className="w-6 h-6 text-orange-500" />
              Points History
            </h3>
            <div className="space-y-3">
              {pointsHistory.slice(0, 10).map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-gray-900/30 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.transaction_type === 'earned' || transaction.transaction_type === 'bonus'
                        ? 'bg-green-500/20'
                        : 'bg-red-500/20'
                    }`}>
                      {transaction.transaction_type === 'earned' || transaction.transaction_type === 'bonus' ? (
                        <Star className="w-5 h-5 text-green-500" />
                      ) : (
                        <Gift className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-white font-semibold">{transaction.description || transaction.transaction_type}</p>
                      <p className="text-gray-400 text-sm">
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className={`font-bold ${
                    transaction.points_earned > 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {transaction.points_earned > 0 ? '+' : ''}{transaction.points_earned || -transaction.points_spent}
                  </span>
                </div>
              ))}
              {pointsHistory.length === 0 && (
                <p className="text-gray-400 text-center py-8">No points history yet</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Redemption History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="bg-gray-800/50 border-2 border-orange-500/20 rounded-2xl p-6">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Clock className="w-6 h-6 text-orange-500" />
              Redemption History
            </h3>
            <div className="space-y-3">
              {redemptions.map((redemption) => (
                <div
                  key={redemption.id}
                  className="flex items-center justify-between p-4 bg-gray-900/30 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                      <Gift className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">Reward Redeemed</p>
                      <p className="text-gray-400 text-sm">
                        {new Date(redemption.redemption_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-red-500 font-bold">-{redemption.points_used} pts</span>
                    <p className={`text-xs ${
                      redemption.status === 'applied' ? 'text-green-500' : 'text-gray-400'
                    }`}>
                      {redemption.status}
                    </p>
                  </div>
                </div>
              ))}
              {redemptions.length === 0 && (
                <p className="text-gray-400 text-center py-8">No redemptions yet</p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
