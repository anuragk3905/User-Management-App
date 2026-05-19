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

  const parseError = async (res) => {
    const contentType = res.headers.get('content-type') || ''
    const text = await res.text()
    if (contentType.includes('application/json')) {
      try {
        const json = JSON.parse(text)
        return json.message || JSON.error || JSON.stringify(json)
      } catch {
        return text
      }
    }
    return text || `Request failed with ${res.status}`
  }

  const onUserUpdate = async (updatedUser) => {
    setLoading(true)
    setError(null)
    try {
      if (!API) throw new Error('Backend API URL is not configured.')
      const payload = {
        name: updatedUser.name?.trim(),
        email: updatedUser.email?.trim(),
        dateOfBirth: updatedUser.dateOfBirth,
        mobileNumber: updatedUser.mobileNumber?.trim()
      }
      let res = await fetch(`${API}/user-api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      if (!res.ok) {
        const message = await parseError(res)
        throw new Error(message)
      }
      navigate('/users-list')
    } catch (err) {
      setError(err)
    } finally {
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
        <input
          type="text"
          {...register('name', {
            required: 'Name is required',
            minLength: { value: 3, message: 'Name must be at least 3 characters' }
          })}
          className='mb-2 w-full border text-2xl'
          placeholder='Name'
        />
        {errors.name && <p className='text-left text-red-500 mb-3'>{errors.name.message}</p>}

        <input
          type="email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Enter a valid email address'
            }
          })}
          className='mb-2 w-full border text-2xl'
          placeholder='Email'
        />
        {errors.email && <p className='text-left text-red-500 mb-3'>{errors.email.message}</p>}

        <input
          type="date"
          {...register('dateOfBirth', {
            required: 'Date of birth is required'
          })}
          className='mb-2 w-full border text-2xl'
        />
        {errors.dateOfBirth && <p className='text-left text-red-500 mb-3'>{errors.dateOfBirth.message}</p>}

        <input
          type="tel"
          inputMode='numeric'
          maxLength={10}
          {...register('mobileNumber', {
            required: 'Mobile number is required',
            pattern: {
              value: /^[0-9]{10}$/,
              message: 'Mobile number must be exactly 10 digits'
            }
          })}
          className='mb-2 w-full border text-2xl'
          placeholder='Mobile Number'
        />
        {errors.mobileNumber && <p className='text-left text-red-500 mb-3'>{errors.mobileNumber.message}</p>}

        <button type="submit" className='p-2 bg-cyan-400 text-white rounded'>Update</button>
      </form>
    </div>
  )
}

export default EditUser
