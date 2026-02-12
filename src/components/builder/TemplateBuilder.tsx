// src/components/builder/TemplateBuilder.tsx
'use client';

import { useTemplateStore } from '@/store/useTemplateStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, WifiOff, Layout } from 'lucide-react';
import { CriterionInput } from './CriterionInput';
import { SaveButton } from './SaveButton';
import { useOnlineStatus } from '@/hooks/useOnlineStatus'; // 실시간 감지 훅

export function TemplateBuilder() {
  const { template, setTitle, addCriterion, updateCriterion, removeCriterion } = useTemplateStore();
  const isOnline = useOnlineStatus(); // 현재 브라우저의 연결 상태

  const handleAdd = () => {
    // 오프라인 대비: crypto.randomUUID()가 안될 경우를 위한 fallback
    const id = typeof crypto !== 'undefined' && crypto.randomUUID 
      ? crypto.randomUUID() 
      : `temp_${Date.now()}`;

    addCriterion({
      id,
      label: '',
      weight: 1.0,
      type: 'benefit',
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 p-4 pb-24">
      {/* 1. 오프라인 상태 안내 (사용자가 오프라인에서 빌더 진입 시 표시) */}
      {!isOnline && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <WifiOff className="shrink-0" size={20} />
          <div className="text-sm">
            <p className="font-bold">오프라인 모드로 작업 중입니다.</p>
            <p>서버 공유는 불가능하지만, '내 장치에 저장'은 언제든 가능합니다.</p>
          </div>
        </div>
      )}

      {/* 헤더 섹션 */}
      <div className="flex items-center gap-3 border-b pb-4">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          <Layout size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">템플릿 설계</h1>
          <p className="text-sm text-muted-foreground">나만의 기회비용 평가 기준을 만들어보세요.</p>
        </div>
      </div>

      {/* 기본 정보 입력 */}
      <section className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">템플릿 제목</label>
          <Input 
            placeholder="예: 이직 결정 계산기, 새 차 구매 비교" 
            value={template.title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-semibold h-12"
          />
          <Textarea 
            placeholder="이 템플릿의 목적이나 사용 방법을 적어주세요." 
            value={template.description}
            onChange={(e) => useTemplateStore.setState(state => ({ 
              template: { ...state.template, description: e.target.value } 
            }))}
            className="resize-none h-24"
          />
        </div>
      </section>

      {/* 평가 기준 리스트 */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">평가 항목 설정</h3>
          <Button variant="outline" size="sm" onClick={handleAdd} className="h-9">
            <Plus size={16} className="mr-2" /> 항목 추가
          </Button>
        </div>
        
        <div className="grid gap-3">
          {template.schema.map((criterion) => (
            <CriterionInput 
              key={criterion.id}
              criterion={criterion}
              onUpdate={updateCriterion}
              onRemove={removeCriterion}
            />
          ))}
          
          {template.schema.length === 0 && (
            <div 
              className="text-center p-12 text-muted-foreground border-dashed border-2 rounded-xl bg-slate-50/50 cursor-pointer hover:bg-slate-50 transition-colors"
              onClick={handleAdd}
            >
              <Plus className="mx-auto mb-2 opacity-20" size={40} />
              <p>'항목 추가' 버튼을 눌러 첫 번째 평가 기준을 만들어보세요.</p>
            </div>
          )}
        </div>
      </section>

      {/* 저장 버튼 (Sticky) */}
      {/* 이 안에 있는 SaveButton 내부 로직에서 isOnline 여부를 판단하여
        '서버 저장' 버튼을 비활성화하고 '로컬 저장' 버튼을 강조하게 됩니다.
      */}
      <div className="fixed bottom-6 left-0 right-0 px-4 pointer-events-none">
        <div className="max-w-2xl mx-auto pointer-events-auto">
          <SaveButton />
        </div>
      </div>
    </div>
  );
}
