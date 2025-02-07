'use client'

import Link from 'next/link'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { useEffect, useState } from 'react'

import DeleteDialog from '@/components/shared/delete-dialog'
import { Button } from '@/components/ui/button'
import { formatId } from '@/lib/utils'
import { deleteWebPage, getAllWebPages } from '@/lib/actions/web-page.actions'
import { IWebPage } from '@/lib/db/models/web-page.model'
import { DataTable } from '@/components/ui/data-table'

const columns: ColumnDef<IWebPage>[] = [
  {
    accessorKey: '_id',
    header: 'Id',
    cell: ({ row }) => formatId(row.getValue('_id')),
  },
  {
    accessorKey: 'title',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Title
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
  },
  {
    accessorKey: 'slug',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Slug
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
  },
  {
    accessorKey: 'isPublished',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Published
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => (row.getValue('isPublished') ? 'Yes' : 'No'),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const webPage = row.original

      return (
        <div className='flex items-center gap-2'>
          <Button asChild variant='outline' size='sm'>
            <Link href={`/admin/web-pages/${webPage._id}`}>Edit</Link>
          </Button>
          <DeleteDialog id={webPage._id} action={deleteWebPage} />
        </div>
      )
    },
  },
]

export default function WebPageAdminPage() {
  const [webPages, setWebPages] = useState<IWebPage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWebPages = async () => {
      try {
        const data = await getAllWebPages()
        setWebPages(data)
      } catch (error) {
        console.error('Error fetching web pages:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchWebPages()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h1 className='h1-bold'>Web Pages</h1>
        <Button asChild variant='default'>
          <Link href='/admin/web-pages/create'>Create WebPage</Link>
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={webPages}
        globalFilter={true}
        showColumnToggle={true}
      />
    </div>
  )
}
