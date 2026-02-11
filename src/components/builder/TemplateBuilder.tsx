// src/components/builder/TemplateBuilder.tsx
'use client';

import { useTemplateStore } from '@/store/useTemplateStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea'; // npx shadcn-ui@latest add textarea 필요
import { Plus } from 'lucide-react';
import { CriterionInput } from './CriterionInput';
import { SaveButton } from './SaveButton'; // 단계 2에서 만든 컴포넌트

export function TemplateBuilder() {
  const { template, setTitle, addCriterion, updateCriterion, removeCriterion } = useTemplateStore();

  const handleAdd = () => {
    addCriterion({
      id: crypto.randomUUID(),
      label: '',
      weight: 1.0,
      type: 'benefit',
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 p-4">
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">템플릿 설계</h2>
        <div className="space-y-2">
          <Input 
            placeholder="템플릿 제목 (예: 이직 결정 계산기)" 
            value={template.title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-semibold"
          />
          <Textarea 
            placeholder="이 템플릿에 대한 설명을 적어주세요." 
            value={template.description}
            onChange={(e) => useTemplateStore.setState(state => ({ 
              template: { ...state.template, description: e.target.value } 
            }))}
          />
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">평가 기준 목록</h3>
          <Button variant="outline" size="sm" onClick={handleAdd}>
            <Plus size={16} className="mr-2" /> 기준 추가
          </Button>
        </div>
        
        <div className="space-y-3">
          {template.schema.map((criterion) => (
            <CriterionInput 
              key={criterion.id}
              criterion={criterion}
              onUpdate={updateCriterion}
              onRemove={removeCriterion}
            />
          ))}
          {template.schema.length === 0 && (
            <div className="text-center p-8 text-muted-foreground border-dashed border-2 rounded-lg">
              '기준 추가' 버튼을 눌러 평가 항목을 만들어보세요.
            </div>
          )}
        </div>
      </section>

      <div className="sticky bottom-4">
        <SaveButton />
      </div>
    </div>
  );
}