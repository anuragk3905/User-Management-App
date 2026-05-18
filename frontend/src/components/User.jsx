import { useLocation } from 'react-router'

function User() {
  let {state} = useLocation()

  return (
    <div className='max-w-3xl mx-auto p-10'>
      <h1 className='text-5xl text-gray-600 mb-8'>User Details</h1>
      <div className='space-y-4 text-2xl'>
        <p><strong>Name:</strong> {state?.user?.name || 'N/A'}</p>
        <p><strong>Email:</strong> {state?.user?.email || 'N/A'}</p>
        <p><strong>Date of Birth:</strong> {state?.user?.dateOfBirth || 'N/A'}</p>
        <p><strong>Mobile Number:</strong> {state?.user?.mobileNumber || 'N/A'}</p>
      </div>
    </div>
  )
}

export default User
