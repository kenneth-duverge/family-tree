/**
 * This file is the entry point for the React app, it sets up the root
 * element and renders the App component to the DOM.
 *
 * It is included in `src/index.html`.
 */

import '../styles/globals.css';

import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Home from './app/index.tsx';
import TreeEditor from './app/tree-editor.tsx';
import APITester from './app/api-tester.tsx';

const queryClient = new QueryClient();

const elem = document.getElementById('root')!;
const app = (
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route index path="/" element={<Home />} />
          <Route path="/dashboard" element={<TreeEditor />} />
          <Route path="/api-tester" element={<APITester />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);

// @ts-ignore
if (import.meta.hot) {
  // With hot module reloading, `import.meta.hot.data` is persisted.
  // @ts-ignore
  const root = (import.meta.hot.data.root ??= createRoot(elem));
  root.render(app);
} else {
  // The hot module reloading API is not available in production.
  createRoot(elem).render(app);
}
