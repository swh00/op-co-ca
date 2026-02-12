'use client';

import { useEffect, useState } from 'react';
import { Template } from '@/types/template';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, AlertCircle } from 'lucide-react';

// Props로 현재 서버에서 가져온 최신 템플릿 목록을 받습니다.
interface Props {
  publicTemplates: Template[];
}

export function RecentTemplates({ publicTemplates }: Props) {
  const [recents, setRecents] = useState<Template[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('recent_templates');
    if (stored) {
      try {
        const parsedRecents: Template[] = JSON.parse(stored);

        const validRecents = parsedRecents.filter(recent => {
          // 1. ID 자체가 없으면 데이터가 깨진 것이므로 제외
          if (!recent.id) return false;
          // 2. 로컬 저장 데이터인 경우 무조건 유지
          if (recent.id?.startsWith('local_')) return true;
          // 3. 서버 데이터인 경우 서버 목록에 있을 때만 유지
          return publicTemplates.some(pub => pub.id === recent.id);
        });

        // 만약 삭제된 게 발견되어 리스트가 변했다면 로컬스토리지 업데이트
        if (validRecents.length !== parsedRecents.length) {
          localStorage.setItem('recent_templates', JSON.stringify(validRecents));
        }

        setRecents(validRecents);
      } catch (e) {
        console.error("Failed to parse recent templates");
      }
    }
  }, [publicTemplates]); // 서버 목록이 바뀔 때마다 체크

  if (recents.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Clock className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold">최근 열어본 템플릿</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recents.slice(0, 3).map((template) => (
          <Card key={template.id || Math.random()} className="bg-slate-50 dark:bg-slate-900 border-dashed">
            <CardHeader className="p-4">
              <CardTitle className="text-base line-clamp-1">{template.title}</CardTitle>
              <CardDescription className="text-xs line-clamp-1">
                {template.description || "설명이 없습니다."}
              </CardDescription>
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