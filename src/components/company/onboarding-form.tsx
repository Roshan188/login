"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Building2, Loader2, Check } from "lucide-react";

const schema = z.object({
  name: z.string().min(2).max(100),
  website: z.string().url().optional().or(z.literal("")),
  description: z.string().max(1000).optional(),
  industry: z.string().max(100).optional(),
  size: z.enum(["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"]).optional(),
  location: z.string().max(100).optional(),
  tier: z.enum(["startup", "growth", "enterprise"]).default("startup"),
});

type FormData = z.infer<typeof schema>;

const tiers = [
  {
    id: "startup" as const,
    name: "Startup",
    price: "$99",
    period: "/month",
    contacts: "10 contacts/month",
    color: "from-blue-500 to-cyan-500",
    features: ["10 developer contacts/mo", "Basic search filters", "Email support"],
  },
  {
    id: "growth" as const,
    name: "Growth",
    price: "$499",
    period: "/month",
    contacts: "50 contacts/month",
    color: "from-purple-500 to-pink-500",
    features: ["50 developer contacts/mo", "Advanced filters", "Priority support", "API access"],
    popular: true,
  },
  {
    id: "enterprise" as const,
    name: "Enterprise",
    price: "$1,999",
    period: "/month",
    contacts: "Unlimited contacts",
    color: "from-orange-500 to-red-500",
    features: ["Unlimited contacts", "Custom integrations", "Dedicated CSM", "SLA guarantee"],
  },
];

export function CompanyOnboardingForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedTier, setSelectedTier] = useState<"startup" | "growth" | "enterprise">("startup");

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { tier: "startup" },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, tier: selectedTier }),
      });
      const result = await res.json();
      if (!res.ok) {
        toast.error(result.error ?? "Failed to create company profile");
        return;
      }
      toast.success("Company profile created!");
      router.push("/company/dashboard");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-bold gradient-text">DevFolio</span>
        </Link>
        <h1 className="text-3xl font-bold mb-2">Set up your company</h1>
        <p className="text-muted-foreground">
          Access thousands of vetted developers ready to work.
        </p>
      </div>

      {/* Tier selection */}
      <div>
        <p className="text-sm font-medium mb-3 text-center">Choose your plan</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {tiers.map((tier) => (
            <button
              key={tier.id}
              type="button"
              onClick={() => setSelectedTier(tier.id)}
              className={`relative text-left rounded-xl border p-4 transition-all ${
                selectedTier === tier.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/40"
              }`}
            >
              {tier.popular && (
                <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-500 text-white border-0 text-xs">
                  Popular
                </Badge>
              )}
              {selectedTier === tier.id && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="h-3 w-3 text-primary-foreground" />
                </div>
              )}
              <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${tier.color} flex items-center justify-center mb-3`}>
                <Building2 className="h-3.5 w-3.5 text-white" />
              </div>
              <p className="font-semibold text-sm">{tier.name}</p>
              <p className="text-lg font-bold mt-0.5">
                {tier.price}<span className="text-xs font-normal text-muted-foreground">{tier.period}</span>
              </p>
              <ul className="mt-2 space-y-1">
                {tier.features.map((f) => (
                  <li key={f} className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Check className="h-3 w-3 text-green-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>
      </div>

      {/* Company details */}
      <Card className="glass-card">
        <CardHeader className="pb-4">
          <p className="font-medium">Company details</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 col-span-2 md:col-span-1">
                <label className="text-sm font-medium">Company Name *</label>
                <Input {...register("name")} placeholder="Acme Corp" />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>
              <div className="space-y-1.5 col-span-2 md:col-span-1">
                <label className="text-sm font-medium">Website</label>
                <Input {...register("website")} placeholder="https://acme.com" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Industry</label>
                <Input {...register("industry")} placeholder="Software / FinTech / etc." />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Company Size</label>
                <select
                  {...register("size")}
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select size</option>
                  {["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"].map((s) => (
                    <option key={s} value={s}>{s} employees</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Location</label>
              <Input {...register("location")} placeholder="San Francisco, CA" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">About your company</label>
              <textarea
                {...register("description")}
                className="flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                placeholder="What does your company build?"
              />
            </div>

            <Button type="submit" variant="gradient" size="lg" className="w-full" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Create company & start hiring
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
