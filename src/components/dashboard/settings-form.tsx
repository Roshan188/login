"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";
import { userProfileSchema, type UserProfileFormData } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import type { User } from "@/db/schema";

interface SettingsFormProps {
  user: User;
}

export function SettingsForm({ user }: SettingsFormProps) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      name: user.name ?? undefined,
      username: user.username ?? undefined,
      bio: user.bio ?? undefined,
      headline: user.headline ?? undefined,
      location: user.location ?? undefined,
      website: user.website ?? undefined,
      githubUsername: user.githubUsername ?? undefined,
      twitterUsername: user.twitterUsername ?? undefined,
      linkedinUsername: user.linkedinUsername ?? undefined,
      isHireable: user.isHireable ?? false,
    },
  });

  const onSubmit = async (data: UserProfileFormData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) {
        toast.error(result.error ?? "Failed to update profile");
        return;
      }
      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Picture */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-base">Profile Picture</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.image ?? undefined} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-xl">
              {user.name?.[0] ?? "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Profile picture synced from your OAuth provider.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Profile Info */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-base">Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Full Name</label>
                <Input {...register("name")} placeholder="Your name" />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Username</label>
                <Input {...register("username")} placeholder="yourname" />
                {errors.username && <p className="text-xs text-destructive">{errors.username.message}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Headline</label>
              <Input {...register("headline")} placeholder="Full Stack Developer | Open to work" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Bio</label>
              <textarea
                {...register("bio")}
                className="flex min-h-[100px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                placeholder="Tell recruiters and companies about yourself..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Location</label>
                <Input {...register("location")} placeholder="San Francisco, CA" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Website</label>
                <Input {...register("website")} placeholder="https://yoursite.com" />
              </div>
            </div>

            <Separator />

            <p className="text-sm font-medium">Social Profiles</p>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground w-24">GitHub</span>
                <Input {...register("githubUsername")} placeholder="username" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground w-24">Twitter</span>
                <Input {...register("twitterUsername")} placeholder="username" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground w-24">LinkedIn</span>
                <Input {...register("linkedinUsername")} placeholder="in/username" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input type="checkbox" id="isHireable" {...register("isHireable")} className="h-4 w-4 rounded" />
              <label htmlFor="isHireable" className="text-sm">I&apos;m open to new opportunities</label>
            </div>

            <Button type="submit" variant="gradient" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
