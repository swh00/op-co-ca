// src/components/home/RecentTemplates.tsx
'use client';

import { useEffect, useState } from 'react';
import { Template } from '@/types/template';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

export function RecentTemplates() {
  const [recents, setRecents] = useState<Template[]>([]);

  useEffect(() => {
    // localStorage에서 'recent_templates' 키로 저장된 데이터 로드
    const stored = localStorage.getItem('recent_templates');
    if (stored) {
      try {
        setRecents(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse recent templates");
      }
    }
  }, []);

  if (recents.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Clock className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold">최근 열어본 템플릿</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recents.slice(0, 3).map((template) => ( // 최근 3개만 표시
          <Card key={template.id || Math.random()} className="bg-slate-50 dark:bg-slate-900 border-dashed">
            <CardHeader className="p-4">
              <CardTitle className="text-base line-clamp-1">{template.title}</CardTitle>
              <CardDescription className="text-xs line-clamp-1">{template.description}</CardDescription>
            </CardHeader>
            <CardFooter className="p-4 pt-0">
              <Link href={template.id ? `/calc/${template.id}` : '/builder'} className="w-full">
                <Button variant="secondary" size="sm" className="w-full text-xs">
                  다시 열기
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}