/*
 * @Author: 水果饮料
 * @Date: 2026-01-17 10:41:20
 * @LastEditors: 水果饮料
 * @LastEditTime: 2026-01-20 21:51:22
 * @FilePath: /tanstack-start-tutorial-yt/src/routes/__root.tsx
 * @Description:
 */
import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { formDevtoolsPlugin } from '@tanstack/react-form-devtools'
import { Toaster } from '@/components/ui/sonner'

import appCss from '../styles.css?url'
import { ThemeProvider } from '@/lib/theme-provider'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  // const { theme = 'system' } = useTheme()

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider>
          {children}
          <Toaster
            // theme={theme as ToasterProps['theme']}
            // theme={'dark'}
            closeButton
            position="top-center"
          />
        </ThemeProvider>
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            formDevtoolsPlugin(),
          ]}
        />

        <Scripts />
      </body>
    </html>
  )
}
