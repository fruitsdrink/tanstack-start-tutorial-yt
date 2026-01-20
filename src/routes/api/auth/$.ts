/*
 * @Author: 水果饮料
 * @Date: 2026-01-20 21:25:08
 * @LastEditors: 水果饮料
 * @LastEditTime: 2026-01-20 21:25:33
 * @FilePath: /tanstack-start-tutorial-yt/src/routes/api/auth/$.ts
 * @Description:
 */
import { auth } from '@/lib/auth'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/auth/$')({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => {
        return await auth.handler(request)
      },
      POST: async ({ request }: { request: Request }) => {
        return await auth.handler(request)
      },
    },
  },
})
