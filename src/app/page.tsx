import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { TemplateService } from '@/lib/services';
import { Plus, Calculator, BarChart3 } from 'lucide-react';

// 페이지 진입 시마다 데이터를 새로 고침 (캐싱 방지하여 최신 목록 유지)
export const revalidate = 0;

export default async function Home() {
  // Supabase에서 템플릿 목록 가져오기 (비동기)
  const templates = await TemplateService.getPublicTemplates();

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
      {/* 헤더 섹션 */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-slate-950/95">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-primary">
            <Calculator className="w-6 h-6" />
            <span>OP-CO-CA</span>
          </div>
          <Link href="/builder">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              새 템플릿 만들기
            </Button>
          </Link>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* 히어로 섹션 */}
        <section className="text-center py-12 space-y-6">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl">
            모든 선택에는 <span className="text-primary">비용</span>이 있다
          </h1>
          <p className="text-xl text-muted-foreground max-w-[600px] mx-auto">
            나만의 기준으로 기회비용을 계산하고, 더 나은 결정을 내리세요.
            직관적인 수치로 당신의 선택을 도와드립니다.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/builder">
              <Button size="lg" className="h-12 px-8 text-lg">
                지금 시작하기
              </Button>
            </Link>
          </div>
        </section>

        {/* 템플릿 리스트 섹션 */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <BarChart3 className="w-6 h-6" />
              최신 템플릿
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates && templates.length > 0 ? (
              templates.map((template) => (
                <Card key={template.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                        {template.category || '일반'}
                      </span>
                    </div>
                    <CardTitle className="line-clamp-1 text-xl group-hover:text-primary transition-colors">
                      {template.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 min-h-[40px]">
                      {template.description || '설명이 없습니다.'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                        <span>항목 {template.schema?.length || 0}개</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link href={`/calc/${template.id}`} className="w-full">
                      <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
                        계산해보기
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))
            ) : (
              // 템플릿이 없을 경우 보여줄 UI
              <div className="col-span-full text-center py-20 border-2 border-dashed rounded-xl bg-slate-50/50">
                <div className="max-w-md mx-auto space-y-4">
                  <p className="text-xl font-semibold text-muted-foreground">
                    아직 등록된 템플릿이 없습니다.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    첫 번째 템플릿의 주인공이 되어보세요!
                  </p>
                  <Link href="/builder">
                    <Button variant="outline">
                      템플릿 만들러 가기
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}