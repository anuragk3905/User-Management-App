import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'
const API = import.meta.env.VITE_API_URL?.trim().replace(/\/$/, '') || 'http://localhost:3000';

function User() {
  let {state} = useLocation()
  let navigate = useNavigate()
  let { id } = useParams()
  let [user, setUser] = useState(state?.user || null)
  let [loading, setLoading] = useState(!state?.user)
  let [error, setError] = useState(null)

  useEffect(()=>{
    if(user) return
    if(!id) {
      if (state?.user) {
        setUser(state.user)
        setLoading(false)
        return
      }
      setError(new Error('User ID is missing'))
      setLoading(false)
      return
    }
    const fetchUser = async () => {
      setLoading(true)
      try{
        if(!API) throw new Error("Backend API URL is not configured.")
        let res = await fetch(`${API}/user-api/users/${id}`)
        if(!res.ok){
          const text = await res.text()
          throw new Error(text || `Request failed with ${res.status}`)
        }
        let resObj = await res.json();
        setUser(resObj.payload)
      }catch(err){
        setError(err)
      }finally{
        setLoading(false)
      }
    }
    fetchUser()
  },[id, user, state])

  const handleDelete = async () => {
    if(!API) return
    setLoading(true)
    try{
      let res = await fetch(`${API}/user-api/users/${id}`, { method: 'DELETE' })
      if(!res.ok){
        const text = await res.text()
        throw new Error(text || `Request failed with ${res.status}`)
      }
      navigate('/users-list')
    }catch(err){
      setError(err)
      setLoading(false)
    }
  }

  const handleRestore = async () => {
    if(!API) return
    setLoading(true)
    try{
      let res = await fetch(`${API}/user-api/users/${id}/restore`, { method: 'PATCH' })
      if(!res.ok){
        const text = await res.text()
        throw new Error(text || `Request failed with ${res.status}`)
      }
      let resObj = await res.json()
      setUser(resObj.payload)
      setLoading(false)
    }catch(err){
      setError(err)
      setLoading(false)
    }
  }

  const handleEdit = () => {
    navigate(`/edit-user/${id}`)
  }

  if(loading){
    return <p className='text-center text-orange-400 text-3xl'>Loading...</p>
  }
  if(error){
    return <p className='text-center text-red-400 text-3xl'>{error.message}</p>
  }
  if(!user){
    return <p className='text-center text-red-400 text-3xl'>User not found</p>
  }

  const statusText = user.status ? 'Active' : 'Inactive'
  const statusClass = user.status ? 'text-green-600' : 'text-red-600'
  const dobText = user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'N/A'

  return (
    <div className='max-w-3xl mx-auto p-10'>
      <h1 className='text-5xl text-gray-600 mb-8'>User Details</h1>
      <div className='space-y-4 text-2xl'>
        <p><strong>Name:</strong> {user.name || 'N/A'}</p>
        <p><strong>Email:</strong> {user.email || 'N/A'}</p>
        <p><strong>Date of Birth:</strong> {dobText}</p>
        <p><strong>Mobile Number:</strong> {user.mobileNumber || 'N/A'}</p>
        <p className={`text-2xl font-semibold ${statusClass}`}><strong>Status:</strong> {statusText}</p>
      </div>
      <div className='mt-8 flex gap-4'>
        <button className='px-4 py-2 bg-cyan-400 text-white rounded' onClick={handleEdit}>Edit</button>
        {user.status ? (
          <button className='px-4 py-2 bg-red-500 text-white rounded' onClick={handleDelete}>Delete</button>
        ) : (
          <button className='px-4 py-2 bg-green-500 text-white rounded' onClick={handleRestore}>Restore</button>
        )}
      </div>
    </div>
  )
}

export default User
