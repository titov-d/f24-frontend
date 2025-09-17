'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="max-w-md text-center">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">
          ¡Algo salió mal!
        </h2>
        <p className="mb-8 text-gray-600">
          Ha ocurrido un error inesperado. Por favor, intenta nuevamente.
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={reset} variant="primary">
            Intentar de nuevo
          </Button>
          <Button
            onClick={() => window.location.href = '/'}
            variant="outline"
          >
            Ir al inicio
          </Button>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-8 text-left">
            <summary className="cursor-pointer text-sm text-gray-500">
              Detalles del error (desarrollo)
            </summary>
            <pre className="mt-2 overflow-auto rounded bg-gray-100 p-4 text-xs">
              {error.message}
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}