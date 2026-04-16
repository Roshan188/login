"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Globe, TrendingUp, BarChart3 } from "lucide-react";
import Link from "next/link";

interface AnalyticsDashboardProps {
  portfolios: { id: string; title: string; slug: string; viewCount: number }[];
  totalViews: number;
}

export function AnalyticsDashboard({ portfolios, totalViews }: AnalyticsDashboardProps) {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Track your portfolio performance.
        </p>
      </div>

      {/* Summary stats */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="glass-card">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Total Views</span>
              <Eye className="h-4 w-4 text-blue-400" />
            </div>
            <p className="text-3xl font-bold">{totalViews.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Portfolios</span>
              <Globe className="h-4 w-4 text-purple-400" />
            </div>
            <p className="text-3xl font-bold">{portfolios.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Total portfolios</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Avg. Views</span>
              <TrendingUp className="h-4 w-4 text-green-400" />
            </div>
            <p className="text-3xl font-bold">
              {portfolios.length > 0
                ? Math.round(totalViews / portfolios.length).toLocaleString()
                : "0"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Per portfolio</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Per-portfolio breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Portfolio Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            {portfolios.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No portfolios yet.{" "}
                <Link href="/dashboard/portfolios/new" className="text-primary hover:underline">
                  Create one
                </Link>{" "}
                to see analytics.
              </p>
            ) : (
              <div className="space-y-3">
                {portfolios
                  .sort((a, b) => b.viewCount - a.viewCount)
                  .map((portfolio) => {
                    const pct = totalViews > 0 ? (portfolio.viewCount / totalViews) * 100 : 0;
                    return (
                      <div key={portfolio.id} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <Link
                            href={`/${portfolio.slug}`}
                            target="_blank"
                            className="font-medium hover:text-primary transition-colors"
                          >
                            {portfolio.title}
                          </Link>
                          <span className="text-muted-foreground">
                            {portfolio.viewCount.toLocaleString()} views
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-1.5 rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <Card className="glass-card border-dashed">
        <CardContent className="p-6 text-center">
          <Badge variant="premium" className="mb-3">Pro Feature</Badge>
          <h3 className="font-semibold mb-2">Advanced Analytics</h3>
          <p className="text-sm text-muted-foreground">
            Upgrade to Pro to unlock detailed visitor insights, referrer tracking,
            geographic data, and company interest signals.
          </p>
          <Link href="/dashboard/billing" className="mt-4 inline-block">
            <button className="text-sm text-primary hover:underline">
              Upgrade to Pro →
            </button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
