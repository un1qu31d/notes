'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { errorMessage, schemas } from '@notes/api-client';
import { useAuthLogin } from '@notes/api-client/react';

type Field = 'email' | 'password';

/** Only allow redirects back into this app (no "//evil.com" or absolute URLs). */
function safeNext(next: string | null): string {
  return next && next.startsWith('/') && !next.startsWith('//') ? next : '/';
}

const FIELD_MESSAGES: Record<Field, string> = {
  email: 'Enter a valid email address.',
  password: 'Enter your password.',
};

const inputClass =
  'rounded-md border bg-white px-3 py-2 font-normal outline-none focus:ring-2 focus:ring-stone-200 aria-[invalid=true]:border-red-400 border-stone-300 focus:border-stone-500';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const login = useAuthLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<Field, string>>>({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Same rules as the API's LoginDto, generated from the API contract.
    const parsed = schemas.authLoginBody.safeParse({ email: email.trim(), password });
    if (!parsed.success) {
      const errors: Partial<Record<Field, string>> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as Field;
        errors[field] ??= FIELD_MESSAGES[field];
      }
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    try {
      await login.mutateAsync({ data: parsed.data });
      queryClient.clear(); // start fresh for the signed-in user
      router.replace(safeNext(searchParams.get('next')));
      router.refresh();
    } catch {
      // Shown below from login.error
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4" noValidate>
      <label className="flex flex-col gap-1 text-sm font-medium">
        Email
        <input
          type="email"
          name="email"
          autoComplete="username"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? 'email-error' : undefined}
          className={inputClass}
        />
        {fieldErrors.email && (
          <span id="email-error" className="text-xs font-normal text-red-700">
            {fieldErrors.email}
          </span>
        )}
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium">
        Password
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={Boolean(fieldErrors.password)}
          aria-describedby={fieldErrors.password ? 'password-error' : undefined}
          className={inputClass}
        />
        {fieldErrors.password && (
          <span id="password-error" className="text-xs font-normal text-red-700">
            {fieldErrors.password}
          </span>
        )}
      </label>

      {login.isError && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorMessage(login.error)}
        </p>
      )}

      <button
        type="submit"
        disabled={login.isPending}
        className="rounded-md bg-stone-900 px-3 py-2 text-sm font-medium text-white hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {login.isPending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
