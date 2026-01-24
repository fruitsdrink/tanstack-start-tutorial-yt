/*
 * @Author: 水果饮料
 * @Date: 2026-01-24 10:08:22
 * @LastEditors: 水果饮料
 * @LastEditTime: 2026-01-24 10:18:01
 * @FilePath: /tanstack-start-tutorial-yt/src/start.ts
 * @Description: 全局中间件
 */
import { createMiddleware, createStart } from '@tanstack/react-start'
import { authMiddleware } from './middlewares/auth'

const loggingMiddleware = createMiddleware().server(({ request, next }) => {
  const url = new URL(request.url)

  console.log(`[${request.method}] ${url.pathname}`)
  return next()
})

export const startInstance = createStart(() => {
  return {
    requestMiddleware: [loggingMiddleware, authMiddleware],
  }
})
