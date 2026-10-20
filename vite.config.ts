import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'holywin-local-admin-api',
      configureServer(server) {
        const env = loadEnv(mode, process.cwd(), 'VITE_')
        process.env.VITE_SUPABASE_URL ||= env.VITE_SUPABASE_URL
        process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||= env.VITE_SUPABASE_PUBLISHABLE_KEY
        server.middlewares.use('/api/admin', async (req, res) => {
          try {
            const address = new URL(`/api/admin${req.url ?? ''}`, `http://${req.headers.host ?? 'localhost'}`)
            const chunks: Buffer[] = []
            for await (const chunk of req) chunks.push(Buffer.from(chunk))
            const request = new Request(address, {
              method: req.method,
              headers: req.headers as HeadersInit,
              body: chunks.length ? Buffer.concat(chunks) : undefined,
            })
            const { GET, POST } = await import('./api/admin.js')
            const response = req.method === 'GET' ? await GET(request) : req.method === 'POST' ? await POST(request) : new Response(null, { status: 405 })
            res.statusCode = response.status
            response.headers.forEach((value, key) => res.setHeader(key, value))
            res.end(Buffer.from(await response.arrayBuffer()))
          } catch {
            res.statusCode = 500
            res.end('Admin API failed.')
          }
        })
      },
    },
  ],
}))
