import { auth } from '@/auth'
import { SessionProvider } from 'next-auth/react'
import MaintenanceContent from './maintenance-content'

export default async function MaintenancePage() {
  const session = await auth()

  return (
    <SessionProvider session={session}>
      <MaintenanceContent />
    </SessionProvider>
  )
}
