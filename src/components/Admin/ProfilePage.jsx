import React from 'react'

function ProfilePage() {
    // I will be getting {item} as the prop
  return (
    <div className='flex flex-row'>
        <div className='h-96 w-48 border-2 border-gray-950'>
            <p>Profile Photo</p>
        </div>
        <div className='flex flex-col h-96 w-48 border-2 border-gray-950'>
        <p>Organiser Id</p>
        <p>Name: </p>
        <p>Email: </p>
        <p>Phone No: </p>
        <p>Office Address : </p>
        </div>
    </div>
  )
}

export default ProfilePage