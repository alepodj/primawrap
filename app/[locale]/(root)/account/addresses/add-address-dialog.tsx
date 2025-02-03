'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { AddressForm } from './address-form'

interface AddAddressDialogProps {
  trigger: React.ReactNode
  addressCount: number
}

export function AddAddressDialog({
  trigger,
  addressCount,
}: AddAddressDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Address</DialogTitle>
        </DialogHeader>
        <AddressForm
          onSuccess={() => setOpen(false)}
          defaultIsDefault={addressCount === 0}
        />
      </DialogContent>
    </Dialog>
  )
}
