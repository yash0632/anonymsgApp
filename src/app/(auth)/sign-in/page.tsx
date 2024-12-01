'use client'
import React from 'react'
import {useSession,signIn,signOut} from 'next-auth/react'

const page = () => {
    const session = useSession();
    console.log(session);
  return (
    <div>
        
        Sign in page
        <button onClick={()=>signIn('credentials')}>signIn</button>
    </div>
  )
}

export default page