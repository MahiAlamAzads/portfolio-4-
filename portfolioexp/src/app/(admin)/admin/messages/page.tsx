// src/app/(admin)/admin/messages/page.tsx

import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import MarkReadButton from "@/components/admin/MarkReadButton";
import { Mail, MailOpen } from "lucide-react";

export default async function MessagesPage() {
  const messages = await prisma.message.findMany({ orderBy: { createdAt: "desc" } });
  const unread   = messages.filter((m) => !m.read).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Messages</h1>
        <p className="text-slate-400 text-sm mt-1">
          {unread > 0 ? (
            <span className="text-accent font-medium">{unread} unread</span>
          ) : "All caught up"} · {messages.length} total
        </p>
      </div>

      <div className="card divide-y divide-surface-border">
        {messages.length === 0 ? (
          <p className="p-6 text-slate-500 text-sm text-center">No messages yet.</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`p-5 space-y-2 ${!msg.read ? "bg-accent-muted/30" : ""}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  {msg.read
                    ? <MailOpen size={15} className="text-slate-500" />
                    : <Mail size={15} className="text-accent" />}
                  <span className="font-medium text-sm">{msg.name}</span>
                  <a href={`mailto:${msg.email}`} className="text-xs text-slate-500 hover:text-accent transition-colors">
                    {msg.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-slate-600">{formatDate(msg.createdAt)}</span>
                  {!msg.read && <MarkReadButton id={msg.id} />}
                </div>
              </div>
              {msg.subject && (
                <p className="text-xs font-medium text-slate-300">{msg.subject}</p>
              )}
              <p className="text-sm text-slate-400 leading-relaxed">{msg.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
