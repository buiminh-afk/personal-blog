import React from 'react';
import { Monitor, Globe, Terminal, Shield, Cloud, Star, GitFork, ExternalLink, ArrowRight } from 'lucide-react';

export interface ProjectType {
  name: string;
  description: string;
  tech: string[];
  stars: string;
  forks: string;
  status: string;
  icon: string;
}

const iconMap: Record<string, any> = {
  monitor: Monitor,
  globe: Globe,
  terminal: Terminal,
  shield: Shield,
  cloud: Cloud
};

export const ProjectCard = ({ proj }: { proj: ProjectType }) => {
  const Icon = iconMap[proj.icon] || Terminal;

  return (
    <div className="bg-[#1e1e2e] rounded-xl border border-zinc-800 overflow-hidden flex flex-col group transition-all hover:border-zinc-700 hover:shadow-2xl hover:shadow-cyan-500/5">
      <div className="h-40 bg-[#11111b]/50 relative flex items-center justify-center border-b border-zinc-800/50">
        <div className="absolute top-3 right-3">
          <span className="px-2 py-0.5 rounded text-[9px] font-bold tracking-widest bg-emerald-900/30 text-emerald-400">
            {proj.status}
          </span>
        </div>
        <Icon size={48} className="text-zinc-700 opacity-40 group-hover:text-cyan-400 group-hover:opacity-100 transition-all duration-500" strokeWidth={1.5} />
      </div>
      <div className="p-5 flex-1 flex flex-col bg-[#1e1e2e]">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-zinc-100 group-hover:text-cyan-400 transition-colors">{proj.name}</h3>
          <ExternalLink size={16} className="text-zinc-600 hover:text-zinc-400 transition-colors" />
        </div>
        <p className="text-xs text-zinc-400 leading-relaxed mb-6 flex-1">{proj.description}</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {proj.tech.map((t, j) => (
            <span key={j} className="px-2 py-0.5 bg-[#11111b] text-zinc-500 rounded text-[10px] border border-zinc-800 font-mono">
              {t}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-zinc-900">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-[10px] text-zinc-600"><Star size={12} /> {proj.stars}</div>
            <div className="flex items-center gap-1 text-[10px] text-zinc-600"><GitFork size={12} /> {proj.forks}</div>
          </div>
          <button className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 hover:text-cyan-400 transition-colors uppercase tracking-widest">
            Source <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};
