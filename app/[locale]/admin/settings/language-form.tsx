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
import { Checkbox } from '@/components/ui/checkbox'
import { ISettingInput } from '@/types'
import { Languages, GripVertical, PlusCircle, TrashIcon } from 'lucide-react'
import { useEffect } from 'react'
import { useFieldArray, UseFormReturn } from 'react-hook-form'

export default function LanguageForm({
  form,
  id,
}: {
  form: UseFormReturn<ISettingInput>
  id: string
}) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'availableLanguages',
  })

  const defaultLanguage = form.watch('defaultLanguage')
  const languages = form.watch('availableLanguages')

  // Ensure there is always a default language selected
  useEffect(() => {
    if (languages?.length > 0 && !defaultLanguage && languages[0]?.code) {
      form.setValue('defaultLanguage', languages[0].code)
    }
  }, [languages, defaultLanguage, form])

  return (
    <Card id={id} className='transition-all duration-300 hover:shadow-md'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Languages className='w-5 h-5' />
          Site Languages
        </CardTitle>
        <CardDescription>
          Configure the languages available on your website
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
                    name={`availableLanguages.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        {index === 0 && <FormLabel>Language Name</FormLabel>}
                        <FormControl>
                          <Input
                            {...field}
                            placeholder='e.g., English, Français, Español'
                          />
                        </FormControl>
                        <FormDescription>
                          The display name of the language
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`availableLanguages.${index}.code`}
                    render={({ field }) => (
                      <FormItem>
                        {index === 0 && <FormLabel>Language Code</FormLabel>}
                        <FormControl>
                          <Input
                            {...field}
                            placeholder='e.g., en-US, fr-CA, es'
                          />
                        </FormControl>
                        <FormDescription>
                          The ISO language code (e.g., en-US)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='flex items-center space-x-4'>
                  <FormItem className='flex flex-row items-center space-x-3 space-y-0'>
                    <FormControl>
                      <Checkbox
                        checked={defaultLanguage === languages[index]?.code}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            form.setValue(
                              'defaultLanguage',
                              languages[index]?.code
                            )
                          } else if (
                            defaultLanguage === languages[index]?.code
                          ) {
                            // If unchecking the default, set the first available language as default
                            const firstAvailable = languages.find(
                              (l, i) => i !== index && l.code
                            )
                            form.setValue(
                              'defaultLanguage',
                              firstAvailable?.code || languages[0]?.code
                            )
                          }
                        }}
                        // Disable unchecking if this is the only language or the only one with a code
                        disabled={languages.filter((l) => l.code).length === 1}
                      />
                    </FormControl>
                    <div className='space-y-1 leading-none'>
                      <FormLabel>Default Language</FormLabel>
                      <FormDescription>
                        Set as the default language for new visitors
                      </FormDescription>
                    </div>
                  </FormItem>
                </div>
              </div>

              <Button
                type='button'
                variant='outline'
                size='icon'
                className='mt-8'
                onClick={() => {
                  if (defaultLanguage === languages[index]?.code) {
                    // If removing the default, set the first remaining language as default
                    const firstRemaining = languages.find(
                      (l, i) => i !== index && l.code
                    )
                    form.setValue('defaultLanguage', firstRemaining?.code || '')
                  }
                  remove(index)
                }}
                disabled={fields.length === 1}
                title={
                  fields.length === 1
                    ? 'Cannot remove last language'
                    : 'Remove language'
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
            onClick={() => append({ name: '', code: '' })}
          >
            <PlusCircle className='w-4 h-4 mr-2' />
            Add Language
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
