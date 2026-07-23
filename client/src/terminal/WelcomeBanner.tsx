import { SBKOTH_LOGO, SBKOTH_LOGO_MOBILE, PORTRAIT_ART } from "./welcome-art";
import { assetUrl } from "@/lib/static-data";

type Props = {
  name: string;
  /** Optional photo URL (site-relative, e.g. /uploads/...) */
  avatar?: string;
};

/**
 * Hero for `welcome`: wordmark left, portrait art (+ optional photo) right.
 * Same layout language as terminal.satnaing.dev.
 */
export default function WelcomeBanner({ name, avatar }: Props) {
  const photoSrc = avatar ? assetUrl(avatar) : "";

  return (
    <div className="welcome-banner" data-testid="welcome-banner">
      <div className="welcome-banner-row">
        <div className="welcome-logo-col">
          <pre className="welcome-pre welcome-logo-desktop" aria-hidden>
            {SBKOTH_LOGO.join("\n")}
          </pre>
          <pre className="welcome-pre welcome-logo-mobile" aria-hidden>
            {SBKOTH_LOGO_MOBILE.join("\n")}
          </pre>
        </div>

        <div className="welcome-art-col">
          <div className="welcome-art-stack">
            {photoSrc ? (
              <img
                className="welcome-photo"
                src={photoSrc}
                alt=""
                width={112}
                height={112}
                decoding="async"
              />
            ) : null}
            <pre className="welcome-pre welcome-portrait" aria-hidden>
              {PORTRAIT_ART.join("\n")}
            </pre>
          </div>
          <div className="welcome-art-caption">// operator</div>
        </div>
      </div>

      <div className="welcome-copy">
        <div>Welcome to {name}&apos;s terminal portfolio.</div>
        <div className="welcome-sep">----</div>
        <div>
          Type <span className="welcome-cmd">help</span> for available commands.
        </div>
        <div className="welcome-keys">
          Tab / Ctrl+I autocomplete · ↑/↓ history · Ctrl+L clear
        </div>
        <div className="welcome-sep">----</div>
      </div>
    </div>
  );
}
