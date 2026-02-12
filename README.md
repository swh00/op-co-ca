1. 상세 README.md (개발자용)
📊 Cost-Benefit Blueprint
Cost-Benefit Blueprint는 선택의 기로에서 '이득'과 '비용'을 수치화하여 객관적인 의사결정을 돕는 Next.js 기반의 웹 애플리케이션입니다. 복잡한 기회비용 계산을 템플릿화하여 관리하고 공유할 수 있습니다.

🛠 기술 스택
Framework: Next.js 15 (App Router)

Language: TypeScript

Styling: Tailwind CSS, Lucide React

State Management: Zustand (Client-side state & Persist)

Backend/Database: Supabase (PostgreSQL, Client SDK)

Deployment: Vercel

PWA: next-pwa를 이용한 오프라인 환경 지원 및 모바일 네이티브 경험 제공

💡 오프라인 우선 하이브리드 로직 (Server DB + LocalStorage)
이 프로젝트는 네트워크 환경에 구애받지 않는 사용자 경험을 위해 Hybrid Persistence 전략을 사용합니다.

1. 데이터 이원화 저장 시스템
서버 저장 (Cloud): 사용자가 '공유'를 선택할 경우 Supabase DB에 저장되며, 고유한 UUID를 부여받아 누구나 링크로 접근할 수 있습니다.

로컬 저장 (On-device): '내 기기에 저장' 또는 오프라인 상태에서 저장 시 localStorage를 통해 브라우저에 즉시 저장됩니다.

Zustand Persist: 사용자가 입력 중인 템플릿 상태는 Zustand의 persist 미들웨어를 통해 브라우저 종료 후에도 유지됩니다.

2. 하이브리드 데이터 병합 (Merging Strategy)
메인 페이지 진입 시 templates 테이블(Supabase)의 공용 데이터와 브라우저 내 recent_templates 데이터를 실시간으로 결합하여 출력합니다.

로컬 데이터는 local_ 접두사를 붙여 서버 데이터와 식별하며, 네트워크가 복구되어도 로컬 전용 데이터는 기기에 안전하게 유지됩니다.

3. 상태 감지 훅 (useOnlineStatus)
window.addEventListener('online' | 'offline')를 활용한 커스텀 훅으로 앱 전체의 네트워크 상태를 실시간 모니터링합니다.

Offline UX: 오프라인 시 '서버에 공유' 버튼을 비활성화하고, 사용자에게 현재 데이터가 로컬에 저장됨을 알리는 UI를 제공합니다.

🚀 설치 및 실행 방법
저장소 클론 및 패키지 설치

Bash
git clone [<repository-url>](https://github.com/swh00/op-co-ca/)
npm install
환경 변수 설정 (.env.local)

코드 스니펫
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
개발 서버 실행

Bash
npm run dev
2. 사용자 가이드 (일반 사용자용)
📑 Cost-Benefit Blueprint 이용 가이드
기회비용 계산기 Cost-Benefit Blueprint를 찾아주셔서 감사합니다! 이 가이드는 앱 설치 방법부터 오프라인 활용법까지 상세히 안내합니다.

📱 1. 앱(PWA) 설치하기
이 서비스는 별도의 앱스토어 방문 없이 브라우저에서 바로 앱으로 설치할 수 있습니다.

🍎 iPhone (iOS) 사용 시
Safari 브라우저로 접속합니다.

하단 중앙의 **[공유 버튼(사각형에 화살표)]**을 누릅니다.

리스트를 내려 **[홈 화면에 추가]**를 선택하세요.

🤖 Android / Chrome (PC) 사용 시
주소창 우측의 [설치] 아이콘(또는 점 3개 메뉴)을 누릅니다.

[앱 설치] 또는 **[홈 화면에 추가]**를 클릭하세요.

🔌 2. 인터넷 연결 없이 사용하기 (오프라인 모드)
인터넷이 끊겨도 당황하지 마세요! 우리 앱은 '내 기기 우선 저장' 기능을 지원합니다.

데이터 저장: 인터넷이 없을 때 작성한 계산기는 [내 장치에 저장] 버튼을 통해 현재 사용 중인 기기에만 안전하게 보관됩니다.

나중에 공유하기: 인터넷이 다시 연결되었을 때, 저장된 리스트에서 해당 항목을 불러와 **[서버에 공유]**를 누르면 다른 사람에게 보낼 수 있는 링크가 생성됩니다.

🛠 3. 계산기 작성 팁
기준(Criteria) 설정: 결정에 영향을 주는 요소(예: 연봉, 워라밸, 통근시간)를 입력하세요.

이득(+)과 비용(-): 나에게 이득이 되는 항목은 '이득', 부담이 되는 항목은 **'비용'**으로 설정합니다.

가중치(Weight): 각 항목이 나에게 얼마나 중요한지 별점으로 조절하세요. 점수가 높을수록 결과에 큰 영향을 줍니다.

⚠️ 주의사항
로컬 데이터 보관: [내 장치에 저장]된 데이터는 브라우저의 방문 기록이나 쿠키를 모두 삭제할 경우 사라질 수 있습니다.

안전한 보관: 중요한 템플릿은 가급적 [서버에 공유] 버튼을 눌러 고유 주소(URL)를 보관하는 것을 권장합니다.
