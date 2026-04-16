"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Zap, Github, Chrome, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function SignInForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const [loading, setLoading] = useState<string | null>(null);

  const handleSignIn = async (provider: "github" | "google") => {
    try {
      setLoading(provider);
      await signIn(provider, { callbackUrl });
    } catch {
      toast.error("Failed to sign in. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <Card className="glass-card border-white/10">
      <CardHeader className="text-center pb-6">
        <Link href="/" className="flex items-center justify-center gap-2 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/25">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold gradient-text">DevFolio</span>
        </Link>
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to your account to continue
        </p>
      </CardHeader>

      <CardContent className="space-y-3">
        <Button
          variant="outline"
          size="lg"
          className="w-full relative"
          onClick={() => handleSignIn("github")}
          disabled={loading !== null}
        >
          {loading === "github" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Github className="h-4 w-4" />
          )}
          Continue with GitHub
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="w-full"
          onClick={() => handleSignIn("google")}
          disabled={loading !== null}
        >
          {loading === "google" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Chrome className="h-4 w-4" />
          )}
          Continue with Google
        </Button>

        <Separator className="my-4" />

        <p className="text-xs text-center text-muted-foreground">
          By continuing, you agree to our{" "}
          <Link href="/terms" className="underline hover:text-foreground">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline hover:text-foreground">
            Privacy Policy
          </Link>
          .
        </p>
      </CardContent>
    </Card>
  );
}
