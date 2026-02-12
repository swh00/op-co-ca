// src/components/home/NewTemplateButton.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useTemplateStore } from '@/store/useTemplateStore';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function NewTemplateButton() {
  const router = useRouter();
  const { resetTemplate } = useTemplateStore();

  const handleCreateNew = () => {
    // 1. 기존에 남아있던 데이터(제목, 스키마 등)를 싹 지운다.
    resetTemplate();
    
    // 2. 깨끗한 상태로 빌더 페이지로 이동한다.
    router.push('/builder');
  };

  return (
    <Button onClick={handleCreateNew}>
      <Plus className="w-4 h-4 mr-2" />
      새 템플릿 만들기
    </Button>
  );
}