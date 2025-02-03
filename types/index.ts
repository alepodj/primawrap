import {
  CarouselSchema,
  CartSchema,
  DeliveryDateSchema,
  ForgotPasswordSchema,
  OrderInputSchema,
  OrderItemSchema,
  PaymentMethodSchema,
  ProductInputSchema,
  ResetPasswordSchema,
  ReviewInputSchema,
  SettingInputSchema,
  ShippingAddressSchema,
  SiteCurrencySchema,
  SiteLanguageSchema,
  UserInputSchema,
  UserNameSchema,
  UserSignInSchema,
  UserSignUpSchema,
  WebPageInputSchema,
  UserPhoneSchema,
  DeleteAccountSchema,
  AddressSchema,
  AddressUpdateSchema,
} from '@/lib/validator'
import { z } from 'zod'
import { DayPicker } from 'react-day-picker'
import { Toast, ToastAction } from '@/components/ui/toast'
import { TooltipProps } from 'recharts'

// Charts
export interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean
  payload?: { value: number }[]
  label?: string
}

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
  settings: ISettingInput[]
  webPages: IWebPageInput[]
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
export type IOrderList = IOrderInput & {
  _id: string
  user: {
    name: string
    email: string
  }
  createdAt: Date
}
export type OrderItem = z.infer<typeof OrderItemSchema>

//Cart
export type Cart = z.infer<typeof CartSchema>
export type ShippingAddress = z.infer<typeof ShippingAddressSchema>

// User
export type IUserInput = z.infer<typeof UserInputSchema>
export type IUserSignIn = z.infer<typeof UserSignInSchema>
export type IUserSignUp = z.infer<typeof UserSignUpSchema>
export type IUserName = z.infer<typeof UserNameSchema>
export type IUserPhone = z.infer<typeof UserPhoneSchema>

// WebPage
export type IWebPageInput = z.infer<typeof WebPageInputSchema>

// Setting
export type ICarousel = z.infer<typeof CarouselSchema>
export type ISettingInput = z.infer<typeof SettingInputSchema>
export type ClientSetting = ISettingInput & {
  currency: string
}
export type SiteLanguage = z.infer<typeof SiteLanguageSchema>
export type SiteCurrency = z.infer<typeof SiteCurrencySchema>
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>
export type DeliveryDate = z.infer<typeof DeliveryDateSchema>

// Auth
export type ForgotPasswordForm = z.infer<typeof ForgotPasswordSchema>
export type ResetPasswordForm = z.infer<typeof ResetPasswordSchema>
export type DeleteAccountForm = z.infer<typeof DeleteAccountSchema>

// UI Components
export type CalendarProps = React.ComponentProps<typeof DayPicker>

export type PaginationProps = {
  page: number | string
  totalPages: number
  urlParamName?: string
}

export type RatingSummaryProps = {
  asPopover?: boolean
  avgRating: number
  numReviews: number
  ratingDistribution: {
    rating: number
    count: number
  }[]
}

export type CardItem = {
  title: string
  value: string | number
  description: string
  icon: React.ReactNode
}

export interface CountdownRedirectProps {
  locale: string
  callbackUrl?: string
  seconds?: number
}

export type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>
export type ToastActionElement = React.ReactElement<typeof ToastAction>

export type TableChartProps = {
  data: {
    name: string
    value: number
  }[]
  title: string
  valuePrefix?: string
  valueSuffix?: string
}

export interface RatingProps {
  rating: number
  className?: string
  size?: number
}

export type UserNameForm = z.infer<typeof UserNameSchema>

// Address
export type IAddressForm = z.infer<typeof AddressSchema>
export type IAddressUpdate = z.infer<typeof AddressUpdateSchema>
