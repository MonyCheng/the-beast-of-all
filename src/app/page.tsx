// app/page.tsx
'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const WindlandClone = dynamic(() => import('./components/WindlandClone'), {
  ssr: false,
});

export default function Home() {
  return (
    <main>
      {/* Hero 3D Section */}
      <section className="h-screen">
        <Suspense fallback={<div>Loading 3D...</div>}>
          <WindlandClone />
        </Suspense>
      </section>

      {/* Other sections */}
      <section className="min-h-screen bg-white p-10">
        <h2>About Section</h2>
        <p>Your other content here...</p>
      </section>
    </main>
  );
}