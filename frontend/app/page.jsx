import BlogSection from "@/components/BlogSection";
import PublicLayout from "@/components/PublicLayout";
import Hero from "@/components/Hero";
import { blogService } from "@/services/blog.service";
import { getBlogCategories } from "@/utils/blogs";

export default async function HomePage({ searchParams }) {
  const { title = "", category = "" } = await searchParams;
  let blogs = [];
  let categories = [];
  let loadFailed = false;

  try {
    if (title || category) {
      const [filteredResponse, allResponse] = await Promise.all([
        blogService.getAll({ title, category }),
        blogService.getAll(),
      ]);
      blogs = Array.isArray(filteredResponse?.data) ? filteredResponse.data : [];
      categories = getBlogCategories(Array.isArray(allResponse?.data) ? allResponse.data : []);
    } else {
      const response = await blogService.getAll();
      blogs = Array.isArray(response?.data) ? response.data : [];
      categories = getBlogCategories(blogs);
    }
  } catch {
    loadFailed = true;
  }

  return (
    <PublicLayout>
      <Hero />
      <BlogSection blogs={blogs} categories={categories} category={category} loadFailed={loadFailed} title={title} />
    </PublicLayout>
  );
}
