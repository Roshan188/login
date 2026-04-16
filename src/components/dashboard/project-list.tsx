"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, FolderOpen, ExternalLink, Github, Star } from "lucide-react";
import type { Portfolio, Project } from "@/db/schema";

interface ProjectListProps {
  portfolios: (Portfolio & { projects: Project[] })[];
}

export function ProjectList({ portfolios }: ProjectListProps) {
  const allProjects = portfolios.flatMap((p) =>
    p.projects.map((proj) => ({ ...proj, portfolioTitle: p.title })),
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Projects</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {allProjects.length} project{allProjects.length !== 1 ? "s" : ""} across{" "}
            {portfolios.length} portfolio{portfolios.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link href="/dashboard/projects/new">
          <Button variant="gradient">
            <Plus className="h-4 w-4" />
            Add Project
          </Button>
        </Link>
      </div>

      {allProjects.length === 0 ? (
        <Card className="glass-card border-dashed border-2">
          <CardContent className="flex flex-col items-center py-16 text-center">
            <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">No projects yet</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Add your first project to start showcasing your work.
            </p>
            {portfolios.length === 0 ? (
              <Link href="/dashboard/portfolios/new">
                <Button variant="gradient">Create a portfolio first</Button>
              </Link>
            ) : (
              <Link href="/dashboard/projects/new">
                <Button variant="gradient">
                  <Plus className="h-4 w-4" />
                  Add project
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allProjects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="glass-card hover:border-primary/30 transition-all group h-full">
                {project.imageUrl && (
                  <div className="relative h-40 overflow-hidden rounded-t-xl">
                    <Image
                      src={project.imageUrl}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {project.featured && (
                      <Badge className="absolute top-2 left-2">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                )}
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-1">
                      {project.title}
                    </h3>
                    <Badge variant="outline" className="text-xs shrink-0">
                      {project.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {(project.techStack as string[]).slice(0, 4).map((tech) => (
                      <Badge key={tech} variant="tech" className="text-xs py-0">
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    {project.demoUrl && (
                      <Link href={project.demoUrl} target="_blank">
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    )}
                    {project.githubUrl && (
                      <Link href={project.githubUrl} target="_blank">
                        <Button variant="ghost" size="sm">
                          <Github className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    )}
                    <Link href={`/dashboard/projects/${project.id}/edit`} className="ml-auto">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
