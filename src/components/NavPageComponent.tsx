"use client"
import React from 'react'

import NavBar, { NavBarItems} from './NavBar'
import { Button } from './ui/button'
import {useSession,signOut} from 'next-auth/react'
import {useRouter} from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

const NavPageComponent = ({children}:{children:React.ReactNode}) => {
    const router = useRouter();
    const session = useSession();

    React.useEffect(()=>{
        if(!session.data || !session.data.user){
            router.replace('/sign-in')
        }
    },[session])
    
    

  return (
    <div className="min-h-screen flex justify-center ">
        <div className="p-2 w-full">
            <div>
                <NavBar>
                    <NavBarItems linkValue="sign-up" value='SignUp'></NavBarItems>
                    <Button onClick={()=>{
                        router.replace('/sign-out')
                    }}>LogOut</Button>
                    
                </NavBar>
            </div>
            <div>
                {children}
            </div>

        </div>

    </div>
  )
}

export default NavPageComponent