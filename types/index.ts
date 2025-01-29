import {
  CartSchema,
  OrderInputSchema,
  OrderItemSchema,
  ProductInputSchema,
  ReviewInputSchema,
  ShippingAddressSchema,
  UserInputSchema,
  UserNameSchema,
  UserSignInSchema,
  UserSignUpSchema,
} from '@/lib/validator'
import { z } from 'zod'

// Review Input
export type IReviewInput = z.infer<typeof ReviewInputSchema>

// Review Details
export type IReviewDetails = IReviewInput & {
  _id: string
  createdAt: string
  user: {
    name: string
  }
}

// Product
export type IProductInput = z.infer<typeof ProductInputSchema>

// Data
export type Data = {
  users: IUserInput[]
  products: IProductInput[]
  reviews: {
    title: string
    rating: number
    comment: string
  }[]
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
export type IOrderInput = z.infer<typeof OrderInputSchema>
export type OrderItem = z.infer<typeof OrderItemSchema>

//Cart
export type Cart = z.infer<typeof CartSchema>
export type ShippingAddress = z.infer<typeof ShippingAddressSchema>

// User
export type IUserInput = z.infer<typeof UserInputSchema>
export type IUserSignIn = z.infer<typeof UserSignInSchema>
export type IUserSignUp = z.infer<typeof UserSignUpSchema>
export type IUserName = z.infer<typeof UserNameSchema>
