import PageShell from "@/components/PageShell";

export default async function ResetPasswordPage({ params }) {
  const { token } = await params;
  return <PageShell title="Reset password" description={`Reset-token route is ready (${token.slice(0, 8)}...).`} />;
}
