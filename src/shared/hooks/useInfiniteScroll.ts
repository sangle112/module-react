import { useEffect } from "react";

type Options = {
  enabled: boolean;
  onLoadMore: () => void;
  rootMargin?: string;
  threshold?: number;
  sentinelId?: string;
};

export function useInfiniteScroll({
  enabled,
  onLoadMore,
  rootMargin = "500px",
  threshold = 0,
  sentinelId = "infinite-sentinel",
}: Options) {
  useEffect(() => {
    if (!enabled) return;

    const el = document.getElementById(sentinelId);
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (!first) return;
        if (first.isIntersecting) onLoadMore();
      },
      { root: null, rootMargin, threshold },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [enabled, onLoadMore, rootMargin, threshold, sentinelId]);
}
