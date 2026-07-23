import { useEffect, useRef } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { Profile } from "@shared/schema";
import { assetUrl } from "@/lib/static-data";

interface HeroProps {
  profile: Profile;
}

export default function Hero({ profile }: HeroProps) {
  const calendarButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initCalendar = () => {
      if (calendarButtonRef.current && window.calendar?.schedulingButton) {
        // Avoid double-injecting the calendar button on re-renders
        if (calendarButtonRef.current.childElementCount > 0) return;
        window.calendar.schedulingButton.load({
          url: "https://calendar.google.com/calendar/appointments/schedules/AcZssZ3jn57Z8GRePdNpJDHhz1kInTrYIl_KwK6RYDkBOp6eWZ1BIIiFnG-sNf1oPI4RPgwFDsTD69dZ?gv=true",
          color: "#0066cc",
          label: "Schedule a Consultation",
          target: calendarButtonRef.current,
        });
      }
    };

    if (window.calendar?.schedulingButton) {
      initCalendar();
    } else {
      window.addEventListener("load", initCalendar);
      // Script is async — also poll briefly in case load already fired
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
    <div className="container mx-auto px-4 py-24 md:py-32">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <Avatar className="w-32 h-32 md:w-48 md:h-48">
          <AvatarImage
            src={assetUrl(profile.avatar)}
            alt={profile.name}
            className="object-cover"
          />
          <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
        </Avatar>
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {profile.name}
          </h1>
          <h2 className="text-xl md:text-2xl text-muted-foreground mt-2">
            {profile.title}
          </h2>
          <p className="mt-4 max-w-xl text-lg text-foreground/80">
            {profile.bio}
          </p>
          <div className="mt-8 flex justify-center md:justify-start">
            <div ref={calendarButtonRef} className="inline-block" />
          </div>
        </div>
      </div>
    </div>
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
