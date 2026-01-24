import { createClientOnlyFn } from '@tanstack/react-start'
import { toast } from 'sonner'

/*
 * @Author: 水果饮料
 * @Date: 2026-01-24 12:45:01
 * @LastEditors: 水果饮料
 * @LastEditTime: 2026-01-24 12:52:27
 * @FilePath: /tanstack-start-tutorial-yt/src/lib/clipboard.ts
 * @Description:
 */
export const copyToClipboard = createClientOnlyFn(async (url: string) => {
  await navigator.clipboard.writeText(url)
  toast.success('URL Copied to clipboard')
})
