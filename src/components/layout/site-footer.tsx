import Link from "next/link";
import { Zap } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
  Product: [
    { label: "Explore", href: "/explore" },
    { label: "Pricing", href: "/pricing" },
    { label: "For Companies", href: "/for-companies" },
    { label: "Templates", href: "/templates" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
  Developers: [
    { label: "API Docs", href: "/docs/api" },
    { label: "Status", href: "/status" },
    { label: "GitHub", href: "https://github.com/devfolio" },
  ],
};

export function SiteFooter() {
  return (
    <footer className="border-t border-border/40 bg-background/50">
      <div className="container py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500">
                <Zap className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="font-bold gradient-text">DevFolio</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-[200px]">
              The premium portfolio platform for developers.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold mb-3">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} DevFolio. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built for developers, by developers.
          </p>
        </div>
      </div>
    </footer>
  );
}
