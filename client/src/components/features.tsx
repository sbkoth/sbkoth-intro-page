import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Code2,
  GitMerge,
  AlertCircle,
  Zap,
  Database,
  Brain,
  Cloud,
  Shield,
  CreditCard,
} from "lucide-react";
import type { Feature } from "@shared/schema";
import ContentDialog from "./content-dialog";
import { dataUrl } from "@/lib/static-data";
import TerminalPanel from "./terminal-panel";

const iconMap: Record<string, React.ReactNode> = {
  Code2: <Code2 className="h-5 w-5" />,
  GitMerge: <GitMerge className="h-5 w-5" />,
  AlertCircle: <AlertCircle className="h-5 w-5" />,
  Zap: <Zap className="h-5 w-5" />,
  Database: <Database className="h-5 w-5" />,
  Brain: <Brain className="h-5 w-5" />,
  Cloud: <Cloud className="h-5 w-5" />,
  Shield: <Shield className="h-5 w-5" />,
  CreditCard: <CreditCard className="h-5 w-5" />,
};

function FeaturesComponent() {
  const { data: features, isError } = useQuery<Feature[]>({
    queryKey: [dataUrl("features")],
  });

  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);

  if (isError) {
    return (
      <TerminalPanel title="~/expertise" prompt="ls expertise/">
        <p className="text-destructive text-sm">error: failed to load expertise</p>
      </TerminalPanel>
    );
  }

  if (!features || features.length === 0) {
    return null;
  }

  return (
    <>
      <TerminalPanel title="~/expertise" prompt="ls -la expertise/">
        <div className="mb-6">
          <h2 className="tui-section-title">Professional Expertise</h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-3xl">
            End-to-end solutions across technology domains — strategic vision with
            systems that ship.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {features.map((feature, index) => (
            <article
              key={`${feature.title}-${index}`}
              className="tui-card p-4"
              onClick={() => setSelectedFeature(feature)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedFeature(feature);
                }
              }}
              role="button"
              tabIndex={0}
            >
              <div className="flex items-start gap-3">
                <div className="text-primary border border-primary/30 p-2 shrink-0">
                  {iconMap[feature.icon] ?? <Code2 className="h-5 w-5" />}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-primary leading-snug">
                    <span className="text-muted-foreground font-normal">./</span>
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                  {feature.highlights?.length > 0 && (
                    <ul className="mt-3 space-y-1">
                      {feature.highlights.map((highlight, i) => (
                        <li
                          key={i}
                          className="text-[11px] text-foreground/80 flex gap-2"
                        >
                          <span className="text-primary shrink-0">▸</span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <p className="mt-3 text-[10px] uppercase tracking-wider text-accent/80">
                    cat → details
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </TerminalPanel>

      {selectedFeature && (
        <ContentDialog
          title={selectedFeature.title}
          content={selectedFeature.content}
          isOpen={!!selectedFeature}
          onClose={() => setSelectedFeature(null)}
        />
      )}
    </>
  );
}

export default React.memo(FeaturesComponent);
