/*
 * @Author: 水果饮料
 * @Date: 2026-01-23 15:25:47
 * @LastEditors: 水果饮料
 * @LastEditTime: 2026-01-24 09:51:56
 * @FilePath: /tanstack-start-tutorial-yt/src/data/items.ts
 * @Description:
 */
import { prisma } from '@/db'
import { firecrawl } from '@/lib/firecrawl'
import { authFnMiddleware } from '@/middlewares/auth'
import { extractSchema, importSchema } from '@/schemas/import'
import { createServerFn } from '@tanstack/react-start'
import z from 'zod'

export const scrapeUrlFn = createServerFn({ method: 'POST' })
  .middleware([authFnMiddleware])
  .inputValidator(importSchema)
  .handler(async ({ data: { url }, context: { session } }) => {
    const item = await prisma.savedItem.create({
      data: {
        url,
        userId: session.user.id,
        status: 'PROCESSING',
      },
    })

    try {
      const result = await firecrawl.scrape(url, {
        formats: [
          'markdown',
          {
            type: 'json',
            schema: extractSchema,
            // prompt: 'please extract the author and also publishedAt timestamp',
          },
        ],
        onlyMainContent: true,
      })

      const jsonData = result.json as z.infer<typeof extractSchema>

      // console.log({ jsonData })

      let publishedAt = null
      if (jsonData.publishedAt) {
        publishedAt = new Date(jsonData.publishedAt)
        if (isNaN(publishedAt.getTime())) {
          publishedAt = null
        }
      }

      const updatedItem = await prisma.savedItem.update({
        where: { id: item.id },
        data: {
          title: result.metadata?.title || null,
          content: result.markdown || null,
          ogImage: result.metadata?.ogImage || null,
          author: jsonData.author || null,
          publishedAt,
          status: 'COMPLETED',
        },
      })
      return updatedItem
    } catch (error) {
      const failedItem = await prisma.savedItem.update({
        where: { id: item.id },
        data: {
          status: 'FAILED',
        },
      })
      console.error(error)
      return failedItem
    }
  })
