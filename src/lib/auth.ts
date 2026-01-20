/*
 * @Author: 水果饮料
 * @Date: 2026-01-20 21:02:18
 * @LastEditors: 水果饮料
 * @LastEditTime: 2026-01-20 21:29:47
 * @FilePath: /tanstack-start-tutorial-yt/src/lib/auth.ts
 * @Description:
 */
import { prisma } from '@/db'
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { tanstackStartCookies } from 'better-auth/tanstack-start'

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql', // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  plugins: [tanstackStartCookies()],
})
