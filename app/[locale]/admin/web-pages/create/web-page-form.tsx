'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import MdEditor from 'react-markdown-editor-lite'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'
import 'react-markdown-editor-lite/lib/index.css'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { createWebPage, updateWebPage } from '@/lib/actions/web-page.actions'
import { IWebPage } from '@/lib/db/models/web-page.model'
import { WebPageInputSchema, WebPageUpdateSchema } from '@/lib/validator'
import { Checkbox } from '@/components/ui/checkbox'
import { toSlug } from '@/lib/utils'
import { Loader2, Wand2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { HelpDialog } from './help-dialog'

const webPageDefaultValues =
  process.env.NODE_ENV === 'development'
    ? {
        title: 'Sample Page',
        slug: 'sample-page',
        content: 'Sample Content',
        isPublished: false,
      }
    : {
        title: '',
        slug: '',
        content: '',
        isPublished: false,
      }

const WebPageForm = ({
  type,
  webPage,
  webPageId,
}: {
  type: 'Create' | 'Update'
  webPage?: IWebPage
  webPageId?: string
}) => {
  const router = useRouter()

  const form = useForm<z.infer<typeof WebPageInputSchema>>({
    resolver:
      type === 'Update'
        ? zodResolver(WebPageUpdateSchema)
        : zodResolver(WebPageInputSchema),
    defaultValues:
      webPage && type === 'Update' ? webPage : webPageDefaultValues,
  })

  const { toast } = useToast()

  async function onSubmit(values: z.infer<typeof WebPageInputSchema>) {
    try {
      if (type === 'Create') {
        const res = await createWebPage(values)
        if (!res.success) {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: res.message,
          })
        } else {
          toast({
            title: 'Success',
            description: res.message,
          })
          router.push('/admin/web-pages')
        }
      }
      if (type === 'Update') {
        if (!webPageId) {
          router.push('/admin/web-pages')
          return
        }
        const res = await updateWebPage({ ...values, _id: webPageId })
        if (!res.success) {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: res.message,
          })
        } else {
          toast({
            title: 'Success',
            description: res.message,
          })
          router.push('/admin/web-pages')
        }
      }
    } catch {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Something went wrong. Please try again.',
      })
    }
  }

  // Custom image upload handler
  const onImageUpload = async (file: File): Promise<string> => {
    // TODO: Implement your image upload logic here
    console.log('Upload image:', file)
    return URL.createObjectURL(file)
  }

  return (
    <Form {...form}>
      <form
        method='post'
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-8'
      >
        <div className='grid gap-6 md:grid-cols-2'>
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder='Enter page title' {...field} />
                </FormControl>
                <FormDescription>
                  The title of your page as it will appear to users.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='slug'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <div className='relative'>
                    <Input
                      placeholder='enter-page-slug'
                      {...field}
                      className='pr-20'
                    />
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      onClick={() => {
                        form.setValue('slug', toSlug(form.getValues('title')))
                      }}
                      className='absolute right-2 top-1 h-7'
                    >
                      <Wand2 className='h-3.5 w-3.5 mr-2' />
                      Generate
                    </Button>
                  </div>
                </FormControl>
                <FormDescription>
                  The URL-friendly version of the title. Used in the page&apos;s
                  URL.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Tabs defaultValue='editor' className='w-full'>
          <div className='flex items-center justify-between mb-4'>
            <TabsList>
              <TabsTrigger value='editor'>Editor</TabsTrigger>
              <TabsTrigger value='preview'>Preview</TabsTrigger>
            </TabsList>
            <HelpDialog />
          </div>
          <TabsContent value='editor' className='mt-0'>
            <FormField
              control={form.control}
              name='content'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <div className='border rounded-md'>
                      <MdEditor
                        {...field}
                        style={{ height: '500px', border: 'none' }}
                        renderHTML={(text) => (
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkMath]}
                            rehypePlugins={[
                              rehypeRaw,
                              rehypeSanitize,
                              rehypeHighlight,
                            ]}
                            components={{
                              h1: (props) => (
                                <h1
                                  className='text-4xl font-bold my-4'
                                  {...props}
                                />
                              ),
                              pre: (props) => (
                                <pre
                                  className='bg-gray-800 text-white p-4 rounded-lg my-4'
                                  {...props}
                                />
                              ),
                              table: (props) => (
                                <div className='overflow-x-auto my-4'>
                                  <table
                                    className='min-w-full divide-y divide-gray-200'
                                    {...props}
                                  />
                                </div>
                              ),
                            }}
                          >
                            {text}
                          </ReactMarkdown>
                        )}
                        onChange={({ text }) => form.setValue('content', text)}
                        config={{
                          view: {
                            menu: true,
                            md: true,
                            html: true,
                          },
                          shortcuts: true,
                          canView: {
                            menu: true,
                            md: true,
                            html: true,
                          },
                          htmlClass: 'prose dark:prose-invert max-w-none',
                          markdownClass: 'prose-editor',
                          imageAccept: '.jpg,.jpeg,.png,.gif,.webp',
                          onImageUpload: onImageUpload,
                          syncScrollMode: [
                            'leftFollowRight',
                            'rightFollowLeft',
                          ],
                        }}
                        plugins={[
                          'header',
                          'font-bold',
                          'font-italic',
                          'font-underline',
                          'font-strikethrough',
                          'list-unordered',
                          'list-ordered',
                          'block-quote',
                          'block-wrap',
                          'block-code-inline',
                          'block-code-block',
                          'table',
                          'image',
                          'link',
                          'clear',
                          'logger',
                          'mode-toggle',
                          'full-screen',
                          'tab-insert',
                          'divider',
                          'emoji',
                        ]}
                        className='w-full'
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Write your page content using Markdown or HTML. Supports
                    GitHub Flavored Markdown, syntax highlighting, math
                    equations, and custom HTML blocks.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
          <TabsContent value='preview' className='mt-0'>
            <Card className='p-6 min-h-[500px]'>
              <ReactMarkdown
                className='prose dark:prose-invert max-w-none'
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeHighlight]}
                components={{
                  h1: (props) => (
                    <h1 className='text-4xl font-bold my-4' {...props} />
                  ),
                  pre: (props) => (
                    <pre
                      className='bg-gray-800 text-white p-4 rounded-lg my-4'
                      {...props}
                    />
                  ),
                  table: (props) => (
                    <div className='overflow-x-auto my-4'>
                      <table
                        className='min-w-full divide-y divide-gray-200'
                        {...props}
                      />
                    </div>
                  ),
                }}
              >
                {form.getValues('content')}
              </ReactMarkdown>
            </Card>
          </TabsContent>
        </Tabs>

        <div className='flex items-center justify-between'>
          <FormField
            control={form.control}
            name='isPublished'
            render={({ field }) => (
              <FormItem className='flex items-center space-x-2'>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className='space-y-1 leading-none'>
                  <FormLabel>Published</FormLabel>
                  <FormDescription>
                    Make this page visible to users.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <Button
            type='submit'
            size='lg'
            disabled={form.formState.isSubmitting}
            className={cn(
              'min-w-[150px]',
              form.formState.isSubmitting && 'opacity-50 cursor-not-allowed'
            )}
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Saving...
              </>
            ) : (
              `${type} Page`
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default WebPageForm
