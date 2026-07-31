import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("the final manifesto phrase is fully revealed at maximum scroll progress", () => {
  const source = readFileSync(new URL("../home-v4.js", import.meta.url), "utf8");
  const match = source.match(/const segmentLength=([.\d]+);/);

  assert.ok(match, "frontline segment length should be declared");

  const phraseCount = 4;
  const finalPhraseIndex = phraseCount - 1;
  const segmentStart = finalPhraseIndex / phraseCount;
  const segmentLength = Number(match[1]);
  const finalProgress = Math.max(
    0,
    Math.min(1, (1 - segmentStart) / segmentLength),
  );

  assert.equal(finalProgress, 1);
});
