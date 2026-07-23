/** Build a valid mailto: URL for the OS default mail client. */
export function buildMailtoHref(email: string, subject?: string): string {
  const trimmed = email.trim();
  if (!trimmed) return "";
  const base = `mailto:${trimmed}`;
  if (!subject) return base;
  return `${base}?subject=${encodeURIComponent(subject)}`;
}

/** Gmail web compose — works when no desktop mail app is configured. */
export function buildGmailComposeHref(email: string, subject?: string): string {
  const trimmed = email.trim();
  if (!trimmed) return "";
  const params = new URLSearchParams({
    view: "cm",
    fs: "1",
    to: trimmed,
  });
  if (subject) params.set("su", subject);
  return `https://mail.google.com/mail/?${params.toString()}`;
}

/**
 * Open a mail surface for the user.
 * Prefer Gmail web compose (new tab) — most reliable on modern browsers —
 * and also fire a synthetic mailto: click for native clients when available.
 * Must be called synchronously from a user gesture (e.g. form submit).
 */
export function openMailto(email: string, subject?: string): void {
  const mailto = buildMailtoHref(email, subject);
  const gmail = buildGmailComposeHref(email, subject);
  if (!mailto || !gmail) return;

  // 1) Gmail compose in a new tab (primary — visible, works without a mail app)
  const opened = window.open(gmail, "_blank", "noopener,noreferrer");

  // 2) Native mail client via temporary anchor click
  try {
    const a = document.createElement("a");
    a.href = mailto;
    a.rel = "noopener noreferrer";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch {
    /* ignore */
  }

  // 3) If the popup was blocked, navigate this tab to Gmail
  if (!opened || opened.closed) {
    try {
      window.location.assign(gmail);
    } catch {
      /* ignore */
    }
  }
}
