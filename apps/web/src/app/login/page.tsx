import type { Metadata } from 'next';
import { Suspense } from 'react';
import { LoginForm } from '@/components/LoginForm';

export const metadata: Metadata = { title: 'Sign in · Learning Notes' };

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="mt-1 text-sm text-stone-600">Learning Notes</p>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
