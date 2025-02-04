import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import path from 'path'
import fs from 'fs'

export async function GET() {
  return NextResponse.json({ enabled: process.env.MAINTENANCE_MODE === 'true' })
}

export async function POST(req: Request) {
  const session = await auth()

  if (!session || session.user.role !== 'Admin') {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const { enabled } = await req.json()

  // In a production environment, you would use a service like Vercel to update environment variables
  // For development, you can update the .env file directly
  if (process.env.NODE_ENV === 'development') {
    const envPath = path.resolve(process.cwd(), '.env.local')
    const envContent = fs.readFileSync(envPath, 'utf-8')

    const updatedContent = envContent.replace(
      /^MAINTENANCE_MODE=.*$/m,
      `MAINTENANCE_MODE=${enabled}`
    )

    fs.writeFileSync(envPath, updatedContent)
  }

  process.env.MAINTENANCE_MODE = enabled.toString()

  return NextResponse.json({ success: true })
}
