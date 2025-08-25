import { Pricing } from '@/components/pricing'
import React from 'react'
import { AuroraBackground } from '@/components/ui/aurora-background';

const page = () => {

    const shardPlans = [
  {
    name: "FREE",
    price: "0",
    yearlyPrice: "0",
    period: "per month",
    features: [
      "Unlimited shards",
      "Basic search & filtering",
      "View public shards",
      "Limited customization (themes, tags, notes)",
      "1 AI action per day",
    ],
    description: "Access the core features and start adding shards without limits",
    buttonText: "Get Started",
    href: "/sign-up",
    isPopular: false,
  },
  {
    name: "BASIC",
    price: "12",
    yearlyPrice: "9",
    period: "per month",
    features: [
      "Everything in Free",
      "50 AI credits per month",
      "Advanced search & filtering",
      "Additional customization (colors, categories)",
      "Export shards (CSV/JSON)",
    ],
    description: "Perfect for users who want more AI power and analytics",
    buttonText: "Upgrade to Basic",
    href: "/sign-up",
    isPopular: true,
  },
  {
    name: "PLUS",
    price: "20",
    yearlyPrice: "17",
    period: "per month",
    features: [
      "Everything in Basic",
      "Unlimited AI usage",
      "Collaborative shards (share & edit with team)",
      "Full analytics & insights",
      "Priority support & early access to new features",
    ],
    description: "For power users who want full AI capabilities and collaboration",
    buttonText: "Upgrade to Plus",
    href: "/sign-up",
    isPopular: false,
  },
];


  return (
    <AuroraBackground>
        <div className="flex items-center justify-center h-screen pl-100 pr-100 ">
        <Pricing plans={shardPlans} title="Pricing" description="buy pls" />
        </div>
    </AuroraBackground>
  )
}

export default page
