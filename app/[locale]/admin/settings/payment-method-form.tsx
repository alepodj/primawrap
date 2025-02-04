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
import { CreditCard, GripVertical, PlusCircle, TrashIcon } from 'lucide-react'
import { useEffect } from 'react'
import { useFieldArray, UseFormReturn } from 'react-hook-form'

export default function PaymentMethodForm({
  form,
  id,
}: {
  form: UseFormReturn<ISettingInput>
  id: string
}) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'availablePaymentMethods',
  })

  const defaultPaymentMethod = form.watch('defaultPaymentMethod')
  const paymentMethods = form.watch('availablePaymentMethods')

  // Ensure there is always a default payment method selected
  useEffect(() => {
    if (
      paymentMethods?.length > 0 &&
      !defaultPaymentMethod &&
      paymentMethods[0]?.name
    ) {
      form.setValue('defaultPaymentMethod', paymentMethods[0].name)
    }
  }, [paymentMethods, defaultPaymentMethod, form])

  return (
    <Card id={id} className='transition-all duration-300 hover:shadow-md'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <CreditCard className='w-5 h-5' />
          Payment Methods
        </CardTitle>
        <CardDescription>
          Configure the payment methods available for transactions
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
                    name={`availablePaymentMethods.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        {index === 0 && <FormLabel>Method Name</FormLabel>}
                        <FormControl>
                          <Input
                            {...field}
                            placeholder='e.g., Credit Card, PayPal, Bank Transfer'
                          />
                        </FormControl>
                        <FormDescription>
                          The display name of the payment method
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`availablePaymentMethods.${index}.commission`}
                    render={({ field }) => (
                      <FormItem>
                        {index === 0 && (
                          <FormLabel>Commission Rate (%)</FormLabel>
                        )}
                        <FormControl>
                          <Input
                            type='number'
                            step='0.01'
                            {...field}
                            placeholder='e.g., 2.9'
                          />
                        </FormControl>
                        <FormDescription>
                          Transaction fee percentage for this method
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
                          defaultPaymentMethod === paymentMethods[index]?.name
                        }
                        onCheckedChange={(checked) => {
                          if (checked) {
                            form.setValue(
                              'defaultPaymentMethod',
                              paymentMethods[index]?.name
                            )
                          } else if (
                            defaultPaymentMethod === paymentMethods[index]?.name
                          ) {
                            // If unchecking the default, set the first available method as default
                            const firstAvailable = paymentMethods.find(
                              (m, i) => i !== index && m.name
                            )
                            form.setValue(
                              'defaultPaymentMethod',
                              firstAvailable?.name || paymentMethods[0]?.name
                            )
                          }
                        }}
                        // Disable unchecking if this is the only method or the only one with a name
                        disabled={
                          paymentMethods.filter((m) => m.name).length === 1
                        }
                      />
                    </FormControl>
                    <div className='space-y-1 leading-none'>
                      <FormLabel>Default Method</FormLabel>
                      <FormDescription>
                        Set as the default payment method at checkout
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
                  if (defaultPaymentMethod === paymentMethods[index]?.name) {
                    // If removing the default, set the first remaining method as default
                    const firstRemaining = paymentMethods.find(
                      (m, i) => i !== index && m.name
                    )
                    form.setValue(
                      'defaultPaymentMethod',
                      firstRemaining?.name || ''
                    )
                  }
                  remove(index)
                }}
                disabled={fields.length === 1}
                title={
                  fields.length === 1
                    ? 'Cannot remove last payment method'
                    : 'Remove payment method'
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
            onClick={() => append({ name: '', commission: 0 })}
          >
            <PlusCircle className='w-4 h-4 mr-2' />
            Add Payment Method
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
