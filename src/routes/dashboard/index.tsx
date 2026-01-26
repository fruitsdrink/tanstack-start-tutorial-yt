/*
 * @Author: 水果饮料
 * @Date: 2026-01-20 22:52:19
 * @LastEditors: 水果饮料
 * @LastEditTime: 2026-01-26 12:44:52
 * @FilePath: /tanstack-start-tutorial-yt/src/routes/dashboard/index.tsx
 * @Description:
 */
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/')({
  beforeLoad: () => {
    throw redirect({ to: '/dashboard/items' })
  },
})
