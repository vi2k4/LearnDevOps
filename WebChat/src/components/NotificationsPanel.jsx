export default function NotificationsPanel({
  notifications = [],
  className = "",
  title = "Notifications",
}) {
  return (
    <div
      className={`${className} w-80 rounded-lg bg-slate-900/95 border border-white/10 shadow-lg p-3 z-50`}
    >
      <div className="text-sm font-semibold text-slate-200 mb-2">{title}</div>
      <ul className="space-y-2 max-h-56 overflow-auto">
        {notifications.length === 0 && (
          <li className="text-sm text-slate-300">No notifications yet</li>
        )}
        {notifications.map((n) => (
          <li key={n.id} className="text-sm text-slate-300 border-b pb-2">
            <div className="font-medium">{n.title || "Notification"}</div>
            <div className="text-xs text-slate-400">
              {n.message || n.content}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
