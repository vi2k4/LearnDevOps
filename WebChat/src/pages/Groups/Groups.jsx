import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../../store/useStore";

export default function Groups() {
  const groups = useUserStore((s) => s.groups);
  const createGroup = useUserStore((s) => s.createGroup);
  const loadGroups = useUserStore((s) => s.loadGroups);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadGroups().catch((error) => console.error(error));
  }, [loadGroups]);

  async function handleCreate(e) {
    e.preventDefault();
    if (!name) return;

    try {
      const created = await createGroup({ name });
      setName("");
      navigate(`/chat/group/${created.id}`);
    } catch (error) {
      alert(
        error?.response?.data?.message ||
          error.message ||
          "Unable to create conversation",
      );
    }
  }

  return (
    <div>
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold">Groups</h2>
        <form onSubmit={handleCreate} className="mt-3 flex gap-2">
          <input
            className="w-full border rounded-md px-3 py-2"
            placeholder="Group name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-md"
            type="submit"
          >
            Create
          </button>
        </form>

        <ul className="mt-4 divide-y">
          {groups.map((g) => (
            <li key={g.id} className="py-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{g.name}</div>
                <div className="text-sm text-black">{g.type || "GROUP"}</div>
              </div>
              <div className="actions">
                <Link to={`/chat/group/${g.id}`} className="text-indigo-600">
                  Open
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
