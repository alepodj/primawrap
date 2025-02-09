'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { useTranslations } from 'next-intl'
import { Upload, X, AlertCircle, Loader2 } from 'lucide-react'
import { checkDuplicate, uploadFiles } from '@/lib/actions/storage.actions'
import { cn, formatBytes, formatError } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
  currentPath: string
}

type FileStatus = 'pending' | 'uploading' | 'success' | 'error' | 'duplicate'
type DuplicateAction = 'rename' | 'override' | 'skip'

interface FileWithStatus {
  file: File
  status: FileStatus
  progress?: number
  error?: string
  duplicateAction?: DuplicateAction
}

// Convert server's bodySizeLimit (e.g., "10mb") to bytes
const SIZE_UNITS = {
  mb: 1024 * 1024,
  gb: 1024 * 1024 * 1024,
}

const MAX_FILE_SIZE = (() => {
  const limit = process.env.NEXT_PUBLIC_BODY_SIZE_LIMIT || '10mb'
  console.log('File size limit:', limit) // Debug log
  const match = limit.match(/(\d+)(mb|gb)/i)
  if (!match) return 10 * SIZE_UNITS.mb // Default to 10MB if no match
  const [, size, unit] = match
  return (
    parseInt(size) *
    (SIZE_UNITS[unit.toLowerCase() as keyof typeof SIZE_UNITS] || SIZE_UNITS.mb)
  )
})()

// Debug log
console.log(
  'Calculated MAX_FILE_SIZE:',
  MAX_FILE_SIZE,
  'bytes',
  formatBytes(MAX_FILE_SIZE)
)

const formattedMaxSize = formatBytes(MAX_FILE_SIZE)

