// src/components/builder/SaveButton.tsx
'use client';

import { useTemplateStore } from '@/store/useTemplateStore';
import { TemplateService } from '@/lib/services';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner'; // ✨ useToast 대신 sonner의 toast를 직접 가져옵니다.
import { Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function SaveButton() {
  const { template } = useTemplateStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (loading) return;        
    setLoading(true); 
    // 1. 유효성 검사 (Edge Case 대응)
    if (!template.title) {
      return toast.error("오류: 템플릿 제목을 입력해주세요.");
    }
    if (template.schema.length === 0) {
      return toast.error("오류: 최소 하나 이상의 기준을 추가해주세요.");
    }

    try {
      const savedData = await TemplateService.createTemplate(template);
      // 2. 성공 알림
      toast.success("저장 완료! 커뮤니티에 템플릿이 등록되었습니다.");
      console.log("Saved ID:", savedData.id);
      router.replace(`/calc/${savedData.id}`);
    } catch (error) {
      // 3. 에러 처리 (네트워크 오류 등)
      toast.error("저장 실패: 서버 오류가 발생했습니다.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleSave} disabled={loading} className="flex gap-2">
      <Save size={18} />
      템플릿 배포하기
    </Button>
  );
}