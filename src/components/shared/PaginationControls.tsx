// src/components/shared/PaginationControls.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  totalPages: number;
}

export function PaginationControls({ totalPages }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentPage = Number(searchParams.get('page')) || 1;

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    router.push(`/?${params.toString()}`);
  };

  if (totalPages <= 1) return null; // 1페이지밖에 없으면 숨김

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage <= 1}
        onClick={() => handlePageChange(currentPage - 1)}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <span className="text-sm font-medium">
        {currentPage} / {totalPages}
      </span>

      <Button
        variant="outline"
        size="icon"
        disabled={currentPage >= totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}