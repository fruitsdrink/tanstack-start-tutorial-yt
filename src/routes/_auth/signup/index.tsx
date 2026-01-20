/*
 * @Author: 水果饮料
 * @Date: 2026-01-20 17:19:06
 * @LastEditors: 水果饮料
 * @LastEditTime: 2026-01-20 17:32:07
 * @FilePath: /tanstack-start-tutorial-yt/src/routes/_auth/signup/index.tsx
 * @Description:
 */
import { SignupForm } from '@/components/web/signup-form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/signup/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <SignupForm />
}
