"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/30 to-transparent" />
      <div className="absolute inset-0 bg-grid opacity-20" />

      {/* Large glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[600px] h-[300px] bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Ready to stand out?
            <br />
            <span className="gradient-text">Build your portfolio.</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-lg mx-auto mb-10">
            Join 10,000+ developers who use DevFolio to showcase their work and land their dream jobs.
          </p>

          <Link href="/auth/signin">
            <Button variant="gradient" size="xl">
              Create your free portfolio
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>

          <p className="mt-4 text-sm text-muted-foreground">
            No credit card required. Free forever on the basic plan.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
