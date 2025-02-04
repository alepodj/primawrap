import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ISettingInput } from '@/types'
import { TrashIcon } from 'lucide-react'
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
    <Card id={id}>
      <CardHeader>
        <CardTitle>Header Menus</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-4'>
          {fields.map((field, index) => (
            <div key={field.id} className='flex justify-between gap-2 w-full'>
              <FormField
                control={form.control}
                name={`headerMenus.${index}.name`}
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    {index === 0 && <FormLabel>Menu Name</FormLabel>}
                    <FormControl>
                      <Input {...field} placeholder='Menu Name' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`headerMenus.${index}.href`}
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    {index === 0 && <FormLabel>Menu URL</FormLabel>}
                    <FormControl>
                      <Input {...field} placeholder='Menu URL' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type='button'
                variant='outline'
                size='icon'
                className='self-end'
                onClick={() => remove(index)}
                title='Delete Menu'
              >
                <TrashIcon className='w-4 h-4' />
              </Button>
            </div>
          ))}
        </div>

        <Button
          type='button'
          variant='outline'
          onClick={() => append({ name: '', href: '' })}
        >
          Add Header Menu
        </Button>
      </CardContent>
    </Card>
  )
}
