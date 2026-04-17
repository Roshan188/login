"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Zap, LayoutDashboard, Search, MessageSquare, Settings } from "lucide-react";
import type { Company } from "@/db/schema";

const navItems = [
  { href: "/company/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/company/search", icon: Search, label: "Find Developers" },
  { href: "/company/contacts", icon: MessageSquare, label: "Contacts" },
  { href: "/company/settings", icon: Settings, label: "Settings" },
];

interface Props {
  company: Company;
  children: React.ReactNode;
}

export function CompanyLayout({ company, children }: Props) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 border-r border-border/50 bg-background/50 backdrop-blur-sm flex flex-col">
        <div className="h-16 flex items-center px-4 border-b border-border/50">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500">
              <Zap className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-bold gradient-text">DevFolio</span>
          </Link>
        </div>

        <div className="px-4 py-3 border-b border-border/50">
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Company</p>
          <p className="text-sm font-semibold truncate">{company.name}</p>
          <p className="text-xs text-muted-foreground capitalize">{company.tier} plan</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all",
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                )}
              >
                <item.icon className={cn("h-4 w-4", isActive && "text-primary")} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
        {children}
      </div>
    </div>
  );
}
