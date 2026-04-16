"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Globe,
  Lock,
  Plus,
  Eye,
  FolderOpen,
  ExternalLink,
  Settings,
  Copy,
} from "lucide-react";
import { toast } from "sonner";
import type { Portfolio, Project } from "@/db/schema";

interface PortfolioListProps {
  portfolios: (Portfolio & { projects: Pick<Project, "id">[] })[];
}

export function PortfolioList({ portfolios }: PortfolioListProps) {
  const handleCopyLink = (slug: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/${slug}`);
    toast.success("Portfolio link copied!");
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Portfolios</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {portfolios.length} portfolio{portfolios.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link href="/dashboard/portfolios/new">
          <Button variant="gradient">
            <Plus className="h-4 w-4" />
            New Portfolio
          </Button>
        </Link>
      </div>

      {portfolios.length === 0 ? (
        <Card className="glass-card border-dashed border-2">
          <CardContent className="flex flex-col items-center py-16 text-center">
            <Globe className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">No portfolios yet</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Create your first portfolio to start showcasing your work.
            </p>
            <Link href="/dashboard/portfolios/new">
              <Button variant="gradient">
                <Plus className="h-4 w-4" />
                Create portfolio
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {portfolios.map((portfolio, i) => (
            <motion.div
              key={portfolio.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="glass-card hover:border-primary/30 transition-all group">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold group-hover:text-primary transition-colors truncate">
                        {portfolio.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        devfolio.dev/{portfolio.slug}
                      </p>
                    </div>
                    <Badge
                      variant={portfolio.isPublic ? "tech" : "outline"}
                      className="shrink-0 ml-2"
                    >
                      {portfolio.isPublic ? (
                        <><Globe className="h-3 w-3 mr-1" />Public</>
                      ) : (
                        <><Lock className="h-3 w-3 mr-1" />Private</>
                      )}
                    </Badge>
                  </div>

                  {portfolio.bio && (
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {portfolio.bio}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <FolderOpen className="h-3 w-3" />
                      {portfolio.projects.length} projects
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {portfolio.viewCount.toLocaleString()} views
                    </span>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <Link href={`/${portfolio.slug}`} target="_blank">
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-3.5 w-3.5" />
                        View
                      </Button>
                    </Link>
                    <Link href={`/dashboard/portfolios/${portfolio.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Settings className="h-3.5 w-3.5" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyLink(portfolio.slug)}
                    >
                      <Copy className="h-3.5 w-3.5" />
                      Copy link
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
