import React from 'react';
import {
  BookOpen,
  Code,
  FileText,
  Terminal,
  X,
  type LucideIcon
} from 'lucide-react';
import type { PostData } from '../lib/posts';

export interface TabType {
  id: string;
  title: string;
  type: string;
  data?: PostData;
}

interface TabBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  dynamicTabs: TabType[];
  closeTab: (id: string, e: React.MouseEvent) => void;
}

interface TabItemProps {
  id: string;
  label: string;
  icon: LucideIcon;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  closeTab: (id: string, e: React.MouseEvent) => void;
  isDynamic?: boolean;
}

const TabItem = ({
  id,
  label,
  icon: Icon,
  activeTab,
  setActiveTab,
  closeTab,
  isDynamic = false
}: TabItemProps) => (
  <button
    onClick={() => setActiveTab(id)}
    className={`flex items-center gap-2 px-4 py-2 border-r border-zinc-800 transition-colors group whitespace-nowrap ${
      activeTab === id
        ? 'bg-zinc-800 text-cyan-400 border-t-2 border-t-cyan-500'
        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
    }`}
  >
    <Icon size={14} />
    <span className="text-xs font-mono">{label}</span>
    {isDynamic && (
      <X
        size={14}
        className="opacity-0 group-hover:opacity-100 hover:bg-zinc-700 rounded ml-1"
        onClick={e => closeTab(id, e)}
      />
    )}
  </button>
);

export const TabBar = ({
  activeTab,
  setActiveTab,
  dynamicTabs,
  closeTab
}: TabBarProps) => {
  return (
    <div className="flex justify-between bg-zinc-900 border-b border-zinc-800">
      <div className="flex overflow-x-auto scrollbar-hide">
        <TabItem
          id="terminal"
          label="terminal"
          icon={Terminal}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          closeTab={closeTab}
        />
        <TabItem
          id="resume"
          label="about"
          icon={FileText}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          closeTab={closeTab}
        />
        <TabItem
          id="projects"
          label="projects"
          icon={Code}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          closeTab={closeTab}
        />
        <TabItem
          id="posts"
          label="posts"
          icon={BookOpen}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          closeTab={closeTab}
        />
        {dynamicTabs.map(tab => (
          <TabItem
            key={tab.id}
            id={tab.id}
            label={tab.title}
            icon={FileText}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            closeTab={closeTab}
            isDynamic
          />
        ))}
      </div>
      <div className="flex items-center gap-2 px-4 border-l border-zinc-800">
        <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors cursor-pointer"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors cursor-pointer"></div>
        <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors cursor-pointer"></div>
      </div>
    </div>
  );
};
