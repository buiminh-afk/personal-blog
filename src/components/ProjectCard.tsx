import React from 'react';
import {
  ArrowRight,
  Calendar,
  Cloud,
  ExternalLink,
  Globe,
  type LucideIcon,
  Monitor,
  Shield,
  Terminal
} from 'lucide-react';
import type { ProjectType } from '../data/portfolio';

const iconMap: Record<string, LucideIcon> = {
  monitor: Monitor,
  globe: Globe,
  terminal: Terminal,
  shield: Shield,
  cloud: Cloud
};

export const ProjectCard = ({ proj }: { proj: ProjectType }) => {
  const Icon = iconMap[proj.icon] || Terminal;

  return (
    <div className="bg-[#1e1e2e] rounded-xl border border-zinc-800 overflow-hidden flex flex-col group transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(34,211,238,0.14)]">
      <div className="h-40 bg-[#11111b]/50 relative flex items-center justify-center border-b border-zinc-800/50">
        <div className="absolute top-3 right-3">
          <span className="px-2 py-0.5 rounded text-[9px] font-bold tracking-widest bg-emerald-900/30 text-emerald-400">
            {proj.status}
          </span>
        </div>
        <Icon
          size={48}
          className="text-zinc-700 opacity-40 group-hover:text-cyan-400 group-hover:opacity-100 transition-all duration-500"
          strokeWidth={1.5}
        />
      </div>

      <div className="p-5 flex-1 flex flex-col bg-[#1e1e2e]">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h3 className="text-lg font-bold text-zinc-100 group-hover:text-cyan-400 transition-colors">
            {proj.name}
          </h3>
          <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-mono whitespace-nowrap">
            <Calendar size={12} />
            {proj.period}
          </div>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed mb-4">{proj.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {proj.tech.map((t, j) => (
            <span
              key={j}
              className="px-2 py-0.5 bg-[#11111b] text-zinc-500 rounded text-[10px] border border-zinc-800 font-mono"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="space-y-2 mb-6 flex-1">
          {proj.highlights.map((highlight, index) => (
            <p key={index} className="text-xs text-zinc-400 leading-relaxed">
              {`> ${highlight}`}
            </p>
          ))}
        </div>

        <div className="flex items-center justify-end pt-4 border-t border-zinc-900">
          {proj.link ? (
            <a
              href={proj.link}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 hover:text-cyan-400 transition-colors uppercase tracking-widest"
            >
              Source <ExternalLink size={12} />
            </a>
          ) : (
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
              Resume Project <ArrowRight size={12} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
