'use server'

import { put, del, list } from '@vercel/blob'
import { revalidatePath } from 'next/cache'
import { formatError } from '@/lib/utils'

const token = process.env.BLOB_READ_WRITE_TOKEN

if (!token) {
  throw new Error('BLOB_READ_WRITE_TOKEN environment variable is not set')
}

export interface BlobFile {
  url: string
  pathname: string
  size: number
  uploadedAt: Date
}

interface UploadResult {
  success: boolean
  error?: string
  files?: BlobFile[]
}

interface RenameResult {
  success: boolean
  error?: string
  file?: BlobFile
}

interface DeleteResult {
  success: boolean
  error?: string
  deletedCount: number
}

interface ListResult {
  success: boolean
  error?: string
  files?: BlobFile[]
  folders?: string[]
}

// Check if a file exists at the given path
export async function checkDuplicate(
  filename: string,
  path: string
): Promise<{ exists: boolean; suggestions?: string[] }> {
  try {
    console.log('Checking duplicate:', { filename, path }) // Debug log
    const fullPath = path ? `${path}/${filename}` : filename
    console.log('Full path:', fullPath) // Debug log

    const { blobs } = await list({ token })
    console.log(
      'Found blobs:',
      blobs.map((b) => b.pathname)
    ) // Debug log

    // Check if any blob matches the full path exactly
    const exists = blobs.some((blob) => {
      const matches = blob.pathname === fullPath
      if (matches) {
        console.log('Found matching blob:', blob.pathname)
      }
      return matches
    })

    if (exists) {
      // Generate name suggestions if duplicate found
      const nameParts = filename.split('.')
      const ext = nameParts.pop()
      const baseName = nameParts.join('.')
      const suggestions = [
        `${baseName}_1.${ext}`,
        `${baseName}_2.${ext}`,
        `${baseName}_3.${ext}`,
      ]
      return { exists, suggestions }
    }

    return { exists }
  } catch (error) {
    console.error('Error checking duplicate:', error)
    return { exists: false }
  }
}

// Upload files
export async function uploadFiles(formData: FormData): Promise<UploadResult> {
  try {
    const uploadedFiles: BlobFile[] = []
    const files = formData.getAll('files') as File[]
    const path = formData.get('path') as string
    const onDuplicate = formData.get('onDuplicate') as
      | 'rename'
      | 'override'
      | 'skip'

    for (const file of files) {
      let filename = file.name
      let finalPath = `${path}/${filename}`

      // Check for duplicates
      if (onDuplicate !== 'override') {
        const { exists, suggestions } = await checkDuplicate(filename, path)
        if (exists) {
          if (onDuplicate === 'skip') {
            continue
          } else if (onDuplicate === 'rename' && suggestions) {
            // Try each suggestion until we find one that doesn't exist
            for (const suggestion of suggestions) {
              const { exists: suggestionExists } = await checkDuplicate(
                suggestion,
                path
              )
              if (!suggestionExists) {
                filename = suggestion
                finalPath = `${path}/${filename}`
                break
              }
            }
          }
        }
      }

      // Upload the file
      const blob = await put(finalPath, file, {
        access: 'public',
        token,
        addRandomSuffix: false,
      })

      uploadedFiles.push({
        url: blob.url,
        pathname: blob.pathname,
        size: file.size,
        uploadedAt: new Date(),
      })
    }

    revalidatePath('/admin/storage')
    return { success: true, files: uploadedFiles }
  } catch (error) {
    console.error('Upload error:', error)
    return { success: false, error: formatError(error) }
  }
}

// Delete files
export async function deleteFiles(paths: string[]): Promise<DeleteResult> {
  try {
    let deletedCount = 0
    const errors: string[] = []

    for (const path of paths) {
      try {
        console.log('Attempting to delete:', path)

        // Get the file details first
        const { blobs } = await list({
          prefix: path.split('/').slice(0, -1).join('/'),
          token,
        })

        const fileToDelete = blobs.find((blob) => blob.pathname === path)

        if (!fileToDelete) {
          console.error('File not found:', path)
          errors.push(`File not found: ${path}`)
          continue
        }

        // Try to delete using the URL first
        try {
          await del(fileToDelete.url, { token })
        } catch (urlError) {
          console.error(
            'Failed to delete using URL, trying pathname:',
            urlError
          )
          // If URL deletion fails, try pathname
          await del(fileToDelete.pathname, { token })
        }

        // Verify deletion
        const { blobs: verifyBlobs } = await list({
          prefix: path.split('/').slice(0, -1).join('/'),
          token,
        })

        const fileStillExists = verifyBlobs.some((b) => b.pathname === path)
        if (!fileStillExists) {
          deletedCount++
        } else {
          errors.push(`Failed to delete ${path}`)
        }
      } catch (error) {
        console.error(`Error deleting ${path}:`, error)
        errors.push(`Failed to delete ${path}: ${formatError(error)}`)
      }
    }

    revalidatePath('/admin/storage')

    if (errors.length > 0) {
      return {
        success: false,
        error: errors.join('. '),
        deletedCount,
      }
    }

    return { success: true, deletedCount }
  } catch (error) {
    console.error('Delete operation error:', error)
    return { success: false, error: formatError(error), deletedCount: 0 }
  }
}

