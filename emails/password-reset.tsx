import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from '@react-email/components'
import { SENDER_NAME } from '@/lib/constants'

interface PasswordResetEmailProps {
  resetUrl: string
  name: string
}

export default function PasswordResetEmail({
  resetUrl,
  name,
}: PasswordResetEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your {SENDER_NAME} password</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Reset your password</Heading>
          <Text style={text}>Hi {name},</Text>
          <Text style={text}>
            Someone requested a password reset for your account. If this was
            you, click the link below to reset your password. If you didn't
            request this, you can safely ignore this email.
          </Text>
          <Link style={button} href={resetUrl}>
            Reset Password
          </Link>
          <Text style={text}>
            This link will expire in 1 hour for security reasons.
          </Text>
          <Text style={footer}>
            If you're having trouble clicking the button, copy and paste this
            URL into your web browser: {resetUrl}
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '560px',
}

const h1 = {
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '1.25',
  marginBottom: '24px',
  color: '#484848',
}

const text = {
  fontSize: '16px',
  lineHeight: '1.5',
  margin: '16px 0',
  color: '#484848',
}

const button = {
  backgroundColor: '#000000',
  borderRadius: '4px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: '600',
  lineHeight: '1.5',
  padding: '12px 24px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  marginBottom: '16px',
}

const footer = {
  fontSize: '12px',
  lineHeight: '1.5',
  margin: '16px 0',
  color: '#777777',
}
