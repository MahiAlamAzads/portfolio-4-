import { prisma } from "@/lib/prisma";
import {
  FolderKanban,
  Zap,
  Mail,
  BookOpen,
  Eye,
  MessageSquare,
} from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getStats() {
  const [
    projects,
    skills,
    messages,
    posts,
    totalViews,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.skill.count(),
    prisma.message.count({
      where: { read: false },
    }),
    prisma.blog.count({
      where: { published: true },
    }),
    prisma.project.aggregate({
      _sum: { views: true },
    }),
  ]);

  return {
    projects,
    skills,
    messages,
    posts,
    totalViews: totalViews._sum.views ?? 0,
  };
}

const STATS_CONFIG = [
  {
    key: "projects",
    icon: FolderKanban,
    label: "Projects",
    color: "text-blue-400",
  },
  {
    key: "skills",
    icon: Zap,
    label: "Skills",
    color: "text-emerald-400",
  },
  {
    key: "messages",
    icon: Mail,
    label: "Unread Messages",
    color: "text-amber-400",
  },
  {
    key: "posts",
    icon: BookOpen,
    label: "Published Posts",
    color: "text-violet-400",
  },
  {
    key: "totalViews",
    icon: Eye,
    label: "Total Project Views",
    color: "text-rose-400",
  },
];

export default async function DashboardPage() {
  const stats = await getStats();

  const recentMessages = await prisma.message.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Welcome back! Here's an overview.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {STATS_CONFIG.map(
          ({ key, icon: Icon, label, color }) => (
            <div
              key={key}
              className="card space-y-3 p-5"
            >
              <div className={color}>
                <Icon size={20} />
              </div>

              <div>
                <p className="text-2xl font-bold">
                  {(stats as any)[key]}
                </p>

                <p className="mt-0.5 text-xs text-slate-500">
                  {label}
                </p>
              </div>
            </div>
          )
        )}
      </div>

      <div>
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <MessageSquare
            size={18}
            className="text-accent"
          />
          Recent Messages
        </h2>

        <div className="card divide-y divide-surface-border">
          {recentMessages.length === 0 ? (
            <p className="p-5 text-sm text-slate-500">
              No messages yet.
            </p>
          ) : (
            recentMessages.map((msg) => (
              <div
                key={msg.id}
                className="flex items-start gap-3 p-4"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-muted">
                  <span className="text-xs font-bold text-accent">
                    {msg.name[0].toUpperCase()}
                  </span>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {msg.name}
                    </span>

                    {!msg.read && (
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    )}
                  </div>

                  <p className="text-xs text-slate-500">
                    {msg.email}
                  </p>

                  <p className="mt-1 line-clamp-1 text-sm text-slate-400">
                    {msg.message}
                  </p>
                </div>

                <span className="ml-auto shrink-0 text-xs text-slate-600">
                  {new Date(
                    msg.createdAt
                  ).toLocaleDateString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}