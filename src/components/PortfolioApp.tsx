"use client";

import React, { useMemo, useState } from "react";
import {
    ArrowRight,
    Award,
    BookOpen,
    Briefcase,
    Calendar,
    Cloud,
    Code,
    FileText,
    Folder,
    Github,
    Globe,
    GraduationCap,
    Linkedin,
    Mail,
    MapPin,
    Phone,
    Search,
    Shield,
    Tag,
    Terminal,
    User,
    type LucideIcon,
} from "lucide-react";
import { TabBar, TabType } from "./TabBar";
import { TerminalComponent } from "./Terminal";
import { ProjectCard } from "./ProjectCard";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { PROFILE, PROJECTS, RESUME } from "../data/portfolio";
import type { PostData } from "../lib/posts";

const postIconMap: Record<string, LucideIcon> = {
    network: Shield,
    cloud: Cloud,
    globe: Globe,
};

const socialIconMap: Record<string, LucideIcon> = {
    mail: Mail,
    linkedin: Linkedin,
    github: Github,
    resume: FileText,
};

const socialToneMap: Record<
    string,
    { border: string; text: string; glow: string; bg: string; icon: string }
> = {
    mail: {
        border: "border-red-500/35 hover:border-red-400/70",
        text: "hover:text-red-100",
        glow: "hover:shadow-[0_0_28px_rgba(239,68,68,0.18)]",
        bg: "bg-red-500/8 hover:bg-red-500/12",
        icon: "text-red-400",
    },
    linkedin: {
        border: "border-sky-500/35 hover:border-sky-400/70",
        text: "hover:text-sky-100",
        glow: "hover:shadow-[0_0_28px_rgba(14,165,233,0.18)]",
        bg: "bg-sky-500/8 hover:bg-sky-500/12",
        icon: "text-sky-400",
    },
    github: {
        border: "border-zinc-500/35 hover:border-zinc-300/70",
        text: "hover:text-zinc-100",
        glow: "hover:shadow-[0_0_28px_rgba(161,161,170,0.16)]",
        bg: "bg-zinc-500/8 hover:bg-zinc-500/12",
        icon: "text-zinc-300",
    },
    resume: {
        border: "border-amber-500/35 hover:border-amber-400/70",
        text: "hover:text-amber-100",
        glow: "hover:shadow-[0_0_28px_rgba(245,158,11,0.18)]",
        bg: "bg-amber-500/8 hover:bg-amber-500/12",
        icon: "text-amber-400",
    },
};

