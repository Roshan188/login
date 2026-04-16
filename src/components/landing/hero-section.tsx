"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Github, Star, Users, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  { icon: Users, label: "Developers", value: "10K+" },
  { icon: Briefcase, label: "Companies", value: "500+" },
  { icon: Star, label: "Projects Showcased", value: "50K+" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid opacity-50" />

      {/* Radial gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-blue-500/10 via-transparent to-transparent" />

      {/* Glow orbs */}
      <div className="absolute top-1/4 -left-32 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl" />

      <div className="container relative z-10 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="tech" className="mb-6 px-4 py-1.5 text-sm">
            <Star className="h-3 w-3 mr-1.5" />
            The #1 developer portfolio platform
          </Badge>
        </motion.div>

        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Showcase your{" "}
          <span className="gradient-text">developer</span>
          <br />
          journey
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Build a stunning portfolio, showcase your best projects, and get discovered by
          top companies — all in one place.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link href="/auth/signin">
            <Button variant="gradient" size="xl" className="w-full sm:w-auto">
              Start for free
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/explore">
            <Button variant="outline" size="xl" className="w-full sm:w-auto">
              <Github className="h-5 w-5" />
              View examples
            </Button>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {stats.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-blue-400" />
                <span className="text-2xl font-bold gradient-text">{value}</span>
              </div>
              <span className="text-sm text-muted-foreground">{label}</span>
            </div>
          ))}
        </motion.div>

        {/* Mock portfolio preview */}
        <motion.div
          className="mt-20 relative max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          <div className="glass-card rounded-2xl overflow-hidden border border-white/10">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              <div className="flex-1 mx-4 bg-white/10 rounded-md px-3 py-1 text-xs text-muted-foreground text-center">
                devfolio.dev/alex-johnson
              </div>
            </div>

            {/* Mock content */}
            <div className="p-8 bg-gradient-to-br from-slate-900/50 to-slate-800/50">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 animate-float" />
                <div>
                  <div className="h-5 w-36 bg-white/20 rounded mb-2" />
                  <div className="h-3 w-24 bg-white/10 rounded" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="rounded-xl bg-white/5 border border-white/10 p-4 hover:border-blue-500/30 transition-colors"
                  >
                    <div className="h-24 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg mb-3" />
                    <div className="h-3 w-3/4 bg-white/20 rounded mb-2" />
                    <div className="h-2 w-1/2 bg-white/10 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Glow under preview */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-blue-500/20 blur-2xl" />
        </motion.div>
      </div>
    </section>
  );
}
