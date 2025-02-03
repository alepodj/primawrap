'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'
import { AddressSchema } from '@/lib/validator'
import { IAddressForm } from '@/types'
import { addAddress, updateAddress } from '@/lib/actions/user.actions'
import { IAddress } from '@/lib/db/models/user.model'

interface AddressFormProps {
  address?: IAddress
  onSuccess?: () => void
  defaultIsDefault?: boolean
}

export function AddressForm({
  address,
  onSuccess,
  defaultIsDefault,
}: AddressFormProps) {
  const t = useTranslations('Account')
  const { toast } = useToast()

  const form = useForm<IAddressForm>({
    resolver: zodResolver(AddressSchema),
    defaultValues: {
      fullName: address?.fullName || '',
      street: address?.street || '',
      city: address?.city || '',
      province: address?.province || '',
      postalCode: address?.postalCode || '',
      country: address?.country || '',
      phone: address?.phone || '',
      isDefault: Boolean(defaultIsDefault || address?.isDefault) || false,
    },
  })

  async function onSubmit(values: IAddressForm) {
    try {
      // For new addresses: force default if it's the first address
      // For existing addresses: allow changing to default but not removing default status
      const addressData = {
        ...values,
        isDefault: address
          ? address.isDefault || values.isDefault
          : defaultIsDefault || values.isDefault,
      }

      const res = address
        ? await updateAddress({ ...addressData, _id: address._id })
        : await addAddress(addressData)

      if (!res.success) {
        return toast({
          variant: 'destructive',
          description: res.message,
        })
      }

      toast({
        description: res.message,
      })

      if (onSuccess) {
        onSuccess()
      }
    } catch {
      toast({
        variant: 'destructive',
        description: 'Something went wrong. Please try again.',
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='fullName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('Full Name')}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='street'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('Street Address')}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='grid grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='city'
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('City')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='province'
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('Province')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='postalCode'
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('Postal Code')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='country'
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('Country')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name='phone'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('Phone')}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='isDefault'
          render={({ field }) => (
            <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
              <FormControl>
                <Checkbox
                  checked={Boolean(
                    defaultIsDefault || address?.isDefault || field.value
                  )}
                  onCheckedChange={field.onChange}
                  disabled={Boolean(defaultIsDefault || address?.isDefault)}
                />
              </FormControl>
              <div className='space-y-1 leading-none'>
                <FormLabel>{t('Set as default address')}</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <Button
          type='submit'
          className='w-full'
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting
            ? t('Saving')
            : address
              ? t('Update Address')
              : t('Add Address')}
        </Button>
      </form>
    </Form>
  )
}
