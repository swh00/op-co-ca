// src/components/shared/OfflineBanner.tsx
'use client'; // 클라이언트 컴포넌트 필수!

import { useOnlineStatus } from '@/hooks/useOnlineStatus'; // 아까 만든 훅
import { WifiOff } from 'lucide-react';

export function OfflineBanner() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null; // 온라인이면 아무것도 안 보임

  return (
    <div className="bg-amber-50 border border-amber-200 text-amber-700 p-4 rounded-xl flex items-center gap-3 mb-6">
      <WifiOff className="shrink-0" size={20} />
      <p className="text-sm font-medium">
        현재 오프라인 모드입니다. 로컬 기록과 파일 기능만 이용 가능합니다.
      </p>
    </div>
  );
}