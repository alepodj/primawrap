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
import { toast } from '@/hooks/use-toast'
import { UploadButton } from '@/lib/uploadthing'
import { ISettingInput } from '@/types'
import { ImageIcon, PlusCircle, GripVertical, TrashIcon } from 'lucide-react'
import Image from 'next/image'
import { useFieldArray, UseFormReturn } from 'react-hook-form'

export default function CarouselForm({
  form,
  id,
}: {
  form: UseFormReturn<ISettingInput>
  id: string
}) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'carousels',
  })
  const { watch } = form

  return (
    <Card id={id} className='transition-all duration-300 hover:shadow-md'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <ImageIcon className='w-5 h-5' />
          Homepage Carousel
        </CardTitle>
        <CardDescription>
          Manage the sliding banners that appear on your homepage
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='space-y-6'>
          {fields.map((field, index) => (
            <div
              key={field.id}
              className='flex gap-4 p-6 rounded-lg border bg-card hover:shadow-sm transition-all duration-200'
            >
              <div className='mt-2 text-muted-foreground'>
                <GripVertical className='w-5 h-5' />
              </div>
              <div className='flex-1 space-y-6'>
                <div className='grid gap-6 md:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name={`carousels.${index}.title`}
                    render={({ field }) => (
                      <FormItem>
                        {index === 0 && <FormLabel>Slide Title</FormLabel>}
                        <FormControl>
                          <Input
                            {...field}
                            placeholder='Enter slide heading text'
                          />
                        </FormControl>
                        <FormDescription>
                          Main heading text displayed on the slide
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`carousels.${index}.url`}
                    render={({ field }) => (
                      <FormItem>
                        {index === 0 && <FormLabel>Click URL</FormLabel>}
                        <FormControl>
                          <Input
                            {...field}
                            placeholder='Enter destination URL'
                          />
                        </FormControl>
                        <FormDescription>
                          Where users will go when clicking this slide
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='grid gap-6 md:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name={`carousels.${index}.buttonCaption`}
                    render={({ field }) => (
                      <FormItem>
                        {index === 0 && <FormLabel>Button Text</FormLabel>}
                        <FormControl>
                          <Input
                            {...field}
                            placeholder='e.g., Shop Now, Learn More'
                          />
                        </FormControl>
                        <FormDescription>
                          Text displayed on the call-to-action button
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className='space-y-4'>
                    <FormField
                      control={form.control}
                      name={`carousels.${index}.image`}
                      render={({ field }) => (
                        <FormItem>
                          {index === 0 && <FormLabel>Slide Image</FormLabel>}
                          <FormControl>
                            <Input
                              placeholder='Image URL or upload below'
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Recommended size: 1920x720px, max 2MB
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {watch(`carousels.${index}.image`) ? (
                      <div className='relative aspect-[16/6] rounded-lg overflow-hidden bg-muted'>
                        <Image
                          src={watch(`carousels.${index}.image`)}
                          alt='Slide preview'
                          fill
                          className='object-cover'
                        />
                        <Button
                          type='button'
                          variant='outline'
                          size='sm'
                          className='absolute top-2 right-2'
                          onClick={() =>
                            form.setValue(`carousels.${index}.image`, '')
                          }
                        >
                          <TrashIcon className='w-4 h-4 mr-2' />
                          Remove Image
                        </Button>
                      </div>
                    ) : (
                      <UploadButton
                        className='w-full ut-button:w-full ut-button:bg-primary ut-button:text-primary-foreground ut-button:hover:bg-primary/90'
                        endpoint='imageUploader'
                        onClientUploadComplete={(res) => {
                          form.setValue(`carousels.${index}.image`, res[0].url)
                          toast({
                            description: 'Slide image uploaded successfully',
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
                </div>
              </div>

              <Button
                type='button'
                variant='outline'
                size='icon'
                className='mt-8'
                onClick={() => remove(index)}
                disabled={fields.length === 1}
                title={
                  fields.length === 1
                    ? 'Cannot remove last slide'
                    : 'Remove slide'
                }
              >
                <TrashIcon className='w-4 h-4' />
              </Button>
            </div>
          ))}

          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() =>
              append({ url: '', title: '', image: '', buttonCaption: '' })
            }
          >
            <PlusCircle className='w-4 h-4 mr-2' />
            Add Carousel Slide
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
