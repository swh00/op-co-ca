// src/components/calculator/CalculatorEngine.tsx
'use client';

'use client';

import { useState, useMemo } from 'react';
import { Template } from '@/types/template';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Trophy, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  template: Template;
}

// 각 선택지(시나리오)의 데이터 구조
interface Scenario {
  id: string;
  name: string;
  values: Record<string, number>; // criterionId: value
}

export function CalculatorEngine({ template }: Props) {
  // 초기 상태: Option A(기준) vs Option B(비교)
  const [scenarios, setScenarios] = useState<Scenario[]>([
    { id: 'A', name: 'Option A (기준)', values: {} },
    { id: 'B', name: 'Option B (대안)', values: {} },
  ]);

  // 1. 시나리오 관리 로직
  const addScenario = () => {
    const id = Math.random().toString(36).substring(7);
    setScenarios([...scenarios, { id, name: `Option ${String.fromCharCode(65 + scenarios.length)}`, values: {} }]);
  };

  const removeScenario = (id: string) => {
    if (scenarios.length <= 1) return;
    setScenarios(scenarios.filter(s => s.id !== id));
  };

  const updateName = (id: string, name: string) => {
    setScenarios(scenarios.map(s => s.id === id ? { ...s, name } : s));
  };

  const updateValue = (scenarioId: string, criterionId: string, value: string) => {
    const numValue = parseFloat(value);
    setScenarios(scenarios.map(s => 
      s.id === scenarioId 
        ? { ...s, values: { ...s.values, [criterionId]: isNaN(numValue) ? 0 : numValue } }
        : s
    ));
  };

  // 2. 계산 및 랭킹 로직 (Memoization)
  const results = useMemo(() => {
    // 각 시나리오별 총점 계산
    const calculated = scenarios.map(scenario => {
      let totalScore = 0;
      
      const details = template.schema.map(criterion => {
        const val = scenario.values[criterion.id] || 0;
        // 이득(+) vs 비용(-) 계산
        const score = criterion.type === 'benefit' 
          ? val * criterion.weight 
          : -(val * criterion.weight);
        
        totalScore += score;
        return { ...criterion, inputVal: val, score };
      });

      return { ...scenario, totalScore, details };
    });

    // 1등 점수 찾기
    const maxScore = Math.max(...calculated.map(c => c.totalScore));
    
    return calculated.map(c => ({
      ...c,
      isWinner: c.totalScore === maxScore && calculated.length > 1 // 혼자일 땐 1등 표시 안 함
    }));
  }, [scenarios, template.schema]);

  // 1등 시나리오 정보 (요약용)
  const winner = results.find(r => r.isWinner);

  return (
    <div className="space-y-8">
      
      {/* 1. 최종 결과 리포트 (Dashboard) */}
      {winner && (
        <Card className="bg-primary/5 border-primary/20 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Trophy size={120} />
          </div>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-primary hover:bg-primary text-lg py-1 px-3">
                 🏆 Best Choice
              </Badge>
            </div>
            <CardTitle className="text-3xl md:text-4xl font-extrabold text-primary">
              {winner.name}
            </CardTitle>
            <p className="text-muted-foreground text-lg font-medium">
              총점: <span className="text-foreground font-bold">{winner.totalScore.toLocaleString()}</span> 점
            </p>
          </CardHeader>
        </Card>
      )}

      {/* 2. 상세 비교 매트릭스 (Matrix) */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <ArrowRight className="w-5 h-5 text-primary" /> 
            상세 비교
          </h3>
          <Button onClick={addScenario} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" /> 옵션 추가
          </Button>
        </div>

        {/* 모바일 가로 스크롤 컨테이너 */}
        <div className="overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0">
          <div className="flex gap-4 min-w-max">
            
            {/* 왼쪽: 기준 컬럼 (Row Header) */}
            <div className="w-[140px] flex-shrink-0 pt-[84px] space-y-2 hidden md:block">
              {template.schema.map(c => (
                <div key={c.id} className="h-[72px] flex flex-col justify-center text-sm font-medium text-muted-foreground border-b border-transparent">
                  <span className="text-foreground font-bold">{c.label}</span>
                  <span className="text-xs">
                    {c.type === 'benefit' ? '이득(+)' : '비용(-)'} (x{c.weight})
                  </span>
                </div>
              ))}
              <div className="h-16 flex items-center font-bold text-lg pt-4 border-t">
                총점 (Total)
              </div>
            </div>

            {/* 오른쪽: 시나리오별 카드 (Columns) */}
            {results.map((scenario) => (
              <Card 
                key={scenario.id} 
                className={cn(
                  "w-[260px] flex-shrink-0 transition-all duration-200",
                  scenario.isWinner 
                    ? "border-primary shadow-lg ring-1 ring-primary/20" 
                    : "border-border hover:border-primary/50"
                )}
              >
                {/* 헤더: 시나리오 이름 */}
                <div className={cn("p-4 border-b", scenario.isWinner && "bg-primary/5")}>
                  <div className="flex justify-between items-center mb-2">
                    <Input 
                      value={scenario.name}
                      onChange={(e) => updateName(scenario.id, e.target.value)}
                      className="font-bold bg-transparent border-none px-0 h-auto focus-visible:ring-0 shadow-none text-lg"
                    />
                    {scenarios.length > 1 && (
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => removeScenario(scenario.id)}>
                        <Trash2 size={14} />
                      </Button>
                    )}
                  </div>
                </div>

                {/* 바디: 입력 필드 리스트 */}
                <CardContent className="p-4 space-y-2">
                  {scenario.details.map((item) => (
                    <div key={item.id} className="h-[72px] space-y-1.5">
                      {/* 모바일용 라벨 (PC에서는 왼쪽에 있어서 숨김) */}
                      <div className="flex justify-between text-xs md:hidden text-muted-foreground">
                        <span>{item.label}</span>
                        <span>{item.type === 'benefit' ? '+' : '-'}{item.weight}배</span>
                      </div>
                      
                      <Input 
                        type="number" 
                        inputMode="decimal"
                        placeholder="0"
                        className={cn(
                          "text-right font-mono text-lg",
                          item.inputVal !== 0 && "font-bold bg-slate-50 dark:bg-slate-900"
                        )}
                        value={item.inputVal || ''}
                        onChange={(e) => updateValue(scenario.id, item.id, e.target.value)}
                      />
                      
                      {/* 자동 계산된 점수 미리보기 */}
                      <div className={cn(
                        "text-[10px] text-right font-medium",
                        item.score > 0 ? "text-blue-600" : item.score < 0 ? "text-red-500" : "text-muted-foreground"
                      )}>
                        {item.score > 0 ? '+' : ''}{item.score.toLocaleString()} pts
                      </div>
                    </div>
                  ))}

                  {/* 하단 총점 */}
                  <div className="pt-4 mt-2 border-t text-center">
                    <div className={cn(
                      "text-3xl font-black tabular-nums tracking-tighter",
                      scenario.totalScore > 0 ? "text-blue-600" : scenario.totalScore < 0 ? "text-red-600" : "text-slate-500"
                    )}>
                      {scenario.totalScore.toLocaleString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}