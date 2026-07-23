import { FaGithub } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import type { Profile } from "@shared/schema";
import TerminalPanel from "./terminal-panel";

interface ContactProps {
  profile: Profile;
}

export default function Contact({ profile }: ContactProps) {
  const { socials } = profile;
  const links = [
    {
      href: socials.github,
      label: "github",
      icon: <FaGithub className="h-4 w-4" />,
      cmd: "open github",
    },
    {
      href: socials.email ? `mailto:${socials.email}` : undefined,
      label: "email",
      icon: <MdEmail className="h-4 w-4" />,
      cmd: `mail ${socials.email ?? ""}`,
    },
  ].filter((l) => Boolean(l.href));

  return (
    <TerminalPanel title="~/contact" prompt="contact --list">
      <div className="mb-6">
        <h2 className="tui-section-title">Get in Touch</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Prefer async channels — pick a pipe below.
        </p>
      </div>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              target={link.href?.startsWith("mailto:") ? undefined : "_blank"}
              rel={
                link.href?.startsWith("mailto:")
                  ? undefined
                  : "noopener noreferrer"
              }
              className="tui-card flex items-center gap-3 px-4 py-3 no-underline text-foreground hover:text-primary"
              aria-label={link.label}
            >
              <span className="text-primary border border-primary/30 p-2">
                {link.icon}
              </span>
              <span className="text-sm">
                <span className="text-muted-foreground">$ </span>
                {link.cmd}
              </span>
              <span className="ml-auto text-[10px] uppercase tracking-wider text-accent/70">
                exec
              </span>
            </a>
          </li>
        ))}
      </ul>
    </TerminalPanel>
  );
}
