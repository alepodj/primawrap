'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { useToast } from '@/hooks/use-toast'
import { SettingInputSchema } from '@/lib/validator'
import { ClientSetting, ISettingInput } from '@/types'
import { updateSetting } from '@/lib/actions/setting.actions'
import useSetting from '@/hooks/use-setting-store'
import LanguageForm from './language-form'
import CurrencyForm from './currency-form'
import PaymentMethodForm from './payment-method-form'
import DeliveryDateForm from './delivery-date-form'
import SiteInfoForm from './site-info-form'
import CommonForm from './common-form'
import CarouselForm from './carousel-form'
import HeaderMenuForm from './header-menu-form'

export default function SettingForm({ setting }: { setting: ISettingInput }) {
  const { setSetting } = useSetting()

  const form = useForm<ISettingInput>({
    resolver: zodResolver(SettingInputSchema),
    defaultValues: setting,
  })
  const {
    formState: { isSubmitting },
  } = form

  const { toast } = useToast()
  async function onSubmit(values: ISettingInput) {
    const res = await updateSetting({ ...values })
    if (!res.success) {
      toast({
        variant: 'destructive',
        description: res.message,
      })
    } else {
      toast({
        description: res.message,
      })
      setSetting(values as ClientSetting)
    }
  }

  return (
    <Form {...form}>
      <form
        className='relative space-y-6'
        method='post'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className='space-y-6'>
          <SiteInfoForm id='setting-site-info' form={form} />
          <CommonForm id='setting-common' form={form} />
          <HeaderMenuForm id='setting-header-menus' form={form} />
          <CarouselForm id='setting-carousels' form={form} />
          <LanguageForm id='setting-languages' form={form} />
          <CurrencyForm id='setting-currencies' form={form} />
          <PaymentMethodForm id='setting-payment-methods' form={form} />
          <DeliveryDateForm id='setting-delivery-dates' form={form} />
        </div>
        <div className='fixed bottom-0 right-0 left-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 border-t'>
          <div className='max-w-7xl mx-auto px-4'>
            <div className='flex justify-end py-4'>
              <Button
                type='submit'
                size='lg'
                disabled={isSubmitting}
                className='min-w-[200px]'
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
        <div className='h-24' /> {/* Spacer for fixed button */}
      </form>
    </Form>
  )
}
