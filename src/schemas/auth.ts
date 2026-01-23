/*
 * @Author: 水果饮料
 * @Date: 2026-01-20 20:30:12
 * @LastEditors: 水果饮料
 * @LastEditTime: 2026-01-23 16:11:53
 * @FilePath: /tanstack-start-tutorial-yt/src/schemas/auth.ts
 * @Description:
 */
import z from 'zod'

// z.config(z.locales.zhCN())

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(20),
})

export const signupSchema = z.object({
  fullName: z.string().min(5).max(20),
  email: z.string().email(),
  password: z.string().min(8).max(20),
})
