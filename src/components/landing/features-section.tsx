"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Zap,
  Shield,
  BarChart3,
  Globe,
  Github,
  Palette,
  Search,
  Bell,
} from "lucide-react";

const features = [
  {
    icon: Palette,
    title: "Stunning Templates",
    description:
      "Choose from premium, futuristic templates that make your portfolio stand out instantly.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Github,
    title: "GitHub Integration",
    description:
      "Auto-import your projects, sync stars, and display your contribution graph seamlessly.",
    color: "from-gray-600 to-gray-800",
  },
  {
    icon: Search,
    title: "Discovery Engine",
    description:
      "Get found by companies actively hiring. Our smart search matches you with the right opportunities.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Track portfolio views, project clicks, and company interest with detailed analytics.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Globe,
    title: "Custom Domain",
    description:
      "Connect your own domain for a professional, memorable portfolio URL on Pro plans.",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Shield,
    title: "Privacy Controls",
    description:
      "Full control over what's public. Password-protect portfolios or make projects private.",
    color: "from-teal-500 to-cyan-500",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Built on Next.js 15 with edge rendering. Your portfolio loads in under 1 second, everywhere.",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Bell,
    title: "Company Signals",
    description:
      "Get notified when a company views your portfolio or signals interest in your work.",
    color: "from-indigo-500 to-purple-500",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function FeaturesSection() {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30" />

      <div className="container relative z-10">
        <div className="text-center mb-16">
          <motion.p
            className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Everything you need
          </motion.p>
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Built for serious{" "}
            <span className="gradient-text">developers</span>
          </motion.h2>
          <motion.p
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Every feature is designed to help you showcase your work and accelerate your career.
          </motion.p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={itemVariants}>
              <Card className="glass-card h-full hover:border-primary/30 transition-all duration-300 group">
                <CardContent className="p-6">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
