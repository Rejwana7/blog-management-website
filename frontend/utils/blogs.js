export function getBlogCategories(blogs = []) {
  const categories = new Map();

  for (const blog of blogs) {
    const category = blog?.category?.trim();
    const key = category?.toLocaleLowerCase();
    if (category && !categories.has(key)) categories.set(key, category);
  }

  return [...categories.values()].sort((first, second) => first.localeCompare(second));
}