// Rename file
export async function renameFile(
  oldPath: string,
  newPath: string,
  options: {
    onDuplicate: 'rename' | 'override' | 'cancel'
  }
): Promise<RenameResult> {
  try {
    console.log('Starting rename operation:', { oldPath, newPath, options })

    // Get the old file first to ensure it exists
    const { blobs } = await list({
      prefix: oldPath.split('/').slice(0, -1).join('/'),
      token,
    })

    console.log('Looking for file:', oldPath)
    console.log(
      'Available blobs:',
      blobs.map((b) => b.pathname)
    )

    const oldFile = blobs.find((blob) => blob.pathname === oldPath)

    if (!oldFile) {
      return { success: false, error: 'Original file not found' }
    }

    // Check for duplicate at new path
    const { exists, suggestions } = await checkDuplicate(
      newPath.split('/').pop() || '',
      newPath.split('/').slice(0, -1).join('/')
    )

    if (exists) {
      if (options.onDuplicate === 'cancel') {
        return { success: false, error: 'File already exists' }
      } else if (options.onDuplicate === 'rename' && suggestions) {
        for (const suggestion of suggestions) {
          const { exists: suggestionExists } = await checkDuplicate(
            suggestion,
            newPath.split('/').slice(0, -1).join('/')
          )
          if (!suggestionExists) {
            newPath = `${newPath.split('/').slice(0, -1).join('/')}/${suggestion}`
            break
          }
        }
      }
    }

    // 1. Download the file content
    console.log('Downloading file content from:', oldFile.url)
    const response = await fetch(oldFile.url)
    const blob = await response.blob()
    const file = new File([blob], newPath.split('/').pop() || '', {
      type: blob.type,
    })

    // 2. Delete the old file first
    if (oldPath !== newPath) {
      console.log('Deleting old file first:', oldPath)
      try {
        await del(oldPath, { token })

        // Verify deletion
        const { blobs: verifyBlobs } = await list({
          prefix: oldPath.split('/').slice(0, -1).join('/'),
          token,
        })

        const oldFileStillExists = verifyBlobs.some(
          (b) => b.pathname === oldPath
        )
        if (oldFileStillExists) {
          console.error('First deletion attempt failed, retrying...')
          // Try using the full URL path as a fallback
          await del(oldFile.url.split('/').pop() || oldPath, { token })
        }
      } catch (error) {
        console.error('Error during first delete attempt:', error)
      }
    }

    // 3. Upload to new path
    console.log('Uploading to new path:', newPath)
    const newBlob = await put(newPath, file, {
      access: 'public',
      token,
      addRandomSuffix: false,
    })

    // 4. Verify the new file exists
    console.log('Verifying new file exists')
    const { blobs: checkBlobs } = await list({
      prefix: newPath.split('/').slice(0, -1).join('/'),
      token,
    })

    const newFileExists = checkBlobs.some((b) => b.pathname === newPath)
    if (!newFileExists) {
      throw new Error('New file was not created successfully')
    }

    // 5. Try one final time to delete the old file if it still exists
    if (oldPath !== newPath) {
      const { blobs: finalCheck } = await list({
        prefix: oldPath.split('/').slice(0, -1).join('/'),
        token,
      })

      if (finalCheck.some((b) => b.pathname === oldPath)) {
        console.log('Final deletion attempt for old file')
        await deleteFiles([oldPath])
      }
    }

    revalidatePath('/admin/storage')
    return {
      success: true,
      file: {
        url: newBlob.url,
        pathname: newBlob.pathname,
        size: file.size,
        uploadedAt: new Date(),
      },
    }
  } catch (error) {
    console.error('Rename error:', error)
    return { success: false, error: formatError(error) }
  }
}

// List files in a directory
export async function listFiles(path: string = ''): Promise<ListResult> {
  try {
    const { blobs } = await list({ prefix: path, token })

    // Process files and folders
    const files: BlobFile[] = []
    const foldersSet = new Set<string>()

    blobs.forEach((blob) => {
      // Remove the base path to get relative path
      const relativePath = blob.pathname.slice(path ? path.length + 1 : 0)
      const parts = relativePath.split('/')

      if (parts.length > 1) {
        // This is a file in a subfolder
        foldersSet.add(parts[0])
      } else {
        // This is a file in current directory
        files.push({
          url: blob.url,
          pathname: blob.pathname,
          size: blob.size,
          uploadedAt: new Date(blob.uploadedAt),
        })
      }
    })

    return {
      success: true,
      files,
      folders: Array.from(foldersSet),
    }
  } catch (error) {
    return { success: false, error: formatError(error) }
  }
}

// Create a new folder
export async function createFolder(
  path: string,
  name: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if folder exists
    const { exists } = await checkDuplicate(name, path)
    if (exists) {
      return { success: false, error: 'Folder already exists' }
    }

    // Create an empty .keep file to create the folder
    const emptyFile = new Blob([new Uint8Array([0])], { type: 'text/plain' })

    await put(`${path}/${name}/.keep`, emptyFile, {
      access: 'public',
      token,
      addRandomSuffix: false,
    })

    revalidatePath('/admin/storage')
    return { success: true }
  } catch (error) {
    console.error('Folder creation error:', error)
    return { success: false, error: formatError(error) }
  }
}
