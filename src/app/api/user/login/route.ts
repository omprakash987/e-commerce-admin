

import bcrypt from "bcrypt"; 
import jwt from "jsonwebtoken"; 

import { PrismaClient } from "@prisma/client";
import { NextRequest,NextResponse } from "next/server";



const prisma = new PrismaClient(); 
const JWT_SECRET = process.env.JWT_SECRET; 

export async function POST(req:NextRequest,res:NextResponse){

  try {
    const {email,password} = await req.json(); 

    if(!email || !password){
        return NextResponse.json({
            message:"not email or password",
        },{status:404})
    }

    const user = await prisma.user.findUnique({
        where:{email}
    })
    if(!user){
        return NextResponse.json({
            message:"user not found",

        },{status:404})
    }

    const matchPassword = await bcrypt.compare(password,user.password)
    if(!matchPassword){
        return NextResponse.json({
            message:"password not match",
        },{status:404})
    }

    const token = jwt.sign({
        id:user.id,
        email:user.email,
        role:user.role,

    },JWT_SECRET as string,{expiresIn:"1h"}); 

    const {password:_,...userWithoutPassword} = user; 

 const response = NextResponse.json({
        message:"login success",
        user:userWithoutPassword,
        token:token,
    },{status:200})

    response.cookies.set({
        name: 'token',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development', // Use secure in production
        sameSite: 'strict',
        maxAge: 3600, // 1 hour in seconds
        path: '/',
      })
      return response

    
  } catch (error) {
    console.log("error",error)
    return NextResponse.json({
        message:"login failed",
    },{status:500})
    

  }



}
