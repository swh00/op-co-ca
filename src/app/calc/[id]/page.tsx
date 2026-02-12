// op-co-ca/src/app/calc/[id]/page.tsx
import { notFound } from 'next/navigation';
import { TemplateService } from '@/lib/services';
import { CalculatorEngine } from '@/components/calculator/CalculatorEngine';
import { CalculatorActions } from '@/components/calculator/CalculatorActions'; // <--- 새로 만든 컴포넌트 import
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CalculatorPage({ params }: Props) {
  const { id } = await params;

  try {
    const template = await TemplateService.getTemplateById(id);

    if (!template) {
      notFound();
    }

    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-start justify-between gap-4">
            {/* 왼쪽 영역 */}
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
            
            {/* 오른쪽 액션 버튼 영역 (클라이언트 컴포넌트로 분리) */}
            <CalculatorActions template={template} />
            
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