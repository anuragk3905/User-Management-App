import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

function UsersList() {

    let [users, setUsers] = useState([])
    let [error, setError] = useState(null)
    let [loading, setLoading] = useState(false)
    let navigate = useNavigate()

    useEffect(()=>{
        setLoading(true)
        async function getUsers(){
            try{
                let res = await fetch("http://localhost:3000/user-api/users",{
                    method: "GET"
                })
                if(res.status===200){
                    let resObj = await res.json();
                    setUsers(resObj.payload)
                }else{
                    throw new Error("error occurred")
                }
            }catch(err){
                setError(err)
            }finally{
                setLoading(false)
            }
        }
        getUsers()
    },[])

    if(loading){
            return <p className='text-center text-orange-400 text-3xl'>Loading...</p>
    }
    if(error){
        return <p className='text-center text-red-400 text-3xl'>{error.message}</p>
    }

    const gotoUser = (userObj) => {
        navigate('/user', { state: { user: userObj } })
    }

  return (
    <div> 
        <h1 className='text-5xl text-gray-600 mb-8'>List of Users</h1>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10'>
            {
                users?.map(userObj=><div key={userObj.email} className='p-10 shadow-2xl cursor-pointer' onClick={() => gotoUser(userObj)}>
                    <p className='text-3xl'>{userObj.name}</p>
                    <p className='text-2xl'>{userObj.email}</p>
                </div>)
            }
        </div>
    </div>
  )
}

export default UsersList