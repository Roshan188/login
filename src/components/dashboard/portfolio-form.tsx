"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { portfolioSchema, type PortfolioFormData } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { slugify } from "@/lib/utils";

interface PortfolioFormProps {
  defaultValues?: Partial<PortfolioFormData>;
  portfolioId?: string;
}

export function PortfolioForm({ defaultValues, portfolioId }: PortfolioFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PortfolioFormData>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: {
      isPublic: true,
      template: "default",
      ...defaultValues,
    },
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue("title", val);
    if (!portfolioId) {
      setValue("slug", slugify(val));
    }
  };

  const onSubmit = async (data: PortfolioFormData) => {
    setLoading(true);
    try {
      const url = portfolioId ? `/api/portfolios/${portfolioId}` : "/api/portfolios";
      const method = portfolioId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error ?? "Failed to save portfolio");
        return;
      }

      toast.success(portfolioId ? "Portfolio updated!" : "Portfolio created!");
      router.push("/dashboard/portfolios");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="glass-card">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Portfolio Title *</label>
            <Input
              {...register("title")}
              onChange={handleTitleChange}
              placeholder="My Developer Portfolio"
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Slug *</label>
            <div className="flex items-center">
              <span className="text-sm text-muted-foreground mr-2">devfolio.dev/</span>
              <Input {...register("slug")} placeholder="my-portfolio" className="flex-1" />
            </div>
            {errors.slug && (
              <p className="text-xs text-destructive">{errors.slug.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Headline</label>
            <Input
              {...register("headline")}
              placeholder="Full Stack Developer | Building the future"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Bio</label>
            <textarea
              {...register("bio")}
              className="flex min-h-[100px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              placeholder="Tell the world about yourself..."
            />
            {errors.bio && (
              <p className="text-xs text-destructive">{errors.bio.message}</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isPublic"
              {...register("isPublic")}
              className="h-4 w-4 rounded border-input"
            />
            <label htmlFor="isPublic" className="text-sm">
              Make this portfolio public
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" variant="gradient" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {portfolioId ? "Update Portfolio" : "Create Portfolio"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
