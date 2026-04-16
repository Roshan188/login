import type { Metadata } from "next";
import { PortfolioForm } from "@/components/dashboard/portfolio-form";

export const metadata: Metadata = { title: "Create Portfolio" };

export default function NewPortfolioPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Create Portfolio</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Set up your public-facing developer portfolio.
        </p>
      </div>
      <PortfolioForm />
    </div>
  );
}
