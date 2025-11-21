'use client';

import First100FoundersModal from './First100FoundersModal';
import { useRouter, usePathname } from 'next/navigation';

export default function First100FoundersModalWrapper() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <First100FoundersModal 
      targetUrl="/first100founders"
      onNavigate={(url: string) => router.push(url)}
      getCurrentPath={() => pathname}
      excludedPaths={['/first100founders', '/admin', '/api']}
    />
  );
}