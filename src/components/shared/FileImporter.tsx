'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTemplateStore } from '@/store/useTemplateStore';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { toast } from 'sonner'; 
import { Template } from '@/types/template';

export function FileImporter() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setTemplate } = useTemplateStore();
  const router = useRouter();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        
        // 간단한 유효성 검사
        if (!json.title || !Array.isArray(json.schema)) {
          throw new Error("Invalid template format");
        }

        const importedTemplate: Template = { ...json };
        delete importedTemplate.id;          
        delete importedTemplate.created_at;  
        delete importedTemplate.author_id;   
        setTemplate(importedTemplate);
        
        // 2. sonner 사용 방식 (성공)
        toast.success("파일 로드 성공", {
          description: "템플릿을 불러왔습니다.",
        });
        
        router.push('/builder');
        
      } catch (error) {
        // 3. sonner 사용 방식 (에러)
        toast.error("오류 발생", {
          description: "올바르지 않은 JSON 파일입니다.",
        });
      }
    };
    reader.readAsText(file);
    
    // 파일 입력 초기화 (같은 파일을 다시 올릴 때 대비)
    e.target.value = '';
  };

  return (
    <>
      <input 
        type="file" 
        accept=".json" 
        ref={fileInputRef} 
        className="hidden" 
        onChange={handleFileUpload} 
      />
      <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
        <Upload className="w-4 h-4 mr-2" />
        JSON 불러오기
      </Button>
    </>
  );
}