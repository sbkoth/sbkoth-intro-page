import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@shared/schema";
import { 
  BookOpen, 
  Lightbulb, 
  Wrench, 
  TrendingUp,
  Laptop 
} from "lucide-react";

interface CaseStudyProps {
  project: Project;
}

export default function CaseStudy({ project }: CaseStudyProps) {
  // Handle missing fields gracefully
  const hasChallenge = project.challenge && project.challenge.trim() !== '';
  const hasApproach = project.approach && project.approach.trim() !== '';
  const hasImplementation = project.implementation && project.implementation.trim() !== '';
  const hasTechnologies = project.technologies && project.technologies.length > 0;
  const hasOutcomes = project.outcomes && project.outcomes.length > 0;

  // If the project doesn't have any case study fields, render the content directly
  const hasNoCaseStudyFields = !hasChallenge && !hasApproach && !hasImplementation && !hasOutcomes;
  
  if (hasNoCaseStudyFields) {
    return (
      <div className="prose dark:prose-invert mt-4 max-w-none prose-p:text-foreground/90 prose-p:leading-relaxed">
        <div dangerouslySetInnerHTML={{ __html: project.content }} />
      </div>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl">{project.title}</CardTitle>
        <p className="text-lg text-muted-foreground mt-2">
          {project.description}
        </p>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Challenge Section */}
        {hasChallenge && (
          <>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xl font-semibold">
                <BookOpen className="h-6 w-6 text-primary" />
                <h3>The Challenge</h3>
              </div>
              <p className="text-muted-foreground">{project.challenge}</p>
            </div>
            <Separator />
          </>
        )}

        {/* Approach Section */}
        {hasApproach && (
          <>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xl font-semibold">
                <Lightbulb className="h-6 w-6 text-primary" />
                <h3>Our Approach</h3>
              </div>
              <p className="text-muted-foreground">{project.approach}</p>
            </div>
            <Separator />
          </>
        )}

        {/* Implementation Section */}
        {(hasImplementation || hasTechnologies) && (
          <>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xl font-semibold">
                <Wrench className="h-6 w-6 text-primary" />
                <h3>Implementation</h3>
              </div>
              {hasImplementation && <p className="text-muted-foreground">{project.implementation}</p>}

              {/* Technologies Used */}
              {hasTechnologies && project.technologies && (
                <div className="flex flex-wrap gap-2 mt-4">
                  <div className="flex items-center gap-2 mr-2">
                    <Laptop className="h-4 w-4" />
                    <span className="font-medium">Technologies:</span>
                  </div>
                  {project.technologies.map((tech) => (
                    <Badge key={tech} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <Separator />
          </>
        )}

        {/* Outcomes Section */}
        {hasOutcomes && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xl font-semibold">
              <TrendingUp className="h-6 w-6 text-primary" />
              <h3>Key Outcomes</h3>
            </div>
            <div className="space-y-2 text-muted-foreground">
              {project.outcomes && project.outcomes.map((outcome, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                  <span>{outcome}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}