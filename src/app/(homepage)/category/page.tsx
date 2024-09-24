"use client"


import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const Categories = () => {
    const router = useRouter(); 
    const [name, setName]  = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
    const [error,setError] = useState("")
    const [category,setCategory] = useState([]); 


    useEffect(()=>{
const fetchCategory = async()=>{
    try {
        const response = await axios.get("/api/category"); 
        setCategory(response.data); 
        console.log("category ", response.data)

    } catch (error) {
        console.log("error ", error); 

    }
}
fetchCategory(); 
    },[])


    const handleSubmit = async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()

        try {
            const response = await axios.post("/api/category",{
                name
            })
            if(response.status === 200){
                setName("")
                setLoading(false)
                alert("category added successfully")
                router.push("/")

            }
            
        } catch (error) {
            console.log("error ", error )
            setError("error adding category")

        }
    }


  return (
   <div className=' flex items-center justify-center flex-col'>
    create new category
    {error && <p style={{color:"red"}}>{error}</p> }


    <form  onSubmit={handleSubmit}>
        <div>
            <label>category name</label>
            <input type="text"
            name='name'
            value={name}
            onChange={(e)=>setName(e.target.value)}
            required
            
            />
            <button className='cursor-pointer' type='submit'>{loading ? "loading...":"add category"}</button>
        </div>
    </form>

    <div>
        <h2>category List</h2>
        {category.length>0 ? (
            <ul>
          {category.map((categories: any) => (
            <li key={categories.id}>{categories.name}</li>
          ))}
        </ul>
    ):( <p>No categories found.</p>)}
    </div>
   </div>
  )
}

export default Categories