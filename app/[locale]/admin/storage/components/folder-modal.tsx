'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { useTranslations } from 'next-intl'
import { createFolder } from '@/lib/actions/storage.actions'

interface FolderModalProps {
  isOpen: boolean
  onClose: () => void
  currentPath: string
}

export default function FolderModal({
  isOpen,
  onClose,
  currentPath,
}: FolderModalProps) {
  const [folderName, setFolderName] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const t = useTranslations('Locale')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!folderName.trim()) return

    setIsCreating(true)
    try {
      const result = await createFolder(currentPath, folderName.trim())
      if (result.success) {
        toast({
          title: t('Folder Created'),
          description: t('Folder has been created successfully'),
        })
        router.refresh()
        onClose()
      } else {
        toast({
          title: t('Error'),
          description: result.error,
          variant: 'destructive',
        })
      }
    } catch {
      toast({
        title: t('Error'),
        description: t('An error occurred while creating the folder'),
        variant: 'destructive',
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('Create New Folder')}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='folderName'>{t('Folder Name')}</Label>
            <Input
              id='folderName'
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder={t('Enter folder name')}
              disabled={isCreating}
            />
          </div>

          <div className='flex justify-end gap-2'>
            <Button
              type='button'
              variant='outline'
              onClick={onClose}
              disabled={isCreating}
            >
              {t('Cancel')}
            </Button>
            <Button type='submit' disabled={!folderName.trim() || isCreating}>
              {isCreating ? t('Creating') : t('Create')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
