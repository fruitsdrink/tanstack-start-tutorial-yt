/*
 * @Author: 水果饮料
 * @Date: 2026-01-24 09:41:41
 * @LastEditors: 水果饮料
 * @LastEditTime: 2026-01-24 10:21:48
 * @FilePath: /tanstack-start-tutorial-yt/src/middlewares/auth.ts
 * @Description:
 */
import { auth } from '@/lib/auth'
import { redirect } from '@tanstack/react-router'
import { createMiddleware } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'

export const authFnMiddleware = createMiddleware({ type: 'function' }).server(
  async ({ next }) => {
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })
    if (!session) {
      throw redirect({ to: '/login' })
    }

    return next({ context: { session } })
  },
)

export const authMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const url = new URL(request.url)

    if (
      !url.pathname.startsWith('/dashboard') &&
      !url.pathname.startsWith('/api')
    ) {
      return next()
    }

    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })
    if (!session) {
      throw redirect({ to: '/login' })
    }

    return next({ context: { session } })
  },
)
