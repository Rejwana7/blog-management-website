import AuthenticatedShell from "@/components/AuthenticatedShell";

export default function DashboardLayout({ children }) {
  return <AuthenticatedShell>{children}</AuthenticatedShell>;
}
