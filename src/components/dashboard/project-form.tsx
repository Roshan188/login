"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { projectSchema, type ProjectFormData } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, X, Upload } from "lucide-react";

interface ProjectFormProps {
  portfolios: { id: string; title: string }[];
  defaultValues?: Partial<ProjectFormData>;
  projectId?: string;
  portfolioId?: string;
}

export function ProjectForm({ portfolios, defaultValues, projectId, portfolioId }: ProjectFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [techInput, setTechInput] = useState("");
  const [selectedPortfolioId, setSelectedPortfolioId] = useState(portfolioId ?? portfolios[0]?.id ?? "");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      status: "published",
      featured: false,
      techStack: [],
      ...defaultValues,
    },
  });

  const techStack = watch("techStack") as string[];
  const imageUrl = watch("imageUrl");

  const addTech = () => {
    const trimmed = techInput.trim();
    if (trimmed && !techStack.includes(trimmed)) {
      setValue("techStack", [...techStack, trimmed]);
      setTechInput("");
    }
  };

  const removeTech = (tech: string) => {
    setValue("techStack", techStack.filter((t) => t !== tech));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "project");

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (res.ok) {
        setValue("imageUrl", data.url);
        toast.success("Image uploaded!");
      } else {
        toast.error(data.error ?? "Upload failed");
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: ProjectFormData) => {
    setLoading(true);
    try {
      const url = projectId ? `/api/projects/${projectId}` : "/api/projects";
      const method = projectId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, portfolioId: selectedPortfolioId }),
      });

      const result = await res.json();
      if (!res.ok) {
        toast.error(result.error ?? "Failed to save project");
        return;
      }

      toast.success(projectId ? "Project updated!" : "Project added!");
      router.push("/dashboard/projects");
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
          {/* Portfolio selector */}
          {!portfolioId && (
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Portfolio *</label>
              <select
                value={selectedPortfolioId}
                onChange={(e) => setSelectedPortfolioId(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {portfolios.map((p) => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Project Title *</label>
            <Input {...register("title")} placeholder="My Awesome Project" />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Short Description *</label>
            <textarea
              {...register("description")}
              className="flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              placeholder="A brief description of your project (shown in cards)"
            />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>

          {/* Image upload */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Project Image</label>
            {imageUrl ? (
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt="Project" className="w-full h-40 object-cover rounded-lg" />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-7 w-7"
                  onClick={() => setValue("imageUrl", "")}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">
                  {uploading ? "Uploading..." : "Click to upload image"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
              </label>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Demo URL</label>
              <Input {...register("demoUrl")} placeholder="https://..." />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">GitHub URL</label>
              <Input {...register("githubUrl")} placeholder="https://github.com/..." />
            </div>
          </div>

          {/* Tech stack */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Tech Stack</label>
            <div className="flex gap-2">
              <Input
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") { e.preventDefault(); addTech(); }
                }}
                placeholder="Add technology (press Enter)"
              />
              <Button type="button" variant="outline" onClick={addTech}>Add</Button>
            </div>
            {techStack.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {techStack.map((tech) => (
                  <Badge key={tech} variant="tech" className="gap-1">
                    {tech}
                    <button type="button" onClick={() => removeTech(tech)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" id="featured" {...register("featured")} className="h-4 w-4 rounded" />
            <label htmlFor="featured" className="text-sm">Feature this project (shown first)</label>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" variant="gradient" disabled={loading || uploading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {projectId ? "Update Project" : "Add Project"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
