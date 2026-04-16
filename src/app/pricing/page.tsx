import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { PricingSection } from "@/components/landing/pricing-section";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple, transparent pricing for developers and companies.",
};

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-12">
          <div className="text-center mb-4">
            <h1 className="text-4xl font-bold">Pricing</h1>
            <p className="text-muted-foreground mt-2">
              Start free, scale as you grow.
            </p>
          </div>
        </div>
        <PricingSection />
      </main>
      <SiteFooter />
    </div>
  );
}
