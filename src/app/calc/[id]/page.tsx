import { notFound } from 'next/navigation';
import { TemplateService } from '@/lib/services';
import { CalculatorEngine } from '@/components/calculator/CalculatorEngine';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface Props {
  params: {
    id: string;
  };
}

// 동적 페이지: ID를 받아 데이터를 fetch하고 컴포넌트에 주입
export default async function CalculatorPage({ params }: Props) {
  try {
    const template = await TemplateService.getTemplateById(params.id);

    if (!template) {
      notFound(); // 템플릿이 없으면 404 페이지로 이동
    }

    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* 상단 네비게이션 */}
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{template.title}</h1>
              <p className="text-muted-foreground text-sm">{template.description}</p>
            </div>
          </div>

          {/* 계산 엔진 컴포넌트 */}
          <CalculatorEngine template={template} />
        </div>
      </main>
    );
  } catch (error) {
    console.error("Failed to load template:", error);
    notFound();
  }
}