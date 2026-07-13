import fs from 'fs';
import path from 'path';
import QuotesView from './QuotesView';

interface ParsedQuotes {
  principles: { name: string; description: string }[];
  quotes: string[];
}

function parseQuotesFile(content: string): ParsedQuotes {
  const lines = content.split('\n');
  const principles: { name: string; description: string }[] = [];
  const quotes: string[] = [];

  let inPrinciples = false;
  let inQuotes = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed === '## Principles') {
      inPrinciples = true;
      inQuotes = false;
      continue;
    }

    if (trimmed === '## Quotes') {
      inPrinciples = false;
      inQuotes = true;
      continue;
    }

    if (trimmed.startsWith('-')) {
      const item = trimmed.substring(1).trim();
      if (inPrinciples) {
        const [name, description] = item.split(':').map(s => s.trim());
        if (name && description) {
          principles.push({ name, description });
        }
      } else if (inQuotes && item) {
        quotes.push(item);
      }
    }
  }

  return { principles, quotes };
}

export default async function QuotesPage() {
  // Read the quotes.md file
  const quotesPath = path.join(process.cwd(), 'quotes.md');
  const quotesContent = fs.readFileSync(quotesPath, 'utf-8');

  const { principles, quotes } = parseQuotesFile(quotesContent);

  return <QuotesView principles={principles} quotes={quotes} />;
}
