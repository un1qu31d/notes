import { ApiStatus } from '@/components/ApiStatus';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-6 px-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Learning Notes</h1>
        <p className="mt-2 text-stone-600">
          Project skeleton is running. Features are built story by story from the Jira project
          NOTES.
        </p>
      </div>
      <ApiStatus />
    </main>
  );
}