export const PortfolioApp = ({
    initialPosts,
}: {
    initialPosts: PostData[];
}) => {
    const [activeTab, setActiveTab] = useState("terminal");
    const [dynamicTabs, setDynamicTabs] = useState<TabType[]>([]);
    const [terminalHistory, setTerminalHistory] = useState<
        { type: "system" | "user"; content: string }[]
    >([
        {
            type: "system",
            content: `Welcome to ${PROFILE.shortName}'s Portfolio Terminal v1.0.0`,
        },
        {
            type: "system",
            content: "Profile loaded: Network Security Engineer",
        },
        {
            type: "system",
            content: 'Type "help" for a list of available commands.',
        },
    ]);
    const [inputValue, setInputValue] = useState("");
    const [blogSearch, setBlogSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

    const postCategories = useMemo(() => {
        const categories = Array.from(
            new Set(initialPosts.map((post) => post.category).filter(Boolean)),
        );
        return ["all", ...categories];
    }, [initialPosts]);

    const filteredPosts = useMemo(() => {
        return initialPosts.filter((post) => {
            const matchesSearch =
                post.title.toLowerCase().includes(blogSearch.toLowerCase()) ||
                (post.tags &&
                    post.tags.some((tag) =>
                        tag.toLowerCase().includes(blogSearch.toLowerCase()),
                    ));
            const matchesCategory =
                selectedCategory === "all" ||
                post.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [blogSearch, initialPosts, selectedCategory]);

    const openPost = (slug: string) => {
        const post = initialPosts.find((p) => p.slug === slug);
        if (!post) {
            return `Error: Post "${slug}" not found.`;
        }

        setDynamicTabs((prevTabs) => {
            if (prevTabs.find((tab) => tab.id === slug)) {
                return prevTabs;
            }

            return [
                ...prevTabs,
                { id: slug, title: slug, type: "post", data: post },
            ];
        });

        setActiveTab(slug);
        return `Opening ${slug}...`;
    };

    const closeTab = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setDynamicTabs((prevTabs) => prevTabs.filter((tab) => tab.id !== id));
        if (activeTab === id) {
            setActiveTab("posts");
        }
    };

    const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== "Enter") {
            return;
        }

        const cmdInput = inputValue.trim();
        if (!cmdInput) {
            return;
        }

        const cmd = cmdInput.toLowerCase();
        const [command, ...args] = cmd.split(" ");
        let output = "";

        setTerminalHistory((prev) => [
            ...prev,
            { type: "user", content: `${PROFILE.prompt} ${cmdInput}` },
        ]);

        switch (command) {
            case "help":
                output =
                    "Commands: whoami, ls posts/[category], cat posts/[category]/slug, cat resume, open <resume|projects|posts>, clear, help";
                break;
            case "clear":
                setTerminalHistory([]);
                setInputValue("");
                return;
            case "whoami":
                output = `I am ${PROFILE.name}, a ${PROFILE.role} based in ${PROFILE.location}.\nFocused on endpoint monitoring, network automation testing, and low-level systems programming.`;
                break;
            case "ls": {
                const path = args[0] || "";

                if (path === "posts" || path === "posts/") {
                    output = postCategories
                        .filter((category) => category !== "all")
                        .map((category) => `${category}/`)
                        .join("  ");
                } else if (path.startsWith("posts/")) {
                    const category = path
                        .split("/")[1]
                        .replace(/\/$/, "")
                        .toLowerCase();
                    const postsInCategory = [...initialPosts]
                        .filter((post) => {
                            const postCategory = (post.category || "")
                                .replace(/['"]/g, "")
                                .toLowerCase();
                            return postCategory === category;
                        })
                        .sort((a, b) => (a.date > b.date ? 1 : -1));

                    if (postsInCategory.length > 0) {
                        const visiblePosts =
                            postsInCategory.length > 3
                                ? postsInCategory.slice(-3)
                                : postsInCategory;

                        const items: {
                            name: string;
                            type: "dir" | "file";
                            date: string;
                            size?: number;
                        }[] = [
                            {
                                name: ".",
                                type: "dir",
                                date: "Mar 25 10:00",
                                size: 4096,
                            },
                            {
                                name: "..",
                                type: "dir",
                                date: "Mar 25 00:00",
                                size: 4096,
                            },
                            ...visiblePosts.map((post) => ({
                                name: `${post.slug}.md`,
                                type: "file" as const,
                                date: post.date,
                                size: post.content?.length || 2048,
                            })),
                        ];

                        const lines = [`total ${postsInCategory.length}`];

                        items.forEach((item, index) => {
                            const permissions =
                                item.type === "dir"
                                    ? "drwxr-xr-x"
                                    : "-rw-r--r--";
                            const links =
                                item.type === "dir"
                                    ? item.name === ".."
                                        ? " 5"
                                        : " 2"
                                    : " 1";

                            let dateString = item.date;
                            if (item.type === "file") {
                                try {
                                    const [year, month, day] =
                                        item.date.split("-");
                                    const parsedDate = new Date(
                                        parseInt(year, 10),
                                        parseInt(month, 10) - 1,
                                        parseInt(day, 10),
                                    );
                                    const monthLabel =
                                        parsedDate.toLocaleString("en-US", {
                                            month: "short",
                                        });
                                    const dayLabel = parsedDate
                                        .getDate()
                                        .toString()
                                        .padStart(2, " ");
                                    dateString = `${monthLabel} ${dayLabel} 10:${20 + index}`;
                                } catch {
                                    dateString = item.date;
                                }
                            }

                            const size = (item.size || 4096)
                                .toString()
                                .padStart(6, " ");
                            lines.push(
                                `${permissions} ${links} minh  staff ${size} ${dateString} ${item.name}`,
                            );
                        });

                        output = lines.join("\n");
                    } else {
                        output = `ls: no such directory: ${path}`;
                    }
                } else {
                    output = "resume  projects  posts/";
                }
                break;
            }
            case "cat": {
                const target = args[0] || "";
                if (target.startsWith("posts/")) {
                    const slug = (target.split("/").pop() || "").replace(
                        /\.md$/,
                        "",
                    );
                    output = openPost(slug);
                } else if (target === "resume") {
                    setActiveTab("resume");
                    output = "Opening resume...";
                } else {
                    output = "Usage: cat posts/[category]/<slug> or cat resume";
                }
                break;
            }
            case "open":
                if (args[0] === "projects") {
                    setActiveTab("projects");
                    output = "Opening projects...";
                } else if (args[0] === "posts") {
                    setActiveTab("posts");
                    output = "Opening posts...";
                } else if (args[0] === "resume") {
                    setActiveTab("resume");
                    output = "Opening resume...";
                } else {
                    output = `open: don't know how to open '${args[0]}'`;
                }
                break;
            default:
                output = `zsh: command not found: ${command}`;
        }

        if (output) {
            setTerminalHistory((prev) => [
                ...prev,
                { type: "system", content: output },
            ]);
        }

        setInputValue("");
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
                {activeTab === "terminal" && (
                    <TerminalComponent
                        terminalHistory={terminalHistory}
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                        handleCommand={handleCommand}
                        prompt={PROFILE.prompt}
                    />
                )}

                {activeTab === "projects" && (
                    <div className="max-w-6xl mx-auto p-6 md:p-12 animate-fade-in-up">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                            <h1 className="text-3xl font-bold text-zinc-100 flex items-center gap-3">
                                <Code className="text-cyan-400" size={32} />
                                Selected Projects
                            </h1>
                            <div className="bg-[#1e1e2e] border border-zinc-800 rounded-lg py-2 px-4 font-mono text-xs text-zinc-500 flex items-center gap-2">
                                <span className="text-[#fab387]">visitor</span>
                                @portfolio:~$ ls projects
                            </div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {PROJECTS.map((project, index) => (
                                <ProjectCard key={index} proj={project} />
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === "posts" && (
                    <div className="max-w-5xl mx-auto p-6 md:p-12 animate-fade-in-up">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                            <h1 className="text-3xl font-bold text-zinc-100 flex items-center gap-3">
                                <BookOpen className="text-cyan-400" size={32} />
                                Technical Notes
                            </h1>
                            <div className="relative group w-full md:w-72">
                                <Search
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-cyan-400"
                                    size={16}
                                />
                                <input
                                    type="text"
                                    placeholder="grep ..."
                                    value={blogSearch}
                                    onChange={(e) =>
                                        setBlogSearch(e.target.value)
                                    }
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 pl-10 pr-4 text-sm font-mono focus:outline-none focus:border-cyan-500/50 transition-all text-zinc-200"
                                />
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3 mb-10 border-b border-zinc-900 pb-6">
                            {postCategories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() =>
                                        setSelectedCategory(category)
                                    }
                                    className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono border transition-all ${
                                        selectedCategory === category
                                            ? "bg-cyan-500/10 border-cyan-500/50 text-cyan-400"
                                            : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300"
                                    }`}>
                                    <Folder size={12} /> {category}/
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredPosts.map((post, index) => {
                                const PostIcon =
                                    postIconMap[post.category] ||
                                    postIconMap.globe;

                                return (
                                    <div
                                        key={index}
                                        onClick={() => openPost(post.slug)}
                                        className="bg-[#1e1e2e] rounded-xl border border-zinc-800 overflow-hidden flex flex-col group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/35 hover:shadow-[0_0_28px_rgba(34,211,238,0.12)]">
                                        <div className="h-32 bg-[#11111b]/50 relative flex items-center justify-center border-b border-zinc-800/50">
                                            <div className="absolute top-3 right-3">
                                                <span className="px-2 py-0.5 rounded text-[9px] font-bold tracking-widest bg-cyan-900/30 text-cyan-400">
                                                    {post.status}
                                                </span>
                                            </div>
                                            <PostIcon
                                                size={40}
                                                className="text-cyan-400 opacity-20"
                                                strokeWidth={1.5}
                                            />
                                        </div>
                                        <div className="p-5 flex-1 flex flex-col bg-[#1e1e2e]">
                                            <h2 className="text-lg font-bold text-zinc-100 group-hover:text-cyan-400 mb-2 transition-colors line-clamp-1">
                                                {post.title}
                                            </h2>
                                            <p className="text-xs text-zinc-400 leading-relaxed mb-6 flex-1 line-clamp-2">
                                                {post.summary}
                                            </p>
                                            <div className="flex items-center justify-between pt-4 border-t border-zinc-900">
                                                <div className="flex items-center gap-1.5 text-[10px] text-zinc-600">
                                                    <Calendar size={12} />{" "}
                                                    {post.date}
                                                </div>
                                                <button className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 hover:text-cyan-400 transition-colors uppercase tracking-widest">
                                                    Read Post{" "}
                                                    <ArrowRight size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {dynamicTabs.map((tab) => {
                    if (activeTab !== tab.id || !tab.data) {
                        return null;
                    }

                    return (
                        <div
                            key={tab.id}
                            className="max-w-4xl mx-auto p-6 md:p-12 animate-fade-in-up">
                            <div className="mb-12">
                                <div className="flex items-center gap-2 text-xs font-mono text-cyan-500 mb-6 uppercase tracking-widest">
                                    <Folder size={12} />{" "}
                                    <span>
                                        posts / {tab.data.category} /{" "}
                                        {tab.data.slug}
                                    </span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-100 mb-6 leading-tight">
                                    {tab.data.title}
                                </h1>
                                <div className="flex flex-wrap items-center gap-6 text-zinc-500 text-sm font-mono border-y border-zinc-900 py-4">
                                    <Calendar size={14} /> {tab.data.date}{" "}
                                    <Tag size={14} />{" "}
                                    {(tab.data.tags || []).join(", ")}
                                </div>
                            </div>
                            <MarkdownRenderer content={tab.data.content} />
                            <button
                                onClick={(e) => closeTab(tab.id, e)}
                                className="mt-12 text-zinc-500 hover:text-cyan-400 font-mono text-xs flex items-center gap-2">
                                <ArrowRight size={14} className="rotate-180" />{" "}
                                BACK_TO_ROOT
                            </button>
                        </div>
                    );
                })}

                {activeTab === "resume" && (
                    <div className="max-w-6xl mx-auto p-6 md:p-12 animate-fade-in-up space-y-10">
                        <section className="rounded-2xl border border-zinc-800 bg-[#11111b]/60 p-6 md:p-8 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
                            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-[0.3em] mb-6">
                                <User size={14} />
                                About
                            </div>

                            <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-8">
                                <div className="space-y-5">
                                    <div>
                                        <h1 className="text-4xl md:text-5xl font-bold text-zinc-100">
                                            {PROFILE.name}
                                        </h1>
                                        <p className="text-xl md:text-2xl text-cyan-400 mt-3">
                                            {PROFILE.role}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400">
                                        <div className="flex items-center gap-2">
                                            <MapPin
                                                size={14}
                                                className="text-cyan-400"
                                            />
                                            {PROFILE.location}
                                        </div>
                                        <a
                                            href={`tel:${PROFILE.phone}`}
                                            className="flex items-center gap-2 hover:text-zinc-200 transition-colors">
                                            <Phone
                                                size={14}
                                                className="text-cyan-400"
                                            />
                                            {PROFILE.phone}
                                        </a>
                                    </div>

                                    <div className="space-y-3 text-zinc-400 leading-relaxed">
                                        {PROFILE.summary.map(
                                            (paragraph, index) => (
                                                <p key={index}>{paragraph}</p>
                                            ),
                                        )}
                                    </div>

                                    <div className="flex flex-wrap gap-3 pt-2">
                                        {PROFILE.links.map((link) => {
                                            const Icon =
                                                socialIconMap[link.icon] ||
                                                Globe;
                                            const tone =
                                                socialToneMap[link.tone] ||
                                                socialToneMap.github;

                                            return (
                                                <a
                                                    key={`hero-${link.label}`}
                                                    href={link.href}
                                                    target={
                                                        link.href.startsWith(
                                                            "http",
                                                        )
                                                            ? "_blank"
                                                            : undefined
                                                    }
                                                    rel={
                                                        link.href.startsWith(
                                                            "http",
                                                        )
                                                            ? "noreferrer"
                                                            : undefined
                                                    }
                                                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium text-zinc-200 transition-all duration-300 ${tone.border} ${tone.bg} ${tone.text} ${tone.glow}`}>
                                                    <Icon
                                                        size={15}
                                                        className={tone.icon}
                                                    />
                                                    {link.label}
                                                </a>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="grid gap-3">
                                    {RESUME.education.map((education) => (
                                        <article
                                            key={education.school}
                                            className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-500/35 hover:shadow-[0_0_28px_rgba(34,211,238,0.12)]">
                                            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-[0.3em] mb-5">
                                                <GraduationCap size={14} />
                                                Education
                                            </div>
                                            <h3 className="text-lg font-semibold text-zinc-100">
                                                {education.school}
                                            </h3>
                                            <p className="text-cyan-400 mt-1">
                                                {education.degree}
                                            </p>
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-3 text-sm text-zinc-500">
                                                <span>
                                                    {education.location}
                                                </span>
                                                <span className="font-mono">
                                                    {education.period}
                                                </span>
                                            </div>
                                            <div className="mt-4 space-y-2">
                                                {education.details.map(
                                                    (detail, index) => (
                                                        <p
                                                            key={index}
                                                            className="text-sm text-zinc-400">
                                                            {detail}
                                                        </p>
                                                    ),
                                                )}
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </div>
                        </section>

                        <section
                            id="resume-section"
                            className="rounded-2xl border border-zinc-800 bg-[#11111b]/60 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] scroll-mt-8">
                            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-[0.3em] mb-6">
                                <Briefcase size={14} />
                                Working Experience
                            </div>

                            <div className="relative space-y-6 pl-8 before:absolute before:left-[11px] before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-gradient-to-b before:from-cyan-400/70 before:via-cyan-500/25 before:to-transparent">
                                {RESUME.experience.map((job) => (
                                    <article
                                        key={`${job.company}-${job.period}`}
                                        className="relative">
                                        <span className="absolute -left-8 top-6 flex h-6 w-6 items-center justify-center rounded-full border border-cyan-400/40 bg-cyan-500/10 shadow-[0_0_18px_rgba(34,211,238,0.2)]">
                                            <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
                                        </span>
                                        <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-500/35 hover:shadow-[0_0_28px_rgba(34,211,238,0.12)]">
                                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-zinc-100">
                                                        {job.role}
                                                    </h3>
                                                    <p className="text-cyan-400">
                                                        {job.company}
                                                    </p>
                                                    <p className="text-sm text-zinc-500">
                                                        {job.location}
                                                    </p>
                                                </div>
                                                <div className="text-sm font-mono text-zinc-500">
                                                    {job.period}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                {job.highlights.map(
                                                    (highlight, index) => (
                                                        <p
                                                            key={index}
                                                            className="text-sm text-zinc-400 leading-relaxed">
                                                            {`> ${highlight}`}
                                                        </p>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </section>

                        <section className="rounded-2xl border border-zinc-800 bg-[#11111b]/60 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
                            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-[0.3em] mb-6">
                                <Award size={14} />
                                Certifications
                            </div>

                            <div className="flex flex-wrap gap-3">
                                {RESUME.certifications.map((certification) => (
                                    <div
                                        key={certification}
                                        className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300">
                                        {certification}
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="rounded-2xl border border-zinc-800 bg-[#11111b]/60 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
                            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-[0.3em] mb-6">
                                <Shield size={14} />
                                Technical Skills
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {RESUME.skills.map((skillGroup) => (
                                    <article
                                        key={skillGroup.category}
                                        className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-500/35 hover:shadow-[0_0_28px_rgba(34,211,238,0.12)]">
                                        <h3 className="text-sm font-mono uppercase tracking-[0.2em] text-cyan-400 mb-4">
                                            {skillGroup.category}
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {skillGroup.items.map((item) => (
                                                <span
                                                    key={item}
                                                    className="px-3 py-1 rounded-full border border-zinc-800 bg-[#11111b] text-xs text-zinc-300">
                                                    {item}
                                                </span>
                                            ))}
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </section>

                        <section className="rounded-2xl border border-zinc-800 bg-[#11111b]/60 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
                            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-[0.3em] mb-6">
                                <Code size={14} />
                                Project Highlights
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {PROJECTS.map((project) => (
                                    <article
                                        key={project.name}
                                        className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-500/35 hover:shadow-[0_0_28px_rgba(34,211,238,0.12)]">
                                        <div className="flex items-start justify-between gap-4 mb-3">
                                            <div>
                                                <h3 className="text-lg font-semibold text-zinc-100">
                                                    {project.name}
                                                </h3>
                                                <p className="text-sm text-zinc-500 mt-1">
                                                    {project.period}
                                                </p>
                                            </div>
                                            <span className="px-2 py-1 rounded text-[10px] font-bold tracking-widest bg-emerald-900/30 text-emerald-400">
                                                {project.status}
                                            </span>
                                        </div>

                                        <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                                            {project.description}
                                        </p>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {project.tech.map((tech) => (
                                                <span
                                                    key={tech}
                                                    className="px-2 py-1 rounded-full border border-zinc-800 bg-[#11111b] text-xs text-zinc-300">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="space-y-2">
                                            {project.highlights.map(
                                                (highlight, index) => (
                                                    <p
                                                        key={index}
                                                        className="text-sm text-zinc-400 leading-relaxed">
                                                        {`> ${highlight}`}
                                                    </p>
                                                ),
                                            )}
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </section>
                    </div>
                )}
            </main>

            <footer className="bg-zinc-900 border-t border-zinc-800 flex justify-between text-[11px] font-mono select-none overflow-hidden">
                <div className="flex items-stretch h-5">
                    <div className="bg-cyan-600 text-zinc-950 font-bold px-4 flex items-center">
                        minh@portfolio
                    </div>
                    <div className="bg-zinc-700 text-zinc-200 px-4 flex items-center gap-2 border-r border-zinc-800 relative shadow-[2px_0_5px_rgba(0,0,0,0.2)] z-10">
                        <Terminal size={12} className="opacity-70" /> 0:
                        {activeTab}*
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
                        ROLE: sec-eng
                    </div>
                    <div className="bg-green-500 text-zinc-950 font-bold px-4 flex items-center uppercase tracking-wider">
                        {activeTab}
                    </div>
                </div>
            </footer>
        </div>
    );
};
