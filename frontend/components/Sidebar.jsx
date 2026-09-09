import Link from "next/link";

const links = [
  ["Overview", "/dashboard"],
  ["Blogs", "/dashboard/blogs"],
  ["Create blog", "/dashboard/blogs/create"],
  ["Profile", "/dashboard/profile"],
  ["Change password", "/dashboard/change-password"],
];

export default function Sidebar() {
  return (
    <aside className="w-full border-b border-slate-200 bg-white p-5 md:min-h-[calc(100vh-4rem)] md:w-64 md:border-b-0 md:border-r">
      <ul className="space-y-2">
        {links.map(([label, href]) => (
          <li key={href}>
            <Link className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100" href={href}>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
