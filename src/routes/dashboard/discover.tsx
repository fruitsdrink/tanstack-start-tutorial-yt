/*
 * @Author: 水果饮料
 * @Date: 2026-01-22 13:17:28
 * @LastEditors: 水果饮料
 * @LastEditTime: 2026-01-26 11:02:07
 * @FilePath: /tanstack-start-tutorial-yt/src/routes/dashboard/discover.tsx
 * @Description:
 */
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { bulkScrapeUrlFn, searchWebFn } from '@/data/items'
import { searchSchema } from '@/schemas/import'
import { SearchResultWeb } from '@mendable/firecrawl-js'
import { useForm } from '@tanstack/react-form-start'
import { createFileRoute } from '@tanstack/react-router'
import { Loader2, Loader2Icon, Search, Sparkles } from 'lucide-react'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'

export const Route = createFileRoute('/dashboard/discover')({
  component: RouteComponent,
})

function RouteComponent() {
  const [searchResults, setSearchResults] = useState<Array<SearchResultWeb>>([])
  const [selectedUrls, setSelectedUrls] = useState<Set<string>>(new Set())

  const [isPending, startTransition] = useTransition()
  const [isBulkPending, startBulkTransition] = useTransition()

  function handleSelectAll() {
    if (selectedUrls.size === searchResults.length) {
      setSelectedUrls(new Set())
    } else {
      setSelectedUrls(new Set(searchResults.map((link) => link.url)))
    }
  }

  function handleToggleUrl(url: string) {
    const updatedSet = new Set(selectedUrls)

    if (updatedSet.has(url)) {
      updatedSet.delete(url)
    } else {
      updatedSet.add(url)
    }

    setSelectedUrls(updatedSet)
  }

  function handleBulkImport() {
    startBulkTransition(async () => {
      if (selectedUrls.size === 0) {
        toast.error('Please select at least one URL to import')
        return
      }

      await bulkScrapeUrlFn({ data: { urls: Array.from(selectedUrls) } })

      toast.success(`Successfully imported ${selectedUrls.size} URLs!`)
    })
  }

  const form = useForm({
    defaultValues: {
      query: '',
    },
    validators: {
      onSubmit: searchSchema,
    },
    onSubmit: ({ value }) => {
      startTransition(async () => {
        const result = await searchWebFn({ data: value })
        setSearchResults(result)
      })
    },
  })

  return (
    <div className="flex flex-1 items-center justify-center py-8">
      <div className="w-full max-w-2xl space-y-6 px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Discover</h1>
          <p className="text-muted-foreground">
            Search the web for articles on any topic.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Sparkles className="size-5 text-primary" />
              Topic Search
            </CardTitle>
            <CardDescription>
              Search the web for content and import what you find interesting.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                form.handleSubmit()
              }}
            >
              <FieldGroup>
                <form.Field
                  name="query"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid

                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Search Query
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="e.g., React Server Components tutorial"
                          autoComplete="off"
                          autoCorrect="off"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    )
                  }}
                />
                <Button disabled={isPending} type="submit">
                  {isPending ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Search...
                    </>
                  ) : (
                    <>
                      <Search className="size-4" />
                      Search
                    </>
                  )}
                </Button>
              </FieldGroup>
            </form>

            {/* Discovered URLs list */}
            {searchResults.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">
                    Found {searchResults.length} URLs
                  </p>
                  <Button
                    variant={'outline'}
                    size={'sm'}
                    onClick={handleSelectAll}
                  >
                    {selectedUrls.size === searchResults.length
                      ? 'Deselect all'
                      : 'Select all'}
                  </Button>
                </div>

                <div className="max-h-80 space-y-2 overflow-y-auto border p-4">
                  {searchResults.map((link) => (
                    <label
                      key={link.url}
                      className="hover:bg-muted/50 flex cursor-pointer items-start gap-3 rounded-md p-2"
                    >
                      <Checkbox
                        className="mt-0.5"
                        checked={selectedUrls.has(link.url)}
                        onCheckedChange={() => handleToggleUrl(link.url)}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {link.title ?? 'Title has not been found'}
                        </p>
                        <p className="text-muted-foreground truncate text-xs">
                          {link.description ?? 'Description has not been found'}
                        </p>
                        <p className="text-muted-foreground truncate text-xs">
                          {link.url}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>

                <Button
                  disabled={isBulkPending}
                  onClick={handleBulkImport}
                  className="w-full"
                >
                  {isBulkPending ? (
                    <>
                      <Loader2Icon className="size-4 animate-spin" />
                      "Processing..."
                    </>
                  ) : (
                    `Import ${selectedUrls.size} URLs`
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
