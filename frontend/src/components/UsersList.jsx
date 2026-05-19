import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
const API = import.meta.env.VITE_API_URL?.trim().replace(/\/$/, '') || 'http://localhost:3000';

function UsersList() {

    let [users, setUsers] = useState([])
    let [error, setError] = useState(null)
    let [loading, setLoading] = useState(false)
    let navigate = useNavigate()

    const fetchUsers = async () => {
        setLoading(true)
        try{
            if(!API) throw new Error("Backend API URL is not configured.")
            let res = await fetch(`${API}/user-api/users`,{
                method: "GET"
            })
            if(!res.ok){
                const text = await res.text()
                throw new Error(text || `Request failed with ${res.status}`)
            }
            let resObj = await res.json();
            setUsers(resObj.payload)
        }catch(err){
            setError(err)
        }finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        fetchUsers()
    },[])

    const gotoUser = (userObj) => {
        navigate(`/user/${userObj._id}`, { state: { user: userObj } })
    }

    if(loading){
        return <p className='text-center text-orange-400 text-3xl'>Loading...</p>
    }
    if(error){
        return <p className='text-center text-red-400 text-3xl'>{error.message}</p>
    }

  return (
    <div> 
        <h1 className='text-5xl text-gray-600 mb-8'>List of Users</h1>
        <p className='mb-6 text-lg text-slate-600'>Click a user card to view details and manage their status.</p>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10'>
            {
                users?.map(userObj=>{
                    const isActive = userObj.status !== false
                    const statusText = isActive ? 'Active' : 'Inactive'
                    const statusClass = isActive ? 'text-green-600' : 'text-red-600'
                    return (
                      <div key={userObj._id} className='p-8 shadow-2xl cursor-pointer border rounded-xl hover:shadow-xl' onClick={() => gotoUser(userObj)}>
                        <p className='text-3xl break-words'>{userObj.name}</p>
                        <p className='text-2xl mb-3 break-words overflow-hidden text-ellipsis'>{userObj.email}</p>
                        <p className={`text-xl font-semibold ${statusClass}`}>Status: {statusText}</p>
                      </div>
                    )
                })
            }
        </div>
    </div>
  )
}

export default UsersList