'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, Plus } from 'lucide-react'

import DeleteDialog from '@/components/shared/delete-dialog'
import { Button } from '@/components/ui/button'
import { formatId } from '@/lib/utils'
import { deleteUser, getAllUsers } from '@/lib/actions/user.actions'
import { IUser } from '@/lib/db/models/user.model'
import { DataTable } from '@/components/ui/data-table'
import { useSession } from 'next-auth/react'

const columns: ColumnDef<IUser>[] = [
  {
    accessorKey: '_id',
    header: 'Id',
    cell: ({ row }) => formatId(row.getValue('_id')),
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Email
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
  },
  {
    accessorKey: 'role',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Role
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const user = row.original

      return (
        <div className='flex items-center gap-2'>
          <Button asChild variant='outline' size='sm'>
            <Link href={`/admin/users/${user._id}`}>Edit</Link>
          </Button>
          <DeleteDialog id={user._id} action={deleteUser} />
        </div>
      )
    },
  },
]

export default function AdminUserPage() {
  const [users, setUsers] = useState<IUser[]>([])
  const [loading, setLoading] = useState(true)
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session?.user.role !== 'Admin') {
      router.push('/')
      return
    }

    const fetchUsers = async () => {
      try {
        const { data } = await getAllUsers({ page: 1 })
        setUsers(data)
      } catch (error) {
        console.error('Error fetching users:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [session, router])

  if (loading) {
    return <div>Loading...</div>
  }

  if (session?.user.role !== 'Admin') {
    return null
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h1 className='h1-bold'>Users</h1>
        <Button asChild>
          <Link href='/admin/users/create' className='flex items-center gap-2'>
            <Plus className='h-4 w-4' />
            Create User
          </Link>
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={users}
        searchKey='name'
        globalFilter={true}
        showColumnToggle={true}
      />
    </div>
  )
}
