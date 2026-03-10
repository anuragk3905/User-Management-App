import { useState } from 'react'
import {useForm} from 'react-hook-form'
import { useNavigate } from 'react-router'

function AddUser() {
    const {register, handleSubmit, formState: {errors}} = useForm()
    let [error, setError] = useState(null)
    let [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const onUserCreate = async(newUser)=>{
        setLoading(true)

        // make HTTP POST req to create new user
        try{
            let res = await fetch("http://localhost:3000/user-api/users", {
                method: "POST",
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify(newUser)
            })
            if(res.status===201){
                // user created, it should navigate to UsersList component
                navigate('/users-list')
            }else{
                throw new Error("error occurred")
            }
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