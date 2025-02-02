'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useRouter } from 'next/navigation'

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
import { useToast } from '@/hooks/use-toast'
import { updateUserPhone } from '@/lib/actions/user.actions'
import { UserPhoneSchema } from '@/lib/validator'

export const PhoneForm = () => {
  const router = useRouter()
  const { data: session, update } = useSession()
  const form = useForm<z.infer<typeof UserPhoneSchema>>({
    resolver: zodResolver(UserPhoneSchema),
    defaultValues: {
      phone: session?.user?.phone ?? '',
    },
  })
  const { toast } = useToast()

  async function onSubmit(values: z.infer<typeof UserPhoneSchema>) {
    const res = await updateUserPhone(values)
    if (!res.success)
      return toast({
        variant: 'destructive',
        description: res.message,
      })

    const { data, message } = res
    const newSession = {
      ...session,
      user: {
        ...session?.user,
        phone: data.phone,
      },
    }
    await update(newSession)
    toast({
      description: message,
    })
    router.push('/account/manage')
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col gap-5'
      >
        <div className='flex flex-col gap-5'>
          <FormField
            control={form.control}
            name='phone'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel className='font-bold'>New phone number</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Phone number'
                    {...field}
                    className='input-field'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type='submit'
          size='lg'
          disabled={form.formState.isSubmitting}
          className='button col-span-2 w-full'
        >
          {form.formState.isSubmitting ? 'Submitting...' : 'Save Changes'}
        </Button>
      </form>
    </Form>
  )
}
