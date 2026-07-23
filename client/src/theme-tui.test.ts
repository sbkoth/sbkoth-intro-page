/**
 * Structural tests for shipped TUI theme tokens (real CSS file).
 * Run: npx tsx --test client/src/theme-tui.test.ts
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cssPath = path.join(__dirname, "index.css");
const tailwindPath = path.join(__dirname, "../../tailwind.config.ts");

describe("TUI theme (shipped styles)", () => {
  it("uses monospace as primary font and dark terminal palette", () => {
    const css = fs.readFileSync(cssPath, "utf-8");
    assert.match(css, /font-mono/, "body should use mono");
    assert.match(css, /--background:\s*150\s+12%\s+5%/, "dark terminal bg");
    assert.match(css, /--primary:\s*145\s+90%\s+48%/, "phosphor green primary");
    assert.match(css, /\.tui-panel/, "TUI panel chrome class");
    assert.match(css, /\.tui-prompt/, "shell prompt cue");
    assert.match(css, /color-scheme:\s*dark/, "dark color scheme");
  });

  it("configures JetBrains Mono in Tailwind font stack", () => {
    const tw = fs.readFileSync(tailwindPath, "utf-8");
    assert.match(tw, /JetBrains Mono/);
    assert.match(tw, /fontFamily/);
  });

  it("ships TerminalPanel component", () => {
    const panel = path.join(__dirname, "components/terminal-panel.tsx");
    assert.ok(fs.existsSync(panel));
    const src = fs.readFileSync(panel, "utf-8");
    assert.match(src, /tui-panel/);
    assert.match(src, /visitor@sbkoth/);
  });
});
