/** @type {import('next').NextConfig} */
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
