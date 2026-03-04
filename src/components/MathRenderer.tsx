'use client';

import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

interface MathRendererProps {
  text: string;
}

export default function MathRenderer({ text }: MathRendererProps) {
  // Regex untuk menangkap rumus LaTeX ($...$ atau $$...$$)
  const parts = text.split(/(\$\$[\s\S]*?\$\$|\$.*?\$)/g);

  return (
    <span>
      {parts.map((part, index) => {
        if (part.startsWith('$$')) {
          const formula = part.slice(2, -2);
          return <BlockMath key={index} math={formula} />;
        } else if (part.startsWith('$')) {
          const formula = part.slice(1, -1);
          return <InlineMath key={index} math={formula} />;
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
}
