import BlogForm from "@/components/BlogForm";
import PageShell from "@/components/PageShell";

export default async function EditBlogPage({ params }) {
  const { id } = await params;
  return <PageShell title="Edit blog" description={`Editing blog ID: ${id}`}><BlogForm /></PageShell>;
}
