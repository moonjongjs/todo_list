# NextJS_시작하기

# SSR을 원한다면 next.config.js에 output: 'export' 넣지 마세요.
# Vercel은 build만 수행하고 서버리스 함수/리라이트로 PHP를 프록시합니다.

1. 프로젝트 생성
```bash
    npx create-next-app@13.5.11 next_todolist
```
```bash
√ Would you like to use TypeScript? ... No
√ Would you like to use ESLint? ... Yes
√ Would you like to use Tailwind CSS? ... No
√ Would you like to use `src/` directory? ... Yes
√ Would you like to use App Router? (recommended) ... Yes
√ Would you like to customize the default import alias (@/*)? ... No
```
2. 프로젝트 폴더 이동
```bash
$ cd next_todolist
```

3. 프로젝트 실행
```bash
$ npm run dev
```

4. 폴더정리
# 프로젝트이름 next_todolist
[public]
    [css]
    [images]
    [script]
    
[src]
    [app]
# 5.    layout.js
```js
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
          <ProviderRedux>
            <ProviderQuery>
              <WrapComponent>children={children}</WrapComponent>
            </ProviderQuery>
          </ProviderRedux>        
      </body>
    </html>
  )
}

```

# 6.    page.js
```js
import TodoListComponent from '@/component/wrap/main/TodoListComponent'

export default function Home() {
  return (
      <TodoListComponent />      
  )
}
```

# 7.    [sub1]
            page.js
        [sub2]
            page.js
# 8.    [components]    
        HeaderComponet.jsx
        [main]
            Section1Componet.jsx
            Section2Componet.jsx
            Section3Componet.jsx
        FooterComponet.jsx


# 9. 설치 패키지
npm i @reduxjs/toolkit react-redux
npm i @tanstack/react-query @tanstack/react-query-devtools
npm i axios
npm i date-fns
npm i sass sass-loader

[src]
    [app]
        [store]
# 10.       index.js 생성
            confirmModal.js
```js 
// index.js 생성
import { configureStore } from '@reduxjs/toolkit';
import confirmModal from './confirmModal';

export const store = configureStore({
  reducer : {
    confirmModal   
  }
}); 

```
        [store]
# 11.       ProviderRedux.jsx    리덕스 생성
```jsx
'use client';

import { Provider } from 'react-redux';
import { store } from "./store/index";

export default function ProviderRedux({children}){
    return <Provider store={store}>{children}</Provider>
}
```

# 12. ProviderQuery.jsx   리액트 쿼리
```jsx
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

```
# 13. next.config.js => proxy 설정
 - 리액트 "proxy": "https://moonjong.dothome.co.kr"

# Vercel은 build만 수행하고 '서버리스 함수/리라이트'로 PHP를 프록시한다.
# CORS 에러: 이 방식(리라이트)이면 원천적으로 회피된다.
# 브라우저는 /api만 호출한다.

```js
const nextConfig = {
    reactStrictMode: true,    
    images: {unoptimized: true},
    eslint: {ignoreDuringBuilds: true},

    async rewrites() {
        return [
            {
                // 클라이언트가 /todo_list/... 로 호출하면
                source: '/todo_list/:path*',
                // Next 서버가 외부 원본으로 프록시
                destination: 'https://moonjong.dothome.co.kr/todo_list/:path*'
            }
        ]
    }
}
module.exports = nextConfig

```


git add . 
git commit -m 'NextJS Vercel Deploy Update' 
git push origin master
