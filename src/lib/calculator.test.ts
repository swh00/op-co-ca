import { describe, it, expect } from 'vitest';
import { calculateTotalScore } from './calculator';
import { Criterion } from '@/types/template';

describe('Opportunity Cost Calculation Engine', () => {
  const mockSchema: Criterion[] = [
    { id: '1', label: '연봉', type: 'benefit', weight: 1.0 },      // 이득
    { id: '2', label: '통근시간', type: 'cost', weight: 2.0 },     // 비용 (가중치 2배)
  ];

  it('기본 시나리오: 연봉은 더하고 통근시간 비용은 뺀다', () => {
    const values = { '1': 5000, '2': 60 }; 
    // 예상: (5000 * 1) - (60 * 2) = 4880
    expect(calculateTotalScore(mockSchema, values)).toBe(4880);
  });

  it('Edge Case: 입력값이 없을 경우 0으로 처리한다', () => {
    const values = { '1': 5000 }; // 통근시간 입력 안 함
    // 예상: (5000 * 1) - (0 * 2) = 5000
    expect(calculateTotalScore(mockSchema, values)).toBe(5000);
  });
});