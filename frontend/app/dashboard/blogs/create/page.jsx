import BlogForm from "@/components/BlogForm";
import PageShell from "@/components/PageShell";

export default function CreateBlogPage() {
  return (
    <PageShell title="Create blog" description="Turn an idea into a useful post for your readers.">
      <div className="max-w-3xl"><BlogForm /></div>
    </PageShell>
  );
}
