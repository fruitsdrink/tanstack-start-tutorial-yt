/*
 * @Author: 水果饮料
 * @Date: 2026-01-20 21:32:33
 * @LastEditors: 水果饮料
 * @LastEditTime: 2026-01-20 21:33:12
 * @FilePath: /tanstack-start-tutorial-yt/src/lib/auth-client.ts
 * @Description:
 */
import { createAuthClient } from 'better-auth/react'
export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: 'http://localhost:3000',
})
