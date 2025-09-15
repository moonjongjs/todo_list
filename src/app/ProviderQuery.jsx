"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function ProviderQuery({ children }) {
  const [client] = useState(() => new QueryClient({
    defaultOptions: {
      queries: { staleTime: 5000, refetchOnWindowFocus: false },
    },
  }));
  return (
    <QueryClientProvider client={client}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
