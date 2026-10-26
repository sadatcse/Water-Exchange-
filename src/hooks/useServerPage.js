'use client';
import { useState } from 'react';

// Page number for a server-paginated list that jumps back to page 1 whenever the filters (query) change.
//   const { page, setPage } = useServerPage(query);
//   useApi(`/blog?${query}&page=${page}`)
export default function useServerPage(query) {
  const [state, setState] = useState({ query, page: 1 });
  const page = state.query === query ? state.page : 1;
  return { page, setPage: (p) => setState({ query, page: p }) };
}
