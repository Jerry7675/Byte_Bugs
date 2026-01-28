/**
 * Category Tags Component
 * Displays category badges
 */

interface Category {
  id: string;
  name: string;
}

interface CategoryTagsProps {
  categories: Category[];
  max?: number;
}

export function CategoryTags({ categories, max }: CategoryTagsProps) {
  const displayCategories = max ? categories.slice(0, max) : categories;
  const remaining = max && categories.length > max ? categories.length - max : 0;

  if (categories.length === 0) {
    return (
      <span className="text-sm text-gray-500 italic">No categories yet</span>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {displayCategories.map((category) => (
        <span
          key={category.id}
          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
        >
          {category.name}
        </span>
      ))}
      {remaining > 0 && (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
          +{remaining} more
        </span>
      )}
    </div>
  );
}
