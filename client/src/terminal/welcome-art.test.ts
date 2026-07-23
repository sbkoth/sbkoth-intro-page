import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  PORTRAIT_ART,
  SBKOTH_LOGO,
  sideBySide,
  welcomeBannerLines,
} from "./welcome-art.ts";

describe("welcome art (shipped)", () => {
  it("has non-empty logo and portrait", () => {
    assert.ok(SBKOTH_LOGO.length >= 5);
    assert.ok(PORTRAIT_ART.length >= 10);
    assert.ok(SBKOTH_LOGO.some((l) => l.includes("█") || l.includes("╔")));
  });

  it("sideBySide places portrait to the right of logo", () => {
    const left = ["AAA", "BBB"];
    const right = ["111", "222", "333"];
    const merged = sideBySide(left, right, 2);
    assert.equal(merged.length, 3);
    assert.match(merged[0], /AAA\s+111/);
    assert.match(merged[2], /333/);
  });

  it("welcomeBannerLines includes name and art rows", () => {
    const lines = welcomeBannerLines("Srinivas Kothapalli");
    assert.ok(lines.some((l) => l.includes("Srinivas")));
    assert.ok(lines.some((l) => l.includes("help")));
    // merged logo+portrait line is wider than logo alone
    const wide = lines.find((l) => l.length > SBKOTH_LOGO[0].length + 5);
    assert.ok(wide, "expected side-by-side art line");
  });
});
