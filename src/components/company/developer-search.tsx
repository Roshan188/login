"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search, Filter, MapPin, ExternalLink, MessageSquare, Loader2, X, Eye, FolderOpen,
} from "lucide-react";
import { toast } from "sonner";
import type { Company } from "@/db/schema";

interface SearchResult {
  id: string;
  slug: string;
  title: string;
  bio: string | null;
  headline: string | null;
  viewCount: number;
  user: {
    id: string;
    name: string | null;
    image: string | null;
    location: string | null;
    isHireable: boolean | null;
    experienceLevel: string | null;
  };
  projects: { techStack: unknown }[];
}

interface Props {
  company: Company;
}

export function DeveloperSearch({ company }: Props) {
  const [query, setQuery] = useState("");
  const [tech, setTech] = useState("");
  const [location, setLocation] = useState("");
  const [hireableOnly, setHireableOnly] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [contacting, setContacting] = useState<string | null>(null);
  const [contactedIds, setContactedIds] = useState<Set<string>>(new Set());
  const [showContactModal, setShowContactModal] = useState<SearchResult | null>(null);
  const [contactMessage, setContactMessage] = useState("");

  const handleSearch = useCallback(async () => {
    setLoading(true);
    setSearched(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (tech) params.set("tech", tech);
      if (location) params.set("location", location);
      if (hireableOnly) params.set("hireable", "true");

      const res = await fetch(`/api/search?${params}`);
      const data = await res.json();
      setResults(data.data ?? []);
    } catch {
      toast.error("Search failed");
    } finally {
      setLoading(false);
    }
  }, [query, tech, location, hireableOnly]);

  const handleContact = async () => {
    if (!showContactModal || !contactMessage.trim()) return;
    setContacting(showContactModal.user.id);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ developerId: showContactModal.user.id, message: contactMessage }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Failed to send contact request");
        return;
      }
      toast.success("Contact request sent!");
      setContactedIds((prev) => new Set([...prev, showContactModal.user.id]));
      setShowContactModal(null);
      setContactMessage("");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setContacting(null);
    }
  };

  const canContact = company.contactsUsed < company.contactsLimit;
  const techStacks = (p: SearchResult) =>
    [...new Set(p.projects.flatMap((proj) => proj.techStack as string[]))].slice(0, 5);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Find Developers</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {company.contactsLimit - company.contactsUsed} contacts remaining this month.
        </p>
      </div>

      {/* Search bar */}
      <Card className="glass-card">
        <CardContent className="p-4 space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search by name, bio, or headline..."
                className="pl-9"
              />
            </div>
            <Button variant="gradient" onClick={handleSearch} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              Search
            </Button>
          </div>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Filter className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Filters:</span>
            </div>
            <Input
              value={tech}
              onChange={(e) => setTech(e.target.value)}
              placeholder="Tech (e.g. React)"
              className="h-8 text-xs w-32"
            />
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
                className="h-8 text-xs w-32"
              />
            </div>
            <button
              type="button"
              onClick={() => setHireableOnly(!hireableOnly)}
              className={`h-8 px-3 text-xs rounded-lg border transition-colors ${
                hireableOnly ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/40"
              }`}
            >
              Open to work only
            </button>
            {(query || tech || location || hireableOnly) && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs"
                onClick={() => { setQuery(""); setTech(""); setLocation(""); setHireableOnly(false); setResults([]); setSearched(false); }}
              >
                <X className="h-3.5 w-3.5" />
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {loading && (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {!loading && searched && results.length === 0 && (
        <div className="text-center py-16">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="font-medium">No developers found</p>
          <p className="text-sm text-muted-foreground mt-1">Try different search terms or filters.</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {results.map((result, i) => {
              const stacks = techStacks(result);
              const isContacted = contactedIds.has(result.user.id);

              return (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="glass-card hover:border-primary/30 transition-all h-full">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3 mb-3">
                        <Avatar className="h-11 w-11 ring-2 ring-primary/10">
                          <AvatarImage src={result.user.image ?? undefined} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                            {result.user.name?.[0] ?? "D"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">{result.user.name ?? result.title}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {result.headline ?? result.title}
                          </p>
                          {result.user.location && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                              <MapPin className="h-3 w-3" />
                              {result.user.location}
                            </p>
                          )}
                        </div>
                        {result.user.isHireable && (
                          <Badge variant="success" className="text-xs shrink-0">Open</Badge>
                        )}
                      </div>

                      {result.bio && (
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{result.bio}</p>
                      )}

                      {stacks.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {stacks.map((t) => (
                            <Badge key={t} variant="tech" className="text-xs py-0">{t}</Badge>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <FolderOpen className="h-3 w-3" />
                          {result.projects.length} projects
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {result.viewCount.toLocaleString()} views
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <Link href={`/${result.slug}`} target="_blank" className="flex-1">
                          <Button variant="outline" size="sm" className="w-full">
                            <ExternalLink className="h-3.5 w-3.5" />
                            Portfolio
                          </Button>
                        </Link>
                        <Button
                          variant={isContacted ? "secondary" : "gradient"}
                          size="sm"
                          className="flex-1"
                          disabled={!canContact || isContacted}
                          onClick={() => !isContacted && setShowContactModal(result)}
                        >
                          <MessageSquare className="h-3.5 w-3.5" />
                          {isContacted ? "Contacted" : "Contact"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Contact modal */}
      <AnimatePresence>
        {showContactModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowContactModal(null)}
            />
            <motion.div
              className="relative z-10 w-full max-w-md"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card className="glass-card border-primary/30">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Contact {showContactModal.user.name}</h3>
                    <Button variant="ghost" size="icon" onClick={() => setShowContactModal(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Write a personalized message. Developers appreciate genuine outreach.
                  </p>
                  <textarea
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    className="flex min-h-[120px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                    placeholder={`Hi ${showContactModal.user.name?.split(" ")[0] ?? "there"}, I came across your portfolio and was impressed by your work on...`}
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="gradient"
                      className="flex-1"
                      onClick={handleContact}
                      disabled={!!contacting || contactMessage.length < 10}
                    >
                      {contacting ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageSquare className="h-4 w-4" />}
                      Send Message
                    </Button>
                    <Button variant="outline" onClick={() => setShowContactModal(null)}>Cancel</Button>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    This uses 1 of your {company.contactsLimit - company.contactsUsed} remaining contacts.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
