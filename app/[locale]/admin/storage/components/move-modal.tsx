'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { useTranslations } from 'next-intl'
import { listFiles, moveItems } from '@/lib/actions/storage.actions'
import { Loader2, Folder } from 'lucide-react'

interface MoveModalProps {
  isOpen: boolean
  onClose: () => void
  selectedItems: { type: 'file' | 'folder'; path: string }[]
  currentPath: string
}

export default function MoveModal({
  isOpen,
  onClose,
  selectedItems,
  currentPath,
}: MoveModalProps) {
  const [destination, setDestination] = useState('/')
  const [isMoving, setIsMoving] = useState(false)
  const [availableFolders, setAvailableFolders] = useState<string[]>([])
  const router = useRouter()
  const { toast } = useToast()
  const t = useTranslations('Locale')

  // Fetch available folders for destination selection
  useEffect(() => {
    async function fetchFolders() {
      const allFolders: string[] = []

      async function getFoldersRecursively(path: string) {
        const result = await listFiles(path)
        if (result.success && result.folders) {
          for (const folder of result.folders) {
            const fullPath = path ? `${path}/${folder}` : folder
            allFolders.push(fullPath)
            // Recursively get subfolders
            await getFoldersRecursively(fullPath)
          }
        }
      }

      await getFoldersRecursively('')
      setAvailableFolders(allFolders)
    }

    if (isOpen) {
      fetchFolders()
    }
  }, [isOpen])

  // Helper function to format folder path for display
  const formatFolderPath = (path: string) => {
    const parts = path.split('/')
    const depth = parts.length - 1
    const folderName = parts[parts.length - 1]

    // Get the full path structure to determine if each level is the last in its branch
    const isLastInBranch = (index: number) => {
      const parentPath = parts.slice(0, index).join('/')
      const siblingsAtLevel = availableFolders
        .filter((f) => {
          const fParts = f.split('/')
          return (
            fParts.length > index &&
            fParts.slice(0, index).join('/') === parentPath
          )
        })
        .map((f) => f.split('/')[index])
      return (
        siblingsAtLevel.indexOf(parts[index]) === siblingsAtLevel.length - 1
      )
    }

    // For root-level folders, don't add any indentation
    if (depth === 0) {
      return (
        <div className='flex items-center gap-2'>
          <Folder className='h-4 w-4 text-blue-500 flex-shrink-0' />
          <span className='truncate'>{folderName}</span>
        </div>
      )
    }

    // Create the indentation with visual connectors using Unicode box-drawing characters
    const indentation = Array(depth)
      .fill('')
      .map((_, i) => {
        const isLast = i === depth - 1
        const isLastBranch = isLastInBranch(i)

        if (isLast) {
          return ' ╰── ' // Added two more spaces before the connector for last items
        }
        // For non-last items, ensure vertical lines for middle children
        return isLastBranch ? '   ' : '      ' // Always show vertical line for non-last items
      })
      .join('')

    return (
      <div className='flex items-center gap-2'>
        <span className='text-muted-foreground font-mono whitespace-pre'>
          {indentation}
        </span>
        <Folder className='h-4 w-4 text-blue-500 flex-shrink-0' />
        <span className='truncate'>{folderName}</span>
      </div>
    )
  }

  const handleMove = async () => {
    setIsMoving(true)
    try {
      // Convert root path '/' to empty string for the API
      const destinationPath = destination === '/' ? '' : destination

      // Log the move operation details
      console.log('Moving items:', {
        selectedItems,
        destination: destinationPath,
        currentPath,
      })

      // Ensure paths are properly formatted
      const itemsToMove = selectedItems.map((item) => ({
        type: item.type,
        path: item.path.startsWith('/') ? item.path.slice(1) : item.path,
      }))

      const result = await moveItems(itemsToMove, destinationPath)

      console.log('Move result:', result)

      if (result.success) {
        toast({
          title: t('Success'),
          description: t('{count} items moved successfully', {
            count: result.movedCount,
          }),
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
      console.error('Move error:', error)
      toast({
        title: t('Error'),
        description: t('An error occurred while moving the items'),
        variant: 'destructive',
      })
    } finally {
      setIsMoving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>{t('Move Items')}</DialogTitle>
          <DialogDescription>
            {t('Select destination folder')}
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          <div className='space-y-2'>
            <Label>{t('Destination')}</Label>
            <Select value={destination} onValueChange={setDestination}>
              <SelectTrigger>
                <SelectValue>
                  {destination === '/' ? (
                    <div className='flex items-center gap-2'>
                      <Folder className='h-4 w-4 text-blue-500' />
                      {t('Root')}
                    </div>
                  ) : (
                    <div className='flex items-center gap-2'>
                      <Folder className='h-4 w-4 text-blue-500' />
                      <span className='truncate'>{destination}</span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className='max-h-[300px]'>
                <SelectItem value='/' className='flex items-center gap-2'>
                  <div className='flex items-center gap-2'>
                    <Folder className='h-4 w-4 text-blue-500' />
                    {t('Root')}
                  </div>
                </SelectItem>
                {availableFolders.map((folder) => (
                  <SelectItem
                    key={folder}
                    value={folder}
                    disabled={selectedItems.some(
                      (item) =>
                        item.type === 'folder' &&
                        (item.path === folder ||
                          folder.startsWith(item.path + '/'))
                    )}
                  >
                    {formatFolderPath(folder)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='flex justify-end gap-2'>
            <Button variant='outline' onClick={onClose} disabled={isMoving}>
              {t('Cancel')}
            </Button>
            <Button onClick={handleMove} disabled={isMoving}>
              {isMoving ? (
                <span className='inline-flex items-center gap-2'>
                  <Loader2 className='h-4 w-4 animate-spin' />
                  {t('Moving')}
                </span>
              ) : (
                t('Move')
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
