import PageShell from "@/components/PageShell";
import ChangePasswordForm from "@/components/ChangePasswordForm";

export default function ChangePasswordPage() {
  return (
    <PageShell title="Change password" description="Choose a Strong Password." titleClassName="text-blue-600 text-xl font-bold"
  descriptionClassName="text-gray-500 text-lg">
      <ChangePasswordForm />
    </PageShell>
  );
}
