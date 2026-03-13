'use client';

import React, { useState, useMemo } from 'react';
import { Terminal, User, FileText, Code, BookOpen, Search, Folder, Calendar, Tag, ArrowRight, Shield, Cloud, Globe, Layers, Layout, Zap, Link, Share2, AtSign } from 'lucide-react';
import { TabBar, TabType } from './TabBar';
import { TerminalComponent } from './Terminal';
import { ProjectCard } from './ProjectCard';
import { MarkdownRenderer } from './MarkdownRenderer';
import { PROJECTS, RESUME } from '../data/portfolio';
import type { PostData } from '../lib/posts';

// Map icons directly from the imported components
const iconMap: Record<string, any> = { network: Shield, cloud: Cloud, globe: Globe };

export const PortfolioApp = ({ initialPosts }: { initialPosts: PostData[] }) => {
  const [activeTab, setActiveTab] = useState('terminal');
  const [dynamicTabs, setDynamicTabs] = useState<TabType[]>([]);
  const [terminalHistory, setTerminalHistory] = useState<{ type: 'system'|'user'; content: string }[]>([
    { type: 'system', content: 'Welcome to Joe\'s Portfolio Terminal v2.7.0' },
    { type: 'system', content: 'System initialized. Next.js App Router loaded.' },
    { type: 'system', content: 'Type "help" for a list of available commands.' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [blogSearch, setBlogSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredPosts = useMemo(() => {
    return initialPosts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(blogSearch.toLowerCase()) || 
                            (post.tags && post.tags.some(t => t.toLowerCase().includes(blogSearch.toLowerCase())));
      const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [blogSearch, selectedCategory, initialPosts]);

  const openPost = (slug: string) => {
    const post = initialPosts.find(p => p.slug === slug);
    if (!post) return `Error: Post "${slug}" not found.`;
    if (!dynamicTabs.find(t => t.id === slug)) {
      setDynamicTabs([...dynamicTabs, { id: slug, title: slug, type: 'post', data: post }]);
    }
    setActiveTab(slug);
    return `Opening ${slug}...`;
  };

  const closeTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDynamicTabs(dynamicTabs.filter(t => t.id !== id));
    if (activeTab === id) setActiveTab('posts');
  };

  const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    const cmdInput = inputValue.trim();
    if (!cmdInput) return;
    
    const cmd = cmdInput.toLowerCase();
    const [command, ...args] = cmd.split(' ');
    let output = '';
    
    setTerminalHistory(prev => [...prev, { type: 'user', content: `joe@portfolio:~$ ${cmdInput}` }]);
    
    switch (command) {
      case 'help': output = 'Commands: whoami, ls posts/[category], cat posts/[category]/slug, open <projects|posts>, clear, help'; break;
      case 'clear': setTerminalHistory([]); setInputValue(''); return;
      case 'whoami': 
        output = 'Hello! I\'m Joe, a Full-Stack Developer specializing in building high-performance web applications.\nCurrently focused on distributed systems and reactive UI patterns.\nI believe the best tools are invisible, and the best code is self-documenting.'; 
        break;
      case 'ls':
        const path = args[0] || '';
        if (path === 'posts' || path === 'posts/') output = 'writeups/  network/  cloud/';
        else if (path.startsWith('posts/')) {
          const cat = path.split('/')[1].replace(/\/$/, '').toLowerCase();
          // Sort posts by date ascending (oldest first)
          const postsInCat = [...initialPosts]
            .filter(p => {
              const pCat = (p.category || '').replace(/['"]/g, '').toLowerCase();
              return pCat === cat;
            })
            .sort((a, b) => (a.date > b.date ? 1 : -1));
          
          if (postsInCat.length > 0) {
            // Show up to 3 posts. If more, take the 3 most recent (last 3 in ascending order)
            const slice = postsInCat.length > 3 ? postsInCat.slice(-3) : postsInCat;
            const items: { name: string, type: 'dir' | 'file', date: string, size?: number }[] = [
              { name: '.', type: 'dir', date: 'Mar 13 10:00', size: 4096 },
              { name: '..', type: 'dir', date: 'Mar 13 00:00', size: 4096 },
              ...slice.map(p => ({ 
                name: `${p.slug}.md`, 
                type: 'file' as const, 
                date: p.date, 
                size: p.content?.length || 2048 
              }))
            ];

            // Standard ls -l total is block count for files in the directory
            const totalBlocks = postsInCat.length * 1;
            const lines = [`total ${totalBlocks}`];
            
            items.forEach((item, idx) => {
              const perm = item.type === 'dir' ? 'drwxr-xr-x' : '-rw-r--r--';
              const links = item.type === 'dir' ? (item.name === '..' ? ' 5' : ' 2') : ' 1';
              
              let dateStr = item.date;
              if (item.type === 'file') {
                try {
                  const [yyyy, mm, dd] = item.date.split('-');
                  const d = new Date(parseInt(yyyy), parseInt(mm) - 1, parseInt(dd));
                  const month = d.toLocaleString('en-US', { month: 'short' });
                  const day = d.getDate().toString().padStart(2, ' ');
                  dateStr = `${month} ${day} 10:${20 + idx}`;
                } catch (e) {}
              }
              
              const sizeStr = (item.size || 4096).toString().padStart(6, ' ');
              lines.push(`${perm} ${links} joe  staff ${sizeStr} ${dateStr} ${item.name}`);
            });
            output = lines.join('\n');
          } else {
            output = `ls: no such directory: ${path}`;
          }
        } else {
          output = 'resume  projects  posts/';
        }
        break;
      case 'cat':
        const target = args[0] || '';
        if (target.startsWith('posts/')) {
          let slug = target.split('/').pop() || '';
          // Remove .md extension if present so it matches the initialPosts slug
          slug = slug.replace(/\.md$/, '');
          output = openPost(slug);
        } else if (target === 'resume') { setActiveTab('resume'); output = 'Opening Resume...'; }
        else output = 'Usage: cat posts/[category]/<slug>';
        break;
      case 'open':
        if (args[0] === 'projects') setActiveTab('projects');
        else if (args[0] === 'posts') setActiveTab('posts');
        else output = `open: don't know how to open '${args[0]}'`;
        break;
      default: output = `zsh: command not found: ${command}`;
    }
    if (output) setTerminalHistory(prev => [...prev, { type: 'system', content: output }]);
    setInputValue('');
  };

  return (
    <div className="flex flex-col w-[99vw] max-w-[99vw] h-[95vh] bg-zinc-950/70 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_0_40px_rgba(8,112,184,0.15)] overflow-hidden font-sans ring-1 ring-white/5">
      <TabBar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        dynamicTabs={dynamicTabs} 
        closeTab={closeTab} 
      />

      <main className="flex-1 overflow-auto bg-transparent relative">
        {activeTab === 'terminal' && (
          <TerminalComponent 
            terminalHistory={terminalHistory}
            inputValue={inputValue}
            setInputValue={setInputValue}
            handleCommand={handleCommand}
          />
        )}

        {activeTab === 'projects' && (
          <div className="max-w-5xl mx-auto p-6 md:p-12 animate-fade-in-up">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
              <h1 className="text-3xl font-bold text-zinc-100 flex items-center gap-3">
                <Code className="text-cyan-400" size={32} />
                Repositories
              </h1>
              <div className="bg-[#1e1e2e] border border-zinc-800 rounded-lg py-2 px-4 font-mono text-xs text-zinc-500 flex items-center gap-2">
                <span className="text-[#fab387]">visitor</span>@portfolio:~$ ls -la
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PROJECTS.map((proj, i) => <ProjectCard key={i} proj={proj} />)}
            </div>
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="max-w-5xl mx-auto p-6 md:p-12 animate-fade-in-up">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
              <h1 className="text-3xl font-bold text-zinc-100 flex items-center gap-3">
                <BookOpen className="text-cyan-400" size={32} />Technical Blog
              </h1>
              <div className="relative group w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-cyan-400" size={16} />
                <input 
                  type="text" 
                  placeholder="grep ..." 
                  value={blogSearch} 
                  onChange={(e) => setBlogSearch(e.target.value)} 
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 pl-10 pr-4 text-sm font-mono focus:outline-none focus:border-cyan-500/50 transition-all text-zinc-200" 
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 mb-10 border-b border-zinc-900 pb-6">
              {['all', 'writeups', 'network', 'cloud'].map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setSelectedCategory(cat)} 
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono border transition-all ${
                    selectedCategory === cat ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Folder size={12} /> {cat}/
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPosts.map((post, i) => {
                const PostIcon = iconMap[post.category] || iconMap['globe'];
                return (
                  <div key={i} onClick={() => openPost(post.slug)} className="bg-[#1e1e2e] rounded-xl border border-zinc-800 overflow-hidden flex flex-col group cursor-pointer transition-all hover:border-zinc-700 hover:shadow-2xl hover:shadow-cyan-500/5">
                    <div className="h-32 bg-[#11111b]/50 relative flex items-center justify-center border-b border-zinc-800/50">
                      <div className="absolute top-3 right-3"><span className="px-2 py-0.5 rounded text-[9px] font-bold tracking-widest bg-cyan-900/30 text-cyan-400">{post.status}</span></div>
                      <PostIcon size={40} className="text-cyan-400 opacity-20" strokeWidth={1.5} />
                    </div>
                    <div className="p-5 flex-1 flex flex-col bg-[#1e1e2e]">
                      <h2 className="text-lg font-bold text-zinc-100 group-hover:text-cyan-400 mb-2 transition-colors line-clamp-1">{post.title}</h2>
                      <p className="text-xs text-zinc-400 leading-relaxed mb-6 flex-1 line-clamp-2">{post.summary}</p>
                      <div className="flex items-center justify-between pt-4 border-t border-zinc-900">
                        <div className="flex items-center gap-1.5 text-[10px] text-zinc-600"><Calendar size={12} /> {post.date}</div>
                        <button className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 hover:text-cyan-400 transition-colors uppercase tracking-widest">Read Post <ArrowRight size={12} /></button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Dynamic Post Tab Rendering */}
        {dynamicTabs.map(tab => activeTab === tab.id && (
          <div key={tab.id} className="max-w-4xl mx-auto p-6 md:p-12 animate-fade-in-up">
            <div className="mb-12">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-500 mb-6 uppercase tracking-widest">
                <Folder size={12} /> <span>posts / {tab.data.category} / {tab.data.slug}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-100 mb-6 leading-tight">{tab.data.title}</h1>
              <div className="flex flex-wrap items-center gap-6 text-zinc-500 text-sm font-mono border-y border-zinc-900 py-4">
                <Calendar size={14} /> {tab.data.date} <Tag size={14} /> {(tab.data.tags || []).join(', ')}
              </div>
            </div>
            <MarkdownRenderer content={tab.data.content} />
            <button onClick={(e) => closeTab(tab.id, e)} className="mt-12 text-zinc-500 hover:text-cyan-400 font-mono text-xs flex items-center gap-2">
              <ArrowRight size={14} className="rotate-180" /> BACK_TO_ROOT
            </button>
          </div>
        ))}

        {activeTab === 'resume' && (
          <div className="max-w-4xl mx-auto p-6 md:p-12 animate-fade-in-up space-y-12">
            
            {/* INTRODUCTION */}
            <div>
              <h2 className="text-xl font-bold font-mono text-[#f97316] mb-4 flex items-center gap-2">
                <span className="text-[#f97316]">&gt;</span> INTRODUCTION
              </h2>
              <div className="pl-4 md:pl-6 border-l-2 border-zinc-800/50 space-y-4 text-zinc-400 text-sm md:text-base leading-relaxed">
                <p>
                  Hello! I'm a <span className="text-[#f97316] font-bold">Full-Stack Developer</span> specializing in building high-performance web applications. I approach software engineering with a terminal-first mindset, focusing on efficiency, scalability, and clean architecture.
                </p>
                <p>
                  Currently focused on distributed systems and reactive UI patterns. I believe the best tools are invisible, and the best code is self-documenting.
                </p>
              </div>
            </div>

            {/* TECHNICAL FOCUS */}
            <div>
              <h2 className="text-xl font-bold font-mono text-[#f97316] mb-6 flex items-center gap-2">
                <span className="text-[#f97316]">&gt;</span> TECHNICAL FOCUS
              </h2>
              <div className="pl-4 md:pl-6 border-l-2 border-zinc-800/50 grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="bg-[#11111b] border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors">
                  <h3 className="text-[#f97316] font-bold font-mono mb-3 flex items-center gap-2 text-sm">
                    <Layers size={16} /> Backend Architecture
                  </h3>
                  <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">
                    Building robust microservices with Node.js and Go, focusing on high-availability and low-latency data processing.
                  </p>
                </div>

                <div className="bg-[#11111b] border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors">
                  <h3 className="text-[#f97316] font-bold font-mono mb-3 flex items-center gap-2 text-sm">
                    <Layout size={16} /> Frontend Engineering
                  </h3>
                  <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">
                    Crafting sophisticated user interfaces with React and Tailwind, prioritizing accessibility and performance optimization.
                  </p>
                </div>

                <div className="bg-[#11111b] border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors">
                  <h3 className="text-[#f97316] font-bold font-mono mb-3 flex items-center gap-2 text-sm">
                    <Cloud size={16} /> Infrastructure as Code
                  </h3>
                  <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">
                    Automating deployment pipelines and cloud infrastructure using Docker, Kubernetes, and Terraform.
                  </p>
                </div>

                <div className="bg-[#11111b] border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors">
                  <h3 className="text-[#f97316] font-bold font-mono mb-3 flex items-center gap-2 text-sm">
                    <Zap size={16} /> Performance Audit
                  </h3>
                  <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">
                    Analyzing bottlenecks and implementing caching strategies to achieve sub-second response times.
                  </p>
                </div>

              </div>
            </div>

            {/* SKILLS.JSON */}
            <div>
              <h2 className="text-xl font-bold font-mono text-[#f97316] mb-4 flex items-center gap-2">
                <span className="text-[#f97316]">&gt;</span> SKILLS.JSON
              </h2>
              <div className="pl-4 md:pl-6 border-l-2 border-zinc-800/50">
                <div className="bg-[#0b0d14] rounded-xl p-6 font-mono text-sm border border-zinc-800 overflow-x-auto text-zinc-300">
                  <div className="text-[#f97316]">{'{'}</div>
                  <div className="pl-4">
                    <div><span className="text-blue-400">"languages"</span>: [</div>
                    <div className="pl-4"><span className="text-green-400">"TypeScript"</span>, <span className="text-green-400">"Rust"</span>, <span className="text-green-400">"Go"</span>, <span className="text-green-400">"Python"</span></div>
                    <div>],</div>
                    
                    <div><span className="text-blue-400">"frameworks"</span>: {'{'}</div>
                    <div className="pl-4">
                      <div><span className="text-blue-400">"frontend"</span>: [<span className="text-green-400">"Next.js"</span>, <span className="text-green-400">"Vue"</span>],</div>
                      <div><span className="text-blue-400">"backend"</span>:  [<span className="text-green-400">"Fastify"</span>, <span className="text-green-400">"NestJS"</span>]</div>
                    </div>
                    <div>{'},'}</div>

                    <div><span className="text-blue-400">"tools"</span>: [<span className="text-green-400">"Git"</span>, <span className="text-green-400">"Docker"</span>, <span className="text-green-400">"K8s"</span>, <span className="text-green-400">"Neovim"</span>]</div>
                  </div>
                  <div className="text-[#f97316]">{'}'}</div>
                </div>
              </div>
            </div>

            {/* SOCIAL LINKS */}
            <div>
              <h2 className="text-xl font-bold font-mono text-[#f97316] mb-4 flex items-center gap-2">
                <span className="text-[#f97316]">&gt;</span> SOCIAL LINKS
              </h2>
              <div className="pl-4 md:pl-6 border-l-2 border-zinc-800/50 flex flex-wrap gap-4">
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-800 bg-[#11111b] text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 transition-colors font-mono text-sm">
                  <Link size={14} /> GitHub/dev_user
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-800 bg-[#11111b] text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 transition-colors font-mono text-sm">
                  <Share2 size={14} /> LinkedIn/professional
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-800 bg-[#11111b] text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 transition-colors font-mono text-sm">
                  <AtSign size={14} /> Twitter/@handle
                </button>
              </div>
            </div>
            
          </div>
        )}

      </main>
      
      {/* Tmux-style Status Bar */}
      <footer className="bg-zinc-900 border-t border-zinc-800 flex justify-between text-[11px] font-mono select-none overflow-hidden">
        <div className="flex items-stretch h-5">
          <div className="bg-cyan-600 text-zinc-950 font-bold px-4 flex items-center">
            joe@portfolio
          </div>
          <div className="bg-zinc-700 text-zinc-200 px-4 flex items-center gap-2 border-r border-zinc-800 relative shadow-[2px_0_5px_rgba(0,0,0,0.2)] z-10">
            <Terminal size={12} className="opacity-70" /> 0:{activeTab}*
          </div>
          <div className="bg-zinc-800/80 text-zinc-500 px-4 flex items-center">
            1:bash-
          </div>
        </div>

        <div className="flex items-stretch h-5">
          <div className="text-zinc-500 px-4 flex items-center border-l border-zinc-800 bg-zinc-900">
            utf-8
          </div>
          <div className="bg-zinc-800 text-zinc-400 px-4 flex items-center relative shadow-[-2px_0_5px_rgba(0,0,0,0.2)] z-10">
            PID: 4092
          </div>
          <div className="bg-green-500 text-zinc-950 font-bold px-4 flex items-center uppercase tracking-wider">
            {activeTab}
          </div>
        </div>
      </footer>
    </div>
  );
};
