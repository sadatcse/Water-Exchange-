// Converts list fields to and from the one-item-per-line textareas used in the dashboard editors.
export const toLines = (items = []) => items.join('\n');
export const fromLines = (text = '') => text.split('\n').map((l) => l.trim()).filter(Boolean);

// Paragraphs are separated by a blank line
export const toParagraphs = (items = []) => items.join('\n\n');
export const fromParagraphs = (text = '') => text.split(/\n\s*\n/).map((p) => p.replace(/\s*\n\s*/g, ' ').trim()).filter(Boolean);

// [{ label, value }] ⇄ "Label: value" lines (split on the first colon)
export const pairsToLines = (pairs = []) => pairs.map((p) => `${p.label}: ${p.value}`).join('\n');
export const linesToPairs = (text = '') =>
  fromLines(text)
    .map((line) => {
      const at = line.indexOf(':');
      return at > 0 ? { label: line.slice(0, at).trim(), value: line.slice(at + 1).trim() } : null;
    })
    .filter((p) => p && p.label && p.value);

// Comma-separated list ⇄ array
export const toCsv = (items = []) => items.join(', ');
export const fromCsv = (text = '') => text.split(',').map((t) => t.trim()).filter(Boolean);
