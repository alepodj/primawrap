/* eslint-disable @next/next/no-img-element */
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'
import { UploadButton } from '@/lib/uploadthing'
import { ISettingInput } from '@/types'
import { TrashIcon, ImageIcon } from 'lucide-react'
import React from 'react'
import { UseFormReturn } from 'react-hook-form'

export default function SiteInfoForm({
  form,
  id,
}: {
  form: UseFormReturn<ISettingInput>
  id: string
}) {
  const { watch, control } = form

  const siteLogo = watch('site.logo')
  return (
    <Card id={id} className='transition-all duration-300 hover:shadow-md'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <ImageIcon className='w-5 h-5' />
          Site Information
        </CardTitle>
        <CardDescription>
          Configure your site&apos;s basic information and branding
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='flex flex-col gap-6 md:flex-row'>
          <FormField
            control={control}
            name='site.name'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Site Name</FormLabel>
                <FormControl>
                  <Input placeholder='Enter your site name' {...field} />
                </FormControl>
                <FormDescription>
                  The name that appears in the browser title and throughout your
                  site
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name='site.url'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Site URL</FormLabel>
                <FormControl>
                  <Input placeholder='https://example.com' {...field} />
                </FormControl>
                <FormDescription>
                  The main URL where your site is hosted
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex flex-col gap-6 md:flex-row'>
          <div className='w-full space-y-4'>
            <FormField
              control={control}
              name='site.logo'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel>Site Logo</FormLabel>
                  <FormControl>
                    <Input placeholder='Logo URL or upload below' {...field} />
                  </FormControl>
                  <FormDescription>
                    Recommended size: 200x50px, max 1MB
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {siteLogo ? (
              <div className='flex items-center gap-4 p-4 bg-muted/50 rounded-lg'>
                <img
                  src={siteLogo}
                  alt='Site logo preview'
                  className='max-w-[200px] h-auto object-contain'
                />
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => form.setValue('site.logo', '')}
                >
                  <TrashIcon className='w-4 h-4 mr-2' />
                  Remove Logo
                </Button>
              </div>
            ) : (
              <UploadButton
                className='w-full ut-button:w-full ut-button:bg-primary ut-button:text-primary-foreground ut-button:hover:bg-primary/90'
                endpoint='imageUploader'
                onClientUploadComplete={(res) => {
                  form.setValue('site.logo', res[0].url)
                  toast({
                    description: 'Logo uploaded successfully',
                  })
                }}
                onUploadError={(error: Error) => {
                  toast({
                    variant: 'destructive',
                    description: `Upload failed: ${error.message}`,
                  })
                }}
              />
            )}
          </div>
          <FormField
            control={control}
            name='site.description'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Site Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Enter a brief description of your site'
                    className='h-40 resize-none'
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This description appears in search results and social media
                  shares
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex flex-col gap-6 md:flex-row'>
          <FormField
            control={control}
            name='site.slogan'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Site Slogan</FormLabel>
                <FormControl>
                  <Input placeholder='Enter your site slogan' {...field} />
                </FormControl>
                <FormDescription>
                  A short, catchy phrase that represents your brand
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='site.keywords'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Meta Keywords</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Enter keywords, separated by commas'
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Keywords help with SEO and site categorization
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex flex-col gap-6 md:flex-row'>
          <FormField
            control={control}
            name='site.phone'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Contact Phone</FormLabel>
                <FormControl>
                  <Input placeholder='Enter contact phone number' {...field} />
                </FormControl>
                <FormDescription>
                  Primary contact number for customer support
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='site.email'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Contact Email</FormLabel>
                <FormControl>
                  <Input placeholder='Enter contact email address' {...field} />
                </FormControl>
                <FormDescription>
                  Primary email for customer inquiries
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex flex-col gap-6 md:flex-row'>
          <FormField
            control={control}
            name='site.address'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Business Address</FormLabel>
                <FormControl>
                  <Input placeholder='Enter business address' {...field} />
                </FormControl>
                <FormDescription>
                  Physical location or mailing address
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='site.copyright'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Copyright Notice</FormLabel>
                <FormControl>
                  <Input placeholder='Enter copyright text' {...field} />
                </FormControl>
                <FormDescription>
                  Appears in the footer of your site
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  )
}
