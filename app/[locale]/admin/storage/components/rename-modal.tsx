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
import { BlobFile, renameFile } from '@/lib/actions/storage.actions'

interface RenameModalProps {
  isOpen: boolean
  onClose: () => void
  file: BlobFile
}

export default function RenameModal({
  isOpen,
  onClose,
  file,
}: RenameModalProps) {
  const [newName, setNewName] = useState(file.pathname.split('/').pop() || '')
  const [isRenaming, setIsRenaming] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const t = useTranslations('Locale')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim() || newName === file.pathname.split('/').pop()) return

    setIsRenaming(true)
    try {
      // Get the directory path and construct the new path
      const dirPath = file.pathname.split('/').slice(0, -1).join('/')
      const newPath = dirPath ? `${dirPath}/${newName.trim()}` : newName.trim()

      console.log('Renaming file:', {
        oldPath: file.pathname,
        newPath,
        dirPath,
      })

      const result = await renameFile(file.pathname, newPath, {
        onDuplicate: 'cancel',
      })

      if (result.success) {
        toast({
          title: t('File Renamed'),
          description: t('File has been renamed successfully'),
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
    } catch (error) {
      console.error('Rename modal error:', error)
      toast({
        title: t('Error'),
        description: t('An error occurred while renaming the file'),
        variant: 'destructive',
      })
    } finally {
      setIsRenaming(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('Rename File')}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='newName'>{t('New Name')}</Label>
            <Input
              id='newName'
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={t('Enter new name')}
              disabled={isRenaming}
            />
          </div>

          <div className='flex justify-end gap-2'>
            <Button
              type='button'
              variant='outline'
              onClick={onClose}
              disabled={isRenaming}
            >
              {t('Cancel')}
            </Button>
            <Button
              type='submit'
              disabled={
                !newName.trim() ||
                newName === file.pathname.split('/').pop() ||
                isRenaming
              }
            >
              {isRenaming ? t('Renaming') : t('Rename')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
