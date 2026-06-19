import { useEffect, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { reportLovableError } from "../lib/lovable-error-reporting";

export function RouteError({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_route_error_component" });
  }, [error]);

  const handleRetry = async () => {
    if (retrying) return;
    setRetrying(true);
    try {
      // Re-run the failed route's loaders before clearing the boundary.
      await router.invalidate();
      // Only dismiss the fallback once the reload resolved without throwing.
      reset();
    } catch (retryError) {
      console.error(retryError);
      reportLovableError(retryError as Error, {
        boundary: "tanstack_route_error_retry",
      });
      setRetrying(false);
    }
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md rounded-3xl glass-strong px-7 py-10 text-center">
        <p className="text-4xl">🌙</p>
        <h1 className="mt-3 font-display text-3xl text-gradient">This page hit a snag</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong while loading this page. You can try again or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={handleRetry}
            disabled={retrying}
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
          >
            {retrying ? "Retrying…" : "Try again"}
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-input bg-card/80 px-5 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}
