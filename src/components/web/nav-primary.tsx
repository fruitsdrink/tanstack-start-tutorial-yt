/*
 * @Author: 水果饮料
 * @Date: 2026-01-20 22:46:45
 * @LastEditors: 水果饮料
 * @LastEditTime: 2026-01-21 16:17:15
 * @FilePath: /tanstack-start-tutorial-yt/src/components/web/nav-primary.tsx
 * @Description:
 */

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  // useSidebar,
} from '@/components/ui/sidebar'
import { Link } from '@tanstack/react-router'
import { NavPrimaryProps } from '@/lib/types'

export function NavPrimary({ items }: NavPrimaryProps) {
  // const { isMobile } = useSidebar()

  return (
    // <SidebarGroup className="group-data-[collapsible=icon]:hidden">
    //   <SidebarGroupLabel>Projects</SidebarGroupLabel>
    //   <SidebarMenu>
    //     {projects.map((item) => (
    //       <SidebarMenuItem key={item.name}>
    //         <SidebarMenuButton asChild>
    //           <a href={item.url}>
    //             <item.icon />
    //             <span>{item.name}</span>
    //           </a>
    //         </SidebarMenuButton>
    //         <DropdownMenu>
    //           <DropdownMenuTrigger asChild>
    //             <SidebarMenuAction showOnHover>
    //               <MoreHorizontal />
    //               <span className="sr-only">More</span>
    //             </SidebarMenuAction>
    //           </DropdownMenuTrigger>
    //           <DropdownMenuContent
    //             className="w-48 rounded-lg"
    //             side={isMobile ? 'bottom' : 'right'}
    //             align={isMobile ? 'end' : 'start'}
    //           >
    //             <DropdownMenuItem>
    //               <Folder className="text-muted-foreground" />
    //               <span>View Project</span>
    //             </DropdownMenuItem>
    //             <DropdownMenuItem>
    //               <Forward className="text-muted-foreground" />
    //               <span>Share Project</span>
    //             </DropdownMenuItem>
    //             <DropdownMenuSeparator />
    //             <DropdownMenuItem>
    //               <Trash2 className="text-muted-foreground" />
    //               <span>Delete Project</span>
    //             </DropdownMenuItem>
    //           </DropdownMenuContent>
    //         </DropdownMenu>
    //       </SidebarMenuItem>
    //     ))}
    //     <SidebarMenuItem>
    //       <SidebarMenuButton className="text-sidebar-foreground/70">
    //         <MoreHorizontal className="text-sidebar-foreground/70" />
    //         <span>More</span>
    //       </SidebarMenuButton>
    //     </SidebarMenuItem>
    //   </SidebarMenu>
    // </SidebarGroup>

    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item, index) => {
            return (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton asChild size={'sm'}>
                  <Link
                    to={item.to}
                    activeOptions={item.activeOptions}
                    activeProps={{
                      'data-active': true,
                    }}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
