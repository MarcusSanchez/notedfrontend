"use client";

import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { statusFrom } from "@/lib/utils";
import { useNeedsToRefresh } from "@/lib/state";
import { Code } from "@connectrpc/connect";

const ReactQueryProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const { refresh } = useNeedsToRefresh();

  const queryClient = useMemo(() => {
      const onError = (error: Error) => {
        const status = statusFrom(error);
        console.error("Something went wrong: ", status);
        if (status.code === Code.DeadlineExceeded) {
          refresh();
          return;
        }
        toast({
          title: "Uh oh! Something went wrong.",
          description: (status.rawMessage && status.rawMessage !== "fetch failed")
            ? status.rawMessage.slice(0, 1).toUpperCase() + status.rawMessage.slice(1) + "."
            : "Please check your connection or try again later.",
        });
      };

      const retry = (failureCount: number, error: unknown) => {
        const status = statusFrom(error);
        const nonRetryableCodes = [
          Code.Unauthenticated,
          Code.NotFound,
          Code.DeadlineExceeded,
          Code.InvalidArgument,
          Code.PermissionDenied,
        ];
        if (failureCount > 3) return false;
        return !nonRetryableCodes.includes(status.code);
      };

      return new QueryClient({
        defaultOptions: {
          queries: { retry, },
          mutations: { retry },
        },
        queryCache: new QueryCache({ onError }),
        mutationCache: new MutationCache({ onError })
      });
    }, [refresh, toast]
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

export default ReactQueryProvider;