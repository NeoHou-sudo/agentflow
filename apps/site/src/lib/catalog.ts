import data from '../data/workflows.json';

export interface Field {
  i: number;
  label: string;
  hint: string;
  zhToken: string;
  enToken: string;
  options: string[];
}

export interface Extra {
  title: string;
  html: string;
}

export interface Workflow {
  slug: string;
  id: string;
  category: string;
  categoryName: string;
  icon: string;
  accent: string;
  title: string;
  titleEn: string;
  scene: string;
  source: string;
  effect: string;
  summary: string;
  difficulty: number;
  difficultyRaw: string;
  version: string;
  updatedAt: string;
  disclaimer: string;
  promptZh: string;
  promptEn: string;
  outputFormat: string;
  fields: Field[];
  extras: Extra[];
  path: string;
  stats: { zhChars: number; enChars: number; placeholders: number };
}

export interface Category {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  accent: string;
  desc: string;
  count: number;
}

interface Catalog {
  generatedAt: string;
  source: string;
  categories: Category[];
  workflows: Workflow[];
}

const catalog = data as unknown as Catalog;

export const workflows: Workflow[] = catalog.workflows;
export const categories: Category[] = catalog.categories;
export const generatedAt = catalog.generatedAt;

export function bySlug(slug: string): Workflow | undefined {
  return workflows.find((w) => w.slug === slug);
}

export function byCategory(id: string): Workflow[] {
  return workflows.filter((w) => w.category === id);
}

export function category(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}

/** 同分类的其他工作流，用来做内链 */
export function related(w: Workflow, limit = 4): Workflow[] {
  const same = workflows.filter((x) => x.category === w.category && x.slug !== w.slug);
  const rest = workflows.filter((x) => x.category !== w.category && x.slug !== w.slug);
  return [...same, ...rest].slice(0, limit);
}

export const stats = {
  total: workflows.length,
  categories: categories.length,
  bilingual: workflows.filter((w) => w.promptZh && w.promptEn).length,
  withForm: workflows.filter((w) => w.fields.length > 0).length,
  fields: workflows.reduce((n, w) => n + w.fields.length, 0),
};
