// src/app/page.tsx

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { TemplateService } from '@/lib/services';
import { RecentTemplates } from '@/components/home/RecentTemplates';
import { FileImporter } from '@/components/shared/FileImporter';
import { NewTemplateButton } from '@/components/home/NewTemplateButton';
import { SearchInput } from '@/components/home/SearchInput'; // [추가]
import { PaginationControls } from '@/components/shared/PaginationControls'; // [추가]
import { Calculator, Globe } from 'lucide-react';

export const revalidate = 0;

// [변경] searchParams를 props로 받습니다.
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>; // Next.js 15+는 Promise, 14 이하는 그냥 객체
}) {
  // Next.js 15라면 await 필요, 14라면 바로 사용. (안전하게 await 처리)
  const params = await searchParams;
  const query = params.q || '';
  const currentPage = Number(params.page) || 1;
  const itemsPerPage = 10; // 한 페이지당 보여줄 개수

  // [변경] 서비스 호출 시 검색어와 페이지 전달
  const { data: templates, count } = await TemplateService.getPublicTemplates(currentPage, itemsPerPage, query);
  
  // 총 페이지 수 계산
  const totalPages = Math.ceil((count || 0) / itemsPerPage);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
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
        
        {/* 최신 템플릿 리스트 섹션 */}
        <section>
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Globe className="w-6 h-6 text-primary" />
              {query ? `'${query}' 검색 결과` : '최신 공유 템플릿'}
            </h2>
            
            {/* [추가] 검색창 배치 */}
            <SearchInput />
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
              <div className="col-span-full text-center py-20 text-muted-foreground border-2 border-dashed rounded-xl">
                {query ? '검색 결과가 없습니다.' : '등록된 템플릿이 없습니다.'}
              </div>
            )}
          </div>

          {/* [추가] 페이지네이션 컨트롤 */}
          <PaginationControls totalPages={totalPages} />
        </section>

        {/* 최근 본 템플릿 (검색 중일 땐 헷갈리니까 숨길 수도 있음. 여기선 항상 표시) */}
        {!query && <RecentTemplates />}
      </div>
    </main>
  );
}