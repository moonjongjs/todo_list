import React from 'react';
import WrapComponent from '@/component/WrapComponent.jsx';

// React Query 추가
import { QueryClient } from '@tanstack/react-query';
import ProviderRedux from './ProviderRedux';
import ProviderQuery from './ProviderQuery';
import './css/style.css';
export const metadata = {
  viewport: "width=device-width, initial-scale=1.0",
  title: 'TO DO LIST',
  description: 'TO DO LIST NextJS 제작',
  keywords: ['TO DO LIST', 'TO DO', '할일'],
  iconst: {
    icon: "/img/logo192.png",
    shortcut: "/img/logo192.png",
    apple: "/img/logo192.png",
  },
  publisher: "문선종",
  robots: "index, follow"
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5000
    },
    mutations: {
      retry: 0
    }
  }
});


export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
          <ProviderRedux  children={children}>
            <ProviderQuery>
              <WrapComponent children={children} />
            </ProviderQuery>
          </ProviderRedux>        
      </body>
    </html>
  )
}
