/*
 * @Author: 水果饮料
 * @Date: 2026-01-22 13:17:28
 * @LastEditors: 水果饮料
 * @LastEditTime: 2026-01-24 16:19:50
 * @FilePath: /tanstack-start-tutorial-yt/src/routes/dashboard/items/index.tsx
 * @Description:
 */
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getItemsFn } from '@/data/items'
import { ItemStatus } from '@/generated/prisma/enums'
import { copyToClipboard } from '@/lib/clipboard'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Copy, InboxIcon } from 'lucide-react'
import { zodValidator } from '@tanstack/zod-adapter' // only use zod v3
import z from 'zod'
import { Suspense, use, useEffect, useState } from 'react'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'

const itemSearchSchema = z.object({
  q: z.string().default(''),
  status: z.union([z.literal('all'), z.nativeEnum(ItemStatus)]).default('all'),
})

type ItemSearch = z.infer<typeof itemSearchSchema>

export const Route = createFileRoute('/dashboard/items/')({
  component: RouteComponent,
  loader: () => ({ itemsPromise: getItemsFn() }),
  validateSearch: zodValidator(itemSearchSchema),
})

function ItemsGridSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="overflow-hidden pt-0">
          <Skeleton className="aspect-video w-full " />
          <CardHeader className="space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="size-8 rounded-md" />
            </div>

            {/* title */}
            <Skeleton className="h-6 w-full" />
            {/* author */}
            <Skeleton className="h-4 w-40" />
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}

function ItemsList({
  q,
  status,
  data,
}: {
  q: ItemSearch['q']
  status: ItemSearch['status']
  data: ReturnType<typeof getItemsFn>
}) {
  const items = use(data)
  const filteredItems = items.filter((item) => {
    // 过滤查询
    const matchesQuery =
      q === '' ||
      item.title?.toLowerCase().includes(q.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(q.toLowerCase()))
    // 过滤状态
    const matchesStatus = status === 'all' || item.status === status
    // 返回查询和状态都匹配的项
    return matchesQuery && matchesStatus
  })

  if (filteredItems.length === 0) {
    return (
      <Empty className="border rounded-lg h-full">
        <EmptyHeader>
          <EmptyMedia variant={'icon'}>
            <InboxIcon className="size-12 text-muted-foreground" />
          </EmptyMedia>
          <EmptyTitle>
            {items.length === 0 ? 'No Items saved yet' : 'No items found'}
          </EmptyTitle>
          <EmptyDescription>
            {items.length === 0
              ? 'Import a Url to get started with saving your content'
              : 'No items match your current search filter'}
          </EmptyDescription>
        </EmptyHeader>
        {items.length === 0 && (
          <EmptyContent>
            <Link className={buttonVariants()} to="/dashboard/import">
              Import URL
            </Link>
          </EmptyContent>
        )}
      </Empty>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {filteredItems.map((item) => (
        <Card
          key={item.id}
          className="group overflow-hidden transition-all hover:shadow-lg pt-0"
        >
          <Link to="/dashboard" className="block">
            {item.ogImage && (
              <div className="aspect-video overflow-hidden">
                <img
                  src={item.ogImage}
                  alt={item.title ?? 'Article Thumbnail'}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
            )}

            <CardHeader className="space-y-3 pt-4">
              <div className="flex items-center justify-between gap-2">
                <Badge
                  variant={
                    item.status === 'COMPLETED' ? 'default' : 'secondary'
                  }
                >
                  {item.status.toLowerCase()}
                </Badge>
                <Button
                  onClick={(e) => {
                    e.preventDefault()
                    copyToClipboard(item.url)
                  }}
                  variant={'outline'}
                  size={'icon'}
                  className="size-8"
                >
                  <Copy className="size-4" />{' '}
                </Button>
              </div>
              <CardTitle className="line-clamp-1 text-xl leading-snug group-hover:text-primary transition-colors">
                {item.title}
              </CardTitle>
              {item.author && (
                <p className="text-xs text-muted-foreground">{item.author}</p>
              )}
            </CardHeader>
          </Link>
        </Card>
      ))}
    </div>
  )
}

function RouteComponent() {
  const { itemsPromise } = Route.useLoaderData()
  const { q, status } = Route.useSearch()

  const [searchInput, setSearchInput] = useState(q)

  const navigate = useNavigate({ from: Route.fullPath })

  useEffect(() => {
    if (searchInput === q) return

    const timeoutId = setTimeout(() => {
      navigate({
        search: (prev) => ({
          ...prev,
          q: searchInput,
        }),
      })

      return () => clearTimeout(timeoutId)
    }, 300)
  }, [searchInput, q, navigate])

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Saved Items</h1>
        <p className="text-muted-foreground">
          Your saved articles and content!
        </p>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex gap-4">
        <Input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by title or tags..."
        />
        <Select
          value={status}
          onValueChange={(value) =>
            navigate({
              search: (prev) => ({
                ...prev,
                status: value as typeof status,
              }),
            })
          }
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {Object.values(ItemStatus).map((status) => (
              <SelectItem key={status} value={status} className="capitalize">
                {status.toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Item List */}
      <Suspense fallback={<ItemsGridSkeleton />}>
        <ItemsList q={q} status={status} data={itemsPromise} />
      </Suspense>
    </div>
  )
}
