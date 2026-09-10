import EditBlogScreen from "@/components/EditBlogScreen";
import PageShell from "@/components/PageShell";

export default async function EditBlogPage({ params }) {
  const { id } = await params;
  return <PageShell title="Edit blog" description="Update your post and save the latest version."><EditBlogScreen blogId={id} /></PageShell>;
}
