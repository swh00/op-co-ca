// src/components/builder/CriterionInput.tsx
'use client';

import { Criterion } from '@/types/template';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2 } from 'lucide-react';

interface Props {
  criterion: Criterion;
  onUpdate: (id: string, updates: Partial<Criterion>) => void;
  onRemove: (id: string) => void;
}

export function CriterionInput({ criterion, onUpdate, onRemove }: Props) {
  // 가중치 입력 핸들러
  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // 1. 다 지웠을 때는 0으로 처리 (NaN 방지)
    if (value === '') {
      onUpdate(criterion.id, { weight: 0 });
      return;
    }

    const numValue = parseFloat(value);
    // 2. 0 이상인 경우에만 업데이트 (음수 방지)
    if (!isNaN(numValue) && numValue >= 0) {
      onUpdate(criterion.id, { weight: numValue });
    }
  };

  // 마이너스(-) 키 입력 방지
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === '-' || e.key === 'e') {
      e.preventDefault();
    }
  };

  return (
    <div className="flex flex-col gap-2 p-4 border rounded-lg bg-card text-card-foreground shadow-sm md:flex-row md:items-end">
      <div className="flex-1 space-y-1">
        <label className="text-xs font-medium text-muted-foreground">항목명 (예: 연봉, 거리)</label>
        <Input 
          value={criterion.label} 
          onChange={(e) => onUpdate(criterion.id, { label: e.target.value })}
          placeholder="항목 이름을 입력하세요"
        />
      </div>

      <div className="w-full md:w-32 space-y-1">
        <label className="text-xs font-medium text-muted-foreground">유형</label>
        <Select 
          value={criterion.type} 
          onValueChange={(val: 'benefit' | 'cost') => onUpdate(criterion.id, { type: val })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="benefit">이득 (+)</SelectItem>
            <SelectItem value="cost">비용 (-)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-full md:w-24 space-y-1">
        <label className="text-xs font-medium text-muted-foreground">가중치 (xN)</label>
        <Input 
          type="number" 
          step="0.1"
          min="0" // 화살표로 음수 이동 방지
          value={criterion.weight || ''} // 0일 때도 0 표시
          onChange={handleWeightChange} // 핸들러 교체
          onKeyDown={handleKeyDown}     // 키 입력 방지
          onFocus={(e) => e.target.select()} // 클릭 시 전체 선택
        />
      </div>

      <Button variant="ghost" size="icon" className="text-destructive shrink-0 mb-0.5" onClick={() => onRemove(criterion.id)}>
        <Trash2 size={18} />
      </Button>
    </div>
  );
}