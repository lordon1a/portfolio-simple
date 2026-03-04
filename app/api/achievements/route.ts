import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const dataPath = path.join(process.cwd(), 'data', 'achievements.json')

export async function GET() {
  try {
    const data = fs.readFileSync(dataPath, 'utf-8')
    const items = JSON.parse(data)
    return NextResponse.json(items)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load achievements' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const newItem = await request.json()
    const data = fs.readFileSync(dataPath, 'utf-8')
    const items = JSON.parse(data)
    
    items.push(newItem)
    fs.writeFileSync(dataPath, JSON.stringify(items, null, 2))
    
    return NextResponse.json({ success: true, item: newItem })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add achievement' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const updatedItem = await request.json()
    const data = fs.readFileSync(dataPath, 'utf-8')
    let items = JSON.parse(data)
    
    items = items.map((item: any) => 
      item.id === updatedItem.id ? updatedItem : item
    )
    
    fs.writeFileSync(dataPath, JSON.stringify(items, null, 2))
    
    return NextResponse.json({ success: true, item: updatedItem })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update achievement' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    const data = fs.readFileSync(dataPath, 'utf-8')
    let items = JSON.parse(data)
    
    items = items.filter((item: any) => item.id !== id)
    
    fs.writeFileSync(dataPath, JSON.stringify(items, null, 2))
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete achievement' }, { status: 500 })
  }
}
