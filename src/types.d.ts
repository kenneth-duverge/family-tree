declare module '*.svg' {
  const content: string;
  export default content;
}

// Generate type for import.meta.hot
declare module 'bun' {
  import type { Root } from 'react-dom/client';
  interface ImportMeta {
    hot: {
      data: {
        root: Root;
      };
    };
  }
}
