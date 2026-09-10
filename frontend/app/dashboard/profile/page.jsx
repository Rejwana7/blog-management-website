import PageShell from "@/components/PageShell";
import UserProfile from "@/components/UserProfile";

export default function ProfilePage() {
  return <PageShell title="Profile" description="View the information connected to your account."><UserProfile /></PageShell>;
}