export default function UploadModal({
  isOpen,
  onClose,
  currentPath,
}: UploadModalProps) {
  const [files, setFiles] = useState<FileWithStatus[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [duplicateAction, setDuplicateAction] = useState<DuplicateAction>()
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false)
  const [showRenameDialog, setShowRenameDialog] = useState(false)
  const [fileToRename, setFileToRename] = useState<{
    file: File
    index: number
  } | null>(null)
  const [newFileName, setNewFileName] = useState('')
  const { toast } = useToast()
  const t = useTranslations('Locale')

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setIsProcessing(true)
      const newFiles: FileWithStatus[] = []
      const oversizedFiles: string[] = []
      let totalSize = 0

      try {
        // Get existing file names in the list
        const existingFileNames = new Set(files.map((f) => f.file.name))

        for (const file of acceptedFiles) {
          // Skip if file is already in the list
          if (existingFileNames.has(file.name)) {
            console.log('Skipping duplicate file:', file.name) // Debug log
            continue
          }

          // Check file size
          if (file.size > MAX_FILE_SIZE) {
            oversizedFiles.push(`${file.name} (${formatBytes(file.size)})`)
            continue
          }

          // Add to total size
          totalSize += file.size

          // Check for duplicates in storage
          const fullPath = currentPath
            ? `${currentPath}/${file.name}`
            : file.name
          console.log('Checking duplicate for path:', fullPath) // Debug log
          const { exists } = await checkDuplicate(file.name, currentPath)

          if (exists) {
            console.log('Storage duplicate found:', file.name) // Debug log
          }

          newFiles.push({
            file,
            status: exists ? 'duplicate' : 'pending',
          })

          // Add to tracking set
          existingFileNames.add(file.name)
        }

        // Check total size
        if (totalSize > MAX_FILE_SIZE) {
          toast({
            title: t('Upload Error'),
            description: t('Total file size exceeds the limit of {limit}', {
              limit: formattedMaxSize,
            }),
            variant: 'destructive',
          })
          return
        }

        // Show error for oversized files
        if (oversizedFiles.length > 0) {
          toast({
            title: t('Files Too Large'),
            description:
              t('The following files exceed the size limit of {limit}:', {
                limit: formattedMaxSize,
              }) +
              ' ' +
              oversizedFiles.join(', '),
            variant: 'destructive',
          })
        }

        if (newFiles.length > 0) {
          setFiles((prev) => [...prev, ...newFiles])
        }
      } finally {
        setIsProcessing(false)
      }
    },
    [currentPath, toast, t, files]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  })

  const handleUpload = async () => {
    if (files.length === 0) return

    // Check if there are any duplicates that haven't been handled
    const hasDuplicates = files.some(
      (f) => f.status === 'duplicate' && !f.duplicateAction
    )
    if (hasDuplicates && !duplicateAction) {
      setShowDuplicateDialog(true)
      return
    }

    setIsUploading(true)
    try {
      // Filter out skipped files
      const filesToUpload = files.filter((f) => f.duplicateAction !== 'skip')

      for (const fileWithStatus of filesToUpload) {
        const formData = new FormData()
        formData.append('path', currentPath)
        formData.append('files', fileWithStatus.file)

        // Set the duplicate action from either individual file or global setting
        const action = fileWithStatus.duplicateAction || duplicateAction
        if (action) {
          formData.append('onDuplicate', action)
        }

        const result = await uploadFiles(formData)
        if (!result.success) {
          toast({
            title: t('Upload Error'),
            description: result.error,
            variant: 'destructive',
          })
          return
        }
      }

      toast({
        title: t('Success'),
        description: t('Files uploaded successfully'),
      })
      setFiles([])
      onClose()
    } catch (error) {
      toast({
        title: t('Upload Error'),
        description: formatError(error),
        variant: 'destructive',
      })
    } finally {
      setIsUploading(false)
      setDuplicateAction(undefined)
    }
  }

  const handleRename = (index: number) => {
    const file = files[index]
    setFileToRename({ file: file.file, index })
    setNewFileName(file.file.name)
    setShowRenameDialog(true)
  }

  const handleRenameSubmit = () => {
    if (!fileToRename || !newFileName) return

    setFiles((prev) =>
      prev.map((file, i) =>
        i === fileToRename.index
          ? {
              ...file,
              file: new File([fileToRename.file], newFileName, {
                type: fileToRename.file.type,
              }),
              duplicateAction: 'rename',
              status: 'pending',
            }
          : file
      )
    )

    setShowRenameDialog(false)
    setFileToRename(null)
    setNewFileName('')
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleDuplicateAction = (
    index: number,
    action: 'rename' | 'override' | 'skip'
  ) => {
    setFiles((prev) =>
      prev.map((file, i) =>
        i === index
          ? { ...file, duplicateAction: action, status: 'pending' }
          : file
      )
    )
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) setFiles([]) // Clear files when modal is closed
        onClose()
      }}
    >
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>{t('Upload Files')}</DialogTitle>
          <DialogDescription>
            {t('Drop files here or click to select')}
          </DialogDescription>
        </DialogHeader>

        {/* Rename Dialog */}
        <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('Rename File')}</DialogTitle>
              <DialogDescription>
                {t('Enter a new name for the file')}
              </DialogDescription>
            </DialogHeader>
            <div className='grid gap-4'>
              <div className='grid gap-2'>
                <Label>{t('New Name')}</Label>
                <Input
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder={t('Enter new name')}
                />
              </div>
              <div className='flex justify-end gap-2'>
                <Button
                  variant='outline'
                  onClick={() => {
                    setShowRenameDialog(false)
                    setFileToRename(null)
                    setNewFileName('')
                  }}
                >
                  {t('Cancel')}
                </Button>
                <Button
                  onClick={handleRenameSubmit}
                  disabled={!newFileName.trim()}
                >
                  {t('Rename')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Duplicate Dialog */}
        <Dialog
          open={showDuplicateDialog}
          onOpenChange={setShowDuplicateDialog}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('Duplicate Files Found')}</DialogTitle>
              <DialogDescription>
                {t('Some files already exist, what would you like to do?')}
              </DialogDescription>
            </DialogHeader>
            <div className='grid gap-4'>
              <Button
                variant='outline'
                onClick={() => {
                  // For rename, we need to handle each file individually
                  const duplicateFiles = files.filter(
                    (f) => f.status === 'duplicate' && !f.duplicateAction
                  )
                  if (duplicateFiles.length > 0) {
                    handleRename(files.indexOf(duplicateFiles[0]))
                  }
                  setShowDuplicateDialog(false)
                }}
              >
                {t('Rename')}
              </Button>
              <Button
                variant='outline'
                onClick={() => {
                  setDuplicateAction('override')
                  setShowDuplicateDialog(false)
                  handleUpload()
                }}
              >
                {t('Override')}
              </Button>
              <Button
                variant='outline'
                onClick={() => {
                  setDuplicateAction('skip')
                  setShowDuplicateDialog(false)
                  handleUpload()
                }}
              >
                {t('Skip')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <div
          {...getRootProps()}
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
            isDragActive
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50'
          )}
        >
          <input {...getInputProps()} />
          <Upload className='mx-auto h-8 w-8 text-muted-foreground' />
          <p className='mt-2 text-sm text-muted-foreground'>
            {isDragActive ? (
              t('Drop files here')
            ) : isProcessing ? (
              <span className='inline-flex items-center gap-2'>
                <Loader2 className='h-4 w-4 animate-spin' />
                {t('Processing files')}
              </span>
            ) : (
              t('Drag and drop files here, or click to select files')
            )}
          </p>
          {isProcessing && (
            <div className='mt-2 text-sm text-muted-foreground animate-pulse'>
              {t('Checking file sizes and duplicates')}
            </div>
          )}
        </div>

        {files.length > 0 && (
          <div className='space-y-4'>
            <div className='max-h-[200px] overflow-y-auto space-y-2'>
              {files.map((file, index) => (
                <div
                  key={index}
                  className='flex items-center justify-between gap-4 p-2 border rounded-lg'
                >
                  <div className='flex items-center gap-2 min-w-0 flex-1'>
                    <div className='min-w-0 flex-1 overflow-hidden'>
                      <div
                        className='truncate text-sm font-medium'
                        title={file.file.name}
                      >
                        {file.file.name}
                      </div>
                      <div className='text-xs text-muted-foreground'>
                        {formatBytes(file.file.size)}
                      </div>
                    </div>
                    {file.status === 'duplicate' && !file.duplicateAction && (
                      <AlertCircle className='h-4 w-4 text-yellow-500 flex-shrink-0' />
                    )}
                  </div>

                  <div className='flex items-center gap-2 flex-shrink-0'>
                    {file.status === 'duplicate' && !file.duplicateAction ? (
                      <>
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={() => handleRename(index)}
                        >
                          {t('Rename')}
                        </Button>
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={() =>
                            handleDuplicateAction(index, 'override')
                          }
                        >
                          {t('Override')}
                        </Button>
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={() => handleDuplicateAction(index, 'skip')}
                        >
                          {t('Skip')}
                        </Button>
                      </>
                    ) : (
                      <Button
                        size='sm'
                        variant='ghost'
                        onClick={() => removeFile(index)}
                      >
                        <X className='h-4 w-4' />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className='flex justify-end gap-2'>
              <Button variant='outline' onClick={onClose}>
                {t('Cancel')}
              </Button>
              <Button
                onClick={handleUpload}
                disabled={
                  isUploading ||
                  files.some(
                    (f) => f.status === 'duplicate' && !f.duplicateAction
                  )
                }
              >
                {isUploading ? (
                  <span className='inline-flex items-center gap-2'>
                    <Loader2 className='h-4 w-4 animate-spin' />
                    {t('Uploading')}
                  </span>
                ) : (
                  t('Upload')
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
