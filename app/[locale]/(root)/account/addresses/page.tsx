import { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/auth'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { AddressCard } from './address-card'
import { getUserById } from '@/lib/actions/user.actions'
import { redirect } from 'next/navigation'
import { AddAddressDialog } from './add-address-dialog'

const PAGE_TITLE = 'Your Addresses'
export const metadata: Metadata = {
  title: PAGE_TITLE,
}

export default async function AddressesPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/sign-in')
  }

  const user = await getUserById(session.user.id)
  // Sort addresses to show default first
  const addresses = (user?.addresses || []).sort((a, b) => {
    if (a.isDefault) return -1
    if (b.isDefault) return 1
    return 0
  })

  const addButton = (
    <Button>
      <Plus className='w-4 h-4 mr-2' />
      Add Address
    </Button>
  )

  const addCard = (
    <div className='border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-muted-foreground hover:text-primary hover:border-primary cursor-pointer transition-colors'>
      <Plus className='w-8 h-8 mb-2' />
      <span>Add New Address</span>
    </div>
  )

  return (
    <div className='mb-24'>
      <SessionProvider session={session}>
        <div className='flex justify-between items-center'>
          <div className='flex gap-2'>
            <Link href='/account'>Your Account</Link>
            <span>›</span>
            <span>{PAGE_TITLE}</span>
          </div>
          <AddAddressDialog
            trigger={addButton}
            addressCount={addresses.length}
          />
        </div>

        <h1 className='h1-bold py-4'>{PAGE_TITLE}</h1>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {addresses.map((address) => (
            <AddressCard
              key={address._id.toString()}
              address={address}
              addressCount={addresses.length}
            />
          ))}

          <AddAddressDialog trigger={addCard} addressCount={addresses.length} />
        </div>
      </SessionProvider>
    </div>
  )
}
