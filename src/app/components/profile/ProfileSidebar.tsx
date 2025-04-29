import { HiUser, HiClipboardList, HiHeart, HiTrash } from "react-icons/hi";

export default function ProfileSidebar({ active, onChange }) {
  const menu = [
    { id: "profile", label: "Edit Profile", icon: HiUser },
    { id: "orders", label: "Order History", icon: HiClipboardList },
    { id: "wishlist", label: "Wishlist", icon: HiHeart },
    { id: "delete", label: "Delete Account", icon: HiTrash },
  ];

  return (
    <aside
      className="
        w-72
        bg-white
        rounded-2xl
        border
        border-gray-300
        p-6
        flex flex-col
        gap-2
        transition
        duration-300
        ease-in-out
      "
    >
      <nav className="flex flex-col gap-1">
        {menu.map(item => (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition
              ${
                active === item.id
                  ? "bg-black text-white"
                  : item.id === "delete"
                  ? "text-red-600 hover:bg-red-100"
                  : "text-gray-700 hover:bg-gray-200"
              }
            `}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
