import CategoryFilter from "@/components/CategoryFilter";
import PageShell from "@/components/PageShell";
import SearchBar from "@/components/SearchBar";

export default function DashboardBlogsPage() {
  return (
    <PageShell title="My blogs" description="Search, filter, edit, and delete your blog posts.">
      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <SearchBar />
        <CategoryFilter />
      </div>
    </PageShell>
  );
}
