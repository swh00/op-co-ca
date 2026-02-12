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

  async getPublicTemplates(page: number = 1, limit: number = 9, query: string = '') {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // 1. 기본 쿼리 생성 (공개 템플릿만, 최신순)
    let dbQuery = supabase
      .from('templates')
      .select('*', { count: 'exact' }) // count: 'exact'를 넣어야 전체 개수를 알려줍니다.
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    // 2. 검색어가 있으면 제목(title) 또는 설명(description)에서 찾기
    if (query) {
      dbQuery = dbQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
    }

    // 3. 페이지네이션 적용
    const { data, error, count } = await dbQuery.range(from, to);

    if (error) throw error;
    
    // 데이터와 전체 개수를 함께 반환
    return { data: data as Template[], count: count || 0 };
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