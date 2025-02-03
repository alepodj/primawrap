'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { IAddress } from '@/lib/db/models/user.model'
import { deleteAddress, setDefaultAddress } from '@/lib/actions/user.actions'
import { AddressForm } from './address-form'

interface AddressCardProps {
  address: IAddress
  addressCount: number
}

export function AddressCard({ address, addressCount }: AddressCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const t = useTranslations('Account')
  const { toast } = useToast()

  const handleDelete = async () => {
    try {
      const res = await deleteAddress(address._id)
      if (!res.success) {
        return toast({
          variant: 'destructive',
          description: res.message,
        })
      }

      toast({
        description: res.message,
      })
      setIsDeleteOpen(false)
    } catch (error) {
      toast({
        variant: 'destructive',
        description: 'Something went wrong. Please try again.',
      })
    }
  }

  const handleSetDefault = async () => {
    try {
      const res = await setDefaultAddress(address._id)
      if (!res.success) {
        return toast({
          variant: 'destructive',
          description: res.message,
        })
      }

      toast({
        description: res.message,
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        description: 'Something went wrong. Please try again.',
      })
    }
  }

  return (
    <Card>
      <CardContent className='p-6'>
        <div className='flex justify-between items-start mb-4'>
          <div>
            <h3 className='font-bold text-lg'>{address.fullName}</h3>
            {address.isDefault && (
              <Badge variant='secondary' className='mt-1'>
                {t('Default')}
              </Badge>
            )}
          </div>
          <div className='flex gap-2'>
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogTrigger asChild>
                <Button variant='outline' size='sm'>
                  {t('Edit')}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('Edit Address')}</DialogTitle>
                </DialogHeader>
                <AddressForm
                  address={address}
                  addressCount={addressCount}
                  onSuccess={() => setIsEditOpen(false)}
                />
              </DialogContent>
            </Dialog>

            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
              <AlertDialogTrigger asChild>
                <Button variant='destructive' size='sm'>
                  {t('Delete')}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('Delete Address')}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t('Are you sure you want to delete this address?')}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t('Cancel')}</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                  >
                    {t('Delete')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className='space-y-1 text-sm'>
          <p>{address.street}</p>
          <p>
            {address.city}, {address.province} {address.postalCode}
          </p>
          <p>{address.country}</p>
          <p className='mt-2'>{address.phone}</p>
        </div>

        {!address.isDefault && (
          <Button
            variant='secondary'
            className='mt-4 w-full'
            onClick={handleSetDefault}
          >
            {t('Set as Default')}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
