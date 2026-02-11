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

  // 2. 전체 템플릿 목록 가져오기 (커뮤니티용)
  async getPublicTemplates() {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .order('created_at', { ascending: false });

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