const CATEGORY_NAMES = {
  api: "API",
  devops: "DevOps",
  javascript: "JavaScript",
  qa: "QA",
  sdet: "SDET",
  ui: "UI",
  ux: "UX",
};

export function formatCategoryLabel(value = "") {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase()
    .split(" ")
    .map((word) => CATEGORY_NAMES[word] ?? `${word.charAt(0).toLocaleUpperCase()}${word.slice(1)}`)
    .join(" ");
}

export function getBlogCategories(blogs = []) {
  const categories = new Map();

  for (const blog of blogs) {
    const category = blog?.category?.trim();
    const key = category?.toLocaleLowerCase();
    if (category && !categories.has(key)) categories.set(key, formatCategoryLabel(key));
  }

  return [...categories.values()].sort((first, second) => first.localeCompare(second));
}
