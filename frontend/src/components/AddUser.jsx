import { useState } from 'react'
import {useForm} from 'react-hook-form'
import { useNavigate } from 'react-router'
const API = import.meta.env.VITE_API_URL?.trim().replace(/\/$/, '');

function AddUser() {
    const {register, handleSubmit, formState: {errors}} = useForm()
    let [error, setError] = useState(null)
    let [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const onUserCreate = async(newUser)=>{
        setLoading(true)

        // make HTTP POST req to create new user
        try{
            if(!API) throw new Error("Backend API URL is not configured.")
            let res = await fetch(`${API}/user-api/users`, {
                method: "POST",
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify(newUser)
            })
            if(!res.ok){
                const text = await res.text()
                throw new Error(text || `Request failed with ${res.status}`)
            }
            navigate('/users-list')
        }catch(err){
            setError(err)
        }finally{
            setLoading(false)
        }
    }

    if(loading){
        return <p className='text-center text-orange-400 text-3xl'>Loading...</p>
    }
    if(error){
        return <p className='text-center text-red-400 text-3xl'>{error.message}</p>
    }


  return (
    <div className='text-center'>
        <h1 className='text-5xl text-gray-600'>Add New User</h1>
        <form onSubmit={handleSubmit(onUserCreate)} className='max-w-96 mx-auto mt-16'>
            <input type="text" {...register("name")} className='mb-5 w-full border text-2xl' placeholder='Name' />
            <input type="text" {...register("email")} className='mb-5 w-full border text-2xl' placeholder='Email' />
            <input type="date" {...register("dateOfBirth")} className='mb-5 w-full border text-2xl' placeholder='' />
            <input type="number" {...register("mobileNumber")} className='mb-5 w-full border text-2xl' placeholder='Mobile Number' />
            <button type="submit" className='p-2 bg-cyan-400'>Sumbit </button>
        </form>
    </div>
  )
}

export default AddUser