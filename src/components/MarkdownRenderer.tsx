'use client';

import React, { useState, type ComponentPropsWithoutRef } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import 'highlight.js/styles/atom-one-dark-reasonable.css';
import { Check, Copy } from 'lucide-react';
import FileUploadLab from './FileUploadLab';
import PathTraversalLab from './PathTraversalLab';

type CodeRendererProps = ComponentPropsWithoutRef<'code'> & {
  inline?: boolean;
};

const COMMAND_LANGS = new Set([
  'bash',
  'sh',
  'shell',
  'zsh',
  'console',
  'cmd',
  'powershell',
  'ps1',
  'shellsession',
]);

export const MarkdownRenderer = ({ content }: { content: string }) => {
  const components = {
    h1: ({ ...props }: ComponentPropsWithoutRef<'h1'>) => (
      <h1
        className="text-3xl font-extrabold text-zinc-100 mt-10 mb-6 border-b border-zinc-900 pb-2"
        {...props}
      />
    ),
    h2: ({ ...props }: ComponentPropsWithoutRef<'h2'>) => (
      <h2 className="text-2xl font-bold text-zinc-200 mt-8 mb-4" {...props} />
    ),
    h3: ({ ...props }: ComponentPropsWithoutRef<'h3'>) => (
      <h3 className="text-xl font-bold text-zinc-300 mt-6 mb-3" {...props} />
    ),
    p: ({ ...props }: ComponentPropsWithoutRef<'p'>) => (
      <p className="text-zinc-400 leading-relaxed mb-4" {...props} />
    ),
    ul: (props: ComponentPropsWithoutRef<'ul'>) => (
      <ul className="ml-4 mb-4" {...props} />
    ),
    li: ({ children, ...props }: ComponentPropsWithoutRef<'li'>) => (
      <li className="text-zinc-400 list-none flex gap-3 mb-2" {...props}>
        <span className="text-cyan-600 font-bold mt-1">*</span>
        <div className="flex-1">{children}</div>
      </li>
    ),
    table: (props: ComponentPropsWithoutRef<'table'>) => (
      <div className="overflow-x-auto mb-6 rounded-xl border border-zinc-900 bg-[#11111b]/50">
        <table className="w-full text-left border-collapse" {...props} />
      </div>
    ),
    thead: (props: ComponentPropsWithoutRef<'thead'>) => (
      <thead className="bg-[#181825] border-b border-zinc-800" {...props} />
    ),
    tbody: (props: ComponentPropsWithoutRef<'tbody'>) => (
      <tbody className="text-sm divide-y divide-zinc-800" {...props} />
    ),
    tr: (props: ComponentPropsWithoutRef<'tr'>) => (
      <tr className="hover:bg-[#181825]/50 transition-colors" {...props} />
    ),
    th: (props: ComponentPropsWithoutRef<'th'>) => (
      <th className="p-4 font-bold text-sm text-cyan-400 capitalize" {...props} />
    ),
    td: (props: ComponentPropsWithoutRef<'td'>) => (
      <td className="p-4 text-zinc-400 leading-relaxed" {...props} />
    ),
    code({ inline, className, children, ...props }: CodeRendererProps) {
      const match = /language-(\w+)/.exec(className || '');
      const lang = match ? match[1] : '';

      if (!inline) {
        return (
          <CodeBlock
            lang={lang}
            code={String(children).replace(/\n$/, '')}
          />
        );
      }

      return (
        <code
          className="bg-zinc-800 px-1.5 py-0.5 rounded text-cyan-400 font-mono text-sm"
          {...props}
        >
          {children}
        </code>
      );
    },
    'file-upload-lab': () => <FileUploadLab />,
    'path-lab': () => <PathTraversalLab />,
  };

  return (
    <div className="prose-container">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        components={components as Components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

const CodeBlock = ({ lang, code }: { lang: string; code: string }) => {
  const trimmedCode = code.trim();
  const normalizedLang = lang.toLowerCase();
  const isSingleLine = !trimmedCode.includes('\n');
  const looksLikeCommand =
    /^(npm|npx|pnpm|yarn|git|curl|wget|docker|kubectl|python|node|go|ssh|scp|cd|ls|cat|cp|mv|rm|echo|chmod|touch|mkdir|pwsh|powershell|get-|set-|new-|remove-)\b/i.test(
      trimmedCode,
    );
  const renderAsCommand =
    isSingleLine &&
    trimmedCode.length > 0 &&
    trimmedCode.length <= 140 &&
    (COMMAND_LANGS.has(normalizedLang) || (!normalizedLang && looksLikeCommand));
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (renderAsCommand) {
    const prompt =
      normalizedLang === 'powershell' || normalizedLang === 'ps1' ? 'PS>' : '$';

    return (
      <div className="my-4 inline-flex max-w-full items-center gap-3 rounded-full border border-cyan-500/20 bg-[#11111b] px-4 py-2 font-mono text-sm text-cyan-300 shadow-[0_0_0_1px_rgba(34,211,238,0.05)]">
        <span className="text-cyan-500">{prompt}</span>
        <code className="overflow-x-auto whitespace-nowrap">{trimmedCode}</code>
        <button
          onClick={copyToClipboard}
          className="shrink-0 text-zinc-500 hover:text-cyan-400 transition-colors"
          aria-label="Copy command"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
    );
  }

  return (
    <div className="my-6 rounded-lg bg-[#11111b] border border-zinc-800 overflow-hidden group/code relative">
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800 font-mono">
        <span className="text-[10px] text-zinc-500 uppercase tracking-widest">
          {lang || 'code'}
        </span>
        <button
          onClick={copyToClipboard}
          className="text-zinc-500 hover:text-cyan-400 transition-colors"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
      <pre className="p-4 font-mono text-sm overflow-x-auto text-cyan-400/90">
        <code>{code}</code>
      </pre>
    </div>
  );
};
