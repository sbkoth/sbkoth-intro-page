import { useEffect, useRef } from "react";
import { Avatar } from "@/components/ui/avatar";
import type { Profile } from "@shared/schema";
import { Button } from "@/components/ui/button";

interface HeroProps {
  profile: Profile;
}

export default function Hero({ profile }: HeroProps) {
  const calendarButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create a function to check and initialize the calendar
    const initCalendar = () => {
      if (calendarButtonRef.current && window.calendar?.schedulingButton) {
        window.calendar.schedulingButton.load({
          url: 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ3jn57Z8GRePdNpJDHhz1kInTrYIl_KwK6RYDkBOp6eWZ1BIIiFnG-sNf1oPI4RPgwFDsTD69dZ?gv=true',
          color: '#0066cc', // Fixed primary color matching our theme
          label: 'Schedule a Consultation',
          target: calendarButtonRef.current,
        });
      }
    };

    // Check if calendar script is already loaded
    if (window.calendar?.schedulingButton) {
      initCalendar();
    } else {
      // If not loaded, wait for it
      window.addEventListener('load', initCalendar);
    }

    // Cleanup
    return () => {
      window.removeEventListener('load', initCalendar);
    };
  }, []);

  return (
    <div className="relative overflow-hidden bg-hero-pattern py-24 md:py-32 border-b">
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background z-0"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <Avatar className="w-36 h-36 md:w-52 md:h-52 border-4 border-primary/20 shadow-xl animate-scale-in">
            <img src={profile.avatar} alt={profile.name} className="rounded-full object-cover" />
          </Avatar>
          <div className="text-center md:text-left space-y-4">
            <div className="animate-slide-down opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {profile.name}
              </h1>
              <h2 className="text-xl md:text-2xl text-muted-foreground mt-2 font-medium">
                {profile.title}
              </h2>
            </div>
            <p className="mt-4 max-w-xl text-lg text-foreground/80 leading-relaxed animate-slide-down opacity-0" 
               style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
              {profile.bio}
            </p>
            <div className="mt-8 flex justify-center md:justify-start animate-slide-up opacity-0" 
                 style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
              <div ref={calendarButtonRef} className="inline-block shadow-md rounded-md hover:shadow-lg transition-all"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent"></div>
    </div>
  );
}

// Add TypeScript type definition for the window object
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