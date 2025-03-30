import { useState, useEffect } from 'react';

interface TypewriterTextProps {
  lines: string[];
  className?: string;
}

export default function TypewriterText({ lines, className = '' }: TypewriterTextProps) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);

  useEffect(() => {
    if (currentLine >= lines.length) return;

    const line = lines[currentLine];
    if (currentChar >= line.length) {
      const timer = setTimeout(() => {
        setCurrentLine(prev => prev + 1);
        setCurrentChar(0);
        setDisplayedLines(prev => [...prev, line]);
      }, 50);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setCurrentChar(prev => prev + 1);
    }, 30);

    return () => clearTimeout(timer);
  }, [currentLine, currentChar, lines]);

  return (
    <div className={className}>
      {displayedLines.map((line, index) => (
        <div key={index}>{line}</div>
      ))}
      {currentLine < lines.length && (
        <div>
          {lines[currentLine].slice(0, currentChar)}
          <span className="animate-pulse">_</span>
        </div>
      )}
    </div>
  );
} 