// src/components/calculator/LocalCalculatorLoader.tsx
'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { Template } from '@/types/template';
import { CalculatorEngine } from './CalculatorEngine';
import { CalculatorActions } from './CalculatorActions';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';

export function LocalCalculatorLoader({ id }: { id: string }) {
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // LocalStorage에서 데이터 찾기
    const stored = localStorage.getItem('recent_templates');
    if (stored) {
      const parsed = JSON.parse(stored) as Template[];
      const found = parsed.find((t) => t.id === id);
      if (found) {
        setTemplate(found);
      }
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (!template) return notFound();

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight">{template.title}</h1>
                <span className="text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded font-bold uppercase">Local</span>
              </div>
              <p className="text-muted-foreground text-sm">{template.description}</p>
            </div>
          </div>
          <CalculatorActions template={template} />
        </div>
        <CalculatorEngine template={template} />
      </div>
    </main>
  );
}