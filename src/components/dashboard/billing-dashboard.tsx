"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Loader2, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";
import type { Subscription } from "@/db/schema";

interface BillingDashboardProps {
  subscription: Subscription | null;
}

const proFeatures = [
  "Unlimited portfolios",
  "Unlimited projects",
  "Custom domain",
  "Advanced analytics",
  "No DevFolio branding",
  "Priority support",
  "Premium templates",
  "Company interest alerts",
];

export function BillingDashboard({ subscription }: BillingDashboardProps) {
  const [loading, setLoading] = useState(false);
  const isPro = subscription?.plan === "pro" && subscription.status === "active";

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "pro" }),
      });

      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error ?? "Failed to start checkout");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Billing</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your subscription and billing information.
        </p>
      </div>

      {/* Current Plan */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              Current Plan
              <Badge variant={isPro ? "tech" : "outline"}>
                {isPro ? "Pro" : "Free"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isPro && subscription?.currentPeriodEnd ? (
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  Your Pro subscription renews on{" "}
                  <strong className="text-foreground">
                    {formatDate(subscription.currentPeriodEnd)}
                  </strong>
                </p>
                {subscription.cancelAtPeriodEnd && (
                  <p className="text-yellow-400">
                    Your subscription will cancel at the end of the billing period.
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                You&apos;re on the free plan. Upgrade to Pro to unlock all features.
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Upgrade Card */}
      {!isPro && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-card border-primary/30 shadow-lg shadow-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Upgrade to Pro
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">$12</span>
                <span className="text-muted-foreground">/month</span>
              </div>

              <ul className="space-y-2.5">
                {proFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5 text-sm">
                    <Check className="h-4 w-4 text-green-400 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                variant="gradient"
                size="lg"
                className="w-full"
                onClick={handleUpgrade}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CreditCard className="h-4 w-4" />
                )}
                Upgrade to Pro — $12/month
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Cancel anytime. No questions asked.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
