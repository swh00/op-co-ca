'use client';

import { Button } from '@/components/ui/button';
import { Download, Share2 } from 'lucide-react';
import { exportTemplateToJson, copyShareLink } from '@/lib/utils';
import { toast } from 'sonner';
import { Template } from '@/types/template';

interface Props {
  template: Template;
}

export function CalculatorActions({ template }: Props) {
  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={() => exportTemplateToJson(template)}>
        <Download className="w-4 h-4 mr-2" />
        JSON 내보내기
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          const url = copyShareLink(template.id ?? '');
          toast.success("공유 링크 복사 완료", { description: url });
        }}
      >
        <Share2 className="w-4 h-4 mr-2" />
        공유
      </Button>
    </div>
  );
}