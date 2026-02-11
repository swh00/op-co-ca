// src/types/template.ts
export type CriterionType = 'benefit' | 'cost';

export interface Criterion {
  id: string;
  label: string;
  weight: number;
  type: CriterionType;
}

export interface Template {
  id?: string;
  created_at?: string;
  title: string;
  description: string;
  author_id?: string;
  schema: Criterion[];
  is_public: boolean;
  category: string;
}