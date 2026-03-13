export const PROJECTS = [
  {
    name: 'vortex-db',
    description: 'High-performance distributed key-value store built in Rust with focus on low latency and ACID.',
    tech: ['Rust', 'gRPC', 'Docker'],
    stars: '1.2k',
    forks: '84',
    status: 'ACTIVE',
    icon: 'monitor'
  },
  {
    name: 'nebula-ui',
    description: 'A futuristic design system and component library inspired by space exploration interfaces.',
    tech: ['React', 'Tailwind', 'Framer'],
    stars: '432',
    forks: '12',
    status: 'STABLE',
    icon: 'globe'
  },
  {
    name: 'neural-cli',
    description: 'A command-line interface for interacting with LLMs directly from your terminal with local cache.',
    tech: ['Python', 'OpenAI', 'Typer'],
    stars: '210',
    forks: '45',
    status: 'BETA',
    icon: 'terminal'
  },
  {
    name: 'cipher-guard',
    description: 'End-to-end encrypted password manager with zero-knowledge architecture and biometric auth.',
    tech: ['Go', 'SQLite', 'WASM'],
    stars: '850',
    forks: '67',
    status: 'ACTIVE',
    icon: 'shield'
  },
  {
    name: 'flux-engine',
    description: 'A lightweight state management library for Vanilla JS applications inspired by Redux.',
    tech: ['JS', 'Proxy', 'TDD'],
    stars: '1.1k',
    forks: '156',
    status: 'MAINTENANCE',
    icon: 'cloud'
  }
];

export const RESUME = {
  experience: [
    {
      company: 'TechInfra Solutions',
      role: 'Senior Network Security Engineer',
      period: '2021 - Present',
      desc: 'Architected secure zero-trust environments for Fortune 500 clients. Reduced incident response time by 40% through automation.'
    },
    {
      company: 'CloudNet Systems',
      role: 'Network Engineer',
      period: '2018 - 2021',
      desc: 'Managed global SD-WAN deployments across 15 regions. Led the migration from legacy hardware to virtualized NFV stack.'
    }
  ]
};
