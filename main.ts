import { mkdirSync, writeFileSync } from "node:fs";

// Texts From Your Future Self — entry builder.
// The chosen line is assembled from labelled segments so each part of the
// joke (timestamp, payoff, twist, encouragement) stays editable on its own.
// Every segment carries a role label: the builder joins them in order and
// the validator re-checks the assembled line before anything is written.

type Segment = { role: string; text: string };

const SEGMENTS: Segment[] = [
  { role: "timestamp", text: "It's 2036." },
  { role: "setup", text: "You finally finish the side project." },
  { role: "twist", text: "It makes $4." },
  { role: "recognition", text: "Nobody cares. You care." },
  { role: "signoff", text: "Keep going, you stubborn idiot." },
];

function buildEntry(segments: Segment[]): string {
  const texts = segments.map((segment) => segment.text.trim());
  for (const text of texts) {
    if (text.length === 0) {
      throw new Error("a segment must not be empty");
    }
  }
  // Single spaces only: collapse any accidental double spacing so the
  // character count the judge sees is exactly the count we validated.
  return texts.join(" ").replace(/\s+/g, " ");
}

function validateLine(line: string): void {
  if (line.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (line !== line.trim()) {
    throw new Error("entry must not have leading or trailing whitespace");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  if (line.length < 1 || line.length > 200) {
    throw new Error(`entry must be 1-200 characters, got ${line.length}`);
  }
}

function main(): void {
  const entry = buildEntry(SEGMENTS);
  validateLine(entry);
  mkdirSync("/output", { recursive: true });
  writeFileSync("/output/entry.txt", entry, "utf8");
  console.log(`wrote ${entry.length} characters to /output/entry.txt`);
}

main();
