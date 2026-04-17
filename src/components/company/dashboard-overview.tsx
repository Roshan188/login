"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Users, MessageSquare, TrendingUp, ArrowRight, Building2 } from "lucide-react";
import type { Company, ContactRequest, User } from "@/db/schema";

interface Props {
  company: Company;
  recentContacts: (ContactRequest & { developer: Pick<User, "id" | "name" | "image" | "headline"> })[];
}

const tierColors: Record<string, string> = {
  startup: "from-blue-500 to-cyan-500",
  growth: "from-purple-500 to-pink-500",
  enterprise: "from-orange-500 to-red-500",
};

export function CompanyDashboardOverview({ company, recentContacts }: Props) {
  const usagePercent = Math.round((company.contactsUsed / company.contactsLimit) * 100);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tierColors[company.tier]} flex items-center justify-center`}>
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">{company.name}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant="tech" className="text-xs capitalize">{company.tier}</Badge>
              {company.location && (
                <span className="text-xs text-muted-foreground">{company.location}</span>
              )}
            </div>
          </div>
        </div>
        <Link href="/company/search">
          <Button variant="gradient">
            <Search className="h-4 w-4" />
            Find Developers
          </Button>
        </Link>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="glass-card">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Contacts Used</span>
              <MessageSquare className="h-4 w-4 text-blue-400" />
            </div>
            <p className="text-3xl font-bold">
              {company.contactsUsed}
              <span className="text-base font-normal text-muted-foreground">/{company.contactsLimit}</span>
            </p>
            <div className="mt-2 w-full bg-muted rounded-full h-1.5">
              <div
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-1.5 rounded-full transition-all"
                style={{ width: `${Math.min(usagePercent, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{usagePercent}% used this month</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Total Contacted</span>
              <Users className="h-4 w-4 text-purple-400" />
            </div>
            <p className="text-3xl font-bold">{recentContacts.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Developers reached</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Plan</span>
              <TrendingUp className="h-4 w-4 text-green-400" />
            </div>
            <p className="text-2xl font-bold capitalize">{company.tier}</p>
            <Link href="/company/billing" className="text-xs text-primary hover:underline mt-1 inline-block">
              Upgrade plan →
            </Link>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent contacts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Recent Contacts</CardTitle>
            <Link href="/company/contacts">
              <Button variant="ghost" size="sm">
                View all <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentContacts.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No contacts yet.</p>
                <Link href="/company/search" className="mt-3 inline-block">
                  <Button variant="gradient" size="sm">
                    <Search className="h-3.5 w-3.5" />
                    Search developers
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentContacts.map((contact) => (
                  <div key={contact.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={contact.developer.image ?? undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-xs">
                        {contact.developer.name?.[0] ?? "D"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{contact.developer.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {contact.developer.headline ?? "Developer"}
                      </p>
                    </div>
                    <Badge variant={contact.status === "pending" ? "outline" : "tech"} className="text-xs shrink-0">
                      {contact.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick actions */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Link href="/company/search">
          <Card className="glass-card hover:border-primary/30 transition-all group cursor-pointer">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Search className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium group-hover:text-primary transition-colors">Search Developers</p>
                <p className="text-sm text-muted-foreground">Browse by tech stack, location, experience</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground ml-auto group-hover:text-primary transition-colors" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/explore">
          <Card className="glass-card hover:border-primary/30 transition-all group cursor-pointer">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium group-hover:text-primary transition-colors">Browse Portfolios</p>
                <p className="text-sm text-muted-foreground">View developer portfolios publicly</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground ml-auto group-hover:text-primary transition-colors" />
            </CardContent>
          </Card>
        </Link>
      </motion.div>
    </div>
  );
}
