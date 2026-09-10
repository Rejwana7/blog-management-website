import PageShell from "@/components/PageShell";
import AdminUserManagement from "@/components/AdminUserManagement";

export default function AdminUsersPage() {
  return (
    <PageShell title="Users" description="View accounts and manage user access.">
      <AdminUserManagement />
    </PageShell>
  );
}
