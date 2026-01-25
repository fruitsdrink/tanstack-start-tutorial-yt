/*
 * @Author: 水果饮料
 * @Date: 2026-01-23 15:25:47
 * @LastEditors: 水果饮料
 * @LastEditTime: 2026-01-24 16:10:34
 * @FilePath: /tanstack-start-tutorial-yt/src/data/items.ts
 * @Description:
 */
import { prisma } from '@/db'
import { firecrawl } from '@/lib/firecrawl'
import { openrouter } from '@/lib/openRouter'
import { authFnMiddleware } from '@/middlewares/auth'
import { bulkImportSchema, extractSchema, importSchema } from '@/schemas/import'
import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { generateText } from 'ai'
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
        location: {
          country: 'US',
          languages: ['en'],
        },
        proxy: 'auto',
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

export const mapUrlFn = createServerFn({ method: 'POST' })
  .middleware([authFnMiddleware])
  .inputValidator(bulkImportSchema)
  .handler(async ({ data: { url, search } }) => {
    const result = await firecrawl.map(url, {
      limit: 25,
      search,
      location: {
        country: 'US',
        languages: ['en'],
      },
    })

    return result.links
  })

export const bulkScrapeUrlFn = createServerFn({ method: 'POST' })
  .middleware([authFnMiddleware])
  .inputValidator(z.object({ urls: z.array(z.string().url()) }))
  .handler(async ({ data: { urls }, context: { session } }) => {
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i]
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
          location: {
            country: 'US',
            languages: ['en'],
          },
          proxy: 'auto',
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

        await prisma.savedItem.update({
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
      } catch (error) {
        await prisma.savedItem.update({
          where: { id: item.id },
          data: {
            status: 'FAILED',
          },
        })
      }
    }
  })

export const getItemsFn = createServerFn({ method: 'GET' })
  .middleware([authFnMiddleware])
  .handler(async ({ context: { session } }) => {
    // 模拟延迟5秒钟
    // await new Promise((resolve) => setTimeout(resolve, 5000))
    const items = await prisma.savedItem.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    })
    return items
  })

export const getItemByIdFn = createServerFn({ method: 'GET' })
  .middleware([authFnMiddleware])
  .inputValidator(
    z.object({
      id: z.string(),
    }),
  )
  .handler(async ({ context, data }) => {
    // 模拟延迟5秒
    await new Promise((resolve) => setTimeout(resolve, 5000))
    const item = await prisma.savedItem.findUnique({
      where: {
        id: data.id,
        userId: context.session.user.id,
      },
    })

    if (!item) {
      throw notFound()
    }

    return item
  })

export const saveSummaryAndGenerateTagsFn = createServerFn({ method: 'POST' })
  .middleware([authFnMiddleware])
  .inputValidator(
    z.object({
      id: z.string(),
      summary: z.string(),
    }),
  )
  .handler(async ({ context, data }) => {
    const existingItem = await prisma.savedItem.findUnique({
      where: {
        id: data.id,
        userId: context.session.user.id,
      },
    })

    if (!existingItem) {
      throw notFound()
    }

    const { text } = await generateText({
      model: openrouter.chat('xiaomi/mimo-v2-flash:free'),
      system: `You are a helpful assistant that extracts relevant tags from content summaries.
Extract 3-5 short, relevant tags that categorize the content.
Return ONLY a comma-separated list of tags, nothing else.
Example: technology, programming, web development, javascript`,
      prompt: `Extract tags from this summary: \n\n${data.summary}`,
    })

    const tags = text
      .split(',')
      .map((tag) => tag.trim().toLowerCase())
      .filter((tag) => tag.length > 0)
      .slice(0, 5)

    return await prisma.savedItem.update({
      where: {
        id: data.id,
        userId: context.session.user.id,
      },
      data: {
        summary: data.summary,
        tags,
      },
    })
  })
