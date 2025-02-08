'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { useTranslations } from 'next-intl'
import { Upload, X, AlertCircle, Loader2 } from 'lucide-react'
import { checkDuplicate, uploadFiles } from '@/lib/actions/storage.actions'
import { cn, formatBytes } from '@/lib/utils'

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
  currentPath: string
}

interface FileWithStatus {
  file: File
  status: 'pending' | 'duplicate' | 'uploading' | 'success' | 'error'
  duplicateAction?: 'rename' | 'override' | 'skip'
  error?: string
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
  const [isUploading, setIsUploading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()
  const t = useTranslations('Locale')

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setIsProcessing(true)
      const newFiles: FileWithStatus[] = []
      const oversizedFiles: string[] = []

      try {
        for (const file of acceptedFiles) {
          // Check file size
          if (file.size > MAX_FILE_SIZE) {
            oversizedFiles.push(`${file.name} (${formatBytes(file.size)})`)
            continue
          }

          const { exists } = await checkDuplicate(file.name, currentPath)
          newFiles.push({
            file,
            status: exists ? 'duplicate' : 'pending',
          })
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
    [currentPath, toast, t]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  })

  const handleUpload = async () => {
    setIsUploading(true)

    try {
      // Group files by their duplicate action
      const fileGroups = {
        rename: files.filter((f) => f.duplicateAction === 'rename'),
        override: files.filter((f) => f.duplicateAction === 'override'),
        skip: files.filter((f) => f.duplicateAction === 'skip'),
        normal: files.filter(
          (f) => f.status === 'pending' || !f.duplicateAction
        ),
      }

      let totalSize = 0
      const allFilesToUpload = Object.values(fileGroups).flat()

      // Calculate total size
      allFilesToUpload.forEach((f) => {
        totalSize += f.file.size
      })

      // Check total size
      if (totalSize > MAX_FILE_SIZE) {
        throw new Error(
          t('Total file size exceeds the limit of {limit}', {
            limit: formattedMaxSize,
          })
        )
      }

      // Upload each group with its respective options
      for (const [action, groupFiles] of Object.entries(fileGroups)) {
        if (groupFiles.length === 0) continue

        const formData = new FormData()
        groupFiles.forEach((f) => formData.append('files', f.file))
        formData.append('path', currentPath)
        formData.append('onDuplicate', action as 'rename' | 'override' | 'skip')

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
        title: t('Upload Complete'),
        description: t('Files uploaded successfully'),
      })

      setFiles([]) // Clear files after successful upload
      onClose()
    } catch (error) {
      toast({
        title: t('Upload Error'),
        description:
          error instanceof Error
            ? error.message
            : t('An error occurred while uploading files'),
        variant: 'destructive',
      })
    } finally {
      setIsUploading(false)
    }
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
        </DialogHeader>

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
                          onClick={() => handleDuplicateAction(index, 'rename')}
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
                {isUploading ? t('Uploading') : t('Upload')}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
