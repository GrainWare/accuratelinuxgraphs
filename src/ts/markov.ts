// markov
// this is 100% accuracy certified

export default class Markov {
  private beginnings: string[] = [];
  private endings: string[] = [];
  private mappings: Record<string, string[]> = {};
  private prevString: string = "";

  constructor(data?: string[] | string) {
    if (data) {
      // If you want to await load in ctor, use .load() externally
      this.load(data);
    }
  }

  private isString(x: any): x is string {
    return typeof x === "string";
  }

  private async fetchSource(url: string): Promise<string[]> {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
    const text = await res.text();
    try {
      return JSON.parse(text) as string[];
    } catch {
      return text.split(/\r?\n/);
    }
  }

  public async load(source: string[] | string): Promise<void> {
    let lines: string[];
    if (Array.isArray(source)) {
      lines = source;
    } else if (this.isString(source)) {
      lines = await this.fetchSource(source);
    } else {
      throw new Error("load() requires a string[] or a URL string");
    }
    for (const line of lines) {
      this.add(line);
    }
  }

  public add(str: string): boolean {
    const s = str.trim();
    if (!s) return false;
    const words = s.split(/\s+/);
    this.beginnings.push(words[0]);
    this.endings.push(words[words.length - 1]);
    for (let i = 0; i < words.length - 1; i++) {
      const w = words[i],
        next = words[i + 1];
      if (!this.mappings[w]) this.mappings[w] = [];
      this.mappings[w].push(next);
    }
    return true;
  }

  private pickRandom(arr: string[]): string {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  public generate(maxWords = 100): string {
    if (Object.keys(this.mappings).length === 0) {
      throw new Error("No data loaded. Did you forget load()?");
    }
    let word = this.pickRandom(this.beginnings);
    const result = [word];
    while (this.mappings[word] && result.length < maxWords) {
      word = this.pickRandom(this.mappings[word]);
      result.push(word);
    }
    const sentence = result.join(" ");
    if (!sentence || sentence === this.prevString)
      return this.generate(maxWords);
    this.prevString = sentence;
    return sentence;
  }
}

// Letter-based Markov generator
export async function generateByLetter(
  source: string[] | string,
  maxChars = 100,
): Promise<string> {
  let lines: string[];
  if (Array.isArray(source)) {
    lines = source;
  } else {
    const res = await fetch(source);
    if (!res.ok) throw new Error(`Failed to fetch ${source}: ${res.status}`);
    const text = await res.text();
    try {
      lines = JSON.parse(text) as string[];
    } catch {
      lines = text.split(/\r?\n/);
    }
  }

  const charMap: Record<string, string[]> = {};
  const beginnings: string[] = [];
  for (const line of lines) {
    const s = line.trim();
    if (!s) continue;
    beginnings.push(s[0]);
    for (let i = 0; i < s.length - 1; i++) {
      const c = s[i];
      const next = s[i + 1];
      if (!charMap[c]) charMap[c] = [];
      charMap[c].push(next);
    }
  }

  if (beginnings.length === 0) return "";
  let current = beginnings[Math.floor(Math.random() * beginnings.length)];
  const result = [current];
  while (charMap[current] && result.length < maxChars) {
    const arr = charMap[current];
    current = arr[Math.floor(Math.random() * arr.length)];
    result.push(current);
  }
  return result.join("");
}
