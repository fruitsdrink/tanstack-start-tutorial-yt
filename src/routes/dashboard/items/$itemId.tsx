import { MessageResponse } from '@/components/ai-elements/message'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Skeleton } from '@/components/ui/skeleton'
import { getItemByIdFn } from '@/data/items'
import { cn } from '@/lib/utils'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowLeftIcon,
  CalculatorIcon,
  ChevronDownIcon,
  ClockIcon,
  ExternalLinkIcon,
  UserIcon,
} from 'lucide-react'
import { Suspense, use, useState } from 'react'

export const Route = createFileRoute('/dashboard/items/$itemId')({
  component: RouteComponent,
  loader: ({ params }) => ({
    itemPromise: getItemByIdFn({ data: { id: params.itemId } }),
  }),
  head: () => {
    return {
      meta: [
        {
          title: 'Item Details',
        },
        {
          name: 'description',
          content: 'Detailed information about the item',
        },
        {
          property: 'og:title',
          content: 'Item Details',
        },
      ],
    }
  },
})

function RouteComponent() {
  const { itemPromise } = Route.useLoaderData()

  return (
    <div className="mx-auto max-w-3xl space-y-6 w-full">
      <div className="flex justify-start">
        <Link
          to="/dashboard"
          className={buttonVariants({
            variant: 'outline',
          })}
        >
          <ArrowLeftIcon />
          Go Back
        </Link>
      </div>
      <Suspense fallback={<ItemSkeleton />}>
        <Item data={itemPromise} />
      </Suspense>
    </div>
  )
}

function Item({ data }: { data: ReturnType<typeof getItemByIdFn> }) {
  const [contentOpen, setContentOpen] = useState(false)

  const item = use(data)

  return (
    <>
      {item.ogImage && (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
          <img
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            src={item.ogImage}
            alt={item.title ?? 'Item Image'}
          />
        </div>
      )}

      <div className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">
          {item.title ?? 'Untitled'}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {item.author && (
            <span className="inline-flex items-center gap-1">
              <UserIcon className="size-3.5" />
              {item.author}
            </span>
          )}

          {item.publishedAt && (
            <span className="inline-flex items-center gap-1">
              <CalculatorIcon className="size-3.5" />
              {new Date(item.publishedAt).toLocaleDateString()}
            </span>
          )}

          <span className="inline-flex items-center gap-1">
            <ClockIcon className="size-3.5" />
            Saved {new Date(item.createdAt).toLocaleDateString()}
          </span>
        </div>

        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex gap-1 items-center text-sm text-primary hover:underline"
        >
          View Original
          <ExternalLinkIcon className="size-3.5" />
        </a>

        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        )}

        <p>Hey this is for the summary</p>

        {item.content && (
          <Collapsible open={contentOpen} onOpenChange={setContentOpen}>
            <CollapsibleTrigger asChild>
              <Button variant={'outline'} className="w-full justify-between">
                <span className="font-medium">Full Content</span>
                <ChevronDownIcon
                  className={cn('size-4 transition-transform duration-200', {
                    'rotate-180': contentOpen,
                  })}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Card className="mt-2">
                <CardContent>
                  <MessageResponse>{item.content}</MessageResponse>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>
    </>
  )
}

function ItemSkeleton() {
  return (
    <>
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
        <Skeleton className="h-full w-full object-cover transition-transform duration-300 hover:scale-105" />
      </div>

      <div className="space-y-3">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    </>
  )
}
