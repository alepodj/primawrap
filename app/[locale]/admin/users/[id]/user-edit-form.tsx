'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
import { z } from 'zod'
import { Plus, Trash2, Home, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { updateUser } from '@/lib/actions/user.actions'
import { USER_ROLES } from '@/lib/constants'
import { IUser } from '@/lib/db/models/user.model'
import { UserUpdateSchema } from '@/lib/validator'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

const UserEditForm = ({ user }: { user: IUser }) => {
  const router = useRouter()

  const form = useForm<z.infer<typeof UserUpdateSchema>>({
    resolver: zodResolver(UserUpdateSchema),
    defaultValues: {
      ...user,
      addresses: user.addresses || [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'addresses',
  })

  const { toast } = useToast()

  // Handle default address changes
  const handleDefaultChange = (index: number, checked: boolean) => {
    const addresses = form.getValues('addresses')

    // If unchecking and it's the only address, prevent it
    if (!checked && addresses.length === 1) {
      return
    }

    // Update all addresses to be non-default
    addresses.forEach((_, i) => {
      form.setValue(`addresses.${i}.isDefault`, false)
    })

    // Set the selected address as default
    if (checked) {
      form.setValue(`addresses.${index}.isDefault`, true)
    } else if (addresses.length > 1) {
      // If unchecking and there are other addresses, make the first other address default
      const newDefaultIndex = index === 0 ? 1 : 0
      form.setValue(`addresses.${newDefaultIndex}.isDefault`, true)
    }
  }

  // Handle adding new address
  const handleAddAddress = () => {
    const isFirstAddress = fields.length === 0
    append({
      fullName: '',
      street: '',
      city: '',
      province: '',
      postalCode: '',
      country: '',
      phone: '',
      isDefault: isFirstAddress, // Make it default if it's the first address
    })
  }

  // Handle removing address
  const handleRemoveAddress = (index: number) => {
    const addresses = form.getValues('addresses')
    const isRemovingDefault = addresses[index].isDefault

    // If removing the default address and there are other addresses
    if (isRemovingDefault && addresses.length > 1) {
      const newDefaultIndex = index === 0 ? 1 : 0
      form.setValue(`addresses.${newDefaultIndex}.isDefault`, true)
    }

    remove(index)
  }

  async function onSubmit(values: z.infer<typeof UserUpdateSchema>) {
    try {
      // Ensure at least one address is default if there are addresses
      const addresses = values.addresses
      if (addresses.length > 0 && !addresses.some((addr) => addr.isDefault)) {
        addresses[0].isDefault = true
      }

      const res = await updateUser({
        ...values,
        _id: user._id,
      })

      if (!res.success) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: res.message,
        })
        return
      }

      toast({
        title: 'Success',
        description: res.message,
      })
      router.push('/admin/users')
      router.refresh()
    } catch (error: unknown) {
      console.error('Error updating user:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Something went wrong. Please try again.',
      })
    }
  }

  return (
    <Form {...form}>
      <form
        method='post'
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-8'
      >
        <Card>
          <CardContent className='pt-6'>
            <div className='flex flex-col gap-5 md:flex-row'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter user name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter user email' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='flex flex-col gap-5 md:flex-row mt-5'>
              <FormField
                control={form.control}
                name='phone'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter phone number' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='role'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select a role' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {USER_ROLES.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='pt-6'>
            <div className='flex items-center justify-between mb-4'>
              <div>
                <h3 className='text-lg font-semibold'>Addresses</h3>
                <p className='text-sm text-muted-foreground'>
                  Manage user&apos;s addresses
                </p>
              </div>
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={handleAddAddress}
              >
                <Plus className='w-4 h-4 mr-2' />
                Add Address
              </Button>
            </div>

            <div className='space-y-4'>
              {fields.map((field, index) => (
                <Card key={field.id}>
                  <CardContent className='pt-6'>
                    <div className='flex items-center justify-between mb-4'>
                      <div className='flex items-center gap-2'>
                        <Home className='w-4 h-4' />
                        <h4 className='font-medium'>Address {index + 1}</h4>
                      </div>
                      <div className='flex items-center gap-4'>
                        <FormField
                          control={form.control}
                          name={`addresses.${index}.isDefault`}
                          render={({ field }) => (
                            <FormItem className='flex items-center space-x-2'>
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={(checked: boolean) =>
                                    handleDefaultChange(index, checked)
                                  }
                                  disabled={field.value && fields.length === 1}
                                />
                              </FormControl>
                              <FormLabel className='!mt-0'>Default</FormLabel>
                            </FormItem>
                          )}
                        />
                        <Button
                          type='button'
                          variant='ghost'
                          size='sm'
                          onClick={() => handleRemoveAddress(index)}
                        >
                          <Trash2 className='w-4 h-4' />
                        </Button>
                      </div>
                    </div>

                    <div className='grid gap-4 md:grid-cols-2'>
                      <FormField
                        control={form.control}
                        name={`addresses.${index}.fullName`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`addresses.${index}.phone`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`addresses.${index}.street`}
                        render={({ field }) => (
                          <FormItem className='md:col-span-2'>
                            <FormLabel>Street Address</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`addresses.${index}.city`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`addresses.${index}.province`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Province</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`addresses.${index}.postalCode`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Postal Code</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`addresses.${index}.country`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className='flex justify-between items-center'>
          <Button
            type='submit'
            disabled={form.formState.isSubmitting}
            className={cn(
              'min-w-[150px]',
              form.formState.isSubmitting && 'opacity-50 cursor-not-allowed'
            )}
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Updating...
              </>
            ) : (
              'Update User'
            )}
          </Button>
          <Button
            variant='outline'
            type='button'
            onClick={() => router.push('/admin/users')}
          >
            Back
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default UserEditForm
