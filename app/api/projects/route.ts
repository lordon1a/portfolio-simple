import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { checkAuth } from '../../../lib/auth-check'
import { checkRateLimit } from '../../../lib/rate-limit'
import { sanitizeInput, validateId } from '../../../lib/sanitize'

const dataPath = path.join(process.cwd(), 'data', 'projects.json')

export async function GET(request: Request) {
  // Rate limiting for GET requests (DDoS protection)
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
  if (!checkRateLimit(`get-${ip}`, 30, 60000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  try {
    const data = fs.readFileSync(dataPath, 'utf-8')
    const projects = JSON.parse(data)
    return NextResponse.json(projects)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load projects' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  // Rate limiting FIRST (before auth check)
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
  if (!checkRateLimit(`post-${ip}`, 10, 60000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  // Auth check
  const authResult = await checkAuth()
  if (!authResult.authorized) {
    return NextResponse.json({ error: authResult.error }, { status: 401 })
  }

  try {
    const newProject = await request.json()
    
    // Validate and sanitize input
    if (!newProject.id || !validateId(newProject.id)) {
      return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 })
    }

    const sanitized = sanitizeInput(newProject)
    
    const data = fs.readFileSync(dataPath, 'utf-8')
    const projects = JSON.parse(data)
    
    // Check for duplicate ID
    if (projects.some((p: any) => p.id === sanitized.id)) {
      return NextResponse.json({ error: 'Project ID already exists' }, { status: 400 })
    }
    
    projects.push(sanitized)
    fs.writeFileSync(dataPath, JSON.stringify(projects, null, 2))
    
    return NextResponse.json({ success: true, project: sanitized })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add project' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  // Rate limiting FIRST
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
  if (!checkRateLimit(`put-${ip}`, 10, 60000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  // Auth check
  const authResult = await checkAuth()
  if (!authResult.authorized) {
    return NextResponse.json({ error: authResult.error }, { status: 401 })
  }

  try {
    const updatedProject = await request.json()
    
    // Validate and sanitize input
    if (!updatedProject.id || !validateId(updatedProject.id)) {
      return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 })
    }

    const sanitized = sanitizeInput(updatedProject)
    
    const data = fs.readFileSync(dataPath, 'utf-8')
    let projects = JSON.parse(data)
    
    // Check if project exists
    const exists = projects.some((p: any) => p.id === sanitized.id)
    if (!exists) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
    
    projects = projects.map((p: any) => 
      p.id === sanitized.id ? sanitized : p
    )
    
    fs.writeFileSync(dataPath, JSON.stringify(projects, null, 2))
    
    return NextResponse.json({ success: true, project: sanitized })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  // Rate limiting FIRST
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
  if (!checkRateLimit(`delete-${ip}`, 10, 60000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  // Auth check
  const authResult = await checkAuth()
  if (!authResult.authorized) {
    return NextResponse.json({ error: authResult.error }, { status: 401 })
  }

  try {
    const { id } = await request.json()
    
    // Validate input
    if (!id || !validateId(id)) {
      return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 })
    }
    
    const data = fs.readFileSync(dataPath, 'utf-8')
    let projects = JSON.parse(data)
    
    const initialLength = projects.length
    projects = projects.filter((p: any) => p.id !== id)
    
    if (projects.length === initialLength) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
    
    fs.writeFileSync(dataPath, JSON.stringify(projects, null, 2))
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
  }
}
