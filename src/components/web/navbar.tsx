import { Button } from '../ui/button'

/*
 * @Author: 水果饮料
 * @Date: 2026-01-17 12:31:23
 * @LastEditors: 水果饮料
 * @LastEditTime: 2026-01-17 15:35:09
 * @FilePath: /tanstack-start-tutorial-yt/src/components/web/navbar.tsx
 * @Description:
 */
export function Navbar() {
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
          <Button variant={'secondary'}>Login</Button>
          <Button>Get Started</Button>
        </div>
      </div>
    </nav>
  )
}

Navbar.displayName = 'Navbar'
