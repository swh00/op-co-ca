import { test, expect } from '@playwright/test';

test.describe('사용자 시나리오: 이직 결정 템플릿 생성', () => {
  
  test.beforeEach(async ({ page }) => {
    // Supabase DB 요청 Mocking (실제 저장 방지)
    await page.route('**/rest/v1/templates', async route => {
      await route.fulfill({
        status: 201,
        body: JSON.stringify([{ id: 'mock-template-id', title: '이직 결정' }]),
      });
    });

    await page.goto('http://localhost:3000'); // 로컬 서버 주소
  });

  test('템플릿 빌더에서 항목을 추가하고 저장할 수 있다', async ({ page }) => {
    // 1. 제목 입력
    await page.getByPlaceholder('템플릿 제목').fill('이직 결정 계산기');
    
    // 2. 기준 추가 (연봉 - Benefit)
    await page.getByRole('button', { name: '기준 추가' }).click();
    await page.locator('input[placeholder="항목 이름을 입력하세요"]').last().fill('연봉');
    // 기본값이 benefit이므로 유형 변경 생략
    
    // 3. 기준 추가 (야근 - Cost)
    await page.getByRole('button', { name: '기준 추가' }).click();
    const costInput = page.locator('input[placeholder="항목 이름을 입력하세요"]').last();
    await costInput.fill('야근 빈도');
    
    // Select 박스 선택 (Cost로 변경)
    // shadcn/ui select는 내부적으로 텍스트로 트리거됨
    await page.locator('button[role="combobox"]').last().click(); 
    await page.getByLabel('비용 (-)').click();

    // 4. 저장 버튼 클릭
    await page.getByRole('button', { name: '템플릿 배포하기' }).click();

    // 5. 성공 토스트 메시지 확인 (UI 검증)
    const toast = page.getByText('저장 완료!');
    await expect(toast).toBeVisible();
  });
});