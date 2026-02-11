// src/components/calculator/CalculatorEngine.tsx
'use client';

import { useState, useMemo } from 'react';
import { Template } from '@/types/template';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress'; // npx shadcn-ui@latest add progress 필요

interface Props {
  template: Template;
}

export function CalculatorEngine({ template }: Props) {
  // 사용자 입력값 상태 (criterion.id -> value)
  const [values, setValues] = useState<Record<string, number>>({});

  // 실시간 점수 계산 (Memoization)
  const totalScore = useMemo(() => {
    return template.schema.reduce((acc, curr) => {
      const userValue = values[curr.id] || 0;
      // Cost(비용) 타입이면 점수 차감, Benefit(이득)이면 점수 가산
      const score = curr.type === 'benefit' 
        ? userValue * curr.weight 
        : -(userValue * curr.weight);
      return acc + score;
    }, 0);
  }, [template.schema, values]);

  return (
    <div className="space-y-6 max-w-xl mx-auto p-4">
      <Card className="bg-slate-50 dark:bg-slate-900 border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold text-primary">
            {totalScore.toLocaleString()} 점
          </CardTitle>
          <p className="text-center text-sm text-muted-foreground">현재 기회비용 점수</p>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {template.schema.map((criterion) => (
          <div key={criterion.id} className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex justify-between">
              <span>{criterion.label}</span>
              <span className={`text-xs ${criterion.type === 'cost' ? 'text-red-500' : 'text-blue-500'}`}>
                ({criterion.type === 'cost' ? '비용' : '이득'} x{criterion.weight})
              </span>
            </label>
            <Input 
              type="number" 
              placeholder="0"
              className="text-right font-mono"
              onChange={(e) => setValues(prev => ({ 
                ...prev, 
                [criterion.id]: parseFloat(e.target.value) || 0 
              }))}
            />
          </div>
        ))}
      </div>
    </div>
  );
}