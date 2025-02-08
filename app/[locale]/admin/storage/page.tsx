import { Metadata } from 'next'
import { listFiles } from '@/lib/actions/storage.actions'
import StorageHeader from './components/storage-header'
import StorageGrid from './components/storage-grid'
import StorageBreadcrumb from './components/storage-breadcrumb'
import { getTranslations } from 'next-intl/server'

export const metadata: Metadata = {
  title: 'Storage Management',
}

export default async function StoragePage({
  searchParams,
}: {
  searchParams: Promise<{ path?: string }>
}) {
  const t = await getTranslations('Locale')
  const params = await searchParams
  const currentPath = params.path || ''
  const { files, folders, error } = await listFiles(currentPath)

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col gap-4'>
        <h1 className='text-3xl font-bold tracking-tight'>
          {t('Storage Management')}
        </h1>
        <StorageHeader currentPath={currentPath} />
      </div>

      <StorageBreadcrumb currentPath={currentPath} />

      <StorageGrid
        files={files || []}
        folders={folders || []}
        currentPath={currentPath}
        error={error}
      />
    </div>
  )
}
