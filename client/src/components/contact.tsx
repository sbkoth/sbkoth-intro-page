import { Button } from "@/components/ui/button";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import type { Profile } from "@shared/schema";

interface ContactProps {
  profile: Profile;
}

export default function Contact({ profile }: ContactProps) {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h2 className="text-3xl font-bold mb-8">Get in Touch</h2>
      <div className="flex justify-center gap-4">
        {profile.socials.github && (
          <Button variant="outline" size="icon" asChild>
            <a href={profile.socials.github} target="_blank" rel="noopener">
              <FaGithub className="h-5 w-5" />
            </a>
          </Button>
        )}
        {profile.socials.linkedin && (
          <Button variant="outline" size="icon" asChild>
            <a href={profile.socials.linkedin} target="_blank" rel="noopener">
              <FaLinkedin className="h-5 w-5" />
            </a>
          </Button>
        )}
        {profile.socials.twitter && (
          <Button variant="outline" size="icon" asChild>
            <a href={profile.socials.twitter} target="_blank" rel="noopener">
              <FaTwitter className="h-5 w-5" />
            </a>
          </Button>
        )}
        <Button variant="outline" size="icon" asChild>
          <a href={`mailto:${profile.socials.email}`}>
            <MdEmail className="h-5 w-5" />
          </a>
        </Button>
      </div>
    </div>
  );
}
