"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, FolderOpen } from "lucide-react";
import type { Portfolio, Project, User } from "@/db/schema";

interface ExploreGridProps {
  portfolios: (Portfolio & { user: User; projects: Project[] })[];
}

export function ExploreGrid({ portfolios }: ExploreGridProps) {
  if (portfolios.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="text-muted-foreground">No portfolios yet. Be the first!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {portfolios.map((portfolio, i) => {
        const techStacks = [
          ...new Set(
            portfolio.projects.flatMap((p) => p.techStack as string[]),
          ),
        ].slice(0, 4);

        return (
          <motion.div
            key={portfolio.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link href={`/${portfolio.slug}`}>
              <Card className="glass-card hover:border-primary/30 transition-all group cursor-pointer h-full">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <Avatar className="h-10 w-10 ring-2 ring-primary/10">
                      <AvatarImage src={portfolio.user.image ?? undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-sm">
                        {portfolio.user.name?.[0] ?? "D"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-sm group-hover:text-primary transition-colors truncate">
                        {portfolio.title}
                      </h3>
                      <p className="text-xs text-muted-foreground truncate">
                        {portfolio.headline ?? portfolio.user.name}
                      </p>
                    </div>
                  </div>

                  {portfolio.bio && (
                    <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
                      {portfolio.bio}
                    </p>
                  )}

                  {techStacks.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {techStacks.map((tech) => (
                        <Badge key={tech} variant="tech" className="text-xs py-0">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-xs text-muted-foreground pt-3 border-t border-border/50">
                    <span className="flex items-center gap-1">
                      <FolderOpen className="h-3 w-3" />
                      {portfolio.projects.length} projects
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {portfolio.viewCount.toLocaleString()} views
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
