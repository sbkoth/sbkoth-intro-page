import { useEffect, useRef } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { Profile } from "@shared/schema";
import { assetUrl } from "@/lib/static-data";
import TerminalPanel from "./terminal-panel";

interface HeroProps {
  profile: Profile;
}

export default function Hero({ profile }: HeroProps) {
  const calendarButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initCalendar = () => {
      if (calendarButtonRef.current && window.calendar?.schedulingButton) {
        if (calendarButtonRef.current.childElementCount > 0) return;
        window.calendar.schedulingButton.load({
          url: "https://calendar.google.com/calendar/appointments/schedules/AcZssZ3jn57Z8GRePdNpJDHhz1kInTrYIl_KwK6RYDkBOp6eWZ1BIIiFnG-sNf1oPI4RPgwFDsTD69dZ?gv=true",
          color: "#22c55e",
          label: "schedule --consultation",
          target: calendarButtonRef.current,
        });
      }
    };

    if (window.calendar?.schedulingButton) {
      initCalendar();
    } else {
      window.addEventListener("load", initCalendar);
      const t = window.setInterval(() => {
        if (window.calendar?.schedulingButton) {
          initCalendar();
          window.clearInterval(t);
        }
      }, 250);
      const stop = window.setTimeout(() => window.clearInterval(t), 10000);
      return () => {
        window.removeEventListener("load", initCalendar);
        window.clearInterval(t);
        window.clearTimeout(stop);
      };
    }

    return () => {
      window.removeEventListener("load", initCalendar);
    };
  }, []);

  const initials = profile.name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <TerminalPanel title="~/whoami" prompt="whoami --verbose">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8">
        <Avatar className="w-24 h-24 md:w-32 md:h-32 rounded-none border border-primary/40">
          <AvatarImage
            src={assetUrl(profile.avatar)}
            alt={profile.name}
            className="object-cover rounded-none"
          />
          <AvatarFallback className="text-xl rounded-none bg-muted text-primary font-mono">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1 space-y-3">
          <p className="text-xs text-muted-foreground">
            <span className="text-accent">#</span> identity
          </p>
          <h1 className="text-2xl md:text-4xl font-semibold text-primary tracking-tight break-words">
            {profile.name}
            <span className="tui-blink ml-1 inline-block h-6 w-2.5 bg-primary align-middle" />
          </h1>
          <h2 className="text-sm md:text-base text-accent">
            <span className="text-muted-foreground">role=</span>
            {profile.title}
          </h2>
          <p className="text-sm md:text-[15px] leading-relaxed text-foreground/90 max-w-2xl border-l-2 border-primary/40 pl-3">
            {profile.bio}
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <span className="text-xs text-muted-foreground">
              $ schedule --consultation
            </span>
            <div ref={calendarButtonRef} className="inline-block [&_button]:!font-mono [&_button]:!rounded-none" />
          </div>
        </div>
      </div>
    </TerminalPanel>
  );
}

declare global {
  interface Window {
    calendar?: {
      schedulingButton: {
        load: (config: {
          url: string;
          color: string;
          label: string;
          target: HTMLElement;
        }) => void;
      };
    };
  }
}
