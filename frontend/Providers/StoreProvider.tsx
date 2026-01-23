'use client'; // This tells Next.js this is a Client Component

import { Provider } from 'react-redux';
// import { store } from '@/lib/store'; // Adjust this path to your store file
import { ReactNode } from 'react';
import { store } from '@/lib/store'; // Adjust this path to your store file

export default function StoreProvider({ children }: { children: ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}