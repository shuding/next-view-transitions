import { useRouter } from 'next/navigation';
import { startTransition, useCallback } from 'react';
import { useSetFinishViewTransition } from './transition-context';

export const useRedirect = () => {
  const router = useRouter();
  const finishViewTransition = useSetFinishViewTransition();

  const redirect = useCallback((url: string, replace?: boolean, scroll?: boolean) => {
    if ('startViewTransition' in document) {
      // @ts-ignore
      document.startViewTransition(
        () =>
          new Promise<void>((resolve) => {
            startTransition(() => {
              router[replace ? 'replace' : 'push'](url, {
                scroll: scroll ?? true,
              });
              finishViewTransition(() => resolve);
            });
          })
      );
    } else {
      router[replace ? 'replace' : 'push'](url, {
        scroll: scroll ?? true,
      });
    }
  }, [router, finishViewTransition]);

  return redirect;
};
