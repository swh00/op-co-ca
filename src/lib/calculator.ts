import { Criterion } from '@/types/template';

export function calculateTotalScore(schema: Criterion[], values: Record<string, number>): number {
  return schema.reduce((acc, curr) => {
    const userValue = values[curr.id] || 0; // 값이 없으면 0 처리 (Edge Case)
    
    // 가중치 적용
    let score = userValue * curr.weight;
    
    // 비용(Cost)인 경우 점수 차감
    if (curr.type === 'cost') {
      score = -score;
    }
    
    return acc + score;
  }, 0);
}