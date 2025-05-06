import { FaBoxOpen, FaHeart, FaUser, FaBell, FaMapMarkerAlt } from "react-icons/fa";
// import AddressCard from "./AddressCard"; // Not needed here

const stats = [
  {
    label: "Orders",
    value: 12,
    icon: <FaBoxOpen className="text-3xl text-blue-500" />,
    href: "/dashboard/buyer/orders",
    color: "bg-blue-100"
  },
  {
    label: "Wishlist",
    value: 5,
    icon: <FaHeart className="text-3xl text-pink-500" />,
    href: "/dashboard/buyer/wishlist",
    color: "bg-pink-100"
  },
  {
    label: "Addresses",
    value: 2, // Example count, replace with real data if available
    icon: <FaMapMarkerAlt className="text-3xl text-green-500" />,
    href: "/dashboard/buyer/address",
    color: "bg-green-100"
  },
  {
    label: "Notifications",
    value: 3,
    icon: <FaBell className="text-3xl text-purple-500" />,
    href: "/dashboard/buyer/notifications",
    color: "bg-purple-100"
  },
  {
    label: "Become a Vendor",
    value: '',
    icon: <FaUser className="text-3xl text-yellow-600" />,
    href: "/vendor-apply",
    color: "bg-yellow-50 border border-yellow-200 hover:bg-yellow-100"
  },
];

const recentActivity = [
  { id: 1, type: "Order", desc: "Order #1234 placed", date: "2025-05-01" },
  { id: 2, type: "Wishlist", desc: "Added 'Wireless Headphones' to wishlist", date: "2025-05-02" },
  { id: 3, type: "Profile", desc: "Updated shipping address", date: "2025-05-03" },
  { id: 4, type: "Notification", desc: "Received promo offer", date: "2025-05-03" },
];

export default function BuyerDashboard() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <a
            key={stat.label}
            href={stat.href}
            className={`flex items-center gap-4 p-5 rounded-xl shadow hover:shadow-lg transition ${stat.color}`}
          >
            <div>{stat.icon}</div>
            <div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-gray-700">{stat.label}</div>
            </div>
          </a>
        ))}
      </div>
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <ul className="divide-y divide-gray-200">
          {recentActivity.map((item) => (
            <li key={item.id} className="py-3 flex flex-col md:flex-row md:items-center md:justify-between">
              <span className="font-medium text-gray-800">{item.desc}</span>
              <span className="text-sm text-gray-500">{item.date}</span>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}
