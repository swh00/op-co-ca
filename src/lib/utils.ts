// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
 
import { Template } from '@/types/template';

// 템플릿을 JSON 파일로 다운로드
export const exportTemplateToJson = (template: Template) => {
  const dataStr = JSON.stringify(template, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  const exportFileDefaultName = `${template.title || 'template'}.json`;
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};

// 공유용 URL 복사
export const copyShareLink = (templateId: string) => {
  const shareUrl = `${window.location.origin}/calc/${templateId}`;
  navigator.clipboard.writeText(shareUrl);
  return shareUrl;
};