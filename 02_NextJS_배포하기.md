# 04 NextJS 배포하기
1. CSR(정적배포) - 프론트앤드 - HTML + CSSS + JS 웹배포방식 => 닷홈 PHP JSP SERVLIT JAVA
2. 팀포트폴리오 => NextJS => CSR(정적배포) => 닷홈
3. SSR(동적배포) - 백앤드(버셀 Vercel NodeJS 서버(익스프레스)) + MYSQL(외부) + 프론트앤드
                  몽고DB No-SQL JSON 형식
                  SSL 웹보안 HTTPS <=> HTTP
   깃 허브 소스 => CICD 방식 => 지속적인 자동배포 방식

4. 깃허브 + CICD + AWS(정적배포) - 카드결재 - MYSQL - JSP - PHP                 
5. AWS(동적배포) - 카드결재 - MYSQL
# 2-1  package.json
# 2-2  next.config.js
# 2-3  HTTP 통신 API(fetch, axios) 
- url 상대경로 (./) => 절대 경로 변경(/)
- 이미지 경로  (./) => 절대 경로 변경(/)

# 2-4 깃허브 레파지토리 생성 및 스테이징 커밋 푸쉬
    
- 레파지토리 next_blue   
- https://github.com/moonjongjs/next_blue.git

https://next-blue-tan-sigma.vercel.app/
https://next-blue-git-moon-moonjongs-projects.vercel.app/

git config user.name 'moonjongjs'
git config user.email 'moonseonjong@naver.com'
git remote add origin https://github.com/moonjongjs/todo_list.git
git add . 
git commit -m 'NextJS Vercel Deploy' 
git push origin master

# 2-5 Vercel 홈페이지 
# 2-6 새 프로젝트 todo_list import 
# 2-7 Deploy
