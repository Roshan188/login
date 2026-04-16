"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Bell, LogOut, Plus } from "lucide-react";
import Link from "next/link";

export function DashboardHeader() {
  return (
    <header className="h-16 border-b border-border/50 bg-background/50 backdrop-blur-sm flex items-center px-6 gap-4">
      <div className="flex-1" />

      <div className="flex items-center gap-2">
        <Link href="/dashboard/portfolios/new">
          <Button variant="gradient" size="sm">
            <Plus className="h-4 w-4" />
            New Portfolio
          </Button>
        </Link>

        <ThemeToggle />

        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => signOut({ callbackUrl: "/" })}
          aria-label="Sign out"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
