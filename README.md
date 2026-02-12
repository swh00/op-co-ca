# 📊 Cost-Benefit Blueprint (기회비용 계산기)

**Cost-Benefit Blueprint**는 복잡한 선택의 순간에서 이득(Benefit)과 비용(Cost)을 수치화하여 최선의 결정을 내릴 수 있도록 돕는 웹 애플리케이션입니다. 사용자는 자신만의 계산 템플릿을 설계하거나 타인이 공유한 템플릿을 활용해 객관적인 의사결정을 할 수 있습니다.

## 🛠 기술 스택

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **State Management**: Zustand (Template Store)
- **UI Components**: shadcn/ui (Radix UI), Lucide React
- **Backend/Database**: Supabase (PostgreSQL, Client SDK)
- **Deployment**: Vercel
- **PWA**: 오프라인 지원 및 모바일 앱 경험 제공
- **Testing**: Playwright (E2E Test)

## 💡 오프라인 우선 하이브리드 로직 (Server DB + LocalStorage)

이 프로젝트는 네트워크 상태와 관계없이 원활한 사용자 경험을 제공하기 위해 **하이브리드 데이터 저장 전략**을 채택했습니다.

### 1. 이원화된 저장 구조
- **서버 저장 (Supabase)**: 사용자가 '전 세계에 공유'를 선택했을 때 저장됩니다. 모든 기기에서 접근 가능하며, 고유 ID가 부여됩니다.
- **로컬 저장 (LocalStorage)**: '내 장치에 저장'을 선택하거나 오프라인 상태일 때 사용됩니다. 데이터는 브라우저의 `recent_templates` 키에 저장되며, ID는 `local_` 접두사를 가집니다.

### 2. 동적 라이브러리 병합
- 앱 메인 화면의 '최근 사용한 템플릿' 섹션에서는 서버에서 가져온 공용 데이터와 브라우저 로컬 저장소의 데이터를 실시간으로 결합하여 보여줍니다.
- 로컬 전용 데이터(`local_` ID)는 서버와 무관하게 유지되며, 서버 데이터는 서버의 최신 상태를 확인하여 동기화합니다.

### 3. 오프라인 상태 감지 및 UI 대응
- `useOnlineStatus` 커스텀 훅을 통해 실시간 네트워크 상태를 모니터링합니다.
- **오프라인 시**: '서버에 공유' 버튼이 비활성화되며, 오프라인 전용 배너가 노출되어 사용자에게 로컬 저장을 유도합니다.

## 🚀 설치 및 실행 방법

### 환경 변수 설정
`.env.local` 파일을 생성하고 다음 정보를 입력하세요:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
