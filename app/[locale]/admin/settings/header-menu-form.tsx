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
import { ISettingInput } from '@/types'
import { Menu, PlusCircle, GripVertical, TrashIcon } from 'lucide-react'
import { useFieldArray, UseFormReturn } from 'react-hook-form'

export default function HeaderMenuForm({
  form,
  id,
}: {
  form: UseFormReturn<ISettingInput>
  id: string
}) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'headerMenus',
  })

  return (
    <Card id={id} className="transition-all duration-300 hover:shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Menu className="w-5 h-5" />
          Header Menu Items
        </CardTitle>
        <CardDescription>
          Configure the navigation menu items that appear in your site&apos;s header
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='space-y-4'>
          {fields.map((field, index) => (
            <div
              key={field.id}
              className='flex items-start gap-4 p-4 rounded-lg border bg-card hover:shadow-sm transition-all duration-200'
            >
              <div className='mt-2 text-muted-foreground'>
                <GripVertical className='w-5 h-5' />
              </div>
              <div className='flex-1 grid gap-4 md:grid-cols-2'>
                <FormField
                  control={form.control}
                  name={`headerMenus.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      {index === 0 && <FormLabel>Menu Label</FormLabel>}
                      <FormControl>
                        <Input {...field} placeholder='e.g., About Us, Products' />
                      </FormControl>
                      <FormDescription>
                        Text displayed in the navigation menu
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`headerMenus.${index}.href`}
                  render={({ field }) => (
                    <FormItem>
                      {index === 0 && <FormLabel>Menu URL</FormLabel>}
                      <FormControl>
                        <Input {...field} placeholder='e.g., /about, /products' />
                      </FormControl>
                      <FormDescription>
                        The page URL this menu item links to
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type='button'
                variant='outline'
                size='icon'
                className='mt-8'
                onClick={() => remove(index)}
                disabled={fields.length === 1}
                title={fields.length === 1 ? 'Cannot remove last menu item' : 'Remove menu item'}
              >
                <TrashIcon className='w-4 h-4' />
              </Button>
            </div>
          ))}

          <Button
            type='button'
            variant='outline'
            size='sm'
            className='mt-2'
            onClick={() => append({ name: '', href: '' })}
          >
            <PlusCircle className='w-4 h-4 mr-2' />
            Add Menu Item
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
