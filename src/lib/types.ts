import { LucideIcon } from 'lucide-react'

/*
 * @Author: 水果饮料
 * @Date: 2026-01-21 16:16:47
 * @LastEditors: 水果饮料
 * @LastEditTime: 2026-01-21 16:16:53
 * @FilePath: /tanstack-start-tutorial-yt/src/lib/types.ts
 * @Description:
 */
export interface NavPrimaryProps {
  items: {
    title: string
    to: string
    icon: LucideIcon
  }[]
}
