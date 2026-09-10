import PageShell from "@/components/PageShell";
import SearchBar from "@/components/SearchBar";
import UserBlogList from "@/components/UserBlogList";
import { blogService } from "@/services/blog.service";
import { getBlogCategories } from "@/utils/blogs";

export default async function DashboardBlogsPage({ searchParams }) {
  const { title = "", category = "", created, updated } = await searchParams;
  const notice = created === "true" ? "Blog published successfully." : updated === "true" ? "Blog updated successfully." : "";
  let categories = [];

  try {
    const response = await blogService.getAll();
    categories = getBlogCategories(Array.isArray(response?.data) ? response.data : []);
  } catch {
    // UserBlogList displays the request error; the filter can remain empty.
  }

  return (
    <PageShell title="My blogs" >
      <SearchBar categories={categories} defaultCategory={category} defaultValue={title} placeholder="Search by blog title..." />
      <UserBlogList category={category} notice={notice} title={title} />
    </PageShell>
  );
}
