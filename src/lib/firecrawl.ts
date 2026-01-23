/*
 * @Author: 水果饮料
 * @Date: 2026-01-23 15:25:47
 * @LastEditors: 水果饮料
 * @LastEditTime: 2026-01-23 15:45:42
 * @FilePath: /tanstack-start-tutorial-yt/src/lib/firecrawl.ts
 * @Description:
 */
import Firecrawl from '@mendable/firecrawl-js'

export const firecrawl = new Firecrawl({
  apiKey: process.env.FIRECRAWL_API_KEY,
})
