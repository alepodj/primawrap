'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { deleteAccount } from '@/lib/actions/user.actions'
import { DeleteAccountSchema } from '@/lib/validator'
import { DeleteAccountForm as DeleteAccountFormType } from '@/types'

export function DeleteAccountForm() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const form = useForm<DeleteAccountFormType>({
    resolver: zodResolver(DeleteAccountSchema),
    defaultValues: {
      password: '',
    },
  })

  async function onSubmit(values: DeleteAccountFormType) {
    try {
      const res = await deleteAccount(values.password)
      if (!res.success) {
        return toast({
          variant: 'destructive',
          description: res.message,
        })
      }

      setIsOpen(false)
      toast({
        description: 'Your account has been deleted successfully.',
      })
      router.push('/')
    } catch {
      toast({
        variant: 'destructive',
        description: 'Something went wrong. Please try again.',
      })
    }
  }

  return (
    <div className='mt-8'>
      <h2 className='text-xl font-bold text-destructive mb-2'>Danger Zone</h2>
      <Card className='border-destructive'>
        <div className='p-4 flex justify-between flex-wrap'>
          <div>
            <h3 className='font-bold'>Delete Account</h3>
            <p className='text-sm text-muted-foreground'>
              Once you delete your account, there is no going back. Please be
              certain.
            </p>
          </div>
          <div>
            <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
              <AlertDialogTrigger asChild>
                <Button className='rounded-full w-32' variant='destructive'>
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Account</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className='py-4'>
                  <div className='space-y-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='password'>
                        Please enter your password to confirm
                      </Label>
                      <Input
                        id='password'
                        type='password'
                        placeholder='Enter your password'
                        {...form.register('password')}
                      />
                      {form.formState.errors.password && (
                        <p className='text-sm text-destructive'>
                          {form.formState.errors.password.message}
                        </p>
                      )}
                    </div>
                  </div>
                </form>
                <AlertDialogFooter>
                  <AlertDialogAction asChild>
                    <Button
                      type='button'
                      variant='ghost'
                      onClick={() => setIsOpen(false)}
                    >
                      Cancel
                    </Button>
                  </AlertDialogAction>
                  <AlertDialogAction asChild>
                    <Button
                      type='submit'
                      variant='destructive'
                      onClick={form.handleSubmit(onSubmit)}
                      disabled={form.formState.isSubmitting}
                    >
                      {form.formState.isSubmitting
                        ? 'Deleting...'
                        : 'Delete Account'}
                    </Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </Card>
    </div>
  )
}
