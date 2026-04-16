"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, FolderOpen, Globe, TrendingUp, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Session } from "next-auth";

interface OverviewProps {
  user: Session["user"];
}

const statsCards = [
  { label: "Total Views", value: "0", icon: Eye, trend: "+0% this week", color: "text-blue-400" },
  {
    label: "Portfolios",
    value: "0",
    icon: Globe,
    trend: "Create your first",
    color: "text-purple-400",
  },
  {
    label: "Projects",
    value: "0",
    icon: FolderOpen,
    trend: "Add projects to showcase",
    color: "text-cyan-400",
  },
  {
    label: "Profile Score",
    value: "10%",
    icon: TrendingUp,
    trend: "Complete your profile",
    color: "text-green-400",
  },
];

export function DashboardOverview({ user }: OverviewProps) {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold">
          Welcome back, {user?.name?.split(" ")[0] ?? "Developer"} 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s what&apos;s happening with your portfolio today.
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {statsCards.map((stat) => (
          <Card key={stat.label} className="glass-card">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">{stat.label}</span>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Empty state */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="glass-card border-dashed border-2 border-border/50">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center mb-4">
              <Globe className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Create your first portfolio</h3>
            <p className="text-sm text-muted-foreground max-w-sm mb-6">
              Build a stunning portfolio to showcase your projects and get discovered by top companies.
            </p>
            <div className="flex gap-3">
              <Link href="/dashboard/portfolios/new">
                <Button variant="gradient">
                  <Plus className="h-4 w-4" />
                  Create portfolio
                </Button>
              </Link>
              <Link href="/explore">
                <Button variant="outline">
                  View examples
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick actions */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {[
          {
            title: "Complete your profile",
            desc: "Add bio, location, and social links",
            href: "/dashboard/settings",
            badge: "10% done",
          },
          {
            title: "Add your first project",
            desc: "Showcase your best work",
            href: "/dashboard/projects/new",
            badge: "Recommended",
          },
          {
            title: "Connect GitHub",
            desc: "Auto-import your repositories",
            href: "/dashboard/settings#github",
            badge: "New",
          },
        ].map((action) => (
          <Link key={action.title} href={action.href}>
            <Card className="glass-card hover:border-primary/30 transition-all group cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-medium group-hover:text-primary transition-colors">
                    {action.title}
                  </h4>
                  <Badge variant="tech" className="text-xs shrink-0">
                    {action.badge}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{action.desc}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </motion.div>
    </div>
  );
}
