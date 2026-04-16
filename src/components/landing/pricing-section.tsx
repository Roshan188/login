"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Check, Zap } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started",
    badge: null,
    features: [
      "1 portfolio",
      "Up to 5 projects",
      "DevFolio subdomain",
      "Basic analytics",
      "Community support",
      "Standard templates",
    ],
    cta: "Get started free",
    href: "/auth/signin",
    variant: "outline" as const,
  },
  {
    name: "Pro",
    price: "$12",
    period: "per month",
    description: "For serious developers",
    badge: "Most Popular",
    features: [
      "Unlimited portfolios",
      "Unlimited projects",
      "Custom domain",
      "Advanced analytics",
      "Priority support",
      "Premium templates",
      "No DevFolio branding",
      "SEO optimization",
      "Company interest alerts",
    ],
    cta: "Start Pro trial",
    href: "/auth/signin?plan=pro",
    variant: "gradient" as const,
  },
  {
    name: "Team",
    price: "$29",
    period: "per month",
    description: "For dev teams & agencies",
    badge: null,
    features: [
      "Everything in Pro",
      "Up to 10 team members",
      "Team dashboard",
      "Shared templates",
      "White-label option",
      "API access",
      "Dedicated support",
    ],
    cta: "Contact sales",
    href: "/contact",
    variant: "outline" as const,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-32 relative">
      <div className="absolute inset-0 bg-grid opacity-30" />

      <div className="container relative z-10">
        <div className="text-center mb-16">
          <motion.p
            className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Simple pricing
          </motion.p>
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Invest in your{" "}
            <span className="gradient-text">career</span>
          </motion.h2>
          <motion.p
            className="text-xl text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Start free. Upgrade when you need more.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={plan.badge ? "md:-mt-4" : ""}
            >
              <Card
                className={`relative h-full transition-all duration-300 ${
                  plan.badge
                    ? "glass-card border-primary/50 shadow-xl shadow-primary/10"
                    : "glass-card hover:border-primary/30"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white border-0 px-3 py-1 shadow-lg">
                      <Zap className="h-3 w-3 mr-1" />
                      {plan.badge}
                    </Badge>
                  </div>
                )}

                <CardHeader className="pb-4">
                  <p className="text-sm font-medium text-muted-foreground">{plan.name}</p>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground text-sm">/{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </CardHeader>

                <CardContent className="space-y-4">
                  <Link href={plan.href} className="block">
                    <Button variant={plan.variant} className="w-full" size="lg">
                      {plan.cta}
                    </Button>
                  </Link>

                  <ul className="space-y-2.5">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2.5 text-sm">
                        <Check className="h-4 w-4 text-green-400 shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
