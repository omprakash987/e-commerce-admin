 
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


const JWT_SECRET = process.env.JWT_SECRET;


const prisma = new PrismaClient(); 

export async function POST(req:NextRequest,res:NextResponse){
try{
    const { name, email, password } = await req.json();

    if(!name || !email|| !password){
        return NextResponse.json({
            message:"not name email password"
        },{status:404})
    }

    const exitedUser =await prisma.user.findUnique({
        where:{email}
    })
    if(exitedUser){
        return NextResponse.json({
            message:"user already exist"
        },{status:200})
    }

    const hashedPassword = await bcrypt.hash(password,10)
    const user = await prisma.user.create({
        data:{
            name,email,password:hashedPassword,role:'CUSTOMER',

        }


    }); 

    await prisma.profile.create({
        data: {
          userId: user.id,
        },
      });

      const { password: _, ...userWithoutPassword } = user;
      const token = jwt.sign(
        { 
          id: user.id,
          email: user.email,
          role: user.role
        },
        JWT_SECRET as string,
        { expiresIn: '1d' }
      );
     const response =  NextResponse.json({
        message: 'User created successfully',
        user: userWithoutPassword,
        token:token,
      });
      response.cookies.set({
        name:"token",
        value:token,
        httpOnly:true,
        secure:process.env.NODE_ENV !== 'development',
        sameSite:"strict",
        maxAge:3600,
        path:"/"
      })
      return response
      
}catch(error){

    console.log("error" , error)
    return NextResponse.json({
        message:"error while processing"
        
    },{status:500})

}

}; 
