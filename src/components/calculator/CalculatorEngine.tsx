'use client';

import { useState, useMemo, useEffect } from 'react';
import { Template, Criterion } from '@/types/template';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Trophy, ArrowRight, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';
// 1. useToast 삭제 -> toast 직접 임포트
import { toast } from 'sonner'; 

interface Props {
  template: Template;
}

interface Scenario {
  id: string;
  name: string;
  values: Record<string, number>;
}

export function CalculatorEngine({ template }: Props) {
  const [localSchema, setLocalSchema] = useState<Criterion[]>(template.schema);
  const [isWeightEditMode, setIsWeightEditMode] = useState(false);
  // 2. const { toast } = useToast(); -> 삭제

  const [scenarios, setScenarios] = useState<Scenario[]>([
    { id: 'A', name: 'Option A', values: {} },
    { id: 'B', name: 'Option B', values: {} },
  ]);

  useEffect(() => {
    const saveToRecent = () => {
      const stored = localStorage.getItem('recent_templates');
      let recents: Template[] = stored ? JSON.parse(stored) : [];
      recents = recents.filter(t => t.id !== template.id);
      recents.unshift(template);
      if (recents.length > 10) recents.pop();
      localStorage.setItem('recent_templates', JSON.stringify(recents));
    };
    saveToRecent();
  }, [template]);

  const handleWeightChange = (criterionId: string, newWeight: string) => {
    const weight = parseFloat(newWeight);
    setLocalSchema(localSchema.map(c => 
      c.id === criterionId ? { ...c, weight: isNaN(weight) ? 0 : weight } : c
    ));
  };

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

  const results = useMemo(() => {
    const calculated = scenarios.map(scenario => {
      let totalScore = 0;
      const details = localSchema.map(criterion => {
        const val = scenario.values[criterion.id] || 0;
        const score = criterion.type === 'benefit' 
          ? val * criterion.weight 
          : -(val * criterion.weight);
        totalScore += score;
        return { ...criterion, inputVal: val, score };
      });
      return { ...scenario, totalScore, details };
    });

    const maxScore = Math.max(...calculated.map(c => c.totalScore));
    return calculated.map(c => ({
      ...c,
      isWinner: c.totalScore === maxScore && calculated.length > 1
    }));
  }, [scenarios, localSchema]);

  const winner = results.find(r => r.isWinner);

  return (
    <div className="space-y-8">
      {winner && (
        <Card className="bg-primary/5 border-primary/20 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Trophy size={120} /></div>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-primary hover:bg-primary text-lg py-1 px-3">🏆 Best Choice</Badge>
            </div>
            <CardTitle className="text-3xl md:text-4xl font-extrabold text-primary">{winner.name}</CardTitle>
            <p className="text-muted-foreground text-lg font-medium">
              총점: <span className="text-foreground font-bold">{winner.totalScore.toLocaleString()}</span>
            </p>
          </CardHeader>
        </Card>
      )}

      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <ArrowRight className="w-5 h-5 text-primary" /> 상세 비교
          </h3>
          <div className="flex gap-2">
            <Button 
              variant={isWeightEditMode ? "secondary" : "ghost"} 
              size="sm" 
              onClick={() => {
                const nextMode = !isWeightEditMode;
                setIsWeightEditMode(nextMode);
                // 3. sonner 토스트 적용
                if (nextMode) {
                  toast.info("가중치 수정 모드 활성화", {
                    description: "평가 항목의 중요도(가중치)를 직접 변경할 수 있습니다.",
                  });
                } else {
                  toast.success("가중치 설정 저장 완료");
                }
              }}
            >
              <Settings2 className="w-4 h-4 mr-2" />
              {isWeightEditMode ? "수정 완료" : "가중치 수정"}
            </Button>
            <Button onClick={addScenario} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" /> 옵션 추가
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0">
          <div className="flex gap-4 min-w-max">
            {/* 왼쪽 헤더 생략 (로직 동일) */}
            <div className="w-[140px] flex-shrink-0 pt-[84px] space-y-2 hidden md:block">
              {localSchema.map(c => (
                <div key={c.id} className="h-[72px] flex flex-col justify-center text-sm font-medium text-muted-foreground border-b border-transparent">
                  <span className="text-foreground font-bold line-clamp-1" title={c.label}>{c.label}</span>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs shrink-0">{c.type === 'benefit' ? '+' : '-'}</span>
                    {isWeightEditMode ? (
                      <Input 
                        type="number" 
                        value={c.weight} 
                        onChange={(e) => handleWeightChange(c.id, e.target.value)}
                        className="h-6 w-14 text-xs px-1 text-center bg-accent"
                      />
                    ) : (
                      <span className="text-xs">x{c.weight}</span>
                    )}
                  </div>
                </div>
              ))}
              <div className="h-16 flex items-center font-bold text-lg pt-4 border-t">총점</div>
            </div>

            {/* 시나리오 카드 리스트 */}
            {results.map((scenario) => (
              <Card key={scenario.id} className={cn("w-[260px] flex-shrink-0 transition-all duration-200", scenario.isWinner ? "border-primary shadow-lg ring-1 ring-primary/20" : "border-border hover:border-primary/50")}>
                <div className={cn("p-4 border-b", scenario.isWinner && "bg-primary/5")}>
                  <div className="flex justify-between items-center mb-2">
                    <Input value={scenario.name} onChange={(e) => updateName(scenario.id, e.target.value)} className="font-bold bg-transparent border-none px-0 h-auto focus-visible:ring-0 shadow-none text-lg" />
                    {scenarios.length > 1 && (
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => removeScenario(scenario.id)}><Trash2 size={14} /></Button>
                    )}
                  </div>
                </div>
                <CardContent className="p-4 space-y-2">
                  {scenario.details.map((item) => (
                    <div key={item.id} className="h-[72px] space-y-1.5">
                      <div className="flex justify-between text-xs md:hidden text-muted-foreground items-center">
                        <span>{item.label}</span>
                        <div className="flex items-center gap-1">
                           <span>{item.type === 'benefit' ? '+' : '-'}</span>
                           {isWeightEditMode ? (
                              <Input type="number" value={item.weight} onChange={(e) => handleWeightChange(item.id, e.target.value)} className="h-5 w-12 text-[10px] px-1 text-center bg-accent" />
                           ) : (
                              <span>{item.weight}배</span>
                           )}
                        </div>
                      </div>
                      <Input type="number" inputMode="decimal" placeholder="0" className={cn("text-right font-mono text-lg", item.inputVal !== 0 && "font-bold bg-slate-50 dark:bg-slate-900")} value={item.inputVal || ''} onChange={(e) => updateValue(scenario.id, item.id, e.target.value)} />
                      <div className={cn("text-[10px] text-right font-medium", item.score > 0 ? "text-blue-600" : item.score < 0 ? "text-red-500" : "text-muted-foreground")}>
                        {item.score > 0 ? '+' : ''}{item.score.toLocaleString()} pts
                      </div>
                    </div>
                  ))}
                  <div className="pt-4 mt-2 border-t text-center">
                    <div className={cn("text-3xl font-black tabular-nums tracking-tighter", scenario.totalScore > 0 ? "text-blue-600" : scenario.totalScore < 0 ? "text-red-600" : "text-slate-500")}>
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