// Renders a blog post's plain-text content: "## " lines become headings, "- " lines become list items,
// other lines are paragraphs (consecutive lines join into one; a blank line starts a new one).
function parse(content = '') {
  const blocks = [];
  let para = [];
  let list = [];
  const flushPara = () => para.length && (blocks.push({ type: 'p', text: para.join(' ') }), (para = []));
  const flushList = () => list.length && (blocks.push({ type: 'ul', items: list }), (list = []));

  for (const raw of content.replace(/\r/g, '').split('\n')) {
    const line = raw.trim();
    if (!line) {
      flushPara();
      flushList();
    } else if (line.startsWith('## ')) {
      flushPara();
      flushList();
      blocks.push({ type: 'h2', text: line.slice(3) });
    } else if (line.startsWith('- ')) {
      flushPara();
      list.push(line.slice(2));
    } else {
      flushList();
      para.push(line);
    }
  }
  flushPara();
  flushList();
  return blocks;
}

export default function ArticleBody({ content }) {
  return (
    <div className="space-y-5 text-[17px] leading-8 text-body">
      {parse(content).map((block, i) => {
        if (block.type === 'h2') return <h2 key={i} className="pt-4 text-2xl font-extrabold text-ink">{block.text}</h2>;
        if (block.type === 'ul') {
          return (
            <ul key={i} className="space-y-2.5 pl-1">
              {block.items.map((item, j) => (
                <li key={j} className="flex gap-3">
                  <span className="mt-3 h-2 w-2 shrink-0 rounded-full bg-gradient-to-br from-sky-600 to-cyan-400" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          );
        }
        return <p key={i} className={i === 0 ? 'text-lg text-ink-2' : undefined}>{block.text}</p>;
      })}
    </div>
  );
}
