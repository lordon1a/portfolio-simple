import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { checkAuth } from '../../../lib/auth-check'
import { checkRateLimit } from '../../../lib/rate-limit'
import { sanitizeInput, validateId } from '../../../lib/sanitize'

const dataPath = path.join(process.cwd(), 'data', 'experience.json')

export async function GET(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
  if (!checkRateLimit(`get-experience-${ip}`, 30, 60000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  try {
    const data = fs.readFileSync(dataPath, 'utf-8')
    const items = JSON.parse(data)
    return NextResponse.json(items)
  } catch {
    return NextResponse.json({ error: 'Failed to load experience' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
  if (!checkRateLimit(`post-experience-${ip}`, 10, 60000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const authResult = await checkAuth()
  if (!authResult.authorized) {
    return NextResponse.json({ error: authResult.error }, { status: 401 })
  }

  try {
    const newItem = await request.json()

    if (!newItem.id || !validateId(newItem.id)) {
      return NextResponse.json({ error: 'Invalid experience ID' }, { status: 400 })
    }

    const sanitized = sanitizeInput(newItem)
    const data = fs.readFileSync(dataPath, 'utf-8')
    const items = JSON.parse(data)

    if (items.some((item: any) => item.id === sanitized.id)) {
      return NextResponse.json({ error: 'Experience ID already exists' }, { status: 400 })
    }

    items.push(sanitized)
    fs.writeFileSync(dataPath, JSON.stringify(items, null, 2))

    return NextResponse.json({ success: true, item: sanitized })
  } catch {
    return NextResponse.json({ error: 'Failed to add experience' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
  if (!checkRateLimit(`put-experience-${ip}`, 10, 60000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const authResult = await checkAuth()
  if (!authResult.authorized) {
    return NextResponse.json({ error: authResult.error }, { status: 401 })
  }

  try {
    const updatedItem = await request.json()

    if (!updatedItem.id || !validateId(updatedItem.id)) {
      return NextResponse.json({ error: 'Invalid experience ID' }, { status: 400 })
    }

    const sanitized = sanitizeInput(updatedItem)
    const data = fs.readFileSync(dataPath, 'utf-8')
    let items = JSON.parse(data)

    const exists = items.some((item: any) => item.id === sanitized.id)
    if (!exists) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 })
    }

    items = items.map((item: any) => 
      item.id === sanitized.id ? sanitized : item
    )

    fs.writeFileSync(dataPath, JSON.stringify(items, null, 2))

    return NextResponse.json({ success: true, item: sanitized })
  } catch {
    return NextResponse.json({ error: 'Failed to update experience' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
  if (!checkRateLimit(`delete-experience-${ip}`, 10, 60000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const authResult = await checkAuth()
  if (!authResult.authorized) {
    return NextResponse.json({ error: authResult.error }, { status: 401 })
  }

  try {
    const { id } = await request.json()

    if (!id || !validateId(id)) {
      return NextResponse.json({ error: 'Invalid experience ID' }, { status: 400 })
    }

    const data = fs.readFileSync(dataPath, 'utf-8')
    let items = JSON.parse(data)

    const initialLength = items.length
    items = items.filter((item: any) => item.id !== id)

    if (items.length === initialLength) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 })
    }

    fs.writeFileSync(dataPath, JSON.stringify(items, null, 2))

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete experience' }, { status: 500 })
  }
}
