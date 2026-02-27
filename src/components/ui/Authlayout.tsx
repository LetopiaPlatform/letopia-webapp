import type { ReactNode } from 'react';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  error?: string;
  children: ReactNode;
}

export default function AuthLayout({ title, subtitle, error, children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border p-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{title}</h2>
          <p className="mt-1 text-sm font-medium text-gray-500">{subtitle}</p>
        </div>
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 text-sm text-red-600 mb-4">
            {error}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
