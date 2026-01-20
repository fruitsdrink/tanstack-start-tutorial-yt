/*
 * @Author: 水果饮料
 * @Date: 2026-01-20 17:19:06
 * @LastEditors: 水果饮料
 * @LastEditTime: 2026-01-20 17:27:57
 * @FilePath: /tanstack-start-tutorial-yt/src/routes/_auth/login/index.tsx
 * @Description:
 */
import { LoginForm } from '@/components/web/login-form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/login/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <LoginForm />
}
