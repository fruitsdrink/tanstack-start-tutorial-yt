/*
 * @Author: 水果饮料
 * @Date: 2026-01-17 12:31:23
 * @LastEditors: 水果饮料
 * @LastEditTime: 2026-01-20 23:02:05
 * @FilePath: /tanstack-start-tutorial-yt/src/components/web/navbar.tsx
 * @Description: 导航组件
 */

import { Link } from '@tanstack/react-router'
import { Button, buttonVariants } from '../ui/button'
import { ThemeToggle } from './theme-toggle'
import { authClient } from '@/lib/auth-client'
import { toast } from 'sonner'

export function Navbar() {
  const { data: session, isPending } = authClient.useSession()

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success('Logged out successfully')
        },
        onError: ({ error }) => {
          toast.error(error.message || 'Logout failed')
        },
      },
    })
  }

  return (
    <nav className=" sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <img
            src="https://tanstack.com/images/logos/logo-color-banner-600.png"
            alt="logo"
            className="size-8"
          />
          <h1 className="text-2xl font-semibold">TanStack Start</h1>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {isPending ? null : session ? (
            <>
              <Button variant={'secondary'} onClick={handleLogout}>
                Logout
              </Button>
              <Link to="/dashboard" className={buttonVariants()}>
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={buttonVariants({ variant: 'secondary' })}
              >
                Login
              </Link>
              <Link to="/signup" className={buttonVariants()}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

Navbar.displayName = 'Navbar'
