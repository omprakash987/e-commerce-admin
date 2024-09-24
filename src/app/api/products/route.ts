 
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    

    const { name, description, price, stock, categoryId, image } = body

    
    if (!name || !description || !price || !categoryId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

   
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    })

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 400 })
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: stock ? parseInt(stock) : 0,
        categoryId,
        image: image || null
      }
    })

    console.log('Product created successfully:', product)
    return NextResponse.json(product, { status: 201 })
  } catch (error:any) {
    console.error('Detailed error:', error)
    return NextResponse.json({ 
      error: 'Error creating product', 
      details: error.message,
      name: error.name,
    }, { status: 500 })
  }
  
}

export async function GET(){
  try {
    const product = await prisma.product.findMany(); 
    return NextResponse.json({
      messaage:"product fetched successfully",
      product:product

    },{status:200})

    
  } catch (error) {
console.log("error",error)
return NextResponse.json({
  error:"error fetching product"
},{status:500})

    
  }
}