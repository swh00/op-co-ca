// src/app/page.tsx

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { TemplateService } from '@/lib/services';
import { RecentTemplates } from '@/components/home/RecentTemplates';
import { FileImporter } from '@/components/shared/FileImporter';
import { NewTemplateButton } from '@/components/home/NewTemplateButton';
import { SearchInput } from '@/components/home/SearchInput';
import { PaginationControls } from '@/components/shared/PaginationControls';
import { OfflineBanner } from '@/components/shared/OfflineBanner'; // 클라이언트 컴포넌트
import { Calculator, Globe } from 'lucide-react';
import { Template } from '@/types/template';
import { MyLibrary } from '@/components/home/MyLibrary';
export const revalidate = 0;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const query = params.q || '';
  const currentPage = Number(params.page) || 1;
  const itemsPerPage = 10;

  let templates: Template[] = [];
  let count = 0;

  /**
   * 서버 측 데이터 페칭
   * - 온라인일 때: 정상적으로 DB 데이터를 가져옴
   * - 오프라인일 때: 
   * 1. PWA 서비스워커가 캐시된 이 페이지(HTML)를 대신 보여줌.
   * 2. 이 서버 코드는 오프라인 상태에선 실행되지 않으므로, 
   * 여기 있는 templates 데이터는 '과거 온라인일 때의 데이터'일 수 있음.
   */
  try {
    const result = await TemplateService.getPublicTemplates(currentPage, itemsPerPage, query);
    templates = result.data || [];
    count = result.count || 0;
  } catch (error) {
    console.error("Server-side DB Fetch Error:", error);
    // 서버는 켜져있으나 DB만 응답이 없을 때를 위한 방어 로직
    templates = [];
    count = 0;
  }

  const totalPages = Math.ceil(count / itemsPerPage);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
      {/* 헤더 영역 */}
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

      <div className="container mx-auto px-4 py-8 space-y-16">
        
        {/* [중요] 실시간 인터넷 상태 감지 배너 (Client Component) */}
        {/* PWA로 접속 시, 실제 브라우저의 온라인 여부를 체크하여 실시간으로 뜹니다. */}
        <OfflineBanner />

        {/* 검색 중이 아닐 때만 '내 보관함' 노출 */}
        {!query && (
          <div className="space-y-16">
            {/* 최근 본 기록 (슬라이드 형태 등) */}
            <RecentTemplates publicTemplates={templates} />
            
            {/* 내 보관함 (로컬 DB 관리용) */}
            <MyLibrary />
            
            <hr className="border-slate-200 dark:border-slate-800" />
          </div>
        )}
        
        {/* 전체 공유 템플릿 섹션 */}
        <section>
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Globe className="w-6 h-6 text-primary" />
              {query ? `'${query}' 검색 결과` : '전 세계 공유 템플릿'}
            </h2>
            <SearchInput />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.length > 0 ? (
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
              <div className="col-span-full text-center py-20 text-muted-foreground border-2 border-dashed rounded-xl bg-white/50">
                {query ? '검색 결과가 없습니다.' : '등록된 공유 템플릿이 없습니다.'}
              </div>
            )}
          </div>

          {/* 페이지네이션 (DB 데이터가 있을 때만 표시) */}
          {templates.length > 0 && totalPages > 1 && (
            <PaginationControls totalPages={totalPages} />
          )}
        </section>
      </div>
    </main>
  );
}