import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Img,
} from '@react-email/components'
import { Tailwind } from '@react-email/tailwind'

interface AccountDeletionEmailProps {
  name: string
}

export default function AccountDeletionEmail({
  name,
}: AccountDeletionEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your account has been successfully deleted</Preview>
      <Tailwind>
        <Body className='bg-white font-sans'>
          <Container className='mx-auto py-5 px-4'>
            <Img
              src={`${process.env.NEXT_PUBLIC_APP_URL}/images/logo.png`}
              alt='Logo'
              className='mx-auto mb-4'
              width={150}
            />
            <Heading className='text-2xl font-bold text-center text-gray-900 mb-4'>
              Sad to See You Go
            </Heading>
            <Section className='bg-gray-50 border border-gray-200 rounded-lg p-6 mb-4'>
              <Text className='text-gray-800 mb-4'>Dear {name},</Text>
              <Text className='text-gray-800 mb-4'>
                We wanted to confirm that your account has been successfully
                deleted. All your personal data has been removed from our
                systems.
              </Text>
              <Text className='text-gray-800 mb-4'>
                We&apos;re sorry to see you leave and hope that your time with
                us was valuable. If you ever decide to return, you&apos;ll
                always be welcome to create a new account.
              </Text>
              <Text className='text-gray-800 mb-4'>
                If you didn&apos;t request this deletion, please contact our
                support team immediately as this action cannot be undone.
              </Text>
              <Hr className='border-gray-200 my-4' />
              <Text className='text-gray-600 text-sm'>
                Thank you for being a part of our community. We wish you all the
                best!
              </Text>
            </Section>
            <Section className='border-t border-gray-200 pt-6'>
              <Text className='text-gray-500 text-sm text-center'>
                © {new Date().getFullYear()} Prima Wrap. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
