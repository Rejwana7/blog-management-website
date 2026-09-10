import AuthenticatedShell from "@/components/AuthenticatedShell";

export default function AdminLayout({ children }) {
  return <AuthenticatedShell>{children}</AuthenticatedShell>;
}
