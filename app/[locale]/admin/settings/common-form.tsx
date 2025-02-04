import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { COLORS, THEMES } from '@/lib/constants'
import { ISettingInput } from '@/types'
import { Settings2 } from 'lucide-react'
import React from 'react'
import { UseFormReturn } from 'react-hook-form'

export default function CommonForm({
  form,
  id,
}: {
  form: UseFormReturn<ISettingInput>
  id: string
}) {
  const { control } = form

  return (
    <Card id={id} className='transition-all duration-300 hover:shadow-md'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Settings2 className='w-5 h-5' />
          Common Settings
        </CardTitle>
        <CardDescription>
          Configure general settings that apply across your site
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='flex flex-col gap-6 md:flex-row'>
          <FormField
            control={control}
            name='common.pageSize'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Default Page Size</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    min='1'
                    placeholder='Enter items per page'
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Number of items to display per page in lists and grids
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='common.freeShippingMinPrice'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Free Shipping Threshold</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    min='0'
                    step='0.01'
                    placeholder='Enter minimum amount for free shipping'
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Minimum order amount to qualify for free shipping
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex flex-col gap-6 md:flex-row'>
          <FormField
            control={control}
            name='common.defaultColor'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Default Theme Color</FormLabel>
                <FormControl>
                  <Select
                    value={field.value || ''}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Choose a default color theme' />
                    </SelectTrigger>
                    <SelectContent>
                      {COLORS.map((color, index) => (
                        <SelectItem key={index} value={color}>
                          {color}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>
                  Primary color scheme used throughout the site
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='common.defaultTheme'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Default Display Theme</FormLabel>
                <FormControl>
                  <Select
                    value={field.value || ''}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Choose light or dark mode' />
                    </SelectTrigger>
                    <SelectContent>
                      {THEMES.map((theme, index) => (
                        <SelectItem key={index} value={theme}>
                          {theme}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>
                  Default light/dark mode setting for new visitors
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='border-t pt-6'>
          <FormField
            control={control}
            name='common.isMaintenanceMode'
            render={({ field }) => (
              <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className='space-y-1 leading-none'>
                  <FormLabel>Maintenance Mode</FormLabel>
                  <FormDescription>
                    When enabled, the site will display a maintenance message to
                    visitors
                  </FormDescription>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  )
}
