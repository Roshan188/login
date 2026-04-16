"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ExternalLink, Github, Globe, Twitter, Linkedin, Share2, Zap } from "lucide-react";
import { toast } from "sonner";
import type { Portfolio, Project, User } from "@/db/schema";

interface PublicPortfolioProps {
  portfolio: Portfolio & {
    user: User;
    projects: Project[];
  };
}

export function PublicPortfolio({ portfolio }: PublicPortfolioProps) {
  const { user, projects } = portfolio;

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-blue-600 to-cyan-500">
              <Zap className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm font-semibold gradient-text">DevFolio</span>
          </Link>
          <Button variant="ghost" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
      </nav>

      <main className="pt-14">
        {/* Hero */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 blur-3xl opacity-20"
            style={{ backgroundColor: portfolio.accentColor ?? "#00d4ff" }}
          />

          <div className="container relative z-10">
            <motion.div
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Avatar className="h-24 w-24 mb-6 ring-4 ring-primary/20">
                <AvatarImage src={user.image ?? undefined} />
                <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                  {user.name?.[0] ?? "D"}
                </AvatarFallback>
              </Avatar>

              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                {portfolio.headline ?? user.name}
              </h1>

              {portfolio.bio && (
                <p className="text-lg text-muted-foreground max-w-2xl mt-3 leading-relaxed">
                  {portfolio.bio}
                </p>
              )}

              {/* Social links */}
              <div className="flex items-center gap-3 mt-6">
                {user.githubUsername && (
                  <Link href={`https://github.com/${user.githubUsername}`} target="_blank">
                    <Button variant="ghost" size="icon">
                      <Github className="h-5 w-5" />
                    </Button>
                  </Link>
                )}
                {user.twitterUsername && (
                  <Link href={`https://twitter.com/${user.twitterUsername}`} target="_blank">
                    <Button variant="ghost" size="icon">
                      <Twitter className="h-5 w-5" />
                    </Button>
                  </Link>
                )}
                {user.linkedinUsername && (
                  <Link
                    href={`https://linkedin.com/in/${user.linkedinUsername}`}
                    target="_blank"
                  >
                    <Button variant="ghost" size="icon">
                      <Linkedin className="h-5 w-5" />
                    </Button>
                  </Link>
                )}
                {user.website && (
                  <Link href={user.website} target="_blank">
                    <Button variant="ghost" size="icon">
                      <Globe className="h-5 w-5" />
                    </Button>
                  </Link>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Projects */}
        {projects.length > 0 && (
          <section className="py-16">
            <div className="container">
              <h2 className="text-2xl font-bold mb-8">Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project, i) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="glass-card hover:border-primary/30 transition-all group h-full">
                      {project.imageUrl && (
                        <div className="relative h-48 overflow-hidden rounded-t-xl">
                          <Image
                            src={project.imageUrl}
                            alt={project.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {project.featured && (
                            <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                              Featured
                            </Badge>
                          )}
                        </div>
                      )}
                      <CardContent className="p-5">
                        <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {project.description}
                        </p>

                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {(project.techStack as string[]).slice(0, 5).map((tech) => (
                            <Badge key={tech} variant="tech" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex gap-2">
                          {project.demoUrl && (
                            <Link href={project.demoUrl} target="_blank" className="flex-1">
                              <Button variant="gradient" size="sm" className="w-full">
                                <ExternalLink className="h-3.5 w-3.5" />
                                Demo
                              </Button>
                            </Link>
                          )}
                          {project.githubUrl && (
                            <Link href={project.githubUrl} target="_blank" className="flex-1">
                              <Button variant="outline" size="sm" className="w-full">
                                <Github className="h-3.5 w-3.5" />
                                Code
                              </Button>
                            </Link>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Footer attribution */}
        <div className="py-8 text-center border-t border-border/40">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Zap className="h-3.5 w-3.5" />
            Built with DevFolio
          </Link>
        </div>
      </main>
    </div>
  );
}
