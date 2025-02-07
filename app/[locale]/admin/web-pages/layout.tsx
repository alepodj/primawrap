import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Web Pages',
}

export default function WebPagesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
