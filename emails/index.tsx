import { Resend } from 'resend'
import PurchaseReceiptEmail from './purchase-receipt'
import { IOrder } from '@/lib/db/models/order.model'
import AskReviewOrderItemsEmail from './ask-review-order-items'
import VerifyEmail from './verify-email'
import PasswordResetEmail from './password-reset'
import { SENDER_EMAIL, SENDER_NAME } from '@/lib/constants'
import { i18n } from '@/i18n-config'
import { routing } from '@/i18n/routing'

const resend = new Resend(process.env.RESEND_API_KEY as string)

export const sendVerificationEmail = async ({
  email,
  name,
  token,
  callbackUrl,
}: {
  email: string
  name: string
  token: string
  callbackUrl?: string
}) => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') || ''
  const defaultLocale = i18n.defaultLocale
  const verificationUrl = `${baseUrl}/${defaultLocale}/verify-email?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}${
    callbackUrl ? `&callbackUrl=${encodeURIComponent(callbackUrl)}` : ''
  }`

  await resend.emails.send({
    from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
    to: email,
    subject: 'Verify your email address',
    react: <VerifyEmail verificationUrl={verificationUrl} name={name} />,
  })
}

export const sendPurchaseReceipt = async ({ order }: { order: IOrder }) => {
  await resend.emails.send({
    from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
    to: (order.user as { email: string }).email,
    subject: 'Order Confirmation',
    react: <PurchaseReceiptEmail order={order} />,
  })
}

export const sendAskReviewOrderItems = async ({ order }: { order: IOrder }) => {
  const oneDayFromNow = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString()

  await resend.emails.send({
    from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
    to: (order.user as { email: string }).email,
    subject: 'Review your order items',
    react: <AskReviewOrderItemsEmail order={order} />,
    scheduledAt: oneDayFromNow,
  })
}

export const sendPasswordResetEmail = async ({
  email,
  name,
  resetUrl,
}: {
  email: string
  name: string
  resetUrl: string
}) => {
  await resend.emails.send({
    from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
    to: email,
    subject: 'Reset your password',
    react: <PasswordResetEmail resetUrl={resetUrl} name={name} />,
  })
}
