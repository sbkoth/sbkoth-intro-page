import { useQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import Hero from "@/components/hero";
import Services from "@/components/services";
import ProjectGrid from "@/components/project-grid";
import Contact from "@/components/contact";
import Features from "@/components/features";
import { dataUrl } from "@/lib/static-data";
import type { Profile, Project } from "@shared/schema";

const LoadingSkeleton = () => (
  <div className="min-h-screen flex items-center justify-center font-mono text-primary">
    <p className="text-sm">
      <span className="text-muted-foreground">loading</span>
      <span className="tui-blink ml-1 inline-block h-4 w-2 bg-primary align-middle" />
    </p>
  </div>
);

export default function Home() {
  const { data: profile, isError: profileError } = useQuery<Profile>({
    queryKey: [dataUrl("profile")],
  });

  const { data: projects, isError: projectsError } = useQuery<Project[]>({
    queryKey: [dataUrl("projects")],
  });

  if (profileError || projectsError) {
    return (
      <div className="min-h-screen flex items-center justify-center font-mono">
        <p className="text-destructive text-sm">
          <span className="text-primary">error:</span> failed to load content
        </p>
      </div>
    );
  }

  if (!profile || !projects) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-mono">
      <div className="mx-auto max-w-6xl px-3 py-6 md:px-6 md:py-10 space-y-6 md:space-y-8">
        <header className="border border-border px-3 py-2 text-xs text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="text-primary">sbkoth@github.io</span>
          <span className="text-border">|</span>
          <span>session=portfolio</span>
          <span className="text-border">|</span>
          <span className="text-accent">tty1</span>
          <span className="ml-auto text-muted-foreground/80">
            type scroll · click cards for details
          </span>
        </header>

        <Suspense fallback={<LoadingSkeleton />}>
          <Hero profile={profile} />
          <Features />
          <Services />
          <ProjectGrid projects={projects} />
          <Contact profile={profile} />
        </Suspense>

        <footer className="border border-border px-3 py-2 text-[11px] text-muted-foreground flex justify-between gap-2">
          <span>
            <span className="text-primary">$</span> exit 0
          </span>
          <span>© {new Date().getFullYear()} {profile.name}</span>
        </footer>
      </div>
    </div>
  );
}
