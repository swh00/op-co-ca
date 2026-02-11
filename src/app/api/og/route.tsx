// src/app/api/og/route.tsx
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || '기회비용 계산기';
    const score = searchParams.get('score');

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
            backgroundImage: 'linear-gradient(to bottom right, #e0f2fe, #fff)',
          }}
        >
          <div
            style={{
              fontSize: 60,
              fontWeight: 'bold',
              color: '#0f172a',
              marginBottom: 20,
              textAlign: 'center',
              padding: '0 40px',
            }}
          >
            {title}
          </div>
          {score && (
            <div
              style={{
                fontSize: 40,
                color: parseInt(score) >= 0 ? '#16a34a' : '#dc2626', // 양수면 초록, 음수면 빨강
                backgroundColor: '#fff',
                padding: '10px 30px',
                borderRadius: '50px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                display: 'flex',
              }}
            >
              결과: {parseInt(score) > 0 ? '+' : ''}{score}점
            </div>
          )}
          <div style={{ position: 'absolute', bottom: 40, fontSize: 20, color: '#64748b' }}>
            op-co-ca.vercel.app
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e: any) {
    return new Response(`Failed to generate the image`, { status: 500 });
  }
}