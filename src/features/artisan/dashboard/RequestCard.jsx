"use client";

function getInitials(name) {
  if (!name) return "??";
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

function formatRelativeTime(dateString) {
  if (!dateString) return "";
  const diffMs = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function RequestCard({ request, onAccept, onReject, isPending }) {
  return (
    <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:border-teal-100 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white text-xs font-bold">
            {getInitials(request.userName || request.title)}
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">{request.userName || request.title || "Client"}</h4>
            <p className="text-[10px] text-slate-400">{request.address || request.location || ""}</p>
          </div>
        </div>
        <span className="text-[9px] font-bold text-slate-300 uppercase">
          {formatRelativeTime(request.createdAt)}
        </span>
      </div>
      <p className="text-xs leading-relaxed text-slate-600 mb-4">{request.description || request.message}</p>
      <div className="flex gap-2">
        <button
          onClick={() => onAccept(request.id)}
          disabled={isPending}
          className="flex-1 bg-teal-600 text-white py-2 rounded-xl text-[10px] font-bold hover:bg-teal-700 disabled:opacity-50"
        >
          Accept
        </button>
        <button
          onClick={() => onReject(request.id)}
          className="flex-1 border border-slate-100 text-slate-400 py-2 rounded-xl text-[10px] font-bold hover:bg-slate-50"
        >
          Reject
        </button>
      </div>
    </article>
  );
}
