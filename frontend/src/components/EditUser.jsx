import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router'

const API = import.meta.env.VITE_API_URL?.trim().replace(/\/$/, '') || 'http://localhost:3000';

function EditUser() {
  let { id } = useParams()
  let navigate = useNavigate()
  const { register, handleSubmit, setValue, formState: { errors } } = useForm()
  let [loading, setLoading] = useState(true)
  let [error, setError] = useState(null)

  useEffect(() => {
    if (!id) {
      setError(new Error('User ID is missing'))
      setLoading(false)
      return
    }

    const fetchUser = async () => {
      setLoading(true)
      try {
        if (!API) throw new Error('Backend API URL is not configured.')
        let res = await fetch(`${API}/user-api/users/${id}`)
        if (!res.ok) {
          const text = await res.text()
          throw new Error(text || `Request failed with ${res.status}`)
        }
        let resObj = await res.json()
        const user = resObj.payload
        setValue('name', user.name)
        setValue('email', user.email)
        setValue('dateOfBirth', user.dateOfBirth ? user.dateOfBirth.slice(0, 10) : '')
        setValue('mobileNumber', user.mobileNumber || '')
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [id, setValue])

  const onUserUpdate = async (updatedUser) => {
    setLoading(true)
    try {
      if (!API) throw new Error('Backend API URL is not configured.')
      let res = await fetch(`${API}/user-api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedUser)
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || `Request failed with ${res.status}`)
      }
      navigate('/users-list')
    } catch (err) {
      setError(err)
      setLoading(false)
    }
  }

  if (loading) {
    return <p className='text-center text-orange-400 text-3xl'>Loading...</p>
  }

  if (error) {
    return <p className='text-center text-red-400 text-3xl'>{error.message}</p>
  }

  return (
    <div className='text-center'>
      <h1 className='text-5xl text-gray-600'>Edit User</h1>
      <form onSubmit={handleSubmit(onUserUpdate)} className='max-w-96 mx-auto mt-16'>
        <input type="text" {...register('name')} className='mb-5 w-full border text-2xl' placeholder='Name' />
        <input type="text" {...register('email')} className='mb-5 w-full border text-2xl' placeholder='Email' />
        <input type="date" {...register('dateOfBirth')} className='mb-5 w-full border text-2xl' />
        <input type="number" {...register('mobileNumber')} className='mb-5 w-full border text-2xl' placeholder='Mobile Number' />
        <button type="submit" className='p-2 bg-cyan-400 text-white rounded'>Update</button>
      </form>
    </div>
  )
}

export default EditUser
