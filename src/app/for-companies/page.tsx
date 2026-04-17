import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Search, Shield, Zap, BarChart3, Users, Check, Building2 } from "lucide-react";

export const metadata: Metadata = {
  title: "For Companies – DevFolio",
  description: "Hire top developers faster with DevFolio. Browse portfolios, contact developers directly.",
};

const tiers = [
  {
    name: "Startup",
    price: "$99",
    contacts: 10,
    color: "from-blue-500 to-cyan-500",
    features: ["10 developer contacts/mo", "Basic search", "Portfolio access", "Email support"],
  },
  {
    name: "Growth",
    price: "$499",
    contacts: 50,
    color: "from-purple-500 to-pink-500",
    popular: true,
    features: ["50 developer contacts/mo", "Advanced filters", "API access", "Priority support", "Bulk outreach"],
  },
  {
    name: "Enterprise",
    price: "$1,999",
    contacts: -1,
    color: "from-orange-500 to-red-500",
    features: ["Unlimited contacts", "Custom integrations", "Dedicated CSM", "SLA", "White-label"],
  },
];

const benefits = [
  {
    icon: Search,
    title: "Smart Developer Search",
    description: "Filter by tech stack, location, experience level, and availability. Find exactly who you need.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Users,
    title: "Vetted Portfolios",
    description: "Every portfolio shows real projects with live demos, code, and metrics. No fluff.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Shield,
    title: "Direct Outreach",
    description: "Contact developers directly with personalized messages. No middleman, no recruiter fees.",
    color: "from-green-500 to-teal-500",
  },
  {
    icon: BarChart3,
    title: "Hiring Analytics",
    description: "Track your outreach, response rates, and conversion. Know what's working.",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Zap,
    title: "Fast Time-to-Hire",
    description: "Go from search to first conversation in minutes. Reduce your hiring cycle by 60%.",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Building2,
    title: "Company Profile",
    description: "Build your employer brand. Developers see who you are before you reach out.",
    color: "from-indigo-500 to-purple-500",
  },
];

export default function ForCompaniesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-30" />
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

          <div className="container relative z-10 text-center">
            <Badge variant="tech" className="mb-6 px-4 py-1.5">
              <Building2 className="h-3.5 w-3.5 mr-1.5" />
              For Companies & Recruiters
            </Badge>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Hire developers who{" "}
              <span className="gradient-text">ship</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Browse thousands of developer portfolios with real projects. Filter by tech stack,
              contact directly, hire faster.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/company/onboarding">
                <Button variant="gradient" size="xl">
                  Start hiring
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/explore">
                <Button variant="outline" size="xl">
                  Browse developers
                </Button>
              </Link>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              First 5 contacts free. No credit card required to start.
            </p>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-24">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-3">
                Everything you need to{" "}
                <span className="gradient-text">hire great devs</span>
              </h2>
              <p className="text-muted-foreground text-lg">
                Stop guessing. See real work before you reach out.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {benefits.map((b) => (
                <Card key={b.title} className="glass-card hover:border-primary/30 transition-all group">
                  <CardContent className="p-6">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${b.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <b.icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2">{b.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{b.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/10 to-transparent" />
          <div className="container relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-3">Company Plans</h2>
              <p className="text-muted-foreground">Flat monthly fee. No per-hire commission.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {tiers.map((tier) => (
                <Card
                  key={tier.name}
                  className={`relative glass-card transition-all ${tier.popular ? "border-primary/50 shadow-xl shadow-primary/10 md:-mt-4" : "hover:border-primary/30"}`}
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-purple-600 to-pink-500 text-white border-0 px-3 shadow-lg">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardContent className="p-6">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${tier.color} flex items-center justify-center mb-4`}>
                      <Building2 className="h-4.5 w-4.5 text-white" />
                    </div>
                    <p className="font-semibold text-sm text-muted-foreground">{tier.name}</p>
                    <div className="flex items-baseline gap-1 mt-1 mb-4">
                      <span className="text-4xl font-bold">{tier.price}</span>
                      <span className="text-muted-foreground text-sm">/month</span>
                    </div>

                    <Link href="/company/onboarding">
                      <Button variant={tier.popular ? "gradient" : "outline"} className="w-full mb-5">
                        Get started
                      </Button>
                    </Link>

                    <ul className="space-y-2">
                      {tier.features.map((f) => (
                        <li key={f} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                          <Check className="h-4 w-4 text-green-400 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
