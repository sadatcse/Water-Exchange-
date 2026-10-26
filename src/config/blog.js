// Blog categories — used by the BlogPost model, the dashboard editor and the /blog filters
export const BLOG_CATEGORIES = ['Water Treatment', 'Compliance', 'Waste Management', 'Research', 'Events', 'Energy', 'Training'];

export const BLOG_CATEGORY_OPTIONS = BLOG_CATEGORIES.map((c) => ({ value: c, label: c }));
