/*
 * @Author: 水果饮料
 * @Date: 2026-01-20 23:07:45
 * @LastEditors: 水果饮料
 * @LastEditTime: 2026-01-20 23:17:03
 * @FilePath: /tanstack-start-tutorial-yt/src/routes/dashboard/route.tsx
 * @Description: dashboard 布局路由
 */
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/web/app-sidebar'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { getSessionFn } from '@/data/session'

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
  loader: async () => {
    const session = await getSessionFn()
    return {
      user: session.user,
    }
  },
})

function RouteComponent() {
  const { user } = Route.useLoaderData()

  return (
    <div>
      <SidebarProvider>
        <AppSidebar user={user} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              {/* <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              /> */}
              {/* <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">
                      Building Your Application
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb> */}
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
