import React, { useRef, useEffect } from 'react';

interface TerminalHistoryItem {
  type: 'system' | 'user';
  content: string;
}

interface TerminalProps {
  terminalHistory: TerminalHistoryItem[];
  inputValue: string;
  setInputValue: (value: string) => void;
  handleCommand: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  prompt: string;
}

export const TerminalComponent = ({
  terminalHistory,
  inputValue,
  setInputValue,
  handleCommand,
  prompt
}: TerminalProps) => {
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalHistory]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="p-6 font-mono text-sm h-full flex flex-col max-w-5xl mx-auto">
      <div className="flex-1 overflow-y-auto space-y-1 mb-4">
        {terminalHistory.map((line, i) => (
          <div key={i} className={line.type === 'user' ? 'text-zinc-100' : 'text-green-400 whitespace-pre-wrap'}>
            {line.content}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>
      <div className="flex items-center gap-2 border-t border-zinc-900 pt-4">
        <span className="text-cyan-400 font-bold">{prompt}</span>
        <input
          ref={inputRef}
          type="text"
          autoFocus
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleCommand}
          className="flex-1 bg-transparent border-none outline-none text-zinc-100 placeholder:text-zinc-800"
          placeholder="..."
        />
      </div>
    </div>
  );
};
