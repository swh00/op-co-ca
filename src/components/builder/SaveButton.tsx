// src/components/builder/SaveButton.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useTemplateStore } from '@/store/useTemplateStore';
import { TemplateService } from '@/lib/services';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Cloud, HardDrive, Loader2, WifiOff } from 'lucide-react';
import { useState } from 'react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export function SaveButton() {
  const { template, resetTemplate } = useTemplateStore();
  const isOnline = useOnlineStatus();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // 1. 서버에 공유 (Online Only)
  const handleServerSave = async () => {
    if (!isOnline) return;
    setIsLoading(true);
    try {
      const saved = await TemplateService.createTemplate({ ...template, is_public: true });
      toast.success("전 세계에 공유되었습니다!");
      router.push(`/calc/${saved.id}`);
    } catch (e) {
      toast.error("서버 저장 실패");
    } finally {
      setIsLoading(false);
    }
  };

  // 2. 내 브라우저에만 저장 (Offline/Private)
  const handleLocalSave = () => {
  // 현재 스토어에 id가 없거나 undefined인 경우를 대비해 확실히 생성
  const finalId = template.id || `local_${crypto.randomUUID?.() || Date.now()}`;
  
  const localData = { 
    ...template, 
    id: finalId, 
    is_public: false, 
    updatedAt: new Date().toISOString() 
  };

  const stored = localStorage.getItem('recent_templates');
  const recents = stored ? JSON.parse(stored) : [];
  
  // 중복 방지: 같은 ID가 있으면 지우고 맨 앞으로 보냄
  const filteredRecents = recents.filter((r: any) => r.id !== finalId);
  localStorage.setItem('recent_templates', JSON.stringify([localData, ...filteredRecents].slice(0, 20)));
  
  toast.success("로컬에 저장되었습니다.");
  router.push('/');
};

  return (
    <div className="flex flex-col gap-3 w-full border-t pt-6">
      {!isOnline && (
        <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg text-sm">
          <WifiOff size={16} />
          <span>오프라인 상태입니다. 로컬 저장을 이용해주세요.</span>
        </div>
      )}
      
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          className="flex-1" 
          onClick={handleLocalSave}
        >
          <HardDrive className="w-4 h-4 mr-2" />
          내 장치에 저장
        </Button>

        <Button 
          className="flex-1" 
          onClick={handleServerSave} 
          disabled={!isOnline || isLoading}
        >
          {isLoading ? <Loader2 className="animate-spin mr-2" size={16} /> : <Cloud className="w-4 h-4 mr-2" />}
          서버에 공유
        </Button>
      </div>
    </div>
  );
}