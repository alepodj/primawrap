import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
  Link,
} from '@react-email/components'

type VerifyEmailProps = {
  verificationUrl: string
  name: string
}

export default function VerifyEmail({
  verificationUrl,
  name,
}: VerifyEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Verify your email address for Prima Wrap</Preview>
      <Tailwind>
        <Body className='bg-gray-50 font-sans'>
          <Container className='mx-auto py-8 px-4 max-w-[600px]'>
            <Section className='bg-white rounded-lg shadow-lg p-8'>
              <Heading className='text-3xl font-bold text-center text-gray-800 mb-6'>
                Welcome to Prima Wrap!
              </Heading>
              <Section className='mb-8'>
                <Text className='text-gray-700 text-lg mb-4'>Hi {name},</Text>
                <Text className='text-gray-700 text-lg mb-6'>
                  Thank you for signing up! To get started with your Prima Wrap
                  account, please verify your email address by clicking the
                  button below:
                </Text>
                <Button
                  className='bg-blue-600 text-white rounded-lg px-8 py-4 font-semibold text-lg text-center block w-75 hover:bg-blue-700 transition-colors duration-200'
                  href={verificationUrl}
                >
                  Verify Email Address
                </Button>
              </Section>
              <Section className='border-t border-gray-200 pt-6'>
                <Text className='text-gray-600 mb-4'>
                  For security reasons, this verification link will expire in 1
                  hour.
                </Text>
                <Text className='text-gray-600 mb-6'>
                  If you didn't create an account with Prima Wrap, you can
                  safely ignore this email.
                </Text>
                <Text className='text-gray-500 text-sm'>
                  Having trouble with the button? Copy and paste this link into
                  your browser:
                  <br />
                  <Link
                    href={verificationUrl}
                    className='text-blue-600 break-all hover:underline mt-2 inline-block'
                  >
                    {verificationUrl}
                  </Link>
                </Text>
              </Section>
              <Section className='border-t border-gray-200 mt-8 pt-6'>
                <Text className='text-gray-500 text-sm text-center'>
                  © {new Date().getFullYear()} Prima Wrap. All rights reserved.
                </Text>
              </Section>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
