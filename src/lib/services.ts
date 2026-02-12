// src/lib/services.ts
import { supabase } from './supabase';
import { Template } from '@/types/template';

export const TemplateService = {
  // 1. 새 템플릿 저장하기
  async createTemplate(template: Template) {
    const { data, error } = await supabase
      .from('templates')
      .insert([template])
      .select();

    if (error) throw error;
    return data[0];
  },

  async getPublicTemplates(page: number = 1, limit: number = 12) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .range(from, to); // 데이터 범위 지정

    if (error) throw error;
    return data as Template[];
  },

  // 3. 특정 템플릿 상세 조회
  async getTemplateById(id: string) {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Template;
  }
};