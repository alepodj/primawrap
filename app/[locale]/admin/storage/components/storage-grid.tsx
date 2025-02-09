/* eslint-disable jsx-a11y/alt-text */
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import {
  MoreHorizontal,
  Folder,
  File,
  Image,
  Copy,
  Pencil,
  Trash,
  Loader2,
  FolderInput,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useToast } from '@/hooks/use-toast'
import { BlobFile, deleteFiles } from '@/lib/actions/storage.actions'
import { formatBytes } from '@/lib/utils'
import RenameModal from './rename-modal'
import RenameFolderModal from './rename-folder-modal'
import MoveModal from './move-modal'
import { cn } from '@/lib/utils'

interface StorageGridProps {
  files: BlobFile[]
  folders: string[]
  currentPath: string
  error?: string
}

export default function StorageGrid({
  files,
  folders,
  currentPath,
  error,
}: StorageGridProps) {
  const [selectedFile, setSelectedFile] = useState<BlobFile | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set())
  const [selectedItems, setSelectedItems] = useState<
    { type: 'file' | 'folder'; path: string }[]
  >([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false)
  const [isRenameFolderModalOpen, setIsRenameFolderModalOpen] = useState(false)
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false)
  const [selectedFolder, setSelectedFolder] = useState<string>('')
  const router = useRouter()
  const { toast } = useToast()
  const t = useTranslations('Locale')

  const handleFolderClick = (folder: string) => {
    const newPath = currentPath ? `${currentPath}/${folder}` : folder
    router.push(`/admin/storage?path=${newPath}`)
  }

  const handleFolderRename = (folder: string) => {
    setSelectedFolder(folder)
    setIsRenameFolderModalOpen(true)
  }

  const handleCopyUrl = (file: BlobFile) => {
    navigator.clipboard.writeText(file.url)
    toast({
      title: t('URL Copied'),
      description: t('File URL has been copied to clipboard'),
    })
  }

  const handleDelete = async () => {
    if (!selectedFile && selectedFiles.size === 0) return
    setIsDeleting(true)

    try {
      const pathsToDelete = selectedFile
        ? [selectedFile.pathname]
        : Array.from(selectedFiles)

      const result = await deleteFiles(pathsToDelete)
      if (result.success) {
        toast({
          title: t('Files Deleted'),
          description: `${result.deletedCount} ${t('files')} ${t('have been deleted successfully')}`,
        })
        router.refresh()
        setIsDeleteDialogOpen(false)
      } else {
        toast({
          title: t('Delete Error'),
          description: result.error,
          variant: 'destructive',
        })
      }
    } finally {
      setIsDeleting(false)
      setSelectedFile(null)
      setSelectedFiles(new Set())
    }
  }

  const toggleFileSelection = (file: BlobFile) => {
    setSelectedFiles((prev) => {
      const newSelection = new Set(prev)
      if (newSelection.has(file.pathname)) {
        newSelection.delete(file.pathname)
      } else {
        newSelection.add(file.pathname)
      }
      return newSelection
    })

    setSelectedItems((prev) => {
      const isSelected = prev.some((item) => item.path === file.pathname)
      if (isSelected) {
        return prev.filter((item) => item.path !== file.pathname)
      } else {
        return [...prev, { type: 'file', path: file.pathname }]
      }
    })
  }

  // Clear selection helper
  const clearSelection = () => {
    setSelectedFiles(new Set())
    setSelectedItems([])
    setSelectedFile(null)
  }

  if (error) {
    return (
      <div className='text-center py-8 text-muted-foreground'>
        {t('Error loading files')}: {error}
      </div>
    )
  }

  if (files.length === 0 && folders.length === 0) {
    return (
      <div className='text-center py-8 text-muted-foreground'>
        {t('No files or folders found')}
      </div>
    )
  }

  return (
    <>
      {selectedItems.length > 0 && (
        <div className='flex items-center justify-between mb-4 p-2 bg-accent rounded-lg'>
          <span>
            {t('Selected')} {selectedItems.length} {t('items')}
          </span>
          <div className='flex gap-2'>
            <Button variant='outline' onClick={clearSelection}>
              {t('Clear Selection')}
            </Button>
            <Button variant='outline' onClick={() => setIsMoveModalOpen(true)}>
              {t('Move Selected')}
            </Button>
            <Button
              variant='destructive'
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              {t('Delete Selected')}
            </Button>
          </div>
        </div>
      )}

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
        {folders.map((folder) => (
          <div
            key={folder}
            className='group flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors'
          >
            <Folder className='h-8 w-8 text-blue-500' />
            <span
              className='flex-1 truncate'
              onClick={() => handleFolderClick(folder)}
            >
              {folder}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  className='h-8 w-8 p-0 opacity-0 group-hover:opacity-100'
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem onClick={() => handleFolderRename(folder)}>
                  <Pencil className='h-4 w-4 mr-2' />
                  {t('Rename')}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedItems([
                      {
                        type: 'folder',
                        path: currentPath ? `${currentPath}/${folder}` : folder,
                      },
                    ])
                    setIsMoveModalOpen(true)
                  }}
                >
                  <FolderInput className='h-4 w-4 mr-2' />
                  {t('Move')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}

        {files.map((file) => {
          const isImage = file.pathname.match(/\.(jpg|jpeg|png|gif|webp)$/i)
          const isSelected = selectedFiles.has(file.pathname)

          return (
            <div
              key={file.pathname}
              className={cn(
                'group flex items-center gap-3 p-3 border rounded-lg cursor-pointer',
                isSelected && 'border-primary bg-accent'
              )}
              onClick={(e) => {
                // Only toggle selection if not clicking dropdown or its children
                if (
                  !e.defaultPrevented &&
                  !(e.target as HTMLElement).closest('.dropdown-trigger')
                ) {
                  e.preventDefault()
                  toggleFileSelection(file)
                }
              }}
            >
              {isImage ? (
                <Image className='h-8 w-8 text-green-500' />
              ) : (
                <File className='h-8 w-8 text-orange-500' />
              )}

              <div className='flex-1 min-w-0'>
                <div className='truncate'>{file.pathname.split('/').pop()}</div>
                <div className='text-xs text-muted-foreground'>
                  {formatBytes(file.size)}
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='ghost'
                    className='h-8 w-8 p-0 opacity-0 group-hover:opacity-100 dropdown-trigger'
                    onClick={(e) => e.preventDefault()}
                  >
                    <MoreHorizontal className='h-4 w-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault()
                      handleCopyUrl(file)
                    }}
                  >
                    <Copy className='h-4 w-4 mr-2' />
                    {t('Copy URL')}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault()
                      setSelectedFile(file)
                      setIsRenameModalOpen(true)
                    }}
                  >
                    <Pencil className='h-4 w-4 mr-2' />
                    {t('Rename')}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault()
                      setSelectedItems([{ type: 'file', path: file.pathname }])
                      setIsMoveModalOpen(true)
                    }}
                  >
                    <FolderInput className='h-4 w-4 mr-2' />
                    {t('Move')}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className='text-destructive'
                    onClick={(e) => {
                      e.preventDefault()
                      setSelectedFile(file)
                      setIsDeleteDialogOpen(true)
                    }}
                  >
                    <Trash className='h-4 w-4 mr-2' />
                    {t('Delete')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )
        })}
      </div>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedItems.length > 0
                ? t('Are you sure you want to delete these items?')
                : t('Are you sure you want to delete this item?')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedItems.length > 0
                ? t(
                    'This action cannot be undone, the selected items will be permanently deleted'
                  )
                : t(
                    'This action cannot be undone, the item will be permanently deleted'
                  )}
            </AlertDialogDescription>
            <div className='mt-4 max-h-[200px] overflow-y-auto space-y-2 rounded-lg border p-2'>
              {selectedItems.map((item) => (
                <span key={item.path} className='text-sm block'>
                  {item.path.split('/').pop()}
                </span>
              ))}
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              {t('Cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleDelete()
              }}
              className='bg-destructive hover:bg-destructive/90'
              disabled={isDeleting}
            >
              {isDeleting ? (
                <span className='inline-flex items-center gap-2'>
                  <Loader2 className='h-4 w-4 animate-spin' />
                  {t('Deleting')}
                </span>
              ) : (
                t('Delete')
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {selectedFile && (
        <RenameModal
          isOpen={isRenameModalOpen}
          onClose={() => {
            setIsRenameModalOpen(false)
            setSelectedFile(null)
          }}
          file={selectedFile}
        />
      )}

      {selectedFolder && (
        <RenameFolderModal
          isOpen={isRenameFolderModalOpen}
          onClose={() => {
            setIsRenameFolderModalOpen(false)
            setSelectedFolder('')
          }}
          folder={selectedFolder}
          currentPath={currentPath}
        />
      )}

      <MoveModal
        isOpen={isMoveModalOpen}
        onClose={() => {
          setIsMoveModalOpen(false)
          clearSelection()
        }}
        selectedItems={selectedItems}
        currentPath={currentPath}
      />
    </>
  )
}
