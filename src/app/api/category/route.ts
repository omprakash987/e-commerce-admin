// File: src/app/api/categories/route.ts
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name } = body

    if (!name) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 })
    }

    const category = await prisma.category.create({
      data: { name }
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error: any) {
    console.error('Error creating category:', error)
    return NextResponse.json({ error: 'Error creating category', details: error.message }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}


export async function GET(request:Request){
    try{
        const categories = await prisma.category.findMany(); 
        return NextResponse.json(categories,{status:200})
    }catch(error:any){
return NextResponse.json({
    message:"error fetching categories"
},{status:500})
    }
}