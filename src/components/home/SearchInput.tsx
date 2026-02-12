// src/components/home/SearchInput.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export function SearchInput() {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    
    // 검색어가 바뀌면 페이지를 1로 초기화
    params.set('page', '1');
    
    if (term) {
      params.set('q', term);
    } else {
      params.delete('q');
    }
    
    // URL 업데이트 (새로고침 없이)
    replace(`/?${params.toString()}`);
  };

  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="템플릿 제목, 설명 검색..."
        className="pl-9"
        defaultValue={searchParams.get('q')?.toString()}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  );
}