import BlogSection from "@/components/BlogSection";
import PublicLayout from "@/components/PublicLayout";
import Hero from "@/components/Hero";
import { blogService } from "@/services/blog.service";

export default async function HomePage() {
  let blogs = [];
  let loadFailed = false;

  try {
    const response = await blogService.getAll();
    blogs = Array.isArray(response?.data) ? response.data : [];
  } catch {
    loadFailed = true;
  }

  return (
    <PublicLayout>
      <Hero />
      <BlogSection blogs={blogs} loadFailed={loadFailed} />
    </PublicLayout>
  );
}
