import fs from 'fs';
import path from 'path';
import PoemsView from './PoemsView';

export interface Poem {
  title: string;
  author: string;
  /** Each stanza is a list of lines; blank lines in the source split stanzas. */
  stanzas: string[][];
}

// Poem files carry a small frontmatter block (title/author) followed by the
// text. Stanzas are separated by blank lines; line breaks inside a stanza are
// preserved. Hand-rolled to match the quotes parser rather than pull in a
// markdown dependency for two fields.
function parsePoemFile(content: string, fallbackTitle: string): Poem {
  const normalized = content.replace(/\r\n/g, '\n');
  let title = fallbackTitle;
  let author = '';
  let body = normalized;

  const frontmatter = normalized.match(/^---\n([\s\S]*?)\n---\n?/);
  if (frontmatter) {
    for (const line of frontmatter[1].split('\n')) {
      const idx = line.indexOf(':');
      if (idx === -1) continue;
      const key = line.slice(0, idx).trim();
      const value = line.slice(idx + 1).trim();
      if (key === 'title' && value) title = value;
      if (key === 'author') author = value;
    }
    body = normalized.slice(frontmatter[0].length);
  }

  const stanzas = body
    .trim()
    .split(/\n\s*\n/)
    .map((stanza) => stanza.split('\n').map((l) => l.trimEnd()))
    .filter((stanza) => stanza.some((l) => l.trim() !== ''));

  return { title, author, stanzas };
}

export default async function PoemsPage() {
  // Files are sorted by name, so a numeric prefix (01-, 02-) fixes the order.
  const poemsDir = path.join(process.cwd(), 'poems');
  const files = fs
    .readdirSync(poemsDir)
    .filter((f) => f.endsWith('.md'))
    .sort();

  const poems = files.map((file) => {
    const content = fs.readFileSync(path.join(poemsDir, file), 'utf-8');
    return parsePoemFile(content, file.replace(/\.md$/, ''));
  });

  return <PoemsView poems={poems} />;
}
