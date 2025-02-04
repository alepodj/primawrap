/* eslint-disable react-hooks/exhaustive-deps */
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
import { Truck, GripVertical, PlusCircle, TrashIcon } from 'lucide-react'
import React, { useEffect } from 'react'
import { useFieldArray, UseFormReturn } from 'react-hook-form'
import { Checkbox } from '@/components/ui/checkbox'

export default function DeliveryDateForm({
  form,
  id,
}: {
  form: UseFormReturn<ISettingInput>
  id: string
}) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'availableDeliveryDates',
  })
  const { setValue, watch } = form

  const availableDeliveryDates = watch('availableDeliveryDates')
  const defaultDeliveryDate = watch('defaultDeliveryDate')

  useEffect(() => {
    const validCodes = availableDeliveryDates.map((lang) => lang.name)
    if (!validCodes.includes(defaultDeliveryDate)) {
      setValue('defaultDeliveryDate', '')
    }
  }, [JSON.stringify(availableDeliveryDates)])

  return (
    <Card id={id} className='transition-all duration-300 hover:shadow-md'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Truck className='w-5 h-5' />
          Delivery Options
        </CardTitle>
        <CardDescription>
          Configure delivery timeframes and shipping rates
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
                    name={`availableDeliveryDates.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        {index === 0 && <FormLabel>Delivery Option</FormLabel>}
                        <FormControl>
                          <Input
                            {...field}
                            placeholder='e.g., Standard Delivery, Express Shipping'
                          />
                        </FormControl>
                        <FormDescription>
                          The name of this delivery option
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`availableDeliveryDates.${index}.daysToDeliver`}
                    render={({ field: { onChange, value, ...field } }) => (
                      <FormItem>
                        {index === 0 && <FormLabel>Delivery Days</FormLabel>}
                        <FormControl>
                          <Input
                            type='number'
                            min='1'
                            {...field}
                            value={value ?? ''}
                            onChange={(e) => {
                              const val = e.target.value
                              onChange(val ? Number(val) : 1)
                            }}
                            placeholder='e.g., 3-5 business days'
                          />
                        </FormControl>
                        <FormDescription>
                          Estimated delivery time in business days
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='grid gap-6 md:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name={`availableDeliveryDates.${index}.shippingPrice`}
                    render={({ field: { onChange, value, ...field } }) => (
                      <FormItem>
                        {index === 0 && <FormLabel>Shipping Price</FormLabel>}
                        <FormControl>
                          <Input
                            type='number'
                            step='0.01'
                            min='0'
                            {...field}
                            value={value ?? ''}
                            onChange={(e) => {
                              const val = e.target.value
                              onChange(val ? Number(val) : 0)
                            }}
                            placeholder='e.g., 9.99'
                          />
                        </FormControl>
                        <FormDescription>
                          Base shipping cost for this option
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`availableDeliveryDates.${index}.freeShippingMinPrice`}
                    render={({ field: { onChange, value, ...field } }) => (
                      <FormItem>
                        {index === 0 && (
                          <FormLabel>Free Shipping Threshold</FormLabel>
                        )}
                        <FormControl>
                          <Input
                            type='number'
                            step='0.01'
                            min='0'
                            {...field}
                            value={value ?? ''}
                            onChange={(e) => {
                              const val = e.target.value
                              onChange(val ? Number(val) : 0)
                            }}
                            placeholder='e.g., 50.00'
                          />
                        </FormControl>
                        <FormDescription>
                          Minimum order amount for free shipping (0 for no free
                          shipping)
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
                        checked={
                          defaultDeliveryDate ===
                          availableDeliveryDates[index]?.name
                        }
                        onCheckedChange={(checked) => {
                          if (checked) {
                            form.setValue(
                              'defaultDeliveryDate',
                              availableDeliveryDates[index]?.name
                            )
                          } else if (
                            defaultDeliveryDate ===
                            availableDeliveryDates[index]?.name
                          ) {
                            // If unchecking the default, set the first available delivery date as default
                            const firstAvailable = availableDeliveryDates.find(
                              (d, i) => i !== index && d.name
                            )
                            form.setValue(
                              'defaultDeliveryDate',
                              firstAvailable?.name ||
                                availableDeliveryDates[0]?.name
                            )
                          }
                        }}
                        // Disable unchecking if this is the only delivery date or the only one with a name
                        disabled={
                          availableDeliveryDates.filter((d) => d.name)
                            .length === 1
                        }
                      />
                    </FormControl>
                    <div className='space-y-1 leading-none'>
                      <FormLabel>Default Option</FormLabel>
                      <FormDescription>
                        Set as the default delivery option at checkout
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
                  if (
                    defaultDeliveryDate === availableDeliveryDates[index]?.name
                  ) {
                    // If removing the default, set the first remaining delivery date as default
                    const firstRemaining = availableDeliveryDates.find(
                      (d, i) => i !== index && d.name
                    )
                    form.setValue(
                      'defaultDeliveryDate',
                      firstRemaining?.name || ''
                    )
                  }
                  remove(index)
                }}
                disabled={fields.length === 1}
                title={
                  fields.length === 1
                    ? 'Cannot remove last delivery option'
                    : 'Remove delivery option'
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
              append({
                name: '',
                daysToDeliver: 1,
                shippingPrice: 0,
                freeShippingMinPrice: 0,
              })
            }
          >
            <PlusCircle className='w-4 h-4 mr-2' />
            Add Delivery Option
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
