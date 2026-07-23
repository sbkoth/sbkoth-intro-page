import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Database,
  Cloud,
  Shield,
  Code,
  Brain,
  ChartBar,
  Server,
  Network,
  Bot,
  GitMerge,
  Cpu,
  Boxes,
  Waves,
  CreditCard,
  Activity,
  LineChart,
} from "lucide-react";
import ContentDialog from "./content-dialog";
import { dataUrl } from "@/lib/static-data";
import TerminalPanel from "./terminal-panel";

interface Service {
  title: string;
  icon: string;
  description: string;
  content: string;
}

const iconMap: Record<string, React.ReactNode> = {
  Database: <Database className="h-5 w-5" />,
  Cloud: <Cloud className="h-5 w-5" />,
  Shield: <Shield className="h-5 w-5" />,
  Code: <Code className="h-5 w-5" />,
  Brain: <Brain className="h-5 w-5" />,
  ChartBar: <ChartBar className="h-5 w-5" />,
  LineChart: <LineChart className="h-5 w-5" />,
  Server: <Server className="h-5 w-5" />,
  Network: <Network className="h-5 w-5" />,
  Bot: <Bot className="h-5 w-5" />,
  GitMerge: <GitMerge className="h-5 w-5" />,
  Cpu: <Cpu className="h-5 w-5" />,
  Activity: <Activity className="h-5 w-5" />,
  Boxes: <Boxes className="h-5 w-5" />,
  Waves: <Waves className="h-5 w-5" />,
  SiStripe: <CreditCard className="h-5 w-5" />,
  CreditCard: <CreditCard className="h-5 w-5" />,
};

function ServicesComponent() {
  const { data: services, isError } = useQuery<Service[]>({
    queryKey: [dataUrl("services")],
  });

  const [selectedService, setSelectedService] = useState<Service | null>(null);

  if (isError) {
    return (
      <TerminalPanel title="~/services" prompt="ls services/">
        <p className="text-destructive text-sm">error: failed to load services</p>
      </TerminalPanel>
    );
  }

  if (!services || services.length === 0) {
    return null;
  }

  return (
    <>
      <TerminalPanel title="~/services" prompt="find services -type f | head">
        <div className="mb-6">
          <h2 className="tui-section-title">Services</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            <span className="text-primary">{services.length}</span> modules available
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {services.map((service, index) => (
            <article
              key={`${service.title}-${index}`}
              className="tui-card p-4"
              onClick={() => setSelectedService(service)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedService(service);
                }
              }}
              role="button"
              tabIndex={0}
            >
              <div className="flex items-start gap-3">
                <div className="text-primary border border-primary/30 p-2 shrink-0">
                  {iconMap[service.icon] ?? <Code className="h-5 w-5" />}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-primary">
                    <span className="text-muted-foreground font-normal">svc/</span>
                    {service.title}
                  </h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                  <p className="mt-3 text-[10px] uppercase tracking-wider text-accent/80">
                    open → man page
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </TerminalPanel>

      {selectedService && (
        <ContentDialog
          title={selectedService.title}
          content={selectedService.content}
          isOpen={!!selectedService}
          onClose={() => setSelectedService(null)}
        />
      )}
    </>
  );
}

export default React.memo(ServicesComponent);
