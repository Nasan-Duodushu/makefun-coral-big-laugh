// One Line, Big Laugh — one funny line, at most 200 characters.
// Emits exactly one line to /output/entry.txt (UTF-8).
import { mkdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const LIMIT = 200;

class Entry {
  private readonly line: string;

  constructor(line: string) {
    // Collapse any accidental double spacing, then trim the edges.
    this.line = line.replace(/\s+/g, " ").trim();
  }

  get text(): string {
    return this.line;
  }

  get wordCount(): number {
    return (this.line.match(/\S+/g) ?? []).length;
  }

  check(): void {
    if (this.wordCount < 3) {
      throw new Error("a joke needs at least three words");
    }
    if (this.line.length > LIMIT) {
      throw new Error(`entry is ${this.line.length} chars, limit ${LIMIT}`);
    }
    if (this.line.length === 0) {
      throw new Error("entry is empty");
    }
    if (/[\r\n]/.test(this.line)) {
      throw new Error("entry must be a single line");
    }
    if (!this.line.endsWith(".")) {
      throw new Error("entry must end on a full stop");
    }
  }

  save(dir: string): string {
    this.check();
    mkdirSync(dir, { recursive: true });
    const target = join(dir, "entry.txt");
    writeFileSync(target, this.line + "\n", "utf8");
    // The file on disk must hold exactly the validated line plus newline.
    const bytes = statSync(target).size;
    if (bytes !== Buffer.byteLength(this.line, "utf8") + 1) {
      throw new Error("written file size does not match the entry");
    }
    return target;
  }
}

// The vacuum's silence is the setup; the missing sock is the punchline.
const entry = new Entry(
  "I asked my robot vacuum for its opinion. It said nothing, then quietly ate the only sock I liked.",
);

const target = entry.save(OUTPUT_DIR);
console.log(`${entry.text.length} chars (${entry.wordCount} words) -> ${target}`);
console.log(entry.text);
