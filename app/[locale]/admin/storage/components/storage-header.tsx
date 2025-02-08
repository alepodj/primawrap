'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, FolderPlus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import UploadModal from './upload-modal'
import FolderModal from './folder-modal'

interface StorageHeaderProps {
  currentPath: string
}

export default function StorageHeader({ currentPath }: StorageHeaderProps) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false)
  const t = useTranslations('Locale')

  return (
    <div className='flex items-center gap-4'>
      <Button onClick={() => setIsUploadModalOpen(true)} className='gap-2'>
        <Upload className='h-4 w-4' />
        {t('Upload Files')}
      </Button>

      <Button
        variant='outline'
        className='gap-2'
        onClick={() => setIsFolderModalOpen(true)}
      >
        <FolderPlus className='h-4 w-4' />
        {t('New Folder')}
      </Button>

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        currentPath={currentPath}
      />

      <FolderModal
        isOpen={isFolderModalOpen}
        onClose={() => setIsFolderModalOpen(false)}
        currentPath={currentPath}
      />
    </div>
  )
}
