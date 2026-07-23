/**
 * Unit tests for router base (shipped App.tsx).
 * Run: npx tsx --test client/src/App.router-base.test.ts
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { routerBase } from "./App.tsx";

describe("routerBase (shipped)", () => {
  it("uses empty base for domain root / and relative ./", () => {
    assert.equal(routerBase("/"), "");
    assert.equal(routerBase("./"), "");
    assert.equal(routerBase("."), "");
  });

  it("honors explicit subpath env base", () => {
    assert.equal(routerBase("/sbkoth-intro-page/"), "/sbkoth-intro-page");
    assert.equal(routerBase("/docs"), "/docs");
  });
});
