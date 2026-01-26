/*
 * @Author: 水果饮料
 * @Date: 2026-01-22 15:59:01
 * @LastEditors: 水果饮料
 * @LastEditTime: 2026-01-26 10:07:18
 * @FilePath: /tanstack-start-tutorial-yt/src/schemas/import.ts
 * @Description:
 */
import z from 'zod'

export const importSchema = z.object({
  url: z.string().url(),
})

export const bulkImportSchema = z.object({
  url: z.string().url(),
  search: z.string(),
})

export const extractSchema = z.object({
  author: z.string().nullable(),
  publishedAt: z.string().nullable(),
})

export const searchSchema = z.object({
  query: z.string().min(1),
})
