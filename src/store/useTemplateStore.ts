// src/store/useTemplateStore.ts
import { create } from 'zustand';
import { Template, Criterion } from '@/types/template';

interface TemplateState {
  template: Template;
  setTitle: (title: string) => void;
  addCriterion: (criterion: Criterion) => void;
  removeCriterion: (id: string) => void;
  updateCriterion: (id: string, updates: Partial<Criterion>) => void;
  resetTemplate: () => void;
}

const initialTemplate: Template = {
  title: '',
  description: '',
  schema: [],
  is_public: true,
  category: '일반',
};

export const useTemplateStore = create<TemplateState>((set) => ({
  template: initialTemplate,
  setTitle: (title) => set((state) => ({ template: { ...state.template, title } })),
  addCriterion: (criterion) => 
    set((state) => ({ template: { ...state.template, schema: [...state.template.schema, criterion] } })),
  removeCriterion: (id) => 
    set((state) => ({ template: { ...state.template, schema: state.template.schema.filter(c => c.id !== id) } })),
  updateCriterion: (id, updates) => 
    set((state) => ({
      template: {
        ...state.template,
        schema: state.template.schema.map((c) => (c.id === id ? { ...c, ...updates } : c)),
      },
    })),
  resetTemplate: () => set({ template: initialTemplate }),
}));