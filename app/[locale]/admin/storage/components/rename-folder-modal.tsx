'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { useTranslations } from 'next-intl'
import { renameFolder } from '@/lib/actions/storage.actions'
import { Loader2 } from 'lucide-react'

interface RenameFolderModalProps {
  isOpen: boolean
  onClose: () => void
  folder: string
  currentPath: string
}

export default function RenameFolderModal({
  isOpen,
  onClose,
  folder,
  currentPath,
}: RenameFolderModalProps) {
  const [newName, setNewName] = useState(folder)
  const [isRenaming, setIsRenaming] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const t = useTranslations('Locale')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim() || newName === folder) return

    setIsRenaming(true)
    try {
      const oldPath = currentPath ? `${currentPath}/${folder}` : folder
      const newPath = currentPath
        ? `${currentPath}/${newName.trim()}`
        : newName.trim()

      console.log('Renaming folder:', { oldPath, newPath })

      const result = await renameFolder(oldPath, newPath)
      if (result.success) {
        toast({
          title: t('Success'),
          description: t('Folder renamed successfully'),
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
      console.error('Rename folder error:', error)
      toast({
        title: t('Error'),
        description: t('An error occurred while renaming the folder'),
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
          <DialogTitle>{t('Rename Folder')}</DialogTitle>
          <DialogDescription>
            {t('Enter a new name for the folder')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label>{t('New Name')}</Label>
            <Input
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
              disabled={!newName.trim() || newName === folder || isRenaming}
            >
              {isRenaming ? (
                <span className='inline-flex items-center gap-2'>
                  <Loader2 className='h-4 w-4 animate-spin' />
                  {t('Renaming')}
                </span>
              ) : (
                t('Rename')
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
