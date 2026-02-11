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
          value={criterion.weight} 
          onChange={(e) => onUpdate(criterion.id, { weight: parseFloat(e.target.value) || 0 })}
        />
      </div>

      <Button variant="ghost" size="icon" className="text-destructive shrink-0" onClick={() => onRemove(criterion.id)}>
        <Trash2 size={18} />
      </Button>
    </div>
  );
}