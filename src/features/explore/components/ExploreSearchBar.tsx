import { useEffect, useMemo, useState } from "react";

function useDebouncedValue<T>(value: T, delay = 350) {
  const [v, setV] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return v;
}

export function ExploreSearchBar({
  value,
  onChange,
  placeholder = "Search users...",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [local, setLocal] = useState(value ?? "");
  const debounced = useDebouncedValue(local, 350);

  useEffect(() => {
    onChange(debounced);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  useEffect(() => setLocal(value ?? ""), [value]);

  return (
    <div className="w-full">
      <input
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 rounded-xl border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}
