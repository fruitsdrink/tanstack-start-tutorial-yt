/*
 * @Author: 水果饮料
 * @Date: 2026-01-20 22:46:21
 * @LastEditors: 水果饮料
 * @LastEditTime: 2026-01-21 16:20:56
 * @FilePath: /tanstack-start-tutorial-yt/src/components/web/app-sidebar.tsx
 * @Description:
 */

import * as React from 'react'
import { BookmarkIcon, Compass, Import } from 'lucide-react'

// import { NavMain } from './nav-main'
import { NavPrimary } from './nav-primary'
import { NavUser } from './nav-user'
// import { TeamSwitcher } from './team-switcher'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { Link, linkOptions } from '@tanstack/react-router'
import { NavPrimaryProps, NavUserProps } from '@/lib/types'

// This is sample data.
// const data = {
//   user: {
//     name: 'shadcn',
//     email: 'm@example.com',
//     avatar: '/avatars/shadcn.jpg',
//   },
//   teams: [
//     {
//       name: 'Acme Inc',
//       logo: GalleryVerticalEnd,
//       plan: 'Enterprise',
//     },
//     {
//       name: 'Acme Corp.',
//       logo: AudioWaveform,
//       plan: 'Startup',
//     },
//     {
//       name: 'Evil Corp.',
//       logo: Command,
//       plan: 'Free',
//     },
//   ],
//   navMain: [
//     {
//       title: 'Playground',
//       url: '#',
//       icon: SquareTerminal,
//       isActive: true,
//       items: [
//         {
//           title: 'History',
//           url: '#',
//         },
//         {
//           title: 'Starred',
//           url: '#',
//         },
//         {
//           title: 'Settings',
//           url: '#',
//         },
//       ],
//     },
//     {
//       title: 'Models',
//       url: '#',
//       icon: Bot,
//       items: [
//         {
//           title: 'Genesis',
//           url: '#',
//         },
//         {
//           title: 'Explorer',
//           url: '#',
//         },
//         {
//           title: 'Quantum',
//           url: '#',
//         },
//       ],
//     },
//     {
//       title: 'Documentation',
//       url: '#',
//       icon: BookOpen,
//       items: [
//         {
//           title: 'Introduction',
//           url: '#',
//         },
//         {
//           title: 'Get Started',
//           url: '#',
//         },
//         {
//           title: 'Tutorials',
//           url: '#',
//         },
//         {
//           title: 'Changelog',
//           url: '#',
//         },
//       ],
//     },
//     {
//       title: 'Settings',
//       url: '#',
//       icon: Settings2,
//       items: [
//         {
//           title: 'General',
//           url: '#',
//         },
//         {
//           title: 'Team',
//           url: '#',
//         },
//         {
//           title: 'Billing',
//           url: '#',
//         },
//         {
//           title: 'Limits',
//           url: '#',
//         },
//       ],
//     },
//   ],
//   projects: [
//     {
//       name: 'Design Engineering',
//       url: '#',
//       icon: Frame,
//     },
//     {
//       name: 'Sales & Marketing',
//       url: '#',
//       icon: PieChart,
//     },
//     {
//       name: 'Travel',
//       url: '#',
//       icon: Map,
//     },
//   ],
// }

const navItems: NavPrimaryProps['items'] = linkOptions([
  {
    title: 'Items',
    icon: BookmarkIcon,
    to: '/dashboard/items',
    activeOptions: {
      exact: true,
    },
  },
  {
    title: 'Import',
    icon: Import,
    to: '/dashboard/import',
    activeOptions: {
      exact: true,
    },
  },
  {
    title: 'Discover',
    icon: Compass,
    to: '/dashboard/discover',
    activeOptions: {
      exact: true,
    },
  },
])

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & NavUserProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {/* <TeamSwitcher teams={data.teams} /> */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size={'lg'} asChild>
              <Link to="/dashboard" className="flex items-center gap-3">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <BookmarkIcon className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="font-medium">Recall</span>
                  <span className="text-xs text-muted-foreground">
                    Your Ai Knowledge Base
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* <NavMain items={data.navMain} /> */}
        <NavPrimary items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
