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
import { DollarSign, GripVertical, PlusCircle, TrashIcon } from 'lucide-react'
import { useEffect } from 'react'
import { useFieldArray, UseFormReturn } from 'react-hook-form'

export default function CurrencyForm({
  form,
  id,
}: {
  form: UseFormReturn<ISettingInput>
  id: string
}) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'availableCurrencies',
  })

  const defaultCurrency = form.watch('defaultCurrency')
  const currencies = form.watch('availableCurrencies')

  // Ensure there is always a default currency selected and handle exchange rate calculations
  useEffect(() => {
    if (currencies?.length > 0) {
      // If no default currency is set, set the first one as default
      if (!defaultCurrency && currencies[0]?.code) {
        form.setValue('defaultCurrency', currencies[0].code)
      }

      // When default currency changes, update exchange rates
      const defaultCurrencyIndex = currencies.findIndex(
        (c) => c.code === defaultCurrency
      )
      if (defaultCurrencyIndex !== -1) {
        const oldDefaultRate = currencies[defaultCurrencyIndex].convertRate

        // Set the new default currency's rate to 1
        form.setValue(
          `availableCurrencies.${defaultCurrencyIndex}.convertRate`,
          1
        )

        // Recalculate other currencies' rates relative to the new default
        currencies.forEach((currency, index) => {
          if (index !== defaultCurrencyIndex) {
            const newRate = currency.convertRate / oldDefaultRate
            form.setValue(
              `availableCurrencies.${index}.convertRate`,
              Number(newRate.toFixed(4))
            )
          }
        })
      }
    }
  }, [currencies, defaultCurrency, form])

  // Disable editing exchange rate for default currency
  const isDefaultCurrency = (index: number) =>
    currencies[index]?.code === defaultCurrency

  return (
    <Card id={id} className='transition-all duration-300 hover:shadow-md'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <DollarSign className='w-5 h-5' />
          Site Currencies
        </CardTitle>
        <CardDescription>
          Configure the currencies available for transactions
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
                    name={`availableCurrencies.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        {index === 0 && <FormLabel>Currency Name</FormLabel>}
                        <FormControl>
                          <Input
                            {...field}
                            placeholder='e.g., US Dollar, Euro, Canadian Dollar'
                          />
                        </FormControl>
                        <FormDescription>
                          The display name of the currency
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`availableCurrencies.${index}.code`}
                    render={({ field }) => (
                      <FormItem>
                        {index === 0 && <FormLabel>Currency Code</FormLabel>}
                        <FormControl>
                          <Input {...field} placeholder='e.g., USD, EUR, CAD' />
                        </FormControl>
                        <FormDescription>
                          The ISO currency code (e.g., USD)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='grid gap-6 md:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name={`availableCurrencies.${index}.symbol`}
                    render={({ field }) => (
                      <FormItem>
                        {index === 0 && <FormLabel>Currency Symbol</FormLabel>}
                        <FormControl>
                          <Input {...field} placeholder='e.g., $, €, £' />
                        </FormControl>
                        <FormDescription>
                          The symbol used to display prices
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`availableCurrencies.${index}.convertRate`}
                    render={({ field }) => (
                      <FormItem>
                        {index === 0 && <FormLabel>Exchange Rate</FormLabel>}
                        <FormControl>
                          <Input
                            type='number'
                            step='0.0001'
                            {...field}
                            disabled={isDefaultCurrency(index)}
                            placeholder='e.g., 1.0000'
                          />
                        </FormControl>
                        <FormDescription>
                          {isDefaultCurrency(index)
                            ? 'Base currency always has exchange rate of 1'
                            : 'Exchange rate relative to base currency'}
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
                        checked={defaultCurrency === currencies[index]?.code}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            form.setValue(
                              'defaultCurrency',
                              currencies[index]?.code
                            )
                          } else if (
                            defaultCurrency === currencies[index]?.code
                          ) {
                            // If unchecking the default, set the first available currency as default
                            const firstAvailable = currencies.find(
                              (c, i) => i !== index && c.code
                            )
                            form.setValue(
                              'defaultCurrency',
                              firstAvailable?.code || currencies[0]?.code
                            )
                          }
                        }}
                        // Disable unchecking if this is the only currency or the only one with a code
                        disabled={currencies.filter((c) => c.code).length === 1}
                      />
                    </FormControl>
                    <div className='space-y-1 leading-none'>
                      <FormLabel>Default Currency</FormLabel>
                      <FormDescription>
                        Set as the default currency for new visitors
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
                  if (defaultCurrency === currencies[index]?.code) {
                    // If removing the default, set the first remaining currency as default
                    const firstRemaining = currencies.find(
                      (c, i) => i !== index && c.code
                    )
                    form.setValue('defaultCurrency', firstRemaining?.code || '')
                  }
                  remove(index)
                }}
                disabled={fields.length === 1}
                title={
                  fields.length === 1
                    ? 'Cannot remove last currency'
                    : 'Remove currency'
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
              append({ name: '', code: '', symbol: '', convertRate: 1 })
            }
          >
            <PlusCircle className='w-4 h-4 mr-2' />
            Add Currency
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
