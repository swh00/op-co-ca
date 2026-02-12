// src/app/page.tsx
// RecentTemplates 컴포넌트를 상단에 배치하고, FileImporter 컴포넌트를 헤더에 추가
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { TemplateService } from '@/lib/services';
import { RecentTemplates } from '@/components/home/RecentTemplates'; 
import { FileImporter } from '@/components/shared/FileImporter'; 
import { Plus, Calculator, Globe } from 'lucide-react';
import { NewTemplateButton } from '@/components/home/NewTemplateButton';
export const revalidate = 0;

export default async function Home() {
  const templates = await TemplateService.getPublicTemplates();

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
      {/* 헤더: 로고, 가져오기, 만들기 */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur dark:bg-slate-950/95">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-primary">
            <Calculator className="w-6 h-6" />
            <span>OP-CO-CA</span>
          </div>
          <div className="flex gap-2">
            <FileImporter />
            <NewTemplateButton />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* 섹션 1: 서버에 저장된 최신 템플릿 (요청하신 상단 배치) */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Globe className="w-6 h-6 text-primary" />
              최신 공유 템플릿
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates && templates.length > 0 ? (
              templates.map((template) => (
                <Card key={template.id} className="group hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                        {template.category || '일반'}
                      </span>
                    </div>
                    <CardTitle className="line-clamp-1 text-lg group-hover:text-primary">
                      {template.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 min-h-[40px]">
                      {template.description || '설명이 없습니다.'}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Link href={`/calc/${template.id}`} className="w-full">
                      <Button variant="outline" className="w-full">계산해보기</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-muted-foreground">
                등록된 템플릿이 없습니다.
              </div>
            )}
          </div>
        </section>

        {/* 섹션 2: 내가 최근에 사용한 템플릿 (하단 배치) */}
        <RecentTemplates />

      </div>
    </main>
  );
}