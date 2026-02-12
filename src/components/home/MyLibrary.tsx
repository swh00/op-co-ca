// src/components/home/MyLibrary.tsx
'use client';

import { useState, useEffect } from 'react';
import { Template } from '@/types/template';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, FileText } from 'lucide-react';

export function MyLibrary() {
  const [myTemplates, setMyTemplates] = useState<Template[]>([]);
  
  useEffect(() => {
    const stored = localStorage.getItem('recent_templates'); // 향후 'my_templates'로 확장 가능
    if (stored) setMyTemplates(JSON.parse(stored));
  }, []);

  const deleteTemplate = (id: string) => {
    const updated = myTemplates.filter(t => t.id !== id);
    setMyTemplates(updated);
    localStorage.setItem('recent_templates', JSON.stringify(updated));
  };

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <FileText className="text-blue-500" /> 내 보관함 ({myTemplates.length})
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {myTemplates.map((t) => (
          <Card key={t.id} className="flex items-center justify-between p-4 border-l-4 border-l-blue-500">
            <div className="flex-1">
              <CardTitle className="text-lg">{t.title}</CardTitle>
              <p className="text-sm text-muted-foreground line-clamp-1">{t.description}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <a href={`/calc/${t.id}`}>열기</a>
              </Button>
              <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteTemplate(t.id!)}>
                <Trash2 size={18} />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}