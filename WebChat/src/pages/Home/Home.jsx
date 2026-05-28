import { Link } from "react-router-dom";
import { useUserStore } from "../../store/useStore";

export default function Home() {
  const user = useUserStore((s) => s.user);
  const displayName = user?.username || user?.name || user?.email || "there";
  return (
    <div>
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold">Welcome, {displayName}</h2>
        <p className="text-black mt-2">Choose where to go</p>
        <div className="mt-4 flex gap-3">
          <Link
            to="/friends"
            className="px-4 py-2 border rounded-md text-indigo-600"
          >
            Friends
          </Link>
          <Link
            to="/groups"
            className="px-4 py-2 border rounded-md text-indigo-600"
          >
            Groups
          </Link>
        </div>
      </div>
    </div>
  );
}
