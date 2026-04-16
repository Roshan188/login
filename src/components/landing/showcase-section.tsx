"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, GitFork, Eye } from "lucide-react";

const showcaseProfiles = [
  {
    name: "Alex Chen",
    role: "Full Stack Engineer",
    avatar: "AC",
    gradient: "from-blue-500 to-cyan-500",
    projects: 12,
    views: "4.2K",
    tech: ["React", "Go", "PostgreSQL"],
    featured: "Built a real-time collaborative IDE",
  },
  {
    name: "Sarah Kim",
    role: "ML Engineer",
    avatar: "SK",
    gradient: "from-purple-500 to-pink-500",
    projects: 8,
    views: "7.8K",
    tech: ["Python", "PyTorch", "Rust"],
    featured: "Open-source AI image generator with 12K stars",
  },
  {
    name: "Marcus Johnson",
    role: "iOS Developer",
    avatar: "MJ",
    gradient: "from-green-500 to-teal-500",
    projects: 15,
    views: "3.1K",
    tech: ["Swift", "SwiftUI", "Core ML"],
    featured: "App with 100K+ downloads on the App Store",
  },
  {
    name: "Priya Patel",
    role: "DevOps & Platform",
    avatar: "PP",
    gradient: "from-orange-500 to-red-500",
    projects: 20,
    views: "9.5K",
    tech: ["Kubernetes", "Terraform", "Go"],
    featured: "Scaled infra to handle 1M req/s",
  },
];

export function ShowcaseSection() {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/20 to-transparent" />

      <div className="container relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Portfolios that{" "}
            <span className="gradient-text">get hired</span>
          </motion.h2>
          <motion.p
            className="text-xl text-muted-foreground max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Real developers, real results. See what&apos;s possible with DevFolio.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {showcaseProfiles.map((profile, i) => (
            <motion.div
              key={profile.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="glass-card hover:border-primary/30 transition-all duration-300 cursor-pointer group p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12 ring-2 ring-offset-2 ring-offset-background ring-primary/30">
                    <AvatarFallback
                      className={`bg-gradient-to-br ${profile.gradient} text-white font-semibold text-sm`}
                    >
                      {profile.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                        {profile.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                        <Eye className="h-3 w-3" />
                        {profile.views}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{profile.role}</p>

                    <p className="text-xs text-foreground/80 mb-3 leading-relaxed">
                      &ldquo;{profile.featured}&rdquo;
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {profile.tech.map((t) => (
                        <Badge key={t} variant="tech" className="text-xs py-0">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border/50 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    {profile.projects} projects
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork className="h-3 w-3" />
                    Open to work
                  </span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
