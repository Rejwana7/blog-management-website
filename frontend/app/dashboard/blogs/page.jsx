import PageShell from "@/components/PageShell";
import UserBlogList from "@/components/UserBlogList";

export default async function DashboardBlogsPage({ searchParams }) {
  const { title = "", category = "", created, updated } = await searchParams;
  const notice = created === "true" ? "Blog published successfully." : updated === "true" ? "Blog updated successfully." : "";

  return (
    <PageShell title="My blogs" >
      <UserBlogList category={category} notice={notice} title={title} />
    </PageShell>
  );
}
