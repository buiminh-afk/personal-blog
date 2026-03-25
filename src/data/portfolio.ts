export const PROFILE = {
    name: "Bui Nguyen Nhat Minh",
    shortName: "Minh",
    role: "Network Security Engineer",
    location: "Ho Chi Minh City, Vietnam",
    phone: "052-390-5693",
    email: "buinguyennhatminh911@gmail.com",
    prompt: "minh@portfolio:~$",
    summary: [
        "Network Security Engineer with hands-on experience in network automation testing, endpoint telemetry collection, and low-level systems programming.",
        "Comfortable across Python, C++, Golang, Windows API, ETW, and packet-level troubleshooting with Wireshark and Scapy.",
    ],
    links: [
        {
            label: "Email",
            href: "mailto:buinguyennhatminh911@gmail.com",
            display: "buinguyennhatminh911@gmail.com",
            icon: "mail",
            tone: "mail",
        },
        {
            label: "LinkedIn",
            href: "https://www.linkedin.com/in/buinguyennhatminh",
            display: "linkedin.com/in/buinguyennhatminh",
            icon: "linkedin",
            tone: "linkedin",
        },
        {
            label: "GitHub",
            href: "https://github.com/buiminh-afk",
            display: "github.com/buiminh-afk",
            icon: "github",
            tone: "github",
        },
        {
            label: "Resume",
            href: "#resume-section",
            display: "Jump to details",
            icon: "resume",
            tone: "resume",
        },
    ],
};

export type ProjectType = {
    name: string;
    description: string;
    tech: string[];
    period: string;
    status: string;
    icon: string;
    highlights: string[];
    link?: string;
};

export const PROJECTS: ProjectType[] = [
    {
        name: "Windows Endpoint Monitoring Agent",
        description:
            "System-level monitoring agent for collecting process, registry, and file telemetry for security analysis.",
        tech: ["C++", "WinAPI", "gRPC", "krabsetw", "JSON"],
        period: "Sept 2024",
        status: "SYSTEM",
        icon: "shield",
        highlights: [
            "Monitored active processes, registry changes, and file operations with Windows APIs.",
            "Integrated ETW ingestion with krabsetw for near real-time suspicious activity detection.",
            "Streamed structured telemetry to a Golang backend over gRPC.",
        ],
    },
    {
        name: "Custom C++ Email Server Backend",
        description:
            "Mail server simulation built in C++ with socket programming and compatibility with standard desktop mail clients.",
        tech: ["C++", "Sockets", "SMTP/POP3", "Networking"],
        period: "Mar 2024 - Apr 2024",
        status: "NETWORK",
        icon: "terminal",
        highlights: [
            "Built a custom server backend that could interface with Thunderbird.",
            "Implemented core mail transfer behaviors for realistic client-server communication.",
            "Focused on protocol handling and efficient message processing.",
        ],
    },
];

export const RESUME = {
    education: [
        {
            school: "Ho Chi Minh City University of Science",
            location: "Ho Chi Minh City, Vietnam",
            degree: "Bachelor of Information Technology, Major in Computer Networking",
            period: "2021 - 2025",
            details: ["GPA: 3.53 / 4.0"],
        },
    ],
    skills: [
        {
            category: "Network Security",
            items: [
                "TCP/IP Stack",
                "L2/L3 Switching",
                "Routing (IPv4/IPv6)",
                "VLAN",
                "STP",
                "MSTP",
                "Firewalls",
                "VPN",
            ],
        },
        {
            category: "Network Tools",
            items: [
                "Wireshark (Deep Packet Inspection)",
                "Scapy (Packet Crafting)",
                "Linux Network Administration",
            ],
        },
        {
            category: "System Programming",
            items: [
                "C/C++ (WinAPI, Sockets)",
                "Python (Automation)",
                "Golang",
                "krabsetw",
            ],
        },
    ],
    experience: [
        {
            company: "TMA Solutions",
            location: "Ho Chi Minh City, Vietnam",
            role: "Intern - Network Automation Testing (Python)",
            period: "June 2025",
            highlights: [
                "Developed a Scapy-based Python testing library to automate configuration and validation across multiple firmware versions on Layer 2/3 switches.",
                "Implemented automated test cases covering VLAN, STP, MSTP, DHCP, ARP, and SNMP.",
                "Worked with network engineers to define test requirements and used Wireshark for deep packet inspection and troubleshooting.",
            ],
        },
        {
            company: "AS Solutions",
            location: "Ho Chi Minh City, Vietnam",
            role: "Software Developer Intern (C++, Golang)",
            period: "June 2024 - Sept 2024",
            highlights: [
                "Collaborated on client-side system agents for security-focused software deployments.",
                "Developed low-level drivers and services in C++ to monitor system behavior on Windows and Linux.",
                "Improved stability and multithreaded performance by fixing bugs and resolving memory issues.",
                "Built experience with Windows API usage and asynchronous network programming.",
            ],
        },
    ],
    certifications: ["TOEIC Listening & Reading (900/990)"],
};
