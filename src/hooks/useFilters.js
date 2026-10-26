'use client';
import { useEffect, useMemo, useState } from 'react';

// Filters → query string, with the search box debounced so typing doesn't fetch on every key.
//   const { filters, set, search, setSearch, query } = useFilters({ status: '', search: '' });
//   useApi(`/contact?${query}`)
export default function useFilters(initial) {
  const [filters, setFilters] = useState(initial);
  const [search, setSearch] = useState(initial.search || '');
  useEffect(() => {
    const id = setTimeout(() => setFilters((f) => (f.search === search ? f : { ...f, search })), 350);
    return () => clearTimeout(id);
  }, [search]);
  const query = useMemo(() => new URLSearchParams(Object.entries(filters).filter(([, v]) => v)).toString(), [filters]);
  const set = (key) => (value) => setFilters((f) => ({ ...f, [key]: value }));
  return { filters, set, search, setSearch, query };
}
