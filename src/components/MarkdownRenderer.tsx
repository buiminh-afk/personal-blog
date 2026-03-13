'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import 'highlight.js/styles/atom-one-dark-reasonable.css'; // code block highlighting style
import { Check, Copy } from 'lucide-react';

export const MarkdownRenderer = ({ content }: { content: string }) => {
  return (
    <div className="prose-container">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        components={{
          h1: ({ node, ...props }) => <h1 className="text-3xl font-extrabold text-zinc-100 mt-10 mb-6 border-b border-zinc-900 pb-2" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-2xl font-bold text-zinc-200 mt-8 mb-4" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-xl font-bold text-zinc-300 mt-6 mb-3" {...props} />,
          p: ({ node, ...props }) => <p className="text-zinc-400 leading-relaxed mb-4" {...props} />,
          ul: ({ node, ...props }) => <ul className="ml-4 mb-4" {...props} />,
          li: ({ node, ...props }) => (
            <li className="text-zinc-400 list-none flex gap-3 mb-2">
              <span className="text-cyan-600 font-bold mt-1">•</span>
              <div className="flex-1">{props.children}</div>
            </li>
          ),
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            const lang = match ? match[1] : '';
            
            if (!inline) {
              return <CodeBlock lang={lang} code={String(children).replace(/\n$/, '')} />;
            }
            return (
              <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-cyan-400 font-mono text-sm" {...props}>
                {children}
              </code>
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

const CodeBlock = ({ lang, code }: { lang: string, code: string }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-6 rounded-lg bg-[#11111b] border border-zinc-800 overflow-hidden group/code relative">
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800 font-mono">
        <span className="text-[10px] text-zinc-500 uppercase tracking-widest">{lang || 'code'}</span>
        <button onClick={copyToClipboard} className="text-zinc-500 hover:text-cyan-400 transition-colors">
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
      <pre className="p-4 font-mono text-sm overflow-x-auto text-cyan-400/90">
        <code>{code}</code>
      </pre>
    </div>
  );
};
