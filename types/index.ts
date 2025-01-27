import {
  CartSchema,
  OrderItemSchema,
  ProductInputSchema,
  UserInputSchema,
  UserSignInSchema,
} from '@/lib/validator'
import { z } from 'zod'

// Product
export type IProductInput = z.infer<typeof ProductInputSchema>

// Data
export type Data = {
  users: IUserInput[]
  products: IProductInput[]
  headerMenus: {
    name: string
    href: string
  }[]
  carousels: {
    image: string
    url: string
    title: string
    buttonCaption: string
    isPublished: boolean
  }[]
}

// Order
export type OrderItem = z.infer<typeof OrderItemSchema>

//Cart
export type Cart = z.infer<typeof CartSchema>

// User
export type IUserInput = z.infer<typeof UserInputSchema>
export type IUserSignIn = z.infer<typeof UserSignInSchema>
