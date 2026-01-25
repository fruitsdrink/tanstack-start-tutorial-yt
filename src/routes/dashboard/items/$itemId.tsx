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
import { getItemByIdFn, saveSummaryAndGenerateTagsFn } from '@/data/items'
import { cn } from '@/lib/utils'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import {
  ArrowLeftIcon,
  CalculatorIcon,
  ChevronDownIcon,
  ClockIcon,
  ExternalLinkIcon,
  Loader2,
  Sparkles,
  UserIcon,
} from 'lucide-react'
import { Suspense, useState } from 'react'
import { useCompletion } from '@ai-sdk/react'
import { toast } from 'sonner'

export const Route = createFileRoute('/dashboard/items/$itemId')({
  component: RouteComponent,
  loader: ({ params }) => getItemByIdFn({ data: { id: params.itemId } }),
  head: ({ loaderData }) => {
    return {
      meta: [
        {
          title: loaderData?.title || 'Item Details',
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
  const data = Route.useLoaderData()

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
        <Item data={data} />
      </Suspense>
    </div>
  )
}

function Item({ data }: { data: Awaited<ReturnType<typeof getItemByIdFn>> }) {
  const [contentOpen, setContentOpen] = useState(false)

  const item = data

  const router = useRouter()

  const { completion, complete, isLoading } = useCompletion({
    api: '/api/ai/summary',
    initialCompletion: item.summary ?? undefined,
    streamProtocol: 'text',
    body: {
      itemId: item.id,
    },
    onFinish: async (_prompt, completionText) => {
      await saveSummaryAndGenerateTagsFn({
        data: {
          id: item.id,
          summary: completionText,
        },
      })

      toast.success('Summary and tags generated and saved successfully')

      router.invalidate()
    },
    onError: (error) => {
      console.error('Error summarizing item:', error)
      toast.error(error.message)
    },
  })

  function handleGenerateSummary() {
    if (!item.content) {
      toast.error('No content available to summarize')
      return
    }

    complete(item.content)
  }

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

        {/* Summary section */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-primary mb-3">
                  Summary
                </h2>
                {completion || item.summary ? (
                  <MessageResponse>{completion}</MessageResponse>
                ) : (
                  <p className="text-muted-foreground italic">
                    {item.content
                      ? 'No summary yet. Generate on with ai'
                      : 'No content available to summarize.'}
                  </p>
                )}
              </div>

              {item.content && !item.summary && (
                <Button
                  onClick={handleGenerateSummary}
                  size={'sm'}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-4" />
                      Generate
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

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
